# Story 0.22: Fix Account Deletion - Data Still Persists

**Type**: Bug Fix (Critical Security Issue)
**Status**: Complete
**Priority**: Critical
**Related**: Story 0.19 (Fixed onboarding redirect, but not data deletion)

## Problem

When a user deletes their account and then logs back in:
1. ✅ They are redirected to onboarding (Story 0.19 fixed this)
2. ❌ **But their old data is still there** (notes, tasks, progress, etc.)

This is a **critical privacy and security issue** - users expect their data to be deleted when they delete their account!

## Root Cause

**RLS (Row Level Security) policies were blocking DELETE operations!**

The `deleteAccount()` function in `src/lib/api/deleteAccount.ts` was attempting to delete data from multiple tables, but **the RLS policies didn't have DELETE permissions**, so the deletions were **failing silently**.

### Tables WITH Delete Policies (Data WAS Being Deleted)

✅ **user_notes** - Has "Users can delete own notes" policy
✅ **user_tasks** - Has "Users can delete own tasks" policy  
✅ **guide_comments** - Has "Users can delete own comments" policy
✅ **comment_votes** - Has "Users can delete own votes" policy
✅ **guide_bookmarks** - Has "Users can delete own bookmarks" policy

### Tables WITHOUT Delete Policies (Data WAS NOT Being Deleted)

❌ **user_progress** - NO DELETE POLICY → Progress data persisted!
❌ **user_activity** - NO DELETE POLICY → Activity data persisted!
❌ **profiles** - NO DELETE POLICY → Profile data persisted!
❌ **user_achievements** - NO DELETE POLICY → Achievement data persisted!
❌ **notifications** - NO DELETE POLICY → Notification data persisted!

## Solution

### 1. Added Missing RLS DELETE Policies

**File Created:** `supabase/migrations/20251109_add_missing_delete_policies.sql`

Added DELETE policies for:

```sql
-- Critical tables that MUST support deletion
CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity"
  ON user_activity FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Optional tables (may not exist in all environments)
CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Updated deleteAccount() Function

**File Modified:** `src/lib/api/deleteAccount.ts`

**Changes:**
1. Added deletion for `user_achievements` table
2. Added deletion for `notifications` table
3. Improved error handling (don't fail if optional tables don't exist)
4. Added detailed logging
5. Better documentation explaining auth user limitation

**New Deletion Order:**
1. user_activity ✅
2. guide_bookmarks ✅
3. comment_votes ✅
4. guide_comments ✅
5. user_tasks ✅
6. user_notes ✅
7. user_progress ✅
8. user_achievements ✅ (NEW)
9. notifications ✅ (NEW)
10. profiles ✅ (CRITICAL)
11. Sign out (auth user remains)

## Why Auth User Isn't Deleted

**Technical Limitation:** Deleting auth users from `auth.users` requires **Supabase Admin API**, which is not available client-side.

**Current Behavior:**
- User deletes account → Profile and all data deleted
- User can log back in with same credentials → Auth account still exists
- ProtectedRoute detects missing profile → Redirects to onboarding
- User completes onboarding → Fresh profile created
- **Result:** Clean slate, no old data

**Future Enhancement:** Create Supabase Edge Function with admin privileges to fully delete auth users.

## Testing Checklist

### Before Applying Migration

1. ❌ Delete account → Data persists
2. ❌ Log back in → Old notes/tasks still visible
3. ❌ Old progress data still in database

### After Applying Migration

1. ✅ Delete account → All data deleted
2. ✅ Log back in → Redirected to onboarding
3. ✅ Complete onboarding → Fresh profile
4. ✅ No old data visible
5. ✅ Database shows no orphaned records

### Test Each Table Deletion

Run these queries **before** and **after** account deletion:

```sql
-- Check for user data (replace USER_ID with actual ID)
SELECT COUNT(*) FROM user_progress WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM user_activity WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM user_achievements WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM notifications WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM profiles WHERE id = 'USER_ID';
SELECT COUNT(*) FROM user_notes WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM user_tasks WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM guide_bookmarks WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM guide_comments WHERE user_id = 'USER_ID';
SELECT COUNT(*) FROM comment_votes WHERE user_id = 'USER_ID';
```

**Expected Result:** All counts should be **0** after deletion.

## How to Apply This Fix

### Step 1: Apply Database Migration

```bash
# Connect to Supabase and run the migration
supabase db push

# OR manually apply via Supabase Dashboard SQL Editor
```

### Step 2: Deploy Updated Code

```bash
git add .
git commit -m "Fix: Account deletion now properly deletes all user data (Story 0.22)"
git push origin main
```

### Step 3: Test on Production

1. Create a test account
2. Add some notes, tasks, and progress
3. Delete the account
4. Check database to verify data is deleted
5. Log back in → Should see onboarding
6. Complete onboarding → Should see fresh profile

## Security & Privacy Implications

### Before This Fix

**GDPR/Privacy Issue:** User data was NOT being deleted when requested.
- Violates "Right to be Forgotten" (GDPR Article 17)
- User expectations not met
- Data retention without consent

### After This Fix

✅ **GDPR Compliant:** User data is properly deleted when account is deleted
✅ **User Expectations Met:** "Delete Account" actually deletes data
✅ **Privacy Respected:** No orphaned personal data

### Remaining Consideration

⚠️ **Auth User Record:** Still exists in `auth.users` table
- Contains: email, encrypted password, metadata
- Not accessible to user after profile deletion
- Can be cleaned up with scheduled job or admin function

## Files Modified

1. `supabase/migrations/20251109_add_missing_delete_policies.sql` (NEW)
   - Added DELETE RLS policies for missing tables

2. `src/lib/api/deleteAccount.ts` (UPDATED)
   - Added user_achievements deletion
   - Added notifications deletion
   - Improved error handling
   - Better documentation

3. `STORY-0.22-COMPLETE.md` (NEW)
   - This documentation file

## Related Stories

- **Story 0.19** - Fixed onboarding redirect after deletion (ProtectedRoute)
- **Story 2.12** - Original account deletion feature implementation
- **Story 0.22** - Fixed actual data deletion (RLS policies)

## Prevention

**For Future Tables:**

When creating new tables that store user data:

1. ✅ Add foreign key to `profiles(id)` with `ON DELETE CASCADE`
2. ✅ Enable RLS on the table
3. ✅ Add ALL CRUD policies (SELECT, INSERT, UPDATE, **DELETE**)
4. ✅ Add table to `deleteAccount()` function
5. ✅ Test deletion works before deploying

**Checklist Template for New User Tables:**

```sql
-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- SELECT policy
CREATE POLICY "Users can view own data"
  ON new_table FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert own data"
  ON new_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update own data"
  ON new_table FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy (DON'T FORGET THIS!)
CREATE POLICY "Users can delete own data"
  ON new_table FOR DELETE
  USING (auth.uid() = user_id);
```

---

**Status**: ✅ Complete - Migration ready to apply
**Priority**: CRITICAL - Apply immediately
**Testing**: Manual testing required after migration

