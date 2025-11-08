# 🚀 NEXT STORY: Story 8.4 - Build Q&A Functionality

**Updated:** November 8, 2025

---

## ✅ Story 8.3 Complete!

Users can now vote on helpful comments! Features include:

- Vote comments as "helpful" with thumbs up button
- Filled emerald button when voted
- Toggle vote on/off
- Cannot vote on own comments
- Sort by "Most Helpful"
- Real-time vote count updates
- Vote state persists across sessions
- Visual feedback with filled icon
- Accessible and responsive

**Completion File:** See `STORY-8.3-COMPLETE.md` for full details.

**Epic 8 Status:** 3/6 stories complete (50%)

---

## 📍 Next Story to Implement

### **Story 8.4: Build Q&A Functionality**

**Epic:** 8 - Community Features (Comments & Q&A)
**Priority:** P0
**Sprint:** 11
**Story Points:** 3
**Dependencies:** Story 8.3 Complete ✅

---

## 🎯 Story 8.4 Overview

Enhance the comment system with Q&A functionality. Question comments get special treatment with orange styling, replies can be marked as solutions by the question author, and users can filter to see only questions.

### User Story

**As a user reading a guide,**
**I want to see questions highlighted and solutions marked,**
**So that I can quickly find answers to common problems and get help from the community.**

---

## 📋 Acceptance Criteria

### Question Visual Styling

**Given** I'm viewing comments on a guide
**When** A comment is marked as a question (is_question = true)
**Then:**

- [ ] Question comment has orange background (bg-orange-50 dark:bg-orange-950/20)
- [ ] Question has orange border (border-orange-200 dark:border-orange-800)
- [ ] "שאלה" badge displayed with orange background
- [ ] Badge positioned next to user name
- [ ] Questions visually distinct from regular comments

### Mark Reply as Solution

**Given** I'm the author of a question comment
**When** I view replies to my question
**Then:**

- [ ] Each reply has "סמן כפתרון" button (only visible to question author)
- [ ] Clicking marks reply as solution (is_solution = true)
- [ ] Solution reply moves to top of replies list
- [ ] Solution gets green background (bg-green-50 dark:bg-green-950/20)
- [ ] Green checkmark icon appears
- [ ] "פתרון" badge displayed with green background
- [ ] Only one solution per question (marking new solution removes previous)
- [ ] Toast notification: "הפתרון סומן בהצלחה"

### Unmark Solution

**Given** A reply is already marked as solution
**When** Question author clicks "הסר סימון פתרון"
**Then:**

- [ ] is_solution set to false
- [ ] Reply returns to chronological position
- [ ] Green styling removed
- [ ] Solution badge removed
- [ ] Toast notification: "סימון הפתרון הוסר"

### Q&A Filter Toggle

**Given** I'm viewing comments on a guide
**When** I toggle "הצג שאלות בלבד" filter
**Then:**

- [ ] Only comments with is_question = true displayed
- [ ] Filter button state toggles (filled when active)
- [ ] Count shows number of questions
- [ ] Sorting still applies (recent/most helpful)
- [ ] Replies to questions still shown
- [ ] Toggle off shows all comments again

### Questions Grouping

**Given** Q&A filter is enabled
**When** Questions are displayed
**Then:**

- [ ] Questions grouped into two sections:
  - "שאלות ללא תשובה" (no replies with is_solution = true)
  - "שאלות שנענו" (has reply with is_solution = true)
- [ ] Unanswered questions displayed first
- [ ] Each group sorted by selected sort option
- [ ] Group headers show count
- [ ] Empty groups show placeholder message

### Solution Permissions

**Given** I'm viewing a question with replies
**Then:**

- [ ] Only question author can mark/unmark solutions
- [ ] "סמן כפתרון" button hidden from other users
- [ ] Solution badge visible to all users
- [ ] Question author can change solution to different reply

---

## 🔨 Implementation Plan

