# 🚀 NEXT STORY: Story 0.5 - Expand Avatar Collection & Add Onboarding Avatar Selection

**Updated:** November 8, 2025

---

## ✅ Previous Work

### Story 9.4 Complete!

Admins now have comprehensive user engagement insights! Features include:

- **User Segmentation** with four categories:
  - Highly engaged (70%+ progress) - Green
  - Moderately engaged (30-70% progress) - Blue
  - Low engagement (<30% progress) - Amber
  - At risk (never onboarded) - Red
- **Engagement Funnel** with five stages:
  - Registered → Onboarded → First Guide → 5 Guides → All Core Complete
  - Drop-off rates calculated for each transition
  - Visual progress bars showing funnel progression
- **Activity Heatmap** showing:
  - 7x24 grid (day of week vs hour of day)
  - Last 30 days of activity data
  - Color-coded heat intensity
  - Interactive tooltips with activity counts
- **Cohort Analysis** by registration month:
  - User count per cohort
  - Retention rate (% active in last 30 days)
  - Completion rate (average progress)
  - Visual progress bars for metrics
- **Export Functionality:**
  - Export individual segment user lists to CSV
  - Export overall engagement report to CSV
  - Files include user details and progress metrics
- **Hebrew localization** throughout
- **Responsive design** for all devices
- **Color-coded visualizations** for quick insights

**Completion File:** See `STORY-9.4-COMPLETE.md` for full details.

**Epic 9 Status:** 4/6 stories complete (67%)

---

## 📍 Next Story to Implement

### **Story 0.5: Expand Avatar Collection & Add Onboarding Avatar Selection**

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Priority:** P2
**Sprint:** Current (Ad-hoc)
**Story Points:** 3
**Dependencies:** Story 0.3 Complete ✅

---

## 🎯 Story 0.5 Overview

Expand the avatar collection from 4 to 8 styles (192 total options) and integrate avatar selection as Step 2 in the onboarding flow. Also update Hebrew term from "הדרכה" to "און בורדינג" throughout the application.

### User Story

**As a new user,**
**I want to choose from a wider variety of avatars during onboarding,**
**So that I can express my personality and feel more connected to the platform from the start.**

---

## 📋 Acceptance Criteria

### 1. Expanded Avatar Collection

**Given I am selecting an avatar**
**Then I should see:**

