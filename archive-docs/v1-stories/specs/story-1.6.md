# Story 1.6: Set Up Supabase Client and Auth Configuration

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 2  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** a configured Supabase client with authentication,  
**So that** I can make type-safe queries and authenticate users.

---

## Acceptance Criteria

**Given** Supabase project is created  
**When** I configure the Supabase client  
**Then**:
- Create `src/lib/supabase.ts` with configured client
- Create `src/lib/auth.ts` with signUp, signIn, signOut, resetPassword functions
- Create `src/hooks/useAuth.ts` hook returning { user, isLoading, error }
- Hook listens to auth state changes

**And** I can successfully call `supabase.from('profiles').select('*')` with type inference

---

## Dependencies

**Prerequisites:**
- Story 1.5 (Supabase database)

---

**Story ID:** SEEK-1.6

