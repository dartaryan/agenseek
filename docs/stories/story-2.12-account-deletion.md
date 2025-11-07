# Story 2.12: Account Deletion Feature

Status: drafted

## Story

As a user,
I want to permanently delete my account and all associated data,
So that I can exercise my right to be forgotten and remove my personal information from the platform.

## Acceptance Criteria

### Settings Page UI

**Given** I am logged in and navigate to `/settings`
**When** I view the account settings page
**Then**:
- Page includes "מחיקת חשבון" (Delete Account) section
- Section displays prominent warning in red/amber:
  - "אזהרה: פעולה זו בלתי הפיכה" (Warning: This action is irreversible)
  - "כל הנתונים שלך יימחקו לצמיתות" (All your data will be permanently deleted)
- Section lists what will be deleted:
  - "פרופיל המשתמש" (User profile)
  - "התקדמות בלמידה" (Learning progress)
  - "הערות ומשימות" (Notes and tasks)
  - "תגובות ושאלות" (Comments and questions)
  - "סימניות והישגים" (Bookmarks and achievements)
- Red destructive button displays: "מחק את החשבון שלי" (Delete My Account)

### Confirmation Dialog

**Given** I click the delete account button
**When** the confirmation dialog opens
**Then**:
- Dialog displays with:
  - Title: "האם אתה בטוח?" (Are you sure?)
  - Warning message: "פעולה זו תמחק את כל הנתונים שלך ולא ניתן לשחזרם" (This will delete all your data and cannot be undone)
  - Text input field with label: "הקלד 'מחק' כדי לאשר" (Type 'DELETE' to confirm)
  - Two buttons: "ביטול" (Cancel) and "מחק לצמיתות" (Delete Permanently)
- Delete button is disabled until input is validated
- Input accepts "מחק" (Hebrew) or "DELETE" (English) case-insensitively
- Typing correct confirmation text enables delete button

### Deletion Process

**Given** I have confirmed account deletion
**When** I click "מחק לצמיתות" (Delete Permanently)
**Then**:
- Button shows loading state: "מוחק חשבון..." (Deleting account...)
- System executes deletion transaction in this order:
  1. Delete from `user_activity` where user_id = current user
  2. Delete from `guide_bookmarks` where user_id = current user
  3. Delete from `comment_votes` where user_id = current user
  4. Delete from `guide_comments` where user_id = current user
  5. Delete from `user_tasks` where user_id = current user
  6. Delete from `user_notes` where user_id = current user
  7. Delete from `user_progress` where user_id = current user
  8. Delete from `profiles` where id = current user
  9. Delete from Supabase Auth using `supabase.auth.admin.deleteUser()`
- User is immediately logged out
- Success toast displays: "החשבון נמחק בהצלחה. להתראות!" (Account deleted successfully. Goodbye!)
- User is redirected to home page or public landing page

### Post-Deletion Behavior

**And** deleted accounts cannot be recovered
**And** attempting to log in with deleted account credentials fails with appropriate error
**And** email becomes available for new registration after 30 days (optional grace period)

## Tasks / Subtasks

- [ ] Create Account Settings Page (AC: Settings Page UI)
  - [ ] Create `/settings` route in router configuration
  - [ ] Create `src/pages/settings/AccountSettingsPage.tsx`
  - [ ] Design page layout with sections
  - [ ] Add "מחיקת חשבון" danger zone section
  - [ ] Display warning messages with Callout component
  - [ ] Add list of data to be deleted
  - [ ] Add red destructive delete button
  - [ ] Style with appropriate warning colors (red/amber)
- [ ] Create Confirmation Dialog Component (AC: Confirmation Dialog)
  - [ ] Create `src/components/settings/DeleteAccountDialog.tsx`
  - [ ] Use Shadcn/ui Dialog component
  - [ ] Add warning title and message
  - [ ] Add text input for confirmation
  - [ ] Validate input accepts "מחק" or "DELETE" (case-insensitive)
  - [ ] Enable/disable delete button based on validation
  - [ ] Add cancel and delete buttons
  - [ ] Handle escape key to close dialog
