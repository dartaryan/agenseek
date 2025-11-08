# Story 6.15: Implement Animated Geometric Backgrounds

**Epic:** 6 - Notes & Tasks (Extension - UI/UX Polish)
**Sprint:** 10
**Story Points:** 3
**Priority:** P1
**Status:** PENDING
**Dependencies:** None (visual enhancement)

---

## User Story

**As a** user,
**I want** visually appealing animated backgrounds on login and throughout the app,
**So that** the platform feels more polished, modern, and engaging without being distracting.

---

## Problem Context

Currently, the application has plain/simple gradient backgrounds:
- **Login/Auth pages:** Basic gradient (`from-emerald-50 via-white to-teal-50`)
- **Main app pages:** Plain white backgrounds
- Functional but lacks visual interest and polish
- Opportunity to use Agenseek logo colors/shapes for brand consistency

**Goals:**
- Add subtle, professional animated backgrounds
- Use geometric shapes inspired by Agenseek logo (angular "A" design)
- Emerald green (#059669) and gray (#AEAEAE) color palette from logo
- Parallax-style animations that add depth without distraction
- Keep it simple and performant

---

## Acceptance Criteria

### AC 1: Create Reusable Animated Background Component

**Given** I am building a background animation system

**Then** create `src/components/ui/AnimatedBackground.tsx` with:
- Accepts variant prop: `"auth"` or `"app"`
- Renders floating geometric shapes (triangles, angular forms)
- Shapes use emerald and gray tones from logo
- Semi-transparent shapes (opacity 0.03-0.15)
- Positioned absolutely with z-index: -1 (behind all content)
- Various sizes: small (40px), medium (80px), large (120px), extra-large (200px)
- 5-8 shapes total per variant (not too busy)

### AC 2: Implement CSS-Based Animations

**Given** shapes are rendered on screen

**Then** apply subtle animations:
- **Floating motion:** Slow vertical drift (up/down, 20-40px range)
- **Horizontal drift:** Slow side-to-side movement (15-30px range)
- **Rotation:** Gentle continuous rotation (0-360deg over 30-60s)
- **Fade:** Opacity pulse (subtle, between min and max opacity)
- **Duration:** 20-60 seconds per animation (very slow)
- **Timing:** ease-in-out for smooth motion
- **Stagger:** Each shape has different animation delays
- Use CSS animations (GPU accelerated, performant)

### AC 3: Auth Variant Background

**Given** I am on login, register, or reset password pages

**Then** show auth variant background:
- More prominent shapes (larger, slightly higher opacity)
- Centered composition around the card
- Shapes create visual frame for auth card
- Colors: emerald-100, emerald-50, gray-100, gray-50
- Slower, calmer animations (30-60s duration)
- Creates welcoming, professional atmosphere

### AC 4: App Variant Background

**Given** I am on dashboard, guides, notes, tasks, or other main pages

**Then** show app variant background:
- Subtler shapes (smaller, lower opacity)
- Peripheral placement (corners, edges)
- Doesn't compete with content or data visualizations
- Colors: emerald-50, emerald-25 (very light), gray-50, gray-25
- Slightly faster animations (20-40s duration)
- Stays in background, maintains focus on content

### AC 5: Responsive Behavior

**Given** the user is on different screen sizes

**Then** adjust background appropriately:
- **Mobile (<640px):**
  - Fewer shapes (3-5)
  - Smaller sizes (proportional scaling)
  - Hidden on very small screens if interfering (<400px width)
- **Tablet (640-1024px):**
  - Medium number of shapes (4-6)
  - Medium sizes
- **Desktop (>1024px):**
  - Full number of shapes (5-8)
  - Full sizes
- Shapes scale proportionally with viewport
- No horizontal scrolling introduced

### AC 6: Accessibility and Performance

**Given** users have different preferences and devices

**Then** ensure:
- **Respects `prefers-reduced-motion`:**
  - If user has reduced motion preference, disable all animations
  - Show static shapes only (no movement)
- **Performance optimized:**
  - Use CSS transforms (GPU accelerated)
  - `will-change: transform` on animated elements
  - No JavaScript-based animations
  - 60fps smooth animation
  - No impact on page load time (<50ms added)
- **No accessibility interference:**
  - Shapes are purely decorative (aria-hidden="true")
  - Don't interfere with screen readers
  - Don't block interactive elements
  - Sufficient contrast maintained for text

### AC 7: Integration with Existing Pages

**Given** the background component is ready

**Then** integrate into pages:

**Auth Pages (auth variant):**
- `src/app/auth/login.tsx`
- `src/app/auth/register.tsx`
- `src/app/auth/reset-password.tsx`

**Main Pages (app variant):**
- `src/app/dashboard/index.tsx`
- `src/app/guides/index.tsx`
- `src/app/notes/index.tsx`
- `src/app/tasks/index.tsx`
- Other main pages as applicable

**Implementation:**
```tsx
// In page component
<div className="relative min-h-screen">
  <AnimatedBackground variant="auth" /> {/* or "app" */}
  {/* Rest of page content */}
</div>
```

---

## Technical Implementation

### File Structure

```
src/
  components/
    ui/
      AnimatedBackground.tsx   (new)
  styles/
    animations.css             (new - optional)
```

### Component Architecture

**AnimatedBackground.tsx:**
```tsx
interface AnimatedBackgroundProps {
  variant: 'auth' | 'app';
}

export function AnimatedBackground({ variant }: AnimatedBackgroundProps) {
  const shapes = getShapesConfig(variant);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
    >
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={cn(
            "absolute",
            shape.size,
            shape.position,
            shape.color,
            prefersReducedMotion ? "" : shape.animation
          )}
          style={{
            clipPath: shape.clipPath, // Triangle/angular shapes
            animationDelay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
```

### Shape Configurations

**Auth Variant Shapes (5-8 shapes):**
- **Shape 1:** Large emerald triangle, top-left, slow rotation
- **Shape 2:** Medium gray angular form, top-right, floating
- **Shape 3:** Large emerald shape, bottom-right, rotation + drift
- **Shape 4:** Medium gray triangle, bottom-left, floating
- **Shape 5-8:** Accent shapes, various positions, mixed animations

**App Variant Shapes (5-7 shapes):**
- Smaller, subtler versions
- Primarily in corners and edges
- Lower opacity (0.03-0.08)
- Faster animations (20-40s)

### CSS Animations

```css
/* Floating animation */
@keyframes float-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

/* Drift animation */
@keyframes drift-horizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

/* Rotation animation */
@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Fade pulse */
@keyframes fade-pulse {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.15; }
}

/* Combined animation example */
.animate-float-1 {
  animation:
    float-up 40s ease-in-out infinite,
    drift-horizontal 50s ease-in-out infinite,
    rotate-slow 60s linear infinite;
}
```

### Shape Geometry (SVG Clip Paths)

Use CSS `clip-path` for geometric shapes:

```css
/* Angular A-inspired shapes */
.triangle-1 {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.triangle-2 {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.angular-1 {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.trapezoid-1 {
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
}
```

---

## Design Specifications

### Color Palette (from Agenseek Logo)

**Emerald Tones:**
- Primary: `#059669` (from logo green)
- Light variants: `emerald-100`, `emerald-50`, `emerald-25` (very light)

**Gray Tones:**
- Primary: `#AEAEAE` (from logo gray)
- Light variants: `gray-100`, `gray-50`, `gray-25` (very light)

### Opacity Ranges

**Auth Variant:**
- Base opacity: 0.05 - 0.15
- Pulse range: ±0.03

**App Variant:**
- Base opacity: 0.03 - 0.08
- Pulse range: ±0.02

### Animation Timing

| Animation Type | Auth Variant | App Variant |
|----------------|--------------|-------------|
| Floating       | 30-50s       | 20-35s      |
| Drift          | 40-60s       | 25-40s      |
| Rotation       | 50-60s       | 30-45s      |
| Fade Pulse     | 35-45s       | 25-35s      |

### Z-Index Layering

```
-10: Background shapes (AnimatedBackground)
  0: Main content
 10: Modals, overlays
 50: Toasts, notifications
```

---

## Testing Checklist

**Functionality:**
- [ ] AnimatedBackground component renders without errors
- [ ] Auth variant displays correctly on login/register/reset pages
- [ ] App variant displays correctly on dashboard/guides/notes/tasks
- [ ] Shapes have correct colors (emerald and gray tones)
- [ ] Animations are smooth (60fps, no jank)
- [ ] All shapes animate at different rhythms (staggered delays)

**Responsive:**
- [ ] Mobile: Fewer shapes, smaller sizes
- [ ] Tablet: Medium number of shapes
- [ ] Desktop: Full shapes displayed
- [ ] No horizontal scrolling introduced on any screen size
- [ ] Shapes scale proportionally with viewport

**Accessibility:**
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Shapes are aria-hidden (purely decorative)
- [ ] No interference with keyboard navigation
- [ ] Text contrast not affected by background shapes
- [ ] Screen readers ignore background shapes

**Performance:**
- [ ] Page load time not impacted (no lazy loading needed)
- [ ] Animations use GPU acceleration (transform/opacity)
- [ ] No CPU spikes during animation
- [ ] Smooth scrolling maintained
- [ ] No memory leaks

**Visual Quality:**
- [ ] Shapes look professional and polished
- [ ] Animations are subtle, not distracting
- [ ] Auth variant creates welcoming atmosphere
- [ ] App variant stays in background, doesn't compete with content
- [ ] Emerald/gray color palette matches logo
- [ ] Looks good in both light and dark mode (if applicable)

**Integration:**
- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] Works with all existing page layouts
- [ ] Doesn't break any existing components
- [ ] RTL layout unaffected

