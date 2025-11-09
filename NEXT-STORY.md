# 🚀 NEXT STORY: Story 10.2 - Optimize Guide Reader for Mobile

**Updated:** November 9, 2025

---

## ✅ Previous Work

### Story 10.1 Complete!

Mobile-responsive navigation is now fully implemented! Features include:

- **Mobile Hamburger Menu:**
  - 44x44px touch target
  - Visible only on mobile (<768px)
  - Smooth animations
  - Tabler Icons (no emojis)
- **Drawer Navigation:**
  - Slides from right (RTL support)
  - Full navigation menu (7 items)
  - Admin section for admin users (5 admin items)
  - Active route highlighting
  - User avatar and profile link
  - Theme toggle and sign out
- **Accessibility:**
  - Focus trap when open
  - Focus returns to hamburger on close
  - ESC key to close
  - Body scroll lock while open
  - Proper ARIA labels
  - Keyboard navigation (Tab, Enter, ESC)
- **Touch Interactions:**
  - All buttons ≥44x44px
  - Immediate visual feedback
  - Smooth scrolling
  - No hover interference
- **Desktop Unchanged:**
  - Hamburger hidden on desktop
  - Standard navigation visible
  - Sidebar visible

**Completion File:** See `STORY-10.1-COMPLETE.md` for full details.

**Epic 10 Status:** 1/5 stories complete (20%) ✅

---

## 📍 Next Story to Implement

### **Story 10.2: Optimize Guide Reader for Mobile**

**Epic:** 10 - Responsive Design & Accessibility
**Priority:** P0
**Sprint:** 13 (Week 13)
**Story Points:** 3
**Dependencies:** Story 10.1 Complete ✅

---

## 🎯 Story 10.2 Overview

Optimize the guide reading experience for mobile devices, including layout adaptations, typography improvements, touch gestures, and mobile-specific UI components.

### User Story

**As a mobile user reading a guide,**
**I want an optimized reading experience,**
**So that I can comfortably read content on my phone without layout issues or difficult interactions.**

---

## 📋 Acceptance Criteria

### 1. Mobile Layout Adaptations

**Given I am reading a guide on mobile (<640px)**
**When the page loads**
**Then:**

- [ ] ToC sidebar hidden by default
- [ ] Floating button (bottom-right) to open ToC as bottom sheet
- [ ] Content area full width (no 60% constraint)
- [ ] Actions sidebar hidden
- [ ] Sticky bottom action bar with icons:
  - Add note
  - Create task
  - Mark complete
  - Share (optional)

### 2. Reading Optimizations

**Given I am reading guide content on mobile**
**Then:**

- [ ] Font size: 18px (up from 16px)
- [ ] Line height: 1.8 (up from 1.6)
- [ ] Content padding: 24px horizontal
- [ ] Paragraph spacing: 1.5em
- [ ] Images responsive (max-width: 100%, height: auto)
- [ ] Code blocks:
  - Horizontal scroll if needed
  - Preserve formatting
  - Copy button visible and tappable
- [ ] Tables:
  - Horizontal scroll in container
  - Sticky first column (optional)
  - Readable on small screens
- [ ] No text overflow or horizontal page scroll

### 3. Touch Gestures

**Given I am reading on a touch device**
**Then:**

- [ ] Swipe right: Go to previous section (or previous guide)
- [ ] Swipe left: Go to next section (or next guide)
- [ ] Optional: Pinch to zoom on images
- [ ] Optional: Double-tap to zoom on images
- [ ] Smooth gesture feedback

### 4. ToC Bottom Sheet (Mobile Only)

**Given I tap the ToC floating button**
**When the bottom sheet opens**
**Then:**

- [ ] Sheet slides up from bottom
- [ ] Shows table of contents with sections
- [ ] Current section highlighted
- [ ] Progress dots for each section
- [ ] Tapping section scrolls to it and closes sheet
- [ ] Backdrop or swipe down to close
- [ ] Max height: 70% of viewport

### 5. Sticky Bottom Action Bar

**Given I am scrolling through a guide on mobile**
**Then:**

