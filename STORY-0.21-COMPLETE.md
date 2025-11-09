# Story 0.21: Fix Vercel Dynamic Import Errors

**Type**: Bug Fix (On-the-Go Story)
**Status**: Complete
**Priority**: Critical

## Problem

When navigating to certain pages (especially `/profile`), the application crashed with:

```
Failed to fetch dynamically imported module: https://agenseek.vercel.app/assets/index-DdcwR6Rl.js
TypeError: Failed to fetch dynamically imported module
```

The error occurred because:
1. Vite builds the app with code-splitting and generates chunk files in `/assets/`
2. When the user navigates to `/profile`, React Router tries to lazy-load the ProfilePage chunk
3. The browser requests the chunk file (e.g., `index-DdcwR6Rl.js`)
4. **But** Vercel's rewrite rule was catching ALL requests, including asset files
5. So instead of serving the JavaScript file, Vercel returned `index.html`
6. The browser received HTML with MIME type `text/html` instead of JavaScript
7. This triggered the "Failed to fetch dynamically imported module" error

## Root Cause

The `vercel.json` rewrite rule was too broad:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This caught **everything**, including:
- Asset files (`/assets/*.js`, `/assets/*.css`)
- JavaScript chunks from code-splitting
- Images, fonts, etc.

## Solution

Updated the rewrite rule to **exclude** the `/assets/` directory:

```json
"rewrites": [
  {
    "source": "/((?!assets/).*)",
    "destination": "/index.html"
  }
]
```

### How This Works

- `(?!assets/)` is a **negative lookahead** regex pattern
- It means: "match anything EXCEPT paths that contain `assets/`"
- Now:
  - Regular routes like `/profile`, `/dashboard` → rewritten to `/index.html` ✅
  - Asset files like `/assets/index-DdcwR6Rl.js` → served directly ✅

## Changes Made

### 1. Fixed `vercel.json`

```diff
  "rewrites": [
    {
-     "source": "/(.*)",
+     "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ],
```

## Testing

1. **Deploy to Vercel** (the change only takes effect after deployment)
2. Navigate to `/profile` page
3. Verify no "Failed to fetch dynamically imported module" errors
4. Test other lazy-loaded routes:
   - `/guides` (GuidesPage)
   - `/tasks` (TasksPage)
   - `/notes` (NotesPage)
   - `/admin` (AdminDashboardPage)
5. Check browser DevTools Network tab:
   - Asset files should return `200 OK` with correct MIME types
   - JavaScript chunks should have `Content-Type: application/javascript`

## Why This Happened

This is a common issue when deploying SPAs (Single Page Applications) to Vercel/Netlify:
- SPAs need HTML5 History API routing (client-side routing)
- So we rewrite all routes to `index.html` to let React Router handle them
- But we **must exclude** actual static assets
- Otherwise, the server returns HTML instead of the requested file type

## Related Issues

- [Vite Documentation - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation - Rewrites](https://vercel.com/docs/projects/project-configuration#rewrites)

## Prevention

When adding new static asset directories in the future, update the regex pattern to exclude them:

```json
{
  "source": "/((?!assets/|images/|fonts/).*)",
  "destination": "/index.html"
}
```

---

**Status**: ✅ Complete - Ready for deployment

