# Agenseek - Technical Architecture Specification

**Project:** BMAD Learning Hub (Agenseek)  
**Version:** 1.0  
**Date:** November 6, 2025  
**Author:** Winston (Architect)  
**Status:** Ready for Implementation

---

## Executive Summary

Agenseek is a full-featured internal learning platform that transforms 42 comprehensive BMAD learning guides into an interactive, personalized experience. The architecture leverages modern web technologies (React 18 + TypeScript 5 + Vite 5 + Supabase) with a focus on rapid development, free-tier hosting, and developer productivity.

**Key Architectural Decisions:**
- **Vite + React + TypeScript** foundation for fast development and type safety
- **Supabase** for backend (auth, database, real-time) - eliminates backend development
- **Shadcn/ui** component system for consistent, accessible UI
- **JSON-based content system** for flexible, dynamic guide rendering
- **Vercel deployment** for zero-config hosting with automatic CI/CD

This architecture supports **9 user roles**, **42 learning guides**, and features including personalized learning paths, progress tracking, notes, tasks, comments/Q&A, and admin analytics - all within free-tier limits.

---

## 1. Project Initialization

### First Implementation Story

**Initialize the project with this exact command:**

```bash
# Create Vite + React + TypeScript project
npm create vite@latest agenseek -- --template react-ts
cd agenseek
npm install

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Shadcn/ui CLI and initialize
npx shadcn-ui@latest init

# Install core dependencies
npm install @supabase/supabase-js react-router-dom zustand
npm install react-hook-form zod @hookform/resolvers
npm install @tiptap/react @tiptap/starter-kit
npm install fuse.js date-fns
npm install framer-motion
npm install @tabler/icons-react
npm install recharts

# Install dev dependencies
npm install -D @types/node
```

### Configuration Files Created by Starter

The Vite starter provides:
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript compiler options
- `index.html` - Entry point
- `package.json` - Dependencies and scripts
- `.eslintrc.cjs` - Linting rules

### Additional Setup Required

**Tailwind Configuration (`tailwind.config.js`):**
```javascript
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',      // Emerald
        secondary: '#6EE7B7',    // Mint
        accent: '#2DD4BF',       // Teal
        // ... (full color system from UX spec)
      },
      fontFamily: {
        sans: ['Arimo', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Environment Variables (`.env.local`):**
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 2. Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
|----------|----------|---------|---------------|-----------|
| **Build Tool** | Vite | 5.x | All | Ultra-fast HMR, optimized builds, modern dev experience |
| **Frontend Framework** | React | 18.2.0 | All | Industry standard, excellent TypeScript support, huge ecosystem |
| **Language** | TypeScript | 5.x | All | Type safety, better DX, catches errors at compile time |
| **Styling** | TailwindCSS | 3.4.x | All UI | Utility-first, rapid development, consistent design system |
| **UI Components** | Shadcn/ui | Latest | All UI | Accessible, customizable, copy-paste model (no bloat) |
| **Icons** | Tabler Icons React | Latest | All UI | 5,200+ icons, consistent style, React-optimized |
| **Animations** | Framer Motion | 11.x | All interactive | Industry-leading animation library, declarative API |
| **Routing** | React Router | 6.x | Navigation | Standard React routing, type-safe |
| **State Management** | Zustand | 4.x | Global state | Lightweight, simple API, no boilerplate |
| **Backend/Database** | Supabase | 2.x | All backend | PostgreSQL + Auth + Real-time in one service |
| **Forms** | React Hook Form + Zod | Latest | All forms | Performance, validation, type-safe schemas |
| **Rich Text Editor** | Tiptap | 2.x | Notes feature | Headless, extensible, React-friendly |
| **Search** | Fuse.js | 7.x | Search feature | Client-side fuzzy search, lightweight |
| **Charts** | Recharts | 2.x | Admin analytics | React-based, composable charts |
| **Date Handling** | date-fns | 3.x | All dates | Lightweight, tree-shakeable, immutable |
| **Hosting (Frontend)** | Vercel | N/A | Deployment | Zero-config, auto CI/CD, free tier generous |
| **Hosting (Backend)** | Supabase | N/A | Deployment | Free tier: 500MB DB, 1GB storage, 2GB bandwidth |

---

## 3. Complete Project Structure

```
agenseek/
├── public/
│   └── assets/
│       └── images/              # Static images (logos, placeholders)
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_indexes.sql
│   │   ├── 003_rls_policies.sql
│   │   └── 004_functions_triggers.sql
│   └── config.toml              # Supabase local config
│
├── src/
│   ├── app/                     # Route components
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── reset-password.tsx
│   │   ├── onboarding/
│   │   │   └── wizard.tsx
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── guides/
│   │   │   ├── index.tsx        # Guides library
│   │   │   └── [slug].tsx       # Individual guide reader
│   │   ├── notes/
│   │   │   └── index.tsx
│   │   ├── tasks/
│   │   │   └── index.tsx
│   │   ├── profile/
│   │   │   └── index.tsx
│   │   ├── settings/
│   │   │   └── index.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx        # Admin dashboard
│   │   │   ├── users.tsx
│   │   │   └── analytics.tsx
│   │   ├── layout.tsx           # Root layout with header/sidebar
│   │   └── routes.tsx           # Route configuration
│   │
│   ├── components/
│   │   ├── ui/                  # Shadcn/ui components (30+ components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (full Shadcn collection)
│   │   │
│   │   ├── content/             # Dynamic content renderers
│   │   │   ├── ContentRenderer.tsx    # Main orchestrator
│   │   │   ├── blocks/
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   ├── HeadingBlock.tsx
│   │   │   │   ├── CodeBlock.tsx
│   │   │   │   ├── CalloutBlock.tsx
│   │   │   │   ├── ListBlock.tsx
│   │   │   │   ├── TableBlock.tsx
│   │   │   │   ├── ChartBlock.tsx
│   │   │   │   ├── AccordionBlock.tsx
│   │   │   │   ├── TabsBlock.tsx
│   │   │   │   ├── GridBlock.tsx
│   │   │   │   ├── CardBlock.tsx
│   │   │   │   ├── ImageBlock.tsx
│   │   │   │   └── VideoBlock.tsx
│   │   │   └── GuideRenderer.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky header with search, user menu
│   │   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   ├── guides/
│   │   │   ├── GuideCard.tsx    # Visual card with gradient header
│   │   │   ├── GuideContent.tsx
│   │   │   ├── TableOfContents.tsx  # Auto-generated ToC
│   │   │   ├── GuideFilters.tsx
│   │   │   └── ProgressTracker.tsx
│   │   │
│   │   ├── notes/
│   │   │   ├── NoteEditor.tsx   # Tiptap rich text editor
│   │   │   ├── NoteCard.tsx
│   │   │   └── NotesList.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── TaskKanban.tsx   # Drag-and-drop board
│   │   │   └── SubTaskList.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ProgressCard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── AchievementBadges.tsx
│   │   │
│   │   ├── community/
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── QASection.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── UserTable.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   └── ContentMetrics.tsx
│   │   │
│   │   └── common/
│   │       ├── CommandPalette.tsx  # Ctrl+K quick actions
│   │       ├── SearchBar.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── content/                 # ALL LEARNING CONTENT
│   │   ├── locale/
│   │   │   └── he/              # Hebrew content
│   │   │       ├── ui.json      # UI translations
│   │   │       ├── auth.json
│   │   │       ├── onboarding.json
│   │   │       ├── dashboard.json
│   │   │       ├── guides/      # 42 guide JSON files
│   │   │       │   ├── index.json           # Catalog with metadata
│   │   │       │   ├── core/
│   │   │       │   │   ├── quick-start.json
│   │   │       │   │   └── glossary.json
│   │   │       │   ├── roles/
│   │   │       │   │   ├── developers.json
│   │   │       │   │   ├── product-managers.json
│   │   │       │   │   └── ... (9 role guides)
│   │   │       │   ├── agents/    # 8 agent guides
│   │   │       │   ├── workflows/ # 10 workflow guides
│   │   │       │   ├── practical/  # 9 practical guides
│   │   │       │   ├── faq/        # 6 FAQ guides
│   │   │       │   └── onboarding/ # 3 onboarding guides
│   │   │       ├── tasks.json
│   │   │       ├── notes.json
│   │   │       ├── profile.json
│   │   │       └── admin.json
│   │   └── schemas/             # TypeScript types for content
│   │       ├── guide.types.ts
│   │       ├── component.types.ts
│   │       └── content.types.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client singleton
│   │   ├── auth.ts              # Auth helpers
│   │   ├── queries.ts           # Supabase query functions
│   │   ├── content-loader.ts    # Load JSON content
│   │   ├── markdown.ts          # Markdown parsing utils
│   │   ├── search.ts            # Fuse.js configuration
│   │   └── utils.ts             # General utilities (cn, formatDate, etc.)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication state
│   │   ├── useContent.ts        # Load guide content
│   │   ├── useProgress.ts       # User progress tracking
│   │   ├── useNotes.ts          # Notes CRUD operations
│   │   ├── useTasks.ts          # Tasks CRUD operations
│   │   ├── useComments.ts       # Comments CRUD
│   │   └── useSearch.ts         # Search functionality
│   │
│   ├── store/
│   │   ├── auth.ts              # Zustand auth store
│   │   ├── theme.ts             # Theme store (light/dark)
│   │   └── ui.ts                # UI state (sidebar open, etc.)
│   │
│   ├── types/
│   │   ├── database.ts          # Supabase generated types
│   │   ├── guide.ts
│   │   ├── note.ts
│   │   ├── task.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── styles/
│   │   ├── globals.css          # Tailwind directives + custom CSS
│   │   └── themes.css           # Emerald theme CSS variables
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── vite-env.d.ts            # Vite type declarations
│
├── scripts/
│   └── convert-markdown-to-json.ts  # Content migration script
│
├── .env.example
├── .env.local                   # Git-ignored environment variables
├── .gitignore
├── .eslintrc.cjs
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 4. Epic to Architecture Mapping

