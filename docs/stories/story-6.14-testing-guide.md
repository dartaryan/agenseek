# Story 6.14: Context-Aware Navigation - Testing Guide

**Feature:** Auto-collapse sidebar on scroll down, auto-expand on scroll up
**Story Points:** 4
**Date:** November 8, 2025

---

## Overview

This testing guide covers all test scenarios for the context-aware navigation behavior implemented in Story 6.14.

---

## Prerequisites

1. Application running locally: `npm run dev`
2. Browser DevTools open (for console monitoring)
3. Test user logged in
4. Multiple pages with scrollable content available

---

## Test Scenarios

### 1. Basic Auto-Collapse (Scroll Down)

**Steps:**
1. Navigate to `/dashboard`
2. Ensure sidebar is expanded (visible)
3. Scroll down slowly past 100px
4. Observe sidebar behavior

**Expected Results:**
- ✅ Sidebar smoothly collapses (width transitions from 240px to 0px)
- ✅ Animation takes 250ms (smooth, no jank)
- ✅ Content expands to fill the space
- ✅ Expand button appears at right edge
- ✅ No console errors

**Pass/Fail:** ___________

---

### 2. Basic Auto-Expand (Scroll Up)

**Steps:**
1. Start with sidebar collapsed (from previous test)
2. Scroll up (any amount)
3. Observe sidebar behavior

**Expected Results:**
- ✅ Sidebar smoothly expands (width transitions from 0px to 240px)
- ✅ Animation takes 250ms (smooth, no jank)
- ✅ Content shrinks back to accommodate sidebar
- ✅ Sidebar navigation visible again
- ✅ Expand button disappears
- ✅ No console errors

**Pass/Fail:** ___________

---

### 3. Scroll Threshold (100px)

**Steps:**
1. Navigate to `/dashboard` (refresh if needed)
2. Scroll down slowly, monitoring scroll position
3. Stop at 90px (use DevTools: `window.scrollY`)
4. Observe sidebar state
5. Continue scrolling to 110px
6. Observe sidebar state

**Expected Results:**
- ✅ At 90px: Sidebar still expanded
- ✅ At 110px: Sidebar collapses
- ✅ Threshold is exactly 100px

**Pass/Fail:** ___________

---

### 4. Manual Collapse Override

**Steps:**
1. Navigate to `/dashboard`
2. Ensure sidebar is expanded
3. Click the collapse button manually
4. Scroll up (multiple times)
5. Observe sidebar state

**Expected Results:**
- ✅ Sidebar collapses immediately on button click
- ✅ Sidebar stays collapsed when scrolling up
- ✅ Auto-expand does NOT trigger
- ✅ Manual control overrides auto-collapse behavior

**Pass/Fail:** ___________

---

### 5. Manual Expand Re-enables Auto-Collapse

**Steps:**
1. Start with sidebar manually collapsed (from previous test)
2. Click the expand button manually
3. Sidebar expands
4. Scroll down > 100px
5. Observe sidebar behavior

**Expected Results:**
- ✅ Sidebar expands immediately on button click
- ✅ When scrolling down, sidebar auto-collapses
- ✅ Auto-collapse is re-enabled after manual expand

**Pass/Fail:** ___________

---

### 6. Page Navigation Reset

**Steps:**
1. Navigate to `/dashboard`
2. Manually collapse sidebar
3. Verify sidebar stays collapsed on scroll up
4. Navigate to `/notes` (different page)
5. Scroll down > 100px
6. Observe sidebar behavior
7. Scroll up
8. Observe sidebar behavior

**Expected Results:**
- ✅ On page navigation, manual control is reset
- ✅ Auto-collapse behavior is restored
- ✅ Sidebar collapses on scroll down
- ✅ Sidebar expands on scroll up

**Pass/Fail:** ___________

---

### 7. Guide Reading Mode (No Sidebar)

**Steps:**
1. Navigate to `/guides` (library page)
2. Verify sidebar is present
3. Click on any guide to open reader
4. URL should be `/guides/[slug]`
5. Verify no sidebar is present
6. Scroll down and up
7. Check console for errors

