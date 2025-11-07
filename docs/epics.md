# Agenseek - Epic Breakdown

**Author:** Ben
**Date:** November 6, 2025
**Project Level:** Level 3 (Full-featured internal platform)
**Target Scale:** 100 internal users, 42 learning guides
**Timeline:** 15 weeks to launch

---

## Overview

This document provides the complete epic and story breakdown for Agenseek (BMAD Learning Hub), decomposing the requirements from the product brief, UX design specification, and technical architecture into implementable stories sized for single dev agent completion.

### Project Context

**Vision:** Make BMAD-METHOD accessible, engaging, and actionable for every employee through interactive, personalized learning.

**Core Value Propositions:**
1. **Personal Mentor Experience** - Role-based paths, progress tracking, gamification
2. **Community Learning** - Q&A, comments, knowledge sharing
3. **Smart Discovery** - Fuzzy search, command palette, role-based filtering

**Success Criteria:**
- 100% employee access within 3 months
- 70% complete core guides within 30 days
- Active use of notes, tasks, and community features
- "Office talk" buzz-worthy experience

### Epic Structure

This breakdown follows the 15-week roadmap with 10 epics organized by user value:

**Phase 1 - Foundation (Weeks 1-3):**
- Epic 1: Project Foundation & Infrastructure
- Epic 2: User Authentication & Personalized Onboarding

**Phase 2 - Content System (Weeks 4-6):**
- Epic 3: Dynamic Content Rendering System
- Epic 4: Guide Library & Discovery

**Phase 3 - Core Learning Features (Weeks 7-9):**
- Epic 5: Progress Tracking & Achievements
- Epic 6: Personal Learning Workspace (Notes & Tasks)

**Phase 4 - Search & Community (Weeks 10-11):**
- Epic 7: Global Search & Command Palette
- Epic 8: Community Features (Comments & Q&A)

**Phase 5 - Admin & Polish (Weeks 12-13):**
- Epic 9: Admin Analytics & Management
- Epic 10: Responsive Design & Accessibility

**Phase 6 - Testing & Launch (Weeks 14-15):**
- Covered across all epics via acceptance criteria and final testing story

---

## Epic 1: Project Foundation & Infrastructure

**Goal:** Establish the technical foundation that enables all subsequent development, including project structure, core dependencies, database schema, deployment pipeline, and design system.

**Business Value:** Without this foundation, no other features can be built. This epic creates the runway for rapid feature development.

**Duration:** Week 1

---

### Story 1.1: Initialize Vite + React + TypeScript Project

As a developer,
I want the project initialized with Vite, React 18, and TypeScript 5,
So that I have a modern, fast development environment with type safety.

**Acceptance Criteria:**

**Given** I want to start development
**When** I run `npm create vite@latest agenseek -- --template react-ts && cd agenseek && npm install`
**Then** the project initializes with:
- Vite 5.x configuration
- React 18.2.0
- TypeScript 5.x with strict mode
- Default project structure (src/, public/, index.html)
- Development server runs on port 5173
- Hot module replacement works

**And** when I run `npm run dev`, the app loads in browser without errors

**Prerequisites:** None (first story)

**Technical Notes:**
- Use exact command from architecture spec section 2
- Verify `tsconfig.json` has strict mode enabled
- Ensure `vite.config.ts` is present with React plugin
- Keep default Vite folder structure: src/App.tsx, src/main.tsx, src/vite-env.d.ts

---

### Story 1.2: Configure TailwindCSS with Emerald Theme

