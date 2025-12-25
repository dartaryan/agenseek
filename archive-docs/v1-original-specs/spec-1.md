## 🎨 Color Palette - Emerald Learning Theme

```css
/* Extracted from your image - Emerald to Deep Forest */

/* Light Mode */
:root {
  /* Primary - Rich Emerald */
  --primary: 160 84% 39%;           /* #10B981 */
  --primary-foreground: 0 0% 100%;
  
  /* Secondary - Soft Mint */
  --secondary: 156 73% 74%;         /* #6EE7B7 */
  --secondary-foreground: 160 84% 15%;
  
  /* Accent - Bright Teal */
  --accent: 172 66% 50%;            /* #2DD4BF */
  --accent-foreground: 0 0% 100%;
  
  /* Muted - Pale Green */
  --muted: 153 60% 96%;             /* #F0FDF9 */
  --muted-foreground: 160 20% 40%;
  
  /* Background & Surface */
  --background: 0 0% 100%;          /* #FFFFFF */
  --foreground: 160 61% 12%;        /* #064E3B - Deep Forest */
  --card: 0 0% 100%;
  --card-foreground: 160 61% 12%;
  
  /* Borders */
  --border: 153 60% 90%;            /* #D1FAE5 */
  --input: 153 60% 90%;
  --ring: 160 84% 39%;
  
  /* Status Colors */
  --success: 142 76% 36%;           /* #16A34A */
  --warning: 43 96% 56%;            /* #FBBF24 */
  --error: 0 84% 60%;               /* #EF4444 */
  --info: 199 89% 48%;              /* #0EA5E9 */
  
  /* Chart/Data Colors (from your palette) */
  --chart-1: 160 84% 39%;           /* #10B981 - Emerald */
  --chart-2: 172 66% 50%;           /* #2DD4BF - Teal */
  --chart-3: 156 73% 74%;           /* #6EE7B7 - Mint */
  --chart-4: 142 76% 36%;           /* #16A34A - Green */
  --chart-5: 160 61% 12%;           /* #064E3B - Forest */
}

/* Dark Mode */
.dark {
  /* Primary - Bright Emerald */
  --primary: 160 84% 45%;           /* #14B8A6 */
  --primary-foreground: 160 100% 10%;
  
  /* Secondary - Deep Forest */
  --secondary: 160 61% 20%;         /* #0F766E */
  --secondary-foreground: 153 60% 96%;
  
  /* Accent - Bright Teal */
  --accent: 172 66% 50%;            /* #2DD4BF */
  --accent-foreground: 160 100% 10%;
  
  /* Muted */
  --muted: 160 61% 15%;             /* #134E4A */
  --muted-foreground: 153 60% 70%;
  
  /* Background & Surface */
  --background: 160 61% 8%;         /* #042F2E - Very Dark Forest */
  --foreground: 153 60% 96%;        /* #F0FDF9 - Pale Green */
  --card: 160 61% 10%;              /* #064E3B */
  --card-foreground: 153 60% 96%;
  
  /* Borders */
  --border: 160 61% 20%;            /* #0F766E */
  --input: 160 61% 20%;
  --ring: 160 84% 45%;
}
```

---

## 🎯 Icon Library - Lucide React

