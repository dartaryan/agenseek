# Agenseek - Remaining Epics (5-10)

**Continuation of Epic Breakdown**  
**See:** `epics.md` for Epics 1-4

---

## Epic 5: Progress Tracking & Achievements

**Goal:** Build a comprehensive dashboard that visualizes learning progress, tracks statistics, and rewards users with achievement badges to drive engagement and motivation.

**Business Value:** Gamification elements (progress tracking, achievements, streaks) create habit formation and increase platform engagement. Visual progress motivates users to complete their learning paths.

**Duration:** Week 7

---

### Story 5.1: Build Dashboard Home Page

As a user,
I want a personalized dashboard that shows my learning progress at a glance,
So that I feel motivated to continue and know what to do next.

**Acceptance Criteria:**

**Given** I log in and navigate to `/dashboard`
**When** the dashboard loads
**Then**:
- Welcome message: "שלום, {display_name}! 👋"
- 3-column responsive grid (stacks on mobile/tablet)
- **Column 1 (40%): Progress & Achievements**
  - Overall progress card with large circular indicator
  - "X out of 42 guides completed"
  - Breakdown by category (Core: 2/2 ✓, Recommended: 3/7, etc.)
  - Continue Reading section (last 3 in-progress guides)
  - Achievement badges display (Bronze/Silver/Gold)
- **Column 2 (30%): Quick Actions**
  - Search guides quick input
  - My Tasks summary (count by status)
  - My Notes summary (total count, last 3 previews)
  - "View All" links for each section
- **Column 3 (30%): Community & Activity**
  - Recent personal activity feed (last 5 actions)
  - Popular guides this week (top 3 most viewed)
  - Your statistics (reading time, notes created, tasks completed)

**And** dashboard updates in real-time when progress changes

**Prerequisites:** Epic 4 complete

**Technical Notes:**
- Use React Query for data fetching with 5-minute cache
- Fetch data from: profiles, user_progress, user_notes, user_tasks, user_activity, guide_stats
- Circular progress: Use SVG or library like `react-circular-progressbar`
- Framer Motion for stagger animation on card load
- Responsive: 3 cols desktop, 2 cols tablet, 1 col mobile

---

### Story 5.2: Build Overall Progress Tracking System

As a user,
I want to see my overall learning progress across all categories,
So that I understand how far I've come and what's left to learn.

**Acceptance Criteria:**

**Given** I have completed some guides
**When** viewing the progress card on dashboard
**Then**:
- Large circular progress indicator (120px diameter)
- Percentage: "36% complete"
- Count: "15 of 42 guides"
- Category breakdown accordion:
  - Core (2/2) ✓ - 100% complete - green
  - Recommended (3/7) - 43% complete - yellow
  - Interests (5/15) - 33% complete - orange
  - Optional (5/18) - 28% complete - gray
- Each category shows:
  - Progress bar
  - Count and percentage
  - Checkmark if 100% complete
- "View Details" link opens full progress page

**And** clicking category navigates to filtered guide library

**Prerequisites:** Story 5.1

**Technical Notes:**
- Calculate from user_progress table: `COUNT(CASE WHEN completed = true) / COUNT(*)`
- Category assignment based on onboarding data (role, interests)
- Animate progress circle from 0 to actual % on mount
- Use Framer Motion's `useSpring` for smooth counting animation

---

### Story 5.3: Build Achievement Badge System

As a user,
I want to earn achievement badges for completing learning milestones,
So that I feel recognized for my progress and motivated to earn more.

**Acceptance Criteria:**

**Given** I complete learning milestones
**When** the system checks for achievements
**Then**:
- **Achievement Types:**
  - **Bronze Badge:** Complete all Core guides (2/2)
  - **Silver Badge:** Complete Core + Recommended guides
  - **Gold Badge:** Complete 100% of all guides (42/42)
  - **Category Master:** Complete all guides in a category
  - **Week Streak:** 7-day learning streak
  - **Month Streak:** 30-day learning streak
  - **Quick Learner:** Complete guide in under estimated time
  - **Note Taker:** Create 10+ notes
  - **Task Master:** Complete 25+ tasks
- Badge display on dashboard:
  - Earned badges: Full color with glow effect
  - Locked badges: Grayscale with lock icon
  - Progress towards next badge (e.g., "3 more guides for Silver")
- Unlock animation: Scale + bounce + confetti
- Badge modal shows:
  - Badge image
  - Achievement name
  - Description
  - Date earned
  - "Share" button (optional)

**And** earning a badge triggers celebration animation

**Prerequisites:** Story 5.2

**Technical Notes:**
- Store achievements in database: `user_achievements` table (badge_id, earned_at)
- Check achievements after guide completion, note creation, task completion
- Badge assets: SVG or PNG images for each badge
- Framer Motion for unlock animation
- Confetti on badge unlock using canvas-confetti

---

### Story 5.4: Build Continue Reading Section

As a user,
I want quick access to guides I'm currently reading,
So that I can easily resume where I left off.

**Acceptance Criteria:**

**Given** I have guides in progress
**When** viewing the Continue Reading section
**Then**:
- Shows last 3 guides with progress > 0% and < 100%
- Each entry displays:
  - Guide icon and title
  - Progress bar with percentage
  - "Continue" button
  - Time since last read (e.g., "2 hours ago")
  - Last position indicator (e.g., "Section 3 of 7")
- Sorted by most recently accessed (last_read_at DESC)
- Click "Continue" button → navigates to guide at saved position
- If no in-progress guides: Show "Start your first guide!" CTA

**And** guides update to show current progress in real-time

**Prerequisites:** Story 5.3

**Technical Notes:**
- Query: `SELECT * FROM user_progress WHERE user_id = ? AND completed = false AND progress_percent > 0 ORDER BY last_read_at DESC LIMIT 3`
- Use date-fns for relative time: `formatDistanceToNow(last_read_at, { addSuffix: true, locale: he })`
- Progress bar component with emerald fill
- Card click navigates to `/guides/:slug#last_position`

---

### Story 5.5: Build Activity Feed

As a user,
I want to see my recent learning activities,
So that I can review what I've been working on.

**Acceptance Criteria:**

**Given** I have performed learning activities
**When** viewing the activity feed on dashboard
**Then**:
- Shows last 10 activities chronologically
- Activity types displayed:
  - **view_guide:** "Opened {guide_title}" - book icon
  - **complete_guide:** "Completed {guide_title} 🎉" - checkmark icon
  - **create_note:** "Added note on {guide_title}" - note icon
  - **create_task:** "Created task: {task_title}" - task icon
  - **earn_achievement:** "Earned {badge_name} badge!" - star icon
- Each activity shows:
  - Icon (Tabler)
  - Action description
  - Related item link (clickable)
  - Relative timestamp
- Activities grouped by day with date headers
- "View All Activity" link to full activity page

**And** clicking activity item navigates to related guide/note/task

**Prerequisites:** Story 5.4

**Technical Notes:**
- Query: `SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`
- Activity type icons map:
  - view_guide: IconBook
  - complete_guide: IconCircleCheck
  - create_note: IconNote
  - create_task: IconChecklist
  - earn_achievement: IconTrophy
- Use date-fns for grouping by day: `format(created_at, 'PPP', { locale: he })`

---

### Story 5.6: Build Statistics Widgets

As a user,
I want to see my learning statistics,
So that I can understand my engagement and progress over time.

**Acceptance Criteria:**

**Given** I have been using the platform
**When** viewing statistics widgets
**Then**:
- **Your Statistics Card** shows:
  - Total reading time (hours:minutes) - calculated from user_progress.time_spent_seconds
  - Guides completed (count with trend arrow if increasing)
  - Notes created (total count)
  - Tasks completed (completed / total)
  - Current streak (consecutive days with activity)
- Statistics displayed as cards with icons
- Trend indicators: ↑ increasing, ↓ decreasing, → stable
- Comparison to previous week/month (optional)
- Visual representation: Small sparkline charts for trends

