# Story 0.10.1: Journey Page Core & Data Layer

**Parent Story:** Story 0.10 - My Learning Journey (מסלול הלמידה שלי)
**Status:** ✅ COMPLETE
**Type:** On-the-Go Story (User Experience Enhancement)
**Priority:** P1 - Important
**Sprint:** TBD | **Points:** 2-3 (Small-Medium)
**Created:** November 9, 2025
**Completed:** November 9, 2025

---

## 🎯 Objective

Build the foundation of the learning journey system: route, page structure, data fetching logic, phase cards, and mobile responsiveness. This story focuses on **functionality over aesthetics** - animations and gamification come in later sub-stories.

---

## 📖 User Story

**As a user who completed onboarding,**
**I want to see my learning journey organized by phases,**
**So that I know which guides to read next and track my progress through each phase.**

---

## ✅ Acceptance Criteria

### 1. Dashboard Journey Card

**Given** I'm on the dashboard
**When** I view the page
**Then:**

- [ ] New prominent card appears: **"מסלול הלמידה שלי"** (My Learning Journey)
- [ ] Card shows current phase name and progress (e.g., "מדריכי ליבה - 2/2 הושלמו")
- [ ] Card displays mini visual roadmap with 4 phases (simple icons, no animations)
- [ ] Current phase is highlighted with emerald color
- [ ] Completed phases show checkmarks
- [ ] Locked phases show lock icons
- [ ] Overall journey progress percentage displayed (e.g., "התקדמות כוללת: 35%")
- [ ] Primary button: "המשך במסלול" (Continue Journey) → navigates to `/journey`
- [ ] Card uses consistent design system (rounded-xl, shadow, hover effects)

---

### 2. Journey Page (`/journey`) - Hero Section

**Given** I navigate to `/journey`
**When** the page loads
**Then:**

- [ ] Page title: **"מסלול הלמידה שלי"**
- [ ] Subtitle explains: "נתיב למידה מותאם אישית לפי התפקיד והעניינים שלך"
- [ ] Hero section shows:
  - Large circular progress indicator (120px) with overall completion %
  - Stats breakdown:
    - מדריכים שהושלמו: X/Y
    - זמן קריאה משוער: ~XX שעות
    - התקדמות שבועית: +X% (calculated from user_progress timestamps)
- [ ] Responsive: stacks vertically on mobile

**Note:** No Framer Motion animations in this sub-story - just static layout.

---

### 3. Journey Page - Visual Roadmap (4 Phases) - Basic Structure

**Given** I'm viewing the journey page
**When** I scroll to the roadmap section
**Then:**

**Phase Structure:**
Each phase displays as a large card section with:

#### **Phase 1: מדריכי ליבה (Core Guides)**
- [ ] Gradient header: Emerald (bg-gradient-to-br from-emerald-500 to-emerald-600)
- [ ] Icon: IconBook (Tabler)
- [ ] Title: "מדריכי ליבה"
- [ ] Description: "יסודות חיוניים להתחלת עבודה עם BMAD - כל משתמש צריך לקרוא"
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, emerald fill) - **no animation yet**
- [ ] Status badge:
  - Completed: "הושלם! ✓" (green)
  - In Progress: "בתהליך" (blue)
  - Locked: "🔒 ננעל - השלם את הליבה תחילה" (gray)
- [ ] Estimated time: "זמן משוער: ~45 דקות"
- [ ] List of guides in this phase (expandable accordion):
  - Each guide shows: title, description, progress %, action button
  - Completed guides: checkmark + "קרא שוב" button
  - Current guide: highlighted with emerald border + "המשך" button
  - Upcoming guides: "התחל" button
  - Locked guides: grayed out + lock icon

#### **Phase 2: מומלץ עבורך (Recommended for Your Role)**
- [ ] Gradient header: Purple (bg-gradient-to-br from-purple-500 to-purple-600)
- [ ] Icon: IconStar (Tabler)
- [ ] Title: "מומלץ עבורך"
- [ ] Description: Dynamic based on role:
  - Developer: "מדריכים מותאמים למפתחים - תהליכי עבודה, agents, workflows"
  - PM: "מדריכים למנהלי מוצר - תכנון, אסטרטגיה, ניהול"
  - (etc. for each role)
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, purple fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת מדריכי הליבה"
- [ ] Status badge (same as Phase 1)
- [ ] Expandable guide list (same structure as Phase 1)

#### **Phase 3: תחומי העניין שלך (Your Interests)**
- [ ] Gradient header: Blue (bg-gradient-to-br from-blue-500 to-blue-600)
- [ ] Icon: IconHeart (Tabler)
- [ ] Title: "תחומי העניין שלך"
- [ ] Description: Dynamic based on interests from onboarding
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, blue fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת 50% מהמומלצים"
- [ ] Status badge (same as Phase 1)
- [ ] Expandable guide list

#### **Phase 4: חקור עוד (Explore More - Optional)**
- [ ] Gradient header: Orange (bg-gradient-to-br from-orange-500 to-orange-600)
- [ ] Icon: IconDots (Tabler)
- [ ] Title: "חקור עוד"
- [ ] Description: "מדריכים נוספים להעמקה - חקור לפי העניין שלך"
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, orange fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת המומלצים ותחומי העניין"
- [ ] Status badge (same as Phase 1)
- [ ] Note: "מדריכים אלו אופציונליים - אין חובה להשלים הכל"
- [ ] Expandable guide list

