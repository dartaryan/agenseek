# Story 6.11: Implement Mobile Navigation System

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 3
**Priority:** P0
**Status:** PENDING
**Dependencies:** Story 6.10 (Statistics Fix)

---

## User Story

**As a** mobile user,
**I want** a dedicated mobile navigation system to access all sections (dashboard, guides, notes, tasks, profile),
**So that** I can easily navigate the application on my phone without relying on the desktop sidebar.

---

## Problem Context

Currently, mobile users (<768px) don't have an optimal way to navigate between main sections:
- Desktop sidebar doesn't adapt well to mobile
- No mobile-specific navigation menu
- Hamburger menu may be missing or poorly implemented
- Touch targets may be too small
- Navigation is hidden or hard to access

This makes the mobile experience frustrating and limits discoverability of features.

---

## Acceptance Criteria

### Given I am using the application on mobile (<768px)

**When** I load any page
**Then**:
- Header displays mobile-optimized layout:
  - Agenseek logo (smaller, 32px height)
  - Hamburger menu icon (right side for RTL, left for LTR)
  - User avatar/profile button
  - All buttons are touch-friendly (min 44x44px)
- Hamburger icon uses Tabler `IconMenu2` (three horizontal lines)
- User avatar is small (32px) and clickable

### And when I tap the hamburger menu

**Then**:
- Navigation drawer opens from the right (RTL layout):
  - Smooth slide-in animation (300ms ease-out)
  - Semi-transparent backdrop dims the page (bg-black/50)
  - Drawer width: 280px
  - Full height drawer with close button at top
- Drawer contains navigation menu:
  - **Header Section:**
    - Close button (IconX) in top-right
    - User name and avatar
    - "פרופיל" (Profile) link
  - **Main Navigation:**
    - 🏠 "דף הבית" (Dashboard) - /dashboard
    - 📚 "מדריכים" (Guides) - /guides
    - 📝 "הערות" (Notes) - /notes
    - ✅ "משימות" (Tasks) - /tasks
    - 📊 "התקדמות" (Progress) - /progress
    - ⚙️ "הגדרות" (Settings) - /settings
  - **Footer Section:**
    - Theme toggle (light/dark)
    - Help link
    - Sign out button
- Active route is highlighted with emerald background
- Each nav item has:
  - Icon (Tabler Icons, 24px)
  - Label (text-base, 16px)
  - Touch-friendly padding (py-3 px-4)
- Tapping backdrop or close button closes drawer
- Tapping a nav item navigates and closes drawer

### And when drawer is open

**Then**:
- Page scroll is locked (overflow-hidden on body)
- Drawer has proper z-index (above all content, z-50)
- Focus is trapped within drawer (accessibility)
- ESC key closes drawer
- Smooth animations for open/close

---

## Technical Implementation

### Files to Create/Modify

1. **`src/components/layout/MobileNav.tsx`** (new) - Mobile drawer component
2. **`src/components/layout/Header.tsx`** - Add hamburger button for mobile
3. **`src/app/layout.tsx`** - Integrate MobileNav
4. **`src/hooks/useMobileNav.ts`** (new) - Mobile nav state management

### Mobile Navigation Component

```tsx
// src/components/layout/MobileNav.tsx
import { IconMenu2, IconX, IconHome, IconBook, IconNotes, IconChecklist, IconChartBar, IconSettings, IconLogout } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
  { icon: IconSettings, label: 'הגדרות', href: '/settings' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleNavClick = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <IconMenu2 className="h-6 w-6" />
          <span className="sr-only">פתח תפריט ניווט</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[280px] p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-right">
              <p className="font-semibold">{user?.displayName}</p>
              <button
                onClick={() => handleNavClick('/profile')}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                צפה בפרופיל
              </button>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-col p-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors',
                  'hover:bg-accent',
                  isActive && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t p-4 space-y-2">
          <ThemeToggle />

          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <IconLogout className="h-5 w-5" />
            <span>התנתק</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### Header Integration

```tsx
// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/agenseek-icon.svg" alt="Agenseek" className="h-8 w-8" />
          <span className="hidden sm:inline-block font-bold text-lg">Agenseek</span>
        </Link>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Nav */}
          <MobileNav />

          {/* Desktop User Menu */}
          <UserMenu className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
```

### Shadcn Sheet Component

If `Sheet` component doesn't exist, install it:
```bash
npx shadcn-ui@latest add sheet
```

This provides the drawer/sheet component with proper animations and accessibility.

---

## Design Specifications

### Mobile Nav Drawer

- **Width:** 280px
- **Animation:** Slide from right, 300ms ease-out
- **Backdrop:** bg-black/50
- **Nav Item Height:** 48px (py-3)
- **Touch Target:** Minimum 44x44px
- **Icon Size:** 24px (h-6 w-6)
- **Font Size:** 16px (text-base)
- **Active State:** bg-primary/10, text-primary, font-semibold
- **Hover State:** bg-accent

### Colors

- Active: emerald (primary color)
- Hover: accent (gray-100 light, gray-800 dark)
- Text: foreground
- Border: border (gray-200 light, gray-700 dark)

---

## Testing Checklist

- [ ] Hamburger menu appears on mobile (<768px)
- [ ] Tapping hamburger opens drawer from right
- [ ] Drawer slides in smoothly (300ms)
- [ ] Backdrop dims the page
- [ ] All navigation items are visible and tappable
- [ ] Active route is highlighted in emerald
- [ ] Tapping nav item navigates and closes drawer
- [ ] Tapping backdrop closes drawer
- [ ] Close button (X) closes drawer
- [ ] ESC key closes drawer
- [ ] Page scroll is locked when drawer is open
- [ ] User avatar and name display correctly
- [ ] Sign out button works
- [ ] Theme toggle works
- [ ] No navigation on desktop (only <768px)
- [ ] Touch targets are at least 44x44px
- [ ] Drawer has proper z-index (above content)
- [ ] Focus trap works (tab doesn't escape drawer)
- [ ] Screen reader announces drawer opening/closing

---

## Accessibility Requirements

- [ ] All buttons have proper aria-labels
- [ ] Sheet has role="dialog"
- [ ] Focus is moved to drawer when opened
- [ ] Focus returns to trigger when closed
- [ ] Keyboard navigation works (Tab, Shift+Tab, ESC)
- [ ] Screen reader announces "Navigation menu" when opened
- [ ] Active route announced as "current page"
- [ ] Hamburger has sr-only text "פתח תפריט ניווט"

---

## Definition of Done

- [ ] Mobile navigation drawer implemented
- [ ] All nav items navigate correctly
- [ ] Animations are smooth
- [ ] Touch targets are adequately sized
- [ ] Active state highlights correctly
- [ ] Drawer closes on navigation
- [ ] Backdrop click closes drawer
- [ ] ESC key closes drawer
- [ ] No TypeScript or linter errors
- [ ] RTL layout works correctly
- [ ] Accessibility requirements met
- [ ] Tested on real mobile devices (iOS/Android)
- [ ] Code reviewed and committed
- [ ] Ben approves mobile navigation UX

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Mobile navigation, hamburger menu

