# Epic 11: UX Improvements & Bug Fixes

**Status:** 📋 Ready for Implementation
**Type:** Bug Fixes + User Experience Improvements
**Priority:** Mixed (P0-P2)
**Created:** November 9, 2025

---

## 🎯 Epic Overview

**Goal:**
Address critical bugs and user experience issues discovered during usage, focusing on authentication, RTL layout corrections, Hebrew terminology standardization, and UI improvements.

**Why This Matters:**
- Critical authentication bug allowing deleted users to log in
- RTL (Right-to-Left) layout inconsistencies affecting Hebrew UX
- Incorrect Hebrew terminology for "agents" (using English transliterations instead of סוכן)
- Footer contains outdated/English content and missing credits
- Mobile onboarding has visual issues
- Dashboard needs link validation and enhancements

---

## 📊 Epic Breakdown

### Critical Priority (P0)
- **Story 11.1**: User Deletion Authentication Bug - 2 points

### High Priority (P1)
- **Story 11.2**: Footer Redesign & Credits - 2 points
- **Story 11.3**: RTL Layout Corrections - 3 points
- **Story 11.4**: Hebrew Terminology Standardization (Agent → Sochen) - 5 points

### Medium Priority (P2)
- **Story 11.5**: Keyboard Shortcuts Improvements - 2 points
- **Story 11.6**: Dashboard Enhancements - 3 points
- **Story 11.7**: Mobile Onboarding Fixes - 2 points
- **Story 11.8**: Learning Journey Visual Improvements - 3 points

**Total Story Points:** 22

---

## 🎯 Success Criteria

### Authentication & Security
- ✅ Deleted users cannot log in
- ✅ User deletion fully removes user data from auth system

### Hebrew UX Quality
- ✅ All RTL elements properly aligned (right-side)
- ✅ Hebrew terminology consistent - "סוכן/סוכנים" instead of "אייגנט"
- ✅ All keyboard shortcuts display correctly in RTL

### Footer & Credits
- ✅ Footer fully in Hebrew
- ✅ BMAD GitHub link updated and working
- ✅ Creator credit visible with working email link
- ✅ Bug report system functional

### Dashboard & Navigation
- ✅ All dashboard links verified and working
- ✅ Tag system functional or placeholders removed
- ✅ Continue reading "Show All" button works

### Mobile Experience
- ✅ Onboarding shapes don't overlap content
- ✅ All mobile pages responsive and usable

### Visual Polish
- ✅ Learning journey lock icons aligned
- ✅ Ctrl+K modal redesigned
- ✅ Journey cards layout improved on large screens

---

## 📋 Story List

### Story 11.1: Critical - User Deletion Authentication Bug
**Points:** 2 | **Priority:** P0 (Critical)

**Problem:**
When a user deletes their account (registered via email), they can still log in - user not actually deleted from auth system.

**Key Tasks:**
- Investigate user deletion flow
- Fix Supabase auth.users deletion
- Ensure cascade delete works properly
- Add verification checks
- Test deletion thoroughly

**See:** `docs/stories/STORY-11.1.md`

---

### Story 11.2: Footer Redesign & Credits
**Points:** 2 | **Priority:** P1 (High)

**Problem:**
Footer contains English text, outdated links, no creator credit, and "Need Help" instead of bug reporting.

**Key Tasks:**
- Remove English text from footer
- Update BMAD GitHub link to: https://github.com/bmad-code-org/BMAD-METHOD
- Add "נוצר על ידי בן עקיבא" with email link (benakiva1991@gmail.com)
- Replace "Need Help" with "Report a Bug" modal
- Implement bug report form that sends to admin

**See:** `docs/stories/STORY-11.2.md`

---

### Story 11.3: RTL Layout Corrections
**Points:** 3 | **Priority:** P1 (High)

**Problem:**
Multiple RTL alignment issues: Remember me checkbox, tasks page cards, recommendation tag positioning.

**Key Tasks:**
- Fix remember me checkbox alignment (should be right-aligned)
- Fix tasks page cards alignment (should be right-aligned)
- Move "Next Recommendation" tag to bottom-left (not hiding Start button)
- Verify all RTL layouts across app

**See:** `docs/stories/STORY-11.3.md`

---

### Story 11.4: Hebrew Terminology Standardization - Agent → Sochen
**Points:** 5 | **Priority:** P1 (High)