Based on the Product Brief, here's how the system architecture supports each major epic:

| Epic | Architecture Components | Database Tables | Key Features |
|------|------------------------|-----------------|--------------|
| **Authentication & Onboarding** | `app/auth/*`, `app/onboarding/*`, Supabase Auth | `profiles`, `user_activity` | Email/password, OAuth, 5-step wizard |
| **Guides Library** | `app/guides/index.tsx`, `components/guides/*`, Content JSON system | `guide_stats`, `guide_bookmarks` | Grid/list views, filters, search |
| **Guide Reading** | `app/guides/[slug].tsx`, `components/content/*` | `user_progress`, `user_activity` | 3-panel layout, ToC, progress tracking |
| **Notes System** | `app/notes/*`, `components/notes/*`, Tiptap | `user_notes` | Rich text editor, tags, search |
| **Tasks System** | `app/tasks/*`, `components/tasks/*` | `user_tasks` | Kanban board, sub-tasks, priorities |
| **Search & Discovery** | `components/common/CommandPalette.tsx`, Fuse.js | N/A (client-side) | Global search, Ctrl+K palette |
| **Community (Comments/Q&A)** | `components/community/*` | `guide_comments`, `comment_votes` | Threaded comments, voting, solutions |
| **User Profile & Progress** | `app/profile/*`, `components/dashboard/*` | `profiles`, `user_progress`, `user_activity` | Statistics, achievements, activity feed |
| **Admin Analytics** | `app/admin/*`, `components/admin/*`, Recharts | `guide_stats`, `user_activity`, all tables | Dashboards, user management, metrics |
| **Settings & Preferences** | `app/settings/*` | `profiles` | Role, interests, theme, language |

---

## 5. Technology Stack Details

### 5.1 Core Frontend Stack

**React 18.2.0**
- Functional components with hooks
- Concurrent rendering features
- Automatic batching for performance
- Suspense for data fetching (with React Query)

**TypeScript 5.x**
- Strict mode enabled
- Path aliases configured (@/ for src/)
- Type inference from Supabase schema
- Zod for runtime validation

**Vite 5.x**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds with Rollup
- Environment variable support (VITE_ prefix)
- Plugin ecosystem (react, typescript, etc.)

### 5.2 Styling & UI

**TailwindCSS 3.4.x**
```javascript
// Key configuration
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Emerald theme from UX spec
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5',
        },
        // ... full palette
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

**Shadcn/ui**
- 30+ accessible components (Radix UI primitives)
- Copy-paste model (components live in your codebase)
- Full TypeScript support
- Customizable with Tailwind classes
- Dark mode built-in

**Tabler Icons React**
```typescript
import { IconRocket, IconBook, IconUser } from '@tabler/icons-react';

<IconRocket size={24} stroke={2} />
```

**Framer Motion 11.x**
```typescript
// Example animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 5.3 State Management

