# Story 6.13: Header Navigation - Visual Testing Guide

**For:** Ben (User/Product Owner)
**Date:** November 8, 2025
**Story:** 6.13 - Header Icon Navigation

---

## Quick Start Testing

1. **Start the development server** (should already be running):
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Login** with your test account

---

## Test Scenarios

### ✅ Scenario 1: Header Nav with Collapsed Sidebar

**Steps:**
1. Navigate to Dashboard (`/dashboard`)
2. Sidebar should be visible on the left (desktop view)
3. Click the collapse button in the sidebar (top-right of sidebar)
4. **Verify:** Header navigation icons appear between the logo and search bar

**Expected Result:**
- 5 icon buttons appear in a horizontal row
- Icons: Home, Book, Notes, Checklist, Chart
- Icons have subtle gray appearance (ghost variant)
- Current page icon (Home) has emerald background

**Screenshot Opportunity:** Take a screenshot of the header with collapsed sidebar

---

### ✅ Scenario 2: Tooltips on Hover

**Steps:**
1. With sidebar collapsed (from Scenario 1)
2. Hover your mouse over each navigation icon
3. Wait about 300ms (less than half a second)

**Expected Result:**
- Tooltip appears below the icon
- Shows Hebrew label (דף הבית, מדריכים, הערות, משימות, התקדמות)
- Tooltip has dark background with white text
- Arrow pointing to the icon

**Screenshot Opportunity:** Take a screenshot with tooltip visible

---

### ✅ Scenario 3: Navigation Works

**Steps:**
1. With sidebar collapsed
2. Click the "Guides" icon (book icon)
3. Page should navigate to `/guides`
4. Click the "Notes" icon
5. Page should navigate to `/notes`

**Expected Result:**
- Clicking icons navigates to the correct pages
- Active icon updates with emerald background
- Tooltip disappears when clicked
- Page loads normally

---

### ✅ Scenario 4: Header Nav on Guide Reading Page

**Steps:**
1. Navigate to Guides page (`/guides`)
2. Click on any guide to open it
3. You should be on `/guides/:slug` (e.g., `/guides/developers`)
4. Sidebar may be visible (expanded)

**Expected Result:**
- Header navigation icons are ALWAYS visible on guide pages
- Even if sidebar is expanded, header nav shows
- This gives quick navigation without needing the sidebar

**Screenshot Opportunity:** Take a screenshot of guide reading page with header nav

---

### ✅ Scenario 5: Header Nav Hidden with Expanded Sidebar

**Steps:**
1. If sidebar is collapsed, expand it (there should be an expand button somewhere)
2. Navigate to Dashboard or any non-guide page
3. Sidebar should be fully visible

**Expected Result:**
- Header navigation icons are HIDDEN
- Only logo, search bar, and user menu visible in header
- Sidebar provides full navigation

---

### ✅ Scenario 6: Mobile View

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (iPhone, iPad, etc.)
4. Navigate through the app

**Expected Result:**
- Header navigation icons are NOT visible on mobile
- Mobile hamburger menu provides navigation instead
- Logo and mobile nav button visible in header

---

### ✅ Scenario 7: Active State Highlighting

**Steps:**
1. Collapse sidebar
2. Navigate to different pages using header nav
3. Observe which icon is highlighted

**Expected Result:**
- Current page icon has emerald/green background
- Other icons have no background (ghost style)
- Active state updates immediately when clicking

---

### ✅ Scenario 8: Keyboard Navigation

**Steps:**
1. Collapse sidebar
2. Press Tab key repeatedly
3. Navigate through header elements

**Expected Result:**
- Tab moves focus through header nav icons
- Focus indicator visible (outline or border)
- Press Enter on a focused icon navigates to that page
- Screen reader announces icon labels (if testing with screen reader)

---

## Visual Checklist

When testing, verify these visual elements:

### Icons
- [ ] Icons are the correct size (not too big or small)
- [ ] Icons are clear and recognizable
- [ ] Icons match Tabler Icons style

### Spacing
- [ ] Icons have minimal spacing between them (looks compact)
- [ ] Header doesn't feel crowded
- [ ] Logo, nav, search, and user menu all fit comfortably

### Colors
- [ ] Active icon has emerald/green tint
- [ ] Inactive icons are gray
- [ ] Hover state is subtle
- [ ] Colors match the Agenseek theme

### Layout
- [ ] Header nav is centered vertically in header
- [ ] No overlap with other header elements
- [ ] Responsive - everything fits on different screen sizes
- [ ] RTL layout works (text flows right-to-left correctly)

---

## Common Issues to Watch For

### ❌ Issue: Header nav doesn't appear when collapsing sidebar
**Solution:** Make sure you're on a non-guide page (dashboard, notes, tasks, etc.)

### ❌ Issue: Tooltips don't appear
**Solution:** Verify you're hovering for at least 300ms. If still not working, check console for errors.

### ❌ Issue: Icons are too large/small
**Solution:** Report this - may need size adjustment

### ❌ Issue: Header feels cramped
**Solution:** Report this - may need to adjust spacing or hide search bar when nav shows

### ❌ Issue: Active state doesn't update
**Solution:** Report this - routing or active state detection issue

---

## Success Criteria

Story 6.13 is successful if:

1. ✅ Header navigation icons appear when sidebar is collapsed
2. ✅ Header navigation icons always appear on guide reading pages
3. ✅ Tooltips work and show Hebrew labels
4. ✅ Clicking icons navigates correctly
5. ✅ Active state highlights properly
6. ✅ Mobile view doesn't show header nav
7. ✅ Layout is responsive and doesn't break
8. ✅ Accessibility works (keyboard, screen readers)

---

## Reporting Issues

If you find any issues, please note:

1. **What you did** (steps to reproduce)
2. **What you expected** (correct behavior)
3. **What actually happened** (the bug)
4. **Screenshot** (if visual issue)
5. **Browser/device** (Chrome, Firefox, mobile, etc.)

Example:
```
Issue: Tooltip shows incorrect label

Steps:
1. Collapse sidebar
2. Hover over "Notes" icon

Expected: Tooltip shows "הערות"
Actual: Tooltip shows "דף הבית"

Browser: Chrome 120 on Windows
Screenshot: [attached]
```

---

## Next Steps After Testing

Once you've tested and approved:

1. Mark the story as "APPROVED" in story-6.13-header-icon-navigation.md
2. Report any issues found
3. If approved, story can be closed
4. Move on to Story 6.14 (Context-Aware Navigation - scroll behavior)

---

**Happy Testing!** 🎉

If you have any questions or need clarifications, please let me know.


