# Story 0.1: Replace Mock Data with Real Data

**Epic:** On-the-Go Stories (Technical Debt)
**Status:** 📝 Ready for Development
**Priority:** High
**Estimate:** 5 story points

---

## 📋 User Story

**As a user,**
I want all data displayed in the application to reflect my actual usage and progress,
So that the information I see is accurate and trustworthy.

---

## 🎯 Goal

Replace all instances of mock/hardcoded data with real data from the database to ensure data accuracy and integrity across the platform.

---

## 🔍 Problem Statement

During code review, several components were identified that use mock or calculated placeholder data instead of fetching real data from the database:

1. **Dashboard Page** - Badge data uses simple mock calculation
2. **Guides Page** - Progress data uses hardcoded mock values
3. **Onboarding Wizard** - Guide recommendations use mock data generation

This creates inconsistencies and inaccurate information display for users.

---

## ✅ Acceptance Criteria

### AC1: Replace Mock Badge Data in Dashboard

**Given** I am viewing the dashboard
**When** the achievements preview card loads
**Then**:
- Badge counts (earned/locked) should be fetched from the `user_achievements` table
- Should show actual earned badges based on real achievement data
- Should calculate locked badges as total possible badges minus earned
- Mock comment on line 250-252 of `src/app/dashboard/index.tsx` should be removed

### AC2: Replace Mock Progress Data in Guides Page

**Given** I am viewing the guides library page
**When** the page loads
**Then**:
- The `getMockProgress()` function should be removed
- Progress data should be fetched from `user_progress` table
- Each guide should display real `progress_percent`, `isStarted`, and `isCompleted` status
- Progress badges/indicators should reflect actual user progress

### AC3: Replace Mock Guide Recommendations in Onboarding

**Given** I am completing the onboarding wizard
**When** I reach the recommendations step
**Then**:
- Guide recommendations should be generated based on real catalog data
- Should use actual categorization from the guide catalog
- Should respect user's role and interest selections
- Mock comment on line 768 of `src/app/onboarding/wizard.tsx` should be removed

### AC4: Add Loading States

**Given** any component is fetching real data
**When** the data is being loaded
**Then**:
- Show appropriate loading skeletons/spinners
- Handle loading errors gracefully
- Display user-friendly error messages if data fetch fails

### AC5: Verify Data Accuracy

**Given** all mock data has been replaced
**When** I use the application
**Then**:
- All statistics match database values
- Progress percentages are accurate
- Badge counts are correct
- No console warnings about mock data

---

## 🛠️ Technical Implementation

### Files to Modify

1. **`src/app/dashboard/index.tsx`**
   - Lines 250-252: Replace mock badge calculation
   - Fetch real badge data using existing `useUserStats` hook or direct query
   - Update `earnedBadges` and `lockedBadges` with real values

2. **`src/app/guides/index.tsx`**
   - Lines 53-62: Remove `getMockProgress()` function
   - Line 94: Remove mock progress state
   - Add real progress data fetching using Supabase
   - Join user_progress data with guide catalog

3. **`src/app/onboarding/wizard.tsx`**
   - Lines 768-771: Remove mock recommendations comment
   - Use real guide catalog for recommendations
   - Apply proper categorization logic

### Data Fetching Strategy

```typescript
// Dashboard - Real Badge Data
const { data: achievements } = await supabase
  .from('user_achievements')
  .select('achievement_id, earned_at')
  .eq('user_id', user.id)
  .not('earned_at', 'is', null);

const earnedBadges = achievements?.length || 0;
const totalBadges = 10; // Or fetch from achievements_definitions table
const lockedBadges = totalBadges - earnedBadges;
```

```typescript
// Guides Page - Real Progress Data
const { data: progressData } = await supabase
  .from('user_progress')
  .select('guide_slug, progress_percent, completed')
  .eq('user_id', user.id);

// Create a map for quick lookup
const progressMap = new Map(
  progressData?.map(p => [
    p.guide_slug,
    {
      progressPercent: p.progress_percent,
      isStarted: p.progress_percent > 0,
      isCompleted: p.completed
    }
  ]) || []
);
```

```typescript
// Onboarding - Real Guide Recommendations
const catalog = getGuideCatalog();
const sections: GuideSection[] = [
  {
    category: 'מדריכי ליבה',
    guides: catalog.filter(g =>
      g.categories.includes('core') &&
      selectedRoles.some(role => g.targetAudience?.includes(role))
    ).slice(0, 5)
  },
  // ... continue with real categorization
];
```

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] Dashboard shows correct badge counts matching database
- [ ] Guides page displays accurate progress for each guide
- [ ] Onboarding recommendations reflect actual catalog
- [ ] Loading states appear during data fetch
- [ ] Error states work when data fetch fails
- [ ] All mock data comments are removed from code

