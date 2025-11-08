# Story 6.14: Implement Context-Aware Navigation Behavior

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 4
**Priority:** P1
**Status:** PENDING
**Dependencies:** Story 6.13 (Header Icon Navigation)

---

## User Story

**As a** user,
**I want** the sidebar to automatically collapse when I scroll down and expand when I scroll up,
**So that** I have maximum screen space for content while reading but can easily access navigation when needed.

---

## Problem Context

When reading content (guides, notes, long pages), the sidebar takes up valuable screen space:
- Reduces content width
- Can be distracting while focused on reading
- Takes attention away from main content
- Users scroll down to read, scroll up to navigate

Smart auto-collapse behavior:
- Scroll down → sidebar collapses, header nav appears → more reading space
- Scroll up → sidebar re-expands → easy navigation access
- User can still manually toggle sidebar at any time
- Provides smooth, intuitive experience

---

## Acceptance Criteria

### Given I am on a page with sidebar (NOT guide reading mode)

**When** I scroll down more than 100px
**Then**:
- Sidebar automatically collapses:
  - Smooth animation (250ms ease-in-out)
  - Width transitions from 240px to 0px
  - Content expands to fill space
- Header navigation icons appear:
  - Fade in animation (200ms)
  - Provide alternative navigation
- User's manual preference is respected:
  - If user manually collapsed, stays collapsed
  - If user manually expanded, auto-collapse still happens
  - Manual action takes precedence until next page load

**And when** I scroll up more than 50px
**Then**:
- Sidebar automatically re-expands (if not manually collapsed):
  - Smooth animation (250ms ease-in-out)
  - Width transitions from 0px to 240px
  - Content shrinks back
- Header navigation icons fade out (200ms)
- Original sidebar navigation is restored

### And when I manually collapse the sidebar

**Then**:
- Sidebar stays collapsed regardless of scroll direction
- Manual collapse preference overrides auto-collapse behavior
- Header nav remains visible
- Sidebar doesn't re-expand on scroll up until manually expanded

### And when I manually expand the sidebar

**Then**:
- Sidebar is expanded immediately
- Auto-collapse behavior resumes:
  - Will auto-collapse on scroll down
  - Will re-expand on scroll up
- User can continue reading with smart behavior

### And when viewing guide reading mode (`/guides/:slug`)

**Then**:
- Auto-collapse behavior is disabled (sidebar doesn't exist)
- Header nav is always visible
- This story's scroll behavior doesn't apply to guide pages

### And when on mobile (<768px)

**Then**:
- Auto-collapse behavior is disabled (no sidebar on mobile)
- Mobile nav (hamburger) provides navigation
- Scroll behavior doesn't affect navigation

---

## Technical Implementation

### Files to Create/Modify

1. **`src/hooks/useScrollDirection.ts`** (new) - Detect scroll direction
2. **`src/contexts/SidebarContext.tsx`** - Add auto-collapse logic
3. **`src/components/layout/Sidebar.tsx`** - Integrate scroll behavior
4. **`src/app/layout.tsx`** - Apply scroll detection

### Scroll Direction Hook

```tsx
// src/hooks/useScrollDirection.ts
import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  threshold?: number; // Minimum scroll amount to trigger
  enabled?: boolean; // Enable/disable hook
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 50, enabled = true } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY, threshold, enabled]);

  return scrollDirection;
}
```

### Enhanced Sidebar Context with Auto-Collapse

```tsx
// src/contexts/SidebarContext.tsx
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useLocation } from 'react-router-dom';

interface SidebarContextType {
  isCollapsed: boolean;
  isManuallyControlled: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('agenseek_sidebar_collapsed');
    return saved === 'true';
  });
  const [isManuallyControlled, setIsManuallyControlled] = useState(false);
  const location = useLocation();
  const scrollDirection = useScrollDirection({ threshold: 50 });

  // Determine if we're in guide reading mode
  const isGuideReading = location.pathname.startsWith('/guides/') &&
                         location.pathname !== '/guides';

  // Auto-collapse on scroll down, expand on scroll up
  useEffect(() => {
    // Don't auto-collapse if:
    // 1. User manually controlled
    // 2. In guide reading mode (no sidebar)
    // 3. On mobile
    if (isManuallyControlled || isGuideReading) return;

    const handleAutoCollapse = () => {
      const scrollY = window.scrollY;

      if (scrollDirection === 'down' && scrollY > 100) {
        // Auto-collapse when scrolling down past 100px
        setIsCollapsed(true);
      } else if (scrollDirection === 'up' && scrollY > 0) {
        // Auto-expand when scrolling up
        setIsCollapsed(false);
      }
    };

    handleAutoCollapse();
  }, [scrollDirection, isManuallyControlled, isGuideReading]);

  const toggle = () => {
    setIsCollapsed(prev => !prev);
    setIsManuallyControlled(true); // Mark as manually controlled
    // Save preference
    localStorage.setItem('agenseek_sidebar_collapsed', String(!isCollapsed));
  };

  const collapse = () => {
    setIsCollapsed(true);
    setIsManuallyControlled(true);
    localStorage.setItem('agenseek_sidebar_collapsed', 'true');
  };

  const expand = () => {
    setIsCollapsed(false);
    setIsManuallyControlled(false); // Re-enable auto-collapse
    localStorage.setItem('agenseek_sidebar_collapsed', 'false');
  };

  // Reset manual control when changing pages
  useEffect(() => {
    setIsManuallyControlled(false);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isManuallyControlled, toggle, collapse, expand }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
```

### Usage in Layout

```tsx
// src/app/layout.tsx
import { SidebarProvider } from '@/contexts/SidebarContext';

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex">
          {/* Sidebar with auto-collapse behavior */}
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

---

## Design Specifications

### Scroll Thresholds

- **Auto-collapse threshold:** 100px scroll down
  - Below 100px: Sidebar stays expanded
  - Above 100px while scrolling down: Sidebar collapses
- **Auto-expand threshold:** 50px scroll up
  - Any scroll up movement triggers re-expansion
  - Provides quick access to navigation

### Animations

- **Sidebar collapse/expand:** 250ms ease-in-out
- **Header nav fade in/out:** 200ms ease-in-out
- **Content width adjustment:** 250ms ease-in-out
- All animations synchronized for smooth transition

### Behavior States

**Auto-Collapse Mode (Default):**
- Sidebar responds to scroll direction
- Collapses on scroll down (>100px)
- Expands on scroll up
- Header nav shows/hides accordingly

**Manual Control Mode:**
- Triggered when user clicks collapse/expand button
- Auto-collapse disabled
- Sidebar stays in chosen state regardless of scroll
- Reset to auto-collapse on page navigation

**Guide Reading Mode:**
- No sidebar at all (removed from DOM)
- No auto-collapse behavior
- Header nav always visible
- Maximum reading space

---

## Testing Checklist

- [ ] Sidebar auto-collapses when scrolling down >100px
- [ ] Sidebar auto-expands when scrolling up
- [ ] Animation is smooth (250ms, no jank)
- [ ] Header nav appears/disappears correctly
- [ ] Manual collapse overrides auto-collapse
- [ ] Manual expand re-enables auto-collapse
- [ ] Auto-collapse resets on page navigation
- [ ] Guide reading mode has no auto-collapse (no sidebar)
- [ ] Mobile has no auto-collapse behavior
- [ ] Scroll threshold (100px down, 50px up) works correctly
- [ ] No performance issues (scroll is smooth)
- [ ] Request animation frame prevents jank
- [ ] Debouncing/throttling works correctly
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Works in light and dark mode
- [ ] RTL layout behaves correctly
- [ ] No horizontal scrolling introduced
- [ ] No TypeScript or linter errors

---

## Performance Considerations

1. **Scroll Event Optimization:**
   - Use `requestAnimationFrame` to batch updates
   - Threshold prevents excessive state changes
   - Ticking flag prevents multiple RAF calls

2. **State Updates:**
   - Minimize re-renders
   - Only update when scroll direction changes significantly
   - Use proper cleanup in useEffect

3. **Animation Performance:**
   - Use CSS transitions (GPU accelerated)
   - Avoid JavaScript-based animations
   - Transform and opacity are performant properties

---

## Accessibility Requirements

- [ ] Auto-collapse doesn't interfere with keyboard navigation
- [ ] Screen reader announces when sidebar state changes
- [ ] Manual controls remain accessible during auto-collapse
- [ ] Focus management handled correctly
- [ ] Keyboard users can disable auto-collapse if desired
- [ ] Respects `prefers-reduced-motion` (disable auto-collapse)

---

## Definition of Done

- [ ] Auto-collapse behavior implemented
- [ ] Scrolling down collapses sidebar smoothly
- [ ] Scrolling up expands sidebar smoothly
- [ ] Manual controls override auto-collapse
- [ ] Auto-collapse resets on page navigation
- [ ] Guide reading mode unaffected (no sidebar)
- [ ] Mobile unaffected (no auto-collapse)
- [ ] Performance is smooth (no scroll lag)
- [ ] Animations are synchronized
- [ ] No TypeScript or linter errors
- [ ] RTL layout works correctly
- [ ] Accessibility requirements met
- [ ] Code reviewed and committed
- [ ] Ben approves context-aware navigation behavior

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Auto-collapse sidebar, scroll behavior, smart navigation

