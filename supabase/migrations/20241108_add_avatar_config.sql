-- Add avatar configuration to profiles table
-- Story 0.3: User Avatar Picture Selection

-- Add columns for avatar customization
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_style VARCHAR(50) DEFAULT 'avataaars',
ADD COLUMN IF NOT EXISTS avatar_seed VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_options JSONB DEFAULT '{}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN profiles.avatar_style IS 'DiceBear avatar style (avataaars, bottts, lorelei, personas)';
COMMENT ON COLUMN profiles.avatar_seed IS 'Seed string for generating consistent avatar (typically user ID)';
COMMENT ON COLUMN profiles.avatar_options IS 'JSON configuration for avatar colors and accessories';

-- Create index for performance (useful when filtering by avatar style)
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_style ON profiles(avatar_style);