As a developer,
I want TailwindCSS configured with the Emerald Learning theme,
So that I can style components consistently using the design system.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I install and configure Tailwind with the custom theme
**Then**:
- TailwindCSS 3.4.x is installed
- PostCSS and Autoprefixer are configured
- `tailwind.config.js` includes:
  - Emerald color palette (#10B981 primary, #6EE7B7 secondary, #2DD4BF accent)
  - Arimo font family configuration
  - Dark mode class strategy
  - Custom spacing and border radius
  - tailwindcss-animate plugin
- `src/styles/globals.css` includes Tailwind directives
- `src/styles/themes.css` includes CSS variables for light/dark modes

**And** I can use `className="bg-primary text-white"` and see emerald background

**Prerequisites:** Story 1.1

**Technical Notes:**
- Follow architecture spec section 5.2 for exact color values
- Use `npx tailwindcss init -p` to generate config files
- Import Google Fonts for Arimo in index.html
- Set `<html dir="rtl" lang="he">` in index.html for Hebrew support

---

### Story 1.3: Install and Configure Shadcn/ui Component System

As a developer,
I want Shadcn/ui components available in the project,
So that I can use accessible, customizable UI primitives.

**Acceptance Criteria:**

**Given** Tailwind is configured
**When** I initialize Shadcn/ui
**Then**:
- Run `npx shadcn-ui@latest init`
- Answer prompts:
  - Style: Default
  - Base color: Slate
  - CSS variables: Yes
  - Directory: src/components/ui
  - Tailwind config: Yes
  - Import alias: @/components
- `components.json` is created
- Path alias `@/` is configured in `tsconfig.json` and `vite.config.ts`
- Can successfully add first component: `npx shadcn-ui@latest add button`

**And** I can import and use `<Button>` component from `@/components/ui/button`

**Prerequisites:** Story 1.2

**Technical Notes:**
- Use copy-paste model (components live in your codebase)
- Customize button variants in `button.tsx` to use emerald primary color
- Install these base components initially: button, card, input, label, dialog, toast

---

### Story 1.4: Install Core Dependencies

As a developer,
I want all required dependencies installed,
So that I can use routing, state management, animations, icons, and other essential libraries.

**Acceptance Criteria:**

**Given** the project foundation is set up
**When** I install dependencies listed in architecture spec
**Then** the following are installed and importable:
- **Routing:** react-router-dom 6.x
- **State:** zustand 4.x
- **Animations:** framer-motion 11.x
- **Icons:** @tabler/icons-react
- **Forms:** react-hook-form, zod, @hookform/resolvers
- **Rich Text:** @tiptap/react, @tiptap/starter-kit
- **Search:** fuse.js
- **Charts:** recharts
- **Dates:** date-fns
- **Backend:** @supabase/supabase-js
- **Dev Tools:** @types/node

**And** I can import any of these libraries without TypeScript errors

**Prerequisites:** Story 1.3

**Technical Notes:**
- Use exact versions from architecture spec section 2
- Run single command: `npm install [all packages]`
- Verify package.json includes all dependencies
- Run `npm run type-check` to ensure no type errors

---

### Story 1.5: Create Supabase Project and Configure Database

As a developer,
I want the Supabase backend configured with complete database schema,
So that I can store user data, progress, notes, tasks, and comments.

**Acceptance Criteria:**

**Given** I have a Supabase account
**When** I create a new project and run migrations
**Then**:
- New Supabase project created at supabase.com
- Project name: "agenseek"
- Region: closest to users
- Database password stored securely
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` added to `.env.local`
- Create `supabase/` directory with:
  - `migrations/001_initial_schema.sql` - all tables from architecture spec section 6.1
  - `migrations/002_indexes.sql` - all indexes
  - `migrations/003_rls_policies.sql` - all RLS policies
  - `migrations/004_functions_triggers.sql` - functions for auto-timestamps, comment counts

**And** running migrations creates all 9 tables (profiles, user_progress, user_notes, user_tasks, guide_comments, comment_votes, guide_stats, user_activity, guide_bookmarks)

**And** RLS is enabled on all tables with proper policies

**Prerequisites:** Story 1.1

**Technical Notes:**
- Follow complete SQL schema from product brief (lines 1342-1847)
- Use Supabase web interface to run migrations initially
- Generate TypeScript types: `supabase gen types typescript --project-id [id] > src/types/database.ts`
- Verify RLS policies prevent unauthorized access

---

### Story 1.6: Set Up Supabase Client and Auth Configuration

As a developer,
I want a configured Supabase client with authentication,
So that I can make type-safe queries and authenticate users.

**Acceptance Criteria:**

**Given** Supabase project is created
**When** I configure the Supabase client
**Then**:
- Create `src/lib/supabase.ts` with:
  - Import `createClient` from @supabase/supabase-js
  - Import `Database` type from @/types/database
  - Export configured client using env variables
  - Include error handling for missing env vars
- Create `src/lib/auth.ts` with:
  - `signUp(email, password)` function
  - `signIn(email, password)` function
  - `signOut()` function
  - `resetPassword(email)` function
- Create `src/hooks/useAuth.ts` with:
  - Hook that returns `{ user, isLoading, error }`
  - Listens to auth state changes
  - Updates on login/logout

**And** I can successfully call `supabase.from('profiles').select('*')` with type inference

**Prerequisites:** Story 1.5

**Technical Notes:**
- Follow pattern from architecture spec section 5.4
- Use TypeScript generics for type-safe queries
- Handle auth state changes with `supabase.auth.onAuthStateChange()`
- Store auth state in Zustand store for global access

---

### Story 1.7: Configure Routing with React Router

As a developer,
I want routing configured for all main pages,
So that users can navigate between authentication, dashboard, guides, notes, tasks, and admin pages.

**Acceptance Criteria:**

**Given** React Router is installed
**When** I configure routing
**Then**:
- Create `src/app/routes.tsx` with `createBrowserRouter`
- Define route structure:
  - `/` - Redirect to `/dashboard` if authenticated, else `/auth/login`
  - `/auth/login` - Login page
  - `/auth/register` - Registration page
  - `/auth/reset-password` - Password reset
  - `/onboarding` - Onboarding wizard
  - `/dashboard` - Main dashboard (protected)
  - `/guides` - Guides library (protected)
  - `/guides/:slug` - Individual guide reader (protected)
  - `/notes` - Notes management (protected)
  - `/tasks` - Tasks management (protected)
  - `/profile` - User profile (protected)
  - `/settings` - User settings (protected)
  - `/admin/*` - Admin pages (protected, admin-only)
- Create `src/components/common/ProtectedRoute.tsx`
- All protected routes check authentication

**And** navigating to `/dashboard` when not logged in redirects to `/auth/login`

**Prerequisites:** Story 1.6

**Technical Notes:**
- Use `RouterProvider` in main.tsx
- Implement ProtectedRoute using useAuth hook
- Use `<Outlet>` for nested routes
- Add 404 page for invalid routes

---

### Story 1.8: Create Base Layout Components

As a developer,
I want reusable layout components (Header, Sidebar, Footer),
So that all pages have consistent navigation and structure.

**Acceptance Criteria:**

**Given** routing is configured
**When** I create layout components
**Then**:
- Create `src/components/layout/Header.tsx`:
  - Logo (Agenseek branding)
  - Global search bar
  - Theme toggle (light/dark)
  - User menu (profile, settings, logout)
  - Sticky position
  - Responsive (hamburger menu on mobile)
- Create `src/components/layout/Sidebar.tsx`:
  - Navigation links (Dashboard, Guides, Notes, Tasks)
  - Active state highlighting
  - Collapsible on mobile
  - RTL support
- Create `src/components/layout/Footer.tsx`:
  - Copyright info
  - Links to help/support
- Create `src/app/layout.tsx`:
  - Combines Header + Sidebar + main content area + Footer
  - Uses `<Outlet>` from React Router

**And** all protected pages use this layout automatically

**Prerequisites:** Story 1.7

**Technical Notes:**
- Use Shadcn/ui components (Button, DropdownMenu)
- Header height: 64px, Sidebar width: 256px
- Add Framer Motion transitions for sidebar collapse
- Use Tabler Icons for all icons (no emojis)

---

### Story 1.9: Configure Vercel Deployment

As a developer,
I want the app deployable to Vercel,
So that I can continuously deploy to production and preview environments.

**Acceptance Criteria:**

**Given** the foundation is complete
**When** I configure Vercel deployment
**Then**:
- Create `vercel.json`:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Framework: vite
  - SPA rewrites to index.html
  - Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Connect GitHub repository to Vercel
- Configure environment variables in Vercel dashboard:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Set up automatic deployments:
  - `main` branch → production
  - `develop` branch → preview
  - Pull requests → preview URLs

**And** pushing to `main` triggers production deployment successfully

**Prerequisites:** Story 1.8

**Technical Notes:**
- Follow deployment config from architecture spec section 12.1
- Use Vercel CLI for initial setup: `vercel --prod`
- Test preview deployments with PR before merging
- Verify environment variables are set correctly

---

### Story 1.10: Set Up Development Scripts and Code Quality Tools

As a developer,
I want code quality tools configured (linting, formatting, type checking),
So that code is consistent and catches errors early.

**Acceptance Criteria:**

**Given** the project is set up
**When** I configure code quality tools
**Then**:
- ESLint is configured with TypeScript rules
- Prettier is configured for code formatting
- `package.json` includes scripts:
  - `dev` - Start dev server
  - `build` - Build for production
  - `preview` - Preview production build
  - `lint` - Run ESLint
  - `lint:fix` - Auto-fix linting issues
  - `type-check` - Run TypeScript type checking
  - `format` - Run Prettier
- Create `.prettierrc.json` with:
  - Semi: true
  - Single quotes: true
  - Tab width: 2
  - Trailing comma: es5
- VS Code workspace settings recommend extensions

**And** running `npm run lint` shows no errors

**And** running `npm run type-check` shows no type errors

**Prerequisites:** Story 1.9

**Technical Notes:**
- Use ESLint recommended + React + TypeScript configs
- Add `.prettierignore` for dist/ and node_modules/
- Create `.vscode/extensions.json` with recommended extensions
- Run `npm run format` before committing

---

## Epic 2: User Authentication & Personalized Onboarding

**Goal:** Enable users to securely create accounts, log in, and complete a personalized onboarding wizard that generates role-based learning paths.

**Business Value:** First impression that makes users feel the platform is built specifically for them. Personalized paths drive engagement and reduce overwhelm.

**Duration:** Weeks 2-3

---

### Story 2.1: Build Login Page

As a user,
I want to log in with my email and password,
So that I can access my personalized learning experience.

**Acceptance Criteria:**

**Given** I am on the login page (`/auth/login`)
**When** I enter valid credentials and click "התחבר" (Login)
**Then**:
- Form includes:
  - Email input (type="email", required)
  - Password input (type="password", required, min 8 chars)
  - "Remember me" checkbox
  - "Login" button (primary emerald)
  - "Forgot password?" link
  - "Don't have an account? Register" link
- Client-side validation with Zod schema
- Form uses React Hook Form
- On success: Redirect to `/dashboard`
- On error: Show toast notification with error message
- Loading state: Button shows spinner and disables

**And** I can see my authentication state persists across page refreshes

**Prerequisites:** Epic 1 complete

**Technical Notes:**
- Use `src/lib/auth.ts` signIn function
- Form validation pattern from architecture spec section 8.5
- Hebrew labels and error messages
- Implement loading state with isSubmitting from React Hook Form
- Use Shadcn/ui Input, Button, Label components

---

### Story 2.2: Build Registration Page

As a new user,
I want to register for an account with email verification,
So that I can start learning BMAD.

**Acceptance Criteria:**

**Given** I am on the registration page (`/auth/register`)
**When** I fill out the form and submit
**Then**:
- Form includes:
  - Display name input (required, 2-50 chars)
  - Email input (required, valid email)
  - Password input (required, min 8 chars with complexity)
  - Confirm password input (must match)
  - "Register" button
  - "Already have account? Login" link
- Password strength indicator shows weak/medium/strong
- Zod validation enforces:
  - Password contains uppercase, lowercase, number
  - Passwords match
  - Email format valid
- On success:
  - Account created in Supabase Auth
  - Profile created in profiles table
  - Email verification sent
  - Redirect to email verification notice page
- On error: Show specific error (email already exists, weak password, etc.)

**And** I receive a verification email with link

**Prerequisites:** Story 2.1

**Technical Notes:**
- Use `signUp` from auth.ts
- Password strength: use zxcvbn library or custom regex
- Create profile with `completed_onboarding: false`
- Email verification required before full access
- Display name defaults to part before @ in email

---

### Story 2.3: Build Password Reset Flow

As a user who forgot my password,
I want to reset my password via email link,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the forgot password page (`/auth/reset-password`)
**When** I enter my email and submit
**Then**:
- Form includes email input and "Send Reset Link" button
- On submit: Supabase sends password reset email
- Show success message: "Check your email for reset link"
- Reset email contains link to `/auth/reset-password?token=xxx`
- When clicking link:
  - Page shows "New Password" and "Confirm Password" fields
  - On submit: Password is updated
  - Show success toast
  - Redirect to login page

**And** I can log in with my new password

**Prerequisites:** Story 2.2

**Technical Notes:**
- Use `supabase.auth.resetPasswordForEmail()`
- Handle token validation automatically by Supabase
- Update password: `supabase.auth.updateUser({ password: newPassword })`
- Password complexity same as registration

---

### Story 2.4: Build Google OAuth Integration

As a user,
I want to sign in with my Google account,
So that I can access the platform without creating a new password.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Sign in with Google" button
**Then**:
- Button shows Google logo and "Sign in with Google" text
- Clicking triggers OAuth flow
- Redirects to Google consent screen
- After consent, redirects back to `/auth/callback`
- If first login: Profile created automatically with Google email
- If returning user: Logs in directly
- Redirects to `/onboarding` if not completed, else `/dashboard`

**And** my Google profile picture is used as avatar (optional enhancement)

**Prerequisites:** Story 2.3

**Technical Notes:**
- Configure Google OAuth in Supabase dashboard
- Use `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirect URL: `${window.location.origin}/auth/callback`
- Create callback page that handles auth code exchange
- Extract display name from Google profile if available

---

### Story 2.5: Build Onboarding Wizard - Step 1 (Welcome)

As a new user completing registration,
I want a welcoming introduction to the platform,
So that I understand what Agenseek offers and feel excited to start.

**Acceptance Criteria:**

**Given** I just registered and `completed_onboarding` is false
**When** I am redirected to `/onboarding`
**Then**:
- Full-screen wizard with progress dots (1/5 active)
- Large welcome message: "ברוכים הבאים ל-Agenseek!" (Welcome to Agenseek!)
- Animated illustration or icon (Framer Motion fade-in)
- Brief description: "Your personalized BMAD learning journey starts here"
- Primary button: "Let's personalize your journey"
- Secondary link: "I'll do this later" (goes to dashboard with default path)
- Cannot go back (no back button)

**And** clicking primary button advances to Step 2

**Prerequisites:** Story 2.4

**Technical Notes:**
- Create `src/app/onboarding/wizard.tsx`
- Use Framer Motion for page transitions
- Store step state locally (useState) since wizard is single-page
- Progress dots component shows 1/5, 2/5, etc.
- Use Tabler Icons for decorative elements

---

### Story 2.6: Build Onboarding Wizard - Step 2 (Select Role)

As a new user in the onboarding wizard,
I want to select my role,
So that the platform can recommend relevant content for my job function.

**Acceptance Criteria:**

**Given** I am on Step 2 of onboarding
**When** I select my role
**Then**:
- Progress dots show 2/5 active
- Heading: "What's your role?"
- 9 role cards in responsive grid (3x3 on desktop, 2x2 on tablet, 1x1 on mobile):
  - 💻 Developer
  - 📊 Product Manager
  - 🎨 UX/UI Designer
  - 🏗️ Architect
  - 📋 Project Manager
  - 🧪 QA Engineer
  - 👔 Executive
  - 🎮 Game Developer
  - 💡 Non-Technical
- Each card shows icon, title, short description (2 lines)
- Single selection: Clicking highlights card (emerald border, scale animation)
- "Next" button disabled until selection made
- "Back" button returns to Step 1
- Selection stored in local state

**And** clicking "Next" advances to Step 3 with selected role stored

**Prerequisites:** Story 2.5

**Technical Notes:**
- Role cards use Framer Motion whileHover and whileTap
- Selected card: border-2 border-primary, scale(1.05)
- Use Tabler Icons for role icons
- Mobile: Cards stack vertically
- Store selection in component state, save to DB at end of wizard

---

### Story 2.7: Build Onboarding Wizard - Step 3 (Select Interests)

As a new user in the onboarding wizard,
I want to select my learning interests,
So that I receive personalized guide recommendations.

**Acceptance Criteria:**

**Given** I am on Step 3 of onboarding
**When** I select multiple interests
**Then**:
- Progress dots show 3/5 active
- Heading: "What interests you?"
- 8 interest topic chips (multi-select):
  - Agents & Workflows
  - Architecture & Design
  - Implementation & Development
  - Testing & Quality
  - Game Development
  - Creative Processes
  - Team Collaboration
  - Project Management
- Chips are toggleable (click to select/deselect)
- Selected chips: filled emerald background, white text
- Unselected chips: outlined, no fill
- Can select 0 to all 8 (no minimum required)
- "Next" button always enabled
- "Back" button returns to Step 2

**And** clicking "Next" advances to Step 4 with interests stored

**Prerequisites:** Story 2.6

**Technical Notes:**
- Use Shadcn/ui Badge component styled as chips
- Toggle animation: scale + background color transition
- Store as array of selected topic strings
- Use flexbox with wrap for responsive layout

---

### Story 2.8: Build Onboarding Wizard - Step 4 (Experience Level)

As a new user in the onboarding wizard,
I want to indicate my experience level,
So that content difficulty matches my skill level.

**Acceptance Criteria:**

**Given** I am on Step 4 of onboarding
**When** I select my experience level
**Then**:
- Progress dots show 4/5 active
- Heading: "What's your experience level with BMAD?"
- 3 large cards (single selection):
  - **Beginner:** "New to BMAD, need step-by-step guidance"
  - **Intermediate:** "Some exposure, ready to dive deeper"
  - **Advanced:** "Experienced, looking for advanced topics"
- Each card shows icon, title, description
- Hover: card lifts slightly (Framer Motion)
- Selected: emerald border and background tint
- "Next" button disabled until selection
- "Back" button returns to Step 3

**And** clicking "Next" advances to Step 5

**Prerequisites:** Story 2.7

**Technical Notes:**
- Cards use Framer Motion whileHover with y:-4 transform
- Selected state: border-2 border-primary, bg-primary/5
- Store as enum: 'beginner' | 'intermediate' | 'advanced'

---

### Story 2.9: Build Onboarding Wizard - Step 5 (Learning Path Generated)

As a new user completing the onboarding wizard,
I want to see my personalized learning path generated,
So that I know exactly which guides to read first.

**Acceptance Criteria:**

**Given** I am on Step 5 after selecting role, interests, and level
**When** the learning path is generated
**Then**:
- Progress dots show 5/5 active
- Animated "building your path" loader shows for 2 seconds
- After loader, guides appear with stagger animation:
  - **Core (2 guides):** "Essential for everyone" - Quick Start, Glossary
  - **Recommended (5-7 guides):** "Based on your role: {selected_role}"
  - **Interests (5-10 guides):** "You selected: {interests}"
  - **Optional (remaining):** "Explore when ready"
- Each guide shows:
  - Icon, title, estimated reading time
  - Progress bar at 0%
- Primary button: "Start Learning!" → saves preferences and goes to dashboard
- Secondary button: "Browse All Guides" → goes to guides library

**And** clicking "Start Learning!" saves all onboarding data to profile:
- `role`, `interests[]`, `experience_level`
- `completed_onboarding: true`
- `onboarded_at: NOW()`

**And** success toast: "Welcome! Your path is ready 🎉"

**Prerequisites:** Story 2.8

**Technical Notes:**
- Use Framer Motion stagger children for guide list reveal
- Learning path algorithm:
  - Core: Always include quick-start and glossary
  - Recommended: Filter guides where metadata.roles includes selected role
  - Interests: Filter guides where metadata.tags match interests
  - Optional: All remaining guides
- Save to DB: `supabase.from('profiles').update({ role, interests, experience_level, completed_onboarding: true, onboarded_at: new Date() }).eq('id', user.id)`
- Confetti animation on "Start Learning!" click

---

### Story 2.10: Implement Protected Routes and Onboarding Redirect Logic

As a system,
I want to automatically redirect users based on their onboarding status,
So that new users complete onboarding before accessing the platform.

**Acceptance Criteria:**

**Given** a user logs in
**When** authentication succeeds
**Then**:
- Check `profiles.completed_onboarding` flag
- If `false`: Redirect to `/onboarding`
- If `true`: Redirect to intended route or `/dashboard`
- All protected routes check authentication:
  - Not authenticated → redirect to `/auth/login`
  - Authenticated but not onboarded → redirect to `/onboarding`
  - Authenticated and onboarded → allow access

**And** users cannot manually navigate to `/onboarding` after completing it (redirect to dashboard)

**And** logout clears auth state and redirects to login

**Prerequisites:** Story 2.9

**Technical Notes:**
- Enhance `ProtectedRoute` component to check onboarding status
- Use `useAuth` hook to get user and profile data
- Fetch profile on login: `supabase.from('profiles').select('*').eq('id', user.id).single()`
- Store profile in Zustand auth store
- Implement route guards in router configuration

---

### Story 2.11: Comprehensive Hebrew Localization for Authentication Flows

As a Hebrew-speaking user,
I want all authentication-related content (login, registration, password reset, OAuth) fully translated to Hebrew,
So that I can use the authentication system in my native language with complete clarity.

**Acceptance Criteria:**

**Given** I am using any authentication page
**When** I view the interface
**Then**:
- Login Page (`/auth/login`):
  - Form labels: "אימייל" (Email), "סיסמה" (Password)
  - Buttons: "התחבר" (Login), "זכור אותי" (Remember me)
  - Links: "שכחת סיסמה?" (Forgot password?), "אין לך חשבון? הירשם" (Don't have an account? Register)
  - Placeholders: "הזן את האימייל שלך" (Enter your email), "הזן סיסמה" (Enter password)
- Registration Page (`/auth/register`):
  - Form labels: "שם מלא" (Full name), "אימייל" (Email), "סיסמה" (Password), "אמת סיסמה" (Confirm password)
  - Button: "הירשם" (Register)
  - Link: "כבר יש לך חשבון? התחבר" (Already have an account? Login)
  - Password strength: "חלשה" (Weak), "בינונית" (Medium), "חזקה" (Strong)
- Password Reset Page (`/auth/reset-password`):
  - Heading: "איפוס סיסמה" (Reset Password)
  - Label: "אימייל" (Email)
  - Button: "שלח קישור לאיפוס" (Send reset link)
  - Success message: "בדוק את האימייל שלך לקבלת קישור לאיפוס" (Check your email for reset link)
- OAuth Button:
  - Text: "התחבר עם Google" (Sign in with Google)
- Error messages in Hebrew:
  - "אימייל או סיסמה שגויים" (Invalid email or password)
  - "האימייל כבר קיים" (Email already exists)
  - "הסיסמאות לא תואמות" (Passwords don't match)
  - "הסיסמה חייבת להכיל לפחות 8 תווים" (Password must be at least 8 characters)

**And** all validation error messages appear in Hebrew
**And** all success toast notifications appear in Hebrew
**And** loading states show Hebrew text: "טוען..." (Loading...)

**Prerequisites:** Story 2.4

**Technical Notes:**
- Extend `src/lib/locale/he.ts` with auth section
- Create validation schemas with Hebrew error messages using Zod
- Update all auth-related components to use locale strings
- Ensure RTL layout works correctly with form layouts
- Test all error states with Hebrew messages
- Update toast notifications to use Hebrew locale

---

### Story 2.12: Account Deletion Feature

As a user,
I want to permanently delete my account and all associated data,
So that I can exercise my right to be forgotten and remove my personal information from the platform.

**Acceptance Criteria:**

**Given** I am logged in and navigate to account settings
**When** I want to delete my account
**Then**:
- Settings page (`/settings`) includes "מחיקת חשבון" (Delete Account) section
- Section displays warning:
  - "אזהרה: פעולה זו בלתי הפיכה" (Warning: This action is irreversible)
  - "כל הנתונים שלך יימחקו לצמיתות" (All your data will be permanently deleted)
  - List of what will be deleted:
    - "פרופיל המשתמש" (User profile)
    - "התקדמות בלמידה" (Learning progress)
    - "הערות ומשימות" (Notes and tasks)
    - "תגובות ושאלות" (Comments and questions)
    - "סימניות והישגים" (Bookmarks and achievements)
- "מחק את החשבון שלי" (Delete My Account) button in red
- Clicking button opens confirmation dialog:
  - Title: "האם אתה בטוח?" (Are you sure?)
  - Message: "פעולה זו תמחק את כל הנתונים שלך ולא ניתן לשחזרם" (This will delete all your data and cannot be undone)
  - Input field: "הקלד 'מחק' כדי לאשר" (Type 'DELETE' to confirm)
  - Buttons: "ביטול" (Cancel), "מחק לצמיתות" (Delete Permanently)
- Typing "מחק" or "DELETE" (case-insensitive) enables delete button
- On confirmation:
  - Show loading state: "מוחק חשבון..." (Deleting account...)
  - Execute deletion transaction:
    1. Delete from `user_activity` where user_id = current user
    2. Delete from `guide_bookmarks` where user_id = current user
    3. Delete from `comment_votes` where user_id = current user
    4. Delete from `guide_comments` where user_id = current user
    5. Delete from `user_tasks` where user_id = current user
    6. Delete from `user_notes` where user_id = current user
    7. Delete from `user_progress` where user_id = current user
    8. Delete from `profiles` where id = current user
    9. Delete from Supabase Auth: `supabase.auth.admin.deleteUser()`
  - Log out user immediately
  - Show farewell toast: "החשבון נמחק בהצלחה. להתראות!" (Account deleted successfully. Goodbye!)
  - Redirect to home page

**And** deleted accounts cannot be recovered
**And** email becomes available for new registration after 30 days (optional grace period)

**Prerequisites:** Story 2.10, Epic 1 complete

**Technical Notes:**
- Create `/settings/account` page with delete section
- Implement cascading deletion using Supabase transaction
- Use Supabase RLS policies to ensure users can only delete their own data
- Consider soft delete option (mark as deleted, purge after 30 days) vs hard delete
- Log deletion event before removing data for audit trail
- Ensure proper error handling if deletion fails mid-transaction
- Test foreign key constraints are handled correctly
- Add rate limiting to prevent abuse
- Consider adding "Download my data" option before deletion (GDPR compliance)

---

## Epic 3: Dynamic Content Rendering System

**Goal:** Build a flexible JSON-based content system that can render 14 different block types (headings, text, code, callouts, charts, etc.) to display rich, interactive learning guides.

**Business Value:** Enables guides to be more than static text - interactive accordions, syntax-highlighted code, data visualizations create engaging learning experiences.

**Duration:** Week 4

---

### Story 3.1: Define TypeScript Types for Content Blocks

As a developer,
I want comprehensive TypeScript types for all 14 content block types,
So that content is type-safe and validated at compile time.

**Acceptance Criteria:**

**Given** I need to render dynamic content
**When** I create type definitions
**Then** `src/content/schemas/component.types.ts` includes:
- Base interface `ContentBlock` with discriminated union
- 14 block type interfaces:
  - `HeadingBlock` - level (1-6), text, id
  - `TextBlock` - content (markdown string)
  - `ListBlock` - ordered (boolean), items (string[] or nested blocks)
  - `CodeBlock` - language, code, filename?, showLineNumbers?, highlightLines?[]
  - `CalloutBlock` - variant (info|warning|success|error), icon?, title?, content
  - `TableBlock` - caption?, headers[], rows[][], align?[]
  - `ChartBlock` - chartType, title?, data[], xKey, yKey, labels
  - `DiagramBlock` - diagramType (mermaid), code
  - `AccordionBlock` - allowMultiple?, items[]
  - `TabsBlock` - defaultTab, items[]
  - `GridBlock` - columns (1-4), gap?, items[]
  - `CardBlock` - variant?, icon?, title?, description?, content?, footer?
  - `ImageBlock` - src, alt, caption?, width?, height?
  - `VideoBlock` - url, title?, aspectRatio?

**And** `src/content/schemas/guide.types.ts` defines:
- `GuideMetadata` - id, title, description, category, difficulty, estimatedMinutes, icon, tags
- `ToCEntry` - id, title, level
- `Guide` - metadata, tableOfContents, content (ContentBlock[])

**Prerequisites:** Epic 2 complete

**Technical Notes:**
- Use TypeScript 5 discriminated unions
- Export all types from single index file
- Follow architecture spec section 6.4 for exact structure
- Add JSDoc comments for each type

---

### Story 3.2: Build Content Renderer Orchestrator

As a developer,
I want a main ContentRenderer component that dispatches to specific block components,
So that JSON content blocks are rendered correctly.

**Acceptance Criteria:**

**Given** I have JSON guide content
**When** I pass content blocks to ContentRenderer
**Then**:
- Create `src/components/content/ContentRenderer.tsx`
- Accepts `blocks: ContentBlock[]` prop
- Maps over blocks and switches on block.type
- Renders corresponding block component for each type
- Passes block-specific props to each component
- Includes error boundary for invalid blocks
- Returns fallback UI for unknown block types

**And** rendering a guide with mixed block types displays all blocks correctly

**Prerequisites:** Story 3.1

**Technical Notes:**
- Use switch statement or object map for block type dispatch
- Wrap in ErrorBoundary to catch render errors
- Log warnings for unsupported block types
- Key each block by index (or block.id if available)

---

### Story 3.3: Build Core Block Components (Heading, Text, List)

As a developer,
I want basic block components for headings, paragraphs, and lists,
So that I can render standard text content.

**Acceptance Criteria:**

**Given** ContentRenderer dispatches to block components
**When** rendering heading, text, or list blocks
**Then**:
- **HeadingBlock** (`src/components/content/blocks/HeadingBlock.tsx`):
  - Renders `<h1>` through `<h6>` based on level
  - Applies id attribute for ToC linking
  - Uses Tailwind typography classes
  - RTL-aware text alignment
- **TextBlock** (`src/components/content/blocks/TextBlock.tsx`):
  - Renders markdown inline formatting (bold, italic, links)
  - Uses `react-markdown` or similar for safe markdown rendering
  - Applies body text styles
- **ListBlock** (`src/components/content/blocks/ListBlock.tsx`):
  - Renders `<ol>` or `<ul>` based on ordered prop
  - Supports nested lists (recursive rendering)
  - Applies proper indentation and markers

**And** a guide with these blocks renders readable content

**Prerequisites:** Story 3.2

**Technical Notes:**
- Install `react-markdown` for markdown inline rendering
- Use semantic HTML (h1-h6, p, ul, ol, li)
- Apply Tailwind typography plugin classes
- Heading IDs: slugify text for URL-safe anchors

---

### Story 3.4: Build Code Block Component with Syntax Highlighting

As a developer,
I want code blocks with syntax highlighting and copy button,
So that code examples are readable and easily copyable.

**Acceptance Criteria:**

**Given** a guide contains code examples
**When** rendering CodeBlock
**Then**:
- Create `src/components/content/blocks/CodeBlock.tsx`
- Uses `react-syntax-highlighter` or Prism for syntax highlighting
- Supports languages: typescript, javascript, python, bash, sql, json, html, css
- Shows language badge in top-right corner
- Optional filename shown above code block
- Optional line numbers on left (if showLineNumbers: true)
- Optional highlighted lines (if highlightLines provided)
- Copy button in top-right:
  - Icon: clipboard (Tabler IconCopy)
  - On click: copies code to clipboard
  - Shows success feedback (icon changes to checkmark for 2s)
- Dark theme-aware (uses appropriate syntax theme)

**And** clicking copy button successfully copies code to clipboard

**Prerequisites:** Story 3.3

**Technical Notes:**
- Use `react-syntax-highlighter` with Prism highlighter
- Theme: `oneDark` for dark mode, `oneLight` for light mode
- Copy to clipboard: `navigator.clipboard.writeText()`
- Toast notification on copy: "Code copied!"
- Monospace font: JetBrains Mono from Tailwind config

---

### Story 3.5: Build Callout Block Component

As a content creator,
I want callout boxes for important information, tips, warnings, and errors,
So that critical information stands out visually.

**Acceptance Criteria:**

**Given** a guide needs to highlight important information
**When** rendering CalloutBlock
**Then**:
- Create `src/components/content/blocks/CalloutBlock.tsx`
- Supports 4 variants:
  - **info** - blue background, info icon (IconInfoCircle)
  - **warning** - yellow/amber background, warning icon (IconAlertTriangle)
  - **success** - green background, checkmark icon (IconCircleCheck)
  - **error** - red background, error icon (IconAlertCircle)
- Structure:
  - Left border (4px, variant color)
  - Icon in top-left (variant color)
  - Optional title (bold)
  - Content (can be text or nested blocks)
- Rounded corners, padding, subtle background tint

**And** each variant has distinct visual styling matching semantic meaning

**Prerequisites:** Story 3.4

**Technical Notes:**
- Use Shadcn/ui Alert component as base
- Customize with Tailwind variant classes
- Color mapping:
  - info: blue-500, bg-blue-50 dark:bg-blue-950
  - warning: amber-500, bg-amber-50 dark:bg-amber-950
  - success: green-500, bg-green-50 dark:bg-green-950
  - error: red-500, bg-red-50 dark:bg-red-950
- Content can contain markdown text or ContentBlock[]

---

### Story 3.6: Build Table Block Component

As a content creator,
I want responsive tables in guides,
So that structured data is clearly presented.

**Acceptance Criteria:**

**Given** a guide contains tabular data
**When** rendering TableBlock
**Then**:
- Create `src/components/content/blocks/TableBlock.tsx`
- Renders semantic HTML table: `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- Optional caption above table
- Headers in bold with background tint
- Rows alternate background colors (zebra striping)
- Supports column alignment: left, center, right
- Responsive behavior:
  - Desktop: Normal table
  - Mobile: Horizontal scroll or stacked layout
- Bordered cells, proper padding

**And** tables are readable and scrollable on mobile devices

**Prerequisites:** Story 3.5

**Technical Notes:**
- Use Tailwind table classes: `table-auto`, `border-collapse`
- Zebra striping: `odd:bg-gray-50 dark:odd:bg-gray-900`
- Mobile: Wrap in `<div class="overflow-x-auto">`
- Text alignment via props: `align={['left', 'center', 'right']}`

---

### Story 3.7: Build Accordion Block Component

As a content creator,
I want collapsible accordion sections,
So that long content can be organized and users can expand sections as needed.

**Acceptance Criteria:**

**Given** a guide has long sections that benefit from collapsing
**When** rendering AccordionBlock
**Then**:
- Create `src/components/content/blocks/AccordionBlock.tsx`
- Uses Shadcn/ui Accordion component
- Supports multiple items (each with title and content)
- Optional `allowMultiple` prop:
  - If true: Multiple sections can be open simultaneously
  - If false: Opening one closes others
- Each item:
  - Clickable header with title and chevron icon
  - Content area that expands/collapses with animation
  - Optional icon next to title
- Smooth height animation on expand/collapse

**And** clicking accordion headers toggles expand/collapse state

**Prerequisites:** Story 3.6

**Technical Notes:**
- Use Shadcn/ui Accordion with Radix UI primitives
- Framer Motion for height animations
- Chevron rotates 180deg when expanded
- Content can be nested ContentBlock[]

---

### Story 3.8: Build Tabs Block Component

As a content creator,
I want tabbed content sections,
So that related information can be organized without overwhelming the page.

**Acceptance Criteria:**

**Given** a guide has related content that fits in tabs
**When** rendering TabsBlock
**Then**:
- Create `src/components/content/blocks/TabsBlock.tsx`
- Uses Shadcn/ui Tabs component
- Structure:
  - Tab list (horizontal) with tab triggers
  - Tab content panels (only active tab visible)
- Each tab:
  - Label (required)
  - Optional icon (Tabler)
  - Content (ContentBlock[])
- Default tab specified in block config
- Active tab highlighted with emerald underline
- Keyboard navigation: arrow keys switch tabs

**And** clicking tabs switches content panels smoothly

**Prerequisites:** Story 3.7

**Technical Notes:**
- Use Shadcn/ui Tabs with Radix UI
- Active tab: border-b-2 border-primary
- Content transition: fade in/out with Framer Motion
- Mobile: Tabs scroll horizontally if too many

---

### Story 3.9: Build Chart Block Component

As a content creator,
I want data visualization charts,
So that quantitative information is presented visually.

**Acceptance Criteria:**

**Given** a guide contains data that benefits from visualization
**When** rendering ChartBlock
**Then**:
- Create `src/components/content/blocks/ChartBlock.tsx`
- Uses Recharts library
- Supports chart types:
  - Line chart
  - Bar chart
  - Area chart
  - Pie chart
- Props:
  - data: array of objects
  - xKey, yKey: data keys
  - xLabel, yLabel: axis labels
  - color: chart color (defaults to primary emerald)
  - showLegend, showGrid: boolean flags
- Responsive sizing (full width of container)
- Tooltip on hover showing values

**And** charts are interactive and display data clearly

**Prerequisites:** Story 3.8

**Technical Notes:**
- Import specific chart from Recharts: `LineChart`, `BarChart`, etc.
- Use primary color for chart lines/bars by default
- ResponsiveContainer wraps chart for responsiveness
- Tooltip component from Recharts with custom styling

---

### Story 3.10: Build Remaining Block Components (Grid, Card, Image, Video)

As a developer,
I want the final block components for layout and media,
So that all 14 content block types are supported.

**Acceptance Criteria:**

**Given** I need layout and media blocks
**When** implementing the remaining components
**Then**:
- **GridBlock** (`blocks/GridBlock.tsx`):
  - Responsive CSS grid with 1-4 columns
  - Gap prop: sm (0.5rem), md (1rem), lg (1.5rem)
  - Items are nested ContentBlock[]
- **CardBlock** (`blocks/CardBlock.tsx`):
  - Shadcn/ui Card wrapper
  - Variants: default, bordered, elevated
  - Optional icon, title, description
  - Optional header, body (content), footer sections
- **ImageBlock** (`blocks/ImageBlock.tsx`):
  - `<img>` with src, alt (required)
  - Optional caption below image
  - Optional width/height constraints
  - Lazy loading (`loading="lazy"`)
  - Rounded corners
- **VideoBlock** (`blocks/VideoBlock.tsx`):
  - Embedded video (iframe or video element)
  - 16:9 or 4:3 aspect ratio
  - Responsive container
  - Optional title above video

**And** all 14 content block types render correctly

**Prerequisites:** Story 3.9

**Technical Notes:**
- Grid: Use CSS Grid with `grid-cols-{n}` from Tailwind
- Card: Extend Shadcn/ui Card with custom variants
- Image: Consider using Next.js Image component patterns for optimization
- Video: Wrap in aspect-ratio container for responsiveness

---

## Epic 4: Guide Library & Discovery

**Goal:** Build a comprehensive guides library with visual card grid, filtering, searching, and individual guide reader with 3-panel layout and table of contents.

**Business Value:** Users can easily discover relevant guides and enjoy a beautiful, distraction-free reading experience. Progress tracking creates sense of achievement.

**Duration:** Weeks 5-6

---

### Story 4.1: Create Guide JSON Content Catalog

As a developer,
I want a central catalog of all 42 guides,
So that the application knows what content exists and can load guides dynamically.

**Acceptance Criteria:**

**Given** I need to list all available guides
**When** I create the content catalog
**Then**:
- Create `src/content/locale/he/guides/index.json`
- Contains array of guide metadata (not full content):
  - id (slug)
  - title
  - description (2-3 sentences)
  - category (core, roles, agents, workflows, practical, faq, onboarding)
  - difficulty (beginner, intermediate, advanced)
  - estimatedMinutes
  - icon (Tabler icon name)
  - tags (array of strings)
  - path (relative path to guide JSON file)
- All 42 guides listed:
  - 2 core guides
  - 9 role guides
  - 8 agent guides
  - 10 workflow guides
  - 9 practical guides
  - 6 FAQ guides
  - 3 onboarding guides

**And** I can import and use this catalog to render guide lists

**Prerequisites:** Epic 3 complete

**Technical Notes:**
- This is metadata only, not full guide content
- Actual guide content files created in Story 4.2
- Category colors for visual differentiation:
  - core: emerald
  - roles: purple
  - agents: blue
  - workflows: teal
  - practical: orange
  - faq: yellow
  - onboarding: green

---

### Story 4.2: Migrate Sample Guide Content to JSON

As a developer,
I want at least 3 sample guides converted from markdown to JSON,
So that I can test the content rendering system with real content.

**Acceptance Criteria:**

**Given** I have markdown guides in `original-data/learning-guides-hebrew/`
**When** I convert sample guides to JSON
**Then**:
- Convert these 3 guides to JSON:
  - `00-התחלה-מהירה-לכולם.md` → `src/content/locale/he/guides/core/quick-start.json`
  - `roles/מפתחים-ומפתחות.md` → `src/content/locale/he/guides/roles/developers.json`
  - `02-agents-part-1a-intro-pm-analyst.md` → `src/content/locale/he/guides/agents/intro-pm-analyst.json`
- Each JSON file contains:
  - metadata (id, title, description, category, etc.)
  - tableOfContents (auto-generated from headings)
  - content (array of ContentBlock objects)
- Use variety of block types (headings, text, lists, callouts, code, accordions)
- Manually convert for now (automated script in later story)

**And** guides render correctly in ContentRenderer with all block types working

**Prerequisites:** Story 4.1

**Technical Notes:**
- Follow Guide type from component.types.ts
- Break long paragraphs into separate TextBlocks
- Use AccordionBlock for collapsible sections
- Use CalloutBlock for important notes
- Generate heading IDs by slugifying Hebrew text (use transliteration or IDs)

---


### Story 4.3: Build Guide Card Component

As a user,
I want visually appealing guide cards with category colors and metadata,
So that I can quickly identify and select guides to read.

**Acceptance Criteria:**

**Given** I am viewing the guides library
**When** rendering guide cards
**Then**:
- Create src/components/guides/GuideCard.tsx
- Visual Card Grid layout (from UX spec Direction #3)
- Structure:
  - Gradient header (180px height) with large Tabler Icon
  - Card body with title, description (2 lines, truncated)
  - Badge row: category badge + difficulty badge
  - Footer: estimated time + progress indicator
  - Action button: "Start Reading" or "Continue" with progress %
- Category-specific gradient colors:
  - core: emerald gradient
  - roles: purple gradient
  - agents: blue gradient
  - workflows: teal gradient
  - practical: orange gradient
  - faq: yellow gradient
- Hover effect: Card lifts (translateY:-4px) with emerald glow shadow
- Framer Motion animations on hover

**And** clicking card navigates to guide reader page

**Prerequisites:** Story 4.2

**Technical Notes:**
- Use Shadcn/ui Card as base
- Framer Motion whileHover: { y: -4, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }
- Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols wide
- Difficulty badge colors: beginner (green), intermediate (yellow), advanced (red)
- Show progress bar only if guide is started (progress > 0%)

---

### Story 4.4: Build Guides Library Page with Filtering

As a user,
I want to browse all guides with filtering and sorting options,
So that I can find guides relevant to my interests.

**Acceptance Criteria:**

**Given** I navigate to /guides
**When** the library page loads
**Then**:
- Page layout:
  - Header: "מדריכים" (Guides), total count, view toggle (grid/list)
  - Left sidebar: Filters (collapsible on mobile)
  - Main content: Grid of GuideCard components
- Filters sidebar includes:
  - Category checkboxes (8 categories with counts)
  - Difficulty checkboxes (3 levels)
  - Status filter: All / Not Started / In Progress / Completed
  - Clear all filters button
- Sorting dropdown (top-right):
  - Recommended (personalized based on role)
  - Alphabetical
  - Recently Updated
  - Most Popular
  - By Completion Status
- Active filters show as chips above grid (dismissible)
- Empty state if no guides match filters

**And** filters update results immediately without page reload

**Prerequisites:** Story 4.3

**Technical Notes:**
- Use Zustand for filter state management
- Filter logic: AND within category, OR between categories
- Personalized sorting uses user.role from profile
- Popular sorting uses guide_stats.view_count
- Grid layout: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6

---

### Story 4.5: Build Guide Reader 3-Panel Layout

As a user,
I want to read guides in a distraction-free 3-panel layout,
So that I can focus on learning with easy navigation.

**Acceptance Criteria:**

**Given** I click on a guide card
**When** the guide reader loads at /guides/:slug
**Then**:
- 3-panel responsive layout:
  - **Left Sidebar (20%, RTL: Right):** Table of Contents
  - **Center (60%):** Guide content
  - **Right Sidebar (20%, RTL: Left):** Actions & progress
- **ToC Sidebar:**
  - Auto-generated from H2/H3 headings
  - Current section highlighted emerald
  - Progress dots (completed/current/upcoming)
  - Smooth scroll to section on click
  - Sticky position
  - Collapsible on mobile (hamburger button)
- **Center Content:**
  - Breadcrumbs: Home > Category > Guide Title
  - Guide header: title, metadata (difficulty, time, views), progress bar
  - Action bar: Add Note, Create Task, Mark Complete, Bookmark, Copy Link
  - ContentRenderer with all guide blocks
  - Scroll progress bar (thin emerald line at top, 0-100%)
  - Bottom pagination: Previous/Next guide buttons
- **Actions Sidebar:**
  - Quick action buttons (sticky)
  - Circular progress widget: "42% through this guide"
  - "Mark Complete" primary button
  - Helpful feedback: thumbs up/down

**And** scrolling updates current section highlight in ToC

**And** progress is auto-saved every 30 seconds

**Prerequisites:** Story 4.4

**Technical Notes:**
- Use Intersection Observer for scroll tracking
- Store scroll position: last_position in user_progress table
- Update progress_percent based on scroll: (scrollTop / scrollHeight) * 100
- ToC generation: extract all HeadingBlocks with level <= 3
- Mobile: ToC becomes bottom sheet (slide-up drawer)

---

### Story 4.6: Implement Progress Tracking on Guide Read

As a system,
I want to automatically track user progress while reading,
So that users can pick up where they left off.

**Acceptance Criteria:**

**Given** a user is reading a guide
**When** they scroll through content
**Then**:
- Track scroll position (current heading ID)
- Calculate progress percentage (scroll depth)
- Track time spent (seconds)
- Auto-save every 30 seconds to user_progress table:
  - guide_slug
  - progress_percent
  - last_position (heading ID)
  - time_spent_seconds (incremental)
  - last_read_at (timestamp)
- Log activity: INSERT INTO user_activity (activity_type='view_guide')
- Update guide stats: UPDATE guide_stats SET view_count = view_count + 1
- On page load: Scroll to saved position automatically

**And** when user returns to guide, they resume at last position

**Prerequisites:** Story 4.5

**Technical Notes:**
- Use useEffect with interval for auto-save
- Cleanup interval on unmount
- Debounce scroll events (300ms) for performance
- Calculate progress: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
- Store last heading in view using Intersection Observer
- Optimistic UI: Update local state immediately, sync to DB in background

---

### Story 4.7: Implement Mark Complete with Celebration

As a user,
I want to mark a guide as complete and see a celebration,
So that I feel accomplished and motivated to continue learning.

**Acceptance Criteria:**

**Given** I finish reading a guide
**When** I click "Mark Complete" button
**Then**:
- Show confirmation dialog: "Mark as complete?" (with "Don't ask again" checkbox)
- On confirm:
  - Update user_progress:
    - completed = true
    - progress_percent = 100
    - completed_at = NOW()
  - Insert activity: ctivity_type='complete_guide'
  - Update guide stats: completion_count++
  - Check for achievement unlocks (e.g., "Core Complete" badge)
- Show celebration:
  - Confetti animation (canvas-confetti library)
  - Success modal with:
    - "Guide Completed! " message
    - Guide title
    - Time spent reading
    - XP/points earned (optional)
    - Next recommended guide card
  - Options: "Next Guide" button or "Back to Library"
- Toast notification: "You completed {guide_title}!"

**And** guide appears as completed in library (green checkmark, 100% progress)

**Prerequisites:** Story 4.6

**Technical Notes:**
- Use canvas-confetti package for celebration
- Confetti config: { particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#6EE7B7', '#2DD4BF'] }
- Achievement check: Query user_progress to count completed guides by category
- Modal uses Shadcn/ui Dialog with custom styling
- "Don't ask again" saves preference to profiles table (optional field)

---

### Story 4.8: Build Breadcrumbs and Navigation Components

As a user,
I want breadcrumbs and previous/next navigation,
So that I can easily navigate between guides and understand my location.

**Acceptance Criteria:**

**Given** I am reading a guide
**When** the page loads
**Then**:
- Breadcrumbs component shows at top:
  - Home > {Category} > {Guide Title}
  - Clickable links (except current page)
  - Chevron separator (RTL-aware)
  - Responsive: Collapse on mobile to "... > Current Page"
- Bottom pagination:
  - Left (RTL: Right): Previous guide in category with title + icon
  - Right (RTL: Left): Next guide in category with title + icon
  - Disabled state if first/last guide
  - Keyboard shortcuts: Left arrow = previous, Right arrow = next
- Related guides sidebar (optional):
  - "You might also like" section
  - 3 related guides based on tags
  - Small cards with icon + title

**And** clicking breadcrumb links navigates correctly

**And** keyboard arrows work for pagination

**Prerequisites:** Story 4.7

**Technical Notes:**
- Breadcrumbs component: src/components/layout/Breadcrumbs.tsx
- Use
eact-router-dom Link components
- Previous/Next logic: Sort guides by category, find current index, get adjacent
- Related guides: Use guide tags to find similar content (cosine similarity or simple tag matching)
- Keyboard shortcuts: useEffect with keydown event listener

---
