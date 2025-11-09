# Agenseek Documentation Archive

This archive contains historical documentation from completed stories, fixes, and migrations. All documents here are for historical reference only.

## Structure

### `stories/` - Completed Story Documentation

Story completion documents are organized by epic and sprint:

- **`epic-1/` through `epic-10/`** - Stories from each epic
  - Contains all `STORY-X.Y-COMPLETE.md` files
  - Includes implementation summaries, auxiliary notes, and fix documents

- **`on-the-go/`** - Ad-hoc Stories (0.X series)
  - Contains all `STORY-0.X-COMPLETE.md` files
  - Stories discovered during development that weren't part of original epic planning

- **`sprint-1/`** - Sprint Completion Summaries
  - Sprint retrospectives and completion documents

### `fixes/` - Technical Fixes and Hotfixes

Contains documentation for:
- Bug fixes
- Hotfix implementations
- Emergency patches
- UX improvements
- Technical debt resolution

### `migrations/` - Database Migrations and Schema Updates

SQL migration scripts and database schema change documentation.

### `planning/` - Status Updates and Tracking Documents

Contains:
- Session completion summaries
- Status update documents
- Tracking verification reports
- Guide creation documentation
- Agent synthesis documents

## Finding Documentation

### By Story Number

**Epic Stories** (X.Y format):
- Navigate to `stories/epic-X/`
- Find `STORY-X.Y-COMPLETE.md`

Example: `STORY-5.2-COMPLETE.md` is in `stories/epic-5/`

**On-the-go Stories** (0.X format):
- Navigate to `stories/on-the-go/`
- Find `STORY-0.X-COMPLETE.md`

Example: `STORY-0.5-COMPLETE.md` is in `stories/on-the-go/`

### By Type

**Technical Fixes**: Check `fixes/` folder
**Database Changes**: Check `migrations/` folder
**Project Status**: Check `planning/` folder
**Sprint Summaries**: Check `stories/sprint-X/` folder

## Current Active Documentation

For current development status and active stories, see the project root:
- `/NEXT-STORY.md` - Current story tracking
- `/IMPLEMENTATION-STATUS.md` - Overall project status
- `/README.md` - Main project documentation
- `/STORY-X.X.md` - Active story files (without -COMPLETE suffix)

## Archive Policy

- **Read-Only**: All archived documents are historical reference
- **Append-Only**: Archive never deletes historical documentation
- **Automatic**: Completed stories are archived immediately upon completion
- **Preserved**: Git history is maintained for all archived files

---

**Archive Established:** November 9, 2025
**Story:** 0.11 - Documentation Organization & Archive
**Purpose:** Maintain clean repository structure while preserving historical reference