**המלצה:** [**Lucide Icons**](https://lucide.dev/)

**למה Lucide?**
- ✅ **1,500+ icons** - הספרייה הכי גדולה ומעודכנת
- ✅ **React Native Support** - מותאם מושלם ל-React
- ✅ **Fully Customizable** - size, color, stroke-width
- ✅ **Tree-shakeable** - רק האייקונים שאתה משתמש נכנסים ל-bundle
- ✅ **Consistent Design** - כל האייקונים באותו סטייל
- ✅ **TypeScript Support** - Type-safe
- ✅ **משתלב מושלם עם Shadcn/ui**

```bash
npm install lucide-react
```

```tsx
// Usage Example
import { BookOpen, CheckCircle, Users, Search, Menu, Settings } from 'lucide-react'

<BookOpen className="w-5 h-5 text-primary" />
<CheckCircle className="w-4 h-4 text-success" />
```

**אייקונים מומלצים לפרויקט:**
- Navigation: `Home`, `BookOpen`, `Users`, `Settings`, `Menu`, `X`
- Learning: `GraduationCap`, `Brain`, `Lightbulb`, `Target`, `TrendingUp`
- Content: `FileText`, `List`, `CheckSquare`, `Bookmark`, `Tag`
- Actions: `Search`, `Edit`, `Trash2`, `Plus`, `Minus`, `Check`
- Status: `CheckCircle`, `Circle`, `AlertCircle`, `Info`
- UI: `ChevronRight`, `ChevronDown`, `ArrowRight`, `Eye`, `EyeOff`

---

## 📋 Complete Project Requirements Specification

# BMAD-METHOD Learning Platform - Complete Requirements Document

## 🎯 Project Overview

**Project Name:** BMAD Learning Hub  
**Type:** Educational Documentation Platform  
**Tech Stack:** React + TypeScript + Vite + Shadcn/ui + Supabase + Vercel  
**Language:** Hebrew (RTL)  
**Theme:** Emerald/Forest Green with Light/Dark mode  

---

## 🚀 Core Concept

A comprehensive learning platform for BMAD-METHOD documentation that provides:
- **Personalized learning paths** based on user role and interests
- **Progress tracking** with visual indicators
- **Note-taking system** with rich text editor
- **Task management** integrated with guides
- **Community features** (simple comments & Q&A)
- **Admin dashboard** for analytics

**CRITICAL:** Platform is **authentication-required** - no access without login/registration.

---

## 1️⃣ AUTHENTICATION & ONBOARDING

### 1.1 Authentication (Supabase Auth)

**Login Page (`/auth/login`)**
- Email + Password login form
- Google OAuth button (via Supabase)
- "Forgot Password?" link
- "Don't have an account? Sign up" link
- Redirect to dashboard after successful login

**Registration Page (`/auth/register`)**
- **Required Fields:**
  - Full Name (display_name)
  - Email
  - Password (min 8 chars, validation)
  - Confirm Password
- Email verification required
- Redirect to onboarding wizard after registration

**Password Reset**
- Forgot password flow with email link
- Reset password page with new password form

**Session Management**
- Persistent sessions (remember me)
- Auto-logout after 30 days of inactivity
- Session refresh on navigation
- Secure token handling

### 1.2 Onboarding Wizard (First-time Users Only)

**Step 1: Welcome Screen**
- Platform introduction
- "Let's personalize your learning journey"
- Animated illustration (Lucide icons)

**Step 2: Select Your Role**
- Display 10 role cards with icons:
  1. 💻 Developers (מפתחים)
  2. 📊 Product Managers (מנהלי מוצר)
  3. 🎨 UX/UI Designers (מעצבים)
  4. 🏗️ Technical Architects (ארכיטקטים)
  5. 📋 Project Managers/Scrum Masters (מנהלי פרויקטים)
  6. 🧪 QA Engineers (בודקי תוכנה)
  7. 👔 Executives (מנהלים בכירים)
  8. 🎮 Game Developers (מפתחי משחקים)
  9. 💡 Innovation Teams (צוותי חדשנות)
  10. 📝 Non-Technical Roles (תפקידים לא טכניים)
- Single selection (can change later in settings)
- Each card shows: icon, title, short description (1 line)

**Step 3: Select Your Interests**
- Multi-select checkboxes for topics:
  - Agents & Workflows
  - Architecture & Design
  - Implementation & Development
  - Testing & Quality
  - Game Development
  - Creative Processes
  - Team Collaboration
  - Project Management
- Visual chips that highlight on selection
- Min 1, Max unlimited selections

**Step 4: Experience Level**
- 3 cards with descriptions:
  - **Beginner:** "I'm new to BMAD-METHOD"
  - **Intermediate:** "I have some experience"
  - **Advanced:** "I'm comfortable with most concepts"
- Single selection
- Affects content recommendations

**Step 5: Learning Path Generated**
- Animated "Building your path..." loading screen
- Shows generated learning structure:
  - **Core (Must Read):** 3-5 essential guides
  - **Recommended:** 5-7 guides for selected role
  - **Interests:** 5-10 guides based on selected topics
  - **Optional:** All other guides
- Progress bars showing 0% on each category
- "Start Learning" CTA button → Dashboard

**Database Schema for Onboarding:**
```sql
profiles:
  completed_onboarding: boolean
  role: text
  interests: text[]
  experience_level: text
  onboarded_at: timestamp
```

---

## 2️⃣ DASHBOARD (Home After Login)

### 2.1 Layout Structure

**Header:**
- Logo + Platform name (left - RTL: right)
- Quick search (Ctrl+K trigger)
- User menu (avatar + dropdown):
  - My Profile
  - Settings
  - Theme Toggle (Light/Dark)
  - Logout

**Main Content:**
Three-column grid layout (responsive)

**Column 1: Learning Progress (40% width)**

**Overall Progress Card:**
- Large circular progress indicator (total completion %)
- Number: "X out of Y guides completed"
- Breakdown chips:
  - Core: X/Y (badge color: emerald)
  - Recommended: X/Y (badge color: teal)
  - Interests: X/Y (badge color: mint)
  - Optional: X/Y (badge color: gray)

**Continue Reading Section:**
- Last 3 guides in progress
- Each shows:
  - Guide title + icon
  - Progress bar (reading position)
  - Time since last read
  - "Continue" button

**Achievements Section:**
- Display earned badges with icons:
  - 🥉 Bronze: Core completed (emerald badge)
  - 🥈 Silver: Core + Recommended completed (teal badge)
  - 🥇 Gold: 100% completed (gold badge)
- Show next achievement goal if not all unlocked
- Visual badge icons with Lucide icons (not emojis!)

**Column 2: Quick Actions (30% width)**

**My Tasks Card:**
- Task count by status:
  - To Do: X tasks (gray)
  - In Progress: X tasks (blue)
  - Done: X tasks (green)
- Top 3 priority tasks preview
- "View All Tasks" link → `/tasks`

**My Notes Card:**
- Total notes count
- Last 3 notes preview (title + date)
- "View All Notes" link → `/notes`

**Search Guides Card:**
- Quick search input
- Popular searches chips
- "Browse All Guides" button → `/guides`

**Column 3: Community & Activity (30% width)**

**Recent Activity:**
- User's last 5 activities:
  - "Completed [Guide Name]"
  - "Added note to [Guide Name]"
  - "Created task: [Task Title]"
  - "Commented on [Guide Name]"
- Timestamps (relative: "2 hours ago")

**Popular Guides This Week:**
- Top 5 most viewed guides
- Each shows: title, view count icon
- Click to navigate to guide

**Your Statistics Card:**
- Total reading time (hours)
- Guides completed: X
- Notes created: X
- Tasks completed: X
- Clean icon-based layout

---

## 3️⃣ GUIDES SYSTEM

### 3.1 Guides Library Page (`/guides`)

**Header:**
- Page title: "Learning Guides"
- Total guides count
- View switcher: Grid / List (toggle)

**Filters Sidebar (collapsible on mobile):**
- **By Category:**
  - Core Guides (X)
  - Role-Specific (X)
  - General Guides (X)
  - Onboarding (X)
- **By Role:** (checkboxes)
  - All 10 roles listed
- **By Difficulty:**
  - Beginner (green)
  - Intermediate (yellow)
  - Advanced (red)
- **By Status:**
  - Not Started
  - In Progress
  - Completed
- **Clear All Filters** button

**Search Bar:**
- Prominent search input with icon
- Placeholder: "חפש מדריכים, נושאים, מונחים..."
- Fuse.js fuzzy search (client-side)
- Real-time filtering as you type
- Shows: "Showing X of Y guides"

**Guides Grid/List:**

**Grid View (default):**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card shows:
  - Icon (category-based)
  - Title
  - Short description (2 lines, truncated)
  - Badges:
    - Core/Recommended/Optional tag
    - Difficulty level (Beginner/Intermediate/Advanced)
    - Estimated reading time (calculated from word count)
  - Progress bar (if started)
  - Status indicator:
    - ✓ Green checkmark if completed
    - Blue dot if in progress
    - Empty circle if not started
  - "Start Reading" / "Continue" button

**List View:**
- Full-width rows
- Same information as grid but horizontal layout
- Better for scanning

**Sorting Options:**
- Recommended (default - based on user profile)
- Alphabetical (A-Z / Z-A)
- Recently Updated
- Most Popular
- Completion Status

### 3.2 Individual Guide Page (`/guides/[category]/[slug]`)

**Layout: Three-panel design**

**Left Panel - Navigation Sidebar (20% width, sticky):**
- **Guide List:**
  - Current category expanded
  - All guides in category listed
  - Current guide highlighted
  - Completion checkmarks on completed guides
  - Click to navigate between guides
- **Back to All Guides** button at top
- Collapsible on mobile (hamburger menu)

**Center Panel - Main Content (60% width):**

**Breadcrumbs:**
- Home > [Category] > [Guide Title]
- Each clickable

**Guide Header:**
- Title (large, prominent)
- Metadata bar:
  - Difficulty badge
  - Reading time estimate
  - Last updated date
  - View count (icon + number)
- Progress indicator: "You're X% through this guide"

**Action Buttons Row:**
- Add Note (icon + text)
- Create Task (icon + text)
- Mark Complete / Mark Incomplete (toggle)
- Bookmark (toggle)
- Print (opens print-friendly view)
- Copy Link (with toast notification)

**Content Area:**
- Markdown rendered with MDX
- **Typography:**
  - Headings: H1-H6 with proper hierarchy
  - Paragraphs: max-width for readability
  - Lists: styled bullets/numbers
  - Blockquotes: emerald left border
  - Code blocks: syntax highlighting (rehype-highlight)
  - Inline code: subtle background
  - Links: emerald color with hover effect
  - Tables: responsive with borders
  - Images: full-width with captions
- **Special Elements:**
  - Info/Warning/Success callout boxes (with icons)
  - Expandable sections (accordions for long content)
  - Keyboard shortcuts styled (e.g., `Ctrl+K`)

**Scroll Progress Indicator:**
- Thin bar at top of page showing reading progress (0-100%)
- Color: emerald gradient

**Bottom Navigation:**
- Previous Guide | Next Guide buttons
- Suggests next recommended guide based on learning path

**Right Panel - Table of Contents (20% width, sticky):**
- Auto-generated from H2/H3 headings
- Current section highlighted as you scroll
- Smooth scroll on click
- Shows hierarchy with indentation
- "Helpful?" feedback section:
  - Thumbs Up / Thumbs Down (icons only)
  - Count display (X people found this helpful)
  - Simple anonymous vote (stored per user in DB)

### 3.3 Print-Friendly View

**Accessible via Print button or browser print (Ctrl+P)**
- CSS `@media print` styling
- Clean layout without sidebar/navigation
- Black & white friendly
- Page breaks between major sections
- Header with title + date
- Footer with page numbers

---

## 4️⃣ NOTES SYSTEM

### 4.1 Notes Library Page (`/notes`)

**Header:**
- Page title: "My Notes"
- Total notes count
- "New Note" button (creates standalone note)

**Filters & Search:**
- Search notes by title/content
- Filter by:
  - Associated guide (dropdown)
  - Tags (multi-select chips)
  - Date range (date picker)
- Sort by:
  - Recently Updated (default)
  - Created Date
  - Alphabetical
  - Guide

**Notes Grid:**
- 3-column card layout (responsive)
- Each card shows:
  - Title (editable inline)
  - First 3 lines of content (truncated)
  - Tags (colored chips)
  - Associated guide link (if any)
  - Created/Updated date
  - Quick actions: Edit, Delete (with confirmation)
- Click card → opens note in modal editor

### 4.2 Note Editor (Modal/Drawer)

**Rich Text Editor (using Tiptap or Lexical):**

**Toolbar:**
- **Text Formatting:**
  - Bold, Italic, Strikethrough
  - Heading levels (H1-H3)
  - Bullet list, Numbered list
  - Blockquote
- **Links:**
  - Add/edit/remove hyperlinks
- **Code:**
  - Inline code
  - Code block with language selection (syntax highlighting)
- **Utilities:**
  - Undo/Redo
  - Clear formatting

**Note Fields:**
- Title (text input)
- Content (rich text area)
- Tags (multi-input with autocomplete from existing tags)
- Associated Guide (optional dropdown)

**Actions:**
- Save (Ctrl+S)
- Cancel
- Delete Note (with confirmation dialog)

**Auto-save:**
- Draft saved every 10 seconds to prevent data loss
- "Saving..." / "Saved" indicator

### 4.3 Quick Note from Guide

**When reading a guide:**
- Click "Add Note" button
- Opens note editor modal
- Pre-filled with:
  - Guide association (automatic)
  - Optional: highlighted text from guide as initial content
- Save → returns to guide, note appears in guide's notes section

---

## 5️⃣ TASKS SYSTEM

### 5.1 Tasks Page (`/tasks`)

**Header:**
- Page title: "My Tasks"
- Total tasks count (grouped by status)
- "New Task" button

**View Tabs:**
- **All Tasks** (default)
- **By Guide** (grouped by associated guide)
- **By Status** (To Do / In Progress / Done columns like Kanban)
- **By Priority** (High / Medium / Low sections)

**Filters:**
- Filter by:
  - Status (checkboxes)
  - Priority (checkboxes)
  - Associated guide (dropdown)
- Sort by:
  - Created Date
  - Priority
  - Status
  - Guide

**Task List:**

**Task Item Card:**
- Checkbox (click to toggle status: To Do ↔ In Progress ↔ Done)
- Title (editable inline on click)
- Description (collapsed, expandable)
- Priority indicator (colored dot: red/yellow/green)
- Status badge (To Do / In Progress / Done)
- Associated guide link (if any)
- Created date
- **Sub-tasks (if any):**
  - Indented checklist below parent task
  - Each sub-task has checkbox + title
  - Progress: X/Y completed
- Quick actions:
  - Edit (opens task modal)
  - Delete (confirmation)
  - Add Sub-task

**Task Modal (Create/Edit):**
- Title (text input)
- Description (textarea, optional)
- Status (dropdown: To Do / In Progress / Done)
- Priority (dropdown: High / Medium / Low)
- Associated Guide (optional dropdown)
- Sub-tasks:
  - Add sub-task button
  - List of sub-tasks (editable titles)
  - Delete sub-task (X icon)
  - Drag to reorder
- Save / Cancel buttons

### 5.2 Task Creation from Guide

**When reading a guide:**
- Click "Create Task" button
- Opens task modal
- Pre-filled with guide association
- Quick-add mode (simplified form)

### 5.3 Task Statistics

**Dashboard widget shows:**
- Total tasks: X
- To Do: X (gray)
- In Progress: X (blue)
- Done: X (green)
- Completion rate: X%
- Chart: tasks created/completed over time (last 30 days)

---

## 6️⃣ SEARCH & NAVIGATION

### 6.1 Global Search (Header)

**Search Input:**
- Always visible in header
- Placeholder: "חפש..."
- Icon: Lucide Search
- Click → focuses input
- Keyboard: Ctrl+K / Cmd+K opens Command Palette

**Search Results Dropdown:**
- Shows top 5 results as you type (real-time)
- Each result shows:
  - Icon (guide/note/task)
  - Title
  - Type badge (Guide / Note / Task)
  - Snippet (2 lines with search term highlighted)
  - Match score (relevance)
- "View all X results" link at bottom
- Navigate with arrow keys + Enter

### 6.2 Command Palette (Ctrl+K)

**Modal overlay with search interface:**

**Search Box:**
- Large, prominent
- Placeholder: "Type a command or search..."

**Results Grouped by Type:**

**Quick Actions:**
- Create New Task
- Create New Note
- View Dashboard
- View All Guides
- View My Notes
- View My Tasks
- Go to Settings
- Go to Profile
- Toggle Theme

**Search Results:**
- Guides (with snippet)
- Notes (with snippet)
- Tasks (with status)

**Keyboard Navigation:**
- Arrow keys to navigate
- Enter to select
- Esc to close
- Tab to switch between groups

**Recent Searches:**
- Last 5 searches shown when input is empty
- Quick re-search

### 6.3 Breadcrumbs

**On every page below header:**
- Home > Section > Page
- Each level clickable
- Separator: `/` or `>` icon
- Current page not clickable (just text)

---

## 7️⃣ COMMUNITY FEATURES

### 7.1 Comments on Guides

**Location:** Below guide content, above "Next Guide" navigation

**Comments Section:**
- Title: "Questions & Discussion (X comments)"
- "Add Comment" button (requires auth)

**Comment Thread:**
- Comments sorted by: Recent (default) / Most Helpful
- Each comment shows:
  - User avatar (first letter of name + background color)
  - User display name
  - Comment text (markdown supported: bold, italic, code, links)
  - Timestamp (relative: "2 days ago")
  - "Mark as Question" button (if not already marked)
  - "Reply" button (nested threading 1 level deep)
  - "Helpful" button (upvote count, one vote per user)
  - Edit/Delete (if own comment)

**Question Highlighting:**
- If comment marked as "Question":
  - Yellow/orange left border
  - "Question" badge
  - Replies can be marked as "Solution"
  - Solution has green checkmark + "Solution" badge
  - Solutions float to top under question

**Add Comment Form:**
- Textarea (supports markdown)
- "Comment" / "Ask Question" button toggle
- Preview mode (shows rendered markdown)
- Submit → adds to thread, sends notification to guide owner (if admin)

### 7.2 Q&A System

**Separate View: "Questions" filter toggle**
- Shows only comments marked as questions
- Grouped by:
  - Unanswered (no solution marked)
  - Answered (solution exists)
- Sort by date/activity

---

## 8️⃣ USER PROFILE & SETTINGS

### 8.1 Profile Page (`/profile`)

**Profile Header:**
- Large avatar (generated from initials)
- Display name
- Email
- Join date
- Edit Profile button

**Stats Overview (4 cards):**
- Guides Completed: X/Y (with %)
- Notes Created: X
- Tasks Completed: X
- Comments Posted: X

**Activity Timeline:**
- Last 20 activities (chronological)
- Each shows: action + guide/item + date

**Achievements Display:**
- Badges earned (with date earned)
- Next achievement progress bar

### 8.2 Settings Page (`/settings`)

**Tabs:**

**Account Tab:**
- Change Display Name (form + save)
- Change Email (requires re-verification)
- Change Password (current + new + confirm)
- Delete Account (with warning + confirmation)

**Preferences Tab:**
- **Role:** Dropdown (updates learning path)
- **Interests:** Multi-select checkboxes
- **Experience Level:** Radio buttons
- **Theme:** Light / Dark / System Auto
- **Language:** Hebrew (RTL) [future: English]
- **Notifications:** (future: email notifications on/off)

**Privacy Tab:**
- Make notes private (default: private)
- Profile visibility: Public / Private (future feature)

**Data & Export:**
- Export All Notes (downloads .zip with .md files)
- Export Task List (downloads .csv)
- Export Progress Report (downloads .pdf)

---

## 9️⃣ ADMIN PANEL

### 9.1 Access Control

**Admin User:**
- Marked in database: `profiles.is_admin = true`
- Admin menu item appears in user dropdown

**Admin Dashboard (`/admin`):**

### 9.2 Dashboard Overview

**Stats Cards (4 across):**
- Total Users: X
- Total Guides Viewed: X (all time)
- Active Users (last 30 days): X
- Average Completion Rate: X%

**Activity Graph:**
- Line chart: Daily Active Users (last 30 days)
- Bar chart: Guide Views per Day (last 30 days)
- Tools: Chart.js or Recharts

**Popular Guides Table:**
- Top 10 guides by views
- Columns: Title, Category, Views, Avg Completion %, Helpful Votes

**Recent User Activity:**
- Last 50 activities (all users)
- Columns: User, Action, Guide/Item, Timestamp

### 9.3 User Management (`/admin/users`)

**User List:**
- Searchable table
- Columns:
  - Display Name
  - Email
  - Role
  - Joined Date
  - Last Active
  - Progress (%)
  - Actions (View / Delete)

**User Detail View:**
- Full profile
- Activity timeline
- Progress breakdown
- Notes count, Tasks count
- Delete User button (with confirmation)
- Note: Deleting user cascades to all their data (notes, tasks, comments)

### 9.4 Content Analytics (`/admin/analytics`)

**Guide Performance:**
- Table of all guides with metrics:
  - Views
  - Unique Viewers
  - Avg Time on Page
  - Completion Rate
  - Helpful Votes (positive/negative)
  - Comments Count

**User Engagement:**
- Total Notes Created
- Total Tasks Created
- Total Comments Posted
- Avg Session Duration

**Export Reports:**
- CSV export of all data tables

---

## 🔟 RESPONSIVE DESIGN

### 10.1 Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### 10.2 Mobile Adaptations

**Navigation:**
- Header: Logo + Hamburger menu (right side for RTL)
- Mobile menu: Drawer from right with full navigation

**Dashboard:**
- Stack columns vertically
- Collapse widgets into accordions

**Guides:**
- Sidebar hidden by default (hamburger to toggle)
- Table of Contents hidden by default (button to show)
- Full-width content

**Tasks/Notes:**
- List view only (no grid)
- Simplified cards

**Command Palette:**
- Full-screen on mobile

---

## 1️⃣1️⃣ ACCESSIBILITY (WCAG 2.1 AA)

### 11.1 Keyboard Navigation

- All interactive elements focusable
- Tab order logical (RTL-aware)
- Escape closes modals/dialogs
- Arrow keys for navigation where appropriate
- Enter/Space for actions

### 11.2 Screen Readers

- Semantic HTML (proper headings, landmarks)
- ARIA labels on icons/buttons
- Alt text on images
- Role attributes where needed
- Skip to main content link

### 11.3 Visual

- Color contrast ratios meet AA standards
- Focus indicators visible (emerald outline)
- Text resizable up to 200%
- No color-only information
- Icons always paired with text (or aria-label)

---

## 1️⃣2️⃣ PERFORMANCE REQUIREMENTS

### 12.1 Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Lighthouse Score:** > 90 (all categories)

### 12.2 Optimizations

- Code splitting by route
- Lazy loading images
- Virtual scrolling for long lists (tasks/notes)
- Debounced search (300ms)
- Memoized components (React.memo)
- Optimistic UI updates (tasks/notes)
- Cached Supabase queries (React Query)

---

## 1️⃣3️⃣ DATABASE SCHEMA (Supabase/PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT, -- user selected role
  interests TEXT[], -- array of selected topics
  experience_level TEXT, -- 'beginner' | 'intermediate' | 'advanced'
  theme TEXT DEFAULT 'light', -- 'light' | 'dark' | 'system'
  completed_onboarding BOOLEAN DEFAULT false,
  onboarded_at TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Progress
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL, -- 'developers', 'agents-guide', etc.
  guide_category TEXT NOT NULL, -- 'core', 'role', 'general', 'onboarding'
  completed BOOLEAN DEFAULT false,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_position TEXT, -- heading ID or scroll %
  time_spent_seconds INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_slug)
);

