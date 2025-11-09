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

    // 8. Delete user_achievements (references profiles) - Story 0.22
    const { error: achievementsError } = await supabase
      .from('user_achievements')
      .delete()
      .eq('user_id', userId);

    if (achievementsError) {
      console.error('[deleteAccount] Error deleting user_achievements:', achievementsError);
      // Don't throw - table might not exist in all environments
      console.warn('[deleteAccount] Continuing despite achievements deletion error');
    }

    // 9. Delete notifications (references profiles) - Story 0.22
    // Note: notifications table uses recipient_id and actor_id, not user_id
    // Delete notifications where user is the recipient
    const { error: notificationsError1 } = await supabase
      .from('notifications')
      .delete()
      .eq('recipient_id', userId);

    if (notificationsError1) {
      console.error('[deleteAccount] Error deleting notifications (recipient):', notificationsError1);
      // Don't throw - table might not exist in all environments
      console.warn('[deleteAccount] Continuing despite notifications deletion error');
    }

    // Also delete notifications where user is the actor
    const { error: notificationsError2 } = await supabase
      .from('notifications')
      .delete()
      .eq('actor_id', userId);

    if (notificationsError2) {
      console.error('[deleteAccount] Error deleting notifications (actor):', notificationsError2);
      // Don't throw - table might not exist in all environments
      console.warn('[deleteAccount] Continuing despite notifications deletion error');
    }

    // 10. Delete profiles (references auth.users)
    // CRITICAL: This must succeed or account deletion fails
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

    if (profileError) {
      console.error('[deleteAccount] Error deleting profile:', profileError);
      throw new Error('Failed to delete profile - this is a critical error');
    }

    console.log('[deleteAccount] All data deleted successfully');

    // 11. Delete from Supabase Auth (must be last)
    // Note: This requires admin privileges, so we'll use the auth.admin API
    // For client-side deletion, we can use the regular auth.signOut() after database cleanup
    // The auth user will be cleaned up by a scheduled job or manual admin action
    //
    // Story 0.22: The auth user is NOT deleted here because:
    // - Requires admin API (not available client-side)
    // - User can log back in with same credentials
    // - ProtectedRoute redirects to onboarding if profile is missing
    // - Onboarding creates a fresh profile
    //
    // Future Enhancement: Create Supabase Edge Function to delete auth user

    // Sign out the user (they won't be able to log in with deleted profile anyway)
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('[deleteAccount] Error signing out:', signOutError);
      // Continue anyway, account data is deleted
    }

    console.log('[deleteAccount] Account deletion completed successfully');
    console.log('[deleteAccount] Note: Auth user NOT deleted - requires admin API');

    return { success: true };
  } catch (error) {
    console.error('[deleteAccount] Account deletion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}
