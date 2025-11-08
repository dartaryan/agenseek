-- Migration: Add hebrew_name_suggestion_dismissed column to profiles table
-- Story: X.X - Hebrew Display Name Suggestion
-- Created: 2025-11-08

-- Add column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hebrew_name_suggestion_dismissed BOOLEAN DEFAULT false;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.hebrew_name_suggestion_dismissed IS
'Flag indicating if user has permanently dismissed the Hebrew name suggestion banner. Resets to false when display_name changes from Hebrew to English.';

-- Create index for efficient lookups (for queries with WHERE hebrew_name_suggestion_dismissed = false)
CREATE INDEX IF NOT EXISTS idx_profiles_hebrew_suggestion_not_dismissed
ON public.profiles(hebrew_name_suggestion_dismissed)
WHERE hebrew_name_suggestion_dismissed = false;

-- Add comment on index
COMMENT ON INDEX idx_profiles_hebrew_suggestion_not_dismissed IS
'Index for efficient lookups of users who have not dismissed the Hebrew name suggestion banner';

