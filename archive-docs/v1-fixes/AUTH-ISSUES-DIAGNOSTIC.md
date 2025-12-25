# Authentication Issues - Diagnostic and Fix Guide

**Date:** November 9, 2025
**Status:** CRITICAL - Affecting Production
**Reporter:** Ben
**Assigned to:** BMad Master

---

## Issues Reported

1. Cannot register new accounts (Google OAuth)
2. Cannot register new accounts (Email/Password)
3. Cannot logout on production

---

## Root Cause Analysis

### Issue #1 & #2: Registration Failures

**Primary Suspects:**

#### A. Supabase Configuration Issues
1. **Email Confirmation Disabled**
   - Supabase might require email confirmation before allowing login
   - If confirmation is not disabled, users cannot sign in immediately after registration
   - **Check:** Supabase Dashboard → Authentication → Settings → Email Auth → "Enable email confirmations"

2. **Google OAuth Not Configured**
   - Google OAuth provider may not be enabled in Supabase
   - OAuth credentials may be missing or incorrect
   - Redirect URLs may not match production domain
   - **Check:** Supabase Dashboard → Authentication → Providers → Google

3. **Redirect URLs Not Whitelisted**
   - Production URL not added to allowed redirect URLs
   - **Check:** Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

#### B. Database Trigger Not Applied to Production
The migration `20241108_oauth_profile_trigger.sql` creates the `handle_new_oauth_user()` trigger that automatically creates user profiles. If this wasn't applied to production:
- OAuth sign-ups will fail (no profile created)
- Email sign-ups might fail if RLS policies block manual profile creation

**Verification:**
```sql
-- Check if trigger exists
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT proname
FROM pg_proc
WHERE proname = 'handle_new_oauth_user';
```

#### C. Row Level Security (RLS) Blocking Profile Creation
If email registration tries to manually create a profile, RLS policies might block it because the user is not yet authenticated (email not confirmed).

**Current Flow:**
1. User signs up → Supabase creates auth.users entry
2. User is NOT authenticated (email not confirmed)
3. Frontend tries to INSERT into profiles table
4. RLS policy requires `auth.uid() = id`
5. But `auth.uid()` returns NULL (not logged in)
6. Policy fails: NULL ≠ user-id → 403 Forbidden

---

### Issue #3: Logout Not Working on Production

**Primary Suspects:**

#### A. Storage Scope Configuration
The Supabase client is configured with `persistSession: true`, which stores the session in browser storage. However:
- **Local storage** is domain-specific
- **Cookies** need proper domain/path configuration
- Production domain might have different cookie settings than localhost

#### B. Hard Redirect Race Condition
Current logout implementation:
```typescript
const handleSignOut = async () => {
  await signOut();
  window.location.href = '/auth/login';
};
```

**Problem:** `window.location.href` immediately triggers a full page reload, which might:
- Interrupt the signOut process before it completes
- Not give Supabase enough time to clear the session from storage
- Race condition: Page reloads before auth state updates

#### C. AuthContext State Not Clearing
The `AuthContext` might retain user state even after `signOut()` is called, causing the user to appear logged in even though the session is cleared.

#### D. Supabase Session Storage Issues
Supabase stores sessions in localStorage by default. On production:
- CORS restrictions might prevent storage access
- Browser privacy settings might block localStorage
- Service workers might cache auth state

---

## Diagnostic Checklist

Run these checks in order:

### 1. Verify Supabase Configuration

#### Production Database Schema
```sql
-- Check profiles table structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check RLS policies on profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check if profile creation trigger exists
SELECT tgname, tgenabled, tgtype, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname LIKE '%auth_user%' OR proname LIKE '%handle_new%';
```

#### Supabase Authentication Settings
**Navigate to:** Supabase Dashboard → Authentication → Settings

