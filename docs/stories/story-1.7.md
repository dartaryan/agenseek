# Story 1.7: Configure Routing with React Router

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 2  
**Priority:** P0 (Critical - Blocker)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** routing configured for all main pages,  
**So that** users can navigate between authentication, dashboard, guides, notes, tasks, and admin pages.

---

## Acceptance Criteria

**Given** React Router is installed  
**When** I configure routing  
**Then**:
- Create `src/app/routes.tsx` with `createBrowserRouter`
- Define route structure:
  - `/` - Redirect based on auth
  - `/auth/login`, `/auth/register`, `/auth/reset-password`
  - `/onboarding`
  - `/dashboard` (protected)
  - `/guides`, `/guides/:slug` (protected)
  - `/notes`, `/tasks`, `/profile`, `/settings` (protected)
  - `/admin/*` (protected, admin-only)
- Create `src/components/common/ProtectedRoute.tsx`

**And** navigating to `/dashboard` when not logged in redirects to `/auth/login`

---

## Dependencies

**Prerequisites:**
- Story 1.6 (Auth configuration)

**Blocks:**
- Story 1.8 (Layout components)
- All page stories

---

**Story ID:** SEEK-1.7

