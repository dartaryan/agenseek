# Next Story to Implement

**Last Completed:** Story 0.5 - Expand Avatar Collection & Add Onboarding Avatar Selection ✅

**Completion Date:** November 9, 2025

---

## Story 0.5 Summary

Successfully expanded avatar collection and integrated avatar selection into onboarding:
- ✅ Expanded from 4 to 8 avatar styles (192 total options)
- ✅ Added avatar selection as Step 2 in onboarding
- ✅ Updated onboarding flow from 5 to 6 steps
- ✅ Updated Hebrew terminology ("הדרכה" → "און בורדינג")
- ✅ All avatar styles work across Profile and Onboarding
- ✅ Build passes, no TypeScript errors

**Result:** Users now have 2x avatar variety and can personalize during onboarding.

---

## 🎯 Next Story: Story 0.6 - Dark Mode Full Implementation

**Priority:** P1 (High)
**Story Points:** 3
**Estimated Time:** ~8 hours
**Status:** Ready for Implementation

### Story 0.6 Overview

Fix dark mode toggle functionality and implement dark mode for ALL pages including authentication pages.

**Key Features:**
- Fix dark mode toggle in Header/Settings
- Implement dark mode for auth pages (login, register, forgot password, reset)
- Ensure theme persistence across sessions (localStorage)
- WCAG AA contrast compliance
- Smooth theme transitions
- Dark mode for all components (modals, dropdowns, toasts)

**Acceptance Criteria:**
1. Toggle works consistently across all pages
2. Theme persists after page refresh
3. Auth pages fully support dark mode
4. All text meets WCAG AA contrast ratios
5. No "flash" of wrong theme on page load
6. System preference detection (prefers-color-scheme)

**Files to Modify:**
- `src/contexts/ThemeContext.tsx` (fix toggle logic)
- `src/app/auth/login.tsx` (add dark mode styles)
- `src/app/auth/register.tsx` (add dark mode styles)
- `src/app/auth/forgot-password.tsx` (add dark mode styles)
- `src/app/auth/reset-password.tsx` (add dark mode styles)
- `tailwind.config.js` (verify dark mode config)
- Review all components for dark mode support

**See:** `STORY-0.6.md` for complete details

---

## 📋 Remaining 0.X Story Series

After Story 0.6, continue with these in order:

### Story 0.7: Real-time Avatar Update Reflection
- **Points:** 1
- **Time:** ~2h
- **Description:** Create UserContext for global avatar state. Update avatar immediately across all components without page refresh.

### Story 0.8: Admin Pages Mobile Responsiveness
- **Points:** 2
- **Time:** ~6.5h
- **Description:** Make admin dashboard and all admin pages mobile-responsive with hamburger menu and card-based layouts.

### Story 0.9: Implement Settings Page Features
- **Points:** 5
- **Time:** ~7.5h
- **Description:** Notification preferences, appearance settings, privacy settings, language settings, data export (GDPR).

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
- ✅ **Story 0.5 - Avatar Expansion & Onboarding** (Complete)
- ⏩ **Story 0.6 - Dark Mode** (NEXT)
- ⏸️ Story 0.7 - Real-time Avatar Updates
- ⏸️ Story 0.8 - Admin Mobile Responsiveness
- ⏸️ Story 0.9 - Settings Implementation
- ⏸️ Story 0.10 - Learning Journey
- ⏸️ Story 0.11 - Documentation Archive
- ⏸️ Story 0.12 - Console Log Cleanup
- ⏸️ Story 0.13 - Installation Guide

**Total:** 5 of 13 complete (38%)
**Remaining:** 8 stories, ~18 points

---

## 🚀 Getting Started with Story 0.6

```bash
# Load Story 0.6
Read file: STORY-0.6.md

# Begin implementation
Follow acceptance criteria in order:
1. Fix ThemeContext toggle logic
2. Implement auth page dark mode
3. Verify theme persistence
4. Test contrast compliance
5. Handle system preferences
6. Test all components
```

---

## 📖 Reference Documents

- **Full Execution Plan:** `STORY-0.X-EXECUTION-PLAN.md`
- **Dev Prompt:** `DEV-PROMPT-0X-STORIES.md`
- **Story 0.6 Details:** `STORY-0.6.md`
- **Completed Stories:** `0X-STORIES-SUMMARY.md`

---

**Recommendation:** Start Story 0.6 immediately. Dark mode is high priority for user experience.

---

**Updated by:** Amelia (Dev Agent)
**Date:** November 9, 2025
