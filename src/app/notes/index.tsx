/**
 * Notes Page - Story 6.1 & 6.2
 * Rich text note editor and notes library
 */

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import { useAuth } from '../../hooks/useAuth';
import { getUserNotes } from '../../lib/api/notes';
import { NoteEditorModal } from '../../components/notes/NoteEditorModal';
import { IconPlus, IconNote } from '@tabler/icons-react';
import type { Database } from '../../types/database';

type UserNote = Database['public']['Tables']['user_notes']['Row'];

export function NotesPage() {
  const { user } = useAuth();
  const he = hebrewLocale.pages.notes;

  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<UserNote | null>(null);

  // Load notes
  useEffect(() => {
    if (!user) return;

    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const userNotes = await getUserNotes(user.id);
        setNotes(userNotes);
      } catch (error) {
        console.error('[NotesPage] Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: UserNote) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleNoteSaved = (note: UserNote) => {
    // Update or add note to list
    setNotes((prev) => {
      const existing = prev.find((n) => n.id === note.id);
      if (existing) {
        return prev.map((n) => (n.id === note.id ? note : n));
      } else {
        return [note, ...prev];
      }
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{he.title}</h1>
            <p className="text-gray-600">{he.description}</p>
          </div>
          <Button
            onClick={handleNewNote}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <IconPlus className="w-5 h-5 mr-2" />
            {he.newNote}
          </Button>
        </div>

        {/* Notes List */}
        {isLoading ? (
          <Card className="p-8">
            <p className="text-center text-gray-500">טוען הערות...</p>
          </Card>
        ) : notes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <IconNote className="w-16 h-16 mx-auto text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{he.noNotes}</h3>
                <p className="text-gray-600 mt-1">{he.noNotesDescription}</p>
              </div>
              <Button
                onClick={handleNewNote}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <IconPlus className="w-5 h-5 mr-2" />
                {he.newNote}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEditNote(note)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {/* Extract plain text from Tiptap JSON */}
                  {typeof note.content === 'object' &&
                  note.content &&
                  'content' in note.content
                    ? 'תוכן ההערה...'
                    : ''}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(note.updated_at).toLocaleDateString('he-IL')}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Note Editor Modal */}
        <NoteEditorModal
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          note={selectedNote}
          onSaved={handleNoteSaved}
        />
      </div>
    </div>
  );
}
