# Story 0.20: Multi-Column Guide Layout in Journey

**Status:** Pending
**Created:** November 9, 2025
**Epic:** 0 - On-the-Go Stories

---

## User Story

As a user viewing my learning journey on a large screen,
I want to see guides displayed in multiple columns (3-4) instead of a single row,
So that I can see more guides at once without scrolling horizontally.

---

## Acceptance Criteria

**Given** I am viewing the Journey page (`/journey`)
**When** I expand a phase to see its guides
**Then**:
- **On mobile (< 640px):** Guides display in 1 column (current behavior)
- **On tablet (640px - 1023px):** Guides display in 2 columns
- **On desktop (1024px - 1279px):** Guides display in 3 columns
- **On large desktop (≥ 1280px):** Guides display in 4 columns

**And** the guide cards:
- Maintain consistent spacing and sizing
- Are properly aligned in the grid
- Retain all current functionality (click, progress, status badges)
- Show hover effects and animations as before

---

## Technical Notes

**Files to Modify:**
1. `src/app/journey/components/PhaseCard.tsx`
   - Change guide list from horizontal scroll to CSS grid
   - Update responsive classes for multi-column layout
   - Ensure animations work in grid layout

**Current Implementation:**
```tsx
// Line ~230-280 (approximate) - Guide List Section
<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
  {phase.guides.map((guide) => (
    // Guide card...
  ))}
</div>
```

**New Implementation:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {phase.guides.map((guide) => (
    // Guide card...
  ))}
</div>
```

**Responsive Breakpoints:**
- `grid-cols-1` - Mobile (default)
- `sm:grid-cols-2` - Tablet (≥ 640px)
- `lg:grid-cols-3` - Desktop (≥ 1024px)
- `xl:grid-cols-4` - Large Desktop (≥ 1280px)

**Considerations:**
- Remove horizontal scroll (`overflow-x-auto`)
- Remove snap scroll (`snap-x snap-mandatory`)
- Keep vertical spacing consistent
- Ensure guide cards have min-width to prevent crushing
- Test with varying numbers of guides per phase

---

## Design Adjustments

**Guide Card Sizing:**
- Set `min-w-[250px]` to prevent cards from being too narrow
- Use `w-full` to fill grid cell
- Maintain current card height and padding

**Animation Adjustments:**
- Stagger animation should work row-by-row
- Entrance animations should respect grid layout
- Hover effects should remain unchanged

**Empty State:**
- If phase has few guides (< 4), cards should not stretch excessively
- Consider `justify-items-start` for phases with < grid columns

---

## Testing Checklist

- [ ] Mobile: 1 column layout
- [ ] Tablet: 2 columns layout
- [ ] Desktop: 3 columns layout
- [ ] Large Desktop: 4 columns layout
- [ ] Guide cards maintain proper sizing
- [ ] Animations work correctly in grid
- [ ] Hover effects function properly
- [ ] Click-through to guides works
- [ ] Progress indicators display correctly
- [ ] "Next Recommended" highlight visible
- [ ] Test with varying guide counts (1, 2, 3, 5, 10+ guides)

---

## Before/After Comparison

**Before (Current):**
```
Phase: Core Guides
[Guide 1] [Guide 2] [Guide 3] [Guide 4] →→→→→
└──────────── Horizontal Scroll ──────────────┘
```

**After (New):**
```
Phase: Core Guides
┌──────────┬──────────┬──────────┬──────────┐
│ Guide 1  │ Guide 2  │ Guide 3  │ Guide 4  │
├──────────┼──────────┼──────────┼──────────┤
│ Guide 5  │ Guide 6  │ Guide 7  │ Guide 8  │
└──────────┴──────────┴──────────┴──────────┘
         No horizontal scroll needed
```

---

## Success Criteria

- [ ] Multi-column grid displays correctly on all screen sizes
- [ ] No horizontal scrolling required
- [ ] All guide functionality preserved
- [ ] Animations and transitions work smoothly
- [ ] Responsive design matches specifications

