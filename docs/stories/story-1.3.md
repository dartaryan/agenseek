# Story 1.3: Install and Configure Shadcn/ui Component System

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 2  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** Shadcn/ui components available in the project,  
**So that** I can use accessible, customizable UI primitives.

---

## Acceptance Criteria

### AC1: Shadcn/ui Initialization

**Given** Tailwind is configured  
**When** I initialize Shadcn/ui  
**Then**:
- Run `npx shadcn-ui@latest init`
- Answer prompts:
  - Style: Default
  - Base color: Slate
  - CSS variables: Yes
  - Directory: src/components/ui
  - Tailwind config: Yes
  - Import alias: @/components
- `components.json` is created
- Path alias `@/` is configured in `tsconfig.json` and `vite.config.ts`
- Can successfully add first component: `npx shadcn-ui@latest add button`

### AC2: Component Usage

**Given** Shadcn/ui is configured  
**When** I import and use `<Button>` component  
**Then** Button renders with emerald primary color

---

## Dependencies

**Prerequisites:**
- Story 1.2 (TailwindCSS configuration)

**Blocks:**
- Story 1.4 (Core dependencies)

---

## Technical Notes

### Implementation Details

1. Initialize Shadcn/ui:
   ```bash
   npx shadcn-ui@latest init
   ```

2. Configure `tsconfig.json` paths:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Configure `vite.config.ts` alias:
   ```typescript
   import path from "path"
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   })
   ```

4. Install base components:
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add label
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add toast
   ```

5. Customize button variants in `src/components/ui/button.tsx` to use emerald primary color

---

## Definition of Done

- ✅ Shadcn/ui initialized with components.json
- ✅ Path aliases configured in tsconfig and vite.config
- ✅ Base components installed (button, card, input, label, dialog, toast)
- ✅ Can import from @/components/ui
- ✅ Button component uses emerald primary color
- ✅ Components render without errors

---

**Created:** November 6, 2025  
**Author:** Bob (Scrum Master)  
**Story ID:** SEEK-1.3

