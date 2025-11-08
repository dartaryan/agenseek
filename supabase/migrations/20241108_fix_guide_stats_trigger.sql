-- ============================================
-- Fix guide_stats trigger function to bypass RLS
-- Date: November 8, 2025
-- Issue: Comment insertion failing due to RLS on guide_stats
-- Solution: Add SECURITY DEFINER to function
-- ============================================

-- The trigger function needs SECURITY DEFINER to bypass RLS
-- when updating guide_stats from user comment inserts
CREATE OR REPLACE FUNCTION update_guide_comment_count()
RETURNS TRIGGER
SECURITY DEFINER  -- Run with elevated privileges
SET search_path = public
AS $$
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

-- Note: The trigger itself doesn't need to be recreated
-- It already exists from migration 004_functions_triggers.sql

