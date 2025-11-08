# 🚀 NEXT STORY: Story 6.6 - Build Task Kanban Board

**Updated:** November 8, 2025

---

## ✅ Story 6.5 Complete!

The task creation modal has been successfully enhanced with advanced sub-task management. Users can now:

- Create tasks with inline sub-tasks
- Add/remove/reorder sub-tasks before saving
- Check off sub-tasks as completed
- Validate sub-task length (max 200 chars)
- See visual feedback with drag handles and icons

**Completion File:** See `STORY-6.5-COMPLETE.md` for full details.

---

## 📍 Next Story to Implement

### **Story 6.6: Build Task Kanban Board**

**Epic:** 6 - Notes & Tasks
**Priority:** P0
**Sprint:** 9
**Story Points:** 3
**Dependencies:** Story 6.5 (Complete ✅)

---

## 🎯 Story 6.6 Overview

Transform the existing Kanban tab into a full drag-and-drop kanban board where users can visually manage their task workflow by dragging tasks between status columns.

### Acceptance Criteria

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

---

## 🔨 Implementation Plan

### 1. Install Drag-and-Drop Library

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Library Choice:** `@dnd-kit` is modern, accessible, and lightweight.

### 2. Modify Kanban Tab UI

**File:** `src/app/tasks/index.tsx`

**Current State:** Basic 3-column layout with TaskCards (non-draggable)

**Changes Needed:**
- Wrap with `DndContext` provider
- Make each column a droppable zone
- Make each TaskCard draggable
- Add drag overlay for visual feedback
- Handle drop events to update status

### 3. Create Draggable Task Card Component

**New File:** `src/components/tasks/DraggableTaskCard.tsx`

**Features:**
- Wraps existing TaskCard with drag functionality
- Uses `useDraggable` hook from @dnd-kit
- Adds drag handle styling
- Preserves all existing TaskCard props

### 4. Create Droppable Column Component

**New File:** `src/components/tasks/DroppableColumn.tsx`

**Features:**
- Uses `useDroppable` hook from @dnd-kit
- Highlights on drag-over
- Contains list of DraggableTaskCards
- Shows empty state when no tasks

### 5. Add Drag Handlers

**In:** `src/app/tasks/index.tsx`

**Functions to Add:**
- `handleDragStart` - Track which task is being dragged
- `handleDragEnd` - Update task status in database
- `handleDragOver` - Provide visual feedback

### 6. Update Task Status on Drop

**Use Existing API:** `updateTaskStatus()` from `src/lib/api/tasks.ts`

**Flow:**
1. User drags task from "To Do" to "In Progress"
2. `handleDragEnd` detects the drop
3. Call `updateTaskStatus(taskId, newStatus)`
4. Optimistically update local state
5. Update stats
6. Show toast notification (optional)

### 7. Mobile Support

**Add:** Swipe gesture as alternative to drag-and-drop

**Library:** `@dnd-kit` supports touch/pointer events by default

---

## 📚 Technical Resources

### @dnd-kit Documentation
- Main docs: https://docs.dndkit.com/
- Sortable preset: https://docs.dndkit.com/presets/sortable
- Examples: https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/

### Pattern from Notes System
The notes system doesn't have drag-and-drop, but we can follow similar patterns:
- State management approach
- Optimistic updates
- Error handling

### Existing Kanban Layout
Current implementation at line 336-433 in `src/app/tasks/index.tsx` provides the base structure.

---

## 🎨 UI/UX Considerations

### Visual Feedback
- Cursor changes to `grab` on hover
- Active drag shows `grabbing` cursor
- Drop zone highlights with border or background
- Smooth animations using Framer Motion

### Accessibility
- Keyboard navigation support (built into @dnd-kit)
- Screen reader announcements
- Focus management
- Alt+Arrow keys to move tasks

### Performance
- Virtualize if > 50 tasks per column
- Debounce database updates
- Optimistic UI for instant feedback

---

## ✅ Acceptance Criteria Checklist

Before marking story complete:

- [ ] 3-column board renders correctly
- [ ] Tasks can be dragged between columns
- [ ] Dropping updates task status in database
- [ ] Smooth drag-and-drop animation
- [ ] Optimistic UI update (no flicker)
- [ ] Task modal opens on card click
- [ ] Empty state shows for empty columns
- [ ] Mobile/touch support works
- [ ] Keyboard navigation works
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Hebrew text displays correctly
- [ ] Tested with multiple tasks
- [ ] Tested with sub-tasks
- [ ] Error handling for failed updates

---

## 🧪 Testing Scenarios

### Basic Drag-and-Drop
1. Create 3-5 tasks in different statuses
2. Drag task from "To Do" to "In Progress"
3. Verify task moves visually
4. Verify status updated in database
5. Refresh page - task stays in new column

### Edge Cases
1. Drag task and drop in same column (no change)
2. Drag task with sub-tasks (should work)
3. Network error during update (show error, revert)
4. Multiple rapid drags (should debounce)
5. Empty columns (empty state shows)

### Mobile
1. Touch and drag on mobile device
2. Swipe gesture to move (if implemented)
3. Task modal opens on tap
4. Columns scroll horizontally on small screens

---

## 🚀 Ready to Implement!

Story 6.5 complete with sub-task management. Story 6.6 adds visual workflow management with drag-and-drop kanban board.

**Start Command:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Then implement in this order:
1. Install dependencies
2. Create DraggableTaskCard component
3. Create DroppableColumn component
4. Update Kanban tab with DndContext
5. Add drag handlers
6. Test thoroughly
7. Polish animations
8. Complete story documentation

---

**Let's build an amazing kanban board! 🎨✨**