**Zustand 4.x**
```typescript
// Example store
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**React Query (TanStack Query) - Optional but recommended**
- Server state management
- Automatic caching and revalidation
- Optimistic updates
- Integrates perfectly with Supabase

### 5.4 Backend: Supabase

**Supabase Client Setup**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Key Supabase Features Used:**
- **PostgreSQL Database** - All user data, progress, notes, tasks, comments
- **Authentication** - Email/password + OAuth (Google)
- **Row Level Security** - User data isolation
- **Real-time subscriptions** - Live comments, activity feed
- **Generated TypeScript types** - Type-safe queries

**Supabase CLI for Development:**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local Supabase
supabase init

# Link to remote project
supabase link --project-ref your-project-ref

# Generate TypeScript types from database
supabase gen types typescript --local > src/types/database.ts

# Run migrations
supabase db push
```

### 5.5 Routing

**React Router 6.x**
```typescript
// src/app/routes.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'guides', element: <GuidesLibrary /> },
      { path: 'guides/:slug', element: <GuideReader /> },
      // ... all routes
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
]);
```

### 5.6 Forms & Validation

**React Hook Form + Zod**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  // ... form implementation
}
```

### 5.7 Rich Text Editor

**Tiptap 2.x**
```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    // Auto-save logic
  },
});
```

### 5.8 Search

**Fuse.js 7.x**
```typescript
import Fuse from 'fuse.js';

const fuse = new Fuse(guides, {
  keys: ['title', 'description', 'content'],
  threshold: 0.3,
  includeScore: true,
});

const results = fuse.search('developer');
```

### 5.9 Date Handling

**date-fns 3.x**
```typescript
import { formatDistanceToNow, format } from 'date-fns';
import { he } from 'date-fns/locale';

// Relative time
formatDistanceToNow(date, { addSuffix: true, locale: he });
// "לפני 2 שעות"

// Formatted date
format(date, 'PPP', { locale: he });
// "6 בנובמבר 2025"
```

### 5.10 Charts

**Recharts 2.x**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={analyticsData} width={600} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="users" stroke="#10B981" />
</LineChart>
```

---

## 6. Data Architecture

### 6.1 Complete Database Schema

**(See Product Brief for full SQL schema - 1,600+ lines)**

**Key Tables:**

**profiles** - User profiles (extends Supabase auth.users)
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id)
display_name TEXT NOT NULL
email TEXT UNIQUE
role TEXT  -- selected role from onboarding
interests TEXT[]  -- array of interest topics
experience_level TEXT  -- beginner/intermediate/advanced
theme TEXT DEFAULT 'light'
completed_onboarding BOOLEAN DEFAULT false
is_admin BOOLEAN DEFAULT false
created_at TIMESTAMP
updated_at TIMESTAMP
```

**user_progress** - Learning progress per guide
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
guide_slug TEXT  -- e.g., 'developers', 'quick-start'
guide_category TEXT  -- 'core', 'roles', 'agents', etc.
completed BOOLEAN DEFAULT false
progress_percent INTEGER (0-100)
last_position TEXT  -- heading ID or scroll position
time_spent_seconds INTEGER
last_read_at TIMESTAMP
completed_at TIMESTAMP
UNIQUE(user_id, guide_slug)
```

**user_notes** - Rich text notes
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
guide_slug TEXT  -- nullable for standalone notes
title TEXT NOT NULL
content JSONB  -- Tiptap JSON format
tags TEXT[]
created_at TIMESTAMP
updated_at TIMESTAMP
```

**user_tasks** - Task management with sub-tasks
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
guide_slug TEXT  -- nullable
parent_task_id UUID REFERENCES user_tasks(id)  -- for sub-tasks
title TEXT NOT NULL
description TEXT
status TEXT  -- 'todo', 'in_progress', 'done'
priority TEXT  -- 'high', 'medium', 'low'
position INTEGER  -- for custom ordering
completed_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
```

**guide_comments** - Comments and Q&A
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
guide_slug TEXT NOT NULL
parent_comment_id UUID REFERENCES guide_comments(id)  -- for replies
content TEXT  -- markdown supported
is_question BOOLEAN DEFAULT false
is_solution BOOLEAN DEFAULT false
helpful_count INTEGER DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

**comment_votes** - Track "helpful" votes
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
comment_id UUID REFERENCES guide_comments(id)
created_at TIMESTAMP
UNIQUE(user_id, comment_id)  -- one vote per user per comment
```

**guide_stats** - Aggregate statistics
```sql
guide_slug TEXT PRIMARY KEY
view_count INTEGER
unique_viewers INTEGER
helpful_votes INTEGER
not_helpful_votes INTEGER
avg_time_spent_seconds INTEGER
completion_count INTEGER
comment_count INTEGER
updated_at TIMESTAMP
```

**user_activity** - Activity log for analytics
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
activity_type TEXT  -- 'view_guide', 'complete_guide', 'create_note', etc.
target_slug TEXT  -- guide_slug or resource ID
metadata JSONB  -- additional data
created_at TIMESTAMP
```

**guide_bookmarks** - User bookmarks
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
guide_slug TEXT NOT NULL
created_at TIMESTAMP
UNIQUE(user_id, guide_slug)
```

### 6.2 Row Level Security (RLS) Policies

**Critical Security Pattern:**

Every table has RLS enabled with these policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only modify their own data
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Public data (comments, profiles) viewable by all
CREATE POLICY "Comments are viewable by everyone"
  ON guide_comments FOR SELECT
  USING (true);

-- Admin checks
CREATE POLICY "Admins can view all activity"
  ON user_activity FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 6.3 Database Functions & Triggers

**Auto-update timestamps:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Update comment helpful count:**
```sql
CREATE OR REPLACE FUNCTION update_comment_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guide_comments
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guide_comments
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_helpful_count
AFTER INSERT OR DELETE ON comment_votes
FOR EACH ROW
EXECUTE FUNCTION update_comment_helpful_count();
```

### 6.4 Data Flow Patterns

**Guide Reading Flow:**
1. User opens guide → `GET /guides/{slug}` (JSON from content system)
2. Load progress → `SELECT * FROM user_progress WHERE user_id = ? AND guide_slug = ?`
3. Track activity → `INSERT INTO user_activity (activity_type = 'view_guide')`
4. Update stats → `UPDATE guide_stats SET view_count = view_count + 1`
5. On scroll → Auto-save progress every 30 seconds
6. On complete → Update progress, trigger achievement check

**Notes Creation Flow:**
1. User clicks "Add Note" → Open modal with Tiptap editor
2. Auto-save every 10 seconds → `UPSERT user_notes`
3. On save → Insert into user_activity
4. On close → Final save if dirty

**Real-time Comments:**
```typescript
// Subscribe to new comments
supabase
  .channel('guide-comments')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'guide_comments',
      filter: `guide_slug=eq.${guideSlug}`,
    },
    (payload) => {
      // Add new comment to UI
    }
  )
  .subscribe();
