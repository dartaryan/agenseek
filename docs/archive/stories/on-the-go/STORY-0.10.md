# Story 0.10: מסלול הלמידה שלי (My Learning Journey)

**Status:** 📋 Ready for Implementation
**Type:** On-the-Go Story (User Experience Enhancement)
**Priority:** P1 - Important
**Sprint:** TBD | **Points:** 5 (Medium-Large)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Issue:**

After completing onboarding, users see their personalized guide recommendations but lack clear guidance on:
- **What to learn next** and in what order
- **Why** certain guides are prioritized for their journey
- **How far** they've progressed in their overall learning path
- **What unlocks next** after completing current guides

**User Pain Point:**

> "אחרי שעשיתי אונבורדינג, זה לא מספיק ברור איזה מדריכים אני צריך לעקוב אחריהם ולפי איזה סדר"
>
> _"After onboarding, it's not clear enough which guides I should follow and in what order"_

**Impact:**
- Users feel overwhelmed by 42 guides without clear direction
- Reduced engagement after onboarding
- Unclear progression through learning material
- No gamified sense of "journey" or "path"

---

## 📖 User Story

**As a user who completed onboarding,**
**I want to see a visual learning journey roadmap,**
**So that I know exactly which guides to read next, why they matter for my role, and how I'm progressing through my personalized path.**

---

## ✅ Acceptance Criteria

### 1. Dashboard Journey Card

**Given** I'm on the dashboard
**When** I view the page
**Then:**

- [ ] New prominent card appears: **"מסלול הלמידה שלי"** (My Learning Journey)
- [ ] Card shows current phase name and progress (e.g., "מדריכי ליבה - 2/2 הושלמו")
- [ ] Card displays mini visual roadmap with 4 phases
- [ ] Current phase is highlighted with emerald color
- [ ] Completed phases show checkmarks
- [ ] Locked phases show lock icons
- [ ] Overall journey progress percentage displayed (e.g., "התקדמות כוללת: 35%")
- [ ] Primary button: "המשך במסלול" (Continue Journey) → navigates to `/journey`
- [ ] Card uses consistent design system (rounded-xl, shadow, hover effects)

**Visual Example:**
```
┌─────────────────────────────────────────┐
│ מסלול הלמידה שלי                        │
│                                         │
│ אתה בשלב: מומלץ עבורך                   │
│ התקדמות: 3/7 מדריכים                    │
│                                         │
│ [✓] ליבה  [●] מומלץ  [🔒] עניין  [🔒] חקור │
│                                         │
│ התקדמות כוללת: 35% ██████░░░░░░░        │
│                                         │
│          [המשך במסלול →]                 │
└─────────────────────────────────────────┘
```

---

### 2. Journey Page (`/journey`) - Hero Section

**Given** I navigate to `/journey`
**When** the page loads
**Then:**

- [ ] Page title: **"מסלול הלמידה שלי"**
- [ ] Subtitle explains: "נתיב למידה מותאם אישית לפי התפקיד והעניינים שלך"
- [ ] Hero section shows:
  - Large circular progress indicator (120px) with overall completion %
  - Stats breakdown:
    - מדריכים שהושלמו: X/Y
    - זמן קריאה משוער: ~XX שעות
    - התקדמות שבועית: +X%
- [ ] Hero section animates in with Framer Motion (fade + slide)
- [ ] Responsive: stacks vertically on mobile

---

### 3. Journey Page - Visual Roadmap (4 Phases)

**Given** I'm viewing the journey page
**When** I scroll to the roadmap section
**Then:**

**Phase Structure:**
Each phase displays as a large card section with:

#### **Phase 1: מדריכי ליבה (Core Guides)**
- [ ] Gradient header: Emerald (bg-gradient-to-br from-emerald-500 to-emerald-600)
- [ ] Icon: IconBook (Tabler)
- [ ] Title: "מדריכי ליבה"
- [ ] Description: "יסודות חיוניים להתחלת עבודה עם BMAD - כל משתמש צריך לקרוא"
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, emerald fill)
- [ ] Status badge:
  - Completed: "הושלם! ✓" (green)
  - In Progress: "בתהליך" (blue)
  - Locked: "🔒 ננעל - השלם את הליבה תחילה" (gray)
