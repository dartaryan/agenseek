# Story 1.11: Full Hebrew Localization (No English)

**Epic:** Epic 1 - Project Foundation & Infrastructure
**Sprint:** 1 (Retroactive - Critical Fix)
**Story Points:** 3
**Priority:** P0 (Critical)
**Dependencies:** Story 1.8 (Layout Components)

---

## User Story

As a Hebrew-speaking user,
I want the entire application interface in Hebrew with Tabler Icons,
So that I can use the platform in my native language without any English text or emojis.

---

## Business Context

**Problem:** Current implementation has:
1. ❌ Emojis in sidebar navigation (📊 📚 📝 ✅ 👤 ⚙️ 🔧)
2. ❌ All UI text in English (sidebar, header, buttons)
3. ❌ Inconsistent with project requirement: "Hebrew-first, RTL platform"

**Impact:**
- Poor user experience for Hebrew speakers
- Violates no-emoji policy
- Contradicts project brief (Hebrew internal platform)

**Solution:**
- Replace ALL emojis with Tabler Icons
- Translate ALL UI text to Hebrew
- Create centralized Hebrew locale file

---

## Acceptance Criteria

### Given I am using the application
### When I view any part of the UI
### Then I should see:

1. **Sidebar Navigation - Hebrew + Icons:**
   - ✅ "לוח בקרה" (Dashboard) with IconLayoutDashboard
   - ✅ "מדריכים" (Guides) with IconBooks
   - ✅ "הערות" (Notes) with IconNote
   - ✅ "משימות" (Tasks) with IconChecklist
   - ✅ "פרופיל" (Profile) with IconUser
   - ✅ "הגדרות" (Settings) with IconSettings
   - ✅ "ניהול" (Admin) with IconShieldCog
   - ✅ NO emojis anywhere

2. **Sidebar Help Section - Hebrew:**
   - ✅ "צריכים עזרה?" (Need Help?)
   - ✅ "עיינו במדריכים או שאלו את הקהילה" (Check out our guides or ask the community)
   - ✅ "עיון במדריכים ←" (Browse Guides ←)

3. **Header - Hebrew:**
   - ✅ "חיפוש מדריכים..." (Search guides...) placeholder
   - ✅ "התנתקות" (Logout) button
   - ✅ Keep "Agenseek" logo (brand name, no translation)

4. **Code Quality:**
   - ✅ Create `src/lib/locale/he.ts` with all Hebrew strings
   - ✅ Import Tabler Icons (7 icons total)
   - ✅ Update Sidebar.tsx to use icons + Hebrew
   - ✅ Update Header.tsx to use Hebrew
   - ✅ No hardcoded English strings in components
   - ✅ Type-safe locale strings with TypeScript interface

5. **Verification:**
   - ✅ Zero emojis in entire codebase
   - ✅ Zero English UI text (except brand name)
   - ✅ Build passes with no errors
   - ✅ Visual inspection confirms Hebrew + icons

---

## Technical Implementation

### Step 1: Create Hebrew Locale File

**File:** `src/lib/locale/he.ts`

```typescript
/**
 * Hebrew Locale Strings
 *
 * Centralized Hebrew translations for the entire application.
 * RTL (Right-to-Left) text direction is handled by CSS (dir="rtl").
 */

export interface LocaleStrings {
  // Navigation
  nav: {
    dashboard: string;
    guides: string;
    notes: string;
    tasks: string;
    profile: string;
    settings: string;
    admin: string;
  };

  // Sections
  sections: {
    administration: string;
    help: string;
  };

  // Common actions
  actions: {
    logout: string;
    search: string;
    browseGuides: string;
  };

  // Help section
  help: {
    title: string;
    description: string;
    browseLink: string;
  };
}

export const hebrewLocale: LocaleStrings = {
  nav: {
    dashboard: 'לוח בקרה',
    guides: 'מדריכים',
    notes: 'הערות',
    tasks: 'משימות',
    profile: 'פרופיל',
    settings: 'הגדרות',
    admin: 'ניהול',
  },

  sections: {
    administration: 'ניהול',
    help: 'עזרה',
  },

  actions: {
    logout: 'התנתקות',
    search: 'חיפוש מדריכים...',
    browseGuides: 'עיון במדריכים',
  },

  help: {
    title: 'צריכים עזרה?',
    description: 'עיינו במדריכים או שאלו את הקהילה',
    browseLink: 'עיון במדריכים ←',
  },
};
```

