# Story 1.12: Implement Real Agenseek Logo Across Application

**Epic:** Epic 1 - Project Foundation & Infrastructure
**Sprint:** 1 (Enhancement)
**Story Points:** 2
**Priority:** P1 (High)
**Dependencies:** Story 1.8 (Layout Components), Story 1.11 (Hebrew Localization)

---

## User Story

As a user,
I want to see the professional Agenseek logo throughout the application,
So that the platform has a consistent and professional brand identity.

---

## Business Context

**Current State:**
- ❌ Placeholder logo in Header (green circle with "A" letter)
- ❌ Default Vite favicon (vite.svg) in browser tab
- ❌ No branded logo on auth pages (login, registration)
- ❌ Unprofessional appearance

**Impact:**
- Poor brand identity and recognition
- Unprofessional user experience
- Missed branding opportunities

**Solution:**
- Replace all placeholder logos with real Agenseek logo
- Implement both SVG (for UI) and PNG (for fallback/special cases)
- Update favicon with branded logo
- Ensure logo is visible and accessible across all pages

---

## Acceptance Criteria

### Given I have the real Agenseek logo (SVG and PNG)
### When I navigate through the application
### Then I should see:

1. **Header Logo:**
   - ✅ Real Agenseek logo replaces the placeholder green circle
   - ✅ Logo is clickable and links to /dashboard
   - ✅ Logo displays properly in RTL layout
   - ✅ Logo maintains aspect ratio and quality
   - ✅ Logo size: height 32px (h-8), width auto
   - ✅ Brand name "Agenseek" appears next to logo on desktop (hidden on mobile <640px)
   - ✅ Hover effect on logo link
   - ✅ Proper spacing between logo and text (RTL-compatible)

2. **Authentication Pages (Login, Registration, Password Reset):**
   - ✅ Large branded logo at top of auth forms
   - ✅ Logo size: height 48px (h-12), centered above form
   - ✅ Logo provides visual brand identity before login
   - ✅ SVG format for crisp display on all screens

3. **Browser Favicon:**
   - ✅ Replace `/public/vite.svg` with Agenseek logo
   - ✅ Update `index.html` favicon reference
   - ✅ Favicon visible in browser tab
   - ✅ Favicon works on all devices/browsers
   - ✅ Consider creating favicon.ico (16x16, 32x32, 64x64) from PNG

4. **Footer (Optional but Recommended):**
   - ✅ Small logo or brand text in footer
   - ✅ Maintains consistency with header

5. **Asset Management:**
   - ✅ Logo files properly placed in `src/assets/`
   - ✅ Both SVG and PNG versions available
   - ✅ SVG preferred for UI (scalable, small file size)
   - ✅ PNG as fallback if needed
   - ✅ Proper import statements in components

6. **Typography:**
   - ✅ Application font changed from Arimo to Varela Round (Google Fonts)
   - ✅ Font loaded via Google Fonts CDN
   - ✅ Font configured in Tailwind as primary font-sans
   - ✅ Font applies consistently across all pages
   - ✅ Font works well with Hebrew text (RTL support)

7. **Code Quality:**
   - ✅ Remove all placeholder logo code
   - ✅ Consistent logo component usage
   - ✅ Responsive design (logo scales on mobile)
   - ✅ Accessibility: alt text for logo images
   - ✅ No hardcoded paths (use proper imports)
   - ✅ Proper spacing between all icons/logos and adjacent text

8. **Verification:**
   - ✅ Logo displays correctly in Header across all pages
   - ✅ Logo displays correctly on all auth pages
   - ✅ Favicon shows in browser tab with proper icon
   - ✅ Build passes with no errors
   - ✅ Logo is sharp and clear on retina displays
   - ✅ No console warnings about missing assets
   - ✅ Font displays correctly in Hebrew and English
   - ✅ All spacing between icons/logos and text is consistent

---

## Technical Implementation

### Step 1: Verify Logo Assets

**Files:**
- `src/assets/agenseek-logo.svg` (primary)
- `src/assets/agenseek-logo.png` (fallback)

**Verify:**
```bash
# Check files exist
ls -la src/assets/agenseek-logo.*
```

---

### Step 2: Create Favicon

**Generate favicon from logo:**
1. Use PNG logo to create multi-size favicon.ico
2. Or use SVG directly in modern browsers
3. Place in `/public/` directory

**Tools:**
- Online: https://favicon.io/favicon-converter/
- Or use design tool to export 16x16, 32x32, 64x64 PNG
- Combine into favicon.ico

**File:** `/public/favicon.ico` or `/public/agenseek-icon.svg`

---

### Step 3: Update Font to Varela Round

**File:** `index.html`

