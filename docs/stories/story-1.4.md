# Story 1.4: Install Core Dependencies

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 1  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** all required dependencies installed,  
**So that** I can use routing, state management, animations, icons, and other essential libraries.

---

## Acceptance Criteria

**Given** the project foundation is set up  
**When** I install dependencies listed in architecture spec  
**Then** the following are installed and importable:
- **Routing:** react-router-dom 6.x
- **State:** zustand 4.x
- **Animations:** framer-motion 11.x
- **Icons:** @tabler/icons-react
- **Forms:** react-hook-form, zod, @hookform/resolvers
- **Rich Text:** @tiptap/react, @tiptap/starter-kit
- **Search:** fuse.js
- **Charts:** recharts
- **Dates:** date-fns
- **Backend:** @supabase/supabase-js
- **Dev Tools:** @types/node

**And** I can import any of these libraries without TypeScript errors

---

## Dependencies

**Prerequisites:**
- Story 1.3 (Shadcn/ui configuration)

---

## Technical Notes

Install all packages:
```bash
npm install react-router-dom zustand framer-motion @tabler/icons-react react-hook-form zod @hookform/resolvers @tiptap/react @tiptap/starter-kit fuse.js recharts date-fns @supabase/supabase-js

npm install -D @types/node
```

---

**Story ID:** SEEK-1.4