- [ ] Estimated time: "זמן משוער: ~45 דקות"
- [ ] List of guides in this phase (expandable accordion):
  - Each guide shows: title, description, progress %, action button
  - Completed guides: checkmark + "קרא שוב" button
  - Current guide: highlighted with emerald border + "המשך" button
  - Upcoming guides: "התחל" button
  - Locked guides: grayed out + lock icon

#### **Phase 2: מומלץ עבורך (Recommended for Your Role)**
- [ ] Gradient header: Purple (bg-gradient-to-br from-purple-500 to-purple-600)
- [ ] Icon: IconStar (Tabler)
- [ ] Title: "מומלץ עבורך"
- [ ] Description: Dynamic based on role:
  - Developer: "מדריכים מותאמים למפתחים - תהליכי עבודה, agents, workflows"
  - PM: "מדריכים למנהלי מוצר - תכנון, אסטרטגיה, ניהול"
  - (etc. for each role)
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, purple fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת מדריכי הליבה"
- [ ] Status badge (same as Phase 1)
- [ ] Expandable guide list (same structure as Phase 1)

#### **Phase 3: תחומי העניין שלך (Your Interests)**
- [ ] Gradient header: Blue (bg-gradient-to-br from-blue-500 to-blue-600)
- [ ] Icon: IconHeart (Tabler)
- [ ] Title: "תחומי העניין שלך"
- [ ] Description: Dynamic based on interests:
  - Shows selected interests from onboarding
  - Example: "התמקד בנושאים: Agents, Workflows, Architecture"
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, blue fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת 50% מהמומלצים"
- [ ] Status badge (same as Phase 1)
- [ ] Expandable guide list

#### **Phase 4: חקור עוד (Explore More - Optional)**
- [ ] Gradient header: Orange (bg-gradient-to-br from-orange-500 to-orange-600)
- [ ] Icon: IconDots (Tabler)
- [ ] Title: "חקור עוד"
- [ ] Description: "מדריכים נוספים להעמקה - חקור לפי העניין שלך"
- [ ] Progress indicator: X/Y מדריכים הושלמו
- [ ] Progress bar (horizontal, orange fill)
- [ ] Unlocking condition: "יפתח לאחר השלמת המומלצים ותחומי העניין"
- [ ] Status badge (same as Phase 1)
- [ ] Note: "מדריכים אלו אופציונליים - אין חובה להשלים הכל"
- [ ] Expandable guide list

---

### 4. Visual Path Connection

**Given** phases are displayed
**When** I view the roadmap
**Then:**

- [ ] Vertical connecting line between phases (dashed line, 4px, gray)
- [ ] Completed phases: line is solid emerald
- [ ] Current phase: animated pulse on line
- [ ] Locked phases: line is gray with lock midpoint
- [ ] Mobile: line runs down center between phase cards
- [ ] Desktop: line runs down left side (RTL: right side) with phase cards offset

---

### 5. "Next Recommended Guide" Highlight

**Given** I have guides in progress
**When** viewing the journey
**Then:**

- [ ] Within current phase, next recommended guide is highlighted
- [ ] Highlight styling:
  - Emerald border (border-2 border-emerald-500)
  - Subtle emerald background tint (bg-emerald-50)
  - "המלצה הבאה" badge (emerald, top-right)
  - Pulse animation on badge
- [ ] Guide card shows:
  - Title, description
  - Estimated reading time
  - Primary button: "התחל עכשיו" (Start Now)
  - Icon indicating it's next in sequence (IconArrowRight)

---

### 6. Phase Completion Celebration

**Given** I complete all guides in a phase
**When** the last guide is marked complete
**Then:**

- [ ] Confetti animation fires (canvas-confetti)
- [ ] Particle count: 150
- [ ] Colors: phase-specific gradient colors
- [ ] Origin: center of completed phase card
- [ ] Success toast appears:
  - Title: "מזל טוב! השלמת את [שם השלב]"
  - Description: "השלב הבא נפתח - בוא נמשיך!"
- [ ] Phase card updates:
  - Status badge changes to "הושלם! ✓"
  - Progress bar fills to 100%
  - Card gets subtle green tint
  - Checkmark animation
- [ ] Next phase unlocks:
  - Lock icon animates away
  - Card brightens (no longer grayed)
  - Unlocking animation (scale + glow)
  - Secondary toast: "שלב חדש נפתח: [שם השלב הבא]"
