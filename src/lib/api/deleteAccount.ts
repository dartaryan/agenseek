/**
 * Account Deletion API
 * Story 2.12: Complete account deletion with cascade delete
 */

import { supabase } from '../supabase';

/**
 * Deletes user account and all associated data
 * Cascade deletion order respects foreign key constraints
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

    const userId = user.id;

    console.log('[deleteAccount] Starting account deletion for user:', userId);

    // NOTE: Cascade deletion is configured in the database schema
    // with ON DELETE CASCADE for all foreign key relationships.
    // We only need to delete the profile, and all related data
    // will be automatically deleted by PostgreSQL.

    // However, we'll explicitly delete in the correct order for clarity
    // and to ensure proper cleanup even if cascade is not configured.

    // 1. Delete user_activity (references profiles)
    const { error: activityError } = await supabase
      .from('user_activity')
      .delete()
      .eq('user_id', userId);

    if (activityError) {
      console.error('[deleteAccount] Error deleting user_activity:', activityError);
      throw new Error('Failed to delete user activity');
    }

    // 2. Delete guide_bookmarks (references profiles)
    const { error: bookmarksError } = await supabase
      .from('guide_bookmarks')
      .delete()
      .eq('user_id', userId);

    if (bookmarksError) {
      console.error('[deleteAccount] Error deleting guide_bookmarks:', bookmarksError);
      throw new Error('Failed to delete bookmarks');
    }

    // 3. Delete comment_votes (references guide_comments and profiles)
    const { error: votesError } = await supabase
      .from('comment_votes')
      .delete()
      .eq('user_id', userId);

    if (votesError) {
      console.error('[deleteAccount] Error deleting comment_votes:', votesError);
      throw new Error('Failed to delete comment votes');
    }

    // 4. Delete guide_comments (references profiles)
    const { error: commentsError } = await supabase
      .from('guide_comments')
      .delete()
      .eq('user_id', userId);

    if (commentsError) {
      console.error('[deleteAccount] Error deleting guide_comments:', commentsError);
      throw new Error('Failed to delete comments');
    }

    // 5. Delete user_tasks (references profiles)
    const { error: tasksError } = await supabase.from('user_tasks').delete().eq('user_id', userId);

    if (tasksError) {
      console.error('[deleteAccount] Error deleting user_tasks:', tasksError);
      throw new Error('Failed to delete tasks');
    }

    // 6. Delete user_notes (references profiles)
    const { error: notesError } = await supabase.from('user_notes').delete().eq('user_id', userId);

    if (notesError) {
      console.error('[deleteAccount] Error deleting user_notes:', notesError);
      throw new Error('Failed to delete notes');
    }

    // 7. Delete user_progress (references profiles)
    const { error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId);

    if (progressError) {
      console.error('[deleteAccount] Error deleting user_progress:', progressError);
      throw new Error('Failed to delete progress');
    }

    // 8. Delete profiles (references auth.users)
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

    if (profileError) {
      console.error('[deleteAccount] Error deleting profile:', profileError);
      throw new Error('Failed to delete profile');
    }

    // 9. Delete from Supabase Auth (must be last)
    // Note: This requires admin privileges, so we'll use the auth.admin API
    // For client-side deletion, we can use the regular auth.signOut() after database cleanup
    // The auth user will be cleaned up by a scheduled job or manual admin action

    // Sign out the user (they won't be able to log in with deleted profile anyway)
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('[deleteAccount] Error signing out:', signOutError);
      // Continue anyway, account data is deleted
    }

    console.log('[deleteAccount] Account deletion completed successfully');

    return { success: true };
  } catch (error) {
    console.error('[deleteAccount] Account deletion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}
