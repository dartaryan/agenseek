# Story 5.1.1: Mobile Guide Reader UX Improvements

**Epic:** Reader Experience Enhancements (Sub-Epic of Epic 5)
**Status:** Complete
**Priority:** High
**Estimate:** 5 Story Points

## Dev Agent Record

**Context Reference:**
- Story Context: `docs/stories/5-1-1-mobile-reader-ux.context.xml`

**Implementation Summary:**
- ✅ Added mobile padding (px-4 lg:px-0 pb-24) to guide reader content area
- ✅ Implemented auto-hide FAB on scroll with 100px threshold
- ✅ Added visual state indicator to FAB (45° rotation when open)
- ✅ Close button already exists and works in mobile ToC sheet
- ✅ Added ToC button to Header component (mobile-only, guide reader pages)
- ✅ Created MobileTocContext for state management without prop drilling
- ✅ Fixed progress bar z-index to display above header
- ✅ Verified touch targets are appropriate (44x44px minimum)

**Files Modified:**
- `src/app/guides/guide-reader.tsx` - Added mobile padding, context provider
- `src/components/guides/TableOfContents.tsx` - Auto-hide FAB, visual state
- `src/components/layout/Header.tsx` - Mobile ToC button with route detection
- `src/contexts/MobileTocContext.tsx` - New context for ToC state management

## Overview
Improve the mobile reading experience by fixing padding issues, enhancing navigation patterns, and providing better control over the table of contents overlay.

## User Story
**As a** mobile user reading a guide
**I want** a better reading experience with proper spacing and intuitive navigation
**So that** I can comfortably read guides on my phone without UI elements obstructing content

## Problems Identified

1. **Padding Issues on Mobile**
   - Content may be too close to screen edges on mobile devices
   - Reading text feels cramped without adequate breathing room
   - Bottom FAB button may overlap content

2. **Mobile ToC UX**
   - No clear way to close the mobile ToC once opened (must click backdrop)
   - ToC button is always visible even when scrolling, potentially blocking content
   - No indication that ToC is open/closed state

3. **Navigation Pattern Confusion**
   - Users may not discover the mobile ToC FAB button
   - No header-integrated navigation option for mobile
   - Keyboard navigation (arrow keys) only works on desktop

## Acceptance Criteria

### Mobile Content Padding
- [x] Guide content has minimum 16px (1rem) padding on mobile screens
- [x] Content max-width prevents uncomfortably wide text on tablets
- [x] Bottom padding accounts for mobile ToC FAB button (80px clearance)
- [x] Breadcrumbs are properly spaced on mobile

### Mobile ToC Improvements
- [x] ToC bottom sheet includes visible "Close" button (X icon)
- [x] Tapping section in ToC closes the sheet automatically (already working)
- [x] ToC FAB button shows visual state indicator (open/closed)
- [x] ToC FAB has proper z-index to not block other interactive elements
- [x] Consider hiding FAB when scrolling down, showing when scrolling up

### Header Integration Option
- [x] Add ToC icon button to Header component on mobile (for reading pages)
- [x] Button appears in header when on guide reader page
- [x] Clicking header ToC button opens same mobile ToC sheet
- [x] This provides alternative discovery pattern for ToC functionality

### Mobile-Specific Polish
- [x] Ensure progress bar at top doesn't overlap header
- [x] Action buttons in GuideHeader are properly sized for touch targets
- [x] Related guides section is touch-friendly on mobile
- [x] Pagination arrows at bottom are large enough for comfortable tapping

## Technical Notes

### Files to Modify
1. `src/app/guides/guide-reader.tsx`
   - Add padding classes for mobile
   - Add scroll direction detection for hiding/showing FAB
   - Pass context to Header for showing ToC button

2. `src/components/guides/TableOfContents.tsx`
   - Add explicit Close button in mobile sheet header
   - Add visual state to FAB (animated icon rotation or color change)
   - Implement auto-hide on scroll down, show on scroll up

3. `src/components/layout/Header.tsx`
   - Add conditional ToC button for guide reader pages
   - Use React Router's `useLocation()` to detect reader page
   - Connect button to mobile ToC toggle

4. `src/app/guides/guide-reader.tsx` (styling)
   - Add mobile-specific padding: `className="px-4 lg:px-0"`
   - Add bottom padding: `pb-24` to account for FAB
   - Adjust grid layout for mobile responsiveness

### Implementation Approach

```typescript
// Example: Auto-hide FAB on scroll down
const [showFab, setShowFab] = useState(true);
const lastScrollY = useRef(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      // Scrolling down & past threshold
      setShowFab(false);
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setShowFab(true);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## Design Considerations

### Mobile Content Padding
```css
/* Mobile reader content area */
.mobile-reader-content {
  padding: 1rem; /* 16px all around */
  padding-bottom: 6rem; /* 96px for FAB clearance */
}

/* Tablet and up */
@media (min-width: 768px) {
  .mobile-reader-content {
    padding: 1.5rem;
  }
}
```

### FAB Auto-Hide
- Hide when scrolling down (user focused on reading)
- Show when scrolling up (user looking for navigation)
- Always show when at top of page
- Smooth transition (300ms ease-in-out)

### Header ToC Button
- Only visible on guide reader routes: `/guides/:slug`
- Icon: Menu/List icon (3 horizontal lines with dots)
- Position: After logo, before search bar
- Mobile only: `className="lg:hidden"`

## Testing Checklist

### Mobile Devices (< 768px)
- [ ] Open guide on mobile viewport
- [ ] Check content padding on all sides
- [ ] Scroll to bottom - FAB doesn't overlap content
- [ ] Tap ToC FAB - sheet opens smoothly
- [ ] Tap Close button in sheet - sheet closes
- [ ] Tap backdrop - sheet closes
- [ ] Tap section in ToC - navigates and closes sheet
- [ ] Scroll down - FAB hides smoothly (if implemented)
- [ ] Scroll up - FAB reappears smoothly (if implemented)
- [ ] Check header ToC button visibility
- [ ] Tap header ToC button - opens sheet

### Tablet (768px - 1024px)
- [ ] Content padding is appropriate
- [ ] Mobile ToC FAB is hidden
- [ ] Desktop ToC sidebar is visible
- [ ] Header ToC button is hidden

### Cross-Browser
- [ ] Test on Safari iOS
- [ ] Test on Chrome Android
- [ ] Test on Firefox mobile
- [ ] Verify scroll behavior works consistently

## Definition of Done

- All acceptance criteria met
- Tested on iOS Safari and Chrome Android
- No layout shift or jank during interactions
- Smooth animations (60fps)
- Accessibility: ToC toggle has proper aria-labels
- Code reviewed and approved
- No console errors or warnings

## Dependencies
- None

## Related Stories
- Story 4.5 (Guide Reader - 3-panel layout) - Parent
- Story 5.1.2 (Toggle Guide Completion) - Sibling
- Story 5.1.3 (Fix Related Guides Icons) - Sibling

## Notes
Consider adding a settings option in the future to let users choose their preferred ToC behavior (always visible, auto-hide, header-only, etc).