**Add Google Fonts link in `<head>` section:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet">
```

**File:** `tailwind.config.js`

**Update font family configuration:**
```js
module.exports = {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        sans: ['Varela Round', 'sans-serif'],
        serif: ['Varela Round', 'sans-serif'],
      },
    },
  },
}
```

**Why Varela Round:**
- Clean, modern, geometric sans-serif font
- Excellent readability in both Hebrew and English
- Friendly and approachable character
- Works well for both headings and body text
- Good RTL support

---

### Step 4: Update HTML Favicon Reference

**File:** `index.html`

**Current:**
```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**Updated:**
```html
<link rel="icon" type="image/svg+xml" href="/agenseek-icon.svg" />
<!-- OR if using .ico -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

---

### Step 5: Update Header Component

**File:** `src/components/layout/Header.tsx`

**Current (lines 30-37):**
```tsx
<Link to="/dashboard" className="flex items-center space-x-2">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
    <span className="text-lg font-bold text-white">A</span>
  </div>
  <span className="hidden font-bold text-xl text-emerald-600 sm:inline-block">
    Agenseek
  </span>
</Link>
```

**Updated:**
```tsx
import AgenseekLogo from '../../assets/agenseek-logo.svg';

// In component JSX:
<Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
  <img
    src={AgenseekLogo}
    alt="Agenseek Logo"
    className="h-8 w-auto"
  />
  <span className="hidden font-bold text-xl text-emerald-600 sm:inline-block">
    Agenseek
  </span>
</Link>
```

**Notes:**
- Remove placeholder green circle div
- Use proper import for SVG
- Use `gap-3` for proper spacing (RTL-friendly, equivalent to 12px)
- Keep brand name visible on desktop
- Add hover effect for better UX

---

### Step 6: Update Login Page

**File:** `src/app/auth/login.tsx`

**Current (lines 114-117):**
```tsx
<div className="text-center space-y-2">
  <h1 className="text-4xl font-bold text-emerald-600">{he.brandName}</h1>
  <p className="text-gray-600">{he.brandSubtitle}</p>
</div>
```

**Updated:**
```tsx
import AgenseekLogo from '../../assets/agenseek-logo.svg';

// In component JSX:
<div className="text-center space-y-4">
  <img
    src={AgenseekLogo}
    alt="Agenseek - BMAD Learning Hub"
    className="h-12 w-auto mx-auto"
  />
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-emerald-600">{he.brandName}</h1>
    <p className="text-gray-600">{he.brandSubtitle}</p>
  </div>
</div>
```

**Notes:**
- Add logo above brand name
- Center logo with mx-auto
- Maintain spacing with space-y-4
- Keep semantic heading structure

---

### Step 6A: Fix Remember Me Checkbox Spacing

**File:** `src/app/auth/login.tsx`

**Current (lines 183-194):**
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="rememberMe"
    checked={rememberMe}
    onCheckedChange={(checked: boolean) => setValue('rememberMe', checked === true)}
    disabled={isLoading}
  />
  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
    {he.rememberMe}
  </Label>
</div>
```

**Updated:**
```tsx
<div className="flex items-center gap-2 rtl:flex-row-reverse">
  <Checkbox
    id="rememberMe"
    checked={rememberMe}
    onCheckedChange={(checked: boolean) => setValue('rememberMe', checked === true)}
    disabled={isLoading}
  />
  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
    {he.rememberMe}
  </Label>
</div>
```

**Notes:**
- Change `space-x-2` to `gap-2` for better RTL support
- Add `rtl:flex-row-reverse` to properly reverse the order in RTL layout
- This ensures proper spacing between checkbox and label text in Hebrew

---

### Step 7: Update Registration Page

**File:** `src/app/auth/register.tsx`

**Apply same changes as Login page:**
1. Import logo SVG
2. Add logo image above header
3. Center with mx-auto
4. Height h-12 (48px)

**Pattern:**
```tsx
import AgenseekLogo from '../../assets/agenseek-logo.svg';

// In header section:
<img
  src={AgenseekLogo}
  alt="Agenseek - BMAD Learning Hub"
  className="h-12 w-auto mx-auto mb-4"
/>
```

---

### Step 8: Update Password Reset Page

**File:** `src/app/auth/reset-password.tsx`

**Apply same changes as Login page:**
1. Import logo SVG
2. Add logo image above header
3. Maintain consistency with other auth pages

---

### Step 9: Update Footer (Optional but Recommended)

**File:** `src/components/layout/Footer.tsx`

**Add small logo or maintain brand text:**
```tsx
import AgenseekLogo from '../../assets/agenseek-logo.svg';

// Option 1: Small logo
<img
  src={AgenseekLogo}
  alt="Agenseek"
  className="h-6 w-auto opacity-80"
/>

// Option 2: Keep text-based (current implementation is fine)
<p className="text-sm text-gray-500">
  © 2025 Agenseek - BMAD Learning Hub. All rights reserved.
</p>
```

---

### Step 10: Git Tracking

**Add logo assets to Git:**
```bash
git add src/assets/agenseek-logo.svg
git add src/assets/agenseek-logo.png
git add public/favicon.ico  # or agenseek-icon.svg
```

**Note:** These files are currently untracked per git status

---

### Step 11: Verify Implementation

