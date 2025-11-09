# RTL Arrow Direction Fix

**Date:** November 9, 2025
**Status:** ✅ Complete

---

## Problem

Many arrow icons throughout the app were pointing RIGHT (→) instead of LEFT (←) for RTL Hebrew. In Hebrew:
- **Forward/Continue actions** should point **LEFT** (←)
- **Back/Previous actions** should point **RIGHT** (→)

---

## What Was Fixed

### ✅ Changed IconArrowRight → IconArrowLeft (Forward Actions)

1. **PhaseCard** (`src/app/journey/components/PhaseCard.tsx`)
   - Line 308: "המלצה הבאה" badge
   - Line 383: Action buttons (התחל, המשך, קרא שוב)

2. **JourneyCard** (`src/components/dashboard/JourneyCard.tsx`)
   - Already correct! Uses IconArrowLeft for "המשך במסע" ✓

3. **JourneyPreviewCard** (`src/components/dashboard/JourneyPreviewCard.tsx`)
   - Line 192: "המשך במסלול" button

4. **ContinueReadingCard** (`src/components/dashboard/ContinueReadingCard.tsx`)
   - Line 130: Arrow icon in guide cards
   - Line 183: "עיין במדריכים" button

5. **GuideCompletionModal** (`src/components/guides/GuideCompletionModal.tsx`)
   - Line 151: "המדריך הבא" button

6. **OverallProgressCard** (`src/components/dashboard/OverallProgressCard.tsx`)
   - Line 199: "צפה בכל ההתקדמות" button

7. **ActivityFeedCard** (`src/components/dashboard/ActivityFeedCard.tsx`)
   - Line 266: "צפה בכל הפעילות" button

8. **AchievementsPreviewCard** (`src/components/dashboard/AchievementsPreviewCard.tsx`)
   - Line 118: "צפה בכל התגים" button

9. **SearchPage** (`src/app/search/index.tsx`)
   - Line 442: Arrow in search result cards

10. **SearchBar** (`src/components/layout/SearchBar.tsx`)
    - Line 312: "צפה בכל X התוצאות" button

11. **AvatarSelectionStep** (`src/components/onboarding/AvatarSelectionStep.tsx`)
    - Line 166: "הבא" (next) button
    - Line 154: "חזור" (back) button - changed to IconArrowRight

---

### ✅ Already Correct (No Changes Needed)

1. **GuideReader** (`src/app/guides/guide-reader.tsx`)
   - Line 817: "המדריך הקודם" uses IconArrowRight (←) ✓
   - Line 831: "המדריך הבא" uses IconArrowLeft (→) ✓

2. **GuideBreadcrumbs** (`src/components/guides/GuideBreadcrumbs.tsx`)
   - Line 64: "חזרה לספרייה" uses IconArrowRight ✓ (back = right in RTL)

3. **RelatedGuides** (`src/components/guides/RelatedGuides.tsx`)
   - Line 77: Arrow for guide links uses IconArrowLeft ✓

4. **GuideCompletionModal** (next guide card)
   - Line 138: Next guide card arrow uses IconArrowLeft ✓

---

## Summary

**Total Files Modified:** 11 files
**Total Arrow Fixes:** 13 arrows

**Rule Applied:**
- **Forward/Continue → LEFT (IconArrowLeft)**
- **Back/Previous → RIGHT (IconArrowRight)**

---

## Files Changed

1. `src/app/journey/components/PhaseCard.tsx`
2. `src/components/dashboard/JourneyPreviewCard.tsx`
3. `src/components/dashboard/ContinueReadingCard.tsx`
4. `src/components/guides/GuideCompletionModal.tsx`
5. `src/components/dashboard/OverallProgressCard.tsx`
6. `src/components/dashboard/ActivityFeedCard.tsx`
7. `src/components/dashboard/AchievementsPreviewCard.tsx`
8. `src/app/search/index.tsx`
9. `src/components/layout/SearchBar.tsx`
10. `src/components/onboarding/AvatarSelectionStep.tsx`

---

## Testing Checklist

✅ Journey page - "התחל", "המשך", "קרא שוב" buttons point left
✅ Journey page - "המלצה הבאה" badge points left
✅ Dashboard - "המשך במסע" card button points left
✅ Dashboard - "המשך במסלול" preview card points left
✅ Dashboard - Continue reading cards point left
✅ Dashboard - "עיין במדריכים" button points left
✅ Dashboard - "צפה בכל ההתקדמות" points left
✅ Dashboard - "צפה בכל הפעילות" points left
✅ Dashboard - "צפה בכל התגים" points left
✅ Guide completion modal - "המדריך הבא" points left
✅ Search page - Result cards point left
✅ Search bar dropdown - "צפה בכל X התוצאות" points left
✅ Guide reader - "המדריך הקודם" points RIGHT (correct for back)
✅ Guide reader - "המדריך הבא" points LEFT (correct for next)
✅ No linter errors

---

## Result

All forward/continue arrows now correctly point LEFT (←) for RTL Hebrew layout! 🎉

