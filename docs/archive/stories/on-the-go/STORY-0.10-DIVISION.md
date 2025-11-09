# Story 0.10: Division Into Sub-Stories

**Date:** November 9, 2025
**Status:** Divided into 3 manageable sub-stories
**Original Estimate:** 5 points, 6-9 days
**Division Rationale:** Too large for single implementation cycle

---

## 📋 Division Summary

Story 0.10 "My Learning Journey" has been divided into **3 sequential sub-stories**:

### Story 0.10.1: Journey Page Core & Data Layer
**Points:** 2-3 | **Time:** 2-3 days | **Status:** Ready for Implementation

**Focus:** Foundation and functionality

**Deliverables:**
- ✅ `/journey` route and page structure
- ✅ `getJourneyData()` and all helper functions
- ✅ Basic PhaseCard components (no animations)
- ✅ Phase unlocking logic
- ✅ Dashboard journey preview card
- ✅ Mobile responsive layout
- ✅ Journey state persistence

**Acceptance Criteria:** AC 1, 2, 3 (basic), 7, 8

**Result:** Fully functional journey page with all data logic

---

### Story 0.10.2: Visual Polish & Animations
**Points:** 2 | **Time:** 2-3 days | **Status:** Blocked by 0.10.1

**Focus:** Delightful user experience

**Deliverables:**
- ✅ Framer Motion animations (entrance, hover, transitions)
- ✅ Visual connecting line between phases (SVG)
- ✅ Progress bar animations (0 → actual %)
- ✅ Phase card entrance animations (stagger)
- ✅ Accordion smooth transitions
- ✅ Respect `prefers-reduced-motion`

**Acceptance Criteria:** AC 3 (full visual), 4, 10

**Result:** Beautiful, animated journey experience

---

### Story 0.10.3: Gamification & Integration
**Points:** 1 | **Time:** 1-2 days | **Status:** Blocked by 0.10.1 and 0.10.2

**Focus:** Celebration and integration

**Deliverables:**
- ✅ Confetti on phase completion
- ✅ Achievement system integration
- ✅ User achievements awarding
- ✅ Next recommended guide highlighting
- ✅ Integration with guides library
- ✅ Integration with guide reader
- ✅ Integration with progress page

**Acceptance Criteria:** AC 5, 6, 9

**Result:** Complete gamification and seamless integration

---

## 📊 Original vs. Divided

| Metric | Original 0.10 | Divided (0.10.1 + 0.10.2 + 0.10.3) |
|--------|---------------|-------------------------------------|
| **Points** | 5 | 2-3 + 2 + 1 = 5-6 |
| **Time** | 6-9 days | 2-3 + 2-3 + 1-2 = 5-8 days |
| **Acceptance Criteria** | 10 | 5 + 3 + 2 = 10 |
| **Testability** | End only | Each milestone |
| **Risk** | High (6-9 day task) | Low (1-3 day tasks) |

---

## ✅ Benefits of Division

### 1. Incremental Value
Each sub-story delivers working functionality:
- **0.10.1:** Users can see their journey and navigate phases
- **0.10.2:** Experience becomes delightful and polished
- **0.10.3:** Celebrations and full integration complete

### 2. Testable Milestones
- Test data accuracy before adding animations
- Test animations before adding confetti
- Isolate issues to specific sub-stories

### 3. Manageable Chunks
- Each piece: 1-3 days (vs. 6-9 days monolith)
- Clear stopping points
- Easier to estimate and track

### 4. Parallel Work Possible
If multiple developers:
- Dev A: Build 0.10.1 (functionality)
- Dev B: Prepare animation components (0.10.2)
- Dev C: Prepare achievement SQL (0.10.3)

### 5. Follows Project Pattern
Similar to Story 5.1 division:
- 5.1.1: Basic categorization
- 5.1.2: Enhanced recommendations
- 5.1.3: Final polish

---

## 🚀 Implementation Order

### Phase 1: Foundation (Story 0.10.1)
**Duration:** 2-3 days

1. Create `src/lib/journey.ts` with all data logic
2. Add `/journey` route
3. Build basic journey page structure
4. Create PhaseCard components
5. Add dashboard preview card
6. Test mobile responsiveness
7. Verify phase unlocking logic

**Checkpoint:** Journey page is functional, data is accurate

---

### Phase 2: Polish (Story 0.10.2)
**Duration:** 2-3 days

