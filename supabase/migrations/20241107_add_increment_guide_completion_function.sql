-- Story 4.7: Add RPC function to increment guide completion count
-- This function safely increments the completion_count for a guide in guide_stats table

CREATE OR REPLACE FUNCTION increment_guide_completion(p_guide_slug TEXT)
RETURNS VOID AS $$
BEGIN
  -- Insert or update guide_stats
  INSERT INTO guide_stats (guide_slug, completion_count, updated_at)
  VALUES (p_guide_slug, 1, NOW())
  ON CONFLICT (guide_slug)
  DO UPDATE SET
    completion_count = guide_stats.completion_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_guide_completion(TEXT) TO authenticated;

-- Comment for documentation
COMMENT ON FUNCTION increment_guide_completion IS 'Increments the completion count for a guide. Creates entry if it does not exist.';