---

### 4. Mobile Responsive Design

**Given** I'm on mobile (<640px)
**When** viewing the journey page
**Then:**

- [ ] Hero stats stack vertically
- [ ] Phase cards full width (w-full)
- [ ] Phase cards stack vertically
- [ ] Guide lists within phases stack vertically
- [ ] Accordion auto-closes previous when opening new (mobile space optimization)
- [ ] Touch-friendly tap targets (min 44x44px)

---

### 5. Journey State Persistence

**Given** I navigate away from journey page
**When** I return later
**Then:**

- [ ] Journey state restored from database (user_progress)
- [ ] Current phase remembered
- [ ] Scroll position restored to current phase
- [ ] Expanded/collapsed accordion states remembered (localStorage)
- [ ] No re-calculation needed (data cached in React state)

---

## 🔧 Technical Implementation

### New Route

**File:** `src/app/routes.tsx`

Add to protected routes:
```typescript
{
  path: '/journey',
  element: <JourneyPage />,
  requiresAuth: true,
}
```

---

### New Page Component

**File:** `src/app/journey/index.tsx`

Component structure:
```
JourneyPage
├── JourneyHero (overall progress)
├── JourneyRoadmap (4 phases)
│   ├── PhaseCard (x4)
│   │   ├── PhaseHeader (icon, title, description)
│   │   ├── PhaseProgress (bar + stats)
│   │   ├── PhaseStatus (badge)
│   │   └── PhaseGuides (accordion with guide list)
│   │       └── GuideItem (x N)
│   │           ├── GuideInfo
│   │           ├── GuideProgress
│   │           └── GuideAction (button)
│   └── ConnectingLine (simple vertical line, no animations yet)
└── JourneyCTA (motivational message + action)
```

---

### Dashboard Widget

**File:** `src/components/dashboard/JourneyPreviewCard.tsx`

Shows mini journey state on dashboard with navigation to full journey page.

---

### Data Layer

**File:** `src/lib/journey.ts`

Core data fetching and calculation logic - see full implementation in `STORY-0.10-DIVISION.md` for complete helper functions.

---

## 🎨 UI/UX Specifications

### Color Palette (Phase-Specific)

- **Core:** Emerald (emerald-500 to emerald-600)
- **Recommended:** Purple (purple-500 to purple-600)
- **Interests:** Blue (blue-500 to blue-600)
- **Optional:** Orange (orange-500 to orange-600)

### Typography

- **Page Title**: text-3xl md:text-4xl font-bold
- **Phase Title**: text-2xl font-bold
- **Phase Description**: text-sm text-gray-600 dark:text-gray-400
- **Guide Title**: text-lg font-semibold

### Icons (Tabler)

- Phase 1 (Core): `IconBook`
- Phase 2 (Recommended): `IconStar`
- Phase 3 (Interests): `IconHeart`
- Phase 4 (Optional): `IconDots`
- Completed: `IconCheck`
- Locked: `IconLock`

---

## ✅ Definition of Done

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code follows established patterns
- [ ] All components use Tabler Icons (no emojis)
- [ ] Varela Round font maintained

### Functionality
- [ ] Journey route accessible at `/journey`
- [ ] Dashboard shows journey preview card
- [ ] Journey page displays all 4 phases
- [ ] Phase cards show correct data
- [ ] Phase unlocking logic works correctly
- [ ] Accordion expand/collapse works
- [ ] Guide buttons navigate correctly
- [ ] Progress bars show correct percentages

### Testing
- [ ] Build succeeds
- [ ] Linter passes
- [ ] Manual testing on desktop
- [ ] Manual testing on mobile
- [ ] Journey data loads correctly
- [ ] Phase lock states are correct

### Mobile Responsive
- [ ] Hero stacks vertically on mobile
- [ ] Phase cards full width on mobile
- [ ] Accordion works on mobile
- [ ] Touch targets adequate (44x44px)
- [ ] No horizontal scrolling

---

## 📊 Success Metrics

After completing 0.10.1:
- [ ] Journey page accessible and functional
- [ ] All phase data calculates correctly
- [ ] Mobile responsive layout works
- [ ] Foundation ready for animations (0.10.2)
- [ ] Foundation ready for gamification (0.10.3)

---

## 🚀 Implementation Order

1. Create `src/lib/journey.ts` with all data logic
2. Add `/journey` route to routes.tsx
3. Create basic `JourneyPage` component structure
4. Build `PhaseCard` component (no animations)
5. Build `JourneyHero` component
6. Create `JourneyPreviewCard` for dashboard
7. Add accordion functionality (React state)
8. Test mobile responsiveness
9. Verify phase unlocking logic
10. Manual testing and polish

---

## 📝 Notes

- **No Framer Motion yet** - animations come in Story 0.10.2
- **No confetti yet** - gamification comes in Story 0.10.3
- **No achievement integration yet** - that's in Story 0.10.3
- **Focus on data accuracy** - ensure phase calculations are correct
- **Keep it simple** - basic hover states are fine, no fancy transitions

---

**Created by:** BMad Master (dividing Story 0.10)
**Date:** November 9, 2025
**Parent:** Story 0.10 - My Learning Journey
**Estimated Effort:** 2-3 story points (2-3 days)

---

_This sub-story focuses on building a solid foundation. Once complete, the journey page will be fully functional with accurate data - ready for visual polish in 0.10.2._
