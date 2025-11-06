-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration 002: Performance Indexes
-- ============================================

-- ============================================
-- User Progress Indexes
-- ============================================

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_guide ON user_progress(guide_slug);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);

-- ============================================
-- User Notes Indexes
-- ============================================

CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_user_notes_guide ON user_notes(guide_slug);
CREATE INDEX idx_user_notes_created ON user_notes(created_at DESC);

-- ============================================
-- User Tasks Indexes
-- ============================================

CREATE INDEX idx_user_tasks_user ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_guide ON user_tasks(guide_slug);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE INDEX idx_user_tasks_parent ON user_tasks(parent_task_id);

-- ============================================
-- Guide Comments Indexes
-- ============================================

CREATE INDEX idx_guide_comments_guide ON guide_comments(guide_slug);
CREATE INDEX idx_guide_comments_user ON guide_comments(user_id);
CREATE INDEX idx_guide_comments_parent ON guide_comments(parent_comment_id);
CREATE INDEX idx_guide_comments_question ON guide_comments(is_question);

-- ============================================
-- User Activity Indexes
-- ============================================

CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);

-- ============================================
-- Guide Bookmarks Indexes
-- ============================================

CREATE INDEX idx_guide_bookmarks_user ON guide_bookmarks(user_id);

