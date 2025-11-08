# Story 0.4: Profile & Settings Layout Optimization for Desktop

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 1
**Priority:** P2 (Medium)
**Dependencies:** None

---

## User Story

As a desktop user,
I want the Profile and Settings pages to have better layout utilization,
So that the content is easier to scan and more consistent with other pages.

---

## Business Context

**Current State:**
- Profile and Settings pages may have different width constraints
- Cards are stacked vertically on desktop (wasted horizontal space)
- Inconsistent with other page layouts

**Impact:**
- Inefficient use of desktop screen space
- More scrolling required
- Inconsistent user experience

**Solution:**
- Align Profile and Settings page widths with other pages
- Display cards in 2-column grid on desktop
- Maintain single-column layout on mobile
- Create consistent visual rhythm

---

## Acceptance Criteria

### Given I am viewing the Profile page on desktop
### Then I should see:

1. **Profile Page Layout:**
   - ✅ Page width matches other pages (e.g., Dashboard, Guides)
   - ✅ Cards arranged in 2-column grid on desktop (≥768px)
   - ✅ Equal card heights in each row
   - ✅ Consistent spacing between cards
   - ✅ Single column on mobile (<768px)
   - ✅ Responsive breakpoints work smoothly

2. **Settings Page Layout:**
   - ✅ Page width matches other pages
   - ✅ Cards arranged in 2-column grid on desktop (≥768px)
   - ✅ Equal card heights in each row
   - ✅ Consistent spacing between cards
   - ✅ Single column on mobile (<768px)
   - ✅ Responsive breakpoints work smoothly

3. **Visual Consistency:**
   - ✅ Same max-width as Dashboard (e.g., max-w-7xl)
   - ✅ Same padding/margins as other pages
   - ✅ Cards maintain proper aspect ratio
   - ✅ No awkward gaps or alignment issues
   - ✅ Smooth transitions on resize

4. **User Experience:**
   - ✅ Less vertical scrolling on desktop
   - ✅ More scannable content
   - ✅ Familiar layout pattern
   - ✅ No content feels cramped
   - ✅ All interactive elements remain accessible

---

## Technical Implementation

### Step 1: Identify Current Layout Container

**Files to check:**
- `src/app/profile/index.tsx`
- `src/app/settings/index.tsx`

**Look for:**
- Current max-width classes
- Current grid/flex layout
- Container components used

---

### Step 2: Update Profile Page Layout

**File:** `src/app/profile/index.tsx`

**Update container:**
```typescript
// Before (example):
<div className="max-w-4xl mx-auto p-6">
  <div className="space-y-6">
    {/* Cards stacked vertically */}
  </div>
</div>

// After:
<div className="max-w-7xl mx-auto p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Cards in 2-column grid on desktop */}
  </div>
</div>
```

**Key changes:**
- Change `max-w-4xl` → `max-w-7xl` (or whatever Dashboard uses)
- Change `space-y-6` → `grid grid-cols-1 md:grid-cols-2 gap-6`

**Example cards:**
```typescript
{/* Profile Info Card */}
<Card>
  <CardHeader>
    <CardTitle>פרטי פרופיל</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Profile content */}
  </CardContent>
</Card>

{/* Account Settings Card */}
<Card>
  <CardHeader>
    <CardTitle>הגדרות חשבון</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Settings content */}
  </CardContent>
</Card>
```

---

### Step 3: Update Settings Page Layout

**File:** `src/app/settings/index.tsx`

**Apply same changes:**
```typescript
// Container
<div className="max-w-7xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6">הגדרות</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Settings cards */}
  </div>
</div>
```

**Settings cards examples:**
```typescript
{/* Language Settings */}
<Card>
  <CardHeader>
    <CardTitle>שפה ואזור</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Language settings */}
  </CardContent>
</Card>

{/* Notification Settings */}
<Card>
  <CardHeader>
    <CardTitle>התראות</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Notification settings */}
  </CardContent>
</Card>
```

---

### Step 4: Ensure Equal Heights (Optional)

**If cards have very different content heights:**

**Option A: CSS Grid Auto-Rows**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
  {/* Cards will stretch to equal heights */}
</div>
```

**Option B: Flex on Cards**
```typescript
<Card className="flex flex-col h-full">
  <CardHeader>...</CardHeader>
  <CardContent className="flex-1">...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
```

---

### Step 5: Verify Responsive Breakpoints

**Test at these widths:**
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

**Ensure:**
- Single column < 768px
- Two columns ≥ 768px
- Proper spacing at all widths
- No horizontal scrolling
- Content remains readable

---

### Step 6: Check Page Width Consistency

**Compare with Dashboard:**

**File:** `src/app/dashboard/index.tsx`

**Find the container class:**
```typescript
// Example:
<div className="max-w-7xl mx-auto p-6">
```

**Apply the SAME class to Profile and Settings pages**

---

### Step 7: Adjust Specific Card Content

**If any card content breaks in 2-column layout:**

**Option 1: Full-width for specific cards**
```typescript
<Card className="md:col-span-2">
  {/* This card spans both columns on desktop */}
</Card>
```

**Option 2: Reorder cards**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Card 1 */}
  {/* Card 2 */}
  {/* Card 3 - will start new row */}
  {/* Card 4 */}
</div>
```

---

## Definition of Done

- [ ] Profile page width matches Dashboard
- [ ] Profile page cards in 2-column grid on desktop
- [ ] Profile page single column on mobile
- [ ] Settings page width matches Dashboard
- [ ] Settings page cards in 2-column grid on desktop
- [ ] Settings page single column on mobile
- [ ] Responsive breakpoints work smoothly
- [ ] No horizontal scrolling at any width
- [ ] Card content remains readable in all layouts
- [ ] Spacing is consistent with other pages
- [ ] No visual bugs or misalignments
- [ ] Tested on multiple screen sizes
- [ ] No console errors
- [ ] Build completes with no errors

---

## Related Files

**Modified:**
- `src/app/profile/index.tsx` - Update layout to 2-column grid
- `src/app/settings/index.tsx` - Update layout to 2-column grid

**Reference:**
- `src/app/dashboard/index.tsx` - Check max-width and layout patterns

---

## Estimated Effort

**Story Points:** 1

**Breakdown:**
- Check current layout: 10 min
- Update Profile page: 20 min
- Update Settings page: 20 min
- Test responsive breakpoints: 20 min
- Adjust card content if needed: 15 min
- Visual QA: 15 min

**Total:** ~1.5 hours

---

## Success Metrics

**User Experience:**
- Better use of desktop screen space
- Less vertical scrolling
- More scannable content
- Consistent with rest of app

**Technical:**
- Clean grid implementation
- Responsive at all breakpoints
- No layout bugs

---

## Visual Reference

**Before (Desktop):**
```
┌─────────────────────────────┐
│  Card 1                     │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Card 2                     │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Card 3                     │
└─────────────────────────────┘
```

**After (Desktop):**
```
┌──────────────┐  ┌──────────────┐
│  Card 1      │  │  Card 2      │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│  Card 3      │  │  Card 4      │
└──────────────┘  └──────────────┘
```

**Mobile (unchanged):**
```
┌─────────────┐
│  Card 1     │
└─────────────┘

┌─────────────┐
│  Card 2     │
└─────────────┘
```

---

**Created:** November 8, 2025
**Author:** BMad Master
**Status:** Ready to Implement