---

## Definition of Done

- [ ] `AnimatedBackground` component created and tested
- [ ] Auth variant implemented and integrated into login/register/reset pages
- [ ] App variant implemented and integrated into main pages
- [ ] Animations are smooth, subtle, and professional
- [ ] Responsive behavior works on all screen sizes
- [ ] `prefers-reduced-motion` respected
- [ ] Performance is excellent (60fps, no lag)
- [ ] No accessibility issues introduced
- [ ] Code is clean, typed, and linted
- [ ] All testing checklist items passed
- [ ] Ben approves visual design and animations
- [ ] Code committed and deployed

---

## Design Inspiration

**Logo Colors:**
- Green: `#059669` (vibrant emerald)
- Gray: `#AEAEAE` (neutral gray)

**Logo Shape:**
- Angular "A" form with sharp edges
- Geometric, modern design
- Two-tone composition

**Inspiration for Shapes:**
- Use angular triangles and trapezoids
- Echo the "A" shape geometry
- Vary sizes and orientations
- Create depth with layering and opacity

---

## Future Enhancements (Out of Scope)

These are NOT part of this story but could be considered later:

- [ ] Mouse parallax effect (shapes follow cursor subtly)
- [ ] Scroll parallax (shapes move at different speeds on scroll)
- [ ] User preference to disable/enable backgrounds
- [ ] Seasonal or themed background variants
- [ ] Interactive shapes (respond to hover)
- [ ] More complex SVG shapes matching logo exactly

---

**Created:** November 8, 2025
**Author:** BMad Master + Ben
**Related Issues:** Visual polish, brand identity, animated backgrounds, logo integration