- [ ] Bottom bar fixed at viewport bottom
- [ ] 4 action buttons (icon only):
  - Add Note (IconNotes)
  - Create Task (IconChecklist)
  - Mark Complete (IconCheck)
  - Share (IconShare - optional)
- [ ] Buttons are 48x48px touch targets
- [ ] Active/completed states visible
- [ ] Tapping opens respective modal
- [ ] Bar has subtle shadow for visibility

### 6. Mobile Breadcrumbs

**Given I am on a guide page (mobile)**
**Then:**

- [ ] Breadcrumbs collapse to "< Back" button
- [ ] Back button navigates to guide library
- [ ] Guide title shown below back button
- [ ] Category badge visible

### 7. Desktop Unchanged

**Given I am on desktop (≥640px)**
**Then:**

- [ ] 3-panel layout remains (ToC | Content | Actions)
- [ ] No bottom action bar
- [ ] No floating ToC button
- [ ] Standard breadcrumbs
- [ ] All existing functionality preserved

---

## 🔨 Implementation Plan

### 1. Update Guide Reader Layout

**File:** `src/app/guides/guide-reader.tsx`

**Changes:**
- Detect screen size with `useMediaQuery` hook
- Conditionally render 3-panel vs mobile layout
- Hide ToC and actions sidebar on mobile
- Show floating ToC button on mobile
- Show sticky bottom action bar on mobile

### 2. Create Mobile ToC Bottom Sheet

**File:** `src/components/guides/MobileTocSheet.tsx` (new)

**Features:**
- Use Radix UI Sheet component (bottom variant)
- Display table of contents
- Highlight current section
- Close on section tap
- Progress indicators

### 3. Create Mobile Action Bar

**File:** `src/components/guides/MobileActionBar.tsx` (new)

**Features:**
- Fixed bottom positioning
- 4 icon buttons (note, task, complete, share)
- Opens respective modals
- Completion state handling

### 4. Add Touch Gestures

**File:** `src/hooks/useSwipeGesture.ts` (new)

**Features:**
- Detect left/right swipes
- Navigate to prev/next section or guide
- Smooth transitions
- Configurable threshold

### 5. Update Content Styles

**File:** `src/components/content/ContentRenderer.tsx` or global CSS

**Changes:**
- Increase font size and line height on mobile
- Adjust padding and spacing
- Ensure images and code blocks responsive
- Tables horizontally scrollable

### 6. Update Breadcrumbs Component

**File:** `src/components/guides/GuideBreadcrumbs.tsx`

**Changes:**
- Render "< Back" button on mobile
- Collapse breadcrumb trail
- Show guide title and category

---

## 🎨 UI/UX Considerations

### Mobile Reading Typography
- **Font Size:** 18px (larger for comfort)
- **Line Height:** 1.8 (better readability)
- **Paragraph Spacing:** 1.5em between paragraphs
- **Max Line Length:** ~60 characters ideal

### ToC Bottom Sheet
- **Height:** 70% of viewport max
- **Animation:** Slide up 300ms ease-out
- **Backdrop:** Semi-transparent
- **Close:** Swipe down or tap backdrop

### Bottom Action Bar
- **Height:** 64px
- **Background:** White with subtle shadow
- **Icons:** 24x24px, emerald color
- **Spacing:** Evenly distributed
- **Safe Area:** Account for iOS notch/home indicator

### Floating ToC Button
- **Position:** Bottom-right, 16px from edges
- **Size:** 56x56px
- **Icon:** IconList (Tabler)
- **Color:** Emerald background, white icon
- **Shadow:** Medium elevation
- **Animation:** Fade in/out on scroll (optional)

---

## 🧪 Testing Scenarios

### Happy Path - Mobile Reading

1. User opens guide on mobile (iPhone 375px)
2. **Expected:**
   - Content full width
   - Font size 18px, line height 1.8
   - ToC hidden, floating button visible
   - Bottom action bar visible
   - Images responsive, no overflow
