# 🔧 Quick Fix: Vercel Deployment Error

**Error:** `Environment Variable "VITE_SUPABASE_URL" references Secret "supabase-url", which does not exist.`

**Status:** ✅ **FIXED** - Updated `vercel.json` to remove the problematic `env` section

---

## What Happened?

The original `vercel.json` included an `env` section that referenced Vercel Secrets (`@supabase-url`, `@supabase-anon-key`) which don't exist. These secrets need to be created separately, but the correct approach is to set environment variables directly in the Vercel dashboard instead.

---

## ✅ What Was Fixed

1. **Removed the `env` section from `vercel.json`**
   - Environment variables should be set in Vercel dashboard, not in `vercel.json`
   - The file now only contains build configuration and headers

2. **Updated deployment guide**
   - Added clearer instructions for setting environment variables
   - Added this specific error to troubleshooting section

---

## 🚀 How to Fix Your Deployment

### Step 1: Get the Latest Changes

If you haven't already committed and pushed the fix:

```bash
# The fix is already applied locally
git add vercel.json docs/VERCEL-DEPLOYMENT-GUIDE.md
git commit -m "fix: remove env section from vercel.json - use Vercel dashboard for env vars"
git push origin main
```

This will trigger a new deployment automatically.

---

### Step 2: Add Environment Variables in Vercel Dashboard

**Before the deployment succeeds, you MUST add the environment variables:**

1. **Go to Your Vercel Project:**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your `agenseek` project

2. **Navigate to Environment Variables:**
   - Click "Settings" (top navigation)
   - Click "Environment Variables" (left sidebar)

3. **Add `VITE_SUPABASE_URL`:**
   - Click "Add New"
   - Name: `VITE_SUPABASE_URL`
   - Value: Get from Supabase Dashboard → Settings → API → Project URL
     - Example: `https://your-project-id.supabase.co`
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

4. **Add `VITE_SUPABASE_ANON_KEY`:**
   - Click "Add New" again
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Get from Supabase Dashboard → Settings → API → Project API keys → anon public
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

---

### Step 3: Trigger a Redeploy

After adding the environment variables:

**Option A: Automatic (Recommended)**
- Push the fixed code (Step 1 above)
- Vercel will automatically deploy with the new configuration

**Option B: Manual Redeploy**
1. Go to "Deployments" tab in Vercel
2. Find the failed deployment
3. Click the "..." menu → "Redeploy"
4. Confirm the redeploy

---

## ✅ Verification

After the deployment succeeds:

1. **Check the deployment:**
   - Click on the deployment in Vercel
   - Look for "✓ Deployment Ready"
   - Click "Visit" to open your app

2. **Verify app works:**
   - App loads without errors
   - No console errors about undefined Supabase URL/key
   - Navigation works correctly

3. **Test authentication (optional):**
   - Try to access a protected route
   - Should redirect to login (even though we haven't built login yet)

---

## 📋 Your Environment Variables

Make sure you have these values from Supabase:

- [ ] **VITE_SUPABASE_URL** 
  - Found in: Supabase Dashboard → Settings → API → Project URL
  - Format: `https://xxxxx.supabase.co`

- [ ] **VITE_SUPABASE_ANON_KEY**
  - Found in: Supabase Dashboard → Settings → API → Project API keys
  - Format: Long JWT token starting with `eyJ...`

---

## 🎯 Summary

1. ✅ **Code Fixed:** `vercel.json` no longer references non-existent secrets
2. ⏳ **Action Required:** Add environment variables in Vercel dashboard
3. ⏳ **Action Required:** Push code to trigger new deployment
4. ✅ **Result:** Deployment will succeed once env vars are set

---

## ❓ Need Help?

If you're still having issues:

1. **Check environment variable names:**
   - Must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Must start with `VITE_` (required by Vite)

2. **Verify values are correct:**
   - Copy directly from Supabase dashboard
   - No extra spaces before/after
   - Full URL including `https://`

3. **Check deployment logs:**
   - Go to Deployments tab in Vercel
   - Click on the deployment
   - Check the build logs for any errors

---

**Once this is fixed, your app will be live on Vercel! 🚀**

