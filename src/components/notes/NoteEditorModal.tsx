/**
 * Note Editor Modal
 * Story 6.1: Rich text note editor with Tiptap
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
// Badge component not needed - using simple styled spans
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';
import { hebrewLocale } from '../../lib/locale/he';
import { getTiptapExtensions } from '../../lib/tiptap-config';
import { createNote, updateNote } from '../../lib/api/notes';
import { TiptapToolbar } from './TiptapToolbar';
import type { Database } from '../../types/database';
import {
  IconCheck,
  IconLoader2,
  IconAlertCircle,
  IconX,
} from '@tabler/icons-react';

type UserNote = Database['public']['Tables']['user_notes']['Row'];

interface NoteEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: UserNote | null;
  guideSlug?: string | null;
  onSaved?: (note: UserNote) => void;
}

export function NoteEditorModal({
  open,
  onOpenChange,
  note,
  guideSlug,
  onSaved,
}: NoteEditorModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const he = hebrewLocale.pages.notes;

  // Form state
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save timer
  const autoSaveTimerRef = useRef<number | null>(null);
  const noteIdRef = useRef<string | null>(note?.id || null);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: getTiptapExtensions(),
    content: (note?.content as unknown) || { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200',
      },
    },
    onUpdate: () => {
      setHasChanges(true);
      setSaveStatus('unsaved');
      scheduleAutoSave();
    },
  });

  // Initialize form when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTags(note.tags || []);
      setSelectedGuide(note.guide_slug);
      // Type cast for Tiptap content
      if (note.content) {
        editor?.commands.setContent(note.content as Record<string, unknown>);
      }
      noteIdRef.current = note.id;
      setHasChanges(false);
      setSaveStatus('saved');
    } else {
      // New note
      setTitle('');
      setTags([]);
      setSelectedGuide(guideSlug || null);
      editor?.commands.setContent({ type: 'doc', content: [{ type: 'paragraph' }] });
      noteIdRef.current = null;
      setHasChanges(false);
      setSaveStatus('saved');
    }
  }, [note, guideSlug, editor, open]);

  // Auto-save function
  const handleAutoSave = useCallback(async () => {
    if (!user || !editor || !title.trim()) return;

    try {
      setSaveStatus('saving');

      const content = editor.getJSON();

      if (noteIdRef.current) {
        // Update existing note
        const updatedNote = await updateNote(noteIdRef.current, {
          title: title.trim(),
          content,
          tags,
          guide_slug: selectedGuide,
        });

        setSaveStatus('saved');
        setHasChanges(false);

        if (onSaved) {
          onSaved(updatedNote);
        }
      } else {
        // Create new note
        const newNote = await createNote(user.id, {
          title: title.trim(),
          content,
          tags,
          guide_slug: selectedGuide,
        });

        noteIdRef.current = newNote.id;
        setSaveStatus('saved');
        setHasChanges(false);

        if (onSaved) {
          onSaved(newNote);
        }
      }
    } catch (error) {
      console.error('[NoteEditorModal] Auto-save error:', error);
      setSaveStatus('unsaved');
    }
  }, [user, editor, title, tags, selectedGuide, onSaved]);

  // Schedule auto-save (debounced to 10 seconds)
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    // Only auto-save if there are changes and user is authenticated
    if (!user || !hasChanges) return;

    // Schedule new auto-save
    autoSaveTimerRef.current = window.setTimeout(() => {
      handleAutoSave();
    }, 10000); // 10 seconds
  }, [user, hasChanges, handleAutoSave]);

  // Manual save and close
  const handleSaveAndClose = useCallback(async () => {
    if (!user || !editor || !title.trim()) {
      toast({
        title: he.notSaved,
        description: 'כותרת ההערה חובה',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const content = editor.getJSON();

      let savedNote: UserNote;

      if (noteIdRef.current) {
        // Update existing note
        savedNote = await updateNote(noteIdRef.current, {
          title: title.trim(),
          content,
          tags,
          guide_slug: selectedGuide,
        });

        toast({
          title: he.noteUpdated,
          description: 'ההערה שלך עודכנה בהצלחה',
        });
      } else {
        // Create new note
        savedNote = await createNote(user.id, {
          title: title.trim(),
          content,
          tags,
          guide_slug: selectedGuide,
        });

        toast({
          title: he.noteCreated,
          description: 'ההערה שלך נוצרה בהצלחה',
        });
      }

      if (onSaved) {
        onSaved(savedNote);
      }

      // Reset form and close
      setHasChanges(false);
      setSaveStatus('saved');
      onOpenChange(false);
    } catch (error) {
      console.error('[NoteEditorModal] Save error:', error);
      toast({
        title: 'שגיאה בשמירה',
        description: error instanceof Error ? error.message : 'נסה שוב',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, editor, title, tags, selectedGuide, he, toast, onSaved, onOpenChange]);

  // Handle tag input
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setHasChanges(true);
        setSaveStatus('unsaved');
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setHasChanges(true);
    setSaveStatus('unsaved');
  };

  // Save status indicator
  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <IconLoader2 className="w-4 h-4 animate-spin" />
            <span>{he.saving}</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600">
            <IconCheck className="w-4 h-4" />
            <span>{he.saved}</span>
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center gap-1.5 text-sm text-amber-600">
            <IconAlertCircle className="w-4 h-4" />
            <span>{he.notSaved}</span>
          </div>
        );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveAndClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleSaveAndClose]);

  if (!editor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {note ? he.editNote : he.newNote}
            </DialogTitle>
            <SaveStatusIndicator />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="note-title">{he.noteTitle}</Label>
            <Input
              id="note-title"
              type="text"
              placeholder={he.noteTitlePlaceholder}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasChanges(true);
                setSaveStatus('unsaved');
              }}
              maxLength={200}
              className="text-lg font-semibold bg-white"
            />
          </div>

          {/* Tiptap Editor with Toolbar */}
          <div className="space-y-2">
            <Label>{he.noteContent}</Label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <TiptapToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="note-tags">{he.tags}</Label>
            <div className="space-y-2">
              <Input
                id="note-tags"
                type="text"
                placeholder={he.tagsPlaceholder}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-white"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-emerald-900"
                      >
                        <IconX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Associated Guide */}
          {selectedGuide && (
            <div className="text-sm text-gray-600">
              {he.associatedGuide}: <span className="font-medium">{selectedGuide}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="bg-white"
          >
            {hebrewLocale.actions.cancel}
          </Button>
          <Button
            onClick={handleSaveAndClose}
            disabled={isSaving || !title.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                {he.saving}
              </>
            ) : (
              he.saveAndClose
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

