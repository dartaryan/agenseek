-- ============================================
-- Verify and Fix RLS Policies for Profiles
-- ============================================

-- Step 1: Check current policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Step 2: Drop existing policies (if any conflict)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Step 3: Recreate all policies correctly
-- SELECT policy (read)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- UPDATE policy
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- INSERT policy (THIS IS THE MISSING ONE)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Check policies again to confirm
SELECT
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- ============================================
-- Expected result: 3 policies
-- 1. "Profiles are viewable by everyone" - SELECT
-- 2. "Users can update own profile" - UPDATE
-- 3. "Users can insert own profile" - INSERT
-- ============================================

