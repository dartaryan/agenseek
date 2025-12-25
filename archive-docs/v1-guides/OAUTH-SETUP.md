# Google OAuth Setup Guide
**Story 2.4: Google OAuth Integration**
**Status:** Ready for Configuration
**Date:** November 8, 2025

---

## ✅ Implementation Complete

All code changes for Google OAuth have been implemented:

- ✅ OAuth callback page created (`src/app/auth/callback.tsx`)
- ✅ Callback route added to routing
- ✅ Google sign-in button enabled in login page
- ✅ Google sign-up button enabled in registration page
- ✅ Hebrew locale updated with OAuth translations
- ✅ Database migration created for automatic profile creation
- ✅ `signInWithProvider` function already exists in auth.ts

---

## 🔧 Configuration Required

To enable Google OAuth, follow these steps:

### Step 1: Configure Google Cloud Console

1. **Visit Google Cloud Console:**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing project

2. **Enable Google+ API:**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Agenseek OAuth"

4. **Configure Authorized Redirect URIs:**
   - You'll need your Supabase callback URL (get from Step 2)
   - Format: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Add for local development: `http://localhost:54321/auth/v1/callback` (if using local Supabase)

5. **Save Credentials:**
   - Copy the **Client ID**
   - Copy the **Client Secret**
   - Keep these secure!

---

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your Agenseek project

2. **Enable Google Provider:**
   - Navigate to "Authentication" → "Providers"
   - Find "Google" in the provider list
   - Toggle "Enable"

3. **Add Google Credentials:**
   - **Client ID:** Paste from Google Cloud Console
   - **Client Secret:** Paste from Google Cloud Console
   - **Scopes:** Leave default (email, profile)
   - **Redirect URL:** Copy this URL - you'll need it for Google Cloud Console

4. **Configure Site URL:**
   - Go to "Authentication" → "URL Configuration"
   - **Site URL:** `http://localhost:5173` (development) or your production URL
   - **Redirect URLs:** Add both:
     - `http://localhost:5173/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)

5. **Save Changes**

---

### Step 3: Run Database Migration

Apply the OAuth profile trigger migration:

```bash
# If using Supabase CLI locally:
supabase migration up

