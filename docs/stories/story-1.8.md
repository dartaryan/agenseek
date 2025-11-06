# Story 1.8: Create Base Layout Components

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 3  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** reusable layout components (Header, Sidebar, Footer),  
**So that** all pages have consistent navigation and structure.

---

## Acceptance Criteria

**Given** routing is configured  
**When** I create layout components  
**Then**:
- Create `src/components/layout/Header.tsx` with logo, search, theme toggle, user menu, sticky position, responsive
- Create `src/components/layout/Sidebar.tsx` with navigation links, active state, collapsible on mobile, RTL support
- Create `src/components/layout/Footer.tsx` with copyright and help links
- Create `src/app/layout.tsx` combining Header + Sidebar + content + Footer with `<Outlet>`

**And** all protected pages use this layout automatically

---

## Dependencies

**Prerequisites:**
- Story 1.7 (Routing)

---

**Story ID:** SEEK-1.8

