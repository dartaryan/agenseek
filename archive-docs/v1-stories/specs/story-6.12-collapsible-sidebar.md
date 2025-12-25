# Story 6.12: Build Collapsible Sidebar System

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 4
**Priority:** P0
**Status:** PENDING
**Dependencies:** Story 6.11 (Mobile Navigation)

---

## User Story

**As a** desktop user,
**I want** to collapse and expand the sidebar at any time,
**So that** I can maximize my screen space for content when needed or keep navigation visible when I prefer it.

---

## Problem Context

Currently, the desktop sidebar is always visible and cannot be collapsed:
- Takes up fixed width (240px) at all times
- Reduces available content space
- No user control over navigation visibility
- Not flexible for different user preferences
- Wastes space when user knows where they are

Users need the ability to:
- Toggle sidebar visibility on demand
- Persist their preference
- Have more screen real estate for content when sidebar is collapsed
- Still access navigation when sidebar is collapsed (via header icons)

---

## Acceptance Criteria

### Given I am using the application on desktop (≥768px)

**When** the page loads
**Then**:
- Sidebar is visible by default (expanded state)
- Collapse toggle button is visible:
  - Located at top of sidebar or in header
  - Icon: `IconLayoutSidebarLeftCollapse` (when expanded)
  - Icon: `IconLayoutSidebarLeftExpand` (when collapsed)
  - Tooltip: "כווץ סרגל צד" (Collapse sidebar) / "הרחב סרגל צד" (Expand sidebar)
  - Touch/click target: 40x40px minimum
  - Position: Top-right of sidebar for RTL

### And when I click the collapse button

**Then**:
- Sidebar collapses with smooth animation:
  - Width transitions from 240px to 0px
  - Animation duration: 250ms ease-in-out
  - Navigation items fade out
  - Sidebar border remains
- Main content area expands to fill the space:
  - Smooth width transition (250ms)
  - No content jump or jank
- Collapse button moves to header (or remains visible as small button):
  - Icon changes to "expand" icon
  - Still accessible and visible
- Preference is saved to localStorage:
  - Key: `agenseek_sidebar_collapsed`
  - Value: `true` | `false`

### And when sidebar is collapsed

