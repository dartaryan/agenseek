# Story 0.17: Add Journey Navigation Button

**Status:** In Progress
**Created:** November 9, 2025
**Epic:** 0 - On-the-Go Stories

---

## User Story

As a user,
I want a dedicated button to access "My Learning Journey" in the main navigation,
So that I can easily navigate to my personalized learning path.

---

## Acceptance Criteria

**Given** I am logged into the application
**When** I view the sidebar navigation
**Then**:
- I see a new navigation item "מסלול הלמידה שלי" (My Learning Journey)
- It appears **FIRST in the navigation** (before Dashboard)
- It uses an appropriate Tabler icon (IconRoute or IconMap2)
- It shows as active when I'm on the `/journey` page
- It follows the same styling as other navigation items
- It includes a keyboard shortcut hint (Alt+0)

**And When** I'm in collapsed sidebar mode
**Then** the journey button also appears in the header navigation

---

## Technical Notes

**Files to Modify:**
1. `src/components/layout/Sidebar.tsx`
   - Add journey navigation item to `navigationItems` array
   - Position: **First in the list** (before dashboard)
   - Icon: `IconRoute` or `IconMap2`
   - Shortcut: `Alt+0`

2. `src/components/layout/HeaderNav.tsx` (if exists)
   - Ensure journey button appears in collapsed mode

3. `src/lib/locale/he.ts`
   - Add Hebrew label: `journey: 'מסלול הלמידה שלי'`

**Dependencies:**
- None

**Testing:**
- [ ] Verify button appears in sidebar
- [ ] Verify button is active on `/journey` route
- [ ] Verify button works in collapsed sidebar mode
- [ ] Verify keyboard shortcut Alt+6 navigates to journey
- [ ] Verify RTL layout is correct

---

## Design Notes

- Use consistent spacing and styling with existing nav items
- Icon should represent journey/path/roadmap concept
- Button should have hover and active states matching other nav items

