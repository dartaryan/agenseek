-- Story 4.6: Add RPC function to increment guide views
-- This function safely increments the view count for a guide in guide_stats table

CREATE OR REPLACE FUNCTION increment_guide_views(p_guide_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update guide stats
  INSERT INTO guide_stats (guide_slug, view_count, unique_viewers)
  VALUES (p_guide_slug, 1, 0)
  ON CONFLICT (guide_slug)
  DO UPDATE SET
    view_count = guide_stats.view_count + 1,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_guide_views(TEXT) TO authenticated;

-- Add comment
COMMENT ON FUNCTION increment_guide_views IS 'Increments the view count for a guide. Used when a user opens a guide.';

