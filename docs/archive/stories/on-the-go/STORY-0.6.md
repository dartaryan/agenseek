# Story 0.6: Dark Mode Full Implementation

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 3
**Priority:** P1 (High)
**Dependencies:** None

---

## User Story

As a user,
I want a fully functional dark mode that works across all pages (including login and authentication),
So that I can use the application comfortably in low-light environments.

---

## Business Context

**Current State:**
- Dark mode toggle exists but is not working properly
- Dark mode styles are incomplete or not applied to all pages
- Login, registration, and authentication pages lack dark mode support
- Inconsistent dark mode experience across different components
- Theme preference may not persist correctly

**Impact:**
- Poor user experience in low-light environments
- Eye strain for users who prefer dark interfaces
- Incomplete feature that doesn't meet user expectations
- Inconsistent branding and polish

**Solution:**
- Fix dark mode toggle functionality
- Implement comprehensive dark mode styles for ALL pages
- Ensure authentication pages (login, register, forgot password) support dark mode
- Verify theme persistence across sessions
- Apply dark mode to all components consistently
- Test dark mode thoroughly on every page of the application

---

## Acceptance Criteria

### 1. Dark Mode Toggle Functionality

**Given I am on any page**
**When I toggle dark mode**
**Then:**

- ✅ Theme changes immediately (no page reload)
- ✅ Toggle state reflects current theme
- ✅ Theme preference persists after browser refresh
- ✅ Theme preference persists across sessions
- ✅ Theme applies to all components instantly
- ✅ Smooth transition animation between themes
- ✅ No flash of wrong theme on page load

### 2. Authentication Pages Dark Mode

**Given I am viewing authentication pages**
**Then dark mode should work on:**

- ✅ Login page (`/login`)
- ✅ Registration page (`/register`)
- ✅ Forgot password page (`/forgot-password`)
- ✅ Reset password page (`/reset-password`)
- ✅ Email verification page
- ✅ Authentication error pages
- ✅ All form fields and inputs
- ✅ All buttons and links
- ✅ Background colors
- ✅ Text colors (proper contrast)
- ✅ Brand logos (if necessary, use light/dark variants)

### 3. Main Application Pages Dark Mode

**Given I am viewing main application pages**
**Then dark mode should work on:**

- ✅ Dashboard
- ✅ Profile page
- ✅ Settings page
- ✅ Guides pages (list, detail, category)
- ✅ Admin pages (all admin routes)
- ✅ Navigation header
- ✅ Sidebar
- ✅ Footer (if exists)
- ✅ Modal dialogs
- ✅ Toast notifications
- ✅ Dropdown menus
- ✅ Forms and inputs
- ✅ Cards and panels
- ✅ Tables and lists
- ✅ Loading states
- ✅ Error states

### 4. Component-Level Dark Mode

**Given I am using any UI component**
**Then:**

- ✅ Cards: proper background and border colors
- ✅ Buttons: all variants (primary, secondary, outline, ghost)
- ✅ Inputs: text fields, textareas, selects
- ✅ Checkboxes and radio buttons
- ✅ Switches and toggles
- ✅ Badges and tags
- ✅ Avatars and icons
- ✅ Progress bars
- ✅ Tabs and navigation
- ✅ Breadcrumbs
- ✅ Tooltips and popovers
- ✅ Dropdowns and menus
- ✅ Scrollbars (custom styling)

### 5. Visual Quality & Accessibility

**Given I am using dark mode**
**Then:**

- ✅ Text has proper contrast ratio (WCAG AA standard)
- ✅ No pure white on pure black (use softer grays)
- ✅ Proper color hierarchy maintained
- ✅ Interactive elements clearly visible
- ✅ Focus states visible for keyboard navigation
- ✅ Disabled states clearly distinguishable
- ✅ No color-only information (icons/text labels present)
- ✅ Images and logos appropriate for dark theme

### 6. Theme Persistence

**Given I have selected a theme preference**
**Then:**

- ✅ Theme persists after closing browser
- ✅ Theme persists across devices (if user logged in)
- ✅ Theme loads BEFORE first paint (no flash)
- ✅ Theme syncs with system preference option available
- ✅ Theme preference stored in user profile (if authenticated)
- ✅ Theme preference stored in localStorage (fallback)

---

## Technical Implementation

### Step 1: Audit Current Dark Mode Implementation

**Files to check:**
- `src/components/layout/Header.tsx` - Theme toggle component
- `src/app/layout.tsx` - Theme provider setup
- `tailwind.config.js` - Dark mode configuration
- `src/lib/theme.ts` or similar - Theme management logic

**Verify:**
```bash
# Check if dark mode is configured in Tailwind
grep -r "darkMode" tailwind.config.js

# Check theme provider usage
grep -r "ThemeProvider" src/

# Check localStorage usage for theme
grep -r "theme" src/ | grep -i "localstorage"
```

**Document issues found:**
- Is dark mode toggle connected to state?
- Is theme context properly initialized?
- Are dark: classes being applied?
- Is theme persisting correctly?

---

### Step 2: Fix Theme Provider & Toggle

