# Story 0.2: Enhanced Loading States with Branded Animated Loader

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 2
**Priority:** P2 (Medium)
**Dependencies:** None

---

## User Story

As a user,
I want to see a visually appealing branded loader instead of text,
So that the app feels polished and professional during loading states.

---

## Business Context

**Current State:**
- Loading states show text-based indicators
- Generic loading experience across the app
- No branded visual identity during wait times

**Impact:**
- Missed opportunity for brand reinforcement
- Less polished user experience
- Inconsistent loading patterns

**Solution:**
- Replace all text loaders with branded animated logo
- Logo spins in one direction
- Contained within a circle that spins in opposite direction
- No text - purely visual and modern

---

## Acceptance Criteria

### Given I am using the application
### When any loading state occurs
### Then I should see:

1. **Branded Animated Loader:**
   - ✅ App logo spinning in one direction (e.g., clockwise)
   - ✅ Loading circle/ring spinning in opposite direction (e.g., counter-clockwise)
   - ✅ Smooth animation with appropriate speed
   - ✅ Centered positioning in loading area
   - ✅ Appropriate size based on context (small, medium, large variants)
   - ✅ No text accompanying the loader
   - ✅ Works in both light and dark mode

2. **Application-Wide Coverage:**
   - ✅ Dashboard loading states
   - ✅ Guides page loading
   - ✅ Admin page loading
   - ✅ Profile page loading
   - ✅ Settings page loading
   - ✅ Content loading states
   - ✅ Data fetch operations
   - ✅ Form submissions
   - ✅ Any other async operations

3. **Performance:**
   - ✅ Lightweight animation (no performance impact)
   - ✅ GPU-accelerated transforms
   - ✅ No layout shift when loader appears/disappears

4. **Accessibility:**
   - ✅ Includes aria-label for screen readers
   - ✅ Respects prefers-reduced-motion setting
   - ✅ Visible in high contrast mode

---

## Technical Implementation

### Step 1: Create BrandedLoader Component

**File:** `src/components/ui/branded-loader.tsx` (NEW FILE)

**Create:**
```typescript
import { useEffect, useState } from 'react';
import { IconLoader } from '@tabler/icons-react';

interface BrandedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Branded animated loader with logo spinning inside a counter-rotating circle
 */
export function BrandedLoader({ size = 'md', className = '' }: BrandedLoaderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const logoSizes = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}
      role="status"
      aria-label="טוען"
    >
      {/* Outer circle - spins counter-clockwise */}
      <div
        className={`absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400 ${
          prefersReducedMotion ? '' : 'animate-spin-reverse'
        }`}
        style={{ animationDuration: '1.5s' }}
      />

      {/* Inner logo - spins clockwise */}
      <div
        className={`${logoSizes[size]} ${prefersReducedMotion ? '' : 'animate-spin'}`}
        style={{ animationDuration: '2s' }}
      >
        {/* TODO: Replace with actual app logo */}
        <div className="w-full h-full bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
          AS
        </div>
      </div>
    </div>
  );
}
```

**Notes:**
- Uses Tabler Icons initially, replace center with actual logo
- Respects `prefers-reduced-motion`
- Three size variants for different contexts
- Customizable via className prop

---

### Step 2: Add Custom Animation to Tailwind

**File:** `tailwind.config.js`

**Add:**
```javascript
module.exports = {
  // ... existing config
  theme: {
    extend: {
      animation: {
        'spin-reverse': 'spin-reverse 1.5s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
  },
};
```

---

### Step 3: Replace Loading States Across Application

**Files to Update:**

1. **Dashboard** - `src/app/dashboard/index.tsx`
   - Replace existing loading indicator
   - Use `<BrandedLoader size="lg" />`

2. **Guides** - `src/app/guides/index.tsx`
   - Replace loading text
   - Use `<BrandedLoader size="md" />`

3. **Admin** - `src/app/admin/index.tsx`
   - Replace loading states
   - Use `<BrandedLoader size="md" />`

