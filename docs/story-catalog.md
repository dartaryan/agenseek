# Agenseek - Complete Story Catalog

**Total Stories:** 66  
**Format:** Quick reference for all stories with acceptance criteria  
**For detailed stories:** See individual files in `docs/stories/`  

---

## Epic 2: Authentication & Onboarding (10 stories)

### Story 2.1: Build Login Page
**Sprint:** 2 | **Points:** 2 | **Priority:** P0  
**User Story:** As a user, I want to log in with my email and password, so that I can access my personalized learning experience.  
**Key AC:** Form with email/password, validation with Zod, React Hook Form, redirect to dashboard on success, error toasts, "Remember me" checkbox, forgot password link, Google OAuth button  
**Dependencies:** Epic 1 complete  

### Story 2.2: Build Registration Page
**Sprint:** 2 | **Points:** 3 | **Priority:** P0  
**User Story:** As a new user, I want to register for an account with email verification, so that I can start learning BMAD.  
**Key AC:** Form with display name, email, password, confirm password; password strength indicator; email verification sent; profile created in database  
**Dependencies:** 2.1  

### Story 2.3: Build Password Reset Flow
**Sprint:** 2 | **Points:** 2 | **Priority:** P0  
**User Story:** As a user who forgot my password, I want to reset my password via email link, so that I can regain access.  
**Key AC:** Email input form, sends reset link, token validation, new password form, success redirect to login  
**Dependencies:** 2.2  

### Story 2.4: Build Google OAuth Integration
**Sprint:** 2 | **Points:** 2 | **Priority:** P1  
**User Story:** As a user, I want to sign in with my Google account, so that I can access the platform without creating a new password.  
**Key AC:** Google sign-in button, OAuth flow, automatic profile creation, redirect to onboarding or dashboard  
**Dependencies:** 2.3  

### Story 2.5: Build Onboarding Wizard - Step 1 (Welcome)
**Sprint:** 2 | **Points:** 2 | **Priority:** P0  
**User Story:** As a new user completing registration, I want a welcoming introduction, so that I understand what Agenseek offers.  
**Key AC:** Full-screen wizard, progress dots (1/5), welcome message, animated illustration, primary "Let's personalize" button, "Do later" link  
**Dependencies:** 2.4  

### Story 2.6: Build Onboarding Wizard - Step 2 (Select Role)
**Sprint:** 3 | **Points:** 2 | **Priority:** P0  
**User Story:** As a new user, I want to select my role, so that the platform can recommend relevant content.  
**Key AC:** Progress dots (2/5), 9 role cards (Developer, PM, Designer, Architect, etc.), single selection, emerald border on selection, next button enabled after selection  
**Dependencies:** 2.5  

### Story 2.7: Build Onboarding Wizard - Step 3 (Select Interests)
**Sprint:** 3 | **Points:** 2 | **Priority:** P0  
**User Story:** As a new user, I want to select my learning interests, so that I receive personalized guide recommendations.  
**Key AC:** Progress dots (3/5), 8 interest topic chips (multi-select), toggle selection, no minimum required, filled emerald background when selected  
**Dependencies:** 2.6  

### Story 2.8: Build Onboarding Wizard - Step 4 (Experience Level)
**Sprint:** 3 | **Points:** 2 | **Priority:** P0  
**User Story:** As a new user, I want to indicate my experience level, so that content difficulty matches my skill level.  
**Key AC:** Progress dots (4/5), 3 cards (Beginner, Intermediate, Advanced), single selection, hover animations, next button enabled after selection  
**Dependencies:** 2.7  

### Story 2.9: Build Onboarding Wizard - Step 5 (Learning Path Generated)
**Sprint:** 3 | **Points:** 3 | **Priority:** P0  
**User Story:** As a new user, I want to see my personalized learning path generated, so that I know which guides to read first.  
**Key AC:** Progress dots (5/5), loading animation, staggered guide list reveal (Core, Recommended, Interests, Optional), save preferences to profile, confetti celebration, success toast  
**Dependencies:** 2.8  

### Story 2.10: Implement Protected Routes and Onboarding Redirect Logic
**Sprint:** 3 | **Points:** 2 | **Priority:** P0  
**User Story:** As a system, I want to automatically redirect users based on onboarding status, so that new users complete onboarding before accessing the platform.  
**Key AC:** Check completed_onboarding flag, redirect logic (not authenticated → login, authenticated but not onboarded → onboarding, authenticated and onboarded → allow), logout clears auth state  
**Dependencies:** 2.9  