- [ ] User achievement recorded in database (user_achievements)

---

### 7. Mobile Responsive Design

**Given** I'm on mobile (<640px)
**When** viewing the journey page
**Then:**

- [ ] Hero stats stack vertically
- [ ] Phase cards full width (w-full)
- [ ] Phase cards stack vertically with connecting line down center
- [ ] Guide lists within phases stack vertically
- [ ] Accordion auto-closes previous when opening new (mobile space optimization)
- [ ] Touch-friendly tap targets (min 44x44px)
- [ ] Swipeable guide carousel within each phase (optional enhancement)

---

### 8. Journey State Persistence

**Given** I navigate away from journey page
**When** I return later
**Then:**

- [ ] Journey state restored from database (user_progress)
- [ ] Current phase remembered
- [ ] Scroll position restored to current phase
- [ ] Expanded/collapsed accordion states remembered (localStorage)
- [ ] No re-calculation needed (data cached)

---

### 9. Integration with Existing Features

**Given** journey system is implemented
**When** I interact with other features
**Then:**

**From Dashboard:**
- [ ] Journey card shows real-time progress
- [ ] Clicking "המשך במסלול" navigates to journey page
- [ ] Clicking specific guide opens guide reader

**From Guides Library:**
- [ ] Each guide card shows "חלק מהמסלול שלך" badge if in user's journey
- [ ] Badge shows which phase it belongs to (Core/Recommended/Interests/Optional)

**From Guide Reader:**
- [ ] After completing guide, toast shows:
  - "השלמת מדריך! עוד X מדריכים בשלב זה"
  - Link: "חזור למסלול הלמידה"
- [ ] Next guide in phase highlighted in ToC or bottom nav

**From Progress Page:**
- [ ] Link to journey page: "צפה במסלול הלמידה שלך"
- [ ] Progress breakdown shows journey phase completion

---

### 10. Animations & Micro-interactions

**Given** user interacts with journey elements
**When** animations trigger
**Then:**

**Phase Cards:**
- [ ] Entrance: Stagger fade-in (delay: 100ms per card)
- [ ] Hover: Lift (-4px) + shadow glow
- [ ] Unlock: Scale (1 → 1.05 → 1) + brightness increase

**Connecting Line:**
- [ ] Draws progressively as phases unlock (animated stroke-dasharray)
- [ ] Pulse effect on current phase segment

**Progress Bars:**
- [ ] Animate from 0 → actual % on mount (duration: 1s, ease-out)
- [ ] Update smoothly when progress changes (transition: 0.5s)

**Guide Expansion:**
- [ ] Accordion: Smooth height transition (duration: 300ms)
- [ ] Guide items: Stagger fade-in when expanding (delay: 50ms per item)

**Completion:**
- [ ] Checkmark: Draw animation (SVG path animation)
- [ ] Badge: Pop-in (scale 0 → 1.1 → 1)

**All animations:**
- [ ] Respect `prefers-reduced-motion` (disable if user preference set)
- [ ] Smooth 60fps performance (use transform/opacity only)

---

## 🎨 UI/UX Specifications

### Color Palette (Phase-Specific)

```typescript
const PHASE_COLORS = {
  core: {
    gradient: 'from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-700',
    progress: 'bg-emerald-500',
  },
  recommended: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    border: 'border-purple-500',
    text: 'text-purple-700',
    progress: 'bg-purple-500',
  },
  interests: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700',
    progress: 'bg-blue-500',
  },
  optional: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    border: 'border-orange-500',
    text: 'text-orange-700',
    progress: 'bg-orange-500',
  },
};
```

### Typography

- **Page Title**: text-3xl md:text-4xl font-bold
- **Phase Title**: text-2xl font-bold
- **Phase Description**: text-sm text-gray-600
- **Guide Title**: text-lg font-semibold
- **Stats**: text-xl md:text-2xl font-bold

### Spacing

- Phase cards: mb-6 (24px between cards)
- Card padding: p-6 (24px internal padding)
- Guide list items: gap-3 (12px between guides)
- Hero section: mb-8 (32px bottom margin)

### Icons (Tabler)

- Phase 1 (Core): `IconBook`
- Phase 2 (Recommended): `IconStar`
- Phase 3 (Interests): `IconHeart`
- Phase 4 (Optional): `IconDots`
- Next guide: `IconArrowRight`
- Completed: `IconCheck`
- Locked: `IconLock`
- Time: `IconClock`

