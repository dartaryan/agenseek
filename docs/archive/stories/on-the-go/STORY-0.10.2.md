# Story 0.10.2: Journey Page Visual Polish & Animations

**Parent Story:** Story 0.10 - My Learning Journey (מסלול הלמידה שלי)
**Status:** ✅ COMPLETE
**Type:** On-the-Go Story (UX Enhancement)
**Priority:** P1 - Important
**Sprint:** TBD | **Points:** 2 (Small-Medium)
**Created:** November 9, 2025
**Completed:** November 9, 2025
**Dependencies:** Story 0.10.1 must be complete

---

## 🎯 Objective

Transform the functional journey page from Story 0.10.1 into a delightful, animated experience. Add smooth transitions, entrance animations, visual connecting lines, and polished micro-interactions that make the learning journey feel like a real adventure.

---

## 📖 User Story

**As a user viewing my learning journey,**
**I want smooth, delightful animations and visual feedback,**
**So that the experience feels polished, modern, and motivating.**

---

## ✅ Acceptance Criteria

### 1. Hero Section Animations

**Given** I navigate to `/journey`
**When** the page loads
**Then:**

- [ ] Hero section animates in with Framer Motion:
  - Fade in: opacity 0 → 1
  - Slide up: y: 20 → 0
  - Duration: 0.6s
  - Ease: ease-out
- [ ] Progress circle animates from 0% to actual % on mount:
  - SVG stroke-dasharray animation
  - Duration: 1.5s
  - Ease: ease-in-out
- [ ] Stats count up from 0 to actual values:
  - Smooth number animation
  - Duration: 1s
  - Stagger: 100ms between stats

---

### 2. Phase Card Entrance Animations

**Given** the journey page loads
**When** I scroll to the roadmap section
**Then:**

- [ ] Phase cards animate in with stagger:
  - Card 1 (Core): delay 0ms
  - Card 2 (Recommended): delay 100ms
  - Card 3 (Interests): delay 200ms
  - Card 4 (Optional): delay 300ms
- [ ] Each card entrance animation:
  - Fade in: opacity 0 → 1
  - Slide up: y: 30 → 0
  - Duration: 0.5s
  - Ease: ease-out
- [ ] Animation triggers when cards enter viewport (IntersectionObserver or Framer Motion viewport)

---

### 3. Phase Card Hover Effects

**Given** I hover over a phase card
**When** my cursor is over the card
**Then:**

- [ ] Card lifts: translateY(-4px)
- [ ] Shadow increases: shadow-lg → shadow-xl
- [ ] Transition: 0.2s ease-out
- [ ] Border glow appears (subtle phase-color glow)
- [ ] Returns smoothly on mouse leave

---

### 4. Progress Bar Animations

**Given** a progress bar is visible
**When** it enters viewport
**Then:**

- [ ] Bar animates from 0% width to actual percentage
- [ ] Duration: 1s
- [ ] Ease: ease-out
- [ ] Smooth fill animation (no jumps)
- [ ] Different phase colors animate correctly

---

### 5. Visual Connecting Line Between Phases

**Given** I'm viewing the journey roadmap
**When** I look at the phases
**Then:**

- [ ] Vertical connecting line runs between phase cards
- [ ] Line is SVG path (dashed, 4px, gray-300)
- [ ] Desktop: line runs down left side (RTL: right side) with phase cards offset
- [ ] Mobile: line runs down center between cards
- [ ] Line for completed phases: solid emerald color
- [ ] Line for current phase: animated pulse effect
- [ ] Line for locked phases: gray with lock icon midpoint
- [ ] Line draws progressively as user scrolls (stroke-dasharray animation)

**Technical:**
```typescript
// SVG path connecting phases
<svg className="absolute top-0 right-8 h-full w-1" style={{ zIndex: 0 }}>
  <line
    x1="0"
    y1="0"
    x2="0"
    y2="100%"
    stroke="currentColor"
    strokeWidth="4"
    strokeDasharray="8 8"
    className={cn(
      'transition-all duration-1000',
      isCompleted ? 'stroke-emerald-500' : 'stroke-gray-300 dark:stroke-gray-700'
    )}
  />
</svg>
```

---

### 6. Accordion Smooth Transitions

**Given** I click to expand a phase's guide list
**When** the accordion opens
**Then:**