**And** statistics update when new activities are logged

**Prerequisites:** Story 5.5

**Technical Notes:**
- Total reading time: `SUM(time_spent_seconds) / 3600` from user_progress
- Guides completed: `COUNT(*) WHERE completed = true`
- Current streak: Calculate from user_activity dates (consecutive days)
- Use Recharts for sparkline charts (optional)
- Format time: `const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60);`

---

### Story 5.7: Build Popular Guides Widget

As a user,
I want to see what guides are popular with others,
So that I can discover trending content.

**Acceptance Criteria:**

**Given** the platform has usage data
**When** viewing Popular Guides This Week widget
**Then**:
- Shows top 5 most viewed guides in last 7 days
- Each guide displays:
  - Icon and title
  - View count this week
  - Trend indicator (🔥 if views increasing)
  - "Trending" badge for top 3
- Clicking guide navigates to guide reader
- Updates daily based on guide_stats

**And** I can see if a guide I haven't read is popular

**Prerequisites:** Story 5.6

**Technical Notes:**
- Query guide_stats: `SELECT * FROM guide_stats ORDER BY view_count DESC LIMIT 5`
- For "this week" filtering, need to track weekly view_count or calculate from user_activity
- Consider adding `weekly_views` column to guide_stats (updated via trigger)
- Flame icon (🔥) for guides with > 50% view increase week-over-week

---

### Story 5.8: Build Full Progress Details Page

As a user,
I want a dedicated page showing all my progress details,
So that I can review my complete learning journey.

**Acceptance Criteria:**

**Given** I want detailed progress information
**When** I navigate to `/progress` or click "View Details" on dashboard
**Then**:
- Page shows:
  - Hero section with overall progress (large circular indicator)
  - Category breakdown (expandable sections)
  - Full guide list by category showing:
    - Guide icon, title
    - Status: Not Started / In Progress (X%) / Completed ✓
    - Time spent reading
    - Date completed (if applicable)
    - Action button: Start / Continue / Review
  - Timeline view (optional): Chronological completion history
  - Achievements section: All earned badges with dates
- Filters: Show All / In Progress / Completed
- Export option: Download progress report as PDF

**And** I can quickly navigate to any guide from this page

**Prerequisites:** Story 5.7

**Technical Notes:**
- Fetch all user_progress records for user
- Join with guide catalog for metadata
- Group by category
- Timeline uses user_progress.completed_at for chronological display
- PDF export: Use library like `jsPDF` or browser print with styled HTML

---

## Epic 6: Personal Learning Workspace (Notes & Tasks)

**Goal:** Provide users with powerful tools to capture insights (notes with rich text editor) and manage action items (tasks with sub-tasks and kanban board) integrated with their learning.

**Business Value:** Active learning (note-taking, task creation) increases retention and application of knowledge. Personal workspace creates "stickiness" - users store value in the platform they don't want to lose.

**Duration:** Weeks 8-9

---

### Story 6.1: Build Rich Text Note Editor

As a user,
I want to create notes with rich formatting while reading guides,
So that I can capture insights and highlight key information.

**Acceptance Criteria:**

**Given** I want to create a note
**When** I open the note editor modal
**Then**:
- Modal overlay with note editor (centered desktop, full-screen mobile)
- **Tiptap rich text editor** with toolbar:
  - Bold, Italic, Strikethrough
  - Headings: H1, H2, H3
  - Lists: Bullet list, Numbered list
  - Code: Inline code, Code block
  - Link: Add/edit/remove
  - Utilities: Undo, Redo, Clear formatting
