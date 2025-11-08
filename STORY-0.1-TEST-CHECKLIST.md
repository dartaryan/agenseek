# Story 0.1: Testing Checklist

**Status:** Ready for Manual Testing
**Date:** November 8, 2025

---

## 🎯 Quick Test Summary

All code changes are complete and compiled successfully. Please test the following scenarios to verify the implementation works correctly with real data.

---

## 📋 Test Checklist

### 1. Dashboard Badge Data

**Location:** Dashboard page (`/dashboard`)

**What to Test:**
- [ ] Badge count reflects actual achievements from database
- [ ] "Earned badges" number is accurate
- [ ] "Locked badges" number is correct (10 - earned)
- [ ] No console errors when loading dashboard
- [ ] Loading state appears briefly during data fetch

**How to Verify:**
1. Navigate to `/dashboard`
2. Note the badge count in the Achievements Preview card
3. Run this SQL query to verify:
   ```sql
   SELECT COUNT(*) as earned
   FROM user_achievements
   WHERE user_id = '{your_user_id}'
   AND earned_at IS NOT NULL;
   ```
4. Dashboard count should match SQL result

**Expected Results:**
- New user: 0 badges earned, 10 locked
- User with achievements: Accurate count from database

---

### 2. Guides Page Progress Data

**Location:** Guides library page (`/guides`)

**What to Test:**
- [ ] Progress bars show correct percentages for each guide
- [ ] "In Progress" status badge appears on partially completed guides
- [ ] "Completed" checkmark appears on 100% guides
- [ ] Filter by "In Progress" shows only guides with 0% < progress < 100%
- [ ] Filter by "Completed" shows only guides with 100% progress
- [ ] Filter by "Not Started" shows guides with 0% progress
- [ ] No console errors when loading guides page
- [ ] Loading state appears briefly during data fetch

**How to Verify:**
1. Navigate to `/guides`
2. Check progress indicators on guide cards
3. Test each status filter
4. Run this SQL query to verify:
   ```sql
   SELECT
     guide_slug,
     progress_percent,
     completed
   FROM user_progress
   WHERE user_id = '{your_user_id}'
   ORDER BY guide_slug;
   ```
5. Match progress bars to database values

**Expected Results:**
- New user: All guides show 0% progress
- User with progress: Accurate percentages and status badges
- Filters work correctly

---

### 3. Onboarding Guide Recommendations

**Location:** Onboarding wizard step 5 (`/onboarding`)

**What to Test:**
- [ ] Guide recommendations come from actual catalog
- [ ] Core guides section shows real guide titles
- [ ] Recommended section reflects selected role
- [ ] Interest-based section reflects selected interests
- [ ] Guide titles are accurate Hebrew text (not mock data like "מדריך Developer")
- [ ] Guide descriptions are meaningful
- [ ] Estimated minutes are realistic numbers
- [ ] No console errors during recommendation generation

**How to Verify:**
1. Log out (if logged in)
2. Create a new account or navigate to `/onboarding`
3. Complete steps 1-4 (role, interests, experience)
4. On step 5, verify recommendations
5. Check that guide IDs and titles match actual catalog entries

**Expected Results:**
- Shows 3-4 sections of personalized guides
- All guides exist in the actual catalog
- Categorization makes sense based on selections

---

## 🧪 Edge Case Testing

### Test Case: No Data (New User)

**Steps:**
1. Create a new user account (or use test account with no data)
2. Visit dashboard
3. Visit guides page

**Expected:**
- Dashboard: "0 badges earned, 10 locked"
- Guides: All guides show "Not Started" with 0%
- No errors or crashes
- Empty states display gracefully

---

### Test Case: Partial Data (Active User)

**Steps:**
1. Use account with some progress (manually add via SQL if needed)
2. Visit dashboard
3. Visit guides page with filters

**Expected:**
- Dashboard: Correct badge count
- Guides: Mix of 0%, partial, and 100% guides
- Filters work: "In Progress" shows 1-99% only
- Sorting by completion works

---

### Test Case: Network Error Simulation

**Steps:**
1. Open browser DevTools → Network tab
2. Set network to "Offline" mode
3. Refresh dashboard or guides page

**Expected:**
- Error logged to console
- UI doesn't crash
- Shows fallback/empty state
- Error message appears (if implemented)

---

## 🔍 SQL Verification Queries

Copy and run these queries to verify data accuracy:

### Check Your Badge Count
```sql
SELECT
  u.display_name,
  COUNT(DISTINCT ua.achievement_id) as earned_badges,
  u.id as user_id
FROM profiles u
LEFT JOIN user_achievements ua
  ON u.id = ua.user_id AND ua.earned_at IS NOT NULL
WHERE u.id = '{your_user_id}'
GROUP BY u.id, u.display_name;
```

### Check Your Guide Progress
```sql
SELECT
  guide_slug,
  progress_percent,
  completed,
  last_read_at,
  time_spent_seconds / 60 as minutes_spent
FROM user_progress
WHERE user_id = '{your_user_id}'
ORDER BY last_read_at DESC;
```

### Check All Users (Admin)
```sql
-- Badge summary
SELECT
  u.display_name,
  COUNT(DISTINCT ua.achievement_id) as badges,
  COUNT(DISTINCT up.guide_slug) as guides_started,
  COUNT(DISTINCT CASE WHEN up.completed THEN up.guide_slug END) as guides_completed
FROM profiles u
LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.earned_at IS NOT NULL
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.display_name
ORDER BY badges DESC, guides_completed DESC;
```

---

## ✅ Acceptance Criteria Verification

After testing, verify these acceptance criteria:

- [ ] **AC1:** Dashboard badges show real data from `user_achievements` table
- [ ] **AC2:** Guides page progress shows real data from `user_progress` table
- [ ] **AC3:** Onboarding recommendations use real catalog with proper filtering
- [ ] **AC4:** Loading states appear during data fetch
- [ ] **AC5:** All data matches database values (verified via SQL)

---

## 🐛 Bug Reporting

If you find any issues during testing, please document:

1. **What happened:** Describe the bug
2. **Expected behavior:** What should have happened
3. **Steps to reproduce:** How to recreate the issue
4. **Console errors:** Any JavaScript errors
5. **SQL results:** What does the database show?
6. **Screenshots:** If UI issue

---

## 📊 Performance Check

Optional performance verification:

- [ ] Dashboard loads in under 2 seconds
- [ ] Guides page loads in under 2 seconds
- [ ] No waterfall of multiple queries (check Network tab)
- [ ] Progress data cached between page visits

---

## 🎉 Sign-Off

Once all tests pass:

- [ ] All acceptance criteria verified
- [ ] All edge cases tested
- [ ] SQL queries match UI display
- [ ] No console errors or warnings
- [ ] Performance acceptable

**Tested By:** _________________
**Date:** _________________
**Status:** ☐ Approved  ☐ Needs Fixes

---

## 📝 Notes

Use this space to document any observations, issues, or suggestions:

```
[Your notes here]
```

---

**Happy Testing!** 🚀

If everything works correctly, Story 0.1 is complete and can be marked as Done.

