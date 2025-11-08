# 🚀 NEXT STORY: Story 8.2 - Build Comment Form and Submission

**Updated:** November 8, 2025

---

## ✅ Story 8.1 Complete!

The comment thread system has been successfully implemented! Users can now:

- View comment threads with hierarchical replies (1-level)
- See real-time comment updates via Supabase subscriptions
- Sort comments by Recent, Most Helpful, or Oldest
- Load more comments with pagination (20 per page)
- See visual distinction for questions and solution replies
- View user avatars (initials), names, roles, and timestamps
- Toggle reply visibility
- See action buttons (Helpful, Reply, Edit, Delete - placeholders for now)

**Completion File:** See `STORY-8.1-COMPLETE.md` for full details.

**Epic 8 Status:** 1/6 stories complete (17%)

---

## 📍 Next Story to Implement

### **Story 8.2: Build Comment Form and Submission**

**Epic:** 8 - Community Features (Comments & Q&A)
**Priority:** P0
**Sprint:** 11
**Story Points:** 2
**Dependencies:** Story 8.1 Complete ✅

---

## 🎯 Story 8.2 Overview

Build the comment submission form with markdown support, preview tab, and toggle between comment/question types. Enable users to post comments and questions on guides.

### User Story

**As a user reading a guide,**
**I want to post comments and ask questions,**
**So that I can share insights, get help, and engage with the community.**

---

## 📋 Acceptance Criteria

### Comment Form

**Given** I'm viewing a guide with the comment section
**When** I click "הוסף תגובה" button
**Then:**

- [x] Comment form expands/appears
- [x] Textarea with placeholder "כתוב תגובה..."
- [x] Auto-expanding textarea (min 3 rows, grows with content)
- [x] Markdown formatting guide (collapsible)
  - Bold: `**text**`
  - Italic: `*text*`
  - Code: `` `code` ``
  - Link: `[text](url)`
- [x] Preview tab to see formatted content
- [x] Toggle: "תגובה" / "שאלה" buttons
  - Selected state: Filled emerald
  - Unselected state: Outline
- [x] Character count: "X/5000"
  - Warning color when > 4500
  - Error color when = 5000
- [x] Submit button: "פרסם תגובה" or "פרסם שאלה"
  - Disabled when empty or > 5000 chars
  - Loading state when submitting
- [x] Cancel button

### Comment Submission

**When** I click "פרסם תגובה"
**Then:**

- [x] Comment inserted to `guide_comments` table:
  - user_id (current user)
  - guide_slug
  - content (markdown text)
  - is_question (based on toggle)
  - parent_comment_id (null for top-level)
- [x] Activity logged to `user_activity`:
  - Type: 'comment_posted'
  - Guide slug recorded
- [x] Success toast: "התגובה פורסמה בהצלחה"
- [x] Form resets (clears textarea)
- [x] Scroll to new comment
- [x] Comment count updates in header
- [x] Real-time update (new comment appears via existing subscription)

### Reply Submission

**Given** I click "השב" on a comment
**When** I submit the reply
**Then:**

- [x] Reply inserted with `parent_comment_id` set
- [x] Reply appears under parent comment
- [x] Reply count increments
- [x] Activity logged with both comment_id and parent_comment_id
- [x] Success toast: "התשובה פורסמה בהצלחה"

### Validation

**Given** I try to submit invalid content
**Then:**

- [x] Empty content: Button disabled
- [x] Over 5000 chars: Button disabled + error message
- [x] Server error: Error toast with message

---

## 🔨 Implementation Plan

### 1. Create Comment Form Component

**File:** `src/components/comments/CommentForm.tsx`

**Props:**
```typescript
interface CommentFormProps {
  guideSlug: string;
  parentCommentId?: string | null;
  parentAuthorName?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}
```

**Features:**
- Textarea with auto-expand
- Markdown formatting guide (collapsible)
- Preview tab
- Comment/Question toggle
- Character counter
- Submit/Cancel buttons

### 2. Update CommentItem to Show Form on Reply

**File:** `src/components/comments/CommentItem.tsx`

**Changes:**
- Replace reply form placeholder with actual `CommentForm`
- Pass `comment.id` as `parentCommentId`
- Pass `comment.profile.display_name` as `parentAuthorName`
- Handle onSuccess (close form)
- Handle onCancel (close form)

### 3. Add Form to Top of CommentThread

**File:** `src/components/comments/CommentThread.tsx`

**Changes:**
- Add "הוסף תגובה" button at top of thread
- Show/hide comment form
- Pass `guideSlug`
- Handle onSuccess (refresh comments, scroll to new)

### 4. Implement Comment Submission Logic

**File:** `src/lib/actions/comments.ts` (new file)

**Functions:**
```typescript
async function submitComment(data: {
  userId: string;
  guideSlug: string;
  content: string;
  isQuestion: boolean;
  parentCommentId?: string | null;
}): Promise<{ success: boolean; commentId?: string; error?: string }>

async function logCommentActivity(data: {
  userId: string;
  guideSlug: string;
  commentId: string;
  parentCommentId?: string | null;
}): Promise<void>
```

**Process:**
1. Validate content (not empty, <= 5000 chars)
2. Insert to `guide_comments`
3. Log activity to `user_activity`
4. Return success + commentId

### 5. Update Hebrew Locale

Add to `comments` section:
- `writeComment`: 'כתוב תגובה...'
- `writeReply`: 'כתוב תשובה...'
- `markdownGuide`: 'מדריך עיצוב'
- `preview`: 'תצוגה מקדימה'
- `comment`: 'תגובה'
- `characterCount`: '{current} / 5000 תווים'
- `characterLimitExceeded`: 'חרגת ממספר התווים המותר'
- `commentPosted`: 'התגובה פורסמה בהצלחה'
- `replyPosted`: 'התשובה פורסמה בהצלחה'
- `errorPostingComment`: 'שגיאה בפרסום התגובה'
- `emptyComment`: 'התגובה לא יכולה להיות ריקה'

### 6. Markdown Formatting Guide

**Collapsible section with examples:**
- **Bold:** `**טקסט מודגש**` → **טקסט מודגש**
- **Italic:** `*טקסט נטוי*` → *טקסט נטוי*
- **Code:** `` `קוד` `` → `קוד`
- **Link:** `[טקסט הקישור](URL)` → [טקסט הקישור](URL)

**Note:** Full markdown rendering in Story 8.2, extended markdown in future

### 7. Preview Tab

**Implementation:**
- Tab toggle: Write | Preview
- Write tab: Show textarea
- Preview tab: Show rendered markdown
- Use simple markdown renderer (or just show formatted text for now)
- Full markdown support can be added in refinement

### 8. Auto-Expanding Textarea

**Implementation:**
- Use `useEffect` to adjust height based on scrollHeight
- Min height: 3 rows (72px)
- Max height: 400px (then scroll)
- Smooth transition

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
