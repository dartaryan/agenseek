# Story 5.1.2: Toggle Guide Completion Status

**Epic:** Reader Experience Enhancements (Sub-Epic of Epic 5)
**Status:** Ready for Development
**Priority:** Medium
**Estimate:** 3 Story Points

## Overview
Allow users to mark a completed guide as "not completed" so they can re-read and track progress again. This provides flexibility for users who want to review guides or accidentally marked something as complete.

## User Story
**As a** user who has completed a guide
**I want** to be able to unmark it as completed
**So that** I can review it again with progress tracking or correct accidental completion

## Current Behavior
- When a guide is marked as completed, the "Mark Complete" button becomes disabled
- Button text changes to "הושלם" (Completed)
- Button variant changes to "outline"
- No way to reverse the completion status
- The `isCompleted` state is permanent for the session

## Desired Behavior
- Completed guides show "סמן כלא הושלם" (Mark as Not Completed) button
- Button remains enabled even after completion
- Clicking the button shows confirmation dialog
- Unmark action resets progress to last saved state before completion
- Activity log records both completion and un-completion events

## Acceptance Criteria

### UI Changes
- [ ] "Mark Complete" button is never disabled
- [ ] When `isCompleted === true`, button text changes to "סמן כלא הושלם"
- [ ] When `isCompleted === false`, button text shows "סמן כהושלם"
- [ ] Button always remains interactive and visually indicates current state
- [ ] Icon changes based on state (checkmark vs. rotate/undo icon)

### Confirmation Dialog
- [ ] Clicking "unmark complete" shows confirmation dialog
- [ ] Dialog explains that progress will be restored to pre-completion state
- [ ] Dialog has "Cancel" and "אישור" (Confirm) buttons
- [ ] Dialog is visually distinct from mark complete dialog

### Database Operations
- [ ] On unmark: Update `user_progress.completed = false`
- [ ] On unmark: Keep `completed_at` timestamp (for history)
- [ ] On unmark: Restore `progress_percent` to pre-completion value (stored before marking complete)
- [ ] On unmark: Log activity: `activity_type: 'uncomplete_guide'`
- [ ] On unmark: Do NOT decrement guide completion stats (prevents gaming)

### State Management
- [ ] `isCompleted` state updates immediately after successful unmark
- [ ] Progress widget reflects restored progress percentage
- [ ] Page doesn't need refresh to show updated state
- [ ] Toast notification shows success/error message

## Technical Implementation

### Files to Modify

1. **`src/app/guides/guide-reader.tsx`**
   - Add new state: `previousProgress` to store progress before completion
   - Add handler: `handleUnmarkComplete()`
   - Modify: `handleConfirmMarkComplete()` to save current progress before marking complete
   - Update button text/icon logic based on `isCompleted` state

2. **`src/components/guides/GuideActionsSidebar.tsx`**
   - Remove `disabled={isCompleted}` from Mark Complete button
   - Add prop: `onUnmarkComplete?: () => void`
   - Update button text logic
   - Add IconRotate or IconArrowBack for unmark state

3. **New Component: `src/components/guides/UnmarkCompleteDialog.tsx`**
   - Similar structure to MarkCompleteDialog
   - Different messaging: warn about restoring progress
   - Confirm/Cancel actions

4. **Database: `user_progress` table**
   - Already has `completed` boolean field
   - Already has `completed_at` timestamp
   - Add new field (migration): `progress_before_completion` (integer, nullable)
   - This preserves the actual reading progress before marking complete

### Implementation Details

