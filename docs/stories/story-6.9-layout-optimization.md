# Story 6.9: Dashboard and Page Layout Optimization

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 3
**Priority:** P0
**Status:** PENDING
**Dependencies:** Stories 6.1-6.8 (Epic 6 complete)

---

## User Story

**As a** user viewing the dashboard and other pages,
**I want** the content to use more of the available screen space with optimized margins and spacing,
**So that** the interface feels less cramped and I can see more information at once without the layout looking messy.

---

## Problem Context

Currently, the dashboard and other pages have excessive margins that:
- Waste valuable screen real estate
- Make the content feel cramped in the center
- Create a visually unbalanced, messy appearance
- Reduce the amount of visible information
- Don't scale well across different screen sizes

This affects user experience by making the platform feel less professional and harder to scan.

---

## Acceptance Criteria

### Given I am viewing any page in the application

**When** the page loads
**Then**:
- Dashboard content area uses optimal spacing:
  - Desktop (>1024px): 32px side margins (not excessive 64px+)
  - Tablet (768-1024px): 24px side margins
  - Mobile (<768px): 16px side margins
- Main content container has proper max-width:
  - Dashboard: max-width 1600px (current may be too narrow like 1200px)
  - Centered with auto margins for ultra-wide screens
- Card grids have appropriate gaps:
  - Desktop: 24px gap between cards
  - Tablet: 20px gap
  - Mobile: 16px gap
- Sidebar (when visible) doesn't reduce content area excessively:
  - Sidebar width: 240px (not 280px+)
  - Main content starts at sidebar + 24px margin

### And when viewing the dashboard specifically

**Then**:
- Progress widgets, statistics cards, and activity feed use full available width
- 3-column grid on desktop doesn't have excessive side padding
- Cards don't have unnecessary internal padding (optimize to 16-20px)
- Section headers have consistent spacing (mb-6 between sections)

### And when viewing guides library page

**Then**:
- Guide cards grid uses optimal layout:
  - 4 columns on wide screens (>1440px)
  - 3 columns on desktop (1024-1440px)
  - 2 columns on tablet (768-1024px)
  - 1 column on mobile (<768px)
- Filter sidebar width optimized to 220px (not excessive)

### And when viewing notes and tasks pages

**Then**:
- Content grids follow same spacing patterns
- No excessive whitespace between functional areas
- Action buttons and headers properly spaced

---

## Technical Implementation

### Files to Modify

1. **`src/app/layout.tsx`** - Main layout container
2. **`src/app/dashboard/index.tsx`** - Dashboard grid and spacing
3. **`src/app/guides/index.tsx`** - Guides library grid
4. **`src/app/notes/index.tsx`** - Notes page layout
5. **`src/app/tasks/index.tsx`** - Tasks page layout
6. **`src/components/layout/Sidebar.tsx`** - Sidebar width
7. **Global Tailwind classes** - Consistent spacing utilities

### Spacing System

Create consistent spacing variables:
```typescript
// src/lib/layout-constants.ts
export const LAYOUT_SPACING = {
  sidebar: {
    width: 240, // px
  },
  content: {
    maxWidth: 1600, // px for dashboard
    marginDesktop: 32, // px
    marginTablet: 24, // px
    marginMobile: 16, // px
  },
  grid: {
    gapDesktop: 24, // px
    gapTablet: 20, // px
    gapMobile: 16, // px
  },
  card: {
    padding: 20, // px internal
  },
  section: {
    marginBottom: 24, // px between sections
  },
} as const;
```

### Layout Container Update

```tsx
// src/app/layout.tsx
<main className="flex-1 overflow-auto">
  <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1600px]">
    {/* Content with optimized spacing */}
    <Outlet />
  </div>
</main>
```

### Dashboard Grid Optimization

```tsx
// src/app/dashboard/index.tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
  {/* Cards with optimized internal padding */}
</div>
```

### Sidebar Width

```tsx
// src/components/layout/Sidebar.tsx
<aside className="w-60 shrink-0 border-l border-border bg-background">
  {/* Sidebar content - 240px / w-60 */}
</aside>
```

---

## Testing Checklist

- [ ] Dashboard loads with improved spacing on all screen sizes
- [ ] Content doesn't feel cramped or have excessive whitespace
- [ ] Guides library shows 4 columns on wide screens
- [ ] All pages maintain consistent spacing patterns
- [ ] Sidebar width is optimized (240px)
- [ ] No horizontal scrolling on any screen size
- [ ] Content max-width applies correctly (1600px)
- [ ] Mobile spacing is comfortable (16px margins)
- [ ] No visual regressions on existing pages

---

## Definition of Done

- [ ] All spacing updated to use consistent system
- [ ] Layout constants file created and used
- [ ] Dashboard uses full available width effectively
- [ ] All pages tested on desktop, tablet, mobile
- [ ] No TypeScript or linter errors
- [ ] RTL layout still works correctly
- [ ] Code reviewed and committed
- [ ] Deployed to preview environment
- [ ] Ben approves the visual improvements

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Dashboard layout, spacing optimization