3. User taps ToC button
4. **Expected:**
   - Bottom sheet slides up
   - ToC with current section highlighted
   - Tapping section scrolls and closes
5. User swipes left
6. **Expected:**
   - Navigates to next section
   - Smooth transition

### Happy Path - Bottom Action Bar

1. User scrolls in guide (mobile)
2. **Expected:**
   - Bottom bar stays fixed at bottom
   - All 4 buttons visible
3. User taps "Add Note" button
4. **Expected:**
   - Note modal opens
   - Guide pre-filled
5. User saves note
6. **Expected:**
   - Modal closes
   - Success toast
   - Note count updated

### Happy Path - Touch Gestures

1. User swipes right on guide content
2. **Expected:**
   - Navigates to previous section
   - URL updates
   - Content updates smoothly
3. User swipes left
4. **Expected:**
   - Navigates to next section
   - Smooth transition

### Edge Case - First/Last Section

1. User is on first section
2. User swipes right
3. **Expected:**
   - Optional: Navigate to previous guide
   - Or: Show toast "First section"
   - Or: Bounce animation (no action)
4. User is on last section
5. User swipes left
6. **Expected:**
   - Optional: Navigate to next guide
   - Or: Show toast "Last section"

### Edge Case - Long Tables

1. Guide has wide table
2. User views on mobile
3. **Expected:**
   - Table in scrollable container
   - Horizontal scroll works smoothly
   - No page-wide overflow
   - Optional: Sticky first column

---

## 🔐 Accessibility Requirements

### Touch Targets
- All interactive elements ≥44x44px
- Bottom action bar buttons: 48x48px
- ToC items: 44px minimum height

### Keyboard Navigation (Mobile)
- External keyboard support (tablets)
- Tab through action bar buttons
- Enter to activate

### Screen Reader
- Action bar buttons have aria-labels
- ToC button has descriptive label
- Swipe gestures announced (if possible)

### Zoom and Scaling
- Content zoomable (no maximum-scale restriction)
- Layout adapts to zoom
- No fixed positioning issues when zoomed

---

## ✅ Definition of Done

Before marking story complete:

- [ ] Mobile layout implemented (content full width)
- [ ] ToC hidden, floating button shown on mobile
- [ ] Mobile ToC bottom sheet functional
- [ ] Bottom action bar implemented
- [ ] 4 action buttons functional (note, task, complete, share)
- [ ] Touch gestures implemented (swipe left/right)
- [ ] Reading typography optimized (18px, 1.8 line height)
- [ ] Content padding adjusted (24px)
- [ ] Images responsive
- [ ] Code blocks scrollable horizontally
- [ ] Tables scrollable horizontally
- [ ] Breadcrumbs collapsed to "< Back" on mobile
- [ ] Desktop layout unchanged
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Build succeeds
- [ ] Tested on iPhone (Safari)
- [ ] Tested on Android (Chrome)
- [ ] Tested on tablet (iPad)
- [ ] All acceptance criteria verified

---

## 🚀 Ready to Implement!

Story 10.1 complete! Story 10.2 will optimize the guide reading experience for mobile devices, making content comfortable and accessible to read on phones.

**Key Changes:**
- Mobile-first guide reader layout
- Touch-optimized interactions
- Improved typography for reading
- Bottom action bar for quick actions
- ToC as bottom sheet
- Swipe gestures for navigation

**Full details in:** Story 10.2 acceptance criteria (above)

**Let's make guide reading delightful on mobile! 📱📚**

---

## 📚 Related Stories

### Completed:
- ✅ Story 4.5: Guide Reader 3-Panel Layout (desktop foundation)
- ✅ Story 5.1.1: Mobile Reader UX Improvements (initial mobile work)
- ✅ Story 6.3: Quick Note from Guide
- ✅ Story 6.7: Task Quick Actions from Guide
- ✅ Story 10.1: Mobile-Responsive Navigation

### To Be Enhanced:
- Story 10.3: Accessibility Compliance (builds on 10.2)
- Story 10.4: Performance Optimization (loading, rendering)
- Story 10.5: Responsive Layouts (dashboard, library)