- [ ] Height transition: smooth expansion
- [ ] Duration: 300ms
- [ ] Ease: ease-in-out
- [ ] Chevron icon rotates 180deg smoothly
- [ ] Guide items stagger fade-in:
  - Item 1: delay 0ms
  - Item 2: delay 50ms
  - Item 3: delay 100ms
  - (etc.)
- [ ] Collapsing is smooth reverse animation

---

### 7. Guide Item Micro-interactions

**Given** I hover over a guide item
**When** my cursor is over the guide
**Then:**

- [ ] Background color change: hover:bg-gray-50 dark:hover:bg-slate-800
- [ ] Transition: 0.15s ease
- [ ] Action button scales slightly: hover:scale-105
- [ ] Smooth transitions on all interactive elements

---

### 8. Reduced Motion Support

**Given** user has `prefers-reduced-motion` enabled
**When** viewing the journey page
**Then:**

- [ ] All animations disabled or greatly reduced
- [ ] Progress bars fill instantly (no animation)
- [ ] Cards appear immediately (no stagger or fade)
- [ ] Hover effects simplified (no transforms, only color)
- [ ] Connecting line static (no drawing animation)
- [ ] Respect system accessibility preferences

**Technical:**
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In Framer Motion:
initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
```

---

### 9. Phase Unlock Animation (Preparation)

**Given** a phase unlocks (triggered by guide completion)
**When** the unlock happens
**Then:**

- [ ] Lock icon animates away:
  - Fade out: opacity 1 → 0
  - Scale down: scale 1 → 0.5
  - Duration: 0.3s
- [ ] Card brightens: opacity 0.6 → 1
- [ ] Unlocking animation:
  - Scale: 1 → 1.05 → 1
  - Glow effect briefly appears
  - Duration: 0.6s
  - Ease: elastic-out

**Note:** This animation is prepared but may not be testable until guide completion is triggered. Full integration in Story 0.10.3.

---

### 10. Performance Optimization

**Given** animations are running
**When** monitoring performance
**Then:**

- [ ] Animations run at 60fps (smooth 16.67ms frame time)
- [ ] Only transform/opacity properties animated (GPU-accelerated)
- [ ] No layout thrashing (avoid width/height animations on large elements)
- [ ] Framer Motion animations use `layout` prop sparingly
- [ ] IntersectionObserver used for viewport-triggered animations (not scroll listeners)

---

## 🔧 Technical Implementation

### Install Framer Motion

```bash
npm install framer-motion
```

---

### Hero Section with Framer Motion

**File:** `src/app/journey/index.tsx`

```typescript
import { motion } from 'framer-motion';

function JourneyHero({ journeyData }: { journeyData: JourneyData }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-8 text-center"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-2">מסלול הלמידה שלי</h1>
      <p className="text-gray-600 dark:text-gray-400">
        נתיב למידה מותאם אישית לפי התפקיד והעניינים שלך
      </p>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Animated progress circle */}
        <CircularProgress
          percentage={journeyData.overallProgress}
          animate={!prefersReducedMotion}
        />

        {/* Animated stats */}
        <div className="flex flex-col gap-2">
          <AnimatedStat
            label="מדריכים שהושלמו"
            value={journeyData.completedGuides}
            total={journeyData.totalGuides}
          />
          <AnimatedStat
            label="זמן קריאה משוער"
            value={Math.round(journeyData.estimatedTimeRemaining / 60)}
            suffix="שעות"
          />
          <AnimatedStat
            label="התקדמות שבועית"
            value={journeyData.weeklyProgress}
            suffix="%"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Animated stat component with count-up
function AnimatedStat({ label, value, total, suffix }: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1000; // 1 second
    const increment = value / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, prefersReducedMotion]);

  return (
    <div className="text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}: </span>
      <span className="font-bold text-lg">
        {displayValue}
        {total && `/${total}`}
        {suffix && ` ${suffix}`}
      </span>
    </div>
  );
}
```

---

### Phase Card Stagger Animation

**File:** `src/components/journey/PhaseCard.tsx`

```typescript
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.1, // 100ms stagger
      ease: 'easeOut',
    },
  }),
};