**Manual Testing:**
1. ✅ Visit `/dashboard` - logo in header with proper spacing
2. ✅ Visit `/auth/login` - logo above form, checkbox spacing correct
3. ✅ Visit `/auth/register` - logo above form
4. ✅ Visit `/auth/reset-password` - logo above form
5. ✅ Check browser tab - favicon visible
6. ✅ Test responsive (mobile <640px) - logo scales properly
7. ✅ Test logo click - navigates to dashboard
8. ✅ Check console - no 404 errors for assets
9. ✅ Verify Varela Round font is loading and applying correctly
10. ✅ Check all icon-text spacing throughout the app (sort buttons, filters, etc.)

**Build Test:**
```bash
npm run build
npm run preview
```

**Accessibility Check:**
- All logos have proper alt text
- Logo links are keyboard accessible
- Logo maintains good contrast

---

## Technical Notes

### Asset Import in Vite + React

Vite supports importing assets (SVG, PNG) as URLs:

```tsx
import logoUrl from './logo.svg';  // Returns string URL
<img src={logoUrl} alt="Logo" />
```

### SVG vs PNG
- **SVG:** Preferred for UI (scalable, crisp, small file size)
- **PNG:** Fallback or special cases (better browser support)
- Both available in `src/assets/`

### Favicon Best Practices
- Modern browsers support SVG favicon
- Fallback to .ico for older browsers
- Multi-size .ico recommended (16x16, 32x32, 64x64)
- Place in `/public/` (not `/src/assets/`)

### Responsive Logo
- Use `h-8` (32px) in header for desktop/mobile
- Use `h-12` (48px) on auth pages (larger, more prominent)
- Width auto maintains aspect ratio
- Use `w-auto` to prevent distortion

### RTL Layout
- Logo is left-to-right (LTR) visual element
- Use `gap-*` spacing (works in RTL)
- Avoid `margin-left` or `margin-right` (use logical properties)

---

## Definition of Done

- [ ] Agenseek logo displays in Header on all pages
- [ ] Agenseek logo displays on Login page
- [ ] Agenseek logo displays on Registration page
- [ ] Agenseek logo displays on Password Reset page
- [ ] Favicon updated in browser tab
- [ ] Font changed to Varela Round from Google Fonts
- [ ] Font applies correctly in Hebrew and English
- [ ] Logo assets added to Git
- [ ] All placeholder logo code removed
- [ ] All icon/logo spacing issues fixed (Header logo, Remember Me checkbox, etc.)
- [ ] Build completes with no errors
- [ ] No console warnings about assets
- [ ] Logo is sharp on retina displays
- [ ] Logo links work (navigate to dashboard)
- [ ] Logo scales properly on mobile
- [ ] Alt text present for accessibility
- [ ] Visual inspection confirms professional appearance and proper spacing

---

## Related Files

**Modified:**
- `index.html` - favicon reference
- `src/components/layout/Header.tsx` - header logo
- `src/app/auth/login.tsx` - auth page logo
- `src/app/auth/register.tsx` - auth page logo
- `src/app/auth/reset-password.tsx` - auth page logo
- (Optional) `src/components/layout/Footer.tsx` - footer branding

**Added:**
- `public/favicon.ico` or `public/agenseek-icon.svg` - favicon
- (Already exists) `src/assets/agenseek-logo.svg` - logo asset
- (Already exists) `src/assets/agenseek-logo.png` - logo asset

---

## Estimated Effort

**Story Points:** 2

**Breakdown:**
- Create/verify favicon: 15 min
- Update HTML: 5 min
- Update Header: 15 min
- Update Login page: 10 min
- Update Registration page: 10 min
- Update Password Reset page: 10 min
- Update Footer (optional): 10 min
- Testing and verification: 20 min
- Git add assets: 5 min

**Total:** ~1.5 hours

---

## Success Metrics

**User Experience:**
- Professional brand identity throughout app
- Consistent logo placement and sizing
- Improved visual polish

**Technical:**
- Zero asset loading errors
- Proper asset imports and optimization
- Clean, maintainable code

---

**Created:** November 7, 2025
**Author:** Ben (via BMad Master Agent)
**Status:** Ready to Implement

---

## Implementation Checklist

Use this checklist while implementing:

- [ ] Step 1: Verify logo assets exist
- [ ] Step 2: Create favicon from logo
- [ ] Step 3: Update font to Varela Round (index.html + tailwind.config.js)
- [ ] Step 4: Update index.html favicon reference
- [ ] Step 5: Update Header component (logo + spacing)
- [ ] Step 6: Update Login page (logo)
- [ ] Step 6A: Fix Remember Me checkbox spacing
- [ ] Step 7: Update Registration page
- [ ] Step 8: Update Password Reset page
- [ ] Step 9: Update Footer (optional)
- [ ] Step 10: Git add logo assets
- [ ] Step 11: Verify implementation
- [ ] Test font rendering in Hebrew and English
- [ ] Test all spacing between icons/logos and text
- [ ] Test on multiple pages
- [ ] Test responsive design
- [ ] Build and verify production
- [ ] Mark story complete

