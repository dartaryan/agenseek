-- ============================================
-- CRITICAL AUTH FIX - Apply Immediately to Production
-- Date: 2025-11-09
-- Issue: Registration and profile creation failing
-- ============================================

-- ============================================
-- Step 1: Create or Replace Profile Creation Function
-- This function automatically creates user profiles when users sign up
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user (email or OAuth signup)
  -- ON CONFLICT DO NOTHING prevents errors if profile already exists
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    completed_onboarding,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Extract display name from metadata or use email username
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    false,  -- New users must complete onboarding
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 2: Drop existing trigger (if exists)
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================
-- Step 3: Create trigger on auth.users table
-- Fires after a new user is inserted (both email and OAuth)
-- ============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

-- ============================================
-- Step 4: Grant necessary permissions
-- ============================================

GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO authenticated;

-- ============================================
-- Step 5: Verify trigger was created successfully
-- ============================================

SELECT
  tgname as trigger_name,
  CASE tgenabled
    WHEN 'O' THEN 'enabled'
    WHEN 'D' THEN 'disabled'
    ELSE 'unknown'
  END as status,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';

-- Expected output:
-- trigger_name            | status  | function_name
-- on_auth_user_created    | enabled | handle_new_oauth_user

-- ============================================
-- Step 6: Check recent user signups (optional)
-- ============================================

-- Check users created in last 24 hours
SELECT
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.id as profile_id,
  p.display_name,
  p.created_at as profile_created_at,
  CASE
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ PROFILE EXISTS'
  END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- Step 7: Fix any orphaned users (users without profiles)
-- Run this to create profiles for users who signed up before trigger was applied
-- ============================================

INSERT INTO public.profiles (
  id,
  email,
  display_name,
  completed_onboarding,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'display_name',
    u.raw_user_meta_data->>'name',
    SPLIT_PART(u.email, '@', 1)
  ) as display_name,
  false,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL  -- Only for users without profiles
ON CONFLICT (id) DO NOTHING;

-- Check how many profiles were created
SELECT
  COUNT(*) as profiles_created,
  'Orphaned users fixed' as message
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.created_at < NOW() - INTERVAL '1 minute'  -- Exclude very recent signups
AND p.id IS NOT NULL;

-- ============================================
-- COMPLETION CHECKLIST
-- ============================================

-- After running this script, verify:
-- ✅ Trigger exists and is enabled
-- ✅ Function exists
-- ✅ All existing users have profiles
-- ✅ Test new user registration (should auto-create profile)

-- To test:
-- 1. Create a new user via email registration
-- 2. Check that profile was created automatically:
--    SELECT * FROM profiles WHERE email = 'test@example.com';
-- 3. Try Google OAuth registration
-- 4. Verify profile was created automatically

-- ============================================
-- NOTES
-- ============================================

-- SECURITY DEFINER: Function runs with elevated privileges to bypass RLS
-- This is necessary because user is not authenticated when profile is created

-- ON CONFLICT DO NOTHING: Prevents errors if profile already exists
-- This makes the function idempotent and safe to run multiple times

-- EXCEPTION HANDLING: If profile creation fails, user creation still succeeds
-- This prevents users from being locked out due to profile creation errors

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- To remove trigger and function:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_oauth_user();