---

## 🔧 Technical Implementation

### New Route

**File:** `src/app/routes.tsx`

```typescript
// Add to protected routes
{
  path: '/journey',
  element: <JourneyPage />,
  requiresAuth: true,
}
```

### New Page Component

**File:** `src/app/journey/index.tsx`

Component structure:
```
JourneyPage
├── JourneyHero (overall progress)
├── JourneyRoadmap (4 phases)
│   ├── PhaseCard (x4)
│   │   ├── PhaseHeader (icon, title, description)
│   │   ├── PhaseProgress (bar + stats)
│   │   ├── PhaseStatus (badge)
│   │   └── PhaseGuides (accordion with guide list)
│   │       └── GuideItem (x N)
│   │           ├── GuideInfo
│   │           ├── GuideProgress
│   │           └── GuideAction (button)
│   └── ConnectingLine (SVG path between phases)
└── JourneyCTA (motivational message + action)
```

### New Dashboard Widget

**File:** `src/components/dashboard/JourneyPreviewCard.tsx`

Shows mini journey state on dashboard

### Data Structure

**No new tables needed** - uses existing data:

```typescript
interface JourneyData {
  phases: JourneyPhase[];
  overallProgress: number;
  currentPhaseIndex: number;
  totalGuides: number;
  completedGuides: number;
  estimatedTimeRemaining: number; // minutes
}

interface JourneyPhase {
  id: 'core' | 'recommended' | 'interests' | 'optional';
  title: string;
  description: string;
  icon: TablerIcon;
  guides: GuideCatalogEntry[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  unlockCondition?: string; // for locked phases
  estimatedMinutes: number;
}
```

### Data Fetching Logic

**File:** `src/lib/journey.ts`

```typescript
export async function getJourneyData(
  userId: string,
  profile: UserProfile
): Promise<JourneyData> {
  // 1. Get categorized guides (existing function)
  const catalog = getGuideCatalog();
  const categorized = categorizeGuidesByLearningPath(catalog, {
    role: profile.role,
    interests: profile.interests,
    experience_level: profile.experience_level,
  });

  // 2. Fetch user progress
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  const progressMap = new Map(
    progressData?.map((p) => [p.guide_slug, p]) || []
  );

  // 3. Calculate phase progress
  const phases: JourneyPhase[] = [
    {
      id: 'core',
      title: 'מדריכי ליבה',
      description: 'יסודות חיוניים להתחלת עבודה עם BMAD',
      icon: IconBook,
      guides: categorized.core,
      progress: calculatePhaseProgress(categorized.core, progressMap),
      isLocked: false,
      isCompleted: isPhaseCompleted(categorized.core, progressMap),
      isCurrent: getCurrentPhase(categorized, progressMap) === 'core',
      estimatedMinutes: sumEstimatedTime(categorized.core),
    },
    {
      id: 'recommended',
      title: 'מומלץ עבורך',
      description: getRoleBasedDescription(profile.role),
      icon: IconStar,
      guides: categorized.recommended,
      progress: calculatePhaseProgress(categorized.recommended, progressMap),
      isLocked: !isPhaseCompleted(categorized.core, progressMap),
      isCompleted: isPhaseCompleted(categorized.recommended, progressMap),
      isCurrent: getCurrentPhase(categorized, progressMap) === 'recommended',
      unlockCondition: 'השלם את מדריכי הליבה כדי לפתוח',
      estimatedMinutes: sumEstimatedTime(categorized.recommended),
    },
    // ... similar for interests and optional
  ];

  // 4. Calculate overall progress
  const totalGuides = [
    ...categorized.core,
    ...categorized.recommended,
    ...categorized.interests,
    ...categorized.optional,
  ].length;

  const completedGuides = Array.from(progressMap.values()).filter(
    (p) => p.completed
  ).length;

  const overallProgress = Math.round(
    (completedGuides / totalGuides) * 100
  );

  return {
    phases,
    overallProgress,
    currentPhaseIndex: phases.findIndex((p) => p.isCurrent),
    totalGuides,
    completedGuides,
    estimatedTimeRemaining: calculateRemainingTime(phases, progressMap),
  };
}

// Helper functions
function calculatePhaseProgress(
  guides: GuideCatalogEntry[],
  progressMap: Map<string, any>
) {
  const completed = guides.filter((g) => progressMap.get(g.id)?.completed).length;
  const total = guides.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

function isPhaseCompleted(
  guides: GuideCatalogEntry[],
  progressMap: Map<string, any>
): boolean {
  return guides.every((g) => progressMap.get(g.id)?.completed);
}

function getCurrentPhase(
  categorized: CategorizedGuides,
  progressMap: Map<string, any>
): 'core' | 'recommended' | 'interests' | 'optional' {
  // Logic to determine current phase based on completion status
  if (!isPhaseCompleted(categorized.core, progressMap)) return 'core';
  if (!isPhaseCompleted(categorized.recommended, progressMap)) return 'recommended';
  if (!isPhaseCompleted(categorized.interests, progressMap)) return 'interests';
  return 'optional';
}

function getRoleBasedDescription(role?: string): string {
  const descriptions: Record<string, string> = {
    developer: 'מדריכים מותאמים למפתחים - תהליכי עבודה, agents, workflows',
    'product-manager': 'מדריכים למנהלי מוצר - תכנון, אסטרטגיה, ניהול',
    designer: 'מדריכים למעצבים - UX, עיצוב, חדשנות',
    // ... add for all roles
  };
  return descriptions[role?.toLowerCase() || ''] || 'מדריכים מומלצים לפי התפקיד שלך';
}

function sumEstimatedTime(guides: GuideCatalogEntry[]): number {
  return guides.reduce((sum, g) => sum + g.estimatedMinutes, 0);
}

function calculateRemainingTime(
  phases: JourneyPhase[],
  progressMap: Map<string, any>
): number {
  let totalMinutes = 0;

  phases.forEach((phase) => {
    phase.guides.forEach((guide) => {
      const progress = progressMap.get(guide.id);
      if (!progress?.completed) {
        totalMinutes += guide.estimatedMinutes;
      }
    });
  });

  return totalMinutes;
}
```