-- User Notes
CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT, -- nullable for standalone notes
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Tiptap/Lexical JSON format
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tasks
CREATE TABLE public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT, -- nullable for standalone tasks
  parent_task_id UUID REFERENCES user_tasks(id) ON DELETE CASCADE, -- for sub-tasks
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  position INTEGER DEFAULT 0, -- for custom ordering
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guide Comments
CREATE TABLE public.guide_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  parent_comment_id UUID REFERENCES guide_comments(id) ON DELETE CASCADE, -- for replies
  content TEXT NOT NULL, -- markdown
  is_question BOOLEAN DEFAULT false,
  is_solution BOOLEAN DEFAULT false, -- for answers to questions
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment Votes (helpful tracking)
CREATE TABLE public.comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES guide_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Guide Statistics
CREATE TABLE public.guide_stats (
  guide_slug TEXT PRIMARY KEY,
  view_count INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,
  avg_time_spent_seconds INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Log (for admin analytics)
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'view_guide', 'complete_guide', 'create_note', 'create_task', 'create_comment', etc.
  target_slug TEXT, -- guide_slug or note_id or task_id
  metadata JSONB, -- additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_guide ON user_progress(guide_slug);
CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_user_notes_guide ON user_notes(guide_slug);
CREATE INDEX idx_user_tasks_user ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_guide ON user_tasks(guide_slug);
CREATE INDEX idx_guide_comments_guide ON guide_comments(guide_slug);
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);

