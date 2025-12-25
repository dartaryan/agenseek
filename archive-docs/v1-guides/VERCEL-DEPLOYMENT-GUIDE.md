# Vercel Deployment Guide - Agenseek

**Story 1.9: Configure Vercel Deployment**  
**Status:** Configuration Complete - Ready for Manual Setup  
**Date:** November 6, 2025

---

## ✅ Completed

- ✅ Created `vercel.json` configuration file
- ✅ Configured build settings for Vite + React + TypeScript
- ✅ Set up SPA rewrites for React Router
- ✅ Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, etc.)
- ✅ Configured asset caching for optimal performance

---

## 🚀 Manual Steps Required

### Step 1: Connect GitHub Repository to Vercel

1. **Go to Vercel:**
   - Visit [https://vercel.com](https://vercel.com)
   - Log in or sign up with your GitHub account

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `agenseek`
   - Click "Import"

3. **Configure Project Settings:**
   - **Framework Preset:** Vite (should be auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (from vercel.json)
   - **Output Directory:** `dist` (from vercel.json)
   - **Install Command:** `npm install` (from vercel.json)

4. **Click "Deploy"** to complete the initial setup

---

### Step 2: Configure Environment Variables

**IMPORTANT:** Environment variables must be set in the Vercel dashboard, not in `vercel.json`.

1. **Go to Project Settings:**
   - Navigate to your project in Vercel
   - Click "Settings" → "Environment Variables"

2. **Add Supabase Credentials:**

   Add these environment variables for **Production**, **Preview**, and **Development**:

   | Variable Name | Value | Where to Find |
   |--------------|-------|---------------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API → Project API keys → anon public |

3. **For Each Variable:**
   - Click "Add New"
   - Enter the variable name (e.g., `VITE_SUPABASE_URL`)
   - Paste the value from your Supabase dashboard
   - Select all environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

4. **Redeploy After Adding Variables:**
   - Go to "Deployments" tab
   - Click "..." on the failed deployment → "Redeploy"
   - Or push a new commit to trigger a fresh deployment

---

### Step 3: Configure Automatic Deployments

1. **Production Branch:**
   - Go to "Settings" → "Git"
   - Set **Production Branch** to `main`
   - ✅ Every push to `main` will deploy to production

2. **Preview Branches:**
   - Set up `develop` branch for staging/preview deployments
   - Create a `develop` branch if you don't have one:
     ```bash
     git checkout -b develop
     git push origin develop
     ```
   - ✅ Every push to `develop` will create a preview deployment

3. **Pull Request Previews:**
   - Vercel automatically creates preview deployments for all PRs
   - ✅ Enabled by default

---

## 📋 Branch Strategy

After setting up Vercel, follow this branch strategy:

```
main (production)
├── develop (preview/staging)
└── feature/* (PR previews)
```

### Workflow:

1. **Feature Development:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/story-2.1
   # ... make changes ...
   git push origin feature/story-2.1
   ```
   - Creates PR preview deployment

2. **Preview Deployment (Staging):**
   ```bash
   git checkout develop
   git merge feature/story-2.1
   git push origin develop
   ```
   - Deploys to preview URL

3. **Production Deployment:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
   - Deploys to production URL

---

## 🔒 Security Headers Configured

The following security headers are automatically applied:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enable XSS filtering |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unnecessary permissions |
| `Cache-Control` (assets) | `public, max-age=31536000, immutable` | Optimize asset caching |

---

## ✅ Verification Steps

After completing the manual steps:

1. **Check Production Deployment:**
   - Visit your production URL (e.g., `https://agenseek.vercel.app`)
   - ✅ App loads without errors
   - ✅ Routing works (navigate to different pages)
   - ✅ Authentication redirects work

2. **Verify Environment Variables:**
   - Open browser console
   - ✅ No "undefined" errors for Supabase URL/key
   - ✅ Authentication attempt works (even if credentials are wrong)

3. **Test Preview Deployment:**
   - Push a commit to `develop` branch
   - ✅ Vercel creates preview deployment
   - ✅ Preview URL is accessible

4. **Test PR Preview:**
   - Create a feature branch and PR
   - ✅ Vercel automatically creates PR preview
   - ✅ PR preview URL is accessible

---

## 📊 Expected URLs

After deployment, you'll have:

- **Production:** `https://agenseek.vercel.app` (or custom domain)
- **Preview (develop):** `https://agenseek-git-develop-your-org.vercel.app`
- **PR Previews:** `https://agenseek-git-feature-branch-your-org.vercel.app`

---

## 🐛 Troubleshooting

### Issue: "Environment Variable references Secret which does not exist"
**Error:** `Environment Variable "VITE_SUPABASE_URL" references Secret "supabase-url", which does not exist.`

**Solution:** 
- ✅ **Fixed!** The `env` section has been removed from `vercel.json`
- Environment variables should be set in Vercel dashboard, not in `vercel.json`
- Pull the latest changes to get the fixed `vercel.json`
- Set environment variables through Vercel dashboard (Settings → Environment Variables)
- Redeploy after setting the variables

### Issue: "Module not found" errors
**Solution:** Ensure all dependencies are in `package.json` (not just devDependencies if they're needed at runtime)

### Issue: Environment variables not working
**Solution:** 
- Check that variable names start with `VITE_`
- Redeploy after adding environment variables
- Verify variables are set for the correct environment (Production/Preview/Development)

### Issue: 404 on page refresh
**Solution:** 
- Verify `vercel.json` has the SPA rewrite rule (already configured)
- Redeploy if you just added the configuration

### Issue: Supabase connection fails
**Solution:**
- Check that Supabase URL and anon key are correct
- Verify Supabase project is not paused
- Check browser console for specific error messages

---

## 📝 Deployment Commands (Optional)

You can also deploy from CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## ✨ What's Configured

The `vercel.json` file includes:

1. **Build Configuration:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **SPA Routing:**
   - All routes rewrite to `/index.html` for client-side routing

3. **Security Headers:**
   - Protection against XSS, clickjacking, MIME sniffing
   - Secure referrer policy
   - Restricted permissions

4. **Performance:**
   - Asset caching for 1 year (immutable)
   - Optimized for static assets

---

## 🎯 Next Steps

After completing the Vercel setup:

1. ✅ Verify production deployment is live
2. ✅ Test authentication flow on production
3. ✅ Share production URL with stakeholders
4. ➡️ **Continue to Story 1.10:** Set Up Development Scripts and Code Quality Tools

---

**Story 1.9 Status:** ✅ Configuration Complete - Awaiting Manual Vercel Setup

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs) or the Vercel Discord community.