### Phase Unlocking Logic

Phases unlock sequentially based on completion:

1. **Core** - Always unlocked
2. **Recommended** - Unlocks when Core is 100% complete
3. **Interests** - Unlocks when Recommended is 50% complete OR Core + Recommended both complete
4. **Optional** - Unlocks when Interests is 50% complete OR all previous phases complete

```typescript
function calculatePhaseUnlockStatus(
  phases: JourneyPhase[]
): JourneyPhase[] {
  const [core, recommended, interests, optional] = phases;

  // Core always unlocked
  core.isLocked = false;

  // Recommended unlocks when core complete
  recommended.isLocked = !core.isCompleted;

  // Interests unlocks when recommended 50% or both core + recommended done
  interests.isLocked = !(
    recommended.progress.percentage >= 50 ||
    (core.isCompleted && recommended.isCompleted)
  );

  // Optional unlocks when interests 50% or all previous done
  optional.isLocked = !(
    interests.progress.percentage >= 50 ||
    (core.isCompleted && recommended.isCompleted && interests.isCompleted)
  );

  return phases;
}
```

### Achievement Integration

**New Achievements to Create:**

```sql
INSERT INTO achievements (id, title, description, icon, category, points, requirement_type, requirement_value) VALUES
('journey_core_complete', 'מסע מתחיל', 'השלמת את כל מדריכי הליבה', 'IconBook', 'learning', 10, 'guides_completed', '{"phase":"core","percentage":100}'),
('journey_recommended_complete', 'מסע מומחה', 'השלמת את כל המדריכים המומלצים', 'IconStar', 'learning', 25, 'guides_completed', '{"phase":"recommended","percentage":100}'),
('journey_interests_complete', 'מסע מלומד', 'השלמת את כל מדריכי תחומי העניין', 'IconHeart', 'learning', 25, 'guides_completed', '{"phase":"interests","percentage":100}'),
('journey_master', 'אמן המסע', 'השלמת את כל 4 השלבים במסלול הלמידה', 'IconTrophy', 'learning', 100, 'guides_completed', '{"phase":"all","percentage":100}');
```

When phase is completed, award achievement:

