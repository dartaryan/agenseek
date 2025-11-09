-- ============================================
-- FIX DEPLOYMENT: Add Avatar Columns to profiles
-- This will fix the 34 TypeScript errors blocking deployment
-- ============================================

-- Add avatar configuration columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_style VARCHAR(50) DEFAULT 'avataaars',
ADD COLUMN IF NOT EXISTS avatar_seed VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_options JSONB DEFAULT '{}'::jsonb;

-- Add helpful comments
COMMENT ON COLUMN profiles.avatar_style IS 'DiceBear avatar style (avataaars, bottts, lorelei, personas)';
COMMENT ON COLUMN profiles.avatar_seed IS 'Seed string for generating consistent avatar (typically user ID)';
COMMENT ON COLUMN profiles.avatar_options IS 'JSON configuration for avatar colors and accessories';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_style ON profiles(avatar_style);

-- Verify the columns were added successfully
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('avatar_style', 'avatar_seed', 'avatar_options')
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Avatar columns added successfully to profiles table!';
    RAISE NOTICE '✅ You can now redeploy to Vercel and the build will pass.';
END $$;

