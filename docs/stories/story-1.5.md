# Story 1.5: Create Supabase Project and Configure Database

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 3  
**Priority:** P0 (Critical - Blocker)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** the Supabase backend configured with complete database schema,  
**So that** I can store user data, progress, notes, tasks, and comments.

---

## Acceptance Criteria

**Given** I have a Supabase account  
**When** I create a new project and run migrations  
**Then**:
- New Supabase project created at supabase.com
- Project name: "agenseek"
- Region: closest to users
- Database password stored securely
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` added to `.env.local`
- Create `supabase/` directory with:
  - `migrations/001_initial_schema.sql` - all tables
  - `migrations/002_indexes.sql` - all indexes
  - `migrations/003_rls_policies.sql` - all RLS policies
  - `migrations/004_functions_triggers.sql` - functions for auto-timestamps, comment counts

**And** running migrations creates all 9 tables:
- profiles
- user_progress
- user_notes
- user_tasks
- guide_comments
- comment_votes
- guide_stats
- user_activity
- guide_bookmarks

**And** RLS is enabled on all tables with proper policies

---

## Dependencies

**Prerequisites:**
- Story 1.1 (Project initialization)

**Blocks:**
- Story 1.6 (Supabase client)
- All data-dependent stories

---

## Technical Notes

Follow complete SQL schema from product brief (lines 1342-1847).
Generate TypeScript types: `supabase gen types typescript --project-id [id] > src/types/database.ts`

---

**Story ID:** SEEK-1.5

