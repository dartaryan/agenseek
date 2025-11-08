/**
 * Notes API - Database operations for user notes
 * Story 6.1: Create, read, update, delete note operations
 */

import { supabase } from '../supabase';
import type { Database } from '../../types/database';

type UserNote = Database['public']['Tables']['user_notes']['Row'];
type UserNoteInsert = Database['public']['Tables']['user_notes']['Insert'];
type UserNoteUpdate = Database['public']['Tables']['user_notes']['Update'];

export interface NoteFormData {
  title: string;
  content: Record<string, unknown>; // Tiptap JSON
  tags?: string[];
  guide_slug?: string | null;
}

/**
 * Create a new note
 */
export async function createNote(userId: string, data: NoteFormData): Promise<UserNote> {
  const noteData: UserNoteInsert = {
    user_id: userId,
    title: data.title,
    content: data.content as unknown as Database['public']['Tables']['user_notes']['Insert']['content'],
    tags: data.tags || [],
    guide_slug: data.guide_slug || null,
  };

  const { data: note, error } = await supabase.from('user_notes').insert(noteData).select().single();

  if (error) {
    console.error('[createNote] Error:', error);
    throw new Error(error.message);
  }

  if (!note) {
    throw new Error('Failed to create note');
  }

  return note;
}

/**
 * Get all notes for a user
 */
export async function getUserNotes(userId: string): Promise<UserNote[]> {
  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[getUserNotes] Error:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get a single note by ID
 */
export async function getNoteById(noteId: string): Promise<UserNote | null> {
  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('id', noteId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('[getNoteById] Error:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update a note
 */
export async function updateNote(
  noteId: string,
  data: Partial<NoteFormData>
): Promise<UserNote> {
  const updateData: UserNoteUpdate = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined)
    updateData.content = data.content as unknown as Database['public']['Tables']['user_notes']['Update']['content'];
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.guide_slug !== undefined) updateData.guide_slug = data.guide_slug;

  const { data: note, error } = await supabase
    .from('user_notes')
    .update(updateData)
    .eq('id', noteId)
    .select()
    .single();

  if (error) {
    console.error('[updateNote] Error:', error);
    throw new Error(error.message);
  }

  if (!note) {
    throw new Error('Failed to update note');
  }

  return note;
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase.from('user_notes').delete().eq('id', noteId);

  if (error) {
    console.error('[deleteNote] Error:', error);
    throw new Error(error.message);
  }
}

/**
 * Get notes by guide slug
 */
export async function getNotesByGuide(
  userId: string,
  guideSlug: string
): Promise<UserNote[]> {
  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('guide_slug', guideSlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getNotesByGuide] Error:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get all unique tags from user's notes
 */
export async function getUserNoteTags(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_notes')
    .select('tags')
    .eq('user_id', userId);

  if (error) {
    console.error('[getUserNoteTags] Error:', error);
    throw new Error(error.message);
  }

  if (!data) return [];

  // Flatten and deduplicate tags
  const allTags = data.flatMap((note) => note.tags || []);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.sort();
}

/**
 * Search notes by title and content
 */
export async function searchNotes(userId: string, query: string): Promise<UserNote[]> {
  if (!query.trim()) {
    return getUserNotes(userId);
  }

  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[searchNotes] Error:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get notes statistics for dashboard
 * Story 6.8: Build Task and Note Statistics Dashboard
 */
export interface NotesStatistics {
  totalCount: number;
  topTags: Array<{ tag: string; count: number }>;
  createdThisWeek: number;
  associatedGuidesCount: number;
}

export async function getNotesStatistics(userId: string): Promise<NotesStatistics> {
  // Get all notes for the user
  const { data: notes, error } = await supabase
    .from('user_notes')
    .select('tags, guide_slug, created_at')
    .eq('user_id', userId);

  if (error) {
    console.error('[getNotesStatistics] Error:', error);
    throw new Error(error.message);
  }

  if (!notes || notes.length === 0) {
    return {
      totalCount: 0,
      topTags: [],
      createdThisWeek: 0,
      associatedGuidesCount: 0,
    };
  }

  // Calculate total count
  const totalCount = notes.length;

  // Calculate tag frequencies
  const tagFrequency: Record<string, number> = {};
  notes.forEach((note) => {
    (note.tags || []).forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  // Get top 5 tags sorted by frequency
  const topTags = Object.entries(tagFrequency)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate notes created this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const createdThisWeek = notes.filter(
    (note) => new Date(note.created_at) >= oneWeekAgo
  ).length;

  // Count unique associated guides
  const uniqueGuides = new Set(
    notes.map((note) => note.guide_slug).filter((slug) => slug !== null)
  );
  const associatedGuidesCount = uniqueGuides.size;

  return {
    totalCount,
    topTags,
    createdThisWeek,
    associatedGuidesCount,
  };
}