---

## Epic 3: Dynamic Content Rendering (10 stories)

### Story 3.1: Define TypeScript Types for Content Blocks
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** Create content/schemas/component.types.ts with 14 block type interfaces, discriminated unions, Guide type with metadata  
**Dependencies:** Epic 2 complete  

### Story 3.2: Build Content Renderer Orchestrator
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** ContentRenderer component accepts blocks array, switches on block type, dispatches to specific components, error boundary for invalid blocks  
**Dependencies:** 3.1  

### Story 3.3: Build Core Block Components (Heading, Text, List)
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** HeadingBlock (h1-h6, id for ToC), TextBlock (markdown inline), ListBlock (ol/ul, nested), RTL-aware, semantic HTML  
**Dependencies:** 3.2  

### Story 3.4: Build Code Block with Syntax Highlighting
**Sprint:** 4 | **Points:** 3 | **Priority:** P0  
**Key AC:** react-syntax-highlighter, language badge, filename, line numbers, highlighted lines, copy button with feedback, dark theme aware  
**Dependencies:** 3.3  

### Story 3.5: Build Callout Block Component
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** 4 variants (info/warning/success/error), colored icon and border, optional title, content can be text or blocks  
**Dependencies:** 3.4  

### Story 3.6: Build Table Block Component
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** Semantic table HTML, caption, zebra striping, column alignment, responsive (horizontal scroll on mobile)  
**Dependencies:** 3.5  

### Story 3.7: Build Accordion Block Component
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** Shadcn/ui Accordion, multiple items, allowMultiple option, chevron animation, smooth height transition, content can be blocks  
**Dependencies:** 3.6  

### Story 3.8: Build Tabs Block Component
**Sprint:** 4 | **Points:** 2 | **Priority:** P0  
**Key AC:** Shadcn/ui Tabs, horizontal tab list, active tab highlighted with emerald underline, keyboard navigation, content transition  
**Dependencies:** 3.7  

### Story 3.9: Build Chart Block Component
**Sprint:** 4 | **Points:** 3 | **Priority:** P1  
**Key AC:** Recharts library, supports line/bar/area/pie charts, responsive sizing, tooltip on hover, data props with xKey/yKey  
**Dependencies:** 3.8  

### Story 3.10: Build Remaining Blocks (Grid, Card, Image, Video)
**Sprint:** 4 | **Points:** 3 | **Priority:** P1  
**Key AC:** GridBlock (1-4 columns, responsive), CardBlock (Shadcn/ui with variants), ImageBlock (lazy loading, caption), VideoBlock (responsive aspect ratio)  
**Dependencies:** 3.9  

---

## Epic 4: Guide Library & Discovery (8 stories)

### Story 4.1: Create Guide JSON Content Catalog
**Sprint:** 5 | **Points:** 2 | **Priority:** P0  
**Key AC:** Create content/locale/he/guides/index.json with metadata for all 42 guides (id, title, description, category, difficulty, estimatedMinutes, icon, tags, path)  
**Dependencies:** Epic 3 complete  

### Story 4.2: Migrate Sample Guide Content to JSON
**Sprint:** 5 | **Points:** 3 | **Priority:** P0  
**Key AC:** Convert 3 sample guides from markdown to JSON (quick-start, developers role, intro-pm-analyst), include metadata, tableOfContents, content array with variety of block types  
**Dependencies:** 4.1  

### Story 4.3: Build Guide Card Component
**Sprint:** 5 | **Points:** 3 | **Priority:** P0  
**Key AC:** Visual card with gradient header (180px) with icon, title, description (2 lines truncated), category/difficulty badges, footer with time + progress, action button, hover lift animation with emerald glow  
**Dependencies:** 4.2  

### Story 4.4: Build Guides Library Page with Filtering
**Sprint:** 5 | **Points:** 3 | **Priority:** P0  
**Key AC:** /guides route, header with count and view toggle, left sidebar filters (category, difficulty, status), guide card grid (responsive 1-4 cols), sorting dropdown (recommended/alphabetical/recent/popular), active filter chips  
**Dependencies:** 4.3  

### Story 4.5: Build Guide Reader 3-Panel Layout
**Sprint:** 6 | **Points:** 3 | **Priority:** P0  
**Key AC:** /guides/:slug route, 3 panels (ToC 20%, content 60%, actions 20%), ToC with current section highlight and progress dots, content area with breadcrumbs and action bar, actions sidebar with progress circle and mark complete button, scroll progress bar at top  
**Dependencies:** 4.4  

