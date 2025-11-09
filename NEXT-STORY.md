# Next Story to Implement

**Last Completed:** Story 0.16 - Navigation Merge + Critical UX Fixes ✅

**Completion Date:** November 9, 2025

---

## Recent Completions

### Story 0.16 Summary ✅
Successfully completed multiple critical UX fixes:
- ✅ **Navigation Merge**: Merged Profile & Settings into unified "פרופיל והגדרות" across all surfaces
- ✅ **Sidebar Fix**: Removed auto-collapse - sidebar now manual control only per user request
- ✅ **Avatar Fix**: Fixed avatar display issue - selected avatars now show instead of logo
- ✅ **OAuth Fix**: Added preferences warning + validation for OAuth users without preferences
- ✅ All changes based on direct user feedback and improve overall UX

### Story 0.9 Summary ✅
Successfully implemented comprehensive settings page features:
- ✅ Notification preferences (email, in-app, frequency)
- ✅ Appearance settings (theme, density, font-size, sidebar)
- ✅ Privacy settings (visibility, analytics, GDPR export)
- ✅ Language settings (UI language, date/number formats)
- ✅ All preferences persist to database with optimistic updates

### Story 0.8 Summary ✅
Made all admin pages mobile-responsive:
- ✅ Admin dashboard responsive layout
- ✅ Mobile navigation with hamburger menu
- ✅ Card-based user management on mobile
- ✅ Mobile-friendly forms and modals

### Story 0.7 Summary ✅
Implemented real-time avatar updates:
- ✅ Extended AuthContext with updateAvatar method
- ✅ Avatar reflects immediately across all components
- ✅ No page refresh needed

**Result:** Core settings, admin mobile, and avatar features complete.

---

## 🎯 Next Story: Story 0.10.1 - Journey Page Core & Data Layer

**Parent:** Story 0.10 - My Learning Journey (מסלול הלמידה שלי)
**Priority:** P1 (High)
**Story Points:** 2-3
**Estimated Time:** 2-3 days
**Status:** Ready for Implementation
**Note:** Story 0.10 divided into 3 sub-stories (see STORY-0.10-DIVISION.md)

### Story 0.10.1 Overview (Current)

Build the foundation of the learning journey system: functionality over aesthetics.

**Focus:** Core data layer and functional journey page

**Key Features:**
- `/journey` route and page structure
- `getJourneyData()` with all helper functions
- Basic PhaseCard components (no animations yet)
- Phase unlocking logic
- Dashboard journey preview card
- Mobile responsive layout
- Journey state persistence

**Deliverables:**
- Fully functional journey page with accurate data
- All 4 phases display correctly
- Phase lock states work
- Ready for animations (Story 0.10.2)

**Files to Create:**
- `src/lib/journey.ts` - All data logic
- `src/app/journey/index.tsx` - Main page
- `src/components/journey/PhaseCard.tsx` - Phase display
- `src/components/journey/JourneyHero.tsx` - Hero section
- `src/components/dashboard/JourneyPreviewCard.tsx` - Dashboard widget

**See:** `STORY-0.10.1.md` for complete details

**After 0.10.1:**
- Story 0.10.2: Visual Polish & Animations (2 points, 2-3 days)
- Story 0.10.3: Gamification & Integration (1 point, 1-2 days)

---

## 📋 Remaining 0.X Story Series

After Story 0.6, continue with these in order:

### ✅ Story 0.7: Real-time Avatar Update Reflection (COMPLETE)
- **Points:** 1
- **Time:** ~2h
- **Completed:** November 9, 2025

### ✅ Story 0.8: Admin Pages Mobile Responsiveness (COMPLETE)
- **Points:** 2
- **Time:** ~6.5h
- **Completed:** November 9, 2025

### ✅ Story 0.9: Implement Settings Page Features (COMPLETE)
- **Points:** 5
- **Time:** ~7.5h
- **Completed:** November 9, 2025

### Story 0.10: My Learning Journey (מסלול הלמידה שלי)
- **Points:** 5
- **Time:** 6-9 days
- **Description:** Visual roadmap with 4 phases, phase-based progression, gamification, `/journey` page.

### Story 0.11: Documentation Organization & Archive
- **Points:** 2
- **Time:** ~1.5h
- **Description:** Create `docs/archive/` structure, move completed stories, organize by epic/sprint.

### Story 0.12: Remove Console Logs from Codebase
- **Points:** 1
- **Time:** ~2h
- **Description:** Remove debug console.log statements, add ESLint rule, replace with proper error handling.

### Story 0.13: Create BMAD Installation Guide Access Point
- **Points:** 1
- **Time:** ~1.5h
- **Description:** Make `docs/how-to-install.md` accessible in app, convert to JSON guide format.

---

## 📊 Progress Tracker

**0.X Series Progress:**
- ✅ Story 0.1 - Mock Data Integration (Complete)
- ✅ Story 0.2 - Hebrew Name Suggestions (Complete)
- ✅ Story 0.3 - Avatar System Implementation (Complete)
- ✅ Story 0.4 - Story Tracking & Verification (Complete)
- ✅ Story 0.5 - Avatar Expansion & Onboarding (Complete)
- 🚫 Story 0.6 - Dark Mode (NOT DOING NOW - Postponed)
- ✅ Story 0.7 - Real-time Avatar Updates (Complete)
- ✅ Story 0.8 - Admin Mobile Responsiveness (Complete)
- ✅ Story 0.9 - Settings Implementation (Complete)
- ⏩ **Story 0.10 - Learning Journey** (NEXT - divided into 0.10.1, 0.10.2, 0.10.3)
- ⏸️ Story 0.11 - Documentation Archive
- ⏸️ Story 0.12 - Console Log Cleanup
- ⏸️ Story 0.13 - Installation Guide
- ✅ Story 0.16 - Navigation Merge + UX Fixes (Complete)

**Total:** 10 of 14 complete (71%)
**Remaining:** 4 stories, ~9 points
**Note:** Story 0.6 (Dark Mode) postponed; Story 0.10 divided into 3 sub-stories; Story 0.16 was a quick UX improvement

---

## 🚀 Getting Started with Story 0.10

```bash
# Load Story 0.10
Read file: STORY-0.10.md

# Begin implementation
Follow acceptance criteria in order:
1. Create journey page structure
2. Implement phase calculation logic
3. Build PhaseCard components
4. Add progress visualization
5. Implement confetti celebrations
6. Test phase unlocking logic
```

### ⚠️ Prerequisites
Before starting Story 0.10, ensure:
- Database migration from Story 0.9 is run (`20241109_add_user_preferences.sql`)
- All existing guide data has phase assignments
- User progress data is populated correctly

---

## 📖 Reference Documents

- **Full Execution Plan:** `STORY-0.X-EXECUTION-PLAN.md`
- **Dev Prompt:** `DEV-PROMPT-0X-STORIES.md`
- **Story 0.10 Details:** `STORY-0.10.md`
- **Story 0.9 Completion:** `STORY-0.9-COMPLETE.md`
- **Completed Stories:** `0X-STORIES-SUMMARY.md`

---

**Recommendation:** Start Story 0.10 for major feature addition. Alternatively, complete Stories 0.7-0.8 first for incremental improvements.

---

**Updated by:** Amelia (Dev Agent)
**Date:** November 9, 2025
