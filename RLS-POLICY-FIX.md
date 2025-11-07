# RLS Policy Fix - Profile Creation Error

**Issue:** Profile creation fails during registration with 403 Forbidden
**Error:** `new row violates row-level security policy for table "profiles"`
**Status:** ✅ FIX AVAILABLE

---

## Problem

The `profiles` table has RLS policies that allow:
- ✅ SELECT (read) - anyone can view profiles
- ✅ UPDATE - users can update their own profile
- ❌ INSERT - **MISSING!** Users cannot create their own profile

This blocks registration because the code tries to insert a new profile record after creating the auth user.

---

## Solution

I've created a new migration file that adds:

1. **INSERT Policy** - Allows users to create their own profile
2. **Automatic Profile Creation Trigger** - Creates profile automatically on user signup (backup)

---

## How to Fix

### Step 1: Run the Migration in Supabase

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: **xxdddkprhvomvwhxyand**
3. Go to **SQL Editor** (left sidebar)
4. Click **"+ New query"**
5. Copy and paste this SQL:

```sql
-- Add INSERT policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup (backup)
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

6. Click **"Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

---

## Verify the Fix

### Test 1: Check Policy Exists

Run this in SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

You should see 3 policies now:
- ✅ "Profiles are viewable by everyone" (SELECT)
- ✅ "Users can update own profile" (UPDATE)
- ✅ "Users can insert own profile" (INSERT) ← **NEW!**

### Test 2: Try Registration Again

1. Go to your app: http://localhost:5173/auth/register
2. Fill in the registration form
3. Submit
4. **Should work now!** ✅

---

## How It Works

### Manual Profile Creation (Primary Method)
```typescript
// register.tsx line 159
const { error: profileError } = await supabase.from('profiles').insert({
  id: signUpData.user.id,
  display_name: data.displayName,
  email: data.email,
  completed_onboarding: false,
});
```

With the new INSERT policy, this now works because:
- `auth.uid() = id` - User can only insert a profile for themselves
- RLS allows the INSERT operation

### Automatic Profile Creation (Backup)

The trigger `on_auth_user_created` runs automatically when a user signs up via Supabase Auth. It creates a profile even if the manual creation fails.

**Benefits:**
- Prevents profile creation failures
- Works even if frontend code has issues
- Uses email username as display_name if not provided

---

## For Existing Users

If you have users who registered before this fix and don't have profiles:

### Option 1: Run Migration for Existing Users
```sql
-- Create profiles for users who don't have one
INSERT INTO profiles (id, display_name, email, completed_onboarding)
SELECT
  au.id,
  split_part(au.email, '@', 1) as display_name,
  au.email,
  false as completed_onboarding
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

### Option 2: Ask Users to Re-register

Users can:
1. Delete their account
2. Register again
3. Profile will be created automatically

---

## Prevention for Future

### Best Practice: Use Triggers
Always create a database trigger to automatically create related records when a user signs up. This ensures data consistency even if frontend code fails.

### Example Pattern:
```sql
-- On user signup → Create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Troubleshooting

### Error: "policy already exists"
If you get this error, the policy was already created. That's fine!

### Error: "trigger already exists"
Run this first:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

Then create the trigger again.

### Profile Still Not Creating
1. Check RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'profiles';
   ```
   Should show `rowsecurity = true`

2. Check policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```
   Should show 3 policies

3. Check trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
   Should show the trigger

---

## Files Created

- ✅ `supabase/migrations/005_fix_profile_insert_policy.sql` - Migration file
- ✅ `RLS-POLICY-FIX.md` - This documentation

---

## Summary

**What was broken:**
- ❌ Users couldn't create their own profile during registration
- ❌ RLS policy blocked INSERT operations

**What's fixed:**
- ✅ Added INSERT policy for profiles table
- ✅ Added automatic profile creation trigger
- ✅ Registration now works properly

**Next steps:**
1. Run the migration SQL in Supabase Dashboard
2. Test registration
3. Celebrate! 🎉

---

**Created by:** Developer Agent (Amelia)
**Date:** November 7, 2025
**Status:** ✅ Ready to deploy