Check these settings:
- [ ] **Enable email confirmations:** Should be DISABLED for immediate registration (or configured with proper email templates)
- [ ] **Enable email signup:** Should be ENABLED
- [ ] **Minimum password length:** Verify matches client-side validation (8 characters)
- [ ] **Site URL:** Should be your production URL (e.g., `https://agenseek.vercel.app`)
- [ ] **Redirect URLs:** Should include:
  - `http://localhost:5173/auth/callback` (development)
  - `https://agenseek.vercel.app/auth/callback` (production)
  - `https://agenseek-*.vercel.app/auth/callback` (preview deployments with wildcard)

#### Google OAuth Configuration
**Navigate to:** Supabase Dashboard → Authentication → Providers → Google

Check these settings:
- [ ] **Google enabled:** Toggle should be ON
- [ ] **Client ID:** Should be filled with Google OAuth client ID
- [ ] **Client Secret:** Should be filled with Google OAuth client secret
- [ ] **Authorized redirect URI:** Copy from Supabase and verify it's added to Google Cloud Console

### 2. Test Registration Flow Locally

#### Test Email Registration
```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:5173/auth/register
# 3. Fill form and submit
# 4. Check browser console for errors
# 5. Check Network tab for failed requests
```

**Expected Success:**
- Network request to Supabase returns 200 OK
- User created in auth.users table
- Profile created in profiles table (by trigger)
- Redirect to /auth/login with success message

**Common Errors:**
- `403 Forbidden` → RLS policy blocking insert
- `new row violates row-level security policy` → Profile trigger not working
- `duplicate key value violates unique constraint` → User already exists

#### Test Google OAuth Registration
```bash
# 1. Ensure Google OAuth is configured in Supabase
# 2. Open http://localhost:5173/auth/register
# 3. Click "Sign up with Google"
# 4. Authorize with Google account
```

**Expected Success:**
- Redirected to Google consent screen
- Redirected back to /auth/callback
- Profile created automatically (by trigger)
- Redirected to /onboarding (new user) or /dashboard (returning user)

**Common Errors:**
- `redirect_uri_mismatch` → Redirect URL not whitelisted in Google Cloud Console
- `invalid_client` → Client ID or Secret incorrect in Supabase
- Stuck on callback page → Profile trigger not applied or profile fetch failing

### 3. Test Logout Flow on Production

**Steps:**
1. Deploy latest code to production
2. Log in to production site
3. Open browser DevTools → Application → Storage
4. Note the localStorage and cookie entries for Supabase
5. Click logout button
6. Check if storage was cleared
7. Try to navigate to /dashboard (should redirect to /login)

**Expected Success:**
- Supabase auth tokens removed from localStorage
- Supabase cookies cleared
- User redirected to /auth/login
- Attempting to access /dashboard redirects to /auth/login

**Common Errors:**
- Tokens still in localStorage after logout → signOut() not completing
- Redirected to login but tokens still exist → Race condition
- Can still access protected pages → AuthContext not updating

---

## Immediate Fixes

### Fix #1: Apply Database Migration to Production

**Via Supabase Dashboard (Recommended):**

1. Go to Supabase Dashboard → SQL Editor
2. Run this migration:

```sql
-- ============================================
-- Create or Replace Profile Creation Trigger
-- This MUST be applied to production database
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't exist
  -- This handles the case where user signs up via OAuth or email
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
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.handle_new_oauth_user() TO service_role;

-- Verify trigger was created
SELECT
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
```

3. Verify the output shows the trigger was created
4. Test registration with a new email or Google account

---

### Fix #2: Configure Supabase Redirect URLs

**In Supabase Dashboard:**

1. Go to Authentication → URL Configuration
2. **Site URL:** Set to production URL
   ```
   https://agenseek.vercel.app
   ```

3. **Redirect URLs:** Add ALL of these (click "Add URL" for each):
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   https://agenseek.vercel.app/auth/callback
   https://agenseek.vercel.app/**
   https://agenseek-*.vercel.app/auth/callback
   https://agenseek-*.vercel.app/**
   ```

   The wildcard `*` pattern allows preview deployments (e.g., `agenseek-git-feature-branch.vercel.app`)

4. Save changes

---

### Fix #3: Improve Logout Implementation

The current logout has a race condition. Let's fix it:

**File:** `src/lib/auth.ts`

Update the `signOut` function to ensure complete cleanup:

```typescript
/**
 * Sign out the current user
 * Ensures all session data is cleared before redirecting
 */
