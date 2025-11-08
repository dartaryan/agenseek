# 🚀 NEXT STORY: Story 8.5 - Implement Comment Edit and Delete

**Updated:** November 8, 2025

---

## ✅ Story 8.4 Complete!

Users can now use Q&A functionality! Features include:

- Question comments with orange styling and badge
- Solution marking by question author
- Green styling for solution replies
- Solutions float to top of replies
- Q&A filter toggle to show only questions
- Permission-based solution marking
- Real-time updates for solutions
- Visual feedback with badges and colors

**Completion File:** See `STORY-8.4-COMPLETE.md` for full details.

**Epic 8 Status:** 4/6 stories complete (67%)

---

## 📍 Next Story to Implement

### **Story 8.5: Implement Comment Edit and Delete**

**Epic:** 8 - Community Features (Comments & Q&A)
**Priority:** P0
**Sprint:** 11
**Story Points:** 3
**Dependencies:** Story 8.4 Complete ✅

---

## 🎯 Story 8.5 Overview

Allow users to edit and delete their own comments. Edited comments show "(נערך)" timestamp. Deleting parent comments with replies shows placeholder text instead of full deletion.

### User Story

**As a user,**
**I want to edit or delete my own comments,**
**So that I can correct mistakes or remove content I no longer want visible.**

---

## 📋 Acceptance Criteria

### Edit Functionality

**Given** I posted a comment
**When** I want to edit it
**Then:**

- [ ] Edit button (pencil icon) appears on hover (own comments only)
- [ ] Click edit:
  - Comment text becomes textarea
  - "שמור" and "ביטול" buttons appear
  - Can modify text
  - Save updates comment and updated_at timestamp
  - Shows "(נערך)" label with timestamp
- [ ] Edited comments display "(נערך)" when updated_at > created_at + 1 minute
- [ ] Character limit still applies (5000 chars)
- [ ] Markdown formatting preserved

### Delete Functionality

**Given** I posted a comment
**When** I want to delete it
**Then:**

- [ ] Delete button (trash icon) appears on hover
- [ ] Click delete:
  - Confirmation dialog: "למחוק תגובה? לא ניתן לבטל פעולה זו."
  - On confirm: DELETE from guide_comments
  - Comment removed from UI with fade-out animation
  - Decrement guide comment count
- [ ] If parent comment with replies:
  - Show "[התגובה נמחקה]" placeholder
  - Keep replies visible
  - Preserve thread structure
- [ ] If no replies: Hard delete (complete removal)
- [ ] Activity logged

### Permissions

**Given** I'm viewing comments
**Then:**

- [ ] Edit/Delete buttons only visible on my own comments
- [ ] Cannot edit/delete other users' comments
- [ ] Server-side validation prevents unauthorized edits/deletes

---

## 🔨 Implementation Plan

### 1. Add Edit State to CommentItem/CommentReply

**Files:**
- `src/components/comments/CommentItem.tsx`
- `src/components/comments/CommentReply.tsx`

**Changes:**
1. Add `isEditing` state
2. Replace content display with textarea when editing
3. Add Save/Cancel buttons when editing
4. Handle edit submission
5. Display "(נערך)" when edited

### 2. Create Edit and Delete Actions

**File:** `src/lib/actions/comments.ts`

**Functions:**
```typescript
async function editComment(data: {
  commentId: string;
  userId: string;
  content: string;
}): Promise<{ success: boolean; error?: string }>;

async function deleteComment(data: {
  commentId: string;
  userId: string;
}): Promise<{ success: boolean; error?: string }>;
```

**Logic:**
- Verify user ownership
- Update/delete in database
- Log activity
- Return success/error

### 3. Add Confirmation Dialog

**Component:** Use shadcn/ui `AlertDialog`

**Flow:**
1. User clicks delete
2. Dialog opens: "למחוק תגובה? לא ניתן לבטל פעולה זו."
3. User confirms or cancels
4. On confirm: delete and show toast

### 4. Soft Delete for Parent Comments

**Logic:**
```typescript
// Check if comment has replies
const hasReplies = await checkForReplies(commentId);

if (hasReplies) {
  // Soft delete: Replace content with placeholder
  await updateComment({
    id: commentId,
    content: '[התגובה נמחקה]',
    is_deleted: true, // New field
  });
} else {
  // Hard delete
  await deleteComment(commentId);
}
```

### 5. Update Types (if needed)

**File:** `src/types/database.ts`

Add `is_deleted` field to `guide_comments` table if not present.

### 6. Update Hebrew Locale

Add to `comments` section:
- `edit`: 'ערוך'
- `delete`: 'מחק'
- `deleteConfirm`: 'למחוק תגובה? לא ניתן לבטל פעולה זו.'
- `deleteSuccess`: 'התגובה נמחקה בהצלחה'
- `deleteError`: 'שגיאה במחיקת התגובה'
- `edited`: '(נערך)'
- `save`: 'שמור'
- `cancel`: 'ביטול'
- `commentDeleted`: '[התגובה נמחקה]'
- `editSuccess`: 'התגובה עודכנה בהצלחה'
- `editError`: 'שגיאה בעדכון התגובה'

