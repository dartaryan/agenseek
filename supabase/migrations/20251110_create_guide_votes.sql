-- ============================================
-- Migration: Create guide_votes table and vote counting functions
-- Date: 2025-11-10
-- Story: 11.9 - Implement Bookmark and Helpful Feedback Functionality
-- ============================================

-- ============================================
-- TABLE: guide_votes
-- Track user votes (helpful/not helpful) on guides
-- ============================================

CREATE TABLE IF NOT EXISTS public.guide_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  is_helpful BOOLEAN NOT NULL, -- true = helpful, false = not helpful
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints: one vote per user per guide
  UNIQUE(user_id, guide_slug)
);

-- ============================================
-- RLS POLICIES: guide_votes
-- ============================================

ALTER TABLE public.guide_votes ENABLE ROW LEVEL SECURITY;

-- Users can view their own votes
CREATE POLICY "Users can view their own votes"
  ON public.guide_votes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own votes
CREATE POLICY "Users can insert their own votes"
  ON public.guide_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes (in case we allow vote changes in the future)
CREATE POLICY "Users can delete their own votes"
  ON public.guide_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES: guide_votes
-- ============================================

CREATE INDEX idx_guide_votes_user ON public.guide_votes(user_id);
CREATE INDEX idx_guide_votes_guide ON public.guide_votes(guide_slug);
CREATE INDEX idx_guide_votes_user_guide ON public.guide_votes(user_id, guide_slug);

-- ============================================
-- FUNCTION: increment_helpful_votes
-- Safely increment helpful vote count for a guide
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_helpful_votes(guide_slug_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert new stats row if doesn't exist, or update existing
  INSERT INTO public.guide_stats (guide_slug, helpful_votes, updated_at)
  VALUES (guide_slug_param, 1, NOW())
  ON CONFLICT (guide_slug)
  DO UPDATE SET
    helpful_votes = public.guide_stats.helpful_votes + 1,
    updated_at = NOW();
END;
$$;

-- ============================================
-- FUNCTION: increment_not_helpful_votes
-- Safely increment not helpful vote count for a guide
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_not_helpful_votes(guide_slug_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert new stats row if doesn't exist, or update existing
  INSERT INTO public.guide_stats (guide_slug, not_helpful_votes, updated_at)
  VALUES (guide_slug_param, 1, NOW())
  ON CONFLICT (guide_slug)
  DO UPDATE SET
    not_helpful_votes = public.guide_stats.not_helpful_votes + 1,
    updated_at = NOW();
END;
$$;

-- ============================================
-- GRANT EXECUTE on functions to authenticated users
-- ============================================

GRANT EXECUTE ON FUNCTION public.increment_helpful_votes(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_not_helpful_votes(TEXT) TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.guide_votes IS 'Tracks user votes (helpful/not helpful) on guides';
COMMENT ON FUNCTION public.increment_helpful_votes IS 'Safely increments helpful vote count for a guide';
COMMENT ON FUNCTION public.increment_not_helpful_votes IS 'Safely increments not helpful vote count for a guide';