```typescript
async function handlePhaseCompletion(
  userId: string,
  phaseId: string
) {
  const achievementMap = {
    core: 'journey_core_complete',
    recommended: 'journey_recommended_complete',
    interests: 'journey_interests_complete',
    optional: 'journey_master', // only if all phases done
  };

  const achievementId = achievementMap[phaseId];
  if (!achievementId) return;

  // Award achievement
  await supabase.from('user_achievements').insert({
    user_id: userId,
    achievement_id: achievementId,
    earned_at: new Date().toISOString(),
  });
}
```

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] `getJourneyData()` returns correct structure
- [ ] `calculatePhaseProgress()` calculates correctly
- [ ] `isPhaseCompleted()` handles edge cases
- [ ] `getCurrentPhase()` returns correct phase
- [ ] Phase unlock logic works correctly
- [ ] Achievement awarding logic works

### Integration Tests

- [ ] Journey page loads with real user data
- [ ] Dashboard journey card shows correct progress
- [ ] Phase expansion/collapse works
- [ ] Navigation between journey and guides works
- [ ] Completing guide updates journey state
- [ ] Phase unlocking triggers correctly

### E2E Tests

**Scenario 1: New User Journey**
- [ ] User completes onboarding
- [ ] Dashboard shows journey card with 0% progress
- [ ] Navigate to journey page
- [ ] All phases except Core are locked
- [ ] Start first Core guide
- [ ] Complete all Core guides
- [ ] Confetti fires, Recommended phase unlocks
- [ ] Achievement notification appears

**Scenario 2: Returning User**
- [ ] User has partial progress (50% Recommended)
- [ ] Journey page shows correct current phase
- [ ] Correct guides are marked complete
- [ ] Next recommended guide is highlighted
- [ ] Scroll position restored to current phase

**Scenario 3: Mobile Experience**
- [ ] Journey page renders correctly on mobile
- [ ] Cards stack vertically
- [ ] Accordion works smoothly
- [ ] Touch targets are adequate (44x44px)
- [ ] Animations are smooth

### Visual Regression Tests

- [ ] Journey page matches design specs
- [ ] Phase colors match defined palette
- [ ] Icons are correct size and alignment
- [ ] Progress bars fill correctly
- [ ] Hover states work
- [ ] Dark mode renders correctly

### Performance Tests

- [ ] Journey page loads in <1.5s
- [ ] Animations run at 60fps
- [ ] No layout shift during phase expansion
- [ ] Image/icon lazy loading works
- [ ] Works well with 100+ guides in catalog

### Accessibility Tests

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces phase status
- [ ] Color contrast meets WCAG AA
- [ ] `prefers-reduced-motion` respected
- [ ] Semantic HTML structure correct

---

## ✅ Definition of Done

Before marking story complete, verify:

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed and approved
- [ ] All components use existing design system
- [ ] Follows established patterns in codebase

### Functionality
- [ ] All acceptance criteria met
- [ ] Journey page fully functional
- [ ] Dashboard integration working
- [ ] Phase unlocking logic correct
- [ ] Achievements awarded properly
- [ ] Animations smooth and performant

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] E2E tests passing (at least Scenario 1)
- [ ] Manual testing completed
- [ ] Mobile testing completed
- [ ] Accessibility audit passed

### Documentation
- [ ] Component documentation added
- [ ] Journey logic documented in code comments
- [ ] README updated with new route
- [ ] User-facing help text clear
- [ ] Hebrew translations verified

### Visual & UX
- [ ] Matches design specifications
- [ ] Animations feel delightful
- [ ] Responsive design works on all breakpoints
- [ ] Dark mode works correctly
- [ ] RTL layout correct
- [ ] Icons consistent with app style (Tabler Icons, no emojis)

### Performance
- [ ] Page load time acceptable (<2s)
- [ ] No jank during animations
- [ ] Bundle size impact acceptable
- [ ] Database queries optimized
- [ ] Caching implemented where needed

---

## 📊 Success Metrics

After launch, track:

**Engagement:**
- % of users who visit journey page (target: >60% within first week)
- Average time spent on journey page (target: >2 min)
- % of users who click "המשך במסלול" from dashboard (target: >40%)

**Learning Progress:**
- Average guides completed per week (expect increase of 15-20%)
- % of users who complete full Core phase (target: >80%)
- % of users who reach Recommended phase (target: >60%)

