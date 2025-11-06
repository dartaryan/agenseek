-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration 004: Functions and Triggers
-- ============================================

-- ============================================
-- FUNCTION: Update comment helpful count
-- Automatically updates comment helpful_count when votes are added/removed
-- ============================================

CREATE OR REPLACE FUNCTION update_comment_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guide_comments
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guide_comments
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_helpful_count
AFTER INSERT OR DELETE ON comment_votes
FOR EACH ROW
EXECUTE FUNCTION update_comment_helpful_count();

-- ============================================
-- FUNCTION: Update guide stats comment count
-- Automatically updates guide_stats when comments are added/removed
-- ============================================

CREATE OR REPLACE FUNCTION update_guide_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO guide_stats (guide_slug, comment_count)
    VALUES (NEW.guide_slug, 1)
    ON CONFLICT (guide_slug) DO UPDATE
    SET comment_count = guide_stats.comment_count + 1,
        updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guide_stats
    SET comment_count = comment_count - 1,
        updated_at = NOW()
    WHERE guide_slug = OLD.guide_slug;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guide_comment_count
AFTER INSERT OR DELETE ON guide_comments
FOR EACH ROW
EXECUTE FUNCTION update_guide_comment_count();

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- Updates the updated_at column on any UPDATE operation
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Apply updated_at to all tables
-- ============================================

-- Profiles
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User Notes
CREATE TRIGGER trigger_user_notes_updated_at
BEFORE UPDATE ON user_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User Tasks
CREATE TRIGGER trigger_user_tasks_updated_at
BEFORE UPDATE ON user_tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Guide Comments
CREATE TRIGGER trigger_guide_comments_updated_at
BEFORE UPDATE ON guide_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

