# Story 11.1: User Deletion Bug - Test Plan

## 🧪 Testing Approach

### Prerequisites
1. App running locally with Supabase connection
2. Admin user account with privileges
3. At least one test user created via email registration
4. Access to Supabase dashboard to verify database changes

---

## Test 1: Apply Migration

**Goal:** Ensure the database migration applies successfully

**Steps:**
1. Run migration: `supabase migration up` (or however migrations are applied)
2. Check Supabase dashboard → Database → Functions
3. Verify `admin_delete_user` function exists
4. Check function permissions: Should be executable by `authenticated` role

**Expected Result:**
- Migration applies without errors
- Function `admin_delete_user(UUID)` visible in database
- Function has `SECURITY DEFINER` attribute

---

## Test 2: Non-Admin Cannot Delete Users

**Goal:** Verify only admins can delete users

**Steps:**
1. Create a test user with `is_admin = false`
2. Try to call the delete function as non-admin user
3. Should be rejected

**Expected Result:**
- Function returns: `{"success": false, "error": "Unauthorized: Admin privileges required"}`
- No users are deleted
- No changes to database

---

## Test 3: Admin Cannot Delete Themselves

**Goal:** Prevent self-deletion

**Steps:**
1. Log in as admin
2. Navigate to Admin → Users
3. Try to delete your own account

**Expected Result:**
- Function returns: `{"success": false, "error": "Cannot delete your own account"}`
- Admin account remains intact

---

## Test 4: Basic User Deletion (Email User)

**Goal:** Verify deleted email-registered user CANNOT log in

**Steps:**
1. Create test user via email registration:
   - Email: `test-delete@example.com`
   - Password: `TestPassword123!`
2. Log in as test user and verify login works
3. Create some data as test user:
   - Complete a guide (user_progress)
   - Create a note (user_notes)
   - Add a task (user_tasks)
   - Add a comment (guide_comments)
4. Log out
5. Log in as admin
6. Navigate to Admin → Users
7. Find `test-delete@example.com` in user list
8. Click "Delete User"
9. Confirm both dialogs:
   - First: Detailed warning
   - Second: Final confirmation
10. Verify success message shown
11. **CRITICAL TEST:** Try to log in as `test-delete@example.com`

**Expected Result:**
- User deletion succeeds (success toast shown)
- User list refreshes, deleted user not visible
- **CRITICAL:** Login attempt FAILS with "Invalid credentials" error
- Database verification:
  - `auth.users` does NOT contain test user ID
  - `profiles` does NOT contain test user ID
  - All related data deleted (user_progress, user_notes, etc.)
- Admin audit log contains deletion entry

---

## Test 5: Database Cascade Verification

**Goal:** Ensure all user data is properly deleted

**Steps:**
1. Create test user: `test-cascade@example.com`
2. Create extensive data:
   - Multiple guide progress entries
   - Multiple notes
   - Multiple tasks
   - Comments on multiple guides
   - Bookmark guides
   - Create achievements (if applicable)
3. Record all record IDs for verification
4. Delete user via admin panel
5. Check database tables:

**SQL Queries to Run:**
```sql
-- Check auth.users (should be empty)
SELECT * FROM auth.users WHERE email = 'test-cascade@example.com';

-- Check profiles (should be empty)
SELECT * FROM profiles WHERE email = 'test-cascade@example.com';

-- Check user_progress (should be empty for this user)
SELECT * FROM user_progress WHERE user_id = '{deleted_user_id}';

-- Check user_notes (should be empty)
SELECT * FROM user_notes WHERE user_id = '{deleted_user_id}';

-- Check user_tasks (should be empty)
SELECT * FROM user_tasks WHERE user_id = '{deleted_user_id}';

-- Check guide_comments (should be empty)
SELECT * FROM guide_comments WHERE user_id = '{deleted_user_id}';

-- Check user_activity (should be empty)
SELECT * FROM user_activity WHERE user_id = '{deleted_user_id}';

-- Check guide_bookmarks (should be empty)
SELECT * FROM guide_bookmarks WHERE user_id = '{deleted_user_id}';

-- Check user_achievements (should be empty)
SELECT * FROM user_achievements WHERE user_id = '{deleted_user_id}';

-- Verify admin audit log entry exists
SELECT * FROM admin_action_log
WHERE action_type = 'delete'
AND target_type = 'user'
AND target_label = 'test-cascade@example.com';
```

