/**
 * Notes Page - Story 6.2
 * Notes library with search, filters, and sorting
 */

import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { hebrewLocale } from '../../lib/locale/he';
import { useAuth } from '../../hooks/useAuth';
import { getUserNotes } from '../../lib/api/notes';
import { NoteEditorModal } from '../../components/notes/NoteEditorModal';
import { NoteCard } from '../../components/notes/NoteCard';
import { extractUniqueGuides, extractUniqueTags } from '../../lib/utils/note-utils';
import {
  IconPlus,
  IconNote,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { BrandedLoader } from '../../components/ui/branded-loader';
import type { Database } from '../../types/database';

type UserNote = Database['public']['Tables']['user_notes']['Row'];

// Sort options
type SortOption = 'recent' | 'created' | 'alphabetical' | 'guide';

export function NotesPage() {
  const { user } = useAuth();
  const he = hebrewLocale.pages.notes;

  // Data state
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guidesData, setGuidesData] = useState<Record<string, string>>({});

  // UI state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<UserNote | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Extract unique guides and tags for filters
  const uniqueGuides = useMemo(() => extractUniqueGuides(notes), [notes]);
  const uniqueTags = useMemo(() => extractUniqueTags(notes), [notes]);

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

  // Load guide titles
  useEffect(() => {
    const loadGuideTitles = async () => {
      try {
        const response = await fetch('/src/content/locale/he/guides/index.json');
        const guides = await response.json();
        const titlesMap: Record<string, string> = {};
        guides.forEach((guide: { id: string; title: string }) => {
          titlesMap[guide.id] = guide.title;
        });
        setGuidesData(titlesMap);
      } catch (error) {
        console.error('[NotesPage] Error loading guide titles:', error);
      }
    };

    loadGuideTitles();
  }, []);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by guide
    if (selectedGuide !== 'all') {
      filtered = filtered.filter((note) => note.guide_slug === selectedGuide);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter((note) => note.tags.includes(selectedTag));
    }

    // Sort notes
    const sorted = [...filtered];
    switch (sortBy) {
      case 'recent':
        sorted.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
      case 'created':
        sorted.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'he'));
        break;
      case 'guide':
        sorted.sort((a, b) => {
          const guideA = a.guide_slug || '';
          const guideB = b.guide_slug || '';
          return guideA.localeCompare(guideB);
        });
        break;
    }

    return sorted;
  }, [notes, searchQuery, selectedGuide, selectedTag, sortBy]);

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

  const handleNoteDeleted = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGuide('all');
    setSelectedTag('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedGuide !== 'all' || selectedTag !== 'all';

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900">{he.title}</h1>
            <p className="text-gray-600">
              {notes.length} {he.notesCount}
            </p>
          </div>
          <Button
            onClick={handleNewNote}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <IconPlus className="w-5 h-5 mr-2" />
            {he.newNote}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={he.searchNotes}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Filter by Guide */}
            <div>
              <Select value={selectedGuide} onValueChange={setSelectedGuide}>
                <SelectTrigger>
                  <SelectValue placeholder={he.filterByGuide} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המדריכים</SelectItem>
                  <SelectItem value="no-guide">ללא מדריך משוייך</SelectItem>
                  {uniqueGuides.map((slug) => (
                    <SelectItem key={slug} value={slug}>
                      {guidesData[slug] || slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Tag */}
            <div>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder={he.filterByTags} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התגיות</SelectItem>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{he.sortByRecent}</SelectItem>
                  <SelectItem value="created">{he.sortByCreated}</SelectItem>
                  <SelectItem value="alphabetical">{he.sortByAlphabetical}</SelectItem>
                  <SelectItem value="guide">{he.sortByGuide}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredAndSortedNotes.length} מתוך {notes.length} הערות
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                <IconX className="w-4 h-4 mr-1" />
                נקה מסננים
              </Button>
            </div>
          )}
        </Card>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh] w-full -mt-12">
            <BrandedLoader size="lg" />
          </div>
        ) : filteredAndSortedNotes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <IconNote className="w-16 h-16 mx-auto text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {notes.length === 0 ? he.noNotes : 'לא נמצאו הערות'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {notes.length === 0
                    ? he.noNotesDescription
                    : 'נסה לשנות את המסננים או החיפוש'}
                </p>
              </div>
              {notes.length === 0 && (
                <Button
                  onClick={handleNewNote}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <IconPlus className="w-5 h-5 mr-2" />
                  {he.newNote}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredAndSortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleNoteDeleted}
                guideTitle={note.guide_slug ? guidesData[note.guide_slug] : undefined}
              />
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
