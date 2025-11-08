# Story 0.1: Mock Data Audit & Replacement Plan

**Date:** November 8, 2025
**Status:** Ready for Implementation
**Type:** On-the-Go Story (0.X)

---

## 🔍 Executive Summary

An audit of the codebase revealed **3 instances** where mock data is being used instead of real database data. This creates inaccurate information display and undermines user trust in the platform.

**Good News:** The guides percentage you mentioned is actually using REAL data! The issue is with other components.

---

## 📊 Findings

### ✅ What's Already Using Real Data

The following components are correctly fetching real data:

1. **Dashboard Overall Progress** (`src/app/dashboard/index.tsx:148-163`)
   - ✅ `guidesCompleted` - Real data from database
   - ✅ `guidesInProgress` - Real data from database
   - ✅ `totalGuides` - Real data from catalog
   - ✅ `progressPercent` - Correctly calculated from real data
   - ✅ Reading time statistics - Real data
   - ✅ Notes count - Real data
   - ✅ Tasks count - Real data
   - ✅ Streak days - Real data
   - ✅ Activity feed - Real data

2. **Progress Details Page** (`src/app/progress/index.tsx`)
   - ✅ All progress data is real
   - ✅ Category breakdowns are real
   - ✅ Time spent is real

---

## ❌ What's Using Mock Data (Needs Fixing)

### Issue #1: Dashboard - Badge Data 🔴 HIGH PRIORITY

**Location:** `src/app/dashboard/index.tsx:250-252`

**Current Code:**
```typescript
// Mock badge data (will be real in Story 5.3)
const earnedBadges = Math.min(guidesCompleted, 2); // Simple calculation for now
const lockedBadges = 10 - earnedBadges;
```

**Problem:**
- Uses a simple formula instead of real achievement data
- Always shows max 2 badges regardless of actual achievements
- Locked badges calculated from hardcoded total of 10

**Impact:** Users see incorrect badge counts on dashboard

**Fix:** Fetch from `user_achievements` table

---

### Issue #2: Guides Library - Progress Data 🔴 HIGH PRIORITY

**Location:** `src/app/guides/index.tsx:53-62, 94`

**Current Code:**
```typescript
function getMockProgress(): Record<string, GuideProgress> {
  return {
    'quick-start': {
      guideId: 'quick-start',
      progressPercent: 45,
      isStarted: true,
      isCompleted: false,
    },
  };
}

// Later used as:
const [progressData] = useState<Record<string, GuideProgress>>(getMockProgress());
```

**Problem:**
- Shows hardcoded 45% progress for quick-start guide only
- All other guides show 0% even if user has progress
- Progress indicators (badges, status) are inaccurate
- Filter by "In Progress" or "Completed" doesn't work correctly

**Impact:**
- Users can't see their actual progress on guides library page
- Filtering and sorting by progress status is broken
- Creates confusion about which guides they've started

**Fix:** Fetch from `user_progress` table and map to guide catalog

---

### Issue #3: Onboarding - Guide Recommendations 🟡 MEDIUM PRIORITY

**Location:** `src/app/onboarding/wizard.tsx:768-771`

**Current Code:**
```typescript
// Generate mock guide recommendations based on selections
const sections: GuideSection[] = [
  {
    category: 'מדריכי ליבה',
    // ... generates structure but uses placeholder logic
  }
];
```

**Problem:**
- Comments indicate mock data generation
- May not properly filter by user's role and interest selections
- Recommendations might not reflect actual catalog

**Impact:**
- One-time experience (onboarding)
- Medium priority but affects first impression
- May recommend irrelevant guides

**Fix:** Use real guide catalog with proper filtering logic

---

## 📋 Action Items

### Story Created: `docs/stories/story-0.1-replace-mock-data.md`

This story includes:
- ✅ Detailed acceptance criteria for all 3 issues
- ✅ Technical implementation guide with code examples
- ✅ Testing checklist
- ✅ Database schema reference
- ✅ UI/UX considerations for loading/error states
- ✅ SQL verification queries

---

## 🎯 Implementation Priority

### Phase 1: High Priority (Do First)
1. **Guides Library Progress** - Most visible to users, core functionality
2. **Dashboard Badges** - Affects achievement system credibility

### Phase 2: Medium Priority (Do Next)
3. **Onboarding Recommendations** - One-time experience, less critical

---

## 🔧 Technical Approach

### For Dashboard Badges
```typescript
// Replace mock with real query
const { data: achievements } = await supabase
  .from('user_achievements')
  .select('achievement_id, earned_at')
  .eq('user_id', user.id)
  .not('earned_at', 'is', null);

const earnedBadges = achievements?.length || 0;
const totalBadges = 10; // Or fetch from definitions
const lockedBadges = totalBadges - earnedBadges;
```

### For Guides Progress
```typescript
// Fetch real progress
const { data: progressData } = await supabase
  .from('user_progress')
  .select('guide_slug, progress_percent, completed')
  .eq('user_id', user.id);

// Create lookup map
const progressMap = new Map(
  progressData?.map(p => [p.guide_slug, {
    progressPercent: p.progress_percent,
    isStarted: p.progress_percent > 0,
    isCompleted: p.completed
  }]) || []
);

// Apply to catalog
const guidesWithProgress = catalog.map(guide => ({
  ...guide,
  ...progressMap.get(guide.id) || {
    progressPercent: 0,
    isStarted: false,
    isCompleted: false
  }
}));
```

### For Onboarding
```typescript
// Use real catalog with filtering
const catalog = getGuideCatalog();
const sections: GuideSection[] = [
  {
    category: 'מדריכי ליבה',
    guides: catalog.filter(g =>
      g.categories.includes('core') &&
      selectedRoles.some(role => g.targetAudience?.includes(role))
    ).slice(0, 5)
  },
  // ... real categorization logic
];
```

---

## ✅ Success Metrics

After implementation:
- [ ] No more "mock" comments in codebase
- [ ] Badge counts match database exactly
- [ ] Guides library shows accurate progress for all guides
- [ ] Progress filters work correctly
- [ ] Onboarding recommends relevant guides
- [ ] All data verifiable via SQL queries

---

## 📊 Verification Queries

Run these after implementation to verify:

```sql
-- Verify badge accuracy
SELECT
  display_name,
  COUNT(DISTINCT achievement_id) as earned_badges
FROM profiles p
LEFT JOIN user_achievements ua ON p.id = ua.user_id
WHERE ua.earned_at IS NOT NULL
GROUP BY display_name;

-- Verify progress accuracy
SELECT
  guide_slug,
  progress_percent,
  completed
FROM user_progress
WHERE user_id = '{your_user_id}'
ORDER BY guide_slug;
```

---

## 🎉 Summary

**Total Issues Found:** 3
**High Priority:** 2 (Dashboard badges, Guides progress)
**Medium Priority:** 1 (Onboarding recommendations)
**Estimated Effort:** 5 story points (~1-2 days)

**Story Ready:** `docs/stories/story-0.1-replace-mock-data.md`

---

## 📝 Next Steps

1. Review the story document: `docs/stories/story-0.1-replace-mock-data.md`
2. Assign to developer
3. Implement fixes in priority order
4. Test with real user data
5. Verify using SQL queries
6. Deploy and monitor

---

## 📌 Story Naming Convention

**0.X Stories:** On-the-Go stories for issues discovered during development/usage that need immediate attention but weren't part of the original epic planning.

---

**Note:** The guides percentage you mentioned IS actually using real data! The dashboard correctly shows actual progress from the database. The issues are with badges, guides library page, and onboarding recommendations.