### Test Scenarios

**Scenario 1: New User (No Data)**
- Dashboard shows 0 earned badges
- Guides page shows 0% progress on all guides
- Onboarding generates valid recommendations

**Scenario 2: Returning User (With Data)**
- Dashboard shows correct badge count (e.g., 3 earned, 7 locked)
- Guides page shows mixed progress (some 0%, some partial, some 100%)
- All data matches what's in the database

**Scenario 3: Edge Cases**
- User has no progress data → Shows 0s gracefully
- User has no achievements → Shows "No badges earned yet"
- Network error → Shows error message, not blank screen

---

## 📊 Database Schema Reference

### user_achievements
```sql
- user_id (uuid, FK to profiles)
- achievement_id (text)
- earned_at (timestamp)
- progress (integer)
```

### user_progress
```sql
- user_id (uuid, FK to profiles)
- guide_slug (text)
- progress_percent (integer)
- completed (boolean)
- last_read_at (timestamp)
- time_spent_seconds (integer)
```

---

## 🎨 UI/UX Considerations

### Loading States
- Use skeleton loaders for cards
- Show spinner for inline progress indicators
- Maintain layout stability during loading

### Error States
- "Could not load badge data" - with retry button
- "Could not load progress" - with refresh link
- Fallback to showing basic data if partial fetch fails

### Empty States
- "Start learning to earn badges!"
- "Begin your first guide to track progress"
- Encourage user action with CTA buttons

---

## 🔗 Dependencies

- **Blocked by:** None (can start immediately)
- **Blocks:** None (independent enhancement)
- **Related:**
  - Story 5.3 (Achievement Badge System) - for badge definitions
  - Story 4.2 (Guide Reader) - for progress tracking logic

---

## 📝 Implementation Notes

### Priority Order

1. **Dashboard Badges** (Highest Impact)
   - Most visible to users
   - Directly affects achievement system credibility

2. **Guides Progress** (High Impact)
   - Core functionality
   - Affects user experience in main feature

3. **Onboarding Recommendations** (Medium Impact)
   - One-time user experience
   - Still important for first impression

### Performance Considerations

- Cache progress data (5-minute TTL)
- Use React Query for automatic refetching
- Batch database queries where possible
- Consider pagination for large datasets

### Code Quality

- Remove all instances of "mock" comments
- Add TypeScript types for all data structures
- Include proper error handling
- Write unit tests for data transformations

---

## 🚀 Definition of Done

- [ ] All mock data removed from codebase
- [ ] Real data fetching implemented for all three components
- [ ] Loading and error states implemented
- [ ] Manual testing passed for all scenarios
- [ ] No TypeScript errors
- [ ] No console warnings about mock data
- [ ] Code reviewed and approved
- [ ] Documentation updated (if needed)

---

## 📚 Additional Context

### Current Mock Data Locations

1. **`src/app/dashboard/index.tsx:250-252`**
```typescript
// Mock badge data (will be real in Story 5.3)
const earnedBadges = Math.min(guidesCompleted, 2); // Simple calculation for now
const lockedBadges = 10 - earnedBadges;
```

2. **`src/app/guides/index.tsx:53-62`**
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
```

3. **`src/app/onboarding/wizard.tsx:768-771`**
```typescript
// Generate mock guide recommendations based on selections
const sections: GuideSection[] = [
  {
    category: 'מדריכי ליבה',
    // ... mock data structure
  }
];
```

### Verification Method

After implementation, run this SQL query to verify data accuracy:

```sql
-- Check badge counts
SELECT
  u.id,
  u.display_name,
  COUNT(DISTINCT ua.achievement_id) as earned_badges
FROM profiles u
LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.earned_at IS NOT NULL
GROUP BY u.id, u.display_name;

-- Check progress accuracy
SELECT
  u.id,
  u.display_name,
  COUNT(*) as total_progress_records,
  COUNT(CASE WHEN completed THEN 1 END) as completed_guides,
  AVG(progress_percent) as avg_progress
FROM profiles u
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id, u.display_name;
```

---

**Created:** 2025-11-08
**Updated:** 2025-11-08
**Story Type:** On-the-Go (0.X)
**Author:** Development Team
**Reviewer:** TBD

