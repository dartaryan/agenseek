-- ============================================
-- Migration: Create Admin Action Log System
-- Date: 2024-11-09
-- Story: 9.6 - Build Admin Action Log
-- ============================================

-- ============================================
-- TABLE: admin_action_log
-- Comprehensive audit log for all admin actions
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Admin who performed the action
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Action details
  action_type TEXT NOT NULL, -- 'user_deleted', 'user_edited', 'content_modified', 'content_flagged', 'settings_changed', 'data_exported', 'role_changed', 'profile_viewed', 'notification_sent', 'user_banned', 'user_unbanned', 'comment_deleted', 'guide_unpublished'
  action_category TEXT NOT NULL DEFAULT 'general', -- 'user_management', 'content_management', 'system', 'security', 'data_export'

  -- Target of the action (optional, depends on action type)
  target_type TEXT, -- 'user', 'guide', 'comment', 'notification', 'system', 'setting'
  target_id TEXT, -- UUID or identifier of the target
  target_label TEXT, -- Human-readable label (user name, guide title, etc.)

  -- Details
  description TEXT NOT NULL, -- Human-readable description
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional structured data (changes made, old/new values, etc.)

  -- Tracking
  ip_address INET, -- IP address of admin (optional, for security)
  user_agent TEXT, -- Browser/device info (optional)

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================

-- Index for querying by admin
CREATE INDEX idx_admin_action_log_admin_id ON admin_action_log(admin_id);

-- Index for querying by action type
CREATE INDEX idx_admin_action_log_action_type ON admin_action_log(action_type);

-- Index for querying by action category
CREATE INDEX idx_admin_action_log_action_category ON admin_action_log(action_category);

-- Index for querying by target
CREATE INDEX idx_admin_action_log_target ON admin_action_log(target_type, target_id);

-- Index for date range queries
CREATE INDEX idx_admin_action_log_created_at ON admin_action_log(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX idx_admin_action_log_admin_action_date ON admin_action_log(admin_id, action_type, created_at DESC);

-- ============================================
-- RLS POLICIES
-- Security: Only admins can read action logs
-- ============================================

-- Enable RLS
ALTER TABLE admin_action_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can SELECT
CREATE POLICY admin_action_log_select_policy ON admin_action_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Policy: Only admins can INSERT (for manual logging)
CREATE POLICY admin_action_log_insert_policy ON admin_action_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Note: No UPDATE or DELETE policies - action logs should be immutable
-- Retention policy (delete logs older than 1 year) would be handled by scheduled job

-- ============================================
-- HELPER FUNCTION: Log Admin Action
-- Usage: SELECT log_admin_action(...)
-- ============================================

CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type TEXT,
  p_action_category TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_target_label TEXT DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_admin_id UUID;
  v_log_id UUID;
BEGIN
  -- Get current user ID
  v_admin_id := auth.uid();

  -- Verify user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = v_admin_id
    AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Only admins can log actions';
  END IF;

  -- Insert action log
  INSERT INTO admin_action_log (
    admin_id,
    action_type,
    action_category,
    target_type,
    target_id,
    target_label,
    description,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    v_admin_id,
    p_action_type,
    p_action_category,
    p_target_type,
    p_target_id,
    p_target_label,
    p_description,
    p_metadata,
    p_ip_address::INET,
    p_user_agent
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Log User Deletion
-- Automatically called when admin deletes user
-- ============================================

CREATE OR REPLACE FUNCTION log_user_deletion()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get current user (should be admin)
  v_admin_id := auth.uid();

  -- Only log if deletion is done by an admin
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = v_admin_id
    AND is_admin = TRUE
  ) THEN
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
      'user_deleted',
      'user_management',
      'user',
      OLD.id::TEXT,
      OLD.full_name,
      'משתמש נמחק מהמערכת',
      jsonb_build_object(
        'email', OLD.email,
        'role', OLD.role,
        'joined', OLD.created_at
      )
    );
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletions
DROP TRIGGER IF EXISTS trigger_log_user_deletion ON profiles;
CREATE TRIGGER trigger_log_user_deletion
  BEFORE DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_user_deletion();

-- ============================================
-- SEED DATA: Example action logs
-- (For development/testing only)
-- ============================================

-- Note: In production, logs would be created by actual admin actions
-- This section can be removed or commented out for production deployment

-- ============================================
-- COMMENTS for documentation
-- ============================================

COMMENT ON TABLE admin_action_log IS 'Audit log of all administrative actions performed in the system. Retention: 1 year minimum.';
COMMENT ON COLUMN admin_action_log.action_type IS 'Type of action performed (user_deleted, content_modified, etc.)';
COMMENT ON COLUMN admin_action_log.action_category IS 'Category grouping: user_management, content_management, system, security, data_export';
COMMENT ON COLUMN admin_action_log.target_type IS 'Type of entity the action was performed on (user, guide, comment, etc.)';
COMMENT ON COLUMN admin_action_log.target_id IS 'ID of the target entity';
COMMENT ON COLUMN admin_action_log.target_label IS 'Human-readable label for the target (e.g., user name, guide title)';
COMMENT ON COLUMN admin_action_log.metadata IS 'Structured JSON data with additional context (old/new values, etc.)';
COMMENT ON COLUMN admin_action_log.ip_address IS 'IP address of the admin who performed the action (for security auditing)';

-- ============================================
-- Migration Complete
-- ============================================

-- Verify table was created
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'admin_action_log'
  ) THEN
    RAISE NOTICE '✅ admin_action_log table created successfully';
  ELSE
    RAISE EXCEPTION '❌ Failed to create admin_action_log table';
  END IF;
END $$;