- [ ] **8 avatar styles** (expanded from 4):
  1. Avataaars (פרצופים מצוירים)
  2. Bottts (רובוטים)
  3. Lorelei (פרצופים מאוירים)
  4. Personas (פרצופים מגוונים)
  5. Micah (דמויות מינימליסטיות) - NEW
  6. Adventurer (הרפתקנים) - NEW
  7. Big Smile (חיוך גדול) - NEW
  8. Fun Emoji (אימוג'ים כיפיים) - NEW
- [ ] 24 variations per style
- [ ] Total 192 avatar options (doubled from 96)
- [ ] Hebrew labels for all styles

### 2. Onboarding Avatar Selection Step

**Given I am going through onboarding**
**When I reach Step 2**
**Then:**

- [ ] Avatar selection step displays after welcome
- [ ] Shows "בחר את האווטר שלך" title
- [ ] Displays 8 style tabs
- [ ] Shows 12 avatar options per style
- [ ] Large preview of selected avatar
- [ ] Can select any avatar
- [ ] "Next" button proceeds to role selection
- [ ] "Back" returns to welcome
- [ ] "Skip" uses default avatar
- [ ] Selected avatar saves to profile

### 3. Updated Onboarding Flow (6 Steps)

**New flow:**
1. Welcome (ברוכים הבאים)
2. Avatar Selection (בחירת אווטר) ⭐ NEW
3. Role Selection (תפקיד)
4. Interests (תחומי עניין)
5. Experience (ניסיון)
6. Learning Path (נתיב למידה)

**Requirements:**
- [ ] `TOTAL_STEPS = 6` (changed from 5)
- [ ] Progress shows "X / 6"
- [ ] All steps navigate correctly
- [ ] Avatar saves on completion

### 4. Hebrew Localization Update

**Given** Hebrew localization
**Then:**

- [ ] Update "הדרכה" → "און בורדינג" throughout
- [ ] Profile page button updated
- [ ] Guide categories updated
- [ ] Navigation labels updated
- [ ] All Hebrew text maintains RTL

---

## 🔨 Implementation Plan

### 1. Install New DiceBear Collections

```bash
npm install @dicebear/micah @dicebear/adventurer @dicebear/big-smile @dicebear/fun-emoji
```

### 2. Update Avatar Library

**File:** `src/lib/avatar.ts`

- Add imports for 4 new styles
- Update `AvatarStyle` type to include 8 styles
- Update `styleCollections` object
- Update `avatarStyles` array with Hebrew labels

### 3. Create Onboarding Avatar Step

**File:** `src/components/onboarding/AvatarSelectionStep.tsx` (NEW)

**Features:**
- Large avatar preview
- 8 style tabs
- Grid of 12 avatars per style
- Selected avatar highlighted
- Back/Next/Skip navigation

### 4. Update Onboarding Wizard

**File:** `src/app/onboarding/wizard.tsx`

- Change `TOTAL_STEPS` from 5 to 6
- Add avatar state management
- Insert `AvatarSelectionStep` as Step 2
- Renumber all subsequent steps
- Save avatar config on completion

### 5. Update Progress Component

**File:** `src/components/onboarding/ProgressDots.tsx`

- Add "בחירת אווטר" label
- Support 6 steps total

### 6. Update Hebrew Localization

**File:** `src/lib/locale/he.ts`

- Add avatar step strings
- Update "הדרכה" → "און בורדינג" throughout
- Update step count from 5 to 6
- Update time from 2 to 3 minutes

### 7. Update Profile Page

**File:** `src/app/profile/index.tsx`

- Update "Return to Onboarding" button text

### 8. Update Guide Categories

**Files:** Guide metadata and category labels

- Update "הדרכה" → "און בורדינג" in category labels

---

## 🎨 UI/UX Considerations

### Avatar Selection Step Design
- **Header:** Sparkle icon with title
- **Large Preview:** 128px circular avatar with checkmark badge
- **Style Tabs:** 8 pills, active highlighted with primary color
- **Avatar Grid:** 4x3 grid (12 avatars), responsive
- **Selected State:** Ring border + checkmark overlay
- **Navigation:** Back/Skip/Next buttons at bottom

### Simplified vs. Full Selector
- **Onboarding:** 12 options per style (simpler, faster)
- **Profile/Settings:** 24 options per style (full variety)

### New Avatar Styles
1. **Micah:** Clean, minimalist illustrated characters
2. **Adventurer:** Adventure-themed with accessories
3. **Big Smile:** Happy, friendly, welcoming faces
4. **Fun Emoji:** Emoji-style with personality

### Animations
- Style tab switch: Smooth fade transition
- Avatar grid: Stagger entrance
- Preview update: Scale bounce effect
- Navigation: Slide transitions between steps

---

## 🧪 Testing Scenarios

### Happy Path - New User with Avatar Selection
1. New user registers
2. Onboarding Step 1 (Welcome)
3. Clicks "Next" → Step 2 (Avatar)
4. Sees 8 style tabs
5. Selects "הרפתקנים" (Adventurer)
6. Sees 12 adventurer avatars
7. Selects favorite avatar
8. Clicks "Next"
9. **Expected:** Avatar saved, proceeds to Step 3 (Role)

### Happy Path - Skip Avatar Selection
1. User at Step 2 (Avatar)
2. Clicks "דלג" (Skip)
3. **Expected:**
   - Default avatar assigned
   - Proceeds to Step 3
   - Can change later in Profile

### Happy Path - All 8 Styles Work
1. User on Avatar step
2. Clicks each of 8 style tabs
3. **Expected:**
   - Each loads 12 unique avatars
   - No errors
   - Previews update correctly

### Edge Case - Back Navigation
1. User at Step 3 (Role)
2. Clicks "Back"
3. **Expected:**
   - Returns to Step 2 (Avatar)
   - Previous selection preserved

### Edge Case - Existing User Re-onboarding
1. User with avatar clicks "חזור לאון בורדינג"
2. Reaches Step 2
3. **Expected:**
   - Current avatar pre-selected
   - Can change or keep existing

---

## 🔐 Security & Validation

### Client-Side
- Validate avatar style in allowed list
- Validate seed string format
- Sanitize avatar options JSON
- Prevent XSS in SVG rendering

### Server-Side
- Avatar style enum validation
- Avatar seed max length check
- Profile update requires auth

---

## ✅ Definition of Done

Before marking story complete:

- [ ] New DiceBear packages installed
- [ ] `avatar.ts` updated with 8 styles
- [ ] All 8 styles generate correctly
- [ ] Avatar selector shows 8 styles
- [ ] `AvatarSelectionStep` component created
- [ ] Onboarding wizard updated to 6 steps
- [ ] Progress shows 6 steps correctly
- [ ] Avatar step is Step 2
- [ ] All subsequent steps renumbered
- [ ] Avatar saves to database
- [ ] "און בורדינג" updated throughout
- [ ] Profile button text updated
- [ ] Guide categories updated
- [ ] Avatar step skippable
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Responsive on all devices
- [ ] Build completes successfully
- [ ] Manual testing passed

---

## 🚀 Ready to Implement!

Story 0.3 complete with avatar selection. Story 0.5 will double the avatar variety and make avatar personalization a core part of the first-time user experience.

**Key Changes:**
- 4 → 8 avatar styles (96 → 192 options)
- 5 → 6 onboarding steps
- Avatar selection as Step 2
- "הדרכה" → "און בורדינג" throughout

**Full details in:** `STORY-0.5.md`

**Let's expand the avatars! 🎨**

---

## 📚 Other Available Stories

If you'd prefer to work on Epic 9 instead:

### **Story 9.5: Implement Admin Notifications and Alerts**
- **Epic:** 9 - Admin Analytics & Management
- **Priority:** P1
- **Story Points:** 2
- **Status:** Ready to implement
- Notification bell, dropdown, alerts for admins
