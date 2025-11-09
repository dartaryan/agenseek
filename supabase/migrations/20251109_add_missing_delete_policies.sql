-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration: Add Missing DELETE RLS Policies
-- Date: November 9, 2025
-- Story: 0.22 - Fix Account Deletion (Data Still Persists)
-- ============================================

-- PROBLEM: When users delete their accounts, some data persists
-- because RLS policies don't have DELETE permissions.
--
-- The deleteAccount() function tries to delete from:
--   1. user_activity       ❌ No DELETE policy
--   2. guide_bookmarks     ✅ Has DELETE policy
--   3. comment_votes       ✅ Has DELETE policy
--   4. guide_comments      ✅ Has DELETE policy
--   5. user_tasks          ✅ Has DELETE policy
--   6. user_notes          ✅ Has DELETE policy
--   7. user_progress       ❌ No DELETE policy
--   8. profiles            ❌ No DELETE policy
--   9. notifications       ❌ Not checked yet
--
-- SOLUTION: Add DELETE policies for missing tables

-- ============================================
-- USER_PROGRESS - Add DELETE Policy
-- ============================================

-- Users can delete own progress
CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- USER_ACTIVITY - Add DELETE Policy
-- ============================================

-- Users can delete own activity
CREATE POLICY "Users can delete own activity"
  ON user_activity FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PROFILES - Add DELETE Policy
-- ============================================

-- Users can delete own profile
-- CRITICAL: This is needed for account deletion
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- NOTIFICATIONS - Add DELETE Policy (if table exists)
-- ============================================

-- Check if notifications table exists and has RLS enabled
-- Note: notifications table uses 'recipient_id' not 'user_id'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'notifications'
  ) THEN
    -- Check if policy doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'notifications'
      AND policyname = 'Users can delete own notifications'
    ) THEN
      -- Users can delete own notifications
      EXECUTE 'CREATE POLICY "Users can delete own notifications"
        ON notifications FOR DELETE
        USING (auth.uid() = recipient_id)';
    END IF;
  END IF;
END $$;

-- ============================================
-- ADMIN_NOTIFICATIONS - Already has DELETE Policy
-- ============================================

-- Note: admin_notifications already has a DELETE policy:
-- "Admins can delete admin notifications" (created in 20241108_create_admin_notifications.sql)
-- No action needed here.

-- ============================================
-- USER_ACHIEVEMENTS - Add DELETE Policy (if table exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'user_achievements'
  ) THEN
    -- Users can delete own achievements
    EXECUTE 'CREATE POLICY "Users can delete own achievements"
      ON user_achievements FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- ADMIN_ACTION_LOG - Add DELETE Policy (if table exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'admin_action_log'
  ) THEN
    -- No one can delete admin action logs (audit trail)
    -- They should be archived, not deleted
    -- Keep this as a comment for documentation
    NULL;
  END IF;
END $$;