- Editor supports:
  - Markdown shortcuts (e.g., ## for H2, ** for bold)
  - Keyboard shortcuts (Ctrl+B for bold, etc.)
  - Paste formatting from clipboard
- Fields:
  - Title input (required, max 200 chars)
  - Content editor (rich text, required)
  - Tags input (multi-select with autocomplete from existing tags)
  - Associated guide (auto-filled if opened from guide, dropdown to change)
- Auto-save indicator: "Saving..." / "Saved" / "Not saved"
- Auto-save every 10 seconds
- Actions: Save & Close (Ctrl+S), Cancel

**And** I can open editor from guide reader "Add Note" button

**And** notes save to `user_notes` table with Tiptap JSON content

**Prerequisites:** Epic 5 complete

**Technical Notes:**
- Use Tiptap React with StarterKit extensions
- Additional extensions: Link, Code, CodeBlock
- Toolbar component: Custom UI with Shadcn/ui buttons
- Store content as JSONB in database (Tiptap's JSON format)
- Auto-save: useEffect with setTimeout, debounced to 10s
- Tags autocomplete: Query distinct tags from existing user_notes

---

### Story 6.2: Build Notes Library Page

As a user,
I want to view and manage all my notes in one place,
So that I can review my captured insights.

**Acceptance Criteria:**

**Given** I navigate to `/notes`
**When** the notes library loads
**Then**:
- Page header:
  - Title: "הרשומות שלי" (My Notes)
  - Total count
  - "New Note" button (primary)
- Search bar: "חפש ברשומות..." (Search notes...)
- Filters:
  - By guide (dropdown)
  - By tags (multi-select)
  - Date range (optional)
- Sort options:
  - Recent (last updated)
  - Created date
  - Alphabetical
  - By guide
- Notes displayed as 3-column grid (responsive):
  - Each note card shows:
    - Title (editable inline on hover)
    - Content preview (first 3 lines, plain text)
    - Tags (colored chips, clickable to filter)
    - Associated guide link
    - Created/updated timestamps
    - Quick actions: Edit (opens modal), Delete (with confirmation)
- Click card body → opens editor modal
- Empty state: "No notes yet. Start capturing insights!"

**And** search filters notes in real-time by title and content

**Prerequisites:** Story 6.1

**Technical Notes:**
- Query: `SELECT * FROM user_notes WHERE user_id = ? ORDER BY updated_at DESC`
- Search: Use Fuse.js for client-side fuzzy search
- Note preview: Strip HTML/formatting from Tiptap JSON, take first 200 chars
- Inline title edit: contentEditable on hover with auto-save
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

---

### Story 6.3: Implement Quick Note from Guide

As a user,
I want to quickly create a note while reading a guide,
So that I can capture insights without leaving the page.

**Acceptance Criteria:**

**Given** I am reading a guide
**When** I click "Add Note" button in action bar
**Then**:
- Note editor modal opens
- Guide field pre-filled with current guide
- If text is selected on page: Pre-fill content with selected text (as blockquote)
- Title defaults to guide title (editable)
- Focus automatically moves to content editor
- Can add additional content and formatting
- Save creates note and shows toast: "Note saved!"
- Modal closes on save
- Notes count badge updates in header

**And** selecting text on page shows floating "Add to Note" tooltip

**Prerequisites:** Story 6.2

**Technical Notes:**
- Detect text selection: `window.getSelection().toString()`
- Floating tooltip: Position absolutely near selection, use Framer Motion for appear/disappear
- Pre-fill as blockquote in Tiptap: `editor.commands.setBlockquote()`
- Quick action button in guide reader action bar

---

### Story 6.4: Build Task Management System

As a user,
I want to create and manage tasks with sub-tasks,
So that I can track action items from my learning.

**Acceptance Criteria:**

**Given** I want to manage learning tasks
**When** I navigate to `/tasks`
**Then**:
- Page header:
  - Title: "המשימות שלי" (My Tasks)
  - Count by status: To Do (X) / In Progress (Y) / Done (Z)
  - "New Task" button (primary)
- View tabs:
  - All Tasks (list view)
  - By Guide (grouped view)
  - Kanban (drag-and-drop board)
  - By Priority (High/Medium/Low sections)
- Task card displays:
  - Checkbox (toggle status: todo → in_progress → done)
  - Title (editable inline)
  - Description (expandable)
  - Priority indicator (colored dot: red/yellow/green)
  - Status badge
  - Associated guide link
  - Sub-tasks progress: "3/5 completed"
  - Created date
  - Quick actions: Edit, Delete, Add Sub-task
- Click task → opens task modal for full editing

**And** checking task marks it as done with strikethrough animation

**Prerequisites:** Story 6.3

**Technical Notes:**
- Query: `SELECT * FROM user_tasks WHERE user_id = ? AND parent_task_id IS NULL ORDER BY status, priority, created_at`
- Sub-tasks query: `SELECT * FROM user_tasks WHERE parent_task_id = ?`
- Status toggle cycles: todo → in_progress → done
- Inline edit: Similar pattern to notes (contentEditable with auto-save)

---

### Story 6.5: Build Task Creation Modal

As a user,
I want to create detailed tasks with sub-tasks and metadata,
So that I can plan my learning actions effectively.

**Acceptance Criteria:**

**Given** I click "New Task" or "Create Task" from guide
**When** the task modal opens
**Then**:
- Modal form with fields:
  - Title (required, max 200 chars)
  - Description (textarea, optional, markdown supported)
  - Priority dropdown: High / Medium / Low (default: Medium)
  - Status dropdown: To Do / In Progress / Done (default: To Do)
  - Associated guide (optional dropdown, pre-filled if from guide)
  - Sub-tasks section:
    - "Add Sub-task" button
    - List of sub-tasks (each with title and checkbox)
    - Drag handle to reorder
    - Delete button for each
- Sub-task management:
  - Add new sub-task: Input field + "Add" button
  - Each sub-task saves as separate record with parent_task_id
  - Can check/uncheck sub-tasks
- Actions: Save (creates task), Cancel
- On save:
  - Insert into user_tasks table
  - Insert sub-tasks with parent_task_id
  - Log activity
  - Show toast: "Task created!"
  - Close modal

**And** I can create tasks from guides with guide pre-filled

**Prerequisites:** Story 6.4

**Technical Notes:**
- Form validation with Zod schema
- Sub-tasks: Array state, map to multiple INSERT queries
- Drag-and-drop: Use `@dnd-kit/core` or HTML5 drag API
- Position field stores order: 1, 2, 3... for custom sorting
- Priority colors: High (red-500), Medium (yellow-500), Low (green-500)

---

### Story 6.6: Build Task Kanban Board

As a user,
I want to visualize my tasks in a kanban board,
So that I can see workflow and easily move tasks between statuses.

**Acceptance Criteria:**

**Given** I am on the Tasks page
**When** I switch to "Kanban" tab
**Then**:
- 3-column board layout:
  - **To Do:** Tasks with status='todo'
  - **In Progress:** Tasks with status='in_progress'
  - **Done:** Tasks with status='done'
- Each column shows:
  - Header with title and count
  - Task cards (compact view):
    - Title
    - Priority dot
    - Associated guide icon (small)
    - Sub-tasks count if any
- Drag-and-drop functionality:
  - Can drag task card from one column to another
  - Drop updates task status in database
  - Smooth animation on drop
  - Optimistic UI update
- Click task card → opens task modal for editing
- Empty column state: "No tasks" with icon

**And** dragging task between columns updates status instantly

**Prerequisites:** Story 6.5

**Technical Notes:**
- Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop
- Each column is a droppable zone
- Task cards are draggable items
- On drop: `UPDATE user_tasks SET status = ? WHERE id = ?`
- Framer Motion for smooth card transitions
- Mobile: Swipe gesture to move between columns

---

### Story 6.7: Implement Task Quick Actions from Guide

As a user,
I want to quickly create tasks while reading guides,
So that I can capture action items without interrupting my flow.

**Acceptance Criteria:**

**Given** I am reading a guide
**When** I click "Create Task" button in action bar
**Then**:
- Task modal opens
- Associated guide pre-filled with current guide
- Title focus for quick entry
- Can quickly add task and close (Ctrl+Enter to save)
- Task appears in My Tasks section
- Task count badge updates in header

**And** I can create tasks from specific guide sections (use heading as context)

**Prerequisites:** Story 6.6

**Technical Notes:**
- Quick action button in guide reader
- Store current heading ID in task metadata (optional) for context
- Keyboard shortcut: Ctrl+T to open task modal from guide
- Show task count in guide metadata: "3 tasks from this guide"

---

### Story 6.8: Build Task and Note Statistics Dashboard

As a user,
I want to see statistics about my notes and tasks,
So that I can understand my learning habits and productivity.

**Acceptance Criteria:**

**Given** I have created notes and tasks
**When** viewing My Learning section on dashboard
**Then**:
- **My Notes Summary Card:**
  - Total notes count
  - Most used tags (top 5)
  - Notes created this week (trend)
  - Associated guides count (how many guides have notes)
  - "View All Notes" button
- **My Tasks Summary Card:**
  - Tasks by status: To Do / In Progress / Done counts
  - Completion rate percentage
  - High priority tasks count (with red indicator if > 5)
  - Tasks created vs completed this week (chart)
  - "View All Tasks" button
- Visual representations:
  - Small bar chart for task completion over time (7 days)
  - Tag cloud or list for popular note tags

**And** clicking summary cards navigates to full pages

**Prerequisites:** Story 6.7

**Technical Notes:**
- Query aggregations:
  - Notes: `SELECT COUNT(*), tags FROM user_notes WHERE user_id = ? GROUP BY tags`
  - Tasks: `SELECT status, COUNT(*) FROM user_tasks WHERE user_id = ? GROUP BY status`
- Completion rate: `(done_count / total_count) * 100`
- Weekly trend: Filter by `created_at >= NOW() - INTERVAL '7 days'`
- Use Recharts for small chart visualizations

---

## Epic 7: Global Search & Command Palette

**Goal:** Implement instant search across all content (guides, notes, tasks) and a power-user command palette (Ctrl+K) for quick navigation and actions.

**Business Value:** Search reduces friction in finding content. Command palette delights power users and creates "wow" moments that drive word-of-mouth.

**Duration:** Week 10

---

### Story 7.1: Implement Global Search Infrastructure

As a developer,
I want search infrastructure with Fuse.js,
So that users can find content across guides, notes, and tasks.

**Acceptance Criteria:**

**Given** I need to enable search functionality
**When** I set up search infrastructure
**Then**:
- Create `src/lib/search.ts` with:
  - Fuse.js configuration
  - Search index builder
  - Type definitions for search results
- Search index includes:
  - All guide metadata (title, description, content preview)
  - All user notes (title, content)
  - All user tasks (title, description)
- Fuse.js configuration:
  - Keys: title (weight: 3), description (weight: 2), content (weight: 1)
  - Threshold: 0.3 (fuzzy matching)
  - Include score and matches
  - Limit: 50 results
- Create `src/hooks/useSearch.ts`:
  - Hook that builds index from all content
  - Returns search function and results
  - Debounced search (300ms)
  - Loading state management

**And** search updates when content changes (notes, tasks added/edited)

**Prerequisites:** Epic 6 complete

**Technical Notes:**
- Install fuse.js: `npm install fuse.js`
- Build index: Combine guide catalog + user_notes + user_tasks
- Use useMemo to cache Fuse instance
- Debounce with lodash.debounce or custom hook
- Search result type: `{ item: Guide | Note | Task, type: 'guide' | 'note' | 'task', score: number, matches: [] }`

---

### Story 7.2: Build Header Search Bar

As a user,
I want a persistent search bar in the header,
So that I can quickly find content from any page.

**Acceptance Criteria:**

**Given** I am on any page
**When** I use the header search bar
**Then**:
- Search bar in header (right side, RTL: left side)
- Input with icon: "חפש..." (Search...)
- Dropdown appears below input when typing (debounced 300ms)
- Dropdown shows top 5 results per type:
  - **Guides** section (icon: book)
  - **Notes** section (icon: note)
  - **Tasks** section (icon: checklist)
- Each result displays:
  - Type icon and badge
  - Title (highlighted matching text)
  - Snippet (2 lines, matching text highlighted)
  - Metadata (guide: category badge, note: tags, task: status)
- Keyboard navigation:
  - Up/Down arrows to select
  - Enter to navigate to selected result
  - Esc to close dropdown
- "View all X results" link at bottom
- Click outside closes dropdown

**And** search highlights match text with emerald background

**Prerequisites:** Story 7.1

**Technical Notes:**
- Dropdown: Shadcn/ui Popover or custom positioned div
- Highlight matches: Use Fuse.js matches data to wrap in `<mark>` tags
- Keyboard nav: Track selectedIndex state, handle keydown events
- Search while typing: Call useSearch hook with debounced query
- Mobile: Search expands to full width on focus, collapses on blur

---

### Story 7.3: Build Search Results Page

As a user,
I want a dedicated search results page for comprehensive results,
So that I can explore all matches beyond the quick dropdown.

**Acceptance Criteria:**

**Given** I perform a search
**When** I click "View all results" or press Enter with empty selection
**Then**:
- Navigate to `/search?q={query}`
- Page layout:
  - Search input at top (pre-filled with query)
  - Result count: "Found X results for '{query}'"
  - Filter tabs: All / Guides / Notes / Tasks
  - Sort dropdown: Relevance / Recent / Alphabetical
- Results grouped by type (expandable sections)
- Each result shows:
  - Full title (highlighted)
  - Full snippet (3-4 lines, highlighted)
  - Metadata and badges
  - "Open" button or clickable card
- Pagination if > 50 results
- Empty state: "No results found. Try different keywords."
- Search suggestions for no results

**And** clicking result navigates to guide/note/task

**Prerequisites:** Story 7.2

**Technical Notes:**
- URL query param: `const { q } = useSearchParams()`
- Filter results by type: `results.filter(r => r.type === selectedType)`
- Expandable sections: Use Accordion or collapsible divs
- Highlight: Same logic as dropdown
- Pagination: Show 20 results per page

---

### Story 7.4: Build Command Palette (Ctrl+K)

As a power user,
I want a command palette for quick actions and navigation,
So that I can accomplish tasks without using the mouse.

**Acceptance Criteria:**

**Given** I want quick access to actions
**When** I press Ctrl+K (or Cmd+K on Mac)
**Then**:
- Modal overlay appears with command palette
- Large search input: "Type a command or search..."
- Shows grouped results:
  - **Quick Actions** (when empty):
    - Create New Task (icon + shortcut hint)
    - Create New Note
    - View Dashboard
    - View All Guides
    - View My Notes
    - View My Tasks
    - Go to Settings
    - Go to Profile
    - Toggle Theme (Light/Dark)
  - **Search Results** (when typing):
    - Guides (top 5)
    - Notes (top 3)
    - Tasks (top 3)
- Keyboard navigation:
  - Up/Down arrows to navigate
  - Enter to execute command/open item
  - Esc to close palette
  - Tab to switch between groups
- Recent searches shown when empty (last 5)
- Command execution:
  - Actions execute immediately (e.g., toggle theme, create task modal)
  - Search results navigate to item

**And** pressing Ctrl+K again closes the palette

**Prerequisites:** Story 7.3

**Technical Notes:**
- Use Shadcn/ui Command component (built on cmdk)
- Global keyboard listener: `useEffect` with keydown on window
- Prevent default browser Ctrl+K behavior
- Command list: Array of `{ id, label, icon, action: () => void }`
- Actions can be navigation: `navigate('/path')` or functions: `() => setTheme()`
- Store recent searches in localStorage

---

### Story 7.5: Implement Search Keyboard Shortcuts

As a power user,
I want keyboard shortcuts for search and navigation,
So that I can work faster without interrupting my flow.

**Acceptance Criteria:**

**Given** I want to use keyboard shortcuts
**When** I press shortcut keys
**Then** the following shortcuts work:
- **Ctrl+K (Cmd+K):** Open command palette
- **Ctrl+F (Cmd+F):** Focus header search bar
- **Ctrl+T (Cmd+T):** Create new task (opens modal)
- **Ctrl+N (Cmd+N):** Create new note (opens modal)
- **Esc:** Close modals, dropdowns, palettes
- **Alt+1 to Alt+5:** Navigate to Dashboard, Guides, Notes, Tasks, Profile
- **/ (forward slash):** Focus search (like GitHub)
- In search/palette:
  - **Up/Down:** Navigate results
  - **Enter:** Select result
  - **Tab:** Switch groups
  - **Esc:** Close

**And** shortcuts show hints in UI (tooltips, command palette)

**And** shortcuts work globally on all pages

**Prerequisites:** Story 7.4

**Technical Notes:**
- Global keyboard listener in App.tsx or layout
- Detect OS for Cmd vs Ctrl: `navigator.platform.includes('Mac')`
- Prevent default for browser shortcuts where needed
- Display hints: Add keyboard shortcut text to buttons/links (e.g., "⌘K" badge)
- Use `event.key` for detection, handle modifier keys

---

## Epic 8: Community Features (Comments & Q&A)

**Goal:** Enable users to ask questions, share insights, and help each other through comments and Q&A on guides, fostering a collaborative learning community.

**Business Value:** Community features create engagement beyond individual learning. Users become invested in helping others, increasing retention. Q&A creates valuable user-generated content.

**Duration:** Week 11

---

### Story 8.1: Build Comment Thread System

As a user,
I want to comment on guides to share insights and ask questions,
So that I can learn from and help other users.

**Acceptance Criteria:**

**Given** I am reading a guide
**When** I scroll to the comments section (below guide content)
**Then**:
- Section header: "שאלות ודיון" (Questions & Discussion) with count
- "Add Comment" button (primary)
- Sort dropdown: Recent / Most Helpful
- Comment thread displays all comments:
  - User avatar (initials + color)
  - Display name
  - Comment text (markdown supported)
  - Relative timestamp (e.g., "2 hours ago")
  - "Helpful" button with count (one vote per user)
  - "Reply" button (1-level threading)
  - "Mark as Question" button
  - Edit/Delete buttons (own comments only)
- Comments with replies show indented:
  - Parent comment
  - └─ Reply 1
  - └─ Reply 2
- Load more: Show 20 comments initially, "Load More" button for more

**And** real-time updates when new comments added (Supabase real-time)

**Prerequisites:** Epic 7 complete

**Technical Notes:**
- Query: `SELECT * FROM guide_comments WHERE guide_slug = ? ORDER BY created_at DESC`
- Join with profiles for user info
- Real-time: `supabase.channel('guide-comments').on('INSERT', ...)`
- Threading: parent_comment_id field, max 1 level deep
- Markdown: Use react-markdown for safe rendering

---

### Story 8.2: Build Comment Form and Submission

As a user,
I want to easily write and submit comments,
So that I can contribute to discussions.

**Acceptance Criteria:**

**Given** I want to add a comment
**When** I click "Add Comment" button
**Then**:
- Comment form expands:
  - Textarea (auto-expanding, min 3 rows)
  - Markdown formatting guide (collapsible)
  - "Preview" tab to see formatted comment
  - Toggle: "Comment" / "Ask Question" (changes is_question flag)
  - "Submit" button (primary)
  - "Cancel" button
- Character count shown (max 5000 chars)
- On submit:
  - Validate: Not empty, under limit
  - Insert into guide_comments table
  - Log activity
  - Show toast: "Comment added!"
  - Clear form
  - Scroll to new comment (highlight briefly)
  - Update comment count
- Question toggle:
  - If checked: Comment displays with yellow/orange border
  - Shows "Question" badge
  - Prioritized in sorting

**And** I can preview markdown formatting before submitting

**Prerequisites:** Story 8.1

**Technical Notes:**
- Auto-expanding textarea: Adjust height based on scrollHeight
- Markdown preview: Use react-markdown
- Insert: `supabase.from('guide_comments').insert({ user_id, guide_slug, content, is_question })`
- Activity log: `INSERT INTO user_activity (activity_type='post_comment')`
- Scroll to comment: `element.scrollIntoView({ behavior: 'smooth', block: 'center' })`

---

### Story 8.3: Implement Comment Voting (Helpful)

As a user,
I want to mark helpful comments,
So that valuable insights rise to the top.

**Acceptance Criteria:**

**Given** I see a helpful comment
**When** I click the "Helpful" button
**Then**:
- Vote is recorded in comment_votes table (user_id, comment_id)
- Comment helpful_count increments by 1 (via trigger)
- Button state changes: filled icon, emerald color
- Tooltip shows: "You found this helpful"
- Clicking again removes vote (toggle)
- Can only vote once per comment (database constraint)
- Comments sorted by helpful_count when "Most Helpful" selected

**And** I cannot vote on my own comments

**And** most helpful comments appear at top when sorted

**Prerequisites:** Story 8.2

**Technical Notes:**
- Insert vote: `supabase.from('comment_votes').insert({ user_id, comment_id })`
- Delete vote: `supabase.from('comment_votes').delete().match({ user_id, comment_id })`
- Trigger updates helpful_count automatically (defined in database schema)
- Disable button for own comments: `comment.user_id === currentUser.id`
- Icon: Tabler IconThumbUp (outline when not voted, filled when voted)

---

### Story 8.4: Build Q&A Functionality

As a user asking a question,
I want to mark questions and solutions,
So that helpful answers are highlighted.

**Acceptance Criteria:**

**Given** I posted a question (is_question = true)
**When** someone replies with a helpful answer
**Then**:
- Question comments have distinct styling:
  - Yellow/orange left border (4px)
  - "Question" badge
  - Orange background tint
- Replies to questions can be marked as "Solution":
  - "Mark as Solution" button (only question author can mark)
  - Once marked: Green checkmark badge + "Solution" label
  - Green left border
  - Solution floats to top of replies
- Q&A filter toggle:
  - "Show Questions Only" checkbox in sort area
  - When enabled: Only show question threads
  - Group: Unanswered / Answered (has solution)
- Question author gets notification when reply posted (optional enhancement)

**And** solved questions show "✓ Answered" badge in comment list

**Prerequisites:** Story 8.3

**Technical Notes:**
- Add is_solution boolean field to guide_comments
- Mark solution: Only if comment.parent_comment_id = question.id AND current_user = question.author
- Update: `supabase.from('guide_comments').update({ is_solution: true }).eq('id', reply_id)`
- Sort solutions: ORDER BY is_solution DESC, helpful_count DESC
- Filter questions: WHERE is_question = true

---

### Story 8.5: Implement Comment Edit and Delete

As a user,
I want to edit or delete my own comments,
So that I can correct mistakes or remove content.

**Acceptance Criteria:**

**Given** I posted a comment
**When** I want to edit or delete it
**Then**:
- Edit button (pencil icon) appears on hover (own comments only)
- Click edit:
  - Comment text becomes textarea
  - "Save" and "Cancel" buttons appear
  - Can modify text
  - Save updates comment and updated_at timestamp
  - Shows "edited" label with timestamp
- Delete button (trash icon) appears on hover
- Click delete:
  - Confirmation dialog: "Delete comment? This cannot be undone."
  - On confirm: DELETE from guide_comments
  - Comment removed from UI with fade-out animation
  - If parent comment with replies: Show "[Comment deleted]" placeholder
  - Decrement guide comment count

**And** edited comments show "(edited)" timestamp

**And** deleting parent comment keeps replies (with placeholder)

**Prerequisites:** Story 8.4

**Technical Notes:**
- Edit: Inline editing, replace content div with textarea
- Update: `supabase.from('guide_comments').update({ content, updated_at: NOW() }).eq('id', comment_id)`
- Show edited: Display "(edited)" if updated_at > created_at + 1 minute
- Delete with replies: Soft delete or replace content with "[Comment deleted by user]"
- Hard delete if no replies: `DELETE FROM guide_comments WHERE id = ?`

---

### Story 8.6: Build Comment Notifications and Activity

As a user,
I want to know when someone replies to my comments or marks my reply as solution,
So that I can engage in discussions.

**Acceptance Criteria:**

**Given** someone interacts with my comment
**When** they reply or mark as solution
**Then**:
- Activity logged in user_activity table
- Dashboard activity feed shows:
  - "X replied to your comment on {guide}"
  - "Your answer was marked as solution on {guide}"
- Badge count in header (optional):
  - Red dot or number for unread activity
  - Clicking opens activity dropdown
- Email notification (optional, future):
  - Setting to enable/disable
  - Weekly digest of activity

**And** clicking activity notification navigates to comment thread

**Prerequisites:** Story 8.5

**Technical Notes:**
- On reply: `INSERT INTO user_activity (user_id=parent_author.id, activity_type='comment_reply', ...)`
- On solution mark: `INSERT INTO user_activity (user_id=reply_author.id, activity_type='solution_marked', ...)`
- Query unread: `SELECT * FROM user_activity WHERE user_id = ? AND read = false`
- Mark as read: Update activity when user views
- Badge component in header with count

---

## Epic 9: Admin Analytics & Management

**Goal:** Provide administrators with dashboards to monitor platform usage, manage users, and gain insights into content performance.

**Business Value:** Admin insights enable data-driven decisions about content, identify engaged vs. struggling users, and demonstrate platform ROI to leadership.

**Duration:** Week 12

---

### Story 9.1: Build Admin Dashboard Overview

As an admin,
I want an overview dashboard of platform metrics,
So that I can monitor health and engagement.

**Acceptance Criteria:**

**Given** I am an admin user (profiles.is_admin = true)
**When** I navigate to `/admin`
**Then**:
- Access control: Only admins can access (RLS + UI check)
- Dashboard displays:
  - **Stats Cards (4 across):**
    - Total Users (count with trend)
    - Total Guides Viewed (all-time)
    - Active Users (last 30 days)
    - Avg Completion Rate (%)
  - **Activity Graph:**
    - Line chart: Daily Active Users (30 days)
    - Bar chart: Guide Views per Day (30 days)
  - **Popular Guides Table:**
    - Top 10 by views
    - Columns: Title, Category, Views, Avg Completion %, Helpful Votes
  - **Recent Activity:**
    - Last 50 user activities (all users)
    - Columns: User, Action, Guide/Item, Timestamp
- Date range filter: Last 7 days / 30 days / 90 days / All time
- Export button: Download data as CSV

**And** non-admin users redirected to dashboard if they try to access

**Prerequisites:** Epic 8 complete

**Technical Notes:**
- Admin check: `profiles.is_admin = true` in RLS policy and React route guard
- Stats queries:
  - Total users: `SELECT COUNT(*) FROM profiles`
  - Active users: `SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE created_at >= NOW() - INTERVAL '30 days'`
  - Avg completion: `SELECT AVG(CASE WHEN completed THEN 100 ELSE progress_percent END) FROM user_progress`
- Use Recharts for graphs: LineChart, BarChart
- Trend: Compare to previous period (e.g., last 30 days vs prior 30 days)

---

### Story 9.2: Build User Management Page

As an admin,
I want to view and manage all users,
So that I can support users and moderate content.

**Acceptance Criteria:**

**Given** I am on admin user management page (`/admin/users`)
**When** the page loads
**Then**:
- Searchable user table with columns:
  - Display Name
  - Email
  - Role (onboarding selection)
  - Joined Date
  - Last Active
  - Progress (% of guides completed)
  - Actions: View Profile / Delete User
- Search bar: Filter by name or email
- Sort by any column (ascending/descending)
- Pagination: 50 users per page
- Click row: Expand to show user details:
  - Full profile info
  - Progress breakdown
  - Activity timeline (last 20 activities)
  - Notes count, tasks count
  - "View as User" button (navigate to user's profile)
  - "Delete User" button (with confirmation, cascades all data)
- Bulk actions: Select multiple users, export list as CSV

**And** deleting user removes all associated data (notes, tasks, progress, comments)

**Prerequisites:** Story 9.1

**Technical Notes:**
- Query: `SELECT * FROM profiles ORDER BY created_at DESC`
- Join user_progress for completion percentage
- Search: Filter SQL query with ILIKE: `WHERE display_name ILIKE '%search%' OR email ILIKE '%search%'`
- Delete: Cascade handled by foreign key constraints (ON DELETE CASCADE)
- Confirmation: Dialog with checkbox "I understand this cannot be undone"

---

### Story 9.3: Build Content Analytics Page

As an admin,
I want detailed analytics on guide performance,
So that I can identify popular content and areas needing improvement.

**Acceptance Criteria:**

**Given** I am on admin content analytics page (`/admin/analytics`)
**When** the page loads
**Then**:
- **Guide Performance Table:**
  - All 42 guides with metrics:
    - Title, Category
    - Views (total, unique viewers)
    - Avg Time on Page (minutes)
    - Completion Rate (%)
    - Helpful Votes (+/-)
    - Comments Count
  - Sort by any metric
  - Filter by category
  - Color coding: Green (high engagement), Yellow (medium), Red (low)
- **Engagement Metrics:**
  - Total Notes Created (all users)
  - Total Tasks Created
  - Total Comments Posted
  - Avg Session Duration
  - Daily/Weekly/Monthly trends (charts)
- **Category Performance:**
  - Bar chart showing completion rates by category
  - Identify categories needing attention
- Export: Download full analytics as CSV/Excel

**And** low-performing guides highlighted for review

**Prerequisites:** Story 9.2

**Technical Notes:**
- Query guide_stats table for metrics
- Avg time on page: `SELECT guide_slug, AVG(time_spent_seconds) / 60 FROM user_progress GROUP BY guide_slug`
- Completion rate: `(completion_count / unique_viewers) * 100`
- Helpful votes: helpful_votes - not_helpful_votes
- Color thresholds: Green > 70% completion, Yellow 40-70%, Red < 40%

---

### Story 9.4: Build User Engagement Report

As an admin,
I want to see user engagement patterns,
So that I can identify highly engaged users and those who need support.

**Acceptance Criteria:**

**Given** I want to understand user engagement
**When** viewing engagement report
**Then**:
- **User Segmentation:**
  - Highly Engaged: 70%+ guides complete, active in last 7 days
  - Moderately Engaged: 30-70% complete, active in last 30 days
  - Low Engagement: <30% complete or inactive >30 days
  - At Risk: Registered but never completed onboarding
- Segment counts and percentages
- **Engagement Funnel:**
  - Registered → Onboarded → First Guide → 5 Guides → All Core Complete
  - Drop-off rates at each stage
- **Activity Heatmap:**
  - Day of week vs hour of day usage patterns
  - Identify peak usage times
- **Cohort Analysis:**
  - Group users by registration month
  - Track retention over time
- Export: User lists per segment for targeted outreach

**And** admins can export "at risk" user list to send encouragement emails

**Prerequisites:** Story 9.3

**Technical Notes:**
- Segmentation queries:
  - High engagement: `SELECT COUNT(*) FROM profiles WHERE (SELECT AVG(CASE WHEN completed THEN 1 ELSE 0 END) FROM user_progress WHERE user_id = profiles.id) > 0.7`
- Funnel: Sequential counts from profiles → user_progress milestones
- Heatmap: Query user_activity grouped by day/hour: `SELECT EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at), COUNT(*)`
- Use Recharts for heatmap visualization

---

### Story 9.5: Implement Admin Notifications and Alerts

As an admin,
I want automated alerts for important events,
So that I can proactively address issues.

**Acceptance Criteria:**

**Given** the platform is being used
**When** important events occur
**Then**:
- Admin notification badge in header (bell icon with count)
- Notification types:
  - New user registration (daily digest)
  - Inappropriate content flagged (immediate)
  - Low engagement alert (weekly: >50% users inactive)
  - Database/performance issues (immediate)
  - Milestones: 100 users, 1000 guides viewed, etc.
- Notification center dropdown:
  - List of recent notifications
  - Click to view details or take action
  - Mark as read
  - Clear all
- Email digest for critical alerts (optional)

**And** admins can configure notification preferences

**Prerequisites:** Story 9.4

**Technical Notes:**
- Store notifications in database: admin_notifications table
- Query: `SELECT * FROM admin_notifications WHERE read = false ORDER BY created_at DESC`
- Trigger notifications via database functions or scheduled jobs
- Real-time: Use Supabase real-time subscriptions for immediate alerts
- Email: Use Supabase Edge Functions to send emails

---

### Story 9.6: Build Admin Action Log

As an admin,
I want a log of all admin actions,
So that I can maintain accountability and audit trail.

**Acceptance Criteria:**

**Given** admins perform administrative actions
**When** actions are taken
**Then**:
- All admin actions logged:
  - User deleted
  - Content modified
  - Settings changed
  - Data exported
- Action log table displays:
  - Admin user who performed action
  - Action type
  - Target (user, guide, etc.)
  - Timestamp
  - IP address (optional)
  - Details/description
- Searchable and filterable by:
  - Admin user
  - Action type
  - Date range
- Export log as CSV
- Retention: Keep logs for 1 year minimum

**And** regular users cannot view or access action log

**Prerequisites:** Story 9.5

**Technical Notes:**
- Create admin_action_log table
- Log actions with function: `logAdminAction(action_type, target_id, details)`
- Automatic logging: Database triggers on certain operations
- Query: `SELECT * FROM admin_action_log ORDER BY created_at DESC`
- RLS: Only admins can read

---

## Epic 10: Responsive Design & Accessibility

**Goal:** Ensure the platform works flawlessly on all devices (mobile, tablet, desktop) and meets WCAG 2.1 AA accessibility standards.

**Business Value:** Mobile responsiveness allows learning anywhere. Accessibility ensures everyone can use the platform, demonstrating company values and compliance.

**Duration:** Week 13

---

### Story 10.1: Implement Mobile-Responsive Navigation

As a mobile user,
I want intuitive navigation on my phone,
So that I can access all features easily.

**Acceptance Criteria:**

**Given** I am using a mobile device (< 640px)
**When** I navigate the app
**Then**:
- Header adapts:
  - Logo remains visible (smaller size)
  - Hamburger menu button (right side for RTL)
  - User avatar/menu (left side for RTL)
  - Search icon (opens full-screen search modal)
- Hamburger menu opens drawer from right (RTL):
  - Slide-in animation (Framer Motion)
  - Full navigation menu
  - Close button (X) at top
  - Backdrop dims content
  - Click backdrop to close
- Navigation links:
  - Dashboard, Guides, Notes, Tasks, Profile, Settings
  - Active state highlighted
  - Large touch targets (48x48px minimum)
- Bottom navigation bar (optional):
  - Fixed at bottom
  - Icons for: Home, Guides, Search, Profile
  - Active page highlighted

**And** all touch targets are minimum 44x44px (WCAG AA)

**Prerequisites:** Epic 9 complete

**Technical Notes:**
- Use CSS media queries: `@media (max-width: 640px)`
- Drawer: Framer Motion with slide animation: `initial={{ x: '100%' }}` → `animate={{ x: 0 }}`
- Hamburger icon: Animated (lines rotate to X)
- Prevent body scroll when drawer open: `document.body.style.overflow = 'hidden'`
- Bottom nav: `position: fixed; bottom: 0; width: 100%; z-index: 50;`

---

### Story 10.2: Optimize Guide Reader for Mobile

As a mobile user,
I want a comfortable reading experience on my phone,
So that I can learn on the go.

**Acceptance Criteria:**

**Given** I am reading a guide on mobile
**When** the guide reader loads
**Then**:
- Layout adapts:
  - ToC sidebar hidden by default
  - Floating button (bottom-right) to open ToC sheet
  - ToC sheet slides up from bottom (half-screen height)
  - Action buttons in sticky bottom bar
  - Content uses full width
- Reading optimizations:
  - Font size slightly larger (18px body text)
  - Line height increased for readability (1.8)
  - Content padding increased (24px sides)
  - Images responsive (max-width: 100%, height: auto)
  - Tables horizontally scrollable
  - Code blocks horizontally scrollable with better formatting
- Touch gestures:
  - Swipe right: Previous section (optional)
  - Swipe left: Next section (optional)
  - Tap top: Scroll to top
- Action bar at bottom:
  - Add Note, Add Task, Mark Complete icons (compact)
  - Floating action button (FAB) for primary action

**And** text is readable without zooming

**And** all interactive elements have adequate spacing for touch

**Prerequisites:** Story 10.1

**Technical Notes:**
- Use Tailwind responsive classes: `text-base md:text-lg`
- ToC sheet: Bottom sheet component with drag handle
- Swipe gestures: Use touch event handlers or library like `react-swipeable`
- Sticky bottom bar: `position: fixed; bottom: 0;` with safe-area-inset for iOS
- Test on real devices: iPhone, Android phones

---

### Story 10.3: Implement Accessibility Compliance (WCAG 2.1 AA)

As a user with accessibility needs,
I want the platform to be fully accessible,
So that I can learn regardless of my abilities.

**Acceptance Criteria:**

**Given** I use assistive technology
**When** I navigate the platform
**Then**:
- **Keyboard Navigation:**
  - All interactive elements focusable with Tab
  - Logical tab order (follows visual flow, RTL-aware)
  - Focus indicators visible (2px emerald outline)
  - Skip to main content link (first tab stop)
  - Modal focus trap (can't tab outside)
  - Esc closes modals/dropdowns
- **Screen Reader Support:**
  - Semantic HTML: `<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`
  - All images have descriptive alt text
  - All icon buttons have aria-label
  - Form inputs have associated labels
  - Error messages announced with aria-live
  - Page titles descriptive and unique
  - Heading hierarchy logical (no skipped levels)
- **Color Contrast:**
  - Text meets 4.5:1 ratio (normal text)
  - Large text meets 3:1 ratio (18px+)
  - UI elements meet 3:1 ratio
  - Emerald primary tested and verified
  - Dark mode also meets contrast ratios
- **Touch Targets:**
  - Minimum 44x44px for all interactive elements
  - 8px spacing between adjacent targets
- **Motion:**
  - Respect prefers-reduced-motion
  - Disable decorative animations if user preference set
  - Never rely solely on motion to convey information

**And** platform passes automated accessibility tests (axe DevTools)

**And** manual keyboard navigation works for all features

**Prerequisites:** Story 10.2

**Technical Notes:**
- Use semantic HTML elements
- ARIA labels: `aria-label`, `aria-describedby`, `aria-labelledby`
- Live regions: `aria-live="polite"` for toasts, `aria-live="assertive"` for errors
- Focus management: `useEffect` to focus first input in modals
- Contrast checker: Use WebAIM contrast checker tool
- Reduced motion: `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`
- Testing: NVDA (Windows), VoiceOver (Mac), JAWS

---

### Story 10.4: Optimize Performance for Mobile Networks

As a mobile user on slower connections,
I want the app to load quickly and work smoothly,
So that I can learn without frustration.

**Acceptance Criteria:**

**Given** I access the platform on mobile
**When** pages load
**Then**:
- **Performance Targets:**
  - First Contentful Paint: < 2.5s on 3G
  - Time to Interactive: < 5s on 3G
  - Largest Contentful Paint: < 4s
  - Cumulative Layout Shift: < 0.1
  - Total bundle size: < 500KB gzipped
- **Optimizations Applied:**
  - Code splitting by route (automatic with Vite)
  - Lazy loading of heavy components (charts, editor)
  - Image lazy loading (`loading="lazy"`)
  - Virtual scrolling for long lists (>100 items)
  - Debounced search and scroll handlers
  - React.memo for expensive components
  - useMemo for expensive calculations
  - Service worker caching (optional PWA)
- **Loading States:**
  - Skeleton screens (not just spinners)
  - Progressive loading (show content as it loads)
  - Optimistic UI updates
  - Offline fallback messages
- **Network Resilience:**
  - Retry failed requests (3 attempts)
  - Cache API responses (React Query)
  - Queue actions when offline (optional)

**And** Lighthouse score > 90 on mobile (Performance, Accessibility, Best Practices, SEO)

**Prerequisites:** Story 10.3

**Technical Notes:**
- Test on real 3G: Chrome DevTools Network throttling
- Bundle analysis: `npm run build && npx vite-bundle-visualizer`
- Lazy load: `const Component = lazy(() => import('./Component'))`
- Virtual scrolling: Use `@tanstack/react-virtual`
- Service Worker: Use Vite PWA plugin (optional)
- Lighthouse: Run in Chrome DevTools, CI/CD integration

---

### Story 10.5: Build Responsive Dashboard and Grid Layouts

As a user on any device,
I want layouts that adapt beautifully to my screen size,
So that I have an optimal experience regardless of device.

**Acceptance Criteria:**

**Given** I view the platform on different devices
**When** layouts render
**Then**:
- **Mobile (< 640px):**
  - Single column layouts
  - Cards stack vertically
  - Dashboard: 1 column, sections prioritized
  - Guides grid: 1 column
  - Modals: Full-screen
  - Tables: Stacked or horizontally scrollable
- **Tablet (640px - 1024px):**
  - 2 column layouts
  - Dashboard: 2 columns (progress + actions stacked)
  - Guides grid: 2 columns
  - Modals: Centered with max-width
  - Sidebars: Collapsible, overlay on toggle
- **Desktop (1024px - 1440px):**
  - 3 column layouts
  - Dashboard: 3 columns (40/30/30)
  - Guides grid: 3 columns
  - Modals: Centered, appropriate sizes
  - Sidebars: Persistent, fixed position
- **Wide (> 1440px):**
  - 4 column guides grid (max)
  - Content max-width: 1536px (centered)
  - Sidebars: Fixed width (don't scale infinitely)
- **Responsive Images:**
  - Use srcset for multiple sizes
  - Lazy loading
  - WebP format with fallback
- **Responsive Typography:**
  - Base font scales slightly on smaller screens
  - Line length appropriate (45-75 characters)
  - Headings scale proportionally

**And** no horizontal scrolling on any screen size (except intentional like tables)

**And** layouts tested on real devices: iPhone, iPad, Android tablet, desktop monitors

**Prerequisites:** Story 10.4

**Technical Notes:**
- Tailwind responsive classes: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Container max-width: `max-w-7xl mx-auto`
- Responsive images: `<img srcset="..." sizes="..." />`
- Test on BrowserStack or real devices
- Chrome DevTools device emulation
- Consider landscape orientation on tablets

---

## Epic Summary & Implementation Roadmap

**Total Stories:** 66 stories across 10 epics

**Epic Breakdown:**
- Epic 1: Project Foundation & Infrastructure (10 stories) - Week 1
- Epic 2: User Authentication & Personalized Onboarding (10 stories) - Weeks 2-3
- Epic 3: Dynamic Content Rendering System (10 stories) - Week 4
- Epic 4: Guide Library & Discovery (8 stories) - Weeks 5-6
- Epic 5: Progress Tracking & Achievements (8 stories) - Week 7
- Epic 6: Personal Learning Workspace (8 stories) - Weeks 8-9
- Epic 7: Global Search & Command Palette (5 stories) - Week 10
- Epic 8: Community Features (6 stories) - Week 11
- Epic 9: Admin Analytics & Management (6 stories) - Week 12
- Epic 10: Responsive Design & Accessibility (5 stories) - Week 13

**Weeks 14-15: Testing & Launch** (covered in story acceptance criteria + final integration)

---

## Implementation Strategy

### Story Sizing Principles

All stories follow **bite-sized** principles:
- ✅ Completable by single dev agent in one focused session
- ✅ Vertically sliced (complete functionality, not just one layer)
- ✅ Clear acceptance criteria with BDD format (Given/When/Then)
- ✅ No forward dependencies (only prerequisites from earlier stories)
- ✅ Independently valuable when possible

### Development Flow

**For Each Story:**
1. Read story acceptance criteria and technical notes
2. Implement functionality
3. Verify all acceptance criteria met
4. Test manually and ensure no regressions
5. Move to next story

**Sequential Execution:**
- Stories within an epic build on each other
- Epics can be developed sequentially or with some parallelization (e.g., Epic 5-7 could overlap)
- Foundation (Epic 1) must be complete before others start
- Authentication (Epic 2) required for all protected features

### Quality Gates

**Definition of Done (per story):**
- ✅ All acceptance criteria met
- ✅ No TypeScript errors
- ✅ No console errors in browser
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Accessible (keyboard navigation, screen reader compatible)
- ✅ Tested in Chrome (primary) and Firefox
- ✅ RTL layout correct for Hebrew content

**Epic Completion Criteria:**
- ✅ All stories in epic complete
- ✅ Integration between stories works seamlessly
- ✅ No regressions in previous epics
- ✅ Epic delivers stated business value

---

## Critical Success Factors

### Technical Excellence
1. **Type Safety:** TypeScript strict mode throughout - catches errors at compile time
2. **Performance:** Lighthouse > 90, < 500KB bundle, lazy loading
3. **Accessibility:** WCAG 2.1 AA compliance - keyboard nav, screen readers, contrast
4. **Security:** RLS policies, input validation, XSS prevention

### User Experience
1. **Speed:** Actions feel instant with optimistic UI updates
2. **Delight:** Framer Motion animations, confetti celebrations, smooth transitions
3. **Guidance:** Helpful empty states, contextual tips, clear error messages
4. **Personalization:** Role-based content, learning paths, recommendations

### Content Strategy
1. **Rich Rendering:** 14 content block types for engaging guides
2. **Migration:** Convert 42 markdown guides to JSON with enhanced interactivity
3. **Quality:** Use accordions, callouts, code blocks effectively
4. **Organization:** Clear categorization, tagging, filtering

### Community & Engagement
1. **Gamification:** Badges, streaks, progress visualization
2. **Social Learning:** Comments, Q&A, helpful voting
3. **Personal Tools:** Rich notes (Tiptap), task management (kanban)
4. **Discovery:** Search, command palette, recommendations

---

## Risk Mitigation

### Technical Risks

**Risk:** Content migration from Markdown to JSON is time-consuming
- **Mitigation:** Start with 3 sample guides (Story 4.2), refine process, then batch convert
- **Story:** Consider Story 4.2 as prototype, create automated script if needed

**Risk:** Supabase free tier limits exceeded (bandwidth: 2GB/month)
- **Mitigation:** React Query caching reduces requests by 70%, monitor usage
- **Fallback:** Upgrade to Pro ($25/month) if approaching limits

**Risk:** Real-time features (comments) may have performance impact
- **Mitigation:** Optimize queries, use indexes, paginate results
- **Story:** Built into Story 8.1 with pagination (20 comments initial load)

### User Adoption Risks

**Risk:** Users overwhelmed by 42 guides
- **Mitigation:** Personalized onboarding wizard (Epic 2) creates curated learning paths
- **Story:** Story 2.9 generates role-based paths (Core + Recommended + Interests)

**Risk:** Low engagement after initial curiosity
- **Mitigation:** Gamification (Epic 5) with badges, streaks, celebrations
- **Story:** Story 5.3 achievement badges, Story 5.7 popular guides create social proof

**Risk:** Note-taking friction discourages usage
- **Mitigation:** Quick note from guide (Story 6.3) with pre-filled content
- **Story:** Selected text auto-populates note, making capture effortless

---

## Post-Launch Enhancements (Future)

**Phase 2 Features** (not in current 66 stories):
- 🎓 Learning paths as guided sequences (vs. just categorization)
- 📊 Quizzes and knowledge checks after guides
- 📜 Certificates of completion
- 🔔 Email notifications for comments, replies
- 👥 Shared notes for team collaboration
- 🌍 English translation (i18n support)
- 📱 Mobile app (React Native)
- 📴 Offline mode (Progressive Web App)
- 🎥 Video tutorial integration
- 🔄 Automated content migration script (for all 42 guides at once)

---

## Validation & Acceptance

### Launch Criteria

**All Epics Complete:**
- ✅ 66 stories implemented
- ✅ All acceptance criteria met
- ✅ No critical bugs

**Quality Metrics:**
- ✅ Lighthouse score > 90 (all categories)
- ✅ WCAG 2.1 AA compliance verified
- ✅ Cross-browser tested (Chrome, Firefox, Safari, Edge)
- ✅ Mobile tested (iOS, Android)

**Content Ready:**
- ✅ Minimum 10 guides converted to JSON (ideally all 42)
- ✅ Content renders correctly with variety of block types
- ✅ All guides have metadata and categories

**Performance Validated:**
- ✅ Database queries optimized with indexes
- ✅ Bundle size < 500KB gzipped
- ✅ Page load < 3s on 3G

**Security Audited:**
- ✅ RLS policies tested (users can only access own data)
- ✅ Input validation on all forms
- ✅ XSS prevention verified
- ✅ Authentication flows secure

### Beta Testing (Week 14-15)

**Beta User Group:** 10-20 employees across different roles
- At least 2 from each role (Developer, PM, Designer, etc.)
- Mix of tech-savvy and non-technical users
- Include accessibility needs representation

**Testing Focus:**
- Complete onboarding wizard
- Read 3+ guides with different content types
- Create notes and tasks
- Use search and command palette
- Post comments and interact with Q&A
- Provide feedback on UX, bugs, missing features

**Feedback Incorporation:**
- Daily bug fixes during beta
- UX adjustments based on feedback
- Final polish and optimization

---

## Conclusion

This epic breakdown provides **66 implementable stories** organized into **10 cohesive epics** that deliver the complete Agenseek (BMAD Learning Hub) platform over **15 weeks**.

### Key Strengths of This Breakdown:

✅ **Bite-Sized Stories:** Each story is sized for single dev agent completion in one focused session

✅ **Clear Acceptance Criteria:** BDD format (Given/When/Then) provides unambiguous success criteria

✅ **Sequential Dependencies:** No forward dependencies - each story only depends on previous stories

✅ **Vertical Slicing:** Stories deliver complete functionality, not just one layer

✅ **Business Value Aligned:** Each epic has clear business goal and user value statement

✅ **Technical Guidance:** Technical notes provide implementation hints without being prescriptive

✅ **Quality Built-In:** Accessibility, responsiveness, and performance baked into acceptance criteria

### Ready for Implementation

This epic breakdown, combined with:
- **Product Brief** (`docs/brief.md`) - Complete feature set and business context
- **UX Design Specification** (`docs/ux-design-specification.md`) - Visual design system and user journeys
- **Technical Architecture** (`docs/architecture.md`) - Technology stack and implementation patterns

...provides **everything needed** for development agents to build Agenseek confidently and consistently.

**Let's build an amazing learning platform! 🚀**

---

_This epic breakdown was created following the BMAD Method's create-epics-and-stories workflow, ensuring comprehensive coverage of all requirements with implementable, bite-sized stories._

**Total Epic Count:** 10 epics  
**Total Story Count:** 66 stories  
**Total Duration:** 15 weeks to launch  
**Total Database Tables:** 9 tables with complete schema  
**Total Content Blocks:** 14 dynamic content types  
**Total Pages:** 15+ routes covering all features  

**Document Version:** 1.0  
**Date:** November 6, 2025  
**Author:** Ben (Product Manager persona)  
**Status:** Ready for Implementation