# Story 0.10.3: Journey Gamification & Integration

**Parent Story:** Story 0.10 - My Learning Journey (מסלול הלמידה שלי)
**Status:** 📋 Ready for Implementation (depends on 0.10.1 and 0.10.2)
**Type:** On-the-Go Story (Gamification & Integration)
**Priority:** P1 - Important
**Sprint:** TBD | **Points:** 1 (Small)
**Created:** November 9, 2025
**Dependencies:** Stories 0.10.1 and 0.10.2 must be complete

---

## 🎯 Objective

Add celebration moments and integrate the journey system with existing features (guides library, guide reader, progress page). Make completing phases feel rewarding and connect the journey seamlessly into the user's workflow.

---

## 📖 User Story

**As a user progressing through my journey,**
**I want to be celebrated when I complete phases and see journey context in other parts of the app,**
**So that I feel motivated and understand how everything connects.**

---

## ✅ Acceptance Criteria

### 1. Phase Completion Celebration

**Given** I complete all guides in a phase
**When** the last guide is marked complete
**Then:**

- [ ] Confetti animation fires (canvas-confetti library)
- [ ] Particle count: 150
- [ ] Colors: phase-specific gradient colors
  - Core: emerald (#10b981)
  - Recommended: purple (#a855f7)
  - Interests: blue (#3b82f6)
  - Optional: orange (#f97316)
- [ ] Origin: center of completed phase card
- [ ] Duration: 3 seconds
- [ ] Success toast appears:
  - Title: "מזל טוב! השלמת את [שם השלב]"
  - Description: "השלב הבא נפתח - בוא נמשיך!"
  - Duration: 5 seconds
  - Action button: "עבור למסלול" (navigate to /journey)
- [ ] Phase card updates:
  - Status badge changes to "הושלם! ✓"
  - Progress bar fills to 100%
  - Card gets subtle green tint (bg-emerald-50/50 dark:bg-emerald-950/20)
  - Checkmark animation (draw SVG path)
- [ ] Next phase unlocks (if applicable):
  - Lock icon animates away (fade + scale)
  - Card brightens (opacity 0.6 → 1)
  - Unlocking animation (scale 1 → 1.05 → 1 + glow)
  - Secondary toast: "שלב חדש נפתח: [שם השלב הבא]"

---

### 2. Achievement System Integration

**Given** phase completion is celebrated
**When** user completes a phase
**Then:**

- [ ] User achievement recorded in database (user_achievements table)
- [ ] Achievement badge notification (if achievements UI exists)
- [ ] Achievements awarded:
  - Core complete → 'journey_core_complete' (+10 points)
  - Recommended complete → 'journey_recommended_complete' (+25 points)
  - Interests complete → 'journey_interests_complete' (+25 points)
  - All 4 phases complete → 'journey_master' (+100 points)

**New Achievements SQL:**
```sql
INSERT INTO achievements (id, title, description, icon, category, points, requirement_type, requirement_value) VALUES
('journey_core_complete', 'מסע מתחיל', 'השלמת את כל מדריכי הליבה', 'IconBook', 'learning', 10, 'guides_completed', '{"phase":"core","percentage":100}'),
('journey_recommended_complete', 'מסע מומחה', 'השלמת את כל המדריכים המומלצים', 'IconStar', 'learning', 25, 'guides_completed', '{"phase":"recommended","percentage":100}'),
('journey_interests_complete', 'מסע מלומד', 'השלמת את כל מדריכי תחומי העניין', 'IconHeart', 'learning', 25, 'guides_completed', '{"phase":"interests","percentage":100}'),
('journey_master', 'אמן המסע', 'השלמת את כל 4 השלבים במסלול הלמידה', 'IconTrophy', 'learning', 100, 'guides_completed', '{"phase":"all","percentage":100}');
```

---

### 3. "Next Recommended Guide" Highlight

**Given** I have guides in progress
**When** viewing the journey page
**Then:**

- [ ] Within current phase, next recommended guide is highlighted
- [ ] Highlight styling:
  - Emerald border (border-2 border-emerald-500)
  - Subtle emerald background tint (bg-emerald-50 dark:bg-emerald-950/30)
  - "המלצה הבאה" badge (emerald, top-right corner)
  - Pulse animation on badge (animate-pulse)
- [ ] Guide card shows:
  - Title, description
  - Estimated reading time
  - Primary button: "התחל עכשיו" (Start Now)
  - Icon indicating it's next in sequence (IconArrowRight)
- [ ] Next guide logic:
  - First incomplete guide in current phase
  - If all complete in current phase, first guide in next unlocked phase

---

### 4. Integration with Guides Library

**Given** journey system is implemented
**When** I view the guides library page
**Then:**

- [ ] Each guide card shows "חלק מהמסלול שלך" badge if in user's journey
- [ ] Badge shows which phase it belongs to:
  - Core: Emerald badge with "ליבה"
  - Recommended: Purple badge with "מומלץ"
  - Interests: Blue badge with "עניין"
  - Optional: Orange badge with "אופציונלי"
- [ ] Badge appears in top-right corner of guide card
- [ ] Clicking badge navigates to journey page, scrolls to that phase

---

### 5. Integration with Guide Reader

**Given** I'm reading a guide that's part of my journey
**When** I complete the guide
**Then:**

- [ ] After completion, toast shows:
  - Title: "השלמת מדריך!"
  - Description: "עוד X מדריכים בשלב זה"
  - Action button: "חזור למסלול הלמידה" (navigate to /journey)
- [ ] If this was the last guide in a phase:
  - Confetti fires immediately
  - Phase completion celebration (as per AC1)
- [ ] Guide reader bottom navigation shows:
  - "Next in journey" button (navigate to next recommended guide)
  - Progress: "X/Y in [phase name]"

---

### 6. Integration with Progress Page

**Given** I visit the progress page
**When** viewing my overall progress
**Then:**

- [ ] Progress page includes journey section
- [ ] Section shows:
  - Current phase name and progress
  - Mini journey roadmap (4 phase icons with status)
  - Link: "צפה במסלול הלמידה שלך" (navigate to /journey)
- [ ] Progress breakdown shows journey phase completion:
  - מדריכי ליבה: X/Y הושלמו (progress bar)
  - מומלץ עבורך: X/Y הושלמו (progress bar)
  - תחומי העניין: X/Y הושלמו (progress bar)
  - חקור עוד: X/Y הושלמו (progress bar)

---

### 7. Dashboard Journey Card Enhancement

**Given** journey preview card exists on dashboard (from 0.10.1)
**When** I complete a phase
**Then:**

- [ ] Card updates immediately (optimistic UI)
- [ ] Confetti can optionally fire from dashboard card if user is on dashboard
- [ ] Card shows celebration message briefly
- [ ] Clicking card navigates to journey page

---

## 🔧 Technical Implementation

### Install canvas-confetti

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

---

### Confetti Celebration Function

**File:** `src/lib/celebrations.ts`

```typescript
import confetti from 'canvas-confetti';

const PHASE_COLORS = {
  core: ['#10b981', '#059669'],
  recommended: ['#a855f7', '#9333ea'],
  interests: ['#3b82f6', '#2563eb'],
  optional: ['#f97316', '#ea580c'],
};

export function celebratePhaseCompletion(
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  origin?: { x: number; y: number }
) {
  const colors = PHASE_COLORS[phaseId];

  confetti({
    particleCount: 150,
    spread: 70,
    origin: origin || { x: 0.5, y: 0.5 },
    colors: colors,
    ticks: 300,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle', 'square'],
    scalar: 1.2,
  });

  // Second burst for extra effect
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: origin || { x: 0.5, y: 0.5 },
      colors: colors,
      ticks: 200,
    });
  }, 250);
}
```

---

### Achievement Awarding Logic

**File:** `src/lib/achievements.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function awardPhaseAchievement(
  userId: string,
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  allPhasesComplete: boolean
) {
  const achievementMap = {
    core: 'journey_core_complete',
    recommended: 'journey_recommended_complete',
    interests: 'journey_interests_complete',
    optional: null, // Optional doesn't get its own achievement
  };

  const achievementId = achievementMap[phaseId];

  // Award phase achievement
  if (achievementId) {
    const { error } = await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: achievementId,
      earned_at: new Date().toISOString(),
    });

    if (!error) {
      toast.success('הישג חדש נפתח!', {
        description: `קיבלת את ההישג: ${getAchievementTitle(achievementId)}`,
      });
    }
  }

  // Award master achievement if all phases complete
  if (allPhasesComplete) {
    const { error } = await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: 'journey_master',
      earned_at: new Date().toISOString(),
    });

    if (!error) {
      toast.success('הישג נדיר! אמן המסע!', {
        description: 'השלמת את כל 4 השלבים במסלול הלמידה!',
        duration: 7000,
      });
    }
  }
}

function getAchievementTitle(achievementId: string): string {
  const titles = {
    journey_core_complete: 'מסע מתחיל',
    journey_recommended_complete: 'מסע מומחה',
    journey_interests_complete: 'מסע מלומד',
    journey_master: 'אמן המסע',
  };
  return titles[achievementId] || '';
}
```

---

### Phase Completion Handler

**File:** `src/lib/journey.ts` (add to existing file)

```typescript
export async function handlePhaseCompletion(
  userId: string,
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  allPhasesComplete: boolean
) {
  // 1. Celebrate with confetti
  celebratePhaseCompletion(phaseId);

  // 2. Show success toast
  const phaseNames = {
    core: 'מדריכי הליבה',
    recommended: 'המדריכים המומלצים',
    interests: 'תחומי העניין',
    optional: 'החקור עוד',
  };

  toast.success(`מזל טוב! השלמת את ${phaseNames[phaseId]}`, {
    description: 'השלב הבא נפתח - בוא נמשיך!',
    duration: 5000,
    action: {
      label: 'עבור למסלול',
      onClick: () => (window.location.href = '/journey'),
    },
  });

  // 3. Award achievement
  await awardPhaseAchievement(userId, phaseId, allPhasesComplete);

  // 4. Show next phase unlock toast (if applicable)
  if (!allPhasesComplete) {
    const nextPhaseNames = {
      core: 'מומלץ עבורך',
      recommended: 'תחומי העניין שלך',
      interests: 'חקור עוד',
    };

    if (nextPhaseNames[phaseId]) {
      setTimeout(() => {
        toast.info(`שלב חדש נפתח: ${nextPhaseNames[phaseId]}`, {
          description: 'מדריכים חדשים זמינים עבורך',
          duration: 4000,
        });
      }, 2000);
    }
  }
}
```

---

### Guide Reader Integration

**File:** `src/app/guides/guide-reader.tsx`

Add to guide completion handler:

```typescript
async function handleGuideCompletion() {
  // ... existing completion logic ...

  // Check if this guide is part of user's journey
  const journeyData = await getJourneyData(user.id, user.profile);
  const currentPhase = journeyData.phases.find((p) => p.isCurrent);

  if (currentPhase) {
    const guidesInPhase = currentPhase.guides;
    const completedInPhase = guidesInPhase.filter((g) =>
      progressMap.get(g.id)?.completed
    ).length;

    // Show journey progress toast
    toast.success('השלמת מדריך!', {
      description: `עוד ${guidesInPhase.length - completedInPhase} מדריכים בשלב זה`,
      action: {
        label: 'חזור למסלול הלמידה',
        onClick: () => navigate('/journey'),
      },
    });

    // Check if phase is now complete
    if (completedInPhase === guidesInPhase.length) {
      const allComplete = journeyData.phases.every((p) => p.isCompleted);
      await handlePhaseCompletion(user.id, currentPhase.id, allComplete);
    }
  }
}
```

---

### Next Recommended Guide Logic

**File:** `src/lib/journey.ts`

```typescript
export function getNextRecommendedGuide(
  phases: JourneyPhase[],
  progressMap: Map<string, any>
): GuideCatalogEntry | null {
  // Find current phase
  const currentPhase = phases.find((p) => p.isCurrent);
  if (!currentPhase) return null;

  // Find first incomplete guide in current phase
  const nextGuide = currentPhase.guides.find(
    (g) => !progressMap.get(g.id)?.completed
  );

  if (nextGuide) return nextGuide;

  // If current phase complete, find first guide in next unlocked phase
  const nextPhase = phases.find((p) => !p.isLocked && !p.isCompleted);
  if (!nextPhase) return null;

  return nextPhase.guides[0] || null;
}
```

---

## ✅ Definition of Done

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] canvas-confetti properly installed
- [ ] Achievement SQL migration created

### Functionality
- [ ] Confetti fires on phase completion
- [ ] Success toasts appear with correct messages
- [ ] Achievements awarded to database
- [ ] Next recommended guide highlighted correctly
- [ ] Guides library shows journey badges
- [ ] Guide reader shows journey context
- [ ] Progress page includes journey section
- [ ] Dashboard card updates on completion

### Testing
- [ ] Build succeeds
- [ ] Linter passes
- [ ] Manual test: Complete a phase, verify confetti
- [ ] Manual test: Check achievement in database
- [ ] Manual test: Verify journey badges in guides library
- [ ] Manual test: Complete guide, verify toast and navigation

### Integration
- [ ] Journey works with existing guide completion flow
- [ ] No breaking changes to existing features
- [ ] All pages integrate smoothly

---

## 📊 Success Metrics

After completing 0.10.3:
- [ ] Complete journey system live and functional
- [ ] Users feel celebrated when completing phases
- [ ] Journey context visible throughout app
- [ ] Achievements tracking journey progress
- [ ] Story 0.10 fully complete (all 3 sub-stories done)

---

## 📝 Notes

- **Final piece:** This completes the entire Story 0.10 journey feature
- **Test thoroughly:** Verify phase completion logic with multiple scenarios
- **Celebration timing:** Ensure confetti doesn't lag or block UI
- **Achievement migration:** Run SQL to add achievements before testing

---

## 🎉 Story 0.10 Complete!

After finishing Story 0.10.3, the entire learning journey system is complete:

✅ **0.10.1:** Core functionality and data layer
✅ **0.10.2:** Visual polish and animations
✅ **0.10.3:** Gamification and integration

**Result:** Users have a beautiful, motivating, gamified learning journey that guides them through BMAD mastery!

---

**Created by:** BMad Master (dividing Story 0.10)
**Date:** November 9, 2025
**Parent:** Story 0.10 - My Learning Journey
**Depends On:** Stories 0.10.1 and 0.10.2
**Estimated Effort:** 1 story point (1-2 days)

---

_This final sub-story adds the magic moments that make learning feel rewarding. Once complete, the journey is fully integrated and ready to delight users._