export async function signOut() {
  try {
    // Sign out from Supabase (clears tokens from storage)
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Additional cleanup: Clear any cached data
    // (Supabase client handles storage cleanup automatically)

    return { success: true };
  } catch (error) {
    console.error('[auth] Sign out error:', error);
    throw error;
  }
}
```

**File:** `src/components/layout/Header.tsx`

Update the logout handler to wait for cleanup before redirecting:

```typescript
const handleSignOut = async () => {
  try {
    // Sign out and wait for completion
    await signOut();

    // Small delay to ensure storage cleanup completes
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use navigate instead of window.location.href
    // This allows AuthContext to update before navigation
    window.location.href = '/auth/login';
  } catch (error) {
    console.error('[Header] Logout error:', error);
    // Still redirect on error to ensure user is logged out
    window.location.href = '/auth/login';
  }
};
```

**File:** `src/components/layout/MobileNav.tsx`

Same fix for mobile navigation:

```typescript
const handleSignOut = async () => {
  try {
    await signOut();
    await new Promise(resolve => setTimeout(resolve, 100));
    setOpen(false);
    window.location.href = '/auth/login';
  } catch (error) {
    console.error('[MobileNav] Logout error:', error);
    setOpen(false);
    window.location.href = '/auth/login';
  }
};
```

---

### Fix #4: Disable Email Confirmation (Optional)

If you want immediate registration without email confirmation:

**In Supabase Dashboard:**

1. Go to Authentication → Settings → Email Auth
2. **Enable email confirmations:** Toggle OFF
3. Save changes

**Note:** This allows users to register and immediately log in without confirming their email. If you keep confirmations enabled, you need to:
- Set up email templates in Supabase
- Update the registration flow to show "Please check your email" message
- Update login flow to handle "email not confirmed" error

---

### Fix #5: Configure Google OAuth (If Not Already Done)

**Prerequisites:**
- Google Cloud Console account
- Google OAuth 2.0 Client ID and Secret

**Steps:**

1. **Get Supabase Callback URL:**
   - Supabase Dashboard → Authentication → Providers → Google
   - Copy the "Callback URL (for OAuth)" value
   - Example: `https://xyzabc.supabase.co/auth/v1/callback`

