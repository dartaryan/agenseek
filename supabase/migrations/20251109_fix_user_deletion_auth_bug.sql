-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration: Fix User Deletion Authentication Bug
-- Date: November 9, 2025
-- Story: 11.1 - Critical Bug Fix
-- ============================================

-- PROBLEM: When admins delete users, the user is removed from 'profiles'
-- but NOT from 'auth.users', allowing deleted users to still log in.
--
-- SOLUTION: Create a secure database function (SECURITY DEFINER) that:
--   1. Verifies caller is an admin
--   2. Deletes user profile (CASCADE handles related data)
--   3. Deletes from auth.users (requires elevated privileges)
--   4. Logs the action for audit trail
--
-- This is secure because:
--   - Function runs with database owner privileges (SECURITY DEFINER)
--   - Admin check prevents unauthorized access
--   - Cannot expose service role key to client
--   - Audit logging tracks all deletions

-- ============================================
-- SECURE FUNCTION: Admin Delete User
-- ============================================

CREATE OR REPLACE FUNCTION admin_delete_user(
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_admin_id UUID;
  v_is_admin BOOLEAN;
  v_deleted_user_email TEXT;
  v_deleted_user_name TEXT;
BEGIN
  -- Get current user ID
  v_admin_id := auth.uid();

  -- Check if current user is null (not authenticated)
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Verify current user is an admin
  SELECT is_admin INTO v_is_admin
  FROM profiles
  WHERE id = v_admin_id;

  IF v_is_admin IS NOT TRUE THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Admin privileges required'
    );
  END IF;

  -- Prevent admin from deleting themselves
  IF v_admin_id = p_user_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot delete your own account'
    );
  END IF;

  -- Get user details before deletion (for audit log)
  SELECT email, display_name INTO v_deleted_user_email, v_deleted_user_name
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user exists
  IF v_deleted_user_email IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Step 1: Delete from profiles table
  -- This will CASCADE delete to all related tables:
  --   - user_progress
  --   - user_notes
  --   - user_tasks
  --   - user_activity
  --   - guide_comments
  --   - comment_votes
  --   - guide_bookmarks
  --   - user_achievements
  --   - notifications
  DELETE FROM profiles WHERE id = p_user_id;

  -- Step 2: Delete from auth.users
  -- CRITICAL: This requires SECURITY DEFINER to work
  -- Regular RLS policies don't apply here
  DELETE FROM auth.users WHERE id = p_user_id;

  -- Step 3: Log admin action for audit trail
  -- Note: We do this AFTER deletion since the user no longer exists
  INSERT INTO admin_action_log (
    admin_id,
    action_type,
    action_category,
    target_type,
    target_id,
    target_label,
    description,
    metadata
  ) VALUES (
    v_admin_id,
    'delete',
    'user_management',
    'user',
    p_user_id::TEXT,
    v_deleted_user_email,
    'Admin deleted user account',
    jsonb_build_object(
      'deleted_user_email', v_deleted_user_email,
      'deleted_user_name', v_deleted_user_name,
      'deletion_complete', true
    )
  );

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'message', 'User deleted successfully',
    'deleted_user_email', v_deleted_user_email
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return failure
    RAISE WARNING 'Error deleting user %: %', p_user_id, SQLERRM;
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Allow authenticated users to call this function
-- (admin check happens inside the function)
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION admin_delete_user(UUID) IS
'Securely delete a user from both profiles and auth.users tables.
Requires admin privileges. Cascades to all related user data.
Logs action to admin_action_log for audit trail.
Story 11.1 - Fix User Deletion Authentication Bug';