- [ ] Implement Deletion Logic (AC: Deletion Process)
  - [ ] Create `src/lib/api/deleteAccount.ts` service function
  - [ ] Implement cascading deletion in correct order
  - [ ] Use Supabase transaction for atomicity
  - [ ] Delete from all 8 database tables
  - [ ] Call Supabase Auth admin API for user deletion
  - [ ] Handle errors gracefully with rollback
  - [ ] Add comprehensive error logging
  - [ ] Return success/failure status
- [ ] Implement Deletion Flow (AC: Deletion Process)
  - [ ] Call deletion service from dialog component
  - [ ] Show loading state during deletion
  - [ ] Handle success case:
    - Call sign out
    - Show success toast
    - Redirect to home page
  - [ ] Handle error case:
    - Show error toast with Hebrew message
    - Log error details
    - Keep user logged in
- [ ] Update Supabase RLS Policies (AC: Security)
  - [ ] Verify users can only delete their own data
  - [ ] Add RLS policy for deletion operations
  - [ ] Test unauthorized deletion attempts fail
- [ ] Add Audit Logging (AC: Compliance)
  - [ ] Log deletion event before removing data
  - [ ] Store: user_id, email, timestamp, IP address
  - [ ] Save to separate audit log table (not deleted with user)
  - [ ] Consider GDPR compliance requirements
- [ ] Add Hebrew Locale Strings (AC: All)
  - [ ] Add account deletion strings to `src/lib/locale/he.ts`
  - [ ] Add confirmation dialog strings
  - [ ] Add error messages
  - [ ] Add success messages
- [ ] Testing (AC: All)
  - [ ] Test successful deletion flow
  - [ ] Test cancellation works correctly
  - [ ] Test validation requires correct input
  - [ ] Test transaction rollback on error
  - [ ] Test foreign key constraints
  - [ ] Test RLS policies prevent unauthorized deletion
  - [ ] Test deleted account cannot log in
  - [ ] Test email becomes available after grace period
  - [ ] Manual test on staging environment

## Dev Notes

### Architecture Patterns
- Use Supabase transactions for atomic deletion
- Implement cascade deletion in correct dependency order
- Follow destructive action UI patterns (red colors, confirmation)
- Use RLS policies for security
- Consider soft delete option (mark as deleted, purge later)

### Source Tree Components to Touch
- `src/pages/settings/AccountSettingsPage.tsx` (NEW)
- `src/components/settings/DeleteAccountDialog.tsx` (NEW)
- `src/lib/api/deleteAccount.ts` (NEW)
- `src/lib/locale/he.ts` (UPDATE - add account deletion strings)
- `src/app/routes.tsx` (UPDATE - add /settings route)
- `supabase/migrations/` (NEW - add audit log table)

### Database Schema Considerations
- Deletion order must respect foreign key constraints
- Tables to delete from (in order):
  1. `user_activity` (references profiles)
  2. `guide_bookmarks` (references profiles)
  3. `comment_votes` (references guide_comments and profiles)
  4. `guide_comments` (references profiles)
  5. `user_tasks` (references profiles)
  6. `user_notes` (references profiles)
  7. `user_progress` (references profiles)
  8. `profiles` (references auth.users)
  9. `auth.users` (Supabase Auth table)

### Security Considerations
- Use RLS to ensure users can only delete their own account
- Require authentication check before deletion
- Rate limit deletion attempts
- Log all deletion attempts for audit trail
- Consider requiring password re-entry before deletion
- Consider email confirmation before deletion

### GDPR Compliance
- Right to be forgotten (GDPR Article 17)
- Consider adding "Download my data" option before deletion
- Ensure audit logs comply with legal retention requirements
- Email grace period allows account recovery window

### Testing Standards Summary
- Integration testing with test database
- Test transaction rollback scenarios
- Security testing for unauthorized access
- Manual testing on staging environment
- Verify all related data is deleted

### References
- Database schema: [Source: docs/epics.md#Story-1.5]
- Supabase Auth API: [Source: docs/architecture.md#Authentication]
- RLS policies: [Source: docs/architecture.md#Security]
- Destructive actions UI: [Source: docs/ux-design-specification.md#Destructive-Actions]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