```

---

## 7. Integration Points

### 7.1 Frontend ↔ Supabase Integration

**Authentication Flow:**
```typescript
// lib/auth.ts
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Create profile
  await supabase.from('profiles').insert({
    id: data.user!.id,
    email,
    display_name: email.split('@')[0],
  });
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
```

**Protected Routes:**
```typescript
// components/ProtectedRoute.tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);
  
  if (!user) return <LoadingSpinner />;
  
  return <>{children}</>;
}
```

**Data Fetching Pattern:**
```typescript
// hooks/useProgress.ts
export function useProgress() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
```

### 7.2 Content System Integration

**Loading Guide Content:**
```typescript
// lib/content-loader.ts
export async function loadGuide(slug: string): Promise<Guide> {
  // Import JSON dynamically
  const guideModule = await import(
    `@/content/locale/he/guides/${category}/${slug}.json`
  );
  
  return guideModule.default as Guide;
}

export async function loadGuideCatalog(): Promise<GuideCatalog> {
  const catalogModule = await import('@/content/locale/he/guides/index.json');
  return catalogModule.default as GuideCatalog;
}
```

**Content Renderer:**
```typescript
// components/content/ContentRenderer.tsx
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={index} {...block} />;
          case 'text':
            return <TextBlock key={index} {...block} />;
          case 'code':
            return <CodeBlock key={index} {...block} />;
          case 'callout':
            return <CalloutBlock key={index} {...block} />;
          // ... all 14 block types
          default:
            return null;
        }
      })}
    </>
  );
}
```

### 7.3 Search Integration

**Global Search:**
```typescript
// hooks/useSearch.ts
export function useSearch() {
  const [results, setResults] = useState([]);
  
  // Load all searchable content
  const guides = useGuideCatalog();
  const notes = useNotes();
  const tasks = useTasks();
  
  // Create Fuse instance
  const fuse = useMemo(() => {
    const searchData = [
      ...guides.map(g => ({ type: 'guide', ...g })),
      ...notes.map(n => ({ type: 'note', ...n })),
      ...tasks.map(t => ({ type: 'task', ...t })),
    ];
    
    return new Fuse(searchData, {
      keys: ['title', 'description', 'content'],
      threshold: 0.3,
    });
  }, [guides, notes, tasks]);
  
  const search = useCallback((query: string) => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const fuseResults = fuse.search(query);
    setResults(fuseResults.map(r => r.item));
  }, [fuse]);
  
  return { results, search };
}
```

### 7.4 Analytics Integration

**Tracking User Activity:**
```typescript
// lib/analytics.ts
export async function trackActivity(
  activityType: string,
  targetSlug?: string,
  metadata?: Record<string, any>
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  await supabase.from('user_activity').insert({
    user_id: user.id,
    activity_type: activityType,
    target_slug: targetSlug,
    metadata,
  });
}

// Usage
trackActivity('view_guide', 'developers');
trackActivity('complete_guide', 'developers', { time_spent: 1200 });
trackActivity('create_note', 'developers', { note_length: 250 });
```

---

## 8. Implementation Patterns

### 8.1 Naming Conventions

**Files and Directories:**
- Components: `PascalCase.tsx` (e.g., `GuideCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Utilities: `kebab-case.ts` (e.g., `content-loader.ts`)
- Types: `kebab-case.ts` (e.g., `database.ts`)
- Pages/Routes: `kebab-case.tsx` (e.g., `reset-password.tsx`)

**Database:**
- Tables: `snake_case` plural (e.g., `user_notes`, `guide_comments`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)
- Foreign keys: `{table}_id` (e.g., `user_id`, `guide_id`)

**API/Frontend:**
- React components: `PascalCase` (e.g., `<GuideCard />`)
- Props interfaces: `{ComponentName}Props` (e.g., `GuideCardProps`)
- Functions: `camelCase` (e.g., `loadGuide`, `formatDate`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_GUIDES_PER_PAGE`)
- Enums: `PascalCase` with `PascalCase` values

**Supabase Queries:**
```typescript
// Always use chaining pattern
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);

// Handle errors consistently
if (error) throw error;
```

### 8.2 Component Structure

**Standard Component Pattern:**
```typescript
// components/guides/GuideCard.tsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconBook } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { Guide } from '@/types/guide';

interface GuideCardProps {
  guide: Guide;
  onCardClick?: (guideSlug: string) => void;
}

export function GuideCard({ guide, onCardClick }: GuideCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer overflow-hidden"
        onClick={() => onCardClick?.(guide.slug)}
      >
        {/* Gradient header */}
        <div className="h-44 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <IconBook size={64} stroke={1.5} className="text-white" />
        </div>
        
        {/* Card body */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{guide.description}</p>
          
          {/* Badges */}
          <div className="flex gap-2">
            <Badge variant="secondary">{guide.category}</Badge>
            <Badge variant="outline">{guide.difficulty}</Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
```

### 8.3 Error Handling

**Global Error Boundary:**
```typescript
// components/common/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

**API Error Handling:**
```typescript
// lib/queries.ts
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await queryFn();
  
  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message || 'An error occurred');
  }
  
  if (!data) {
    throw new Error('No data returned');
  }
  
  return data;
}

// Usage
const progress = await safeQuery(() =>
  supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
);
```

**User-Friendly Error Messages:**
```typescript
// lib/utils.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

// Usage in component
try {
  await saveNote(note);
  toast.success('Note saved!');
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

### 8.4 Loading States

**Skeleton Screens (preferred over spinners):**
```typescript
// components/guides/GuideCardSkeleton.tsx
export function GuideCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-44 bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

// Usage
function GuidesLibrary() {
  const { data: guides, isLoading } = useGuides();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => <GuideCardSkeleton key={i} />)}
      </div>
    );
  }
  
  return <div>{/* render guides */}</div>;
}
```

### 8.5 Form Patterns

**Standard Form with Validation:**
```typescript
// app/auth/login.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
      toast.success('התחברת בהצלחה!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          אימייל
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          סיסמה
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'מתחבר...' : 'התחבר'}
      </Button>
    </form>
  );
}
```

### 8.6 RTL (Right-to-Left) Support

**Configuration:**
```typescript
// App.tsx
function App() {
  return (
    <div dir="rtl" lang="he">
      {/* App content */}
    </div>
  );
}
```

```css
/* globals.css */
html[dir="rtl"] {
  direction: rtl;
}

