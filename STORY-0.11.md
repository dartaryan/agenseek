# Story 0.11: Documentation Organization & Archive

**Status:** 📋 Ready for Implementation
**Type:** On-the-Go Story (Technical Debt / Cleanup)
**Priority:** P2 - Nice to Have
**Sprint:** TBD | **Points:** 2 (Small-Medium)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Issue:**

The project root has accumulated numerous documentation files that make it difficult to:
- Navigate the project structure cleanly
- Find relevant current documentation
- Distinguish between active docs and historical reference material
- Maintain a professional, organized repository

**Impact:**
- Cluttered repository structure
- Difficult onboarding for new developers
- Confusion about which documents are current vs. archived
- Reduced maintainability

---

## 📖 User Story

**As a developer working on Agenseek,**
**I want a clean and organized documentation structure,**
**So that I can quickly find relevant information without wading through outdated or completed story files.**

---

## ✅ Acceptance Criteria

### 1. Create Archive Structure

**Given** the repository has many historical documentation files
**When** organizing the documentation
**Then:**

- [ ] Create `docs/archive/` folder structure:
  ```
  docs/archive/
  ├── stories/
  │   ├── sprint-1/
  │   ├── epic-1/
  │   ├── epic-2/
  │   ├── epic-3/
  │   ├── epic-4/
  │   ├── epic-5/
  │   ├── epic-6/
  │   ├── epic-7/
  │   ├── epic-8/
  │   ├── epic-9/
  │   ├── epic-10/
  │   └── on-the-go/
  ├── fixes/
  ├── migrations/
  └── planning/
  ```
- [ ] All folders created with appropriate structure

---

### 2. Archive Completed Story Files

**Given** many STORY-X.X-COMPLETE.md files exist in root
**When** organizing completed stories
**Then:**

- [ ] All `STORY-[0-9].[0-9]*-COMPLETE.md` files moved to `docs/archive/stories/epic-X/`
- [ ] Files organized by epic number (e.g., STORY-5.2-COMPLETE.md → docs/archive/stories/epic-5/)
- [ ] On-the-go stories (0.X) moved to `docs/archive/stories/on-the-go/`
- [ ] Sprint completion docs moved to `docs/archive/stories/sprint-X/`

**Files to Archive:**
```
Root → Archive Location
────────────────────────────────────────────────────
STORY-0.1-COMPLETE.md → docs/archive/stories/on-the-go/
STORY-0.2-COMPLETE.md → docs/archive/stories/on-the-go/
STORY-0.3-COMPLETE.md → docs/archive/stories/on-the-go/
STORY-0.4-COMPLETE.md → docs/archive/stories/on-the-go/
STORY-1.5-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.6-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.7-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.8-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.9-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.10-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.11-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.11-FINAL-COMPLETE.md → docs/archive/stories/epic-1/
STORY-1.12-COMPLETE.md → docs/archive/stories/epic-1/
STORY-2.1-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.2-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.5-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.6-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.7-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.8-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.9-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.10-COMPLETE.md → docs/archive/stories/epic-2/
STORY-2.11-AND-2.12-COMPLETE.md → docs/archive/stories/epic-2/
STORY-3.1-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.2-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.3-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.4-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.5-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.6-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.7-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.8-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.9-COMPLETE.md → docs/archive/stories/epic-3/
STORY-3.10-COMPLETE.md → docs/archive/stories/epic-3/
STORY-4.1-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.2-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.3-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.4-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.5-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.6-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.7-COMPLETE.md → docs/archive/stories/epic-4/
STORY-4.8-COMPLETE.md → docs/archive/stories/epic-4/
STORY-5.1-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.1.1-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.1.2-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.1.3-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.2-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.3-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.4-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.5-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.6-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.7-COMPLETE.md → docs/archive/stories/epic-5/
STORY-5.8-COMPLETE.md → docs/archive/stories/epic-5/
STORY-6.1-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.2-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.3-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.4-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.5-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.6-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.7-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.8-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.9-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.10-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.11-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.12-COMPLETE.md → docs/archive/stories/epic-6/
STORY-6.15-COMPLETE.md → docs/archive/stories/epic-6/
STORY-7.1-COMPLETE.md → docs/archive/stories/epic-7/
STORY-7.2-COMPLETE.md → docs/archive/stories/epic-7/
STORY-7.3-COMPLETE.md → docs/archive/stories/epic-7/
STORY-7.4-COMPLETE.md → docs/archive/stories/epic-7/
STORY-7.5-COMPLETE.md → docs/archive/stories/epic-7/
STORY-8.1-COMPLETE.md → docs/archive/stories/epic-8/
STORY-8.2-COMPLETE.md → docs/archive/stories/epic-8/
STORY-8.3-COMPLETE.md → docs/archive/stories/epic-8/
STORY-8.4-COMPLETE.md → docs/archive/stories/epic-8/
STORY-8.5-COMPLETE.md → docs/archive/stories/epic-8/
STORY-8.6-COMPLETE.md → docs/archive/stories/epic-8/
STORY-9.1-COMPLETE.md → docs/archive/stories/epic-9/
STORY-9.2-COMPLETE.md → docs/archive/stories/epic-9/
STORY-9.3-COMPLETE.md → docs/archive/stories/epic-9/
STORY-9.4-COMPLETE.md → docs/archive/stories/epic-9/
STORY-9.5-COMPLETE.md → docs/archive/stories/epic-9/
STORY-9.6-COMPLETE.md → docs/archive/stories/epic-9/
STORY-10.1-COMPLETE.md → docs/archive/stories/epic-10/
STORY-10.2-COMPLETE.md → docs/archive/stories/epic-10/
STORY-10.3-COMPLETE.md → docs/archive/stories/epic-10/
STORY-10.4-COMPLETE.md → docs/archive/stories/epic-10/
SPRINT-1-COMPLETE.md → docs/archive/stories/sprint-1/
```