### Story 4.6: Implement Progress Tracking on Guide Read
**Sprint:** 6 | **Points:** 3 | **Priority:** P0  
**Key AC:** Track scroll position, calculate progress %, time spent, auto-save every 30 seconds to user_progress table, log activity, update guide stats, resume at saved position on reload  
**Dependencies:** 4.5  

### Story 4.7: Implement Mark Complete with Celebration
**Sprint:** 6 | **Points:** 2 | **Priority:** P0  
**Key AC:** Mark complete button, confirmation dialog, update user_progress (completed=true, progress_percent=100, completed_at), insert activity, update guide stats, confetti animation, success modal with next guide recommendation  
**Dependencies:** 4.6  

### Story 4.8: Build Breadcrumbs and Navigation Components
**Sprint:** 6 | **Points:** 2 | **Priority:** P1  
**Key AC:** Breadcrumbs (Home > Category > Guide), clickable links, RTL chevron, responsive collapse on mobile, bottom pagination (previous/next guide), keyboard arrows for navigation, related guides section  
**Dependencies:** 4.7  

---

## Epic 5: Progress & Achievements (8 stories)

### Story 5.1: Build Dashboard Home Page
**Sprint:** 7 | **Points:** 3 | **Priority:** P0  
**Key AC:** /dashboard route, welcome message, 3-column responsive grid (progress & achievements, quick actions, community & activity), overall progress card, continue reading section, quick action buttons  
**Dependencies:** Epic 4 complete  

### Story 5.2: Build Overall Progress Tracking System
**Sprint:** 7 | **Points:** 2 | **Priority:** P0  
**Key AC:** Large circular progress indicator, percentage and count, category breakdown accordion (Core/Recommended/Interests/Optional), progress bars per category, checkmark for 100% complete  
**Dependencies:** 5.1  

### Story 5.3: Build Achievement Badge System
**Sprint:** 7 | **Points:** 3 | **Priority:** P0  
**Key AC:** Achievement types (Bronze/Silver/Gold badges, Category Master, Week/Month Streak, Quick Learner, Note Taker, Task Master), badge display with earned (color+glow) vs locked (grayscale+lock), unlock animation with confetti, badge modal  
**Dependencies:** 5.2  

### Story 5.4: Build Continue Reading Section
**Sprint:** 7 | **Points:** 2 | **Priority:** P0  
**Key AC:** Shows last 3 in-progress guides (0% < progress < 100%), displays icon, title, progress bar, continue button, time since last read, last position indicator, sorted by last_read_at DESC  
**Dependencies:** 5.3  

### Story 5.5: Build Activity Feed
**Sprint:** 7 | **Points:** 2 | **Priority:** P0  
**Key AC:** Last 10 activities chronologically, activity types (view_guide, complete_guide, create_note, create_task, earn_achievement), icon + description + link + timestamp, grouped by day headers  
**Dependencies:** 5.4  

### Story 5.6: Build Statistics Widgets
**Sprint:** 7 | **Points:** 2 | **Priority:** P0  
**Key AC:** Your Statistics card with total reading time (hours:minutes), guides completed count, notes created count, tasks completed count, current streak (consecutive days), trend indicators, sparkline charts  
**Dependencies:** 5.5  

### Story 5.7: Build Popular Guides Widget
**Sprint:** 7 | **Points:** 2 | **Priority:** P1  
**Key AC:** Top 5 most viewed guides last 7 days, displays icon, title, view count, trend indicator (flame if increasing), "Trending" badge for top 3  
**Dependencies:** 5.6  

### Story 5.8: Build Full Progress Details Page
**Sprint:** 7 | **Points:** 2 | **Priority:** P1  
**Key AC:** /progress route, hero with overall progress, category breakdown (expandable), full guide list with status (not started/in progress/completed), time spent, date completed, action buttons, filters (all/in progress/completed), PDF export option  
**Dependencies:** 5.7  

---

## Epic 6: Notes & Tasks (8 stories)

### Story 6.1: Build Rich Text Note Editor
**Sprint:** 8 | **Points:** 3 | **Priority:** P0  
**Key AC:** Tiptap editor modal, toolbar (bold/italic/strike/headings/lists/code/link/undo/redo), markdown shortcuts, keyboard shortcuts, fields (title, content, tags, associated guide), auto-save every 10 seconds, save to user_notes with JSON content  
**Dependencies:** Epic 5 complete  