```typescript
// In guide-reader.tsx

// Store progress before marking complete
const handleConfirmMarkComplete = async () => {
  // ... existing code ...

  // Save current progress before marking complete
  await supabase.from('user_progress').update({
    progress_before_completion: Math.round(scrollProgress),
    completed: true,
    progress_percent: 100,
    completed_at: new Date().toISOString(),
  }).eq('user_id', user.id).eq('guide_slug', slug);

  // ... rest of existing code ...
};

// New handler for unmarking
const handleUnmarkComplete = async () => {
  if (!user || !slug || !guide) return;

  setIsMarkingComplete(true);

  try {
    // Get stored progress before completion
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('progress_before_completion')
      .eq('user_id', user.id)
      .eq('guide_slug', slug)
      .single();

    const restoredProgress = progressData?.progress_before_completion || 0;

    // Update user_progress (keep completed_at for history)
    await supabase.from('user_progress').update({
      completed: false,
      progress_percent: restoredProgress,
      last_read_at: new Date().toISOString(),
    }).eq('user_id', user.id).eq('guide_slug', slug);

    // Log activity
    await supabase.from('user_activity').insert({
      user_id: user.id,
      activity_type: 'uncomplete_guide',
      target_slug: slug,
      metadata: {
        guide_title: guide.metadata.title,
        restored_progress: restoredProgress,
      },
    });

    // Update local state
    setIsCompleted(false);
    setScrollProgress(restoredProgress);

    toast({
      title: 'המדריך סומן כלא הושלם',
      description: `התקדמות שוחזרה: ${restoredProgress}%`,
    });
  } catch (err) {
    console.error('Failed to unmark complete:', err);
    toast({
      title: 'שגיאה',
      description: 'לא הצלחנו לסמן את המדריך כלא הושלם',
      variant: 'destructive',
    });
  } finally {
    setIsMarkingComplete(false);
    setShowUnmarkCompleteDialog(false);
  }
};
```

### Button State Logic

```typescript
// In GuideActionsSidebar.tsx
<Button
  onClick={isCompleted ? onUnmarkComplete : onMarkComplete}
  className="w-full"
  size="lg"
  variant={isCompleted ? 'outline' : 'default'}
>
  {isCompleted ? (
    <>
      <IconRotateClockwise className="w-5 h-5 ml-2" />
      סמן כלא הושלם
    </>
  ) : (
    <>
      <IconCheck className="w-5 h-5 ml-2" />
      סמן כהושלם
    </>
  )}
</Button>
```

## Database Migration

Create new migration: `supabase/migrations/YYYYMMDDHHMMSS_add_progress_before_completion.sql`

```sql
-- Add column to store progress before marking complete
ALTER TABLE user_progress
ADD COLUMN progress_before_completion INTEGER;

-- Add comment
COMMENT ON COLUMN user_progress.progress_before_completion IS 'Progress percentage before marking complete (for restoration on uncomplete)';

-- Add check constraint (0-100)
ALTER TABLE user_progress
ADD CONSTRAINT progress_before_completion_range
CHECK (progress_before_completion IS NULL OR (progress_before_completion >= 0 AND progress_before_completion <= 100));
```

## Testing Checklist

### Functionality
- [ ] Mark guide as complete - works as before
- [ ] After completion, button shows "סמן כלא הושלם"
- [ ] Click unmark button - dialog opens
- [ ] Cancel in dialog - no change
- [ ] Confirm in dialog - guide unmarked successfully
- [ ] Progress restored to pre-completion value
- [ ] Progress widget shows restored percentage
- [ ] Toast notification appears
- [ ] Button changes back to "סמן כהושלם"

### Database
- [ ] `completed` field updates correctly (true → false)
- [ ] `progress_percent` restores to saved value
- [ ] `progress_before_completion` is saved before marking complete
- [ ] `completed_at` timestamp is preserved (not cleared)
- [ ] Activity log has both `complete_guide` and `uncomplete_guide` entries

### Edge Cases
- [ ] Unmarking when `progress_before_completion` is NULL (defaults to 0)
- [ ] Marking complete at 0% progress
- [ ] Marking complete at 100% progress (read through)
- [ ] Multiple mark/unmark cycles
- [ ] Network error during unmark operation
- [ ] Concurrent sessions (user opens same guide in 2 tabs)

### UX Polish
- [ ] Button transitions are smooth
- [ ] Icons are appropriate for each state
- [ ] Dialog messaging is clear
- [ ] Loading states during async operations
- [ ] No layout shift when button text changes

## Definition of Done

- All acceptance criteria met
- Database migration created and tested
- New dialog component implemented
- GuideActionsSidebar updated with unmark capability
- Activity logging includes uncomplete events
- Tested all edge cases
- No regression in existing mark complete flow
- Code reviewed and approved
- Documentation updated

## Dependencies
- Database migration must be deployed before feature
- No breaking changes to existing completion tracking

## Related Stories
- Story 4.7 (Mark Complete with Celebration) - Parent
- Story 5.1.1 (Mobile Reader UX) - Sibling
- Story 5.1.3 (Fix Related Guides Icons) - Sibling

## Future Enhancements
- Show completion history in profile (how many times user completed a guide)
- Admin analytics: track completion/uncompletion patterns
- Badge: "Perfectionist" for users who re-read guides