-- Row Level Security (RLS) Policies

-- Profiles: Users can read all, update own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Progress: Users can only see/edit own
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Notes: Users can only see/edit own
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notes" ON user_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON user_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON user_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON user_notes FOR DELETE USING (auth.uid() = user_id);

-- Tasks: Users can only see/edit own
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON user_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON user_tasks FOR DELETE USING (auth.uid() = user_id);

-- Comments: All can read, users can edit own
ALTER TABLE guide_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON guide_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON guide_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON guide_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON guide_comments FOR DELETE USING (auth.uid() = user_id);

-- Comment Votes: Users can vote once
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are viewable by everyone" ON comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Guide Stats: All can read, only system can write
ALTER TABLE guide_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stats are viewable by everyone" ON guide_stats FOR SELECT USING (true);

-- User Activity: Only own + admins can view
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 1️⃣4️⃣ DEPLOYMENT & HOSTING

### 14.1 Frontend (Vercel)

**Setup:**
1. Connect GitHub repository
2. Configure build:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Enable auto-deploy on push to `main`

**Custom Domain (optional):**
- Add domain in Vercel settings
- Update DNS records

### 14.2 Backend (Supabase)

**Setup:**
1. Create Supabase project (free tier)
2. Run SQL migrations (create tables + RLS)
3. Configure Auth:
   - Enable Email + Password
   - Enable Google OAuth (add client ID/secret)
   - Set redirect URLs (Vercel domain)