### Story 6.2: Build Notes Library Page
**Sprint:** 8 | **Points:** 3 | **Priority:** P0  
**Key AC:** /notes route, header with count and "New Note" button, search bar, filters (by guide, by tags, date range), sort options (recent/created/alphabetical/by guide), 3-column card grid, card shows title (inline editable), content preview, tags, guide link, timestamps, edit/delete actions  
**Dependencies:** 6.1  

### Story 6.3: Implement Quick Note from Guide
**Sprint:** 8 | **Points:** 2 | **Priority:** P0  
**Key AC:** "Add Note" button in guide action bar, modal pre-fills guide, selected text pre-fills as blockquote, floating "Add to Note" tooltip on text selection, save shows toast and updates count  
**Dependencies:** 6.2  

### Story 6.4: Build Task Management System
**Sprint:** 8 | **Points:** 3 | **Priority:** P0  
**Key AC:** /tasks route, header with status counts and "New Task" button, view tabs (all/by guide/kanban/by priority), task card with checkbox (toggle status), title (inline editable), description, priority dot, status badge, guide link, sub-tasks progress, created date, edit/delete actions  
**Dependencies:** 6.3  

### Story 6.5: Build Task Creation Modal
**Sprint:** 9 | **Points:** 3 | **Priority:** P0  
**Key AC:** Task modal form with title, description (markdown), priority dropdown, status dropdown, associated guide, sub-tasks section with add/remove/drag reorder, save creates task and sub-tasks, toast notification  
**Dependencies:** 6.4  

### Story 6.6: Build Task Kanban Board
**Sprint:** 9 | **Points:** 3 | **Priority:** P0  
**Key AC:** Kanban tab with 3 columns (To Do, In Progress, Done), drag-and-drop tasks between columns (@dnd-kit), drop updates status in DB, compact task cards, click card opens modal, empty column state  
**Dependencies:** 6.5  

### Story 6.7: Implement Task Quick Actions from Guide
**Sprint:** 9 | **Points:** 2 | **Priority:** P0  
**Key AC:** "Create Task" button in guide action bar, modal pre-fills associated guide, quick save with Ctrl+Enter, task appears in My Tasks, count updates, can store current heading as context  
**Dependencies:** 6.6  

### Story 6.8: Build Task and Note Statistics Dashboard
**Sprint:** 9 | **Points:** 2 | **Priority:** P1  
**Key AC:** My Notes Summary (total count, top 5 tags, notes created this week trend, associated guides count), My Tasks Summary (status counts, completion rate %, high priority count, tasks created vs completed chart), visual bar chart and tag cloud  
**Dependencies:** 6.7  

---

## Epic 7: Search & Command Palette (5 stories)

### Story 7.1: Implement Global Search Infrastructure
**Sprint:** 10 | **Points:** 2 | **Priority:** P0  
**Key AC:** Create lib/search.ts with Fuse.js config, search index (guides, notes, tasks), useSearch hook with debounced search (300ms), returns search function and results with type/score/matches  
**Dependencies:** Epic 6 complete  

### Story 7.2: Build Header Search Bar
**Sprint:** 10 | **Points:** 3 | **Priority:** P0  
**Key AC:** Search bar in header, dropdown on typing (debounced 300ms), shows top 5 results per type (guides/notes/tasks sections), result displays icon, title (highlighted), snippet (highlighted), metadata badges, keyboard navigation (up/down/enter/esc), "View all results" link  
**Dependencies:** 7.1  

### Story 7.3: Build Search Results Page
**Sprint:** 10 | **Points:** 2 | **Priority:** P0  
**Key AC:** /search?q={query} route, search input pre-filled, result count, filter tabs (all/guides/notes/tasks), sort dropdown (relevance/recent/alphabetical), results grouped by type, full snippet (3-4 lines highlighted), pagination (20 per page), empty state with suggestions  
**Dependencies:** 7.2  

### Story 7.4: Build Command Palette (Ctrl+K)
**Sprint:** 10 | **Points:** 3 | **Priority:** P0  
**Key AC:** Modal overlay on Ctrl+K (Cmd+K Mac), large search input, shows quick actions when empty (create task/note, view pages, toggle theme), shows search results when typing (top 5 guides, 3 notes, 3 tasks), keyboard nav (up/down/enter/esc/tab), executes commands or navigates, recent searches when empty  
**Dependencies:** 7.3  

