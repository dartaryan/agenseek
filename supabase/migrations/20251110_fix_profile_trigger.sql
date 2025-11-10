-- ============================================
-- Migration: Fix Profile Creation Trigger
-- Date: 2025-11-10
-- Issue: Users stuck in onboarding loop after registration
-- ============================================

-- ============================================
-- IMPROVED FUNCTION: Handle new user profile creation
-- Explicitly sets completed_onboarding to false
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user (both email and OAuth signup)
  -- Explicitly set completed_onboarding to ensure onboarding runs once
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    completed_onboarding,  -- EXPLICITLY SET to false
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    false,  -- EXPLICIT: User must complete onboarding
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    -- If profile already exists but was deleted and recreated,
    -- update it to ensure fresh state
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Error creating/updating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RECREATE TRIGGER
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO authenticated;

-- ============================================
-- CLEANUP: Fix existing users stuck in onboarding loop
-- For users who have auth.users but no profile
-- ============================================

-- This will be handled by the trigger when they next login
-- But we can also manually fix existing stuck users:

DO $$
DECLARE
  auth_user_record RECORD;
BEGIN
  -- Find auth users without profiles
  FOR auth_user_record IN
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    WHERE p.id IS NULL
  LOOP
    -- Create missing profile
    INSERT INTO public.profiles (
      id,
      email,
      display_name,
      completed_onboarding,
      created_at,
      updated_at
    )
    VALUES (
      auth_user_record.id,
      auth_user_record.email,
      COALESCE(
        auth_user_record.raw_user_meta_data->>'full_name',
        auth_user_record.raw_user_meta_data->>'name',
        SPLIT_PART(auth_user_record.email, '@', 1),
        'משתמש'
      ),
      false,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Created missing profile for user: %', auth_user_record.email;
  END LOOP;
END $$;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION public.handle_new_oauth_user IS 'Automatically creates user profiles on signup. Explicitly sets completed_onboarding=false to ensure onboarding runs once. Handles both email and OAuth signups.';

-- ============================================
-- VERIFICATION QUERIES (Run these to verify)
-- ============================================

-- Check for users without profiles:
-- SELECT au.id, au.email, p.id as profile_id
-- FROM auth.users au
-- LEFT JOIN public.profiles p ON p.id = au.id
-- WHERE p.id IS NULL;

-- Check profiles with incomplete onboarding:
-- SELECT id, email, display_name, completed_onboarding, created_at
-- FROM public.profiles
-- WHERE completed_onboarding = false
-- ORDER BY created_at DESC;