**Problem:**
Hebrew content uses English transliterations for "agent" (אייגנט, אגנט, אייג'נט, אייגנטים) instead of proper Hebrew term "סוכן/סוכנים".

**Key Tasks:**
- Audit all Hebrew content for "agent" variations
- Replace with contextually correct "סוכן" (singular) or "סוכנים" (plural)
- Update locale files
- Update guide content
- Update UI strings
- Verify all replacements maintain proper Hebrew grammar

**See:** `docs/stories/STORY-11.4.md`

---

### Story 11.5: Keyboard Shortcuts Improvements
**Points:** 2 | **Priority:** P2 (Medium)

**Problem:**
Keyboard shortcuts not easily accessible, displayed backwards (RTL issue), and Ctrl+K modal needs design improvement.

**Key Tasks:**
- Make keyboard shortcuts viewable/accessible again
- Fix backwards keyboard shortcuts text (RTL)
- Redesign Ctrl+K modal for better aesthetics
- Add access point to view shortcuts (Help menu or settings)

**See:** `docs/stories/STORY-11.5.md`

---

### Story 11.6: Dashboard Enhancements
**Points:** 3 | **Priority:** P2 (Medium)

**Problem:**
Dashboard links may not redirect correctly, tag system might not be built, and "Continue Reading" section needs "Show All" button.

**Key Tasks:**
- Audit all dashboard links and verify destinations
- Check if tag system exists or remove broken references
- Add "Show All" button to Continue Reading when more than 2 rows
- Fix any broken navigation

**See:** `docs/stories/STORY-11.6.md`

---

### Story 11.7: Mobile Onboarding Fixes
**Points:** 2 | **Priority:** P2 (Medium)

**Problem:**
Mobile onboarding has decorative shapes overlapping content and unnecessary learning time estimates.

**Key Tasks:**
- Fix z-index of decorative shapes on mobile onboarding
- Remove learning time estimates from onboarding
- Test mobile onboarding flow
- Ensure all content visible and accessible

**See:** `docs/stories/STORY-11.7.md`

---

### Story 11.8: Learning Journey Visual Improvements
**Points:** 3 | **Priority:** P2 (Medium)

**Problem:**
Learning journey lock icon misaligned, and cards could have better layout on large screens.

**Key Tasks:**
- Fix lock icon alignment on journey line
- Redesign journey cards for large screens (row-based layout instead of square cards)
- Ensure responsive on all screen sizes
- Maintain visual hierarchy

**See:** `docs/stories/STORY-11.8.md`

---

## 🎯 Implementation Order

### Phase 1: Critical & High Priority (P0-P1)
1. **Story 11.1** - User Deletion Bug (P0) - Fix immediately
2. **Story 11.3** - RTL Layout Corrections (P1) - Quick wins
3. **Story 11.2** - Footer Redesign (P1) - User-facing improvements
4. **Story 11.4** - Hebrew Terminology (P1) - Content quality (largest effort)

### Phase 2: Medium Priority (P2)
5. **Story 11.7** - Mobile Onboarding (P2) - Mobile experience
6. **Story 11.5** - Keyboard Shortcuts (P2) - Accessibility
7. **Story 11.6** - Dashboard Enhancements (P2) - Navigation fixes
8. **Story 11.8** - Journey Visual (P2) - Visual polish

---

## 📦 Deliverables

### Bug Fixes
- User deletion authentication fixed
- RTL layout issues corrected
- Mobile onboarding visual fixes
- Dashboard link issues resolved

### Content Improvements
- Hebrew terminology standardized throughout app
- Footer fully localized and updated
- Creator credit added

### Feature Enhancements
- Bug report system implemented
- Keyboard shortcuts more accessible
- Continue reading "Show All" button
- Journey cards improved layout

### Visual Polish
- Ctrl+K modal redesigned
- Lock icon alignment fixed
- Improved large screen layouts

---

## 🔗 Related Documentation

- **Hebrew-Only Policy**: `HEBREW-ONLY-POLICY.md`
- **Story Catalog**: `docs/story-catalog.md`
- **Sprint Planning**: `docs/sprint-plan.md`

---

## 📊 Epic Progress Tracking

**Created:** November 9, 2025
**Target Completion:** TBD
**Estimated Duration:** 2-3 sprints (22 points)

### Velocity Estimate
- Average velocity: ~10 points per sprint
- Estimated sprints: 2-3 sprints
- Can be parallelized if multiple developers

---

**Created by:** Ben Akiva
**Epic Owner:** Ben
**Date:** November 9, 2025

---

*This epic consolidates user-reported issues and improvements discovered during real-world usage of Agenseek.*