---

### 3. Archive Story Auxiliary Files

**Given** story files have related auxiliary documentation
**When** organizing related files
**Then:**

- [ ] Move all story-related supplementary files to appropriate archive locations:

```
STORY-0.1-MOCK-DATA-AUDIT.md → docs/archive/stories/on-the-go/
STORY-0.1-TEST-CHECKLIST.md → docs/archive/stories/on-the-go/
STORY-0.3-AVATARS-EVERYWHERE-UPDATE.md → docs/archive/stories/on-the-go/
STORY-0.3-FINAL-POLISH.md → docs/archive/stories/on-the-go/
STORY-0.3-FINAL-UPDATE.md → docs/archive/stories/on-the-go/
STORY-0.3-LOGO-PLACEHOLDER-FIX.md → docs/archive/stories/on-the-go/
STORY-2.2-SUMMARY.md → docs/archive/stories/epic-2/
STORY-4.7-IMPLEMENTATION-SUMMARY.md → docs/archive/stories/epic-4/
STORY-5.2-IMPLEMENTATION-SUMMARY.md → docs/archive/stories/epic-5/
STORY-5.4-ICON-FIX.md → docs/archive/stories/epic-5/
STORY-6.2-IMPLEMENTATION-SUMMARY.md → docs/archive/stories/epic-6/
STORY-8.3-SUMMARY.md → docs/archive/stories/epic-8/
STORY-TRACKING-UPDATE.md → docs/archive/planning/
```

---

### 4. Archive Fix & Migration Documents

**Given** technical fix documents exist in root
**When** organizing technical documentation
**Then:**

- [ ] Move all fix and migration docs to `docs/archive/fixes/`:

```
DEPLOYMENT-FIX-AVATAR.md → docs/archive/fixes/
FONT-AND-EMOJI-FIX.md → docs/archive/fixes/
INFINITE-LOOP-FIX.md → docs/archive/fixes/
ONBOARDING-AND-PREFERENCES-FIX.md → docs/archive/fixes/
ONBOARDING-UX-IMPROVEMENTS.md → docs/archive/fixes/
REGISTRATION-FLOW-FIX.md → docs/archive/fixes/
RLS-POLICY-FIX.md → docs/archive/fixes/
STORY-7.5-FIX-BROWSER-CONFLICTS.md → docs/archive/fixes/
VERCEL-FIX.md → docs/archive/fixes/
```

---

### 5. Archive Migration & Status Documents

**Given** migration and status update documents exist
**When** organizing planning documents
**Then:**

- [ ] Move to `docs/archive/migrations/`:

```
APPLY-AVATAR-MIGRATION-NOW.sql → docs/archive/migrations/
VERIFY-RLS-POLICIES.sql → docs/archive/migrations/
STATUS-UPDATE-TO-4.5.md → docs/archive/planning/
TRACKING-VERIFICATION-UPDATE.md → docs/archive/planning/
```

---

### 6. Keep Current Active Documents in Root

**Given** some documents are still actively referenced
**When** organizing the repository
**Then:**

- [ ] Keep these files in project root (DO NOT ARCHIVE):

```
✓ README.md - Main project documentation
✓ NEXT-STORY.md - Active story tracking
✓ HEBREW-ONLY-POLICY.md - Active policy
✓ IMPLEMENTATION-STATUS.md - Current status reference
✓ STORY-X.X.md - All active/in-progress story files (not -COMPLETE)
```

---

### 7. Archive Special Story Documents

**Given** some story documents are organizational
**When** cleaning up
**Then:**

- [ ] Move to appropriate archive locations:

```
STORY-ARCHITECTS-GUIDE-COMPLETE.md → docs/archive/stories/epic-6/
STORY-QA-TESTERS-COMPLETE.md → docs/archive/stories/epic-6/
STORY-X.X-HEBREW-NAME-SUGGESTION-COMPLETE.md → docs/archive/stories/on-the-go/
```

---

### 8. Update README if Needed

**Given** documentation structure has changed
**When** archiving is complete
**Then:**

- [ ] If README.md references archived files, update paths
- [ ] Add section explaining archive structure if helpful
- [ ] No broken links remain in active documentation

---

### 9. Create Archive README

**Given** archived documents are organized
**When** someone browses the archive
**Then:**

