# Story 0.18: Add Journey Card to Dashboard

**Status:** Pending
**Created:** November 9, 2025
**Epic:** 0 - On-the-Go Stories

---

## User Story

As a user,
I want a prominent Journey card at the top of my dashboard,
So that I can quickly see my learning path progress and navigate to my journey.

---

## Acceptance Criteria

**Given** I am viewing my dashboard
**When** the page loads
**Then**:
- I see a full-width card at the very top (before the 3-column grid)
- The card displays "מסלול הלמידה שלי" (My Learning Journey) as the title
- It shows my overall journey progress (X% complete)
- It shows my current phase name
- It displays the next recommended guide to read
- It has a prominent CTA button "המשך במסע" (Continue Journey)
- The card has a beautiful, engaging design with gradients or background effects
- The card is responsive on all screen sizes

**And When** I click the CTA button or card
**Then** I am navigated to `/journey` page

---

## Technical Notes

**Files to Create:**
1. `src/components/dashboard/JourneyCard.tsx`
   - Full-width card component
   - Fetches journey stats from `getJourneyData`
   - Shows: overall progress, current phase, next recommended guide
   - Beautiful gradient background
   - Click-through to `/journey`

**Files to Modify:**
1. `src/app/dashboard/index.tsx`
   - Add JourneyCard at the top (before the 3-column grid)
   - Fetch journey data in main useEffect
   - Pass journey stats to JourneyCard

**Data Required:**
- Overall journey progress percentage
- Current phase name and progress
- Next recommended guide (title, estimated time)

**Design Guidelines:**
- Use emerald/green gradient for journey theme
- Include subtle background patterns or shapes
- Large, readable text for progress
- Prominent CTA button
- Icon: Use IconRoute or IconMap2
- Card should feel inviting and motivating

**Dependencies:**
- Story 0.10.1 (Journey data structure)
- Story 0.10.3 (Next recommended guide logic)

**Testing:**
- [ ] Card appears at top of dashboard
- [ ] Shows correct journey stats
- [ ] CTA navigates to /journey
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading state while fetching data
- [ ] Error handling if journey data fails

---

## Design Mockup Ideas

```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] מסלול הלמידה שלי                                      │
│                                                               │
│ אתה בשלב: מדריכי ליבה (75% הושלם)                            │
│ ███████████████░░░░░░ 68% מהמסע הושלם                         │
│                                                               │
│ המדריך הבא שלך: "מדריך למתחילים" (15 דקות)                  │
│                                     [המשך במסע →]             │
└─────────────────────────────────────────────────────────────┘
```

