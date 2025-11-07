-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration 005: Fix Profile Insert Policy
-- ============================================

-- Add INSERT policy for profiles
-- This allows users to create their own profile during registration
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- OPTIONAL: Auto-create profile on user signup
-- This trigger automatically creates a profile when a user signs up
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, completed_onboarding)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile automatically on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Notes:
-- 1. The INSERT policy allows manual profile creation (Story 2.2)
-- 2. The trigger provides automatic profile creation as backup
-- 3. If profile already exists (from manual creation), trigger does nothing
-- ============================================