**File:** `src/app/layout.tsx`

**Ensure proper theme provider:**
```typescript
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationMismatch>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**File:** `src/components/theme-provider.tsx` (create if missing)

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) {
      setThemeState(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;

    // Resolve theme (handle 'system' preference)
    let resolved: 'light' | 'dark' = 'light';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      resolved = theme as 'light' | 'dark';
    }

    setResolvedTheme(resolved);

    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**File:** `src/components/layout/Header.tsx`

**Fix dark mode toggle:**
```typescript
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="...">
      {/* Other header content */}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {resolvedTheme === 'dark' ? (
          <IconSun className="w-5 h-5" />
        ) : (
          <IconMoon className="w-5 h-5" />
        )}
      </Button>
    </header>
  );
}
```

---

### Step 3: Configure Tailwind Dark Mode

**File:** `tailwind.config.js`

**Ensure dark mode is enabled:**
```javascript
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define dark mode color palette
        background: {
          light: '#ffffff',
          dark: '#0f172a', // slate-900
        },
        foreground: {
          light: '#0f172a',
          dark: '#f1f5f9', // slate-100
        },
        card: {
          light: '#ffffff',
          dark: '#1e293b', // slate-800
        },
        // ... more colors
      },
    },
  },
  plugins: [],
};
```

---

### Step 4: Implement Authentication Pages Dark Mode

**File:** `src/app/login/page.tsx`

**Add dark mode classes:**
```typescript
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            התחברות
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            הזן את הפרטים שלך כדי להתחבר
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                אימייל
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">
                סיסמה
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>
            <Button type="submit" className="w-full">
              התחבר
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline dark:text-primary-400"
          >
            שכחת סיסמה?
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            אין לך חשבון?{' '}
            <a href="/register" className="text-primary hover:underline dark:text-primary-400">
              הירשם עכשיו
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

**Apply similar patterns to:**
- `src/app/register/page.tsx`
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`

---

### Step 5: Update Component Library for Dark Mode

**File:** `src/components/ui/card.tsx`

```typescript
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-950 dark:text-slate-50 shadow-sm",
        className
      )}
      {...props}
    />
  )
);
```

**File:** `src/components/ui/input.tsx`

```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**File:** `src/components/ui/button.tsx`

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700",
        destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline: "border border-gray-300 dark:border-slate-600 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white",
        secondary: "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600",
        ghost: "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white",
        link: "text-primary dark:text-primary-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**Repeat for all UI components in `src/components/ui/`**

---

### Step 6: Update Main Application Pages

**File:** `src/app/dashboard/index.tsx`

**Add dark mode classes:**
```typescript
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          לוח בקרה
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                כרטיס 1
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                תיאור הכרטיס
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-200">
                תוכן הכרטיס
              </p>
            </CardContent>
          </Card>

          {/* More cards */}
        </div>
      </div>
    </div>
  );
}
```

**Apply to all main pages:**
- `src/app/profile/index.tsx`
- `src/app/settings/index.tsx`
- `src/app/guides/index.tsx`
- `src/app/admin/*` (all admin pages)

---

### Step 7: Update Layout Components

**File:** `src/components/layout/Sidebar.tsx`

```typescript
export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-screen">
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <IconHome className="w-5 h-5" />
          <span>לוח בקרה</span>
        </Link>

        {/* More nav items */}
      </nav>
    </aside>
  );
}
```

**File:** `src/components/layout/Header.tsx`

```typescript
export function Header() {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center px-6">
      {/* Header content with dark mode classes */}
    </header>
  );
}
```

---

### Step 8: Handle Images and Logos

**If logo needs dark/light variants:**

```typescript
import { useTheme } from '@/components/theme-provider';

export function Logo() {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={resolvedTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Agenseek Logo"
      className="h-8 w-auto"
    />
  );
}
```

**Or use CSS filters:**

```typescript
<img
  src="/logo.svg"
  alt="Logo"
  className="h-8 w-auto dark:invert" // Invert logo in dark mode
/>
```

---

### Step 9: Test All Pages Systematically

**Create testing checklist:**

```markdown
## Dark Mode Testing Checklist

### Authentication Pages
- [ ] /login - all elements
- [ ] /register - all elements
- [ ] /forgot-password - all elements
- [ ] /reset-password - all elements

### Main Pages
- [ ] /dashboard
- [ ] /profile
- [ ] /settings
- [ ] /guides
- [ ] /guides/[slug]
- [ ] /guides/categories/[category]

### Admin Pages
- [ ] /admin
- [ ] /admin/users
- [ ] /admin/content
- [ ] /admin/settings
- [ ] (all other admin routes)

### Components
- [ ] Modals/Dialogs
- [ ] Toasts
- [ ] Dropdowns
- [ ] Forms
- [ ] Tables
- [ ] Cards
- [ ] Buttons (all variants)
- [ ] Inputs (all types)

### Features
- [ ] Theme toggle works
- [ ] Theme persists on refresh
- [ ] No flash of wrong theme
- [ ] Smooth transitions
- [ ] Proper contrast everywhere
```

---