# OR manually run the migration in Supabase Dashboard:
# Go to SQL Editor and run the contents of:
# supabase/migrations/20241108_oauth_profile_trigger.sql
```

**Migration file:** `supabase/migrations/20241108_oauth_profile_trigger.sql`

This migration creates a trigger that automatically creates a user profile when someone signs up via Google OAuth.

---

### Step 4: Update Environment Variables (if needed)

Your `.env.local` should already have:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

No additional environment variables are needed for OAuth - Supabase handles it all server-side.

---

## 🧪 Testing Checklist

### Test 1: New User Sign-Up with Google

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:5173/auth/register

3. Click "הירשם עם Google" (Sign up with Google)

4. **Expected behavior:**
   - Google consent screen opens
   - User authorizes access
   - Redirected to `/auth/callback`
   - Loading spinner shows briefly
   - Redirected to `/onboarding` (first-time users)
   - Profile created automatically in database

5. **Verify in Supabase:**
   - Go to Authentication → Users
   - New user should appear with Google provider
   - Go to Table Editor → profiles
   - Profile record should exist with:
     - `email` from Google account
     - `display_name` from Google profile
     - `completed_onboarding` = false

6. Complete onboarding → Verify redirect to dashboard

---

### Test 2: Returning User Sign-In with Google

1. Sign out from the app

2. Navigate to http://localhost:5173/auth/login

3. Click "התחבר עם Google" (Sign in with Google)

4. **Expected behavior:**
   - Google consent screen (or immediate if still logged into Google)
   - User authorizes (instant if previously authorized)
   - Redirected to `/auth/callback`
   - Redirected to `/dashboard` (skip onboarding)
   - Success toast shows: "ברוכים השבים!"

5. **Verify:**
   - User is logged in
   - No errors in console
   - Dashboard loads with user data

---

### Test 3: Error Cases

**Test 3a: User Cancels OAuth**
1. Click Google sign-in button
2. Cancel the Google consent screen
3. **Expected:** Error toast shows: "שגיאה בהתחברות עם Google"
4. User stays on login page

**Test 3b: Network Error**
1. Disable network
2. Click Google sign-in button
3. **Expected:** Error toast shows gracefully
4. No console errors about unhandled promises

**Test 3c: Email Already Exists with Different Provider**
1. Register with email: test@example.com (email/password)
2. Try to sign in with Google using same email: test@example.com
3. **Expected:** Should work! Supabase links accounts automatically (verify in docs)

---

### Test 4: Mobile Responsiveness

1. Open dev tools → Toggle device toolbar
2. Test on mobile viewport (375x667)
3. Click Google button
4. **Expected:** Button is full-width, readable, icon displays correctly

---

### Test 5: Security Verification

1. **Check Browser DevTools:**
   - Open DevTools → Application → Cookies
   - Verify auth tokens are `httpOnly` (can't see them in JavaScript)
   - Verify tokens are `secure` (only sent over HTTPS in production)

2. **Check Network Tab:**
   - Filter by "callback"
   - Verify no sensitive data exposed in URL query params
   - Verify proper HTTPS usage

3. **Check Database:**
   - Go to Supabase → Table Editor → profiles
   - Verify RLS (Row Level Security) is enabled
   - Verify users can only see their own profile

---

## 🐛 Troubleshooting

### Issue: "Redirect URI Mismatch"

**Cause:** Google Cloud Console redirect URIs don't match Supabase callback URL

**Fix:**
1. Get exact callback URL from Supabase: "Authentication" → "Providers" → "Google" → "Callback URL"
2. Add exact URL to Google Cloud Console → Credentials → OAuth 2.0 Client → "Authorized redirect URIs"
3. **Important:** URLs must match EXACTLY (including https vs http)

---

### Issue: "Invalid Client"

**Cause:** Client ID or Client Secret is incorrect

**Fix:**
1. Re-copy Client ID and Secret from Google Cloud Console
2. Paste into Supabase (no extra spaces)
3. Save changes in Supabase
4. Wait 1-2 minutes for changes to propagate

---

### Issue: Profile Not Created

**Cause:** Database trigger not applied

**Fix:**
1. Run migration manually:
   ```sql
   -- Copy contents of supabase/migrations/20241108_oauth_profile_trigger.sql
   -- Run in Supabase SQL Editor
   ```
2. Test by signing up with a new Google account
3. Check profiles table for new record

---

### Issue: User Stuck on Callback Page

**Cause:** Profile query failing or onboarding status not checked

**Fix:**
1. Check browser console for errors
2. Check Supabase logs: "Logs" → "Auth Logs"
3. Verify user has profile in database
4. Check `completed_onboarding` field

---

### Issue: Google Button Not Showing

**Cause:** Code not deployed or browser cache

**Fix:**
1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Check if dev server is running
3. Verify no console errors
4. Verify imports are correct (IconBrandGoogle, signInWithProvider)

---

## 📝 Notes

### Why OAuth Happens in Popup vs Redirect

Supabase OAuth flow:
1. Click button → Redirect to Google
2. User authorizes → Google redirects to Supabase callback URL
3. Supabase exchanges code for tokens → Redirects to your app callback
4. Your app callback checks onboarding → Redirects to dashboard or onboarding

**No popup** - it's a full redirect flow. This is standard OAuth 2.0.

---

### Profile Creation Logic

The database trigger (`handle_new_oauth_user`) runs automatically when a new user signs up via OAuth. It:

1. Extracts `display_name` from Google profile metadata:
   - First tries `raw_user_meta_data->>'full_name'`
   - Falls back to `raw_user_meta_data->>'name'`
   - Falls back to email username (before @)

2. Sets `completed_onboarding = false` (default) so user goes through onboarding

3. Uses `ON CONFLICT DO NOTHING` to prevent errors if profile already exists

---

### OAuth vs Email/Password

Both methods work simultaneously. Users can:
- Sign up with email/password, then link Google later (Supabase supports this)
- Sign up with Google, then set password later (if needed)

Supabase handles account linking automatically by email.

---

## ✅ Definition of Done

- [ ] Google Cloud Console OAuth credentials created
- [ ] Supabase Google provider enabled and configured
- [ ] Database migration applied
- [ ] Test 1: New user sign-up via Google works
- [ ] Test 2: Returning user sign-in via Google works
- [ ] Test 3: Error cases handled gracefully
- [ ] Test 4: Mobile responsive
- [ ] Test 5: Security verified
- [ ] No console errors during OAuth flow
- [ ] Profile created automatically for OAuth users
- [ ] Onboarding flow works for OAuth users

---

## 📚 Related Documentation

- **Google OAuth 2.0 Setup:** https://developers.google.com/identity/protocols/oauth2
- **Supabase OAuth Guide:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **Story 2.4 Details:** `docs/stories/story-2.4-google-oauth.md`

---

**Created:** November 8, 2025
**Author:** Dev Agent (Amelia)
**Status:** Ready for Configuration

