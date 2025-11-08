-- ============================================
-- Comment Vote Functions
-- Increment and decrement helpful_count on guide_comments
-- ============================================

-- Function to increment helpful_count
CREATE OR REPLACE FUNCTION increment_comment_helpful_count(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE guide_comments
  SET helpful_count = helpful_count + 1
  WHERE id = comment_id;
END;
$$;

-- Function to decrement helpful_count
CREATE OR REPLACE FUNCTION decrement_comment_helpful_count(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE guide_comments
  SET helpful_count = GREATEST(0, helpful_count - 1)
  WHERE id = comment_id;
END;
$$;

