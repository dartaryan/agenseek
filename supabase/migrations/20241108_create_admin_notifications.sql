-- ============================================
-- Migration: Create Admin Notifications System
-- Date: 2024-11-08
-- Story: 9.5 - Implement Admin Notifications and Alerts
-- ============================================

-- ============================================
-- TABLE: admin_notifications
-- Admin-specific notifications and alerts
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Notification details
  type TEXT NOT NULL, -- 'new_user_digest', 'content_flagged', 'low_engagement', 'performance_issue', 'milestone'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'high', 'normal', 'low'
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Related entities (optional)
  related_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  related_guide_slug TEXT,
  related_comment_id UUID REFERENCES guide_comments(id) ON DELETE SET NULL,

  -- Metadata (JSON for flexible data storage)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Actions (optional action URL or identifier)
  action_url TEXT,
  action_label TEXT,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: admin_notification_preferences
-- Admin notification preferences
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Admin user
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Notification type preferences
  new_user_digest_enabled BOOLEAN DEFAULT TRUE,
  new_user_digest_frequency TEXT DEFAULT 'daily', -- 'immediate', 'daily', 'weekly', 'disabled'

  content_flagged_enabled BOOLEAN DEFAULT TRUE,
  content_flagged_frequency TEXT DEFAULT 'immediate',

  low_engagement_enabled BOOLEAN DEFAULT TRUE,
  low_engagement_frequency TEXT DEFAULT 'weekly',

  performance_issues_enabled BOOLEAN DEFAULT TRUE,
  performance_issues_frequency TEXT DEFAULT 'immediate',

  milestones_enabled BOOLEAN DEFAULT TRUE,
  milestones_frequency TEXT DEFAULT 'immediate',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one preference row per admin
  UNIQUE(admin_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX idx_admin_notifications_priority ON admin_notifications(priority);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_related_user ON admin_notifications(related_user_id);

CREATE INDEX idx_admin_notification_preferences_admin ON admin_notification_preferences(admin_id);

-- ============================================
-- RLS POLICIES
-- Enable RLS
-- ============================================

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Admins can view all admin notifications
CREATE POLICY "Admins can view all admin notifications"
  ON admin_notifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Admins can update admin notifications (mark as read)
CREATE POLICY "Admins can update admin notifications"
  ON admin_notifications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- System/Admins can insert admin notifications
CREATE POLICY "Admins can insert admin notifications"
  ON admin_notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Admins can delete admin notifications
CREATE POLICY "Admins can delete admin notifications"
  ON admin_notifications
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Admins can view and manage their preferences
CREATE POLICY "Admins can view their own preferences"
  ON admin_notification_preferences
  FOR SELECT
  USING (auth.uid() = admin_id);

CREATE POLICY "Admins can insert their own preferences"
  ON admin_notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update their own preferences"
  ON admin_notification_preferences
  FOR UPDATE
  USING (auth.uid() = admin_id);

-- ============================================
-- FUNCTION: Create new user notification
-- Called when a new user registers
-- ============================================

CREATE OR REPLACE FUNCTION public.create_new_user_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for all admins
  INSERT INTO admin_notifications (
    type,
    priority,
    title,
    message,
    related_user_id,
    metadata,
    action_url,
    action_label
  ) VALUES (
    'new_user_digest',
    'normal',
    'משתמש חדש נרשם',
    'משתמש חדש ' || NEW.display_name || ' נרשם לפלטפורמה',
    NEW.id,
    jsonb_build_object('user_name', NEW.display_name, 'user_email', NEW.email),
    '/admin/users',
    'צפה במשתמש'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Create milestone notification
-- Called when platform reaches a milestone
-- ============================================

CREATE OR REPLACE FUNCTION public.create_milestone_notification(
  milestone_type TEXT,
  milestone_value TEXT,
  milestone_description TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_notifications (
    type,
    priority,
    title,
    message,
    metadata
  ) VALUES (
    'milestone',
    'high',
    'אבן דרך חדשה הושגה!',
    milestone_description,
    jsonb_build_object('milestone_type', milestone_type, 'milestone_value', milestone_value)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for new user registrations
DROP TRIGGER IF EXISTS trigger_new_user_notification ON profiles;
CREATE TRIGGER trigger_new_user_notification
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_new_user_notification();

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON admin_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON admin_notification_preferences TO authenticated;

-- ============================================
-- INITIAL DATA: Create default preferences for existing admins
-- ============================================

INSERT INTO admin_notification_preferences (admin_id)
SELECT id FROM profiles WHERE is_admin = TRUE
ON CONFLICT (admin_id) DO NOTHING;


