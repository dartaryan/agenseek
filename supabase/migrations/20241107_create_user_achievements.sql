-- ============================================
-- Story 5.3: Build Achievement Badge System
-- Create user_achievements table
-- ============================================

-- Table: user_achievements
-- Tracks earned achievement badges per user
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Achievement identification
  badge_id TEXT NOT NULL, -- 'bronze_badge', 'silver_badge', 'gold_badge', etc.
  badge_type TEXT NOT NULL CHECK (badge_type IN ('milestone', 'streak', 'skill', 'special')),

  -- Progress (for multi-level badges)
  progress_current INTEGER DEFAULT 0,
  progress_target INTEGER DEFAULT 1,

  -- Status
  earned BOOLEAN DEFAULT false,
  earned_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints: one record per user per badge
  UNIQUE(user_id, badge_id)
);

-- Create index for faster queries
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_badge_id ON public.user_achievements(badge_id);
CREATE INDEX idx_user_achievements_earned ON public.user_achievements(user_id, earned);

-- RLS Policies
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own achievements (for system to create)
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own achievements (for progress tracking)
CREATE POLICY "Users can update own achievements"
  ON public.user_achievements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Admins can view all achievements
CREATE POLICY "Admins can view all achievements"
  ON public.user_achievements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Comments
COMMENT ON TABLE public.user_achievements IS 'Tracks earned achievement badges and progress towards unlocking them';
COMMENT ON COLUMN public.user_achievements.badge_id IS 'Unique identifier for the badge type (e.g., bronze_badge, week_streak_7)';
COMMENT ON COLUMN public.user_achievements.badge_type IS 'Category of badge: milestone, streak, skill, or special';
COMMENT ON COLUMN public.user_achievements.progress_current IS 'Current progress towards earning the badge';
COMMENT ON COLUMN public.user_achievements.progress_target IS 'Target progress required to earn the badge';
COMMENT ON COLUMN public.user_achievements.earned IS 'Whether the badge has been earned';
COMMENT ON COLUMN public.user_achievements.earned_at IS 'Timestamp when the badge was earned';

