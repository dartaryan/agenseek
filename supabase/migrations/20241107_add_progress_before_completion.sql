-- Migration: Add progress_before_completion column to user_progress table
-- Story: 5.1.2 - Toggle Guide Completion Status
-- Purpose: Store progress before marking complete so it can be restored on unmark

-- Add column to store progress before marking complete (IF NOT EXISTS)
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS progress_before_completion INTEGER;

-- Add comment for documentation
COMMENT ON COLUMN user_progress.progress_before_completion IS 'Progress percentage before marking complete (for restoration on uncomplete)';

-- Add check constraint to ensure valid range (0-100)
-- Using DO block to handle constraint existence check
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progress_before_completion_range'
  ) THEN
    ALTER TABLE user_progress
    ADD CONSTRAINT progress_before_completion_range
    CHECK (progress_before_completion IS NULL OR (progress_before_completion >= 0 AND progress_before_completion <= 100));
  END IF;
END $$;

-- Backfill existing completed records (optional, for data integrity)
-- Set progress_before_completion to progress_percent for already completed guides
UPDATE user_progress
SET progress_before_completion = progress_percent
WHERE completed = true
  AND progress_before_completion IS NULL
  AND progress_percent < 100;

-- Note: This migration is safe to run multiple times

