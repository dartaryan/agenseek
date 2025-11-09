# Story 0.19: Fix Onboarding After Account Deletion - COMPLETE

**Status:** ✅ Complete
**Created:** November 9, 2025
**Epic:** 0 - On-the-Go Stories

---

## Problem Statement

When a user deleted their account and created a new one (or logged back in with the same email), they were NOT shown the onboarding flow. This happened because:

1. Account deletion removes the profile from the database but NOT the auth user (requires admin API)
2. When the user logs back in, they have a user account but no profile
3. The `ProtectedRoute` component didn't properly handle the case where `profile === null`
4. The old logic only checked `!profile.completed_onboarding` but skipped the redirect when profile was null entirely

---

## Root Cause

**File:** `src/components/common/ProtectedRoute.tsx` (lines 58-70)

**Old Logic:**
```typescript
// Only redirected if profile EXISTS and is incomplete
if (!skipOnboardingCheck && profile && !profile.completed_onboarding) {
  return <Navigate to="/onboarding" replace />;
}

// Missing profile was logged but NOT redirected
if (!skipOnboardingCheck && !profile && user) {
  console.error('Profile failed to load for authenticated user');
  // Allow access anyway - THIS WAS THE BUG
}
```

**Problem:** When `profile === null`, neither condition triggered a redirect to onboarding.

---

## Solution

Updated `ProtectedRoute` to explicitly handle **two cases**:

1. **No profile at all** (`!profile && user`) → Redirect to onboarding (recreate profile)
2. **Profile exists but incomplete** (`profile && !profile.completed_onboarding`) → Redirect to onboarding

---

## What Was Fixed

### File Modified: `src/components/common/ProtectedRoute.tsx`

**New Logic:**
```typescript
if (!skipOnboardingCheck) {
  // Case 1: No profile at all (user exists but profile missing)
  // This happens after account deletion - redirect to onboarding to recreate profile
  if (!profile && user) {
    console.log('[ProtectedRoute] No profile found for authenticated user - redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // Case 2: Profile exists but onboarding not completed
  if (profile && !profile.completed_onboarding) {
    console.log('[ProtectedRoute] User has not completed onboarding - redirecting');
    return <Navigate to="/onboarding" replace />;
  }
}
```

---

## How Account Deletion Works (Context)

**File:** `src/lib/api/deleteAccount.ts`

**Current Flow:**
1. Deletes user data from 9 database tables:
   - user_activity
   - guide_bookmarks
   - comment_votes
   - guide_comments
   - user_tasks
   - user_notes
   - user_progress
   - **profiles** (deleted)
   - notifications
2. Signs out the user
3. **Auth user is NOT deleted** (requires Supabase Admin API, not available client-side)

**Result:**
- User can log back in with same email/password
- Auth user exists, but profile is NULL
- System now correctly redirects to onboarding

---

## Testing Scenarios

### Scenario 1: Delete Account → Log Back In
✅ **Before Fix:** User logs in → Gets stuck (no profile, no redirect)
✅ **After Fix:** User logs in → Redirected to onboarding → Can recreate profile

### Scenario 2: New User First Time
✅ **Before Fix:** Works correctly (profile created by trigger with `completed_onboarding = false`)
✅ **After Fix:** Still works correctly

### Scenario 3: Existing User Logs In
✅ **Before Fix:** Works correctly (profile exists with `completed_onboarding = true`)
✅ **After Fix:** Still works correctly

### Scenario 4: User Completes Onboarding
✅ **Before Fix:** Works correctly
✅ **After Fix:** Still works correctly

---

## Edge Cases Handled

1. **Profile creation failed during registration**
   - System redirects to onboarding to create profile

2. **Database trigger didn't create profile**
   - System redirects to onboarding as fallback

3. **Admin manually deleted profile**
   - System redirects to onboarding to recreate

4. **Profile exists but incomplete**
   - System still redirects to onboarding (existing behavior preserved)

---

## Why Auth User Isn't Deleted

**Technical Limitation:** Supabase requires **admin privileges** to delete auth users.

**Options Considered:**

1. **Create Supabase Edge Function** (with admin privileges)
   - Requires backend setup
   - Adds complexity
   - Deferred for now

2. **Fix client-side redirect logic** ✅ **CHOSEN**
   - Simple, effective
   - Works with existing auth flow
   - No backend changes needed

**Future Enhancement:** Create admin edge function to fully delete auth users.

---

## Files Modified

1. `src/components/common/ProtectedRoute.tsx`
   - Updated onboarding check logic
   - Handles `profile === null` case
   - Clear comments explaining two cases

---

## Success Criteria Met

✅ User deletes account → profile removed
✅ User logs back in → redirected to onboarding
✅ User completes onboarding → profile recreated
✅ User logs in again → normal access (no onboarding loop)
✅ Existing users unaffected
✅ New users still see onboarding
✅ No infinite redirect loops
✅ Clear console logging for debugging

---

## Verification

**Manual Testing:**
1. ✅ Created test account
2. ✅ Completed onboarding
3. ✅ Deleted account
4. ✅ Logged back in with same email
5. ✅ **Result:** Redirected to onboarding as expected
6. ✅ Completed onboarding again
7. ✅ Logged out and back in
8. ✅ **Result:** Went straight to dashboard (no loop)

**Console Logs:**
```
[ProtectedRoute] No profile found for authenticated user - redirecting to onboarding
```

---

## Related Files for Reference

- `src/lib/api/deleteAccount.ts` - Account deletion logic
- `src/contexts/AuthContext.tsx` - Profile loading
- `src/app/auth/callback.tsx` - OAuth callback (already handles missing profile)
- `src/app/onboarding/wizard.tsx` - Onboarding flow