2. **Configure Google Cloud Console:**
   - Go to https://console.cloud.google.com/
   - Navigate to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (or edit existing)
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     https://agenseek.vercel.app
     ```
   - **Authorized redirect URIs:**
     ```
     https://xyzabc.supabase.co/auth/v1/callback
     ```
   - Save and copy Client ID and Client Secret

3. **Configure Supabase:**
   - Supabase Dashboard → Authentication → Providers → Google
   - Toggle "Google enabled" to ON
   - Paste **Client ID**
   - Paste **Client Secret**
   - Save changes

4. **Test:**
   - Visit /auth/login
   - Click "Sign in with Google"
   - Authorize with Google account
   - Should redirect back to app and create profile automatically

---

## Testing Protocol

After applying all fixes, test in this order:

### 1. Email Registration (Local)
- [ ] Go to http://localhost:5173/auth/register
- [ ] Fill in all fields with valid data
- [ ] Submit form
- [ ] Check browser console: no errors
- [ ] Check Supabase → Authentication → Users: new user created
- [ ] Check Supabase → Table Editor → profiles: profile created
- [ ] User redirected to /auth/login with success message

### 2. Email Login (Local)
- [ ] Go to http://localhost:5173/auth/login
- [ ] Enter registered email and password
- [ ] Submit form
- [ ] Redirected to /dashboard or /onboarding
- [ ] No console errors

### 3. Google OAuth Registration (Local)
- [ ] Go to http://localhost:5173/auth/register
- [ ] Click "Sign up with Google"
- [ ] Google consent screen appears
- [ ] Authorize with Google account
- [ ] Redirected to /auth/callback
- [ ] Brief loading spinner
- [ ] Redirected to /onboarding (new user)
- [ ] Check Supabase: profile created automatically
- [ ] No console errors

### 4. Logout (Local)
- [ ] Log in with any method
- [ ] Click logout button
- [ ] Redirected to /auth/login
- [ ] Check DevTools → Application → Storage: Supabase tokens cleared
- [ ] Try to manually navigate to /dashboard: redirected to /login
- [ ] Try to log in again: works correctly

### 5. Production Tests
Repeat all above tests on production URL:
- [ ] Email registration on production
- [ ] Email login on production
- [ ] Google OAuth on production
- [ ] Logout on production (most important!)

---

## Rollout Plan

1. **Apply Database Migration**
   - Run migration SQL in Supabase Dashboard → SQL Editor
   - Verify trigger exists
   - **Time estimate:** 2 minutes

2. **Configure Supabase Settings**
   - Set redirect URLs
   - Configure Google OAuth (if needed)
   - Set email confirmation setting
   - **Time estimate:** 5 minutes

3. **Deploy Code Fixes**
   - Apply logout fixes to Header.tsx and MobileNav.tsx
   - Commit and push to main branch
   - Wait for Vercel deployment
   - **Time estimate:** 5 minutes

4. **Test on Production**
   - Run all tests in Testing Protocol
   - Verify each flow works correctly
   - **Time estimate:** 10 minutes

**Total Time:** ~22 minutes

---

## Prevention Strategy

To prevent these issues in the future:

1. **Database Migrations**
   - Always apply migrations to production immediately after merging to main
   - Use Supabase CLI for automated migration deployment
   - Add migration verification to CI/CD pipeline

2. **Configuration Management**
   - Document all Supabase configuration settings in repository
   - Create checklist for production deployment
   - Use infrastructure-as-code for Supabase config (Supabase CLI)

3. **Authentication Testing**
   - Add E2E tests for auth flows (Playwright/Cypress)
   - Test on staging environment before production
   - Monitor auth errors in Supabase Dashboard → Logs

4. **Logout Monitoring**
   - Add analytics event for successful logout
   - Monitor for users unable to logout (support tickets)
   - Add "Force Logout" button in profile settings as fallback

---

## Reference Documents

- `docs/OAUTH-SETUP.md` - Complete OAuth setup guide
- `supabase/migrations/20241108_oauth_profile_trigger.sql` - Profile creation trigger
- `REGISTRATION-FLOW-FIX.md` - Previous registration issue resolution
- `docs/VERCEL-DEPLOYMENT-GUIDE.md` - Vercel environment configuration

---

## Support Resources

**Supabase Dashboard:**
- Authentication Logs: Authentication → Logs → Auth Logs
- Database Logs: Logs → Postgres Logs
- API Logs: Logs → API Logs

**Browser DevTools:**
- Console: Check for JavaScript errors
- Network Tab: Check for failed API requests
- Application Tab: Check localStorage and cookies

**Verification Queries:**
```sql
-- Check recent auth events
SELECT * FROM auth.audit_log_entries
ORDER BY created_at DESC
LIMIT 20;

-- Check users created in last 24 hours
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check profiles created in last 24 hours
SELECT id, email, display_name, completed_onboarding, created_at
FROM profiles
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## Status Tracking

- [ ] Fix #1: Database migration applied to production
- [ ] Fix #2: Supabase redirect URLs configured
- [ ] Fix #3: Logout implementation improved
- [ ] Fix #4: Email confirmation configured
- [ ] Fix #5: Google OAuth configured
- [ ] All tests passed locally
- [ ] All tests passed on production
- [ ] Issue resolved and verified

**Next Review:** After testing protocol completion

---

**Generated by:** BMad Master
**For:** Ben
**Priority:** P0 (Blocks user onboarding)
**Estimated Fix Time:** 22 minutes
**Confidence:** High (root causes identified)