**Expected Results:**
- ✅ Guide library (`/guides`) has sidebar
- ✅ Individual guide (`/guides/[slug]`) has NO sidebar
- ✅ Scrolling in guide reader causes no errors
- ✅ No console warnings about auto-collapse
- ✅ Guide reader displays full-width

**Pass/Fail:** ___________

---

### 8. Mobile Behavior (< 768px)

**Steps:**
1. Open DevTools
2. Enable responsive design mode
3. Set viewport to 375px width (iPhone)
4. Navigate to `/dashboard`
5. Verify mobile nav is present (hamburger)
6. Scroll down and up multiple times
7. Check console for errors

**Expected Results:**
- ✅ Desktop sidebar is hidden on mobile
- ✅ Mobile hamburger menu is present
- ✅ Scrolling does NOT trigger auto-collapse
- ✅ No console errors about auto-collapse
- ✅ Mobile navigation works correctly

**Pass/Fail:** ___________

---

### 9. Tablet Behavior (768px - 1024px)

**Steps:**
1. Open DevTools responsive design mode
2. Set viewport to 820px width (iPad)
3. Navigate to `/dashboard`
4. Verify sidebar is present
5. Scroll down > 100px
6. Observe sidebar behavior
7. Scroll up
8. Observe sidebar behavior

**Expected Results:**
- ✅ Sidebar is visible on tablet
- ✅ Auto-collapse works on scroll down
- ✅ Auto-expand works on scroll up
- ✅ Behavior identical to desktop

**Pass/Fail:** ___________

---

### 10. Animation Smoothness

**Steps:**
1. Navigate to `/dashboard`
2. Enable DevTools Performance tab
3. Start recording
4. Scroll down > 100px (trigger collapse)
5. Wait for animation to complete
6. Scroll up (trigger expand)
7. Wait for animation to complete
8. Stop recording
9. Analyze frame rate

**Expected Results:**
- ✅ No dropped frames during animation
- ✅ Animation runs at 60fps
- ✅ No layout thrashing
- ✅ CSS transitions used (not JavaScript)
- ✅ Performance score remains high

**Pass/Fail:** ___________

---

### 11. Rapid Scroll (Stress Test)

**Steps:**
1. Navigate to `/dashboard`
2. Rapidly scroll down and up multiple times
3. Observe sidebar behavior
4. Check for lag or stuttering
5. Check console for errors

**Expected Results:**
- ✅ Sidebar responds correctly to rapid scrolling
- ✅ No stuttering or lag
- ✅ Threshold prevents excessive state changes
- ✅ No console errors or warnings
- ✅ requestAnimationFrame handles it gracefully

**Pass/Fail:** ___________

---

### 12. Keyboard Navigation

**Steps:**
1. Navigate to `/dashboard`
2. Use Tab key to navigate through sidebar links
3. Scroll down to trigger auto-collapse
4. Continue using Tab key
5. Verify focus is handled correctly

**Expected Results:**
- ✅ Tab navigation works before collapse
- ✅ Tab navigation works after collapse
- ✅ Focus indicator is visible
- ✅ No focus traps
- ✅ Keyboard users can still access navigation

**Pass/Fail:** ___________

---

### 13. Screen Reader Compatibility

**Steps:**
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate to `/dashboard`
3. Scroll down to trigger collapse
4. Verify screen reader announces changes
5. Scroll up to trigger expand
6. Verify screen reader announces changes

**Expected Results:**
- ✅ Screen reader announces sidebar state
- ✅ Manual controls have proper ARIA labels
- ✅ Auto-collapse doesn't break navigation
- ✅ All elements remain accessible

**Pass/Fail:** ___________

---

### 14. RTL Layout (Hebrew)

**Steps:**
1. Verify app is in RTL mode (Hebrew)
2. Navigate to `/dashboard`
3. Verify sidebar is on RIGHT side
4. Scroll down > 100px
5. Observe collapse animation direction
6. Scroll up
7. Observe expand animation direction