export function PhaseCard({ phase, index }: PhaseCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      custom={index}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? false : 'visible'}
      viewport={{ once: true, margin: '-100px' }}
      variants={cardVariants}
      whileHover={
        prefersReducedMotion
          ? {}
          : { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
      }
      className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
    >
      {/* Phase card content */}
    </motion.div>
  );
}
```

---

### Animated Progress Bar

**File:** `src/components/journey/ProgressBar.tsx`

```typescript
import { motion } from 'framer-motion';

export function ProgressBar({ percentage, color }: ProgressBarProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={prefersReducedMotion ? { width: `${percentage}%` } : { width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: prefersReducedMotion ? 0 : 1, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}
```

---

### Connecting Line SVG

**File:** `src/components/journey/ConnectingLine.tsx`

```typescript
export function ConnectingLine({ phases }: { phases: JourneyPhase[] }) {
  return (
    <svg
      className="absolute top-0 right-8 md:right-12 h-full w-1 -z-10"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
    >
      {phases.map((phase, index) => {
        if (index === phases.length - 1) return null; // No line after last phase

        const isCompleted = phase.isCompleted;
        const isCurrent = phase.isCurrent;

        return (
          <line
            key={phase.id}
            x1="50%"
            y1={`${(index / phases.length) * 100}%`}
            x2="50%"
            y2={`${((index + 1) / phases.length) * 100}%`}
            stroke={isCompleted ? '#10b981' : '#d1d5db'}
            strokeWidth="4"
            strokeDasharray={isCompleted ? '0' : '8 8'}
            className={cn(
              'transition-all duration-500',
              isCurrent && 'animate-pulse'
            )}
          />
        );
      })}
    </svg>
  );
}
```

---

### Accordion Animation

**File:** `src/components/journey/GuideAccordion.tsx`

```typescript
import { motion, AnimatePresence } from 'framer-motion';

export function GuideAccordion({ guides, isOpen, onToggle }: AccordionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="font-semibold">מדריכים ({guides.length})</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <IconChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? false : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-4">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={prefersReducedMotion ? false : { opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GuideItem guide={guide} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### Reduced Motion Hook

**File:** `src/hooks/usePrefersReducedMotion.ts`

```typescript
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

---

## ✅ Definition of Done

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Framer Motion properly installed
- [ ] All animations use GPU-accelerated properties (transform, opacity)

### Functionality
- [ ] Hero section animates in smoothly
- [ ] Phase cards stagger entrance animation
- [ ] Progress bars animate from 0 to actual %
- [ ] Connecting line displays correctly
- [ ] Accordion expands/collapses smoothly
- [ ] Hover effects work on desktop
- [ ] All animations respect `prefers-reduced-motion`

### Performance
- [ ] Animations run at 60fps
- [ ] No layout shift during animations
- [ ] No jank or stuttering
- [ ] Page loads quickly despite animations

### Testing
- [ ] Build succeeds
- [ ] Linter passes
- [ ] Manual testing on desktop (animations smooth)
- [ ] Manual testing on mobile (animations smooth)
- [ ] Testing with reduced motion enabled (animations disabled)

### Visual Quality
- [ ] Animations feel polished and professional
- [ ] Timings feel natural (not too fast or slow)
- [ ] Stagger delays create pleasant rhythm
- [ ] Hover effects subtle but noticeable

---

## 📊 Success Metrics

After completing 0.10.2:
- [ ] Journey page feels delightful and polished
- [ ] Animations add to UX without hindering performance
- [ ] 60fps maintained on mid-range devices
- [ ] Reduced motion users have good experience
- [ ] Ready for gamification (0.10.3)

---

## 📝 Notes

- **Build on 0.10.1:** All functionality from 0.10.1 must remain working
- **Don't break data logic:** Focus on visual layer only
- **Test performance:** Use Chrome DevTools Performance tab
- **Accessibility first:** Reduced motion is not optional
- **Subtle over flashy:** Professional, not distracting

---

**Created by:** BMad Master (dividing Story 0.10)
**Date:** November 9, 2025
**Parent:** Story 0.10 - My Learning Journey
**Depends On:** Story 0.10.1 (Core & Data Layer)
**Estimated Effort:** 2 story points (2-3 days)

---

_This sub-story transforms the functional journey into a delightful experience. Once complete, the journey page will look and feel professional, modern, and motivating._