### 1. Update CommentItem Component for Solution Marking

**File:** `src/components/comments/CommentItem.tsx`

**Changes:**
1. Check if current user is question author (for replies to questions)
2. Add "סמן כפתרון" button for replies (visible only to question author)
3. Handle solution marking (call `markSolutionComment()`)
4. Show solution badge and styling when `is_solution = true`
5. Float solution replies to top of replies list

**Logic:**
```typescript
// Check if this is a reply to a question
const isReplyToQuestion = comment.parent_comment_id && parentComment.is_question;

// Check if current user is the question author
const isQuestionAuthor = user?.id === parentComment.user_id;

// Show mark solution button if:
// - This is a reply to a question
// - Current user is the question author
// - Reply is not already marked as solution
```

### 2. Create Solution Marking Action

**File:** `src/lib/actions/comments.ts`

**Function:**
```typescript
async function markCommentAsSolution(data: {
  commentId: string;
  questionId: string;
  userId: string;
}): Promise<{ success: boolean; error?: string }>
```

**Process:**
1. Verify user is author of question comment
2. Unmark any existing solution for this question
3. Mark new comment as solution
4. Update question to track which reply is solution
5. Return success

### 3. Update CommentThread for Q&A Filter

**File:** `src/components/comments/CommentThread.tsx`

**Changes:**
1. Add Q&A filter toggle button
2. Add state for filter (showQuestionsOnly)
3. Update useComments hook to support filtering
4. Add grouping logic (unanswered / answered)
5. Display group headers with counts

### 4. Update useComments Hook

**File:** `src/hooks/useComments.ts`

**Changes:**
1. Add `filterQuestions` parameter
2. Filter query to only fetch questions when enabled
3. Add logic to group questions by answered status
4. Solution replies float to top within each question

### 5. Update Hebrew Locale

Add to `comments` section:
- `markAsSolution`: 'סמן כפתרון'
- `unmarkSolution`: 'הסר סימון פתרון'
- `solutionMarked`: 'הפתרון סומן בהצלחה'
- `solutionUnmarked`: 'סימון הפתרון הוסר'
- `onlyQuestions`: 'הצג שאלות בלבד'
- `allComments`: 'כל התגובות'
- `unansweredQuestions`: 'שאלות ללא תשובה'
- `answeredQuestions`: 'שאלות שנענו'
- `noUnansweredQuestions`: 'אין שאלות ללא תשובה'
- `noAnsweredQuestions`: 'אין שאלות שנענו'

### 6. Solution Visual Styling

**CSS Classes:**
- Green background for solution: `bg-green-50 dark:bg-green-950/20`
- Green border: `border-green-200 dark:border-green-800`
- Green badge: `bg-green-500 hover:bg-green-600`
- Checkmark icon: `IconCheck` from Tabler Icons

### 7. Reply Sorting Logic

**Implementation:**
1. Fetch all replies for question
2. Separate solution reply (if exists)
3. Sort remaining replies by sort option
4. Return array: [solutionReply, ...otherReplies]
5. Display with solution at top

### 8. Question Grouping Logic

**Implementation:**
```typescript
// Group questions into answered/unanswered
const unanswered = questions.filter(q =>
  !q.replies.some(r => r.is_solution)
);
const answered = questions.filter(q =>
  q.replies.some(r => r.is_solution)
);
```

---

## 🎨 UI/UX Considerations

### Form Placement

**Top of thread:**
- Prominent "הוסף תגובה" button (emerald, with icon)
- Form slides down when clicked
- Full-width with proper padding

**Reply form:**
- Indented to match reply depth
- Smaller, more compact
- "השב ל [Name]" indicator at top

### Visual States

**Empty:**
- Textarea gray border
- Placeholder text visible

**Focused:**
- Emerald border
- Placeholder disappears

**Typing:**
- Character count updates live
- Green when < 4500
- Orange when 4500-4999
- Red when 5000