/* Mirror directional icons */
html[dir="rtl"] .icon-mirror {
  transform: scaleX(-1);
}
```

**Tailwind RTL:**
```tsx
// Use logical properties (Tailwind handles automatically with dir="rtl")
<div className="ps-4 pe-2">  {/* padding-inline-start/end */}
<div className="ms-auto">     {/* margin-inline-start */}
<div className="border-s-2">  {/* border-inline-start */}
```

### 8.7 Accessibility Patterns

**Keyboard Navigation:**
```typescript
// components/common/CommandPalette.tsx
export function CommandPalette({ isOpen, onClose }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          selectResult(results[selectedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);
  
  // ... render
}
```

**ARIA Labels:**
```tsx
<button aria-label="חפש במדריכים" onClick={openSearch}>
  <IconSearch size={20} />
</button>

<nav aria-label="ניווט ראשי">
  {/* navigation items */}
</nav>

<div role="status" aria-live="polite">
  {isLoading ? 'טוען...' : `נמצאו ${results.length} תוצאות`}
</div>
```

**Focus Management:**
```typescript
// When opening modal, focus first input
useEffect(() => {
  if (isOpen) {
    const firstInput = dialogRef.current?.querySelector('input');
    firstInput?.focus();
  }
}, [isOpen]);

// Trap focus inside modal
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    // ... trap focus logic
  }
}
```

---

## 9. Consistency Rules

### 9.1 Code Organization

**Import Order:**
```typescript
// 1. React and framework imports
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { IconBook } from '@tabler/icons-react';

// 3. Internal modules (absolute imports)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Guide } from '@/types/guide';

// 4. Relative imports (same directory)
import { GuideCard } from './GuideCard';
import styles from './Guide.module.css';
```

**Component File Structure:**
```typescript
// 1. Imports (see above)

// 2. Types/Interfaces
interface GuideCardProps {
  guide: Guide;
  onCardClick?: (slug: string) => void;
}

// 3. Constants
const MAX_DESCRIPTION_LENGTH = 150;

// 4. Helper functions (outside component)
function truncateDescription(text: string): string {
  // ...
}

// 5. Component
export function GuideCard({ guide, onCardClick }: GuideCardProps) {
  // Hooks first
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    onCardClick?.(guide.slug);
  };
  
  // Render
  return (
    // JSX
  );
}

// 6. Sub-components (if any, or extract to separate file if complex)
```

### 9.2 Git Workflow

**Branch Naming:**
- Feature: `feature/guide-reading-experience`
- Bug fix: `bugfix/progress-tracking-not-saving`
- Hotfix: `hotfix/auth-redirect-loop`
- Refactor: `refactor/consolidate-api-hooks`

**Commit Messages:**
```
feat: add guide reading 3-panel layout
fix: resolve progress tracking race condition
refactor: extract content loader to utility
docs: update architecture with database schema
style: format code with Prettier
test: add unit tests for useProgress hook
chore: upgrade Supabase client to v2.39.0
```

**Pull Request Template:**
```markdown
## What does this PR do?
Brief description of changes

## How to test?
1. Step-by-step testing instructions

## Checklist
- [ ] Code follows naming conventions
- [ ] Added/updated tests
- [ ] Updated TypeScript types
- [ ] Checked for console errors
- [ ] Tested on mobile
- [ ] Tested RTL layout
- [ ] Updated documentation
```

### 9.3 TypeScript Rules

**Strict Mode Enabled:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Patterns:**
```typescript
// ✅ DO: Explicit return types for functions
export function loadGuide(slug: string): Promise<Guide> {
  // ...
}

// ✅ DO: Interface for props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

// ✅ DO: Type inference for simple variables
const userName = 'Ben';  // inferred as string
const count = 42;        // inferred as number