4. Copy API keys to Vercel env vars

**Free Tier Limits:**
- 500MB database
- 1GB file storage (not using)
- 2GB bandwidth/month
- Unlimited API requests (with rate limits)

---

## 1️⃣5️⃣ TECHNICAL STACK SUMMARY

### Frontend
```json
{
  "framework": "React 18",
  "language": "TypeScript 5",
  "build": "Vite 5",
  "styling": "TailwindCSS 3.4",
  "ui": "Shadcn/ui (Radix UI)",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "routing": "React Router v6",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "markdown": "React Markdown + Rehype",
  "search": "Fuse.js",
  "richText": "Tiptap or Lexical",
  "charts": "Recharts (for admin)",
  "dateTime": "date-fns"
}
```

### Backend
```json
{
  "platform": "Supabase",
  "database": "PostgreSQL",
  "auth": "Supabase Auth",
  "realtime": "Supabase Realtime",
  "client": "@supabase/supabase-js"
}
```

### Hosting
- **Frontend:** Vercel (free)
- **Backend:** Supabase (free tier)
- **Domain:** Optional custom domain

---

## 1️⃣6️⃣ PROJECT STRUCTURE

```
bmad-learning-platform/
├── public/
│   ├── guides/                    # Markdown guide files
│   │   ├── roles/
│   │   │   ├── developers.md
│   │   │   ├── product-managers.md
│   │   │   └── ...
│   │   ├── general/
│   │   │   ├── quick-start.md
│   │   │   ├── agents-guide.md
│   │   │   └── ...
│   │   └── onboarding/
│   │       └── ...
│   └── assets/
│       └── images/
├── src/
│   ├── app/                       # Routes
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── reset-password.tsx
│   │   ├── onboarding/
│   │   │   └── wizard.tsx
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── guides/
│   │   │   ├── index.tsx          # Library
│   │   │   └── [slug].tsx         # Individual guide
│   │   ├── notes/
│   │   │   └── index.tsx
│   │   ├── tasks/
│   │   │   └── index.tsx
│   │   ├── profile/
│   │   │   └── index.tsx
│   │   ├── settings/
│   │   │   └── index.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx
│   │   │   ├── users.tsx
│   │   │   └── analytics.tsx
│   │   └── layout.tsx             # Root layout
│   ├── components/
│   │   ├── ui/                    # Shadcn base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── guides/
│   │   │   ├── GuideCard.tsx
│   │   │   ├── GuideContent.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   └── ...
│   │   ├── notes/
│   │   │   ├── NoteEditor.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   └── ...
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── ProgressCard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── ...
│   │   └── common/
│   │       ├── CommandPalette.tsx
│   │       ├── SearchBar.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── auth.ts                # Auth helpers
│   │   ├── queries.ts             # DB queries
│   │   ├── markdown.ts            # Markdown parsing
│   │   ├── search.ts              # Fuse.js config
│   │   └── utils.ts               # General helpers
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProgress.ts
│   │   ├── useNotes.ts
│   │   ├── useTasks.ts
│   │   └── ...
│   ├── store/
│   │   ├── auth.ts                # Zustand auth store
│   │   ├── theme.ts               # Theme store
│   │   └── ...
│   ├── types/
│   │   ├── database.ts            # Supabase types
│   │   ├── guide.ts
│   │   ├── note.ts
│   │   └── task.ts
│   ├── styles/
│   │   ├── globals.css            # Tailwind base + custom
│   │   └── themes.css             # Emerald theme vars
│   └── main.tsx                   # App entry
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 1️⃣7️⃣ CONTENT MANAGEMENT

### Guide Files Format

**Each guide is a Markdown (.md) file with frontmatter:**

```markdown
---
title: "מדריך למפתחים - שליטה מלאה ב-BMAD-METHOD"
slug: "developers"
category: "roles"
difficulty: "intermediate"
estimatedTime: 45
tags: ["development", "agents", "workflows"]
lastUpdated: "2025-01-15"
author: "BMAD Team"
---