---

### Step 2: Update Sidebar with Icons + Hebrew

**File:** `src/components/layout/Sidebar.tsx`

**Changes:**
1. Import 7 Tabler Icons
2. Import Hebrew locale
3. Replace emoji strings with icon components
4. Replace English strings with Hebrew

**Icon Mapping:**
- Dashboard: `IconLayoutDashboard`
- Guides: `IconBooks`
- Notes: `IconNote`
- Tasks: `IconChecklist`
- Profile: `IconUser`
- Settings: `IconSettings`
- Admin: `IconShieldCog`

**Before:**
```typescript
const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  // ...
];
```

**After:**
```typescript
import { IconLayoutDashboard, IconBooks, IconNote, IconChecklist, IconUser, IconSettings, IconShieldCog } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';

const navigationItems: NavItem[] = [
  { name: hebrewLocale.nav.dashboard, href: '/dashboard', icon: IconLayoutDashboard },
  { name: hebrewLocale.nav.guides, href: '/guides', icon: IconBooks },
  // ...
];
```

**Render:**
```typescript
<Icon className="w-5 h-5" stroke={1.5} />
```

---

### Step 3: Update Header with Hebrew

**File:** `src/components/layout/Header.tsx`

**Changes:**
1. Import Hebrew locale
2. Replace "Logout" → "התנתקות"
3. Replace "Search guides..." → "חיפוש מדריכים..."
4. Keep "Agenseek" logo (brand name)

---

### Step 4: Verify No Emojis Remain

Run grep to ensure zero emojis:
```bash
grep -r "[😀-🙏🌀-🗿🚀-🛿]" src/
```

Expected result: No matches

---

## Files to Modify

1. **CREATE:** `src/lib/locale/he.ts` (new file)
2. **UPDATE:** `src/components/layout/Sidebar.tsx`
3. **UPDATE:** `src/components/layout/Header.tsx`

---

## Testing Checklist

- [ ] Visual inspection: All sidebar items show Tabler Icons
- [ ] Visual inspection: All text in Hebrew (except "Agenseek" brand)
- [ ] Grep search: Zero emojis found in `src/`
- [ ] Grep search: Zero English UI strings in Sidebar/Header
- [ ] Build passes: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`

---

## Visual Design

### Sidebar Navigation (After):

```
┌─────────────────────────┐
│  📊 לוח בקרה            │ → [icon] IconLayoutDashboard
│  📚 מדריכים             │ → [icon] IconBooks
│  📝 הערות               │ → [icon] IconNote
│  ✅ משימות              │ → [icon] IconChecklist
│  👤 פרופיל              │ → [icon] IconUser
│  ⚙️ הגדרות              │ → [icon] IconSettings
├─────────────────────────┤
│  ניהול                  │ (section title)
│  🔧 ניהול               │ → [icon] IconShieldCog
├─────────────────────────┤
│  צריכים עזרה?           │
│  עיינו במדריכים...      │
│  [עיון במדריכים ←]     │
└─────────────────────────┘
```

All icons are from `@tabler/icons-react` with stroke={1.5}, size w-5 h-5

---

## Definition of Done

- [ ] All emojis removed from codebase
- [ ] All UI text in Hebrew (except brand name)
- [ ] Hebrew locale file created and typed
- [ ] Sidebar uses 7 Tabler Icons
- [ ] Header text in Hebrew
- [ ] Build succeeds
- [ ] Visual verification complete
- [ ] Code review approved

---

## Notes

**Why This Matters:**
- Hebrew is the PRIMARY language for this internal platform
- Emojis are unprofessional and inconsistent
- Tabler Icons provide scalable, theme-aware, accessible icons
- Centralized locale file enables future i18n if needed

**Related:**
- Product Brief: "Internal employees" (Hebrew speakers)
- Epic 1.2: RTL support already configured
- Memory created: "No-emojis policy for Agenseek"

---

**Priority:** P0 - Must fix before continuing with new features
**Estimated Time:** 1-2 hours
**Assigned To:** Current developer