### Step 10: Accessibility Check

**Verify contrast ratios:**

```bash
# Use browser DevTools or tools like:
# - axe DevTools extension
# - Lighthouse accessibility audit
# - WAVE browser extension
```

**Ensure:**
- Text contrast ratio ≥ 4.5:1 (normal text)
- Text contrast ratio ≥ 3:1 (large text)
- Interactive element contrast ≥ 3:1
- Focus indicators visible in both themes

---

## Definition of Done

- [ ] Dark mode toggle in header works correctly
- [ ] Theme preference persists across sessions
- [ ] No flash of wrong theme on page load
- [ ] Login page fully supports dark mode
- [ ] Registration page fully supports dark mode
- [ ] Forgot/reset password pages support dark mode
- [ ] Dashboard supports dark mode
- [ ] Profile page supports dark mode
- [ ] Settings page supports dark mode
- [ ] All guide pages support dark mode
- [ ] All admin pages support dark mode
- [ ] Header supports dark mode
- [ ] Sidebar supports dark mode
- [ ] All UI components support dark mode
- [ ] Modals and dialogs support dark mode
- [ ] Toast notifications support dark mode
- [ ] Dropdowns and menus support dark mode
- [ ] Forms and inputs styled correctly in dark mode
- [ ] Proper text contrast in all pages (WCAG AA)
- [ ] Smooth theme transitions
- [ ] Images/logos appropriate for dark theme
- [ ] No console errors when toggling theme
- [ ] Build completes with no errors
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile and desktop
- [ ] Accessibility audit passed

---

## Related Files

**Modified:**
- `src/app/layout.tsx` - Theme provider setup
- `src/components/theme-provider.tsx` - Theme context and logic
- `src/components/layout/Header.tsx` - Theme toggle button
- `src/components/layout/Sidebar.tsx` - Dark mode styles
- `src/components/ui/*.tsx` - All UI components with dark mode classes
- `src/app/login/page.tsx` - Login page dark mode
- `src/app/register/page.tsx` - Register page dark mode
- `src/app/forgot-password/page.tsx` - Forgot password dark mode
- `src/app/reset-password/page.tsx` - Reset password dark mode
- `src/app/dashboard/index.tsx` - Dashboard dark mode
- `src/app/profile/index.tsx` - Profile dark mode
- `src/app/settings/index.tsx` - Settings dark mode
- `src/app/guides/**/*.tsx` - Guides pages dark mode
- `src/app/admin/**/*.tsx` - Admin pages dark mode
- `tailwind.config.js` - Dark mode configuration

**Reference:**
- Tailwind CSS Dark Mode Documentation
- WCAG Color Contrast Guidelines

---

## Estimated Effort

**Story Points:** 3

**Breakdown:**
- Audit current implementation: 30 min
- Fix theme provider & toggle: 45 min
- Configure Tailwind dark mode: 15 min
- Update authentication pages (4 pages): 60 min
- Update main pages (dashboard, profile, settings, guides): 60 min
- Update admin pages: 45 min
- Update layout components: 30 min
- Update UI component library (20+ components): 90 min
- Handle images/logos: 20 min
- Systematic testing of all pages: 60 min
- Accessibility audit and fixes: 30 min
- Visual QA and polish: 30 min

**Total:** ~8 hours

---

## Success Metrics

**User Experience:**
- Full dark mode support on every page
- Comfortable viewing in low-light environments
- Consistent theme across entire application
- Smooth, professional theme transitions

**Technical:**
- Theme persists correctly
- No visual bugs or flash issues
- WCAG AA contrast compliance
- Clean, maintainable dark mode implementation

**Accessibility:**
- All text readable in dark mode
- Focus states visible
- Interactive elements clearly distinguishable

---

## Testing Scenarios

### Happy Path - Toggle Dark Mode
1. User on dashboard (light mode)
2. User clicks dark mode toggle in header
3. **Expected:**
   - Theme switches to dark instantly
   - All elements render correctly
   - Toggle icon changes (moon → sun)
   - Smooth transition animation

### Happy Path - Theme Persistence
1. User enables dark mode
2. User closes browser
3. User reopens browser and navigates to site
4. **Expected:**
   - Dark mode still active
   - No flash of light theme
   - Theme loads before first paint

### Happy Path - Authentication Flow in Dark Mode
1. User visits /login in dark mode
2. Fills in credentials
3. Submits form
4. Redirected to dashboard
5. **Expected:**
   - All auth pages styled correctly
   - Forms clearly visible
   - Buttons work properly
   - Dashboard loads in dark mode

### Edge Case - System Preference
1. User has system set to dark mode
2. User visits site for first time
3. **Expected:**
   - Site respects system preference
   - Loads in dark mode automatically
   - User can override with toggle

### Edge Case - Mid-Flow Theme Change
1. User filling out multi-step form
2. User toggles dark mode mid-flow
3. **Expected:**
   - Form state preserved
   - All form elements styled correctly
   - No data loss
   - User can continue seamlessly

---

**Created:** November 9, 2025
**Author:** BMad Master
**Status:** Ready to Implement

