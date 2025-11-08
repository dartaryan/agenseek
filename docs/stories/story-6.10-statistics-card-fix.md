# Story 6.10: Fix Statistics Card Text Overflow

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 2
**Priority:** P0
**Status:** PENDING
**Dependencies:** Story 6.9 (Layout Optimization)

---

## User Story

**As a** user viewing statistics cards on the dashboard,
**I want** text to stay within card boundaries and display properly,
**So that** the statistics are readable and the cards look polished and professional.

---

## Problem Context

Currently, statistics cards have text overflow issues where:
- Text breaks out of card boundaries
- Numbers and labels overlap or extend beyond containers
- Long Hebrew text doesn't wrap properly
- Cards look visually broken and unprofessional
- Responsive behavior causes text clipping

This primarily affects:
- Dashboard statistics widgets (Story 5.6)
- Progress cards
- Activity feed items
- Achievement cards

---

## Acceptance Criteria

### Given I am viewing the dashboard statistics cards

**When** the cards load with various data
**Then**:
- All text stays within card boundaries
- Numbers display without clipping:
  - Large numbers (1000+) don't overflow
  - Percentage values have proper spacing
  - Time values (hours:minutes) fit properly
- Labels wrap appropriately:
  - Hebrew text wraps at word boundaries
  - No orphaned text
  - Multi-line labels have proper line-height (1.5)
- Card height adjusts to content:
  - Min-height prevents squashing
  - Max-height with overflow scroll if needed (rare)
  - Consistent heights in same row

### And when viewing different screen sizes

**Then**:
- Desktop (>1024px): Cards maintain optimal size
- Tablet (768-1024px): Cards resize without text overflow
- Mobile (<768px): Cards stack and text remains readable

### And when viewing specific statistics

**Then**:
- **Total Reading Time card:**
  - "123 שעות, 45 דקות" displays without clipping
  - Label "זמן קריאה כולל" wraps if needed
- **Guides Completed card:**
  - Large numbers (48/48) display properly
  - Progress indicator fits within bounds
- **Current Streak card:**
  - Number with icon (flame) aligns correctly
  - "ימים רצופים" label fits
- **Notes/Tasks counts:**
  - Multiple digit numbers don't break layout
  - Icon + number + label alignment is correct

---

## Technical Implementation

### Files to Modify

1. **`src/app/dashboard/components/StatisticsCard.tsx`** (or wherever stats cards are)
2. **`src/app/dashboard/components/ProgressCard.tsx`**
3. **`src/app/dashboard/components/ActivityFeed.tsx`**
4. **`src/components/ui/card.tsx`** - Card component styling

### Card Structure Fix

```tsx
// StatisticsCard.tsx
interface StatisticsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  className?: string;
}

export function StatisticsCard({ icon, label, value, trend, className }: StatisticsCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <CardContent className="p-0">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
          {trend && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {/* Trend indicator */}
            </span>
          )}
        </div>

        {/* Value - prevent overflow */}
        <div className="mb-1">
          <p className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {value}
          </p>
        </div>

        {/* Label - allow wrapping */}
        <p className="text-sm text-muted-foreground leading-relaxed break-words">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Text Overflow Solutions

1. **For Numbers (Large Values):**
```tsx
<p className="text-2xl font-bold truncate" title={fullValue}>
  {displayValue}
</p>
```

2. **For Labels (Multi-line):**
```tsx
<p className="text-sm text-muted-foreground line-clamp-2 break-words">
  {label}
</p>
```

3. **For Hebrew Text:**
```tsx
// Ensure proper RTL and word breaking
<p className="text-sm break-words hyphens-auto" lang="he" dir="rtl">
  {hebrewText}
</p>
```

4. **For Flex Containers:**
```tsx
<div className="flex items-center gap-2 min-w-0">
  {/* min-w-0 allows flex children to shrink */}
  <span className="truncate">{text}</span>
</div>
```

### CSS Utilities to Add

```css
/* src/styles/globals.css */

/* Prevent text overflow in cards */
.card-text-safe {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
}

/* Ellipsis for long text */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive font sizing */
.stat-value {
  font-size: clamp(1.5rem, 4vw, 2rem);
}
```

### Card Minimum Width

```tsx
// Ensure cards don't get too narrow
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {statistics.map(stat => (
    <div key={stat.id} className="min-w-0">
      {/* min-w-0 allows grid item to shrink */}
      <StatisticsCard {...stat} />
    </div>
  ))}
</div>
```

---

## Testing Checklist

- [ ] All statistics cards display without overflow
- [ ] Large numbers (1000+) don't break layout
- [ ] Hebrew labels wrap properly
- [ ] Cards work on mobile (320px width)
- [ ] Cards work on tablet (768px)
- [ ] Cards work on desktop (1024px+)
- [ ] Cards maintain consistent heights in same row
- [ ] No horizontal scrolling within cards
- [ ] Tooltips show full value if truncated
- [ ] RTL text behaves correctly
- [ ] Dark mode doesn't introduce new issues

### Specific Test Cases

1. **Reading Time:** "9,999 שעות, 59 דקות" displays correctly
2. **Guides Completed:** "100/100 מדריכים" fits in card
3. **Streak:** "365 ימים רצופים" with flame icon aligns
4. **Long Labels:** Test with unusually long Hebrew text

---

## Definition of Done

- [ ] All text overflow issues fixed
- [ ] Cards tested with edge case data (very large numbers, long text)
- [ ] Responsive behavior verified across all breakpoints
- [ ] No visual regressions on other components
- [ ] No TypeScript or linter errors
- [ ] Hebrew text displays correctly with proper wrapping
- [ ] Code reviewed and committed
- [ ] Ben confirms statistics cards look good

---

**Created:** November 8, 2025
**Author:** BMad Master
**Related Issues:** Statistics card overflow, text clipping

