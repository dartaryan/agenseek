# Story 0.15: Dark Mode Polish & Implementation

## Story Type
On-the-Go Enhancement

## Status
Not Started

## Priority
Medium

## Description
Currently, dark mode infrastructure is in place but the visual design needs significant polish before it can be released to users. The theme toggle has been temporarily hidden across all pages until the dark mode styling is production-ready.

## Background
- Story 0.6 implemented the initial dark mode infrastructure
- Dark mode colors and styling need refinement for better aesthetics and usability
- Theme toggle was temporarily removed in favor of focusing on light mode first

## Acceptance Criteria

### 1. Color Palette Refinement
- [ ] Review and improve dark mode color scheme
- [ ] Ensure proper contrast ratios (WCAG AA compliance)
- [ ] Create cohesive visual hierarchy in dark mode
- [ ] Test color combinations across all components

### 2. Component Styling
- [ ] Update all dashboard components for dark mode
- [ ] Polish all page layouts (guides, profile, settings, notes, tasks, progress)
- [ ] Ensure admin pages look good in dark mode
- [ ] Fix any visual inconsistencies or readability issues

### 3. Special Elements
- [ ] Images/logos: Add dark mode variants if needed
- [ ] Charts and graphs: Ensure visibility in dark mode
- [ ] Syntax highlighting: Update code blocks if applicable
- [ ] Shadows and elevation: Adjust for dark backgrounds

### 4. Theme Toggle Restoration
- [ ] Restore theme toggle in Header (desktop)
- [ ] Restore theme toggle in MobileNav
- [ ] Restore theme toggle in auth pages (login, register, forgot-password, reset-password)

### 5. Testing & QA
- [ ] Systematic page-by-page dark mode testing
- [ ] Test theme toggle functionality
- [ ] Test theme persistence across sessions
- [ ] Test system preference detection
- [ ] Accessibility audit
- [ ] Visual QA and polish

## Technical Notes

### Theme Toggle Locations (Currently Commented Out)
```
src/app/auth/login.tsx (lines ~111-123)
src/app/auth/register.tsx (lines ~197-209)
src/app/auth/forgot-password.tsx (lines ~70-82)
src/app/auth/reset-password.tsx (3 locations: ~141-153, ~173-185, ~228-240)
src/components/layout/Header.tsx (lines ~162-174)
src/components/layout/MobileNav.tsx (lines ~232-250)
```

### Dark Mode Infrastructure Already in Place
- ThemeProvider context (`src/contexts/ThemeContext.tsx`)
- Theme persistence in localStorage
- System preference detection
- Anti-flash script in `index.html`
- CSS variables in `src/styles/globals.css`

### Current Color Variables (Need Review)
```css
/* Light Mode */
--background: white
--foreground: dark text
--card: card background
--muted: muted backgrounds
--primary: emerald-600

/* Dark Mode (Needs Polish) */
--background: Deep emerald green (160 40% 10%)
--foreground: White (150 15% 96%)
--card: Emerald green (160 30% 16%)
--muted: Dark green (160 25% 22%)
--primary: Emerald green (142 76% 40%)
```

## Related Stories
- Story 0.6: Dark Mode Implementation (Initial infrastructure)
- Story 6.15: Animated Background Shapes

## Design Considerations
1. Dark mode should feel cohesive and intentional, not just inverted colors
2. Maintain brand identity (emerald/teal theme) in dark mode
3. Ensure sufficient contrast for all text and interactive elements
4. Consider user comfort for extended reading sessions
5. Make sure cards and sections are clearly distinguishable from backgrounds

## User Impact
- Users currently only have light mode available
- Once completed, users will have a fully polished dark mode option
- Better support for users who prefer dark interfaces
- Reduced eye strain for night-time usage

## Estimated Effort
Medium (2-3 sessions)
- Session 1: Color refinement + component updates
- Session 2: Testing, QA, and polish
- Session 3: Theme toggle restoration and final testing

## Notes
- Focus on getting the visual design right before re-enabling the toggle
- Consider creating a design specification document for dark mode colors
- May want to gather user feedback once a polished version is ready
- Consider adding a "Beta" badge to dark mode toggle when first released