### 7. Add Edit Mode UI

**Edit State:**
- Textarea with current content
- Character counter
- Save button (emerald)
- Cancel button (gray)
- Disable other actions while editing

### 8. Activity Logging

**Activities:**
- `comment_edited`: Log when user edits comment
- `comment_deleted`: Log when user deletes comment

---

## 🎨 UI/UX Considerations

### Edit Button
- Pencil icon from Tabler Icons
- Appears on hover (desktop) or always visible (mobile)
- Only on user's own comments

### Delete Button
- Trash icon from Tabler Icons
- Red/destructive color
- Confirmation required

### Edit Mode
- Textarea replaces content
- Auto-focus on textarea
- Same styling as comment form
- Character counter visible

### Edited Label
- "(נערך)" displayed next to timestamp
- Gray/muted color
- Hover shows edit time

### Soft Delete Display
- "[התגובה נמחקה]" text
- Gray/muted styling
- Replies still visible and indented
- User avatar and name removed

---

## 🧪 Testing Scenarios

### Happy Path - Edit
1. User posts comment
2. User clicks edit button
3. Modifies text
4. Clicks save
5. **Expected:**
   - Comment updated
   - "(נערך)" label appears
   - Toast: "התגובה עודכנה בהצלחה"

### Happy Path - Delete (No Replies)
1. User posts comment (no replies)
2. User clicks delete
3. Confirms in dialog
4. **Expected:**
   - Comment removed completely
   - UI updates smoothly
   - Toast: "התגובה נמחקה בהצלחה"

### Soft Delete (With Replies)
1. User posts comment
2. Others reply to it
3. User deletes original comment
4. **Expected:**
   - Content replaced with "[התגובה נמחקה]"
   - Replies remain visible
   - Thread structure preserved

### Permissions
1. User A posts comment
2. User B views comment
3. **Expected:**
   - User B does NOT see edit/delete buttons
   - Only User A sees buttons

### Cancel Edit
1. User clicks edit
2. Modifies text
3. Clicks cancel
4. **Expected:**
   - Original text restored
   - Edit mode closed
   - No changes saved

### Validation
1. User edits comment
2. Deletes all content
3. Tries to save
4. **Expected:**
   - Error: "התגובה לא יכולה להיות ריקה"
   - Cannot save empty comment

---

## 🔐 Security & Validation

### Client-Side
- Only show buttons to comment owner
- Validate content before submission
- Character limit enforced
- Confirmation required for delete

### Server-Side (RLS Policies)
- User can only update their own comments
- User can only delete their own comments
- Content validation
- Rate limiting (prevent spam)

### Database Constraints
- `content` NOT NULL (unless soft deleted)
- `user_id` validated against auth
- `updated_at` automatically updated

---

## 📚 Technical Resources

### Confirmation Dialog
Use shadcn/ui `AlertDialog`:
```typescript
<AlertDialog>
  <AlertDialogTrigger>
    <Button>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>למחוק תגובה?</AlertDialogTitle>
      <AlertDialogDescription>
        לא ניתן לבטל פעולה זו.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>ביטול</AlertDialogCancel>
      <AlertDialogAction>מחק</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Soft Delete Check
```typescript
const checkForReplies = async (commentId: string) => {
  const { count } = await supabase
    .from('guide_comments')
    .select('id', { count: 'exact', head: true })
    .eq('parent_comment_id', commentId);

  return count > 0;
};
```

---

## ✅ Definition of Done

Before marking story complete:

- [ ] Edit button appears on own comments
- [ ] Edit mode with textarea functional
- [ ] Save updates comment in database
- [ ] Cancel discards changes
- [ ] "(נערך)" label displays correctly
- [ ] Delete button appears on own comments
- [ ] Confirmation dialog displays
- [ ] Delete removes comment (or soft deletes)
- [ ] Soft delete preserves replies
- [ ] Hard delete removes completely
- [ ] Activity logged for both actions
- [ ] Toast notifications display
- [ ] Permissions enforced (client + server)
- [ ] Real-time updates working
- [ ] Hebrew locale strings added
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] RTL layout correct
- [ ] Manual testing passed

---

## 🚀 Ready to Implement!

Story 8.4 complete with Q&A functionality. Story 8.5 will allow users to manage their own comments by editing and deleting them.

**Start Command:**
```bash
# No new dependencies needed
```

Then implement in this order:
1. Add edit state to CommentItem/CommentReply
2. Create edit/delete actions in comments.ts
3. Add confirmation dialog
4. Implement soft delete logic
5. Add Hebrew locale strings
6. Test edit flow
7. Test delete flow (both hard and soft)
8. Test permissions
9. Complete story documentation

---

**Let's build comment management! ✏️🗑️**
