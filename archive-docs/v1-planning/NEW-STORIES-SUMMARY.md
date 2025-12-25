# New Stories Added - Summary

**Date:** November 7, 2025
**Author:** BMad Master
**Requested by:** Ben

---

## Stories Added

Two new stories have been added to Epic 2 (User Authentication & Personalized Onboarding):

### 1. Story 2.11: Comprehensive Hebrew Localization for Authentication Flows

**Location:**
- Epic: `docs/epics.md` (lines 822-869)
- Story File: `docs/stories/story-2.11-login-hebrew-translation.md`
- Sprint: Sprint 2 (Week 2)

**Purpose:**
Translate all authentication-related content (login, registration, password reset, OAuth) to Hebrew.

**Key Features:**
- Hebrew translations for login page
- Hebrew translations for registration page
- Hebrew translations for password reset flow
- Hebrew OAuth button text
- Hebrew error messages and validation
- Hebrew loading and success states

**Story Points:** 3
**Priority:** P0 (Critical)
**Dependencies:** Story 2.4 (Google OAuth Integration)

**Status:** Drafted

---

### 2. Story 2.12: Account Deletion Feature

**Location:**
- Epic: `docs/epics.md` (lines 872-930)
- Story File: `docs/stories/story-2.12-account-deletion.md`
- Sprint: Sprint 2 (Week 2)

**Purpose:**
Enable users to permanently delete their accounts and all associated data (GDPR right to be forgotten).

**Key Features:**
- Account settings page with delete account section
- Confirmation dialog with typed confirmation ("מחק" or "DELETE")
- Cascading deletion of all user data (9 tables)
- Audit logging before deletion
- Success toast and redirect after deletion
- Hebrew-first UI

**Story Points:** 3
**Priority:** P1 (High)
**Dependencies:** Story 2.10 (Protected Routes)

**Status:** Drafted

---

## Files Modified

1. **`docs/epics.md`**
   - Added Story 2.11 (lines 822-869)
   - Added Story 2.12 (lines 872-930)

2. **`docs/sprint-plan.md`**
   - Added Story 2.11 to Sprint 2 table
   - Added Story 2.12 to Sprint 2 table
   - Updated total story count: 66 → 68
   - Updated Sprint Goal and Definition of Done

## Files Created

1. **`docs/stories/story-2.11-login-hebrew-translation.md`**
   - Complete story specification
   - Detailed acceptance criteria
   - Task breakdown with subtasks
   - Dev notes with architecture patterns
   - References to related documentation

2. **`docs/stories/story-2.12-account-deletion.md`**
   - Complete story specification
   - Detailed acceptance criteria with UI, confirmation, and deletion process
   - Comprehensive task breakdown
   - Security and GDPR compliance notes
   - Database cascade deletion order

---

## Next Steps

### For Story 2.11 (Login Hebrew Translation):
1. Review the story file: `docs/stories/story-2.11-login-hebrew-translation.md`
2. Optionally run `story-context` workflow to generate technical context
3. Run `story-ready` workflow to mark story ready for development
4. Assign to dev agent for implementation

### For Story 2.12 (Account Deletion):
1. Review the story file: `docs/stories/story-2.12-account-deletion.md`
2. Optionally run `story-context` workflow to generate technical context
3. Run `story-ready` workflow to mark story ready for development
4. Assign to dev agent for implementation

### Sprint Planning:
- Both stories added to Sprint 2 (Week 2)
- Story 2.11 can be implemented after Story 2.4
- Story 2.12 should be implemented after Story 2.10 (requires protected routes and settings page)

---

## Technical Highlights

### Story 2.11 - Hebrew Localization:
- Extends existing locale pattern from Story 1.11
- Uses centralized `src/lib/locale/he.ts`
- Implements Zod validation with Hebrew error messages
- Follows RTL design patterns
- Type-safe with TypeScript interfaces

### Story 2.12 - Account Deletion:
- Implements GDPR right to be forgotten
- Uses Supabase transactions for atomicity
- Cascading deletion in correct dependency order:
  1. user_activity
  2. guide_bookmarks
  3. comment_votes
  4. guide_comments
  5. user_tasks
  6. user_notes
  7. user_progress
  8. profiles
  9. auth.users (Supabase Auth)
- Includes audit logging
- Destructive action UI pattern (red colors, confirmation dialog)
- Typed confirmation input ("מחק" or "DELETE")

---

## Story Compliance

Both stories follow the standard story template:
- ✅ User story format (As a... I want... So that...)
- ✅ Detailed acceptance criteria (Given/When/Then)
- ✅ Task breakdown with subtasks
- ✅ Dev notes with architecture patterns
- ✅ Source tree components to touch
- ✅ Testing standards
- ✅ References to related documentation
- ✅ Dev Agent Record section (template)

---

## BMad Master Notes

BMad Master has successfully created both requested stories following the BMAD BMM methodology:

1. **Story 2.11** addresses the need for comprehensive Hebrew translation of authentication flows, building on the foundation from Story 1.11
2. **Story 2.12** implements account deletion functionality with proper security, GDPR compliance, and Hebrew-first UI

Both stories are ready for review and can be moved to development when approved.

**Total new story points added:** 6 (3 + 3)
**Total project story points:** Updated in sprint plan

---

**BMad Master confirms:** All requested stories have been added to your project, Ben! 🎯