4. **Profile** - `src/app/profile/index.tsx`
   - Replace loading indicator
   - Use `<BrandedLoader size="md" />`

5. **Settings** - `src/app/settings/index.tsx`
   - Replace loading states
   - Use `<BrandedLoader size="md" />`

6. **Guide Reader** - `src/components/GuideReader.tsx`
   - Replace content loading
   - Use `<BrandedLoader size="sm" />`

**Example Replacement:**
```typescript
// Before:
{isLoading && <div>טוען...</div>}

// After:
{isLoading && (
  <div className="flex items-center justify-center min-h-[400px]">
    <BrandedLoader size="lg" />
  </div>
)}
```

---

### Step 4: Create Loading State Wrapper (Optional)

**File:** `src/components/ui/loading-state.tsx` (NEW FILE)

**Create:**
```typescript
import { BrandedLoader } from './branded-loader';

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  minHeight?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Wrapper that shows BrandedLoader while loading, children when loaded
 */
export function LoadingState({
  loading,
  children,
  minHeight = 'min-h-[400px]',
  size = 'lg',
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${minHeight}`}>
        <BrandedLoader size={size} />
      </div>
    );
  }

  return <>{children}</>;
}
```

---

### Step 5: Update Logo Asset

**Action:** Replace placeholder "AS" with actual logo

**Options:**
1. SVG logo in `/public/logo.svg`
2. Image component: `<img src="/logo.svg" alt="" className="w-full h-full" />`
3. Or inline SVG for better control

---

### Step 6: Test All Loading States

**Manual Testing:**
1. Dashboard: Check initial load
2. Guides: Check guide list load
3. Admin: Check table data load
4. Profile: Check profile data load
5. Settings: Check settings load
6. Guide Reader: Check content load
7. Test in light and dark mode
8. Test with reduced motion preference enabled
9. Verify smooth animations
10. Check performance (no jank)

---

## Definition of Done

- [ ] BrandedLoader component created
- [ ] Tailwind config updated with spin-reverse animation
- [ ] All loading states in Dashboard replaced
- [ ] All loading states in Guides replaced
- [ ] All loading states in Admin replaced
- [ ] All loading states in Profile replaced
- [ ] All loading states in Settings replaced
- [ ] All loading states in Guide Reader replaced
- [ ] Logo asset integrated (not placeholder)
- [ ] Respects prefers-reduced-motion
- [ ] Works in light and dark mode
- [ ] Three size variants working correctly
- [ ] No console errors
- [ ] No performance issues
- [ ] Build completes with no errors
- [ ] Manual testing passes in all contexts

---

## Related Files

**Created:**
- `src/components/ui/branded-loader.tsx` - Main loader component
- `src/components/ui/loading-state.tsx` - Optional wrapper

**Modified:**
- `tailwind.config.js` - Add spin-reverse animation
- `src/app/dashboard/index.tsx` - Replace loading states
- `src/app/guides/index.tsx` - Replace loading states
- `src/app/admin/index.tsx` - Replace loading states
- `src/app/profile/index.tsx` - Replace loading states
- `src/app/settings/index.tsx` - Replace loading states
- `src/components/GuideReader.tsx` - Replace loading states

---

## Estimated Effort

**Story Points:** 2

**Breakdown:**
- Create BrandedLoader component: 30 min
- Add Tailwind animation: 10 min
- Replace Dashboard loaders: 15 min
- Replace Guides loaders: 15 min
- Replace Admin loaders: 15 min
- Replace Profile loaders: 10 min
- Replace Settings loaders: 10 min
- Replace other loaders: 20 min
- Integrate actual logo: 15 min
- Test all contexts: 30 min
- Dark mode testing: 10 min
- Accessibility testing: 10 min

**Total:** ~3 hours

---

## Success Metrics

**User Experience:**
- More polished and professional loading experience
- Consistent branded experience across all pages
- Smooth, modern animations

**Technical:**
- Zero performance impact
- Works across all browsers
- Accessible to all users

---

**Created:** November 8, 2025
**Author:** BMad Master
**Status:** Ready to Implement