# מדריך למפתחים

## תוכן עניינים
[Auto-generated from headings]

## מבוא
...
```

**Guide Slugs:**
- Unique identifier (used in URLs)
- Example: `/guides/roles/developers`

**Automatic Processing:**
- Parse frontmatter on build
- Generate ToC from H2/H3 headings
- Calculate reading time from word count
- Index content for search

---

## 1️⃣8️⃣ SECURITY CONSIDERATIONS

### Authentication
- Passwords hashed (Supabase handles)
- JWT tokens for sessions
- HTTP-only cookies
- CSRF protection (Supabase built-in)

### Authorization
- Row Level Security enforced
- Admin checks on server-side
- No client-side role checks for security

### Input Validation
- Sanitize user input (notes, comments)
- XSS prevention (React escapes by default)
- SQL injection prevented (Supabase parameterized queries)
- File upload validation (if future feature)

### Rate Limiting
- Supabase built-in limits
- Client-side debouncing for search/autosave

---

## 1️⃣9️⃣ TESTING STRATEGY

### Unit Tests
- Component tests (Vitest + React Testing Library)
- Hook tests
- Utility function tests

### Integration Tests
- User flows (Playwright)
- Auth flow
- CRUD operations

### E2E Tests (Critical Paths)
- Registration → Onboarding → First Guide
- Create Note → Edit → Delete
- Create Task → Add Sub-task → Complete
- Admin: View Users → Delete User

---

## 2️⃣0️⃣ SUCCESS METRICS

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average session duration: > 15 mins
- Guides completed per user: > 5

### Platform Health
- Uptime: > 99.5%
- Page load time: < 3s (P95)
- Error rate: < 1%

### Learning Outcomes
- Onboarding completion rate: > 90%
- Core guides completion rate: > 70%
- User satisfaction (helpful votes): > 80% positive

---

## ✅ FINAL CHECKLIST

### Phase 1: MVP (Weeks 1-2)
- [ ] Authentication (email + Google)
- [ ] Onboarding wizard
- [ ] Dashboard basics
- [ ] Guides library + reading
- [ ] Progress tracking
- [ ] Basic search

### Phase 2: Core Features (Weeks 3-4)
- [ ] Notes system (rich text)
- [ ] Tasks system (with sub-tasks)
- [ ] Command palette (Ctrl+K)
- [ ] Comments on guides
- [ ] Theme toggle (light/dark)

### Phase 3: Polish (Week 5)
- [ ] Admin panel
- [ ] Q&A system
- [ ] Analytics
- [ ] Responsive mobile
- [ ] Accessibility audit

### Phase 4: Launch (Week 6)
- [ ] Performance optimization
- [ ] SEO basics
- [ ] Deploy to Vercel
- [ ] User testing
- [ ] Bug fixes
- [ ] Documentation

---

**This specification is comprehensive and ready for development. Good luck building the BMAD Learning Hub! 🚀**