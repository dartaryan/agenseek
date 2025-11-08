# Story 7.2: Header Search Bar - Testing Guide

**Story ID:** 7.2
**Sprint:** 10
**Date:** November 8, 2025

---

## Overview

This guide helps you verify that the header search bar (Story 7.2) meets all acceptance criteria and functions correctly.

---

## Prerequisites

1. Development server running (`npm run dev`)
2. Logged in as a user with some existing data
3. Browser with dev tools open (optional but recommended)

---

## Test Scenarios

### ✅ Scenario 1: Search Bar Visibility

**Steps:**
1. Navigate to any page in the application (e.g., `/dashboard`)
2. Look at the header

**Expected Results:**
- [ ] Search bar is visible in the header on desktop
- [ ] Search bar is positioned between navigation and user menu
- [ ] Search bar is hidden on mobile (< md breakpoint)
- [ ] Input shows placeholder text: "חפש מדריכים, הערות, משימות..."
- [ ] Search icon appears on the left side (RTL layout)

---

### ✅ Scenario 2: Basic Search Functionality

**Steps:**
1. Click in the search bar
2. Type "BMAD" (or any search term)
3. Wait for results

**Expected Results:**
- [ ] Dropdown appears after ~300ms delay
- [ ] Loading state shows briefly ("מחפש...")
- [ ] Results appear grouped by type (Guides, Notes, Tasks)
- [ ] Each section shows up to 5 results
- [ ] Each result displays:
  - Type icon (book/note/checklist)
  - Title with highlighted matching text
  - Snippet (2 lines) with highlighted text
  - Metadata badge (category/tags/status)
  - Search score (for debugging)

---

### ✅ Scenario 3: Match Highlighting

**Steps:**
1. Search for a term that appears in guide titles (e.g., "מדריך")
2. Observe the results

**Expected Results:**
- [ ] Matched text is wrapped in emerald-colored highlight
- [ ] Highlight color is emerald-500 with ~30% opacity
- [ ] Highlight has rounded corners
- [ ] Highlighting appears in both titles and snippets
- [ ] Hebrew text is highlighted correctly

---

### ✅ Scenario 4: Keyboard Navigation - Arrow Keys

**Steps:**
1. Type a search term to show results
2. Press Arrow Down key
3. Press Arrow Down multiple times
4. Press Arrow Up key
5. Press Arrow Up multiple times

**Expected Results:**
- [ ] First Arrow Down selects the first result
- [ ] Selected result has emerald-50 background
- [ ] Arrow Down moves selection down through all results
- [ ] Selection wraps to top when reaching bottom
- [ ] Arrow Up moves selection up through results
- [ ] Selection wraps to bottom when reaching top
- [ ] Selection highlights are clearly visible

---

### ✅ Scenario 5: Keyboard Navigation - Enter Key

**Steps:**
1. Type a search term to show results
2. Press Arrow Down to select a guide result
3. Press Enter

**Expected Results:**
- [ ] Navigation occurs to the selected guide page
- [ ] Dropdown closes
- [ ] Search query is cleared
- [ ] Page loads correctly (e.g., `/guides/{id}`)

**Repeat for:**
- [ ] Note result (should navigate to `/notes/{id}`)
- [ ] Task result (should navigate to `/tasks?id={id}`)

---

### ✅ Scenario 6: Keyboard Navigation - Escape Key

**Steps:**
1. Type a search term to show results
2. Press Escape key

**Expected Results:**
- [ ] Dropdown closes immediately
- [ ] Search query is cleared
- [ ] Input loses focus

---

### ✅ Scenario 7: Click Outside to Close

**Steps:**
1. Type a search term to show results
2. Click anywhere outside the search dropdown (e.g., on the page content)

**Expected Results:**
- [ ] Dropdown closes
- [ ] Search query remains in input (not cleared)

---

### ✅ Scenario 8: Clicking on Results

**Steps:**
1. Type a search term to show results
2. Click on a guide result
3. Return and repeat for note and task results

**Expected Results:**
- [ ] Clicking guide navigates to guide page
- [ ] Clicking note navigates to note page
- [ ] Clicking task navigates to tasks page
- [ ] Dropdown closes after clicking
- [ ] Search query is cleared

---

### ✅ Scenario 9: "View All Results" Link

**Steps:**
1. Type a search term that returns many results
2. Look at the bottom of the dropdown
3. Click "צפה בכל X התוצאות"

