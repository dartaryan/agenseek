# Story 11.1: Critical - User Deletion Authentication Bug

**Status:** 📋 Ready for Implementation
**Type:** Bug Fix (Critical)
**Priority:** P0 - Critical
**Sprint:** TBD | **Points:** 2 (Small-Medium)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Issue:**

When a user deletes their account (registered via regular email), they can still successfully log in to the application. This indicates that the user account is not being properly deleted from the authentication system.

**Impact:**
- **Security Risk**: Deleted users retaining access
- **Data Integrity**: User data not properly cleaned up
- **Trust Issue**: Users expect deletion to be permanent
- **Compliance Risk**: Possible GDPR/privacy violations
- **Critical Priority**: Must be fixed immediately

**Root Cause (Suspected):**
- User deletion only removes from `profiles` table, not `auth.users`
- Auth session remains valid after profile deletion
- Cascade delete not configured properly
- RLS policies may be blocking proper deletion

---

## 📖 User Story

**As a user who wants to delete my account,**
**I want my account to be completely removed from the system,**
**So that I cannot log in again and my data is fully deleted.**

---

## ✅ Acceptance Criteria

### 1. Investigate Current Deletion Flow

**Given** a user deletion process exists
**When** investigating the current implementation
**Then:**

- [ ] Review current user deletion code in admin panel
- [ ] Check what happens when "Delete User" is clicked
- [ ] Verify if `auth.users` deletion is attempted
- [ ] Check database cascade delete configuration
- [ ] Review RLS policies on auth.users
- [ ] Document current deletion flow

**Files to Check:**
- `src/components/admin/UserManagement.tsx` (or similar)
- `src/lib/admin.ts` (or admin service file)
- `supabase/migrations/` - Check table definitions and policies

---

### 2. Reproduce the Bug

**Given** the bug report
**When** attempting to reproduce
**Then:**

- [ ] Create a test user via email registration
- [ ] Log in with test user
- [ ] Delete the test user via admin panel
- [ ] Attempt to log in again with same credentials
- [ ] **Bug confirmed** if login succeeds
- [ ] Document exact steps to reproduce

---

### 3. Fix Supabase Auth Deletion

**Given** users need to be fully deleted
**When** implementing the fix
**Then:**

- [ ] Update deletion code to use Supabase Admin API
- [ ] Call `supabase.auth.admin.deleteUser(userId)` to remove from auth.users
- [ ] Ensure deletion happens in correct order:
  1. Delete user profile data
  2. Delete related data (progress, notes, etc.)
  3. Delete from auth.users
- [ ] Handle deletion errors gracefully
- [ ] Log deletion operations for audit trail

**Example Implementation:**

```typescript
// src/lib/admin.ts (or similar)
export async function deleteUser(userId: string) {
  try {
    // Step 1: Delete user-related data (CASCADE should handle most)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Failed to delete profile:', profileError);
      throw profileError;
    }

    // Step 2: Delete from auth.users using admin API
    // IMPORTANT: This requires admin privileges
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Failed to delete auth user:', authError);
      throw authError;
    }

    return { success: true };
  } catch (error) {
    console.error('User deletion failed:', error);
    throw error;
  }
}
```

---

### 4. Verify Cascade Delete Configuration

**Given** related data should be deleted
**When** user is deleted
**Then:**

- [ ] Check database schema for cascade delete rules
- [ ] Ensure foreign keys have `ON DELETE CASCADE`
- [ ] Tables that should cascade:
  - `user_progress` → CASCADE on user deletion
  - `user_notes` → CASCADE on user deletion
  - `user_achievements` → CASCADE on user deletion
  - `user_preferences` → CASCADE on user deletion
  - Any other user-related tables

**Example Migration (if needed):**

```sql
-- Check if cascade delete is configured
-- If not, add migration to fix it

ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey,
ADD CONSTRAINT user_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE user_notes
DROP CONSTRAINT IF EXISTS user_notes_user_id_fkey,
ADD CONSTRAINT user_notes_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Repeat for all user-related tables
```