### Story 7.5: Implement Search Keyboard Shortcuts
**Sprint:** 10 | **Points:** 2 | **Priority:** P1  
**Key AC:** Global shortcuts work (Ctrl+K palette, Ctrl+F focus search, Ctrl+T new task, Ctrl+N new note, Esc close, Alt+1-5 nav pages, / focus search), shortcuts show hints in UI, detect OS for Cmd vs Ctrl  
**Dependencies:** 7.4  

---

## Epic 8: Community Features (6 stories)

### Story 8.1: Build Comment Thread System
**Sprint:** 11 | **Points:** 3 | **Priority:** P0  
**Key AC:** Comments section below guide content, header with count, sort dropdown (recent/most helpful), comment thread displays avatar, name, text (markdown), timestamp, helpful button, reply button, mark as question button, edit/delete (own comments), 1-level replies indented, load more (20 initial), real-time updates  
**Dependencies:** Epic 7 complete  

### Story 8.2: Build Comment Form and Submission
**Sprint:** 11 | **Points:** 2 | **Priority:** P0  
**Key AC:** "Add Comment" expands form, textarea (auto-expanding), markdown guide (collapsible), preview tab, toggle comment/question, character count (max 5000), submit inserts to guide_comments, logs activity, toast, scrolls to new comment, updates count  
**Dependencies:** 8.1  

### Story 8.3: Implement Comment Voting (Helpful)
**Sprint:** 11 | **Points:** 2 | **Priority:** P0  
**Key AC:** "Helpful" button on comments, click records vote in comment_votes, increments helpful_count, button changes to filled emerald, toggle to remove vote, can't vote on own comments, sorts by helpful_count when "Most Helpful" selected  
**Dependencies:** 8.2  

### Story 8.4: Build Q&A Functionality
**Sprint:** 11 | **Points:** 3 | **Priority:** P0  
**Key AC:** Question comments have orange border and "Question" badge, replies can be marked as "Solution" (only by question author), solution gets green checkmark + "Solution" label, floats to top of replies, Q&A filter toggle (show questions only), group unanswered/answered  
**Dependencies:** 8.3  

### Story 8.5: Implement Comment Edit and Delete
**Sprint:** 11 | **Points:** 2 | **Priority:** P0  
**Key AC:** Edit button (pencil) on hover (own comments), click makes textarea editable, save/cancel buttons, updates comment and updated_at, shows "(edited)" label, delete button (trash), confirmation dialog, deletes from DB, fade-out animation, parent with replies shows "[Comment deleted]" placeholder  
**Dependencies:** 8.4  

### Story 8.6: Build Comment Notifications and Activity
**Sprint:** 11 | **Points:** 2 | **Priority:** P1  
**Key AC:** Activity logged when reply posted or solution marked, dashboard feed shows "X replied to your comment" and "Your answer was marked as solution", badge count in header with dropdown, clicking navigates to comment thread  
**Dependencies:** 8.5  

---

## Epic 9: Admin Analytics & Management (6 stories)

### Story 9.1: Build Admin Dashboard Overview
**Sprint:** 12 | **Points:** 3 | **Priority:** P0  
**Key AC:** /admin route (admins only), stats cards (total users, total guides viewed, active users last 30 days, avg completion rate), activity graph (daily active users, guide views per day), popular guides table (top 10), recent activity (last 50), date range filter, export CSV button  
**Dependencies:** Epic 8 complete  

### Story 9.2: Build User Management Page
**Sprint:** 12 | **Points:** 3 | **Priority:** P0  
**Key AC:** /admin/users route, searchable table (name, email, role, joined date, last active, progress %), search bar, sort by columns, pagination (50 per page), expand row shows user details (profile, progress, activity, notes/tasks counts, view as user, delete user buttons), bulk actions (export CSV)  
**Dependencies:** 9.1  

### Story 9.3: Build Content Analytics Page
**Sprint:** 12 | **Points:** 3 | **Priority:** P0  
**Key AC:** /admin/analytics route, guide performance table (all 42 guides with views, unique viewers, avg time, completion rate, helpful votes, comments count), sort by metrics, filter by category, color coding (green/yellow/red engagement), engagement metrics summary (total notes/tasks/comments, avg session duration), category performance bar chart, export CSV  
**Dependencies:** 9.2  

