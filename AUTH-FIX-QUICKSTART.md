# Authentication Issues - Quick Fix Guide

**Date:** November 9, 2025
**Status:** READY TO APPLY
**Time to Fix:** ~5 minutes

---

## What's Been Fixed (Code Changes)

✅ **Logout functionality improved** - Added proper cleanup delays
✅ **Supabase client configuration enhanced** - Better storage handling
✅ **Database migration SQL prepared** - Ready to apply to production

**Files Changed:**
- `src/lib/auth.ts` - Improved signOut function
- `src/lib/supabase.ts` - Enhanced client configuration
- `src/components/layout/Header.tsx` - Better logout handling
- `src/components/layout/MobileNav.tsx` - Better logout handling

---

## Actions Required (Manual Steps)

### 1. Apply Database Fix (CRITICAL - 2 minutes)

**Go to Supabase Dashboard:**
1. Open https://supabase.com/dashboard
2. Select your Agenseek project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy entire contents of `APPLY-AUTH-FIX-NOW.sql`
6. Paste into SQL Editor
7. Click "Run" (bottom right)
8. Verify output shows: `trigger_name: on_auth_user_created | status: enabled`

**This fixes:**
- ✅ Email registration will auto-create profiles
- ✅ Google OAuth will auto-create profiles
- ✅ Fixes any orphaned users (users without profiles)

---

### 2. Configure Redirect URLs (REQUIRED - 2 minutes)

**Go to Supabase Dashboard:**
1. Navigate to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production URL:
   ```
   https://agenseek.vercel.app
   ```
   (Replace with your actual production domain)

3. Add these **Redirect URLs** (click "Add URL" for each):
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   https://agenseek.vercel.app/auth/callback
   https://agenseek.vercel.app/**
   https://agenseek-*.vercel.app/auth/callback
   https://agenseek-*.vercel.app/**
   ```
   (Replace `agenseek.vercel.app` with your actual domain)

4. Click **Save**

**This fixes:**
- ✅ Google OAuth redirects will work
- ✅ Logout redirects will work
- ✅ Preview deployments will work (the `*` wildcard)

---

### 3. Check Email Confirmation Setting (1 minute)

**Go to Supabase Dashboard:**
1. Navigate to **Authentication** → **Settings** → **Email Auth**
2. Check the **"Enable email confirmations"** toggle

**Choose one:**

**Option A: Disable confirmations (Immediate registration)**
- Toggle OFF
- Users can log in immediately after registration
- No email verification required
- **Recommended for development/MVP**

**Option B: Keep confirmations enabled (More secure)**
- Toggle ON
- Users must click email link before logging in
- **Requires:** Email templates configured in Supabase
- **Requires:** Registration flow updated to show "Check your email" message

**This fixes:**
- ✅ Email registration will work as expected
- ✅ Users won't be confused by "email not confirmed" errors

---

### 4. Verify Google OAuth (Optional - Skip if not using Google login)

**Only do this if you want Google OAuth enabled**

**Check if already configured:**
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find "Google" in the list
3. If toggle is ON and credentials are filled, skip this step

**If not configured:**
1. Follow the guide in `docs/OAUTH-SETUP.md`
2. Requires: Google Cloud Console account
3. Time: ~5-10 minutes

**This enables:**
- ✅ "Sign in with Google" button
- ✅ One-click registration via Google
- ✅ Auto-profile creation for Google users

---

### 5. Deploy Code Changes (Automatic)

**If using Vercel (automatic deployment):**
1. Commit the changes (they're already saved in your files)
2. Push to your repository
3. Vercel will automatically deploy
4. Wait ~2-3 minutes for deployment

**Manual commit and push:**
```bash
git add .
git commit -m "fix: improve authentication logout and session handling"
git push origin main
```

**This deploys:**
- ✅ Improved logout functionality
- ✅ Better Supabase session handling
- ✅ Proper cleanup delays

---

## Testing Checklist

After applying all fixes, test in this order:

### Test Locally First

1. **Test Email Registration:**
   ```bash
   npm run dev
   # Open http://localhost:5173/auth/register
   # Register with new email
   # Should create profile automatically
   ```
   ✅ Registration works
   ✅ Profile created in database
   ✅ Can log in immediately (if confirmations disabled) OR check email (if enabled)

2. **Test Logout:**
   ```bash
   # Log in with any account
   # Click logout button
   # Should redirect to login page
   # Try to access /dashboard - should redirect to /login
   ```
   ✅ Logout redirects to login page
   ✅ Cannot access protected pages after logout
   ✅ Can log in again successfully

3. **Test Google OAuth (if configured):**
   ```bash
   # Open http://localhost:5173/auth/login
   # Click "Sign in with Google"
   # Authorize with Google
   # Should redirect back and create profile
   ```
   ✅ Google consent screen appears
   ✅ Redirects back to app
   ✅ Profile created automatically
   ✅ Redirected to onboarding or dashboard

### Test on Production

After Vercel deployment completes:

1. **Test Email Registration on Production:**
   - Visit `https://your-domain.com/auth/register`
   - Register with new email
   - Verify it works