**Expected Results:**
- [ ] Link shows correct total count
- [ ] Link has arrow icon
- [ ] Clicking navigates to `/search?q={query}`
- [ ] Query parameter is properly encoded
- [ ] Dropdown closes after clicking

---

### ✅ Scenario 10: Empty Search

**Steps:**
1. Type a search term to show results
2. Delete all text from the input

**Expected Results:**
- [ ] Dropdown closes when query becomes empty
- [ ] No errors in console

---

### ✅ Scenario 11: No Results

**Steps:**
1. Type a search term that doesn't match anything (e.g., "xyzabc123")
2. Wait for search to complete

**Expected Results:**
- [ ] Dropdown does not appear (no results)
- [ ] No error messages shown
- [ ] No console errors

---

### ✅ Scenario 12: Search Across Different Types

**Steps:**
1. Search for a term that appears in guides (e.g., "BMAD")
2. Note the results
3. Search for a term that appears in your notes
4. Search for a term that appears in your tasks

**Expected Results:**
- [ ] Guide search returns relevant guides
- [ ] Note search returns relevant notes
- [ ] Task search returns relevant tasks
- [ ] Each section only appears when it has results
- [ ] Results are properly grouped by type

---

### ✅ Scenario 13: Hebrew Text Search

**Steps:**
1. Search using Hebrew text (e.g., "מדריך")
2. Observe results

**Expected Results:**
- [ ] Hebrew search terms work correctly
- [ ] Hebrew text is highlighted properly
- [ ] RTL layout is correct
- [ ] No text overflow or layout issues

---

### ✅ Scenario 14: Debounce Behavior

**Steps:**
1. Type characters rapidly in the search bar
2. Observe when search is triggered

**Expected Results:**
- [ ] Search does not trigger on every keystroke
- [ ] Search waits ~300ms after last keystroke
- [ ] Only one search request is made per typing pause
- [ ] Loading state appears briefly

---

### ✅ Scenario 15: Navigation Between Pages

**Steps:**
1. Perform a search on the dashboard page
2. Click a result to navigate
3. Use browser back button
4. Perform another search

**Expected Results:**
- [ ] Search bar works on all pages
- [ ] Search state does not persist between navigations
- [ ] Search bar resets after navigation
- [ ] No state leakage between searches

---

### ✅ Scenario 16: Responsive Design - Desktop

**Steps:**
1. View on desktop browser (> 768px width)
2. Perform a search

**Expected Results:**
- [ ] Search bar is visible and properly sized
- [ ] Max width is applied (max-w-md)
- [ ] Dropdown is properly positioned below input
- [ ] Results are readable and well-spaced
- [ ] Hover states work on desktop

---

### ✅ Scenario 17: Responsive Design - Mobile

**Steps:**
1. Resize browser to mobile width (< 768px)
2. Look for search bar in header

**Expected Results:**
- [ ] Search bar is hidden on mobile (md:flex)
- [ ] Header layout remains intact
- [ ] No overflow or layout issues

---

### ✅ Scenario 18: Multiple Rapid Searches

**Steps:**
1. Type "BMAD", wait for results
2. Clear and type "מדריך", wait for results
3. Clear and type "test", wait for results
4. Repeat several times

**Expected Results:**
- [ ] Each search works independently
- [ ] No race conditions or stale results
- [ ] Dropdown updates correctly
- [ ] No memory leaks or performance degradation

---

### ✅ Scenario 19: Search Result Snippets

**Steps:**
1. Search for a term
2. Examine the snippets shown for each result

**Expected Results:**
- [ ] Snippets are truncated to ~100 characters
- [ ] Ellipsis (...) shown for truncated text
- [ ] Matched text is highlighted in snippets
- [ ] Snippets provide context for the match
- [ ] No text overflow

---

### ✅ Scenario 20: Browser Compatibility

**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Edge
4. (Optional) Test in Safari

**Expected Results:**
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Edge (latest)
- [ ] Works in Safari (if tested)
- [ ] Consistent behavior across browsers

---

## Edge Cases to Test

### Edge Case 1: Very Long Search Query

**Steps:**
1. Type a very long search string (100+ characters)

**Expected:**
- [ ] Input handles long text without overflow
- [ ] Search still works
- [ ] URL encoding works for "view all" link

---

