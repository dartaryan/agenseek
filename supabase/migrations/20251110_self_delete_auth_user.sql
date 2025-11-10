-- ============================================
-- Migration: Enable Self-Service Auth User Deletion
-- Date: 2025-11-10
-- Story: 11.1 Fix - Self-service account deletion must delete auth user
-- ============================================

-- ============================================
-- FUNCTION: delete_own_account
-- Allows authenticated users to delete their own account
-- Including deletion from auth.users (requires SECURITY DEFINER)
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- Required to access auth.users
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  -- Get current authenticated user
  v_user_id := auth.uid();

  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Get user email for logging
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_user_id;

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
  --   - guide_votes
  DELETE FROM profiles WHERE id = v_user_id;

  -- Step 2: Delete from auth.users
  -- CRITICAL: This requires SECURITY DEFINER to work
  -- Regular RLS policies don't apply here
  DELETE FROM auth.users WHERE id = v_user_id;

  -- Log to server logs (optional - for audit trail)
  RAISE NOTICE 'User self-deleted account: % (%)', v_user_email, v_user_id;

  RETURN jsonb_build_object(
    'success', true
  );

EXCEPTION WHEN OTHERS THEN
  -- Log error
  RAISE WARNING 'Error in delete_own_account for user %: %', v_user_id, SQLERRM;

  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- ============================================
-- GRANT EXECUTE to authenticated users
-- ============================================

GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION public.delete_own_account IS 'Allows authenticated users to delete their own account including auth credentials. Uses SECURITY DEFINER to access auth.users table.';

