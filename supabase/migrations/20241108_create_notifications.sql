-- ============================================
-- Migration: Create Notifications System
-- Date: 2024-11-08
-- Story: 8.6 - Build Comment Notifications and Activity
-- ============================================

-- ============================================
-- TABLE: notifications
-- User notifications for comment interactions
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User who receives the notification
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- User who triggered the notification
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Notification details
  type TEXT NOT NULL, -- 'comment_reply', 'solution_marked'

  -- Related entities
  guide_slug TEXT NOT NULL, -- guide where the comment is
  comment_id UUID NOT NULL REFERENCES guide_comments(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES guide_comments(id) ON DELETE CASCADE, -- for replies

  -- Metadata
  comment_preview TEXT, -- First 100 chars of comment/reply

  -- Status
  is_read BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_comment ON notifications(comment_id);

-- ============================================
-- RLS POLICIES
-- Enable RLS
-- ============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = recipient_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- System can insert notifications (via service role or triggers)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

-- ============================================
-- FUNCTION: Create notification for comment reply
-- Called when someone replies to a comment
-- ============================================

CREATE OR REPLACE FUNCTION public.create_reply_notification()
RETURNS TRIGGER AS $$
DECLARE
  parent_comment RECORD;
  actor_profile RECORD;
BEGIN
  -- Only create notification for replies (not top-level comments)
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Get the parent comment details
    SELECT * INTO parent_comment
    FROM guide_comments
    WHERE id = NEW.parent_comment_id;

    -- Get the actor profile (person who replied)
    SELECT * INTO actor_profile
    FROM profiles
    WHERE id = NEW.user_id;

    -- Don't notify yourself
    IF parent_comment.user_id != NEW.user_id THEN
      -- Create notification for parent comment author
      INSERT INTO notifications (
        recipient_id,
        actor_id,
        type,
        guide_slug,
        comment_id,
        reply_id,
        comment_preview
      ) VALUES (
        parent_comment.user_id, -- recipient
        NEW.user_id, -- actor
        'comment_reply',
        NEW.guide_slug,
        NEW.parent_comment_id, -- parent comment
        NEW.id, -- reply
        LEFT(NEW.content, 100) -- preview
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Create notification for solution marked
-- Called when a solution is marked
-- ============================================

CREATE OR REPLACE FUNCTION public.create_solution_notification()
RETURNS TRIGGER AS $$
DECLARE
  parent_comment RECORD;
  solution_profile RECORD;
BEGIN
  -- Only create notification when solution is newly marked (not unmarked)
  IF NEW.is_solution = TRUE AND (OLD.is_solution IS NULL OR OLD.is_solution = FALSE) THEN
    -- Get the parent comment (the question)
    IF NEW.parent_comment_id IS NOT NULL THEN
      SELECT * INTO parent_comment
      FROM guide_comments
      WHERE id = NEW.parent_comment_id;

      -- Get the solution author profile
      SELECT * INTO solution_profile
      FROM profiles
      WHERE id = NEW.user_id;

      -- Don't notify yourself
      IF parent_comment.user_id != NEW.user_id THEN
        -- Create notification for solution author
        INSERT INTO notifications (
          recipient_id,
          actor_id,
          type,
          guide_slug,
          comment_id,
          reply_id,
          comment_preview
        ) VALUES (
          NEW.user_id, -- recipient (solution author)
          parent_comment.user_id, -- actor (question author)
          'solution_marked',
          NEW.guide_slug,
          NEW.parent_comment_id, -- question comment
          NEW.id, -- solution reply
          LEFT(NEW.content, 100) -- preview
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for comment replies
DROP TRIGGER IF EXISTS trigger_create_reply_notification ON guide_comments;
CREATE TRIGGER trigger_create_reply_notification
  AFTER INSERT ON guide_comments
  FOR EACH ROW
  EXECUTE FUNCTION create_reply_notification();

-- Trigger for solution marking
DROP TRIGGER IF EXISTS trigger_create_solution_notification ON guide_comments;
CREATE TRIGGER trigger_create_solution_notification
  AFTER UPDATE OF is_solution ON guide_comments
  FOR EACH ROW
  EXECUTE FUNCTION create_solution_notification();

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;
GRANT SELECT ON notifications TO anon;