---

### 5. Handle RLS Policies

**Given** RLS policies may prevent deletion
**When** admin deletes a user
**Then:**

- [ ] Review RLS policies on all user tables
- [ ] Ensure admin can delete any user
- [ ] Add service role bypass if needed
- [ ] Test with admin and non-admin users

**Check RLS Policies:**

```sql
-- Example: Ensure admin can delete users
CREATE POLICY "Admins can delete any profile"
ON profiles
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.uid() = id
);
```

---

### 6. Add Confirmation Dialog

**Given** user deletion is permanent
**When** admin clicks delete
**Then:**

- [ ] Show clear confirmation dialog
- [ ] Warn that action is irreversible
- [ ] Require typing user email or "DELETE" to confirm
- [ ] Show loading state during deletion
- [ ] Show success/error toast after operation

**Example Confirmation:**

```
⚠️ Delete User Account?

This will permanently delete:
- User profile and authentication
- All user progress and notes
- All user data (cannot be undone)

Type "DELETE" to confirm:
[__________]

[Cancel] [Delete User]
```

---

### 7. Test Complete Deletion Flow

**Given** deletion is implemented
**When** testing the fix
**Then:**

- [ ] Create test user via email registration
- [ ] Add some data (progress, notes) for test user
- [ ] Log in as admin
- [ ] Delete the test user
- [ ] Verify deletion succeeds (toast shown)
- [ ] **Critical Test**: Attempt to log in with deleted user
  - **Expected**: Login fails with "Invalid credentials"
  - **Actual**: [Document result]
- [ ] Check database: `auth.users` should not contain user
- [ ] Check database: `profiles` should not contain user
- [ ] Check database: Related data should be deleted (cascade)

---

### 8. Test Edge Cases

**Given** various user scenarios
**When** testing deletion
**Then:**

- [ ] Test deleting OAuth user (Google sign-in)
- [ ] Test deleting user with active session
- [ ] Test deleting user with no data
- [ ] Test deleting user with lots of data
- [ ] Test concurrent deletion attempts
- [ ] Test deleting already-deleted user (should handle gracefully)
- [ ] Test admin cannot delete themselves (optional safety)

---

### 9. Add Audit Logging

**Given** user deletions are critical operations
**When** a user is deleted
**Then:**

- [ ] Log deletion to admin audit log
- [ ] Include: timestamp, admin user, deleted user ID, deleted user email
- [ ] Store in `admin_audit_log` table or similar
- [ ] Display in admin panel audit history

**Example Log Entry:**

```typescript
await supabase.from('admin_audit_log').insert({
  action: 'user_deleted',
  admin_id: adminUser.id,
  admin_email: adminUser.email,
  target_user_id: deletedUserId,
  target_user_email: deletedUserEmail,
  timestamp: new Date().toISOString(),
  ip_address: request.ip,
});
```

---

### 10. Update Documentation

**Given** deletion behavior has changed
**When** updating docs
**Then:**

- [ ] Update admin documentation
- [ ] Document deletion flow
- [ ] Add troubleshooting section
- [ ] Note that deletion is permanent and irreversible

---

## 🔧 Technical Implementation

### Current Deletion Code (Suspected)

```typescript
// BEFORE (BROKEN):
async function deleteUser(userId: string) {
  // Only deletes from profiles, not auth.users
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}
```

### Fixed Deletion Code

```typescript
// AFTER (FIXED):
async function deleteUser(userId: string) {
  try {
    // 1. Delete user data (cascade should handle related tables)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      throw profileError;
    }

    // 2. Delete from auth.users (CRITICAL!)
    const { data: { user }, error: authError } = await supabase.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      throw new Error(`Failed to delete auth user: ${authError.message}`);
    }

    // 3. Log audit trail
    await logUserDeletion(userId);

    return { success: true };
  } catch (error) {
    console.error('User deletion failed:', error);
    throw error;
  }
}
```