### Edge Case 2: Special Characters

**Steps:**
1. Search for text with special characters: `@#$%^&*()`

**Expected:**
- [ ] Special characters handled correctly
- [ ] No JavaScript errors
- [ ] URL encoding works properly

---

### Edge Case 3: No User Data

**Steps:**
1. Log in as a new user with no notes or tasks
2. Perform a search

**Expected:**
- [ ] Only guides section appears
- [ ] No errors for missing notes/tasks
- [ ] Graceful handling of empty data

---

### Edge Case 4: Rapid Open/Close

**Steps:**
1. Type text to open dropdown
2. Press Escape
3. Type text again
4. Click outside
5. Repeat rapidly

**Expected:**
- [ ] Dropdown opens and closes smoothly
- [ ] No flickering or visual glitches
- [ ] Event listeners work correctly

---

## Performance Checks

### Performance 1: Initial Load

**Steps:**
1. Load the page with search bar
2. Check browser dev tools (Performance tab)

**Expected:**
- [ ] Search bar renders quickly (< 100ms)
- [ ] No significant impact on page load time
- [ ] No console warnings

---

### Performance 2: Search Speed

**Steps:**
1. Perform a search
2. Measure time from typing to results

**Expected:**
- [ ] Results appear within ~500ms total
- [ ] Debounce delay is consistent (300ms)
- [ ] No lag or stuttering

---

### Performance 3: Memory Leaks

**Steps:**
1. Perform 20+ searches in rapid succession
2. Check browser memory usage

**Expected:**
- [ ] Memory usage remains stable
- [ ] No significant memory growth
- [ ] Event listeners properly cleaned up

---

## Accessibility Checks

### A11y 1: Keyboard Only Navigation

**Steps:**
1. Use only keyboard (no mouse)
2. Tab to search bar
3. Type search
4. Navigate results with arrows
5. Press Enter to select

**Expected:**
- [ ] Can reach search bar via Tab
- [ ] Can type in search bar
- [ ] Can navigate all results
- [ ] Can select and activate results
- [ ] Can close with Escape
- [ ] No keyboard traps

---

### A11y 2: Focus Indicators

**Steps:**
1. Tab to search bar
2. Observe focus indicator

**Expected:**
- [ ] Clear focus ring visible on input
- [ ] Focus ring uses accessible colors
- [ ] Focus ring meets WCAG contrast requirements

---

### A11y 3: Color Contrast

**Steps:**
1. Check text contrast in search results
2. Check highlight color contrast

**Expected:**
- [ ] All text meets WCAG AA standards (4.5:1)
- [ ] Highlighted text is readable
- [ ] Selected state is clearly visible

---

## Console Checks

Throughout all testing:

**Expected:**
- [ ] No console errors
- [ ] No console warnings (except Node version warning)
- [ ] No React warnings about keys or props
- [ ] No TypeScript errors

---

## Acceptance Criteria Verification

### ✅ Final Checklist

Review all acceptance criteria from the story:

- [ ] ✅ AC1: Search bar in header (right side, RTL: left side)
- [ ] ✅ AC2: Input with icon: "חפש..." (Search...)
- [ ] ✅ AC3: Dropdown appears below input when typing (debounced 300ms)
- [ ] ✅ AC4: Dropdown shows top 5 results per type (Guides, Notes, Tasks)
- [ ] ✅ AC5: Each result displays type icon, badge, title (highlighted), snippet (highlighted), metadata
- [ ] ✅ AC6: Keyboard navigation: Up/Down arrows to select, Enter to navigate, Esc to close
- [ ] ✅ AC7: "View all X results" link at bottom
- [ ] ✅ AC8: Click outside closes dropdown
- [ ] ✅ AC9: Search highlights match text with emerald background

---

## Bug Reporting

If you find any issues during testing, document them with:

1. **Issue Title:** Brief description
2. **Steps to Reproduce:** Exact steps taken
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happened
5. **Browser/Environment:** Browser, OS, screen size
6. **Screenshots:** If applicable
7. **Console Errors:** Any errors in console

---

## Sign-Off

**Tester:** _________________
**Date:** _________________
**Status:** [ ] All tests passed [ ] Issues found

**Notes:**
_____________________________________
_____________________________________

---

**Testing Guide Version:** 1.0
**Story:** 7.2 - Build Header Search Bar
**Date:** November 8, 2025

