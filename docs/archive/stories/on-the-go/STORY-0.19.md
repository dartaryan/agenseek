# Story 0.19: Fix Onboarding After Account Deletion

**Status:** Pending
**Created:** November 9, 2025
**Epic:** 0 - On-the-Go Stories

---

## Problem Statement

When a user deletes their account and creates a new one, they are not shown the onboarding flow. This happens because the account deletion doesn't properly clean up all user data from the database, causing the system to think the user has already completed onboarding.

---

## User Story

As a new user who previously deleted an account,
I want to see the onboarding flow when I create a new account,
So that I can properly set up my learning preferences and profile.

---

## Acceptance Criteria

**Given** a user has deleted their account
**When** they create a new account with the same or different email
**Then**:
- They are shown the full onboarding flow
- The system does not remember their previous account settings
- All previous user data is properly cleaned up

**And Given** the user completes onboarding
**When** they log in again
**Then** they should NOT see onboarding again (normal behavior)

---

## Root Cause Analysis

**Issue:** The `signOut()` and account deletion flow may not be:
1. Properly deleting the user record from Supabase Auth
2. Cleaning up all related data in the `profiles` table
3. Clearing the `onboarding_completed` flag

**Current Deletion Flow (needs investigation):**
- Check: Does `DELETE_USER` function properly cascade delete?
- Check: Is the auth user actually deleted or just soft-deleted?
- Check: Are there any orphaned records in the database?

---

## Technical Implementation

### Option 1: Fix Account Deletion (Recommended)

**Files to Investigate:**
1. `src/lib/auth.ts` - Check `signOut()` function
2. `supabase/functions/delete-user` (if exists)
3. Profile deletion logic

**Changes Needed:**
1. Ensure proper CASCADE DELETE on user-related tables
2. Verify Supabase Auth user is fully deleted
3. Clear all localStorage/sessionStorage on deletion
4. Add migration to clean up orphaned records

### Option 2: Force Onboarding Check (Backup)

**Files to Modify:**
1. `src/contexts/AuthContext.tsx`
   - Add more robust onboarding check
   - Check if profile exists AND has valid data
   - If profile is empty/incomplete, force onboarding

2. `src/components/auth/ProtectedRoute.tsx`
   - Enhanced onboarding detection
   - Redirect to onboarding if profile is incomplete

**Onboarding Detection Logic:**
```typescript
const shouldShowOnboarding = (profile) => {
  if (!profile) return true;
  if (!profile.onboarding_completed) return true;
  if (!profile.role || !profile.experience_level) return true;
  return false;
};
```

---

## Database Schema Review

**Tables to Check:**
- `auth.users` - Is CASCADE DELETE configured?
- `public.profiles` - ON DELETE CASCADE?
- `public.user_progress` - ON DELETE CASCADE?
- `public.user_notes` - ON DELETE CASCADE?
- `public.user_tasks` - ON DELETE CASCADE?
- `public.user_achievements` - ON DELETE CASCADE?
- `public.user_activity` - ON DELETE CASCADE?

**Create Migration (if needed):**
```sql
-- Ensure proper CASCADE DELETE for all user-related tables
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Repeat for all other user-related tables...
```

---

## Testing Checklist

- [ ] Create new account → Complete onboarding → Delete account
- [ ] Create new account with same email → Verify onboarding shows
- [ ] Check database for orphaned records after deletion
- [ ] Verify all user data is cleaned up
- [ ] Test with different email → Verify clean slate
- [ ] Verify localStorage is cleared on deletion
- [ ] Test: Complete onboarding → Log out → Log in → No onboarding

---

## Edge Cases

1. **User deletes account while logged in on multiple devices**
   - Ensure all sessions are invalidated

2. **User starts deletion but doesn't complete**
   - Handle partial deletion state

3. **Admin deletes user account**
   - Ensure proper cleanup

---

## Success Criteria

- [ ] Account deletion fully removes user from database
- [ ] New account creation always triggers onboarding
- [ ] No orphaned records remain after deletion
- [ ] Onboarding state is correctly managed
- [ ] localStorage is properly cleared