- [ ] Create `docs/archive/README.md` with:
  - Explanation of archive purpose
  - Structure overview
  - How to find specific story documentation
  - Note that these are historical reference only

Example content:
```markdown
# Agenseek Documentation Archive

This archive contains historical documentation from completed stories, fixes, and migrations.

## Structure

- `stories/` - Completed story documentation organized by epic/sprint
  - `epic-X/` - Stories from each epic
  - `on-the-go/` - Ad-hoc 0.X stories
  - `sprint-X/` - Sprint completion summaries
- `fixes/` - Technical fixes and hotfix documentation
- `migrations/` - Database migrations and schema updates
- `planning/` - Status updates and tracking documents

## Finding Documentation

- **Epic Stories**: Check `stories/epic-X/` folder
- **On-the-go Stories**: Check `stories/on-the-go/` folder
- **Technical Fixes**: Check `fixes/` folder
- **Current Active Stories**: See project root

All documents here are for historical reference only. For current development status, see `/NEXT-STORY.md` in project root.
```

---

## 🎨 UI/UX Specifications

N/A - This is a repository organization story

---

## 🔧 Technical Implementation

### File Operations Script (Optional Helper)

For efficiency, a PowerShell script can be created to automate the moves:

**File:** `scripts/organize-docs.ps1`

```powershell
# Create archive structure
New-Item -Path "docs/archive/stories/sprint-1" -ItemType Directory -Force
New-Item -Path "docs/archive/stories/epic-1" -ItemType Directory -Force
# ... (create all directories)

# Move completed story files
Move-Item "STORY-0.1-COMPLETE.md" "docs/archive/stories/on-the-go/" -Force
Move-Item "STORY-1.5-COMPLETE.md" "docs/archive/stories/epic-1/" -Force
# ... (move all files)

Write-Host "Documentation organization complete!" -ForegroundColor Green
```

**Note:** Manual moves are fine too - use whichever method is more comfortable.

---

## 🧪 Testing Checklist

### Verification Tests

- [ ] All COMPLETE files are archived (none remain in root)
- [ ] All fix documents are archived
- [ ] All migration documents are archived
- [ ] Active story files (non-COMPLETE) remain in root
- [ ] NEXT-STORY.md remains in root
- [ ] README.md remains in root and is not broken
- [ ] docs/archive/README.md exists and is helpful
- [ ] No broken references in active documentation
- [ ] Git history preserved (moves tracked correctly)

### Post-Cleanup Verification

- [ ] `ls` in root shows clean structure
- [ ] Can still find historical story docs when needed
- [ ] Archive is logically organized
- [ ] No duplicate files exist
- [ ] All files are in expected locations

---

## ✅ Definition of Done

Before marking story complete, verify:

### File Organization
- [ ] All completed story files archived
- [ ] All fix documents archived
- [ ] All migration documents archived
- [ ] Active files remain in root
- [ ] Archive structure created correctly

### Documentation
- [ ] Archive README created
- [ ] No broken links in active docs
- [ ] Clear structure for future reference

### Git Cleanliness
- [ ] All moves committed properly
- [ ] Git history preserved
- [ ] No orphaned files
- [ ] `.gitignore` still appropriate

---

## 📊 Success Metrics

**Immediate Impact:**
- Root directory file count reduced by ~80%
- Clear separation between active and archived docs
- Professional repository appearance

**Long-term Benefits:**
- Easier onboarding for new developers
- Faster navigation to relevant documentation
- Maintainable historical reference
- Scalable structure for future stories

---

## 🚀 Implementation Plan

### Step 1: Create Archive Structure (15 min)
- Create all necessary directories in `docs/archive/`
- Create archive README

### Step 2: Archive Completed Stories (30 min)
- Move all STORY-X.X-COMPLETE.md files to appropriate epic folders
- Move on-the-go story completion docs
- Move sprint completion docs

### Step 3: Archive Auxiliary Files (20 min)
- Move story summaries, implementation notes, fix docs
- Move migration scripts and SQL files

### Step 4: Verification (15 min)
- Check all files moved correctly
- Verify no broken links
- Test git status shows moves
- Clean commit

**Total Estimated Time:** ~1.5 hours

---

## 📝 Notes & Considerations

### Git Best Practices

- Use `git mv` instead of regular `mv` to preserve history
- Commit all moves in a single commit for clarity
- Commit message example: "chore: organize documentation into archive structure (Story 0.11)"

### Future Maintenance

- When completing future stories, move COMPLETE files to archive immediately
- Keep archive structure up-to-date
- Archive folder is append-only (never delete historical docs)

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (standalone cleanup task)

### Blocks:
- None (does not block other work)

### Related Tasks:
- Story 0.12 - Console Log Cleanup
- Story 0.13 - BMAD Installation Guide Location

---

**Created by:** Ben
**Date:** November 9, 2025
**Story Type:** On-the-Go Cleanup (0.X series)
**Estimated Effort:** 2 story points (~1.5 hours)

---

_Let's clean up this repository and make it shine! A well-organized codebase is a joy to work with._