**Expected Results:**
- ✅ Sidebar on right side (RTL)
- ✅ Collapse animation goes right-to-left
- ✅ Expand animation goes left-to-right
- ✅ Expand button appears on left edge when collapsed
- ✅ All animations are RTL-aware

**Pass/Fail:** ___________

---

### 15. localStorage Persistence

**Steps:**
1. Navigate to `/dashboard`
2. Manually collapse sidebar
3. Refresh the page
4. Verify sidebar is collapsed
5. Scroll up (should NOT expand due to manual control)
6. Navigate to `/notes`
7. Scroll down and up
8. Verify auto-collapse works

**Expected Results:**
- ✅ Manual collapse state persists on refresh
- ✅ Manual control persists across refreshes
- ✅ Page navigation resets manual control
- ✅ localStorage key `agenseek_sidebar_collapsed` is set

**Pass/Fail:** ___________

---

### 16. Multiple Page Navigation

**Steps:**
1. Navigate to `/dashboard`
2. Scroll down, verify collapse
3. Navigate to `/notes`
4. Scroll down, verify collapse
5. Navigate to `/tasks`
6. Scroll down, verify collapse
7. Navigate to `/profile`
8. Scroll down, verify collapse

**Expected Results:**
- ✅ Auto-collapse works on all pages
- ✅ Consistent behavior across routes
- ✅ No memory leaks from event listeners
- ✅ Performance remains stable

**Pass/Fail:** ___________

---

### 17. Edge Case: Top of Page

**Steps:**
1. Navigate to `/dashboard`
2. Ensure you're at scrollY = 0
3. Sidebar should be expanded
4. Scroll up (nothing should happen)
5. Observe sidebar state

**Expected Results:**
- ✅ At top of page, sidebar is expanded
- ✅ Scrolling up does nothing (already at top)
- ✅ No errors in console

**Pass/Fail:** ___________

---

### 18. Edge Case: Short Page (No Scroll)

**Steps:**
1. Navigate to a page with minimal content (< viewport height)
2. Try to scroll (should not be possible)
3. Observe sidebar state
4. Try to trigger auto-collapse

**Expected Results:**
- ✅ Sidebar remains expanded (no scroll possible)
- ✅ No auto-collapse triggered
- ✅ No errors in console

**Pass/Fail:** ___________

---

## Performance Benchmarks

### Metrics to Check

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Animation FPS | 60fps | _____ | _____ |
| Scroll Event Response Time | < 16ms | _____ | _____ |
| Memory Leak Check (10 min usage) | 0 leaks | _____ | _____ |
| CPU Usage During Scroll | < 30% | _____ | _____ |
| Bundle Size Increase | < 2KB | _____ | _____ |

---

## Browser Compatibility

Test auto-collapse behavior in:

| Browser | Version | Pass/Fail | Notes |
|---------|---------|-----------|-------|
| Chrome | Latest | _____ | |
| Firefox | Latest | _____ | |
| Safari | Latest | _____ | |
| Edge | Latest | _____ | |

---

## Regression Testing

Verify existing features still work:

| Feature | Pass/Fail | Notes |
|---------|-----------|-------|
| Manual collapse button | _____ | |
| Manual expand button | _____ | |
| Sidebar navigation links | _____ | |
| Sidebar tooltips | _____ | |
| Mobile navigation | _____ | |
| localStorage persistence | _____ | |
| Story 6.12 behavior | _____ | |
| Story 6.13 behavior | _____ | |

---

## Summary

**Total Tests:** 18 core scenarios + performance + browser compatibility
**Tests Passed:** _____
**Tests Failed:** _____
**Critical Bugs Found:** _____
**Minor Issues Found:** _____

---

## Sign-Off

**Tested By:** _____________________
**Date:** _____________________
**Status:** ⬜ Pass ⬜ Fail ⬜ Pass with Minor Issues

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Story 6.14 Testing Guide Complete** ✅