**Expected Result:**
- All queries return 0 rows (no data remnants)
- Except admin_action_log which should have 1 entry

---

## Test 6: OAuth User Deletion

**Goal:** Verify OAuth users can also be deleted

**Steps:**
1. Create test user via Google OAuth (if supported)
2. Log in as admin
3. Delete the OAuth user
4. Try to log in via OAuth again

**Expected Result:**
- OAuth user deleted successfully
- User cannot log in again via OAuth
- No data remnants in database

---

## Test 7: User with Active Session

**Goal:** Verify user with active session is properly deleted

**Steps:**
1. Create test user: `test-session@example.com`
2. Log in as test user in browser
3. Keep session active (don't log out)
4. In another browser/incognito, log in as admin
5. Delete `test-session@example.com`
6. Back in first browser (as test user), try to navigate or refresh

**Expected Result:**
- User deletion succeeds
- Active session becomes invalid
- User redirected to login or gets auth error
- User cannot perform any actions

---

## Test 8: Edge Cases

### Test 8.1: Delete Non-Existent User
**Steps:**
1. Try to call `admin_delete_user` with random UUID
2. Should handle gracefully

**Expected Result:**
- Returns: `{"success": false, "error": "User not found"}`

### Test 8.2: Concurrent Deletion Attempts
**Steps:**
1. Create test user
2. Try to delete same user twice simultaneously
3. Should handle gracefully

**Expected Result:**
- First deletion succeeds
- Second deletion returns "User not found" error
- No database errors

### Test 8.3: User with Minimal Data
**Steps:**
1. Create user with no additional data (just profile)
2. Delete immediately
3. Should work without errors

**Expected Result:**
- Deletion succeeds
- No cascade errors

---

## Test 9: Error Handling

**Goal:** Verify error messages are clear and helpful

**Test Cases:**
1. Network error during deletion
2. Database connection lost
3. Permission denied

**Expected Result:**
- User sees meaningful error message
- Error logged to console
- Admin audit log updated (if possible)

---

## Test 10: Audit Trail Verification

**Goal:** Ensure all deletions are logged

**Steps:**
1. Delete a test user
2. Navigate to Admin → Logs
3. Find the deletion entry

**Expected Result:**
- Log entry exists with:
  - Action: "delete"
  - Category: "user_management"
  - Target: deleted user email
  - Admin: current admin user
  - Timestamp: current time
  - Metadata: includes user details

---

## 🎯 Critical Success Criteria

Before marking story complete, verify:

### Must Pass (P0):
- ✅ **CRITICAL:** Deleted email users CANNOT log in (login fails)
- ✅ **CRITICAL:** User removed from `auth.users`
- ✅ **CRITICAL:** User removed from `profiles`
- ✅ **CRITICAL:** All related data cascade deleted

### Should Pass (P1):
- ✅ Only admins can delete users
- ✅ Admin cannot delete themselves
- ✅ Confirmation dialogs require explicit confirmation
- ✅ Audit log captures all deletions
- ✅ Error messages are clear and helpful

### Nice to Have (P2):
- ✅ OAuth users can be deleted
- ✅ Active sessions are invalidated
- ✅ Edge cases handled gracefully

---

## 📝 Manual Testing Checklist

Before deploying to production:

- [ ] Migration applied successfully
- [ ] Function created with correct permissions
- [ ] Test 4 passed (email user cannot log in after deletion)
- [ ] Database cascade verified (no orphaned data)
- [ ] Admin audit log working
- [ ] Error handling tested
- [ ] Non-admin cannot delete users
- [ ] Admin cannot delete themselves
- [ ] Both confirmation dialogs shown
- [ ] Success/error messages display correctly

---

## 🚀 Deployment Steps

1. **Backup Database** - Critical before running migrations
2. **Apply Migration** - Run `20251109_fix_user_deletion_auth_bug.sql`
3. **Verify Function** - Check Supabase dashboard
4. **Test on Staging** - Complete all tests above
5. **Monitor Logs** - Watch for errors after deployment
6. **Verify in Production** - Test with non-critical user

---

**Created:** November 9, 2025
**Story:** 11.1 - User Deletion Authentication Bug
**Status:** Ready for Testing

