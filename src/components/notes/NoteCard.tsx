/**
 * Note Card Component - Story 6.2
 * Displays a note card with inline editable title, content preview, tags, and actions
 */

import { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { hebrewLocale } from '../../lib/locale/he';
import { updateNote, deleteNote } from '../../lib/api/notes';
import { extractNotePreview, formatNoteDate } from '../../lib/utils/note-utils';
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconBook,
} from '@tabler/icons-react';
import type { Database } from '../../types/database';

type UserNote = Database['public']['Tables']['user_notes']['Row'];

interface NoteCardProps {
  note: UserNote;
  onEdit: (note: UserNote) => void;
  onDelete: (noteId: string) => void;
  guideTitle?: string;
}

export function NoteCard({ note, onEdit, onDelete, guideTitle }: NoteCardProps) {
  const { toast } = useToast();
  const he = hebrewLocale.pages.notes;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleTitleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (editedTitle.trim() === '') {
      toast({
        title: 'שגיאה',
        description: 'כותרת ההערה לא יכולה להיות ריקה',
        variant: 'destructive',
      });
      setEditedTitle(note.title);
      setIsEditingTitle(false);
      return;
    }

    if (editedTitle.trim() === note.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateNote(note.id, { title: editedTitle.trim() });
      toast({
        title: he.noteUpdated,
        description: 'כותרת ההערה עודכנה בהצלחה',
      });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('[NoteCard] Error updating title:', error);
      toast({
        title: 'שגיאה',
        description: 'שגיאה בעדכון כותרת ההערה',
        variant: 'destructive',
      });
      setEditedTitle(note.title);
      setIsEditingTitle(false);
    }
  };

  const handleTitleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTitle(note.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave(e as unknown as React.MouseEvent);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTitleCancel(e as unknown as React.MouseEvent);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(he.confirmDeleteMessage)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteNote(note.id);
      toast({
        title: he.noteDeleted,
        description: 'ההערה נמחקה בהצלחה',
      });
      onDelete(note.id);
    } catch (error) {
      console.error('[NoteCard] Error deleting note:', error);
      toast({
        title: 'שגיאה',
        description: 'שגיאה במחיקת ההערה',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const contentPreview = extractNotePreview(note.content, 120);

  return (
    <Card
      className={`p-5 hover:shadow-lg transition-all duration-200 cursor-pointer relative group ${
        isDeleting ? 'opacity-50' : ''
      }`}
      onClick={() => !isEditingTitle && !isDeleting && onEdit(note)}
    >
      {/* Title */}
      <div className="mb-3">
        {isEditingTitle ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Input
              ref={inputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTitleSave}
              className="text-emerald-600 hover:text-emerald-700"
            >
              <IconCheck className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTitleCancel}
              className="text-gray-600 hover:text-gray-700"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {note.title}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTitleEditStart}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-emerald-600"
            >
              <IconEdit className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4 min-h-[3.75rem]">
        {contentPreview}
      </p>

      {/* Guide Link */}
      {note.guide_slug && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 mb-3">
          <IconBook className="w-3.5 h-3.5" />
          <span className="truncate">
            {guideTitle || note.guide_slug}
          </span>
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-md"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Timestamp and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {formatNoteDate(note.updated_at)}
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <IconTrash className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

