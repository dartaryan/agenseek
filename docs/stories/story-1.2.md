# Story 1.2: Configure TailwindCSS with Emerald Theme

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 2  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** TailwindCSS configured with the Emerald Learning theme,  
**So that** I can style components consistently using the design system.

---

## Acceptance Criteria

### AC1: TailwindCSS Installation

**Given** the project is initialized  
**When** I install and configure Tailwind with the custom theme  
**Then**:
- TailwindCSS 3.4.x is installed
- PostCSS and Autoprefixer are configured
- `tailwind.config.js` includes:
  - Emerald color palette (#10B981 primary, #6EE7B7 secondary, #2DD4BF accent)
  - Fredoka font family configuration
  - Dark mode class strategy
  - Custom spacing and border radius
  - tailwindcss-animate plugin
- `src/styles/globals.css` includes Tailwind directives
- `src/styles/themes.css` includes CSS variables for light/dark modes

### AC2: Theme Application

**Given** TailwindCSS is configured  
**When** I use `className="bg-primary text-white"`  
**Then** I see emerald background with white text

---

## Dependencies

**Prerequisites:**
- Story 1.1 (Project initialization)

**Blocks:**
- Story 1.3 (Shadcn/ui needs Tailwind)

---

## Technical Notes

### Implementation Details

1. Install TailwindCSS:
   ```bash
   npm install -D tailwindcss@3.4 postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Configure `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           primary: '#10B981',      // Emerald-500
           secondary: '#6EE7B7',    // Emerald-300
           accent: '#2DD4BF',       // Teal-400
           emerald: {
             50: '#ECFDF5',
             100: '#D1FAE5',
             200: '#A7F3D0',
             300: '#6EE7B7',
             400: '#34D399',
             500: '#10B981',
             600: '#059669',
             700: '#047857',
             800: '#065F46',
             900: '#064E3B',
             950: '#022C22',
           },
         },
         fontFamily: {
           sans: ['Fredoka', 'system-ui', 'sans-serif'],
           serif: ['Fredoka', 'Georgia', 'serif'],
         },
         borderRadius: {
           'lg': '0.75rem',
           'xl': '1rem',
         },
       },
     },
     plugins: [
       require('tailwindcss-animate'),
     ],
   }
   ```

3. Create `src/styles/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer base {
     * {
       @apply border-border;
     }
     body {
       @apply bg-background text-foreground;
       font-feature-settings: "rlig" 1, "calt" 1;
     }
   }
   ```

4. Create `src/styles/themes.css`:
   ```css
   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 240 10% 3.9%;
       --primary: 142 76% 36%;
       --primary-foreground: 0 0% 100%;
       --secondary: 145 74% 69%;
       --accent: 173 80% 40%;
       --muted: 210 40% 96.1%;
       --border: 214.3 31.8% 91.4%;
       --radius: 0.75rem;
     }
   
     .dark {
       --background: 240 10% 3.9%;
       --foreground: 0 0% 98%;
       --primary: 142 76% 36%;
       --primary-foreground: 0 0% 100%;
       --secondary: 145 74% 69%;
       --accent: 173 80% 40%;
       --muted: 217.2 32.6% 17.5%;
       --border: 217.2 32.6% 17.5%;
     }
   }
   ```

5. Import Google Fonts in `index.html`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```

6. Set RTL support in `index.html`:
   ```html
   <html dir="rtl" lang="he">
   ```

7. Import styles in `src/main.tsx`:
   ```typescript
   import './styles/globals.css'
   import './styles/themes.css'
   ```

### Testing Steps

1. Create a test component with Tailwind classes
2. Verify emerald colors display correctly
3. Test dark mode toggle
4. Verify Fredoka font loads
5. Test RTL layout
6. Run build and check for CSS output

---

## Definition of Done

- ✅ TailwindCSS 3.4.x installed
- ✅ Configuration file created with emerald theme
- ✅ Fredoka font loads from Google Fonts
- ✅ Dark mode class strategy configured
- ✅ CSS variables defined for light/dark themes
- ✅ Test component shows emerald colors
- ✅ RTL layout works correctly
- ✅ Build completes without CSS errors

---

## Time Estimate

**Estimated Time:** 3-4 hours

**Breakdown:**
- Installation and configuration: 1 hour
- Theme customization: 1 hour
- Font setup: 30 minutes
- Testing: 1 hour
- Documentation: 30 minutes

---

## Related Documentation

- Architecture: `docs/architecture.md` - Section 5.2 (Color System)
- UX Design: `docs/ux-design-specification.md` - Emerald Learning theme
- TailwindCSS Documentation: https://tailwindcss.com/

---

**Created:** November 6, 2025  
**Author:** Bob (Scrum Master)  
**Story ID:** SEEK-1.2

