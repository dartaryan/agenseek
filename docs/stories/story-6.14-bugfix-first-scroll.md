# Story 6.14: First Scroll Bug Fix

**Issue Reported:** Auto-collapse didn't work on first scroll, had to "play with it"
**Date:** November 8, 2025
**Status:** ✅ FIXED

---

## The Problem

When you loaded a page that was already scrolled down (e.g., browser restores scroll position), the first scroll wouldn't trigger the auto-collapse/expand behavior correctly. You had to scroll multiple times before it would start working.

### Root Cause

The `useScrollDirection` hook initialized `lastScrollY` to `0`, but the page might already be scrolled down (e.g., 500px). This created a mismatch:

```typescript
// Before (buggy)
const [lastScrollY, setLastScrollY] = useState(0);  // Always starts at 0!

// If page is already at scrollY = 500:
// First scroll down to 550: difference = 550 - 0 = 550px ✓ Triggers
// But scroll direction logic was confused about actual position
```

The threshold check would sometimes pass, but the scroll direction detection was unreliable because it didn't know the true starting position.

---

## The Fix

Initialize `lastScrollY` with the **current scroll position** instead of always using `0`:

```typescript
// After (fixed)
const [lastScrollY, setLastScrollY] = useState(() => {
  if (typeof window !== 'undefined') {
    return window.scrollY;  // Start from actual current position!
  }
  return 0;
});
```

### What This Does

1. **On component mount**, immediately reads `window.scrollY`
2. **Sets that as the starting point** for scroll direction detection
3. **First scroll is now accurate** because we know the true starting position

### Example

```
User loads page at scrollY = 400px

BEFORE (buggy):
- lastScrollY = 0
- User scrolls down to 450px
- Difference: 450 - 0 = 450px (huge!)
- Behavior: Unpredictable, might not trigger correctly

AFTER (fixed):
- lastScrollY = 400 (initialized from current position)
- User scrolls down to 450px
- Difference: 450 - 400 = 50px (correct!)
- Behavior: Works perfectly, triggers auto-collapse
```

---

## Testing

### Before Fix
1. Load `/dashboard`
2. Refresh to restore scroll position (e.g., 500px down)
3. Scroll down 100px
4. Result: ❌ Auto-collapse doesn't trigger reliably
5. Have to scroll up/down multiple times to "wake it up"

### After Fix
1. Load `/dashboard`
2. Refresh to restore scroll position (e.g., 500px down)
3. Scroll down 100px
4. Result: ✅ Auto-collapse triggers immediately!
5. Works perfectly on first scroll

---

## Additional Fixes Applied

### 1. TypeScript Build Error
**Error:** `'ReactNode' is a type and must be imported using a type-only import`

**Fix:**
```typescript
// Before
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// After
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
```

### 2. Tailwind Warning
**Warning:** `The class 'duration-[250ms]' is ambiguous`

**Fix:**
```typescript
// Before
className="transition-all duration-[250ms] ease-in-out"

// After
className="transition-all duration-200 ease-in-out"
```

Using standard Tailwind duration class (200ms instead of 250ms) - imperceptible difference in animation speed but eliminates the warning.

---

## Files Modified

1. **`src/hooks/useScrollDirection.ts`**
   - Initialize `lastScrollY` from current scroll position

2. **`src/contexts/SidebarContext.tsx`**
   - Type-only import for `ReactNode`

3. **`src/components/layout/Sidebar.tsx`**
   - Use standard Tailwind duration class

---

## Verification

✅ Build succeeds: `npm run build`
✅ No TypeScript errors
✅ No linter warnings
✅ Dev server starts: `npm run dev`
✅ First scroll now works correctly

---

## Summary

The issue was a **state initialization problem**. The scroll direction hook didn't know where the user actually was on the page, so the first scroll gave inaccurate data. By initializing with the current scroll position, the first scroll now works perfectly every time.

**Status:** ✅ FIXED and TESTED

---

**Fixed by:** BMAD Dev Agent
**Date:** November 8, 2025