**Retention:**
- 7-day retention rate (expect increase of 10-15%)
- Return visit rate (expect increase of 20-25%)
- Average session length (expect increase of 15-20%)

---

## 🚀 Implementation Plan

### Phase 1: Core Structure (2-3 days)
1. Create journey route and page structure
2. Implement `getJourneyData()` function
3. Build basic phase card components
4. Add dashboard journey preview card
5. Test data fetching and display

### Phase 2: Visual Polish (1-2 days)
1. Add phase gradients and colors
2. Implement connecting line SVG
3. Add Framer Motion animations
4. Implement progress bars and stats
5. Add icons and badges

### Phase 3: Interactivity (1-2 days)
1. Implement accordion expand/collapse
2. Add guide action buttons
3. Implement phase unlocking logic
4. Add next guide highlighting
5. Test all interactions

### Phase 4: Celebrations & Gamification (1 day)
1. Add confetti on phase completion
2. Implement achievement awarding
3. Add celebration toasts
4. Test unlock animations
5. Polish micro-interactions

### Phase 5: Testing & Polish (1 day)
1. Write unit tests
2. Manual testing on all devices
3. Accessibility audit
4. Performance optimization
5. Bug fixes and polish

**Total Estimated Time:** 6-9 days (depending on team velocity)

---

## 🎉 Expected Impact

**User Experience:**
- ✨ Crystal clear learning direction
- 🎮 Gamified, motivating progression
- 🎯 Reduced overwhelm from 42 guides
- 💪 Increased confidence in learning path
- 📈 Higher engagement and completion rates

**Business Value:**
- 📊 Better learning analytics
- 🎓 Faster time to BMAD proficiency
- 🔁 Improved user retention
- 💬 More "office talk" moments (shareable progress)
- 🏆 Foundation for future learning features

**Technical Benefits:**
- 🔧 Reuses existing categorization logic
- 💾 No database schema changes needed
- 🎨 Consistent with design system
- ♿ Accessible by design
- 📱 Mobile-first implementation

---

## 📝 Notes & Considerations

### Future Enhancements (Out of Scope for 0.10)

- [ ] **Custom Learning Paths:** Allow users to create custom journey sequences
- [ ] **Social Sharing:** Share journey progress on internal social channels
- [ ] **Journey Analytics Dashboard:** Admin view of company-wide journey progress
- [ ] **Recommended Next Steps:** AI-powered suggestions beyond the 4 phases
- [ ] **Journey Reminders:** Email/push notifications for abandoned journeys
- [ ] **Team Journeys:** See colleagues' progress, create team challenges
- [ ] **Journey Replays:** Ability to restart journey from beginning
- [ ] **Alternative Paths:** Multiple journey options per role

### Open Questions

1. **Should Optional phase be mandatory for badges?**
   - Recommendation: No - make it truly optional
   - Only award "Journey Master" if user chooses to complete it

2. **How to handle users who skip onboarding?**
   - Show generic journey with all guides equally weighted
   - Prompt to complete preferences for personalized journey

3. **Should journey be linear or flexible?**
   - v1: Linear (must unlock sequentially)
   - Future: Add "flexible mode" where all phases unlocked but still show recommended order

4. **Track "journey completion" separate from "guides completion"?**
   - Yes - journey completion = Core + Recommended + Interests (Optional excluded)
   - Separate metric: "Explorer" = completed all 4 phases

---

## 🔗 Related Stories & Dependencies

### Depends On (Must be complete first):
- ✅ Story 2.9 - Onboarding Learning Path Step
- ✅ Story 5.2 - Learning Path Categorization
- ✅ Story 5.8 - Progress Details Page
- ✅ All Core Dashboard Features (Story 5.x series)

### Blocks (Blocked until this complete):
- Story 11.x - Advanced Gamification Features
- Story 12.x - Social Learning Features
- Story 13.x - Learning Analytics Dashboard (Admin)

### Related Epics:
- Epic 5: Progress & Gamification
- Epic 11: Advanced Learning Features (Future)

---

**Created by:** Ben
**Date:** November 9, 2025
**Last Updated:** November 9, 2025
**Story Type:** On-the-Go Enhancement (0.X series)
**Estimated Effort:** 5 story points (6-9 days)

---

_This story document is ready for implementation. All specifications, acceptance criteria, and technical details are defined. Let's build something that makes learning BMAD feel like an adventure! 🚀_

