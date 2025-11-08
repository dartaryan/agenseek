-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration: OAuth Profile Creation Trigger
-- Story 2.4: Google OAuth Integration
-- Date: 2025-11-08
-- ============================================

-- ============================================
-- FUNCTION: Handle new OAuth user profile creation
-- Automatically creates a profile when a user signs up via OAuth
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't exist
  -- This handles the case where user signs up via OAuth
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
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
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Create profile on new user signup
-- Fires after a new user is created in auth.users
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

-- ============================================
-- GRANT PERMISSIONS
-- Ensure the function can be executed by the service role
-- ============================================

GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO service_role;

-- ============================================
-- NOTES:
-- - This trigger creates a profile automatically for OAuth users
-- - Extracts display_name from Google profile metadata (full_name or name)
-- - Falls back to email username if no name is provided
-- - ON CONFLICT DO NOTHING prevents errors if profile already exists
-- - completed_onboarding defaults to false, so users go through onboarding
-- ============================================