---

## 🧪 Testing Checklist

### Pre-Fix Testing
- [ ] Reproduce bug: deleted user can still log in
- [ ] Document current behavior
- [ ] Check database state after "deletion"

### Post-Fix Testing
- [ ] Deleted user CANNOT log in (shows "Invalid credentials")
- [ ] User removed from `auth.users` table
- [ ] User removed from `profiles` table
- [ ] Related data cleaned up (progress, notes, etc.)
- [ ] Admin sees success toast
- [ ] Audit log entry created

### Edge Case Testing
- [ ] OAuth user deletion works
- [ ] User with active session gets logged out after deletion
- [ ] User with no data can be deleted
- [ ] User with extensive data can be deleted
- [ ] Cannot delete already-deleted user (graceful error)

### Manual Testing Flow
1. Create test user: `test-delete@example.com`
2. Log in and create some data (progress, notes)
3. Log out
4. Log in as admin
5. Delete `test-delete@example.com`
6. Verify success message
7. **Critical**: Try to log in as `test-delete@example.com`
   - **Expected**: Login fails
8. Check database: User should not exist

---

## ✅ Definition of Done

Before marking story complete, verify:

### Functionality
- [ ] Deleted users CANNOT log in (login fails)
- [ ] User removed from `auth.users`
- [ ] User removed from `profiles`
- [ ] Related data cascade deleted
- [ ] Confirmation dialog requires explicit confirmation

### Security
- [ ] Only admins can delete users
- [ ] Audit log captures deletion
- [ ] No data remnants after deletion

### Testing
- [ ] Bug reproduced and confirmed fixed
- [ ] All edge cases tested
- [ ] Manual testing passed
- [ ] No regression in user management

### Code Quality
- [ ] Error handling implemented
- [ ] TypeScript types correct
- [ ] No console errors
- [ ] Code reviewed

---

## 📊 Success Metrics

**Bug Resolution:**
- Deleted users cannot log in (100% success rate)
- Zero "zombie accounts" (deleted but still accessible)

**Database Integrity:**
- User count in `auth.users` matches `profiles` count
- No orphaned user data after deletion

---

## 🚀 Implementation Plan

### Phase 1: Investigation (30 min)
1. Review current deletion code
2. Reproduce the bug
3. Check database configuration
4. Document root cause

### Phase 2: Fix Implementation (1 hour)
1. Update deletion function to use admin API
2. Add `supabase.auth.admin.deleteUser()` call
3. Verify cascade delete configuration
4. Add proper error handling

### Phase 3: Testing (45 min)
1. Test basic deletion flow
2. Verify user cannot log in after deletion
3. Test edge cases
4. Verify database cleanup

### Phase 4: Polish (15 min)
1. Add/improve confirmation dialog
2. Add audit logging
3. Update documentation

**Total Estimated Time:** 2.5 hours (2 points)

---

## 📝 Notes & Considerations

### Important: Admin API Access

Deleting from `auth.users` requires using the Supabase Admin API with service role key. This should only be done server-side or with proper admin authentication.

```typescript
// Ensure using admin client
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Admin key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### GDPR Compliance

This fix is important for GDPR compliance - users have the "right to be forgotten." Complete deletion ensures compliance.

### Soft Delete Alternative (Not Recommended Here)

While soft delete (marking as deleted but keeping data) is sometimes used, user explicitly requesting account deletion should result in hard delete per privacy regulations.

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (critical standalone fix)

### Blocks:
- User account security
- GDPR compliance
- Admin functionality trust

### Related:
- Admin user management features
- User privacy settings

---

**Created by:** Ben Akiva
**Date:** November 9, 2025
**Story Type:** Critical Bug Fix (Epic 11)
**Estimated Effort:** 2 story points (~2.5 hours)

---

*This is the highest priority story in Epic 11 - fix immediately before other stories.*

