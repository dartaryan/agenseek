# 🚨 CRITICAL: Apply Delete Policies Migration NOW

**Priority**: CRITICAL - Security & Privacy Issue
**Impact**: User data is NOT being deleted when accounts are deleted
**Action Required**: Apply database migration immediately

---

## The Problem

When users delete their accounts, **their data is NOT actually being deleted** from the database!

This is because RLS policies are missing DELETE permissions for several tables.

**Current State:**
- ❌ user_progress → Data persists after deletion
- ❌ user_activity → Data persists after deletion  
- ❌ profiles → Data persists after deletion
- ❌ user_achievements → Data persists after deletion
- ❌ notifications → Data persists after deletion

**Privacy/Legal Issue:** Violates GDPR "Right to be Forgotten"

---

## How to Fix (Choose One Method)

### Method 1: Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **Agenseek**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the **ENTIRE** content of:
   ```
   supabase/migrations/20251109_add_missing_delete_policies.sql
   ```
6. Click **Run** (or press Ctrl+Enter)
7. Verify: You should see "Success. No rows returned"

### Method 2: Supabase CLI (If Linked)

```bash
# Link to your project first (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
npx supabase db push
```

---

## Verification After Migration

### Step 1: Check Policies Were Created

Run this in SQL Editor:

```sql
-- Check DELETE policies exist
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE cmd = 'DELETE'
  AND tablename IN (
    'user_progress',
    'user_activity', 
    'profiles',
    'user_achievements',
    'notifications'
  )
ORDER BY tablename;
```

**Expected Result:** Should see 5 DELETE policies (one for each table)

### Step 2: Test Account Deletion

1. Create a test account
2. Add some notes, tasks, and make progress
3. Delete the account from Profile Settings
4. Run this query (replace USER_ID):

```sql
-- Check if data was actually deleted
SELECT 
  (SELECT COUNT(*) FROM user_progress WHERE user_id = 'USER_ID') as progress_count,
  (SELECT COUNT(*) FROM user_activity WHERE user_id = 'USER_ID') as activity_count,
  (SELECT COUNT(*) FROM profiles WHERE id = 'USER_ID') as profile_count,
  (SELECT COUNT(*) FROM user_notes WHERE user_id = 'USER_ID') as notes_count,
  (SELECT COUNT(*) FROM user_tasks WHERE user_id = 'USER_ID') as tasks_count;
```

**Expected Result:** All counts should be **0**

---

## What This Migration Does

The migration adds DELETE policies for 5 tables:

```sql
-- 1. user_progress - Allow users to delete their progress
CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- 2. user_activity - Allow users to delete their activity
CREATE POLICY "Users can delete own activity"
  ON user_activity FOR DELETE
  USING (auth.uid() = user_id);

-- 3. profiles - Allow users to delete their profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- 4. user_achievements - Allow users to delete achievements
CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE
  USING (auth.uid() = user_id);

-- 5. notifications - Allow users to delete notifications  
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Rollback (If Needed)

If something goes wrong, you can rollback by dropping the policies:

```sql
-- Remove the DELETE policies (ONLY IF ROLLBACK IS NEEDED)
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own activity" ON user_activity;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
```

---

## After Applying Migration

1. ✅ Users can now properly delete their accounts
2. ✅ All user data is deleted when account is deleted
3. ✅ GDPR compliance restored
4. ✅ Privacy expectations met

**Then:**
- Push updated code to production: `git push origin main`
- Verify in production that account deletion works
- Test with a dummy account

---

## Questions?

See full details in: `STORY-0.22-COMPLETE.md`

**Related Files:**
- Migration: `supabase/migrations/20251109_add_missing_delete_policies.sql`
- Updated function: `src/lib/api/deleteAccount.ts`
- Documentation: `STORY-0.22-COMPLETE.md`

---

**⚠️ DO NOT SKIP THIS MIGRATION - IT'S A CRITICAL PRIVACY/SECURITY FIX**

