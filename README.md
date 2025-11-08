# Agenseek - BMAD Learning Hub

A comprehensive learning platform for the BMAD Method and agile workflows, featuring personalized learning paths, progress tracking, achievements, and community features.

**Status:** 52/70 stories complete (74%) | Epic 3 Complete ✅ | Epic 6 In Progress 🔨

---

## 🎯 For Dev Agents: What Should I Implement Next?

### → See: [`docs/CURRENT-STATUS.md`](./docs/CURRENT-STATUS.md) or [`NEXT-STORY.md`](./NEXT-STORY.md)

**Current Next Story:** Story 6.2 - Build Notes Library Page (P0)

---

## 🚀 Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + Shadcn/ui components
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Supabase Auth
- **Deployment:** Vercel
- **State:** React Query + Context
- **Routing:** React Router v6
- **Animations:** Framer Motion

---

## 📚 Documentation

All project documentation is in the [`docs/`](./docs/) folder:

- **[docs/CURRENT-STATUS.md](./docs/CURRENT-STATUS.md)** - Current sprint status & next story
- **[docs/README.md](./docs/README.md)** - Documentation index
- **[docs/brief.md](./docs/brief.md)** - Product brief
- **[docs/architecture.md](./docs/architecture.md)** - Technical architecture
- **[docs/ux-design-specification.md](./docs/ux-design-specification.md)** - UX/UI design system
- **[docs/story-catalog.md](./docs/story-catalog.md)** - All 70 stories
- **[docs/sprint-plan.md](./docs/sprint-plan.md)** - 15-week sprint plan

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp supabase/env-template.txt .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 📊 Project Progress

- ✅ **Epic 1:** Project Foundation (12/12) - COMPLETE
- ⏸️ **Epic 2:** Authentication & Onboarding (11/12) - 92% COMPLETE
- ✅ **Epic 3:** Dynamic Content Rendering (10/10) - COMPLETE
- ⏸️ **Epic 4:** Guide Library & Discovery (7/8) - 88% COMPLETE
- ✅ **Epic 5:** Progress & Achievements (11/11) - COMPLETE
- 🔨 **Epic 6:** Notes & Tasks (1/8) - 13% COMPLETE (IN PROGRESS)
- ❌ **Epic 7:** Search & Command (0/5) - NOT STARTED
- ❌ **Epic 8:** Community (0/6) - NOT STARTED
- ❌ **Epic 9:** Admin (0/6) - NOT STARTED
- ❌ **Epic 10:** Responsive & A11y (0/5) - NOT STARTED

---

## 🎯 Key Features

### Completed
- ✅ User authentication and registration
- ✅ Password reset flow
- ✅ Account deletion feature
- ✅ Personalized onboarding wizard with role/interest selection
- ✅ Dynamic content rendering system (14 block types)
- ✅ Guide library with filtering and discovery
- ✅ Guide reader with 3-panel layout
- ✅ Progress tracking and statistics
- ✅ Dashboard with achievements and activity feed
- ✅ Full Hebrew localization with Tabler Icons (auth flows)
- ✅ Rich text note editor with Tiptap

### In Progress
- 🔨 Notes library with search and management (Story 6.2)
- 🔨 Task management system

### Pending P0
- ⏸️ Guide completion flow with celebrations (Story 4.7)

### Planned
- 📋 Task management with kanban board
- 🔍 Global search and command palette
- 💬 Comments and Q&A on guides
- 👑 Admin analytics and management
- 📱 Mobile optimization and accessibility
- 🎨 Additional content blocks (Grid, Card, Image, Video)

---

## 🏗️ Architecture Highlights

### Database Schema
- 9 core tables with RLS policies
- Real-time subscriptions for live updates
- Cascade deletion for data integrity

### Content System
- JSON-based guide content with 14 block types
- Markdown support with syntax highlighting
- RTL-aware layouts for Hebrew

### Authentication
- Email/password with verification
- Protected routes with onboarding checks
- Profile management

---

## 🌐 Deployment

**Production URL:** [Deployed on Vercel]

```bash
# Build and deploy
npm run build
# Deployed automatically via Vercel Git integration
```

---

## 📝 Contributing

### Workflow for Implementing Stories

1. Check [`docs/CURRENT-STATUS.md`](./docs/CURRENT-STATUS.md) for next story
2. Read story details from [`docs/story-catalog.md`](./docs/story-catalog.md)
3. Implement according to acceptance criteria
4. Create `STORY-X.X-COMPLETE.md` documenting changes
5. Update [`docs/CURRENT-STATUS.md`](./docs/CURRENT-STATUS.md) with new next story

---

## 📄 License

[Your License Here]

---

## 🙏 Credits

Built with the BMAD Method by the BMAD team.

---

## Vite + React + TypeScript

This project is built with React 18, TypeScript, and Vite with HMR and ESLint.

**Plugins:**
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