2. **Test Logout on Production:**
   - Log in
   - Click logout
   - Verify you're logged out
   - Verify you can't access /dashboard
   - Verify you can log in again

3. **Test Google OAuth on Production:**
   - Visit `https://your-domain.com/auth/login`
   - Click "Sign in with Google"
   - Verify it works

---

## Verification Queries

Run these in Supabase SQL Editor to verify fixes:

```sql
-- 1. Check trigger exists
SELECT tgname, tgenabled, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
-- Should show: on_auth_user_created | enabled | handle_new_oauth_user

-- 2. Check all users have profiles
SELECT
  COUNT(*) FILTER (WHERE p.id IS NULL) as users_without_profiles,
  COUNT(*) FILTER (WHERE p.id IS NOT NULL) as users_with_profiles,
  COUNT(*) as total_users
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;
-- users_without_profiles should be 0

-- 3. Check recent signups
SELECT u.id, u.email, u.created_at, p.display_name
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '1 hour'
ORDER BY u.created_at DESC;
-- Should show any users registered in last hour with their profiles
```

---

## What Changed (Technical Details)

### Code Changes

**src/lib/auth.ts:**
- Added try/catch error handling to signOut
- Added logging for debugging
- Returns success status

**src/lib/supabase.ts:**
- Explicitly set storage to localStorage
- Added custom storage key to avoid conflicts
- Enabled PKCE flow for better security

**src/components/layout/Header.tsx:**
- Added 100ms delay after signOut for storage cleanup
- Added try/catch with error logging
- Ensures redirect happens even if error occurs

**src/components/layout/MobileNav.tsx:**
- Same improvements as Header.tsx
- Consistent error handling

### Database Changes

**Migration: APPLY-AUTH-FIX-NOW.sql:**
- Creates `handle_new_oauth_user()` function
- Creates trigger on auth.users INSERT
- Auto-creates profiles for all new users (email or OAuth)
- Fixes orphaned users (users without profiles)
- Adds verification queries

---

## Troubleshooting

### Issue: Still can't register

**Check:**
1. Run verification query #2 (see above) - are profiles being created?
2. Check Supabase logs: Authentication → Logs
3. Check browser console for errors
4. Verify redirect URLs include your domain

**Common causes:**
- Trigger not applied → Run `APPLY-AUTH-FIX-NOW.sql` again
- Email confirmations blocking login → Disable in Supabase settings
- Redirect URL mismatch → Add your domain to redirect URLs

### Issue: Still can't logout on production

**Check:**
1. Clear browser cache and cookies
2. Open DevTools → Application → Storage
3. Manually delete all Supabase keys
4. Try logout again

**Common causes:**
- Old code deployed → Check Vercel deployment logs
- Browser caching old JavaScript → Hard refresh (Ctrl+Shift+R)
- Cookies from old domain → Clear all site data

### Issue: Google OAuth not working

**Check:**
1. Is Google provider enabled in Supabase?
2. Are credentials filled in Supabase?
3. Is callback URL added to Google Cloud Console?
4. Does Supabase callback URL match Google Cloud Console?

**Fix:**
- Follow `docs/OAUTH-SETUP.md` step by step
- Verify redirect URIs match EXACTLY (https vs http matters!)

---

## Support Resources

**Documentation:**
- Full diagnostic: `docs/AUTH-ISSUES-DIAGNOSTIC.md`
- OAuth setup: `docs/OAUTH-SETUP.md`
- Deployment guide: `docs/VERCEL-DEPLOYMENT-GUIDE.md`

**Supabase Dashboard:**
- Auth logs: Authentication → Logs → Auth Logs
- Database logs: Logs → Postgres Logs
- API logs: Logs → API Logs

**Check deployment:**
- Vercel dashboard: https://vercel.com/dashboard
- Check latest deployment status
- View build logs if deployment failed

---

## Success Criteria

You know it's working when:

✅ New users can register via email
✅ New users can register via Google OAuth
✅ All registrations auto-create profiles
✅ Users can log in after registration
✅ Users can log out successfully
✅ Logged out users are redirected to /login
✅ Logged out users cannot access /dashboard
✅ Users can log back in after logging out
✅ No errors in browser console
✅ No errors in Supabase logs

---

## Need Help?

If you still have issues after following this guide:

1. Check `docs/AUTH-ISSUES-DIAGNOSTIC.md` for detailed troubleshooting
2. Run the verification queries above
3. Check Supabase logs for specific error messages
4. Share the error messages for specific help

---

**Generated by:** BMad Master
**Priority:** P0 - Blocks user onboarding
**Estimated Fix Time:** 5 minutes
**Status:** Ready to apply

