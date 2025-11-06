# Agenseek Database Setup Guide

This directory contains all database migrations for the Agenseek (BMAD Learning Hub) application.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Access to the Supabase dashboard

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Configure:
   - **Name:** agenseek
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose the closest to your users
   - **Pricing Plan:** Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be created

### Step 2: Get API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Configure Environment Variables

1. In the **project root** (same directory as `package.json`), create a new file named `.env.local`

2. Open `supabase/env-template.txt` and copy the template content

3. Paste into your new `.env.local` file and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Important:** `.env.local` is automatically ignored by Git and should NEVER be committed!

### Step 4: Run Database Migrations

In Supabase dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**

#### Migration 1: Initial Schema

1. Copy the entire contents of `migrations/001_initial_schema.sql`
2. Paste into SQL Editor
3. Click **"Run"** (or press Cmd/Ctrl + Enter)
4. ✅ You should see: "Success. No rows returned"

#### Migration 2: Indexes

1. Click **"New Query"**
2. Copy the entire contents of `migrations/002_indexes.sql`
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ You should see: "Success. No rows returned"

#### Migration 3: RLS Policies

1. Click **"New Query"**
2. Copy the entire contents of `migrations/003_rls_policies.sql`
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ You should see: "Success. No rows returned"

#### Migration 4: Functions & Triggers

1. Click **"New Query"**
2. Copy the entire contents of `migrations/004_functions_triggers.sql`
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ You should see: "Success. No rows returned"

### Step 5: Verify Database Setup

#### Check Tables

1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. You should see 9 tables:
   - ✅ profiles
   - ✅ user_progress
   - ✅ user_notes
   - ✅ user_tasks
   - ✅ guide_comments
   - ✅ comment_votes
   - ✅ guide_stats
   - ✅ user_activity
   - ✅ guide_bookmarks

#### Check RLS Policies

1. Click on any table (e.g., `profiles`)
2. Go to the **"RLS policies"** tab
3. You should see policies listed (varies by table)
4. All policies should have a green checkmark indicating they're enabled

#### Check Functions

1. In SQL Editor, run:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_type = 'FUNCTION';
   ```
2. You should see:
   - ✅ update_comment_helpful_count
   - ✅ update_guide_comment_count
   - ✅ update_updated_at_column

### Step 6: Test Connection

1. In project root, start the dev server:
   ```bash
   npm run dev
   ```

2. Open your browser and check the console
3. There should be no Supabase connection errors

## 📊 Database Schema Overview

### Core Tables

- **profiles**: User accounts and preferences
- **user_progress**: Reading progress per guide per user
- **user_notes**: User-created notes (rich text)
- **user_tasks**: User task management with sub-tasks
- **guide_comments**: Comments and Q&A on guides
- **comment_votes**: "Helpful" votes on comments
- **guide_stats**: Aggregate statistics per guide
- **user_activity**: Activity log for analytics
- **guide_bookmarks**: User bookmarks for guides

### Security

All tables have **Row Level Security (RLS)** enabled:
- Users can only access their own data (notes, tasks, progress)
- Comments and profiles are public (for community features)
- Admins can view all activity logs

### Triggers

- Auto-update `updated_at` timestamps
- Auto-increment comment helpful counts
- Auto-update guide stats on comment changes

## 🔧 Troubleshooting

### "relation already exists"

If you see this error, the tables already exist. You can either:
1. Drop all tables and re-run migrations
2. Skip to the next migration

### "permission denied"

Make sure you're running migrations as a project admin (you should be by default).

### Can't connect from app

1. Verify `.env.local` exists and has correct values
2. Check that `VITE_` prefix is present (required for Vite)
3. Restart dev server after changing `.env.local`

### Need to generate TypeScript types

Run this command (replace `[project-id]` with your project ID):
```bash
npx supabase gen types typescript --project-id [project-id] > src/types/database.ts
```

## 📝 Migration Log

| Migration | Description | Date |
|-----------|-------------|------|
| 001 | Initial schema - All tables | 2025-11-06 |
| 002 | Performance indexes | 2025-11-06 |
| 003 | RLS policies | 2025-11-06 |
| 004 | Functions and triggers | 2025-11-06 |

## ✅ Checklist

Before marking Story 1.5 complete, verify:

- [ ] Supabase project created
- [ ] All 4 migrations run successfully
- [ ] All 9 tables exist in database
- [ ] RLS is enabled on all tables
- [ ] Environment variables set in `.env.local`
- [ ] No connection errors in dev console

---

**Story ID:** SEEK-1.5  
**Status:** Setup required - follow instructions above