// ❌ DON'T: Use 'any'
function processData(data: any) { // Bad!

// ✅ DO: Use 'unknown' if type truly unknown, then narrow
function processData(data: unknown) {
  if (typeof data === 'string') {
    // data is string here
  }
}

// ✅ DO: Utility types
type OptionalGuide = Partial<Guide>;
type ReadonlyGuide = Readonly<Guide>;
type GuideKeys = keyof Guide;
type GuideValues = Guide[keyof Guide];
```

### 9.4 Performance Rules

**Component Optimization:**
```typescript
// ✅ DO: Memoize expensive computations
const sortedGuides = useMemo(() => {
  return guides.sort((a, b) => a.title.localeCompare(b.title));
}, [guides]);

// ✅ DO: Memoize callbacks passed to child components
const handleCardClick = useCallback((slug: string) => {
  navigate(`/guides/${slug}`);
}, [navigate]);

// ✅ DO: Memo for pure components that receive same props often
export const GuideCard = React.memo(function GuideCard({ guide }: Props) {
  // ...
});

// ✅ DO: Lazy load routes
const Dashboard = lazy(() => import('./app/dashboard'));
const GuidesLibrary = lazy(() => import('./app/guides'));

// In routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/guides" element={<GuidesLibrary />} />
  </Routes>
</Suspense>
```

**Database Query Optimization:**
```typescript
// ✅ DO: Select only needed columns
const { data } = await supabase
  .from('user_progress')
  .select('guide_slug, progress_percent, completed')
  .eq('user_id', userId);

// ❌ DON'T: Select all columns when not needed
const { data } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', userId);

// ✅ DO: Use indexes (defined in migrations)
// CREATE INDEX idx_user_progress_user ON user_progress(user_id);
// CREATE INDEX idx_user_progress_guide ON user_progress(guide_slug);

// ✅ DO: Paginate large result sets
const { data } = await supabase
  .from('guide_comments')
  .select('*')
  .eq('guide_slug', slug)
  .order('created_at', { ascending: false })
  .range(0, 19);  // First 20 comments
```

---

## 10. Security Architecture

### 10.1 Authentication Security

**Supabase Auth Configuration:**
- Email verification required for new accounts
- Password requirements: Min 8 characters, complexity enforced client-side
- JWT tokens stored in httpOnly cookies (Supabase handles automatically)
- Session expiry: 7 days (configurable in Supabase dashboard)
- Refresh token rotation enabled

**OAuth Providers:**
```typescript
// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### 10.2 Authorization (RLS)

**Row Level Security is MANDATORY for all tables.**

Example policies are shown in the Data Architecture section. Key principles:

1. **Default Deny**: No access unless explicitly granted
2. **User Isolation**: Users can only access their own data
3. **Admin Override**: Admins have elevated permissions via profile check
4. **Public Data**: Comments and profiles are viewable by all authenticated users

### 10.3 Input Validation

**Client-Side (Zod schemas):**
```typescript
const noteSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  content: z.object({}).passthrough(),  // Tiptap JSON
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  guide_slug: z.string().optional(),
});
```

**Server-Side (Database constraints):**
```sql
-- Length constraints
title TEXT NOT NULL CHECK (length(title) <= 200)

-- Enum constraints
status TEXT CHECK (status IN ('todo', 'in_progress', 'done'))

-- Range constraints
progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100)

-- NOT NULL constraints where appropriate
```

### 10.4 XSS Prevention

**React Escapes by Default:**
React automatically escapes all strings, preventing XSS. However:

```typescript
// ❌ DANGEROUS: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE: Use libraries for markdown/HTML
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />

// ✅ BETTER: Use React Markdown for content
import ReactMarkdown from 'react-markdown';

<ReactMarkdown>{userMarkdown}</ReactMarkdown>
```

### 10.5 CSRF Protection

**Supabase handles CSRF automatically** via:
- SameSite cookies
- Origin header checking
- JWT token verification

No additional CSRF tokens needed.

### 10.6 Environment Variables

```bash
# .env.local (NEVER commit to git)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# .env.example (committed to git)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Accessing in code:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

---

## 11. Performance Considerations

### 11.1 Bundle Size Optimization

**Current Target:** < 500KB initial JS bundle (gzipped)

**Strategies:**
- Code splitting by route (Vite handles automatically)
- Tree-shaking (import only what's used)
- Dynamic imports for large libraries

```typescript
// ❌ DON'T: Import entire library
import { format, parseISO, formatDistanceToNow } from 'date-fns';

// ✅ DO: Import specific functions (Vite tree-shakes automatically)
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
```

**Analyze Bundle:**
```bash
npm run build
npx vite-bundle-visualizer
```

### 11.2 Rendering Performance

**React Performance:**
- Use `React.memo` for pure components
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed to children
- Avoid inline object/array creation in render
- Use keys properly in lists

**Virtualization for Long Lists:**
```typescript
// For lists > 100 items
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedGuideList({ guides }: { guides: Guide[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: guides.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,  // Estimated card height
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <GuideCard guide={guides[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 11.3 Database Performance

**Indexes (already defined in schema):**
```sql
-- User progress queries
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_guide ON user_progress(guide_slug);

-- Notes queries
CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_user_notes_guide ON user_notes(guide_slug);

-- Activity feed
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);
```

**Query Optimization:**
```typescript
// ✅ DO: Limit result sets
.limit(20)

// ✅ DO: Paginate
.range(startIndex, endIndex)

// ✅ DO: Order at database level
.order('created_at', { ascending: false })

// ❌ DON'T: Fetch all then filter in JavaScript
const allData = await supabase.from('user_notes').select('*');
const filtered = allData.filter(note => note.guide_slug === slug);

// ✅ DO: Filter at database level
const { data } = await supabase
  .from('user_notes')
  .select('*')
  .eq('guide_slug', slug);
```

### 11.4 Image Optimization

**Responsive Images:**
```tsx
<img
  src={imageSrc}
  srcSet={`${imageSrc}?w=400 400w, ${imageSrc}?w=800 800w`}
  sizes="(max-width: 640px) 400px, 800px"
  alt={altText}
  loading="lazy"
/>
```

**WebP Format:**
```tsx
<picture>
  <source srcSet={`${imageSrc}.webp`} type="image/webp" />
  <img src={`${imageSrc}.jpg`} alt={altText} />
</picture>
```

### 11.5 Caching Strategy

**React Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 10 * 60 * 1000,  // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Supabase Caching:**
Supabase uses PostgreSQL connection pooling and query caching automatically.

**Content Caching:**
Guide JSON files are bundled at build time → cached by browser automatically.

---

## 12. Deployment Architecture

### 12.1 Vercel Deployment

**Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Environment Variables (Vercel Dashboard):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Deployment Workflow:**
1. Push to `main` branch → Vercel auto-deploys production
2. Push to `develop` branch → Vercel auto-deploys preview
3. Pull requests → Vercel creates preview deployment with unique URL

### 12.2 Supabase Configuration

**Free Tier Limits:**
- Database: 500MB
- File Storage: 1GB
- Bandwidth: 2GB/month
- API Requests: Unlimited (with rate limiting)
- Concurrent connections: 60

**Project Setup:**
1. Create Supabase project at supabase.com
2. Run migrations: `supabase db push`
3. Generate TypeScript types: `supabase gen types typescript --local > src/types/database.ts`
4. Enable Row Level Security on all tables
5. Configure email templates (welcome, password reset)
6. Set up OAuth providers (Google)

**Monitoring:**
- Supabase Dashboard shows real-time metrics
- Database usage, API requests, active users
- Error logs accessible in dashboard

### 12.3 CI/CD Pipeline

**GitHub Actions (`.github/workflows/ci.yml`):**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
```

### 12.4 Monitoring & Logging

**Error Tracking (Optional - Sentry):**
```typescript
// main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}
```

**Analytics (Optional):**
- Supabase built-in analytics (user activity table)
- Google Analytics (if needed for detailed funnel analysis)

**Console Logging:**
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
};
```

---

## 13. Development Environment Setup

### 13.1 Prerequisites

**Required:**
- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Code editor (VS Code recommended)

**Optional:**
- Supabase CLI (for local database development)
- Docker (if using Supabase local)

### 13.2 VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "supabase.supabase-vscode"
  ]
}
```

### 13.3 Initial Setup Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd agenseek

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Update .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# 5. Generate TypeScript types from Supabase (if using Supabase CLI)
supabase gen types typescript --project-id your-project-id > src/types/database.ts

# 6. Start development server
npm run dev

# 7. Open browser to http://localhost:5173
```

### 13.4 Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 14. Testing Strategy

### 14.1 Testing Pyramid

**Unit Tests (60%):**
- Component logic
- Utility functions
- Custom hooks
- Type correctness

**Integration Tests (30%):**
- Component interactions
- API integration
- State management flows

**End-to-End Tests (10%):**
- Critical user journeys
- Cross-browser compatibility

### 14.2 Testing Tools

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0"
  }
}
```

### 14.3 Unit Test Example

```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../useAuth';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('useAuth', () => {
  it('should return null user when not authenticated', () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('should return user when authenticated', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

### 14.4 Component Test Example

```typescript
// components/guides/__tests__/GuideCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GuideCard } from '../GuideCard';

const mockGuide = {
  slug: 'developers',
  title: 'מדריך למפתחים',
  description: 'מדריך מקיף למפתחים',
  category: 'roles',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
};

describe('GuideCard', () => {
  it('should render guide information', () => {
    render(<GuideCard guide={mockGuide} />);

    expect(screen.getByText('מדריך למפתחים')).toBeInTheDocument();
    expect(screen.getByText('מדריך מקיף למפתחים')).toBeInTheDocument();
  });

  it('should call onCardClick when clicked', () => {
    const handleClick = vi.fn();
    render(<GuideCard guide={mockGuide} onCardClick={handleClick} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith('developers');
  });
});
```

### 14.5 E2E Test Example (Playwright)

```typescript
// e2e/guide-reading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Guide Reading Experience', () => {
  test('should navigate to guide and track progress', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // Navigate to guides
    await page.click('text=Browse Guides');
    await expect(page).toHaveURL('/guides');

    // Click first guide
    await page.click('.guide-card:first-child');

    // Verify guide reader loaded
    await expect(page.locator('.guide-content')).toBeVisible();
    await expect(page.locator('.table-of-contents')).toBeVisible();

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Mark complete
    await page.click('button:has-text("Mark Complete")');

    // Verify confetti animation
    await expect(page.locator('.confetti')).toBeVisible();
  });
});
```

---

## 15. Architecture Decision Records (ADRs)

### ADR-001: Use Vite instead of Create React App

**Status:** Accepted

**Context:**
Need fast development experience with HMR and optimized production builds.

**Decision:**
Use Vite as the build tool instead of Create React App.

**Consequences:**
- ✅ Lightning-fast HMR (< 100ms)
- ✅ Optimized production builds with Rollup
- ✅ Native ESM support
- ✅ Better TypeScript integration
- ⚠️ Slightly different configuration from CRA

---

### ADR-002: Use Supabase for Backend

**Status:** Accepted

**Context:**
Need backend infrastructure (database, auth, real-time) without building custom backend.

**Decision:**
Use Supabase as the complete backend solution.

**Consequences:**
- ✅ No backend development needed
- ✅ Free tier covers all requirements (500MB DB, unlimited API)
- ✅ Row Level Security for data isolation
- ✅ Real-time subscriptions built-in
- ✅ Automatic TypeScript type generation
- ⚠️ Vendor lock-in (but PostgreSQL is exportable)
- ⚠️ Limited to 60 concurrent connections on free tier

---

### ADR-003: JSON-Based Content System

**Status:** Accepted

**Context:**
Need to render 42 learning guides with rich, interactive content blocks.

**Decision:**
Store all guide content as structured JSON with typed content blocks, rather than pure Markdown.

**Consequences:**
- ✅ Dynamic component rendering (charts, accordions, tabs, custom layouts)
- ✅ Type-safe content structure
- ✅ Easy to add new block types
- ✅ Better search indexing
- ✅ Consistent design system enforcement
- ⚠️ Initial migration effort from Markdown to JSON
- ⚠️ Less human-readable than Markdown

---

### ADR-004: Use Shadcn/ui Component System

**Status:** Accepted

**Context:**
Need accessible, customizable UI components that don't bloat the bundle.

**Decision:**
Use Shadcn/ui (copy-paste components) instead of component libraries like MUI or Chakra UI.

**Consequences:**
- ✅ Components live in your codebase (full control)
- ✅ No runtime dependency on component library
- ✅ Built on Radix UI (accessible by default)
- ✅ Fully customizable with Tailwind
- ✅ Smaller bundle size
- ⚠️ Need to copy/update components manually (but rarely needed)

---

### ADR-005: Client-Side Search with Fuse.js

**Status:** Accepted

**Context:**
Need fuzzy search across guides, notes, and tasks. Could use Supabase full-text search or client-side solution.

**Decision:**
Use Fuse.js for client-side fuzzy search.

**Consequences:**
- ✅ Instant results (no network latency)
- ✅ Works offline
- ✅ Flexible scoring and ranking
- ✅ Simple implementation
- ⚠️ All searchable content loaded into memory
- ⚠️ Limited to ~10,000 items (sufficient for this app)

---

### ADR-006: Hebrew (RTL) as Primary Language

**Status:** Accepted

**Context:**
All existing content is in Hebrew, internal Israeli company.

**Decision:**
Build with Hebrew RTL support from day one, with architecture allowing future i18n.

**Consequences:**
- ✅ Natural for target users
- ✅ Proper RTL layout from start (not retrofitted)
- ✅ Tailwind handles RTL automatically with `dir="rtl"`
- ⚠️ Need RTL-aware date formatting (date-fns locale)
- ⚠️ Testing requires Hebrew text

---

### ADR-007: Zustand for State Management

**Status:** Accepted

**Context:**
Need lightweight global state management for auth, theme, UI state.

**Decision:**
Use Zustand instead of Redux or Context API.

**Consequences:**
- ✅ Minimal boilerplate
- ✅ Simple API
- ✅ TypeScript-friendly
- ✅ No providers needed
- ✅ DevTools available
- ⚠️ Less ecosystem than Redux (but sufficient for our needs)

---

## 16. Free Tier Budget Analysis

### 16.1 Estimated Usage

**Database Storage (Supabase Free: 500MB):**
- Users: 100 employees × 5KB = 500KB
- Progress: 100 users × 42 guides × 500B = 2MB
- Notes: 500 notes × 10KB = 5MB
- Tasks: 1,000 tasks × 2KB = 2MB
- Comments: 500 comments × 5KB = 2.5MB
- Activity logs: 10,000 × 1KB = 10MB
- **Total Estimated: ~22MB (4.4% of limit)**

**Bandwidth (Supabase Free: 2GB/month):**
- API requests: ~50KB average response
- 100 active users × 50 requests/day × 30 days = 150,000 requests
- 150,000 × 50KB = 7.5GB **⚠️ EXCEEDS FREE TIER**

**Mitigation:**
- React Query caching (5min stale time) reduces requests by ~70%
- Estimated: 150,000 × 0.3 = 45,000 requests/month
- 45,000 × 50KB = 2.25GB **⚠️ Still slightly over**
- **Solution:** Upgrade to Supabase Pro ($25/month) when hitting limits OR optimize queries further

**Vercel Bandwidth (Free: Unlimited):**
- ✅ No concerns - Vercel free tier has no bandwidth limits for hobby projects

**Concurrent Connections (Supabase Free: 60):**
- 100 employees, peak concurrency ~20-30 users
- **Estimated: 30 connections (50% of limit)** ✅ Safe

### 16.2 Cost Forecast

**Month 1-3 (Development & Launch):**
- Supabase: Free tier ✅
- Vercel: Free tier ✅
- **Total: $0/month**

**Month 4-6 (Growing Usage):**
- Supabase: Likely need Pro ($25/month) if bandwidth exceeds 2GB
- Vercel: Free tier ✅
- **Total: $0-25/month**

**Ongoing (Steady State):**
- Supabase Pro: $25/month (recommended for reliability)
- Vercel: Free tier ✅
- **Total: $25/month**

**Annual Cost: ~$300/year** (very affordable for internal tool)

---

## 17. Migration Path from Markdown to JSON

### 17.1 Content Migration Script

```typescript
// scripts/convert-markdown-to-json.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface GuideMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  icon: string;
  tags: string[];
}

interface ContentBlock {
  type: string;
  [key: string]: any;
}

async function convertMarkdownToJSON(markdownPath: string): Promise<void> {
  // Read markdown file
  const content = await fs.readFile(markdownPath, 'utf-8');
  const { data, content: body } = matter(content);

  // Parse markdown to AST
  const tokens = marked.lexer(body);

  // Convert to content blocks
  const blocks: ContentBlock[] = [];
  
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        blocks.push({
          type: 'heading',
          level: token.depth,
          text: token.text,
          id: slugify(token.text),
        });
        break;
      
      case 'paragraph':
        blocks.push({
          type: 'text',
          content: token.text,
        });
        break;
      
      case 'code':
        blocks.push({
          type: 'code',
          language: token.lang || 'text',
          code: token.text,
          showCopyButton: true,
        });
        break;
      
      case 'list':
        blocks.push({
          type: 'list',
          ordered: token.ordered,
          items: token.items.map(item => item.text),
        });
        break;
      
      // ... handle other block types
    }
  }

  // Create guide object
  const guide = {
    metadata: {
      id: path.basename(markdownPath, '.md'),
      title: data.title,
      description: data.description || extractFirstParagraph(body),
      category: inferCategory(markdownPath),
      difficulty: data.difficulty || 'intermediate',
      estimatedMinutes: data.estimatedMinutes || estimateReadingTime(body),
      icon: data.icon || 'book',
      tags: data.tags || [],
    },
    tableOfContents: generateToC(blocks),
    content: blocks,
  };

  // Write JSON file
  const outputPath = markdownPath.replace('.md', '.json').replace('original-data', 'src/content');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(guide, null, 2));
  
  console.log(`✅ Converted: ${markdownPath} → ${outputPath}`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function generateToC(blocks: ContentBlock[]) {
  return blocks
    .filter(block => block.type === 'heading' && block.level <= 3)
    .map(block => ({
      id: block.id,
      title: block.text,
      level: block.level,
    }));
}

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function extractFirstParagraph(text: string): string {
  const paragraphs = text.split('\n\n');
  return paragraphs.find(p => p.trim().length > 0)?.slice(0, 200) || '';
}

function inferCategory(filePath: string): string {
  if (filePath.includes('roles')) return 'roles';
  if (filePath.includes('agents')) return 'agents';
  if (filePath.includes('workflows')) return 'workflows';
  if (filePath.includes('faq')) return 'faq';
  if (filePath.includes('practical')) return 'practical';
  if (filePath.includes('onboarding')) return 'onboarding';
  return 'core';
}

// Run conversion
async function main() {
  const guidesDir = 'original-data/learning-guides-hebrew';
  const files = await fs.readdir(guidesDir, { recursive: true });
  
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  for (const file of markdownFiles) {
    const fullPath = path.join(guidesDir, file);
    await convertMarkdownToJSON(fullPath);
  }
  
  console.log('✅ Conversion complete!');
}

main().catch(console.error);
```

### 17.2 Running the Migration

```bash
# Install dependencies for migration script
npm install -D gray-matter marked

# Run migration
npx tsx scripts/convert-markdown-to-json.ts

# Verify output
ls -la src/content/locale/he/guides/
```

---

## 18. Next Steps

### 18.1 Immediate (Week 1)

1. ✅ **Project Initialization**
   - Run starter command
   - Install all dependencies
   - Configure TailwindCSS with Emerald theme
   - Set up Shadcn/ui

2. ✅ **Supabase Setup**
   - Create Supabase project
   - Run database migrations
   - Configure RLS policies
   - Generate TypeScript types

3. ✅ **Development Environment**
   - Configure VS Code
   - Set up environment variables
   - Test development server

### 18.2 Phase 1: Foundation (Weeks 2-3)

- Build authentication pages
- Implement onboarding wizard
- Create layout components (Header, Sidebar, Footer)
- Set up routing
- Implement theme system (light/dark mode)

### 18.3 Phase 2: Content System (Weeks 4-6)

- Run content migration script
- Build ContentRenderer with all 14 block types
- Create GuideCard component
- Implement guides library page
- Build guide reader (3-panel layout)

### 18.4 Phase 3: Core Features (Weeks 7-10)

- Progress tracking system
- Notes system with Tiptap
- Tasks system with Kanban board
- Search and command palette
- Dashboard with statistics

### 18.5 Phase 4: Community & Admin (Weeks 11-13)

- Comments and Q&A system
- Real-time updates
- Admin analytics dashboard
- User management

### 18.6 Phase 5: Polish & Launch (Weeks 14-15)

- Responsive design refinement
- Accessibility audit
- Performance optimization
- E2E testing
- Deploy to production

---

## 19. Conclusion

This technical architecture provides a **complete blueprint** for building Agenseek, the BMAD Learning Hub. The architecture is designed for:

✅ **Rapid Development** - Modern stack with excellent DX
✅ **Type Safety** - TypeScript throughout
✅ **Scalability** - Architecture supports growth
✅ **Free Hosting** - Within free tier limits (or affordable upgrade)
✅ **Maintainability** - Clear patterns and conventions
✅ **Accessibility** - WCAG 2.1 AA compliant
✅ **Performance** - Optimized for speed
✅ **Security** - Row Level Security, input validation

**Key Strengths:**
- Vite + React + TypeScript foundation is battle-tested
- Supabase eliminates backend development
- JSON content system enables rich, interactive guides
- Shadcn/ui provides accessible, customizable components
- Clear consistency rules prevent agent conflicts

**Ready for Implementation:**
All architectural decisions are documented with rationale. The project structure is complete. Implementation patterns are defined. Database schema is ready. AI agents can now build this confidently and consistently.

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Author:** Winston (Architect Agent)  
**Next Review:** After Phase 1 completion

---

_This architecture was created following the BMAD Method Decision Architecture Workflow, ensuring comprehensive coverage of all technical decisions needed for consistent AI-agent implementation._