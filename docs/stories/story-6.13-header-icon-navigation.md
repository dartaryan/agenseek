# Story 6.13: Implement Smart Header Navigation with Icons

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 5
**Priority:** P0
**Status:** IMPLEMENTED - Ready for Testing
**Implementation Date:** November 8, 2025
**Dependencies:** Story 6.12 (Collapsible Sidebar)

---

## User Story

**As a** user,
**I want** navigation icons with tooltips in the header when the sidebar is collapsed or when scrolling down,
**So that** I can always access navigation without the sidebar taking up screen space, and have a cleaner reading experience.

---

## Problem Context

When the sidebar is collapsed (Story 6.12), users need an alternative way to navigate. Additionally:
- When scrolling down (especially in guides), the sidebar can be distracting
- Reading mode should be as distraction-free as possible
- Guide reading pages don't need the sidebar - only top navigation
- Users want maximum screen space for content without losing access to navigation

Solution: Show navigation icons in the header with tooltips when:
1. Sidebar is manually collapsed
2. User scrolls down (auto-collapse behavior - Story 6.14)
3. User is in guide reading mode (no sidebar at all)

---

## Acceptance Criteria

### Given I am on desktop and the sidebar is collapsed

**When** the page loads
**Then**:
- Header displays compact navigation icons:
  - Positioned between logo and search bar
  - Horizontal row of icon buttons
  - Icons use Tabler Icons (24px size)
  - Minimal spacing (gap-1 or gap-2)
- Navigation icons include:
  - 🏠 Home (IconHome) → /dashboard
  - 📚 Guides (IconBook) → /guides
  - 📝 Notes (IconNotes) → /notes
  - ✅ Tasks (IconChecklist) → /tasks
  - 📊 Progress (IconChartBar) → /progress
- Each icon button:
  - Size: 40x40px (size="icon")
  - Variant: ghost (subtle, no background unless hover)
  - Active state: bg-primary/10, text-primary
  - Hover state: bg-accent
  - Tooltip: Hebrew label on hover
- Active route is highlighted visually

### And when I hover over a navigation icon

**Then**:
- Tooltip appears after 300ms delay:
  - Position: below icon (bottom)
  - Background: dark in light mode, light in dark mode
  - Text: Hebrew navigation label
  - Arrow pointing to icon
  - Example: "דף הבית", "מדריכים", "הערות", "משימות", "התקדמות"

### And when I click a navigation icon

**Then**:
- Navigates to the corresponding page
- Icon updates to active state
- Tooltip disappears
- Page loads normally

### And when sidebar is expanded

**Then**:
- Header navigation icons are hidden (not displayed)
- Only logo, search, and user menu visible in header
- Sidebar provides full navigation

### And when viewing a guide reading page (`/guides/:slug`)

**Then**:
- Sidebar is hidden completely (not just collapsed - removed)
- Header ALWAYS shows navigation icons (regardless of scroll position):
  - Same icons as above
  - Always visible for quick navigation
  - Cannot be toggled off in guide reading mode
- This provides distraction-free reading with accessible navigation

---

## Technical Implementation

### Files to Create/Modify

1. **`src/components/layout/HeaderNav.tsx`** (new) - Header navigation icons
2. **`src/components/layout/Header.tsx`** - Integrate header nav
3. **`src/app/guides/[slug].tsx`** - Guide reader layout (no sidebar)
4. **`src/contexts/SidebarContext.tsx`** - Add `showHeaderNav` state

### Header Navigation Component

```tsx
// src/components/layout/HeaderNav.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconBook, IconNotes, IconChecklist, IconChartBar } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: IconHome, label: 'דף הבית', href: '/dashboard' },
  { icon: IconBook, label: 'מדריכים', href: '/guides' },
  { icon: IconNotes, label: 'הערות', href: '/notes' },
  { icon: IconChecklist, label: 'משימות', href: '/tasks' },
  { icon: IconChartBar, label: 'התקדמות', href: '/progress' },
];

export function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.href);

        return (
          <Tooltip key={item.href} delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.href)}
                className={cn(
                  'h-10 w-10',
                  isActive && 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
```

### Updated Header Component

```tsx
// src/components/layout/Header.tsx
import { HeaderNav } from './HeaderNav';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLocation } from 'react-router-dom';

export function Header() {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  // Show header nav when:
  // 1. Sidebar is collapsed
  // 2. In guide reading mode
  const isGuideReading = location.pathname.startsWith('/guides/') && location.pathname !== '/guides';
  const showHeaderNav = isCollapsed || isGuideReading;

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <img src="/agenseek-icon.svg" alt="Agenseek" className="h-8 w-8" />
          <span className="hidden sm:inline-block font-bold text-lg">Agenseek</span>
        </Link>

        {/* Header Navigation - Shown when sidebar collapsed or in guide mode */}
        {showHeaderNav && <HeaderNav />}

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Nav (Story 6.11) */}
          <MobileNav />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <UserMenu className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
```

### Guide Reader Layout (No Sidebar)

