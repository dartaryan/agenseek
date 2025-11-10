// ============================================
// Bookmarks Service
// Story 11.9 - Bookmark and Helpful Feedback Functionality
// ============================================

import { supabase } from './supabase';

/**
 * Bookmark data structure
 */
export interface Bookmark {
  id: string;
  user_id: string;
  guide_slug: string;
  created_at: string;
}

/**
 * Get all bookmarks for a user
 */
export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('guide_bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }

  return data || [];
}

/**
 * Check if a guide is bookmarked by the user
 */
export async function isBookmarked(
  userId: string,
  guideSlug: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('guide_bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('guide_slug', guideSlug)
    .maybeSingle();

  if (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }

  return !!data;
}

/**
 * Toggle bookmark status (add or remove)
 * Returns new bookmark status (true = bookmarked, false = not bookmarked)
 */
export async function toggleBookmark(
  userId: string,
  guideSlug: string
): Promise<boolean> {
  const bookmarked = await isBookmarked(userId, guideSlug);

  if (bookmarked) {
    // Remove bookmark
    const { error } = await supabase
      .from('guide_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('guide_slug', guideSlug);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }

    return false; // Now not bookmarked
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('guide_bookmarks')
      .insert({
        user_id: userId,
        guide_slug: guideSlug,
      });

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }

    return true; // Now bookmarked
  }
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(
  userId: string,
  guideSlug: string
): Promise<void> {
  const { error } = await supabase
    .from('guide_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('guide_slug', guideSlug);

  if (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Get bookmark count for a user
 */
export async function getBookmarkCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('guide_bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting bookmark count:', error);
    return 0;
  }

  return count || 0;
}

