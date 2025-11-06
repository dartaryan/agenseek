-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration 003: Row Level Security (RLS) Policies
-- ============================================

-- ============================================
-- PROFILES - Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (for comments, activity feed)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- USER_PROGRESS - Row Level Security
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can view own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- USER_NOTES - Row Level Security
-- ============================================

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Users can view own notes
CREATE POLICY "Users can view own notes"
  ON user_notes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own notes
CREATE POLICY "Users can insert own notes"
  ON user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own notes
CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own notes
CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- USER_TASKS - Row Level Security
-- ============================================

ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;

-- Users can view own tasks
CREATE POLICY "Users can view own tasks"
  ON user_tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own tasks
CREATE POLICY "Users can insert own tasks"
  ON user_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own tasks
CREATE POLICY "Users can update own tasks"
  ON user_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own tasks
CREATE POLICY "Users can delete own tasks"
  ON user_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GUIDE_COMMENTS - Row Level Security
-- ============================================

ALTER TABLE guide_comments ENABLE ROW LEVEL SECURITY;

-- All comments viewable by everyone
CREATE POLICY "Comments are viewable by everyone"
  ON guide_comments FOR SELECT
  USING (true);

-- Users can insert own comments
CREATE POLICY "Users can insert own comments"
  ON guide_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own comments
CREATE POLICY "Users can update own comments"
  ON guide_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own comments
CREATE POLICY "Users can delete own comments"
  ON guide_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENT_VOTES - Row Level Security
-- ============================================

ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- Votes viewable by everyone
CREATE POLICY "Votes are viewable by everyone"
  ON comment_votes FOR SELECT
  USING (true);

-- Users can insert own votes
CREATE POLICY "Users can insert own votes"
  ON comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own votes
CREATE POLICY "Users can delete own votes"
  ON comment_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GUIDE_STATS - Row Level Security
-- ============================================

ALTER TABLE guide_stats ENABLE ROW LEVEL SECURITY;

-- Stats viewable by everyone
CREATE POLICY "Stats are viewable by everyone"
  ON guide_stats FOR SELECT
  USING (true);

-- Only system/admin can modify (handled via functions)

-- ============================================
-- USER_ACTIVITY - Row Level Security
-- ============================================

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users can view own activity (admins can view all)
CREATE POLICY "Users can view own activity or admins can view all"
  ON user_activity FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can insert own activity
CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- GUIDE_BOOKMARKS - Row Level Security
-- ============================================

ALTER TABLE guide_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can view own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON guide_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON guide_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON guide_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