1. Install Framer Motion
2. Add hero section animations
3. Implement phase card stagger
4. Animate progress bars
5. Create connecting line SVG
6. Add accordion animations
7. Implement reduced motion support
8. Test performance (60fps)

**Checkpoint:** Journey page is beautiful and smooth

---

### Phase 3: Integration (Story 0.10.3)
**Duration:** 1-2 days

1. Install canvas-confetti
2. Add achievement SQL migration
3. Implement confetti celebration
4. Award achievements on completion
5. Highlight next recommended guide
6. Add journey badges to guides library
7. Integrate with guide reader
8. Update progress page

**Checkpoint:** Complete journey system is live

---

## 📁 Files Created

### Story 0.10.1
- `src/lib/journey.ts` - All data logic
- `src/app/journey/index.tsx` - Main journey page
- `src/components/journey/PhaseCard.tsx` - Phase display
- `src/components/journey/JourneyHero.tsx` - Hero section
- `src/components/dashboard/JourneyPreviewCard.tsx` - Dashboard widget

### Story 0.10.2
- `src/components/journey/ProgressBar.tsx` - Animated progress
- `src/components/journey/ConnectingLine.tsx` - SVG path
- `src/components/journey/GuideAccordion.tsx` - Animated accordion
- `src/hooks/usePrefersReducedMotion.ts` - Accessibility hook

### Story 0.10.3
- `src/lib/celebrations.ts` - Confetti logic
- `src/lib/achievements.ts` - Achievement awarding
- `supabase/migrations/[timestamp]_journey_achievements.sql` - New achievements

---

## 🧪 Testing Strategy

### After 0.10.1
- [ ] Journey page loads with correct data
- [ ] Phase cards display accurate progress
- [ ] Phase unlocking logic works
- [ ] Mobile responsive layout correct
- [ ] No animations break functionality

### After 0.10.2
- [ ] All animations smooth (60fps)
- [ ] Reduced motion respected
- [ ] No layout shift during animations
- [ ] Performance acceptable
- [ ] Animations enhance (don't hinder) UX

### After 0.10.3
- [ ] Confetti fires on phase completion
- [ ] Achievements awarded correctly
- [ ] Journey visible in guides library
- [ ] Guide reader shows journey context
- [ ] Progress page integrated
- [ ] Complete user flow works end-to-end

---

## 📊 Success Metrics

### Story 0.10.1 Complete When:
- [ ] Journey page functional with accurate data
- [ ] Phase cards display correctly
- [ ] Mobile responsive
- [ ] Build passes, no errors

### Story 0.10.2 Complete When:
- [ ] All animations implemented
- [ ] 60fps maintained
- [ ] Reduced motion supported
- [ ] Visual polish professional

### Story 0.10.3 Complete When:
- [ ] Confetti celebrations work
- [ ] Achievements awarded
- [ ] Full app integration complete
- [ ] End-to-end user journey tested

### Complete Story 0.10 When:
- [ ] All 3 sub-stories complete
- [ ] User can navigate full journey
- [ ] Celebrations feel rewarding
- [ ] Journey integrated throughout app
- [ ] No bugs or regressions

---

## 📝 Notes for Implementation

### For Dev Agent
When implementing, follow this exact order:
1. Complete Story 0.10.1 **fully** before starting 0.10.2
2. Complete Story 0.10.2 **fully** before starting 0.10.3
3. Test each sub-story thoroughly before moving to next

### For QA/Testing
Each sub-story should be tested independently:
- Test 0.10.1 for functionality
- Test 0.10.2 for visual quality
- Test 0.10.3 for integration

### For Product Owner
Each sub-story delivers value:
- 0.10.1: Users can see their journey
- 0.10.2: Experience is delightful
- 0.10.3: Users are celebrated and engaged

---

## 🔗 Related Files

- **Original Story:** `STORY-0.10.md`
- **Sub-Story 1:** `STORY-0.10.1.md`
- **Sub-Story 2:** `STORY-0.10.2.md`
- **Sub-Story 3:** `STORY-0.10.3.md`
- **Tracking:** `NEXT-STORY.md`
- **Progress:** `IMPLEMENTATION-STATUS.md`

---

**Created by:** BMad Master (Dev Agent)
**Date:** November 9, 2025
**Purpose:** Divide Story 0.10 into manageable implementation units
**Status:** Ready for Sequential Implementation

---

**Next Action:** Start with Story 0.10.1 - Journey Page Core & Data Layer