### Story 9.4: Build User Engagement Report
**Sprint:** 12 | **Points:** 3 | **Priority:** P0  
**Key AC:** User segmentation (highly engaged 70%+, moderately engaged 30-70%, low engagement <30%, at risk never onboarded), segment counts and %, engagement funnel (registered → onboarded → first guide → 5 guides → all core complete), drop-off rates, activity heatmap (day vs hour), cohort analysis (by registration month), export user lists per segment  
**Dependencies:** 9.3  

### Story 9.5: Implement Admin Notifications and Alerts
**Sprint:** 12 | **Points:** 2 | **Priority:** P1  
**Key AC:** Admin bell icon with badge count, notification types (new user daily digest, inappropriate content flagged immediate, low engagement weekly, performance issues, milestones), dropdown shows recent notifications, click for details/action, mark as read, clear all, configurable preferences  
**Dependencies:** 9.4  

### Story 9.6: Build Admin Action Log
**Sprint:** 12 | **Points:** 2 | **Priority:** P1  
**Key AC:** /admin/logs route, action log table (admin user, action type, target, timestamp, IP, details), searchable and filterable (admin, action type, date range), export log as CSV, retention 1 year minimum, RLS (admins only)  
**Dependencies:** 9.5  

---

## Epic 10: Responsive & Accessibility (5 stories)

### Story 10.1: Implement Mobile-Responsive Navigation
**Sprint:** 13 | **Points:** 3 | **Priority:** P0  
**Key AC:** Mobile (<640px) header adapts (smaller logo, hamburger menu, user avatar, search icon opens modal), hamburger opens drawer from right (RTL) with slide-in, full nav menu, close button, backdrop dims, large touch targets (48x48px min), optional bottom nav bar (fixed with icons for home/guides/search/profile)  
**Dependencies:** Epic 9 complete  

### Story 10.2: Optimize Guide Reader for Mobile
**Sprint:** 13 | **Points:** 3 | **Priority:** P0  
**Key AC:** Mobile layout adapts (ToC hidden, floating button opens bottom sheet, content full width), reading optimizations (18px font, 1.8 line height, 24px padding, responsive images, scrollable tables/code), touch gestures (swipe right/left for sections), sticky bottom action bar (add note/task/complete icons), text readable without zooming  
**Dependencies:** 10.1  

### Story 10.3: Implement Accessibility Compliance (WCAG 2.1 AA)
**Sprint:** 13 | **Points:** 3 | **Priority:** P0  
**Key AC:** Keyboard nav (all elements focusable, logical tab order, focus indicators 2px emerald, skip to main, modal focus trap, esc closes), screen reader support (semantic HTML, alt text, aria-labels, associated labels, error messages announced, descriptive page titles, logical heading hierarchy), color contrast (4.5:1 normal, 3:1 large, tested in dark mode), touch targets (44x44px min, 8px spacing), motion (respect prefers-reduced-motion), passes axe DevTools  
**Dependencies:** 10.2  

### Story 10.4: Optimize Performance for Mobile Networks
**Sprint:** 13 | **Points:** 3 | **Priority:** P0  
**Key AC:** Performance targets (FCP <2.5s on 3G, TTI <5s, LCP <4s, CLS <0.1, bundle <500KB gzipped), optimizations (code splitting by route, lazy loading heavy components, image lazy loading, virtual scrolling >100 items, debounced handlers, React.memo, useMemo, service worker caching optional), loading states (skeleton screens, progressive loading, optimistic UI), network resilience (retry failed requests 3x, cache API responses, queue offline actions optional), Lighthouse >90  
**Dependencies:** 10.3  

### Story 10.5: Build Responsive Dashboard and Grid Layouts
**Sprint:** 13 | **Points:** 3 | **Priority:** P0  
**Key AC:** Mobile (<640px) single column, tablet (640-1024) 2 columns, desktop (1024-1440) 3 columns, wide (>1440) 4 column guides grid with max-width 1536px, modals (mobile full-screen, tablet/desktop centered with max-width), responsive images (srcset, lazy loading, WebP with fallback), responsive typography (scales on smaller screens, 45-75 char line length), no horizontal scrolling (except intentional like tables), tested on real devices  
**Dependencies:** 10.4  

---

## Story Completion Checklist

For each story, verify:

- [ ] All acceptance criteria met
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (keyboard, screen reader)
- [ ] Tested in Chrome and Firefox
- [ ] RTL layout correct
- [ ] Integrated with previous stories (no regressions)
- [ ] Code committed and deployed

---

**Document Version:** 1.0  
**Date:** November 6, 2025  
**Author:** Bob (Scrum Master)