**Then**:
- Main content uses full width (minus header nav if shown)
- Small expand button is visible:
  - Positioned at left edge (RTL: right edge) of screen
  - Fixed position (doesn't scroll away)
  - Icon-only button with tooltip
  - z-index above content
- OR expand button is in header (see Story 6.13 for header nav)

### And when I click the expand button

**Then**:
- Sidebar expands with smooth animation:
  - Width transitions from 0px to 240px
  - Animation duration: 250ms ease-in-out
  - Navigation items fade in
- Main content area shrinks back:
  - Smooth width transition (250ms)
- Preference is saved to localStorage: `false`

### And when I reload the page

**Then**:
- Sidebar state persists based on localStorage
- If collapsed before, remains collapsed on load
- If expanded before, remains expanded on load
- No flash of wrong state (FOUC prevention)

---

## Technical Implementation

### Files to Create/Modify

1. **`src/hooks/useSidebar.ts`** (new) - Sidebar state management
2. **`src/components/layout/Sidebar.tsx`** - Add collapse functionality
3. **`src/components/layout/Layout.tsx`** - Integrate collapsible state
4. **`src/contexts/SidebarContext.tsx`** (new) - Global sidebar state
5. **`src/lib/storage.ts`** - localStorage utilities

### Sidebar Context

```tsx
// src/contexts/SidebarContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('agenseek_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('agenseek_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed(prev => !prev);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, collapse, expand }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
```

### Collapsible Sidebar Component

```tsx
// src/components/layout/Sidebar.tsx
import { useSidebar } from '@/contexts/SidebarContext';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'shrink-0 border-l border-border bg-background transition-all duration-250 ease-in-out',
          'hidden md:flex md:flex-col', // Hidden on mobile
          isCollapsed ? 'w-0 overflow-hidden' : 'w-60' // 240px when expanded
        )}
      >
        {/* Collapse button inside sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">ניווט</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggle}>
                  <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>כווץ סרגל צד</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation items */}
        {!isCollapsed && (
          <nav className="flex-1 p-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    'hover:bg-accent',
                    isActive && 'bg-primary/10 text-primary font-semibold'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </aside>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggle}
                className="rounded-l-lg rounded-r-none shadow-lg"
              >
                <IconLayoutSidebarLeftExpand className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">הרחב סרגל צד</TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  );
}
```

### Main Layout Integration

```tsx
// src/app/layout.tsx
import { SidebarProvider } from '@/contexts/SidebarContext';

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex">
          <Sidebar />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1600px] py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

### CSS for Smooth Transition

```css
/* src/styles/globals.css */

/* Sidebar collapse transition */
aside {
  transition: width 250ms ease-in-out;
}

/* Content area expansion */
main {
  transition: margin-left 250ms ease-in-out; /* LTR */
  transition: margin-right 250ms ease-in-out; /* RTL */
}

/* Fade in/out for sidebar content */
aside > * {
  transition: opacity 200ms ease-in-out;
}

aside.collapsed > * {
  opacity: 0;
}
```

---

## Design Specifications

### Sidebar States

**Expanded:**
- Width: 240px (w-60)
- Content visible
- Navigation items displayed
- Collapse button visible

**Collapsed:**
- Width: 0px
- Content hidden (overflow-hidden)
- Expand button visible at edge
- Main content uses full width

### Animations

- Transition duration: 250ms
- Easing: ease-in-out
- No jank or content jump
- Smooth width transition
- Fade content in/out

### Button Specifications

**Collapse Button (in sidebar):**
- Size: 40x40px
- Icon: IconLayoutSidebarLeftCollapse
- Position: Top-right of sidebar (RTL)
- Variant: ghost

**Expand Button (when collapsed):**
- Size: 40x40px
- Icon: IconLayoutSidebarLeftExpand
- Position: Fixed at right edge, vertically centered (RTL)
- Variant: outline with shadow
- Rounded: left side only (rounded-l-lg)

---

## Testing Checklist

- [ ] Sidebar can be collapsed by clicking button
- [ ] Sidebar can be expanded by clicking button
- [ ] Animation is smooth (250ms, no jank)
- [ ] Content area expands/shrinks smoothly
- [ ] Preference persists across page reloads
- [ ] Expand button is accessible when collapsed
- [ ] Tooltips show on collapse/expand buttons
- [ ] No horizontal scrolling introduced
- [ ] Works in light and dark mode
- [ ] RTL layout behaves correctly
- [ ] Keyboard accessible (focus, Enter/Space)
- [ ] No flash of unstyled content (FOUC)
- [ ] Works across all pages (dashboard, guides, notes, tasks)
- [ ] Mobile (<768px) doesn't show collapse functionality (mobile nav only)
- [ ] No TypeScript or linter errors

---

## Accessibility Requirements

- [ ] Collapse/expand buttons have aria-labels
- [ ] Sidebar state communicated to screen readers
- [ ] Expand button has proper aria-label when collapsed
- [ ] Tooltips have proper role and aria-describedby
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicator visible on buttons (2px emerald ring)
- [ ] Screen reader announces "Sidebar collapsed" / "Sidebar expanded"

---

## Definition of Done

- [ ] Sidebar can be collapsed and expanded
- [ ] Smooth animations implemented (250ms)
- [ ] State persists in localStorage
- [ ] Expand button visible and accessible when collapsed
- [ ] No content jump or jank during transition
- [ ] Mobile doesn't show collapse functionality
- [ ] All pages work with collapsed/expanded state
- [ ] No TypeScript or linter errors
- [ ] RTL layout works correctly
- [ ] Accessibility requirements met
- [ ] Code reviewed and committed
- [ ] Ben approves collapsible sidebar behavior

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Collapsible sidebar, user preference

