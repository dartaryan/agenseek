# Story 1.5: Supabase Setup Checklist

Follow these steps in order to complete Story 1.5.

## ☑️ Manual Setup Required

### Part 1: Create Supabase Project (5 minutes)

- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Set project name: `agenseek`
- [ ] Generate and save database password (you'll need this!)
- [ ] Select region: Choose closest to you
- [ ] Select pricing plan: Free
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for initialization

### Part 2: Get API Credentials (2 minutes)

- [ ] In Supabase dashboard, go to Settings → API
- [ ] Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
- [ ] Copy **anon/public key** (long JWT token)
- [ ] Keep this tab open, you'll need these values

### Part 3: Configure Environment (1 minute)

- [ ] In the **PROJECT ROOT** directory (same level as `package.json`), create a new file named: `.env.local`
- [ ] Open `supabase/env-template.txt` and copy the template
- [ ] Paste into your new `.env.local` file
- [ ] Replace `your_supabase_project_url_here` with your actual Project URL
- [ ] Replace `your_supabase_anon_key_here` with your actual anon key
- [ ] Save the file
- [ ] Verify `.env.local` is NOT tracked by Git (it should be ignored automatically)

### Part 4: Run Migrations (10 minutes)

In Supabase dashboard, go to **SQL Editor**:

#### Migration 1: Initial Schema
- [ ] Click "New Query"
- [ ] Copy entire contents of `supabase/migrations/001_initial_schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run" (or Cmd/Ctrl + Enter)
- [ ] Verify: "Success. No rows returned"

#### Migration 2: Indexes
- [ ] Click "New Query"
- [ ] Copy entire contents of `supabase/migrations/002_indexes.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify: "Success. No rows returned"

#### Migration 3: RLS Policies
- [ ] Click "New Query"
- [ ] Copy entire contents of `supabase/migrations/003_rls_policies.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify: "Success. No rows returned"

#### Migration 4: Functions & Triggers
- [ ] Click "New Query"
- [ ] Copy entire contents of `supabase/migrations/004_functions_triggers.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify: "Success. No rows returned"

### Part 5: Verification (5 minutes)

- [ ] In Supabase dashboard, go to **Table Editor**
- [ ] Verify all 9 tables exist:
  - [ ] profiles
  - [ ] user_progress
  - [ ] user_notes
  - [ ] user_tasks
  - [ ] guide_comments
  - [ ] comment_votes
  - [ ] guide_stats
  - [ ] user_activity
  - [ ] guide_bookmarks

- [ ] Click on `profiles` table
- [ ] Go to "RLS policies" tab
- [ ] Verify policies are enabled (green checkmarks)

- [ ] Restart dev server: `npm run dev`
- [ ] Open browser console
- [ ] Verify no Supabase connection errors

## ✅ Acceptance Criteria Checklist

- [ ] New Supabase project created named "agenseek"
- [ ] Database password stored securely
- [ ] `VITE_SUPABASE_URL` added to `.env.local`
- [ ] `VITE_SUPABASE_ANON_KEY` added to `.env.local`
- [ ] All 4 migration files executed successfully
- [ ] All 9 tables created in database
- [ ] RLS enabled on all tables with proper policies
- [ ] Functions and triggers created
- [ ] No connection errors when running dev server

## 📝 Notes

- The entire setup should take about 20-25 minutes
- Keep your database password safe!
- `.env.local` is automatically ignored by Git
- If you encounter errors, see `supabase/README.md` for troubleshooting

---

**When all checkboxes are complete, Story 1.5 is DONE!** ✅