**Submitting:**
- Button shows spinner
- Textarea disabled
- "שולח..." text

**Success:**
- Toast notification
- Form clears
- Smooth scroll to new comment
- Confetti animation (optional)

### Responsive Design

**Mobile (<640px):**
- Full-width form
- Larger touch targets
- Preview tab full screen

**Tablet (640-1024px):**
- Form width matches content area
- Side-by-side Write/Preview tabs

**Desktop (>1024px):**
- Max-width constrained
- Comfortable spacing
- Markdown guide visible by default

---

## 🧪 Testing Scenarios

### Happy Path
1. Click "הוסף תגובה"
2. Type comment (< 5000 chars)
3. Click "פרסם תגובה"
4. See success toast
5. New comment appears at top
6. Count increments

### Reply Flow
1. Click "השב" on comment
2. Type reply
3. Submit
4. Reply appears under parent
5. Reply count updates

### Validation
1. Try to submit empty → Button disabled
2. Type 5001 chars → Button disabled, red count
3. Backspace to 5000 → Button enabled
4. Submit → Success

### Question Toggle
1. Toggle "שאלה"
2. Submit
3. New comment has orange background
4. "שאלה" badge visible

### Preview
1. Type markdown: `**bold** and *italic*`
2. Click Preview tab
3. See formatted text
4. Switch back to Write
5. Content preserved

### Error Handling
1. Network error → Error toast
2. User not authenticated → Redirect to login
3. Invalid guide_slug → Error message

---

## 🔐 Security & Validation

### Client-Side
- Max 5000 characters
- No empty submissions
- Sanitize markdown (prevent XSS)

### Server-Side (RLS Policies)
- User must be authenticated
- User can only insert with their own user_id
- Content length check
- Rate limiting (future: prevent spam)

### Database Constraints
- `content` NOT NULL
- `user_id` foreign key constraint
- `guide_slug` validated against catalog

---

## 📚 Technical Resources

### Markdown Libraries
- **react-markdown:** Simple, lightweight
- **marked:** Fast parser
- **Custom:** Can implement basic markdown manually

### Textarea Auto-Resize
```typescript
const adjustHeight = () => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      400
    )}px`;
  }
};
```

### Character Counter
```typescript
const charCount = content.length;
const charColor = charCount > 4500
  ? (charCount >= 5000 ? 'text-destructive' : 'text-orange-500')
  : 'text-muted-foreground';
```

---

## ✅ Definition of Done

Before marking story complete:

- [ ] Comment form component created
- [ ] Form integrated at top of CommentThread
- [ ] Reply form integrated in CommentItem
- [ ] Markdown formatting guide implemented
- [ ] Preview tab functional
- [ ] Comment/Question toggle works
- [ ] Character counter updates live
- [ ] Submit inserts to database
- [ ] Activity logged
- [ ] Success toast displays
- [ ] Form resets after submit
- [ ] Scroll to new comment works
- [ ] Real-time update displays new comment
- [ ] Count increments in header
- [ ] Reply submission works
- [ ] Reply appears under parent
- [ ] Reply count updates
- [ ] Validation prevents invalid submissions
- [ ] Error handling shows appropriate messages
- [ ] Hebrew locale strings added
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] RTL layout correct
- [ ] Manual testing passed

---

## 🚀 Ready to Implement!

Story 8.1 complete with comment thread display and real-time updates. Story 8.2 will enable users to post comments and questions.

**Start Command:**
```bash
# No new dependencies needed
```

Then implement in this order:
1. Create comment submission logic (lib/actions/comments.ts)
2. Create CommentForm component
3. Integrate form into CommentThread (top-level)
4. Integrate form into CommentItem (replies)
5. Add Hebrew locale strings
6. Test submission flow
7. Test validation
8. Test real-time updates
9. Complete story documentation

---

**Let's build community engagement through comments! 💬✨**
