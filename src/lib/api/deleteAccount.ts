/**
 * Account Deletion API
 * Story 2.12: Complete account deletion with cascade delete
 * Story 11.1 Fix: Now properly deletes from auth.users using database function
 */

import { supabase } from '../supabase';

/**
 * Deletes user account and all associated data
 * Uses database function with SECURITY DEFINER to delete auth user
 * Story 11.1 Fix: Now properly deletes from auth.users
 *
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Call secure database function that:
    // 1. Deletes from profiles (CASCADE handles all related data)
    // 2. Deletes from auth.users (requires SECURITY DEFINER)
    const { data, error } = await supabase.rpc('delete_own_account' as any) as {
      data: { success: boolean; error?: string } | null;
      error: any
    };

    if (error) {
      console.error('[deleteAccount] RPC error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }

    // Check function result
    if (!data || !data.success) {
      const errorMessage = data?.error || 'Unknown error occurred';
      console.error('[deleteAccount] Function error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Success - user deleted from both profiles and auth.users
    // Cascade deletes handled automatically:
    // - user_progress
    // - user_notes
    // - user_tasks
    // - user_activity
    // - guide_comments
    // - comment_votes
    // - guide_bookmarks
    // - user_achievements
    // - notifications
    // - guide_votes

    // Note: No need to sign out manually - auth user is deleted
    // Session will be invalidated automatically

    return { success: true };
  } catch (error) {
    console.error('[deleteAccount] Account deletion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}