```tsx
// src/app/guides/[slug].tsx (or wrapper component)
export function GuideReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Header with navigation icons */}

      {/* No Sidebar - Full width content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Use this layout for guide reading pages
export function GuideReaderPage() {
  // ... guide content

  return (
    <GuideReaderLayout>
      {/* Guide content here */}
    </GuideReaderLayout>
  );
}
```

### Responsive Header Layout

```tsx
// Responsive layout for header items
<header className="...">
  <div className="container flex h-16 items-center justify-between px-4 gap-4">
    {/* Logo - always visible */}
    <div className="shrink-0">
      <Logo />
    </div>

    {/* Header Nav - desktop only, when sidebar collapsed or guide mode */}
    {showHeaderNav && (
      <div className="hidden md:flex shrink-0">
        <HeaderNav />
      </div>
    )}

    {/* Search - flexible, takes available space */}
    <div className="hidden md:flex flex-1 max-w-md">
      <SearchBar />
    </div>

    {/* Actions - always visible */}
    <div className="flex items-center gap-2 shrink-0">
      <MobileNav />
      <ThemeToggle />
      <UserMenu />
    </div>
  </div>
</header>
```

---

## Design Specifications

### Header Navigation Icons

**Layout:**
- Display: horizontal row (flex)
- Spacing: gap-1 (4px between icons)
- Position: After logo, before search bar
- Alignment: center

**Icon Buttons:**
- Size: 40x40px (h-10 w-10)
- Icon size: 20px (h-5 w-5)
- Variant: ghost (no background by default)
- Border radius: rounded-lg

**States:**
- **Default:** text-muted-foreground, no background
- **Hover:** bg-accent (gray-100 light, gray-800 dark)
- **Active:** bg-primary/10, text-primary (emerald)
- **Focus:** 2px emerald ring (ring-2 ring-primary)

**Tooltips:**
- Position: bottom (below icon)
- Delay: 300ms
- Background: inverted (dark in light mode, light in dark mode)
- Text: Hebrew label, text-sm
- Arrow: pointing to icon
- Z-index: 50 (above all content)

---

## Visibility Logic

### Show Header Navigation When:

1. **Sidebar is manually collapsed** (via collapse button)
   - User chose to hide sidebar
   - Header nav provides alternative

2. **User is in guide reading mode** (`/guides/:slug`)
   - Sidebar is completely hidden (not just collapsed)
   - Header nav always visible for quick navigation
   - Provides distraction-free reading

3. **User scrolls down** (Story 6.14 - Context-Aware Behavior)
   - Sidebar auto-collapses on scroll down
   - Header nav appears
   - Sidebar re-expands on scroll up

### Hide Header Navigation When:

1. **Sidebar is expanded** and user is NOT in guide mode
   - Sidebar provides full navigation
   - Header nav would be redundant

2. **Mobile** (<768px)
   - Mobile nav (Story 6.11) handles navigation
   - Header nav hidden to save space

---

## Testing Checklist

- [ ] Header nav appears when sidebar is collapsed
- [ ] Header nav appears when in guide reading mode
- [ ] Header nav is hidden when sidebar is expanded (non-guide pages)
- [ ] All 5 navigation icons are visible
- [ ] Icons are properly sized (40x40px buttons, 20px icons)
- [ ] Tooltips appear on hover after 300ms
- [ ] Tooltips show correct Hebrew labels
- [ ] Active route is highlighted with emerald background
- [ ] Clicking icons navigates correctly
- [ ] Icons work in light and dark mode
- [ ] Responsive layout doesn't break header
- [ ] Logo, header nav, search, and user menu all fit
- [ ] Mobile (<768px) doesn't show header nav
- [ ] Guide reading mode ALWAYS shows header nav
- [ ] No horizontal overflow on header
- [ ] RTL layout works correctly
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen readers announce icon labels
- [ ] No TypeScript or linter errors

---

## Accessibility Requirements

- [ ] Each icon button has sr-only text with Hebrew label
- [ ] Tooltips have proper aria-describedby
- [ ] Active icon has aria-current="page"
- [ ] Keyboard navigation works (Tab through icons)
- [ ] Enter/Space activates navigation
- [ ] Focus indicator visible (2px emerald ring)
- [ ] Screen reader announces "Navigation" for nav element
- [ ] Tooltips don't interfere with screen readers

---

## Definition of Done

- [ ] Header navigation component implemented
- [ ] Icons appear when sidebar is collapsed
- [ ] Icons always appear in guide reading mode
- [ ] Tooltips work correctly
- [ ] Active state highlights properly
- [ ] Navigation functions correctly
- [ ] Responsive layout works on all desktop sizes
- [ ] Mobile doesn't show header nav (uses mobile nav)
- [ ] No visual regressions
- [ ] No TypeScript or linter errors
- [ ] RTL layout works correctly
- [ ] Accessibility requirements met
- [ ] Code reviewed and committed
- [ ] Ben approves header navigation UX

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Header navigation, icon navigation, guide reading mode

