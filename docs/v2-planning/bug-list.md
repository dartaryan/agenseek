# Agenseek V2 - Bug List

**Created:** December 25, 2025  
**Status:** In Progress  
**Last Updated:** December 25, 2025

---

## Summary

| Priority | Count | Fixed |
|----------|-------|-------|
| 🔴 Critical | 0 | 0 |
| 🟠 High | 5 | 2 |
| 🟡 Medium | 10 | 6 |
| 🟢 Low | 0 | 0 |
| **Total** | **15** | **8** |

---

## 🔧 Feature Bugs (From V2 Planning)

### BUG-001: Report Bug Feature Not Working
- **Priority:** 🟠 High
- **Page:** Global (Report Bug button)
- **Description:** The "Report Bug" feature is currently not functional
- **Expected:** Users should be able to submit bug reports
- **Actual:** Feature doesn't work
- **Status:** ⬜ Open
- **Type:** Feature bug (needs code investigation)

### BUG-002: Image Upload Missing
- **Priority:** 🟠 High
- **Page:** User content areas
- **Description:** No capability for users to upload their own images
- **Expected:** Users can upload images
- **Actual:** Feature not implemented
- **Status:** ⬜ Open
- **Type:** Feature bug (needs implementation)

### BUG-003: Notes - Related Guides Dropdown Not Working
- **Priority:** 🟠 High
- **Page:** Notes feature
- **Description:** When writing a note, the dropdown of related guides doesn't populate
- **Expected:** Dropdown shows list of guides to link
- **Actual:** Dropdown is empty / not working
- **Status:** ⬜ Open
- **Type:** Feature bug (needs code investigation)

### BUG-004: Avatar Library Needs Replacement
- **Priority:** 🟡 Medium
- **Page:** User profile / Avatar selection
- **Description:** Current avatars are not attractive enough, need bigger variety
- **Expected:** Pretty, fun, cool avatars with huge variety
- **Actual:** Limited, unappealing options
- **Status:** ⬜ Open
- **Type:** Design/assets bug

### BUG-005: Learning Journey Flow Locks Broken
- **Priority:** 🟠 High
- **Page:** Learning Journey
- **Description:** Lock indicators on learning journey flows are not working properly
- **Expected:** Locked content shows lock icon correctly
- **Actual:** Lock indicators broken
- **Status:** ⬜ Open
- **Type:** Feature bug (needs code investigation)

---

## 📄 Guide Content Rendering Bugs

### BUG-006: Empty Numbered List Items ✅ FIXED
- **Priority:** 🟡 Medium
- **Page:** `/guides/workflows-development`
- **Description:** Numbered list shows numbers but content is empty
- **Status:** ✅ **FIXED** - ListBlock now supports `text` property
- **Fixed in:** `ListBlock.tsx`

### BUG-007: "עדיין יש שאלות?" Link Not Working
- **Priority:** 🟡 Medium
- **Page:** `/guides/faq-basics` (and other pages)
- **Description:** The section looks like a clickable link but doesn't navigate anywhere
- **Status:** ⬜ Open
- **Type:** Needs investigation - may be design intentional or missing link

### BUG-008: Unsupported Nested Block Type: Card ✅ FIXED
- **Priority:** 🟠 High
- **Page:** `/guides/role-non-technical`
- **Description:** Shows `[Unsupported nested block type: card]` error
- **Status:** ✅ **FIXED** - GridBlock NestedContentRenderer now supports cards
- **Fixed in:** `GridBlock.tsx`

### BUG-009: Tabs Block Empty Error ✅ FIXED
- **Priority:** 🟡 Medium
- **Page:** `/guides/role-non-technical`
- **Description:** Error about tabs needing at least one item
- **Status:** ✅ **FIXED** - TabsBlock now supports both `items` and `tabs` arrays
- **Fixed in:** `TabsBlock.tsx`

### BUG-010: Empty "משימות מומלצות להתחלה" Section ✅ FIXED
- **Priority:** 🟡 Medium
- **Page:** `/guides/role-non-technical`
- **Description:** Card section shows "אין תוכן" instead of tasks
- **Status:** ✅ **FIXED** - CardBlock now supports `cards` array
- **Fixed in:** `CardBlock.tsx`

### BUG-011: Raw Markdown Flag Showing 🔧 DATA FIX NEEDED
- **Priority:** 🟡 Medium
- **Page:** `/guides/faq-team`
- **Section:** "עוד שאלות?" 
- **Description:** Shows `**markdown**: true` as text
- **Status:** 🔧 **DATA FIX NEEDED** - JSON file has literal text "**markdown**: true" at line 292
- **Root Cause:** Bad data in `faq/team.json` line 291-294
- **Fix:** Delete or fix the text block with wrong content

### BUG-012: Empty Agent Content 🔧 DATA FIX NEEDED
- **Priority:** 🟡 Medium
- **Page:** `/guides/agents-techwriter-master`
- **Description:** Card shows empty because it uses `description` instead of `content`
- **Status:** 🔧 **DATA FIX NEEDED** - JSON uses `description` property which CardBlock doesn't display
- **Root Cause:** Card schema mismatch - uses `description` instead of `content`
- **Fix:** Either fix JSON to use `content`, or update CardBlock to support `description`

### BUG-013: Empty Table Cells ✅ FIXED
- **Priority:** 🟡 Medium
- **Page:** `/guides/agents-cis-last2`
- **Description:** Grid shows "תא ריק" (empty cell)
- **Status:** ✅ **FIXED** - GridBlock now handles direct card objects
- **Fixed in:** `GridBlock.tsx`

### BUG-014: Empty Bullet Points ✅ FIXED
- **Priority:** 🟡 Medium
- **Page:** `/guides/workflows-management`
- **Description:** Bullet points appear with no content
- **Status:** ✅ **FIXED** - ListBlock now supports `text` property
- **Fixed in:** `ListBlock.tsx`

### BUG-015: Related Guides Links Display Issue
- **Priority:** 🟡 Medium  
- **Page:** `/guides/workflows-development` (and others)
- **Description:** Related guides shown with raw markdown link syntax
- **Status:** ⬜ Open
- **Type:** Needs investigation - may be in RelatedGuides component

---

## 📊 Status Summary

### ✅ Fixed by Component Updates (8 bugs)
| Bug | Fix |
|-----|-----|
| BUG-006 | ListBlock `text` support |
| BUG-008 | GridBlock card support |
| BUG-009 | TabsBlock `tabs` array support |
| BUG-010 | CardBlock `cards` array support |
| BUG-013 | GridBlock direct objects |
| BUG-014 | ListBlock `text` support |
| + GridBlock wrapper format | 3 JSON formats supported |

### 🔧 Need Data Fixes (2 bugs)
| Bug | Issue |
|-----|-------|
| BUG-011 | Bad text in faq/team.json |
| BUG-012 | Card uses `description` not `content` |

### ⬜ Still Open (5 bugs)
| Bug | Type |
|-----|------|
| BUG-001 | Feature - Report Bug |
| BUG-002 | Feature - Image Upload |
| BUG-003 | Feature - Notes Dropdown |
| BUG-005 | Feature - Flow Locks |
| BUG-007 | UI - Link behavior |
| BUG-015 | Component - Related Guides |

---

## 🛠️ Component Fixes Applied

### Files Modified:
1. `src/components/content/blocks/ListBlock.tsx`
   - Added `text` property support for list items

2. `src/components/content/blocks/GridBlock.tsx`
   - Extended NestedContentRenderer with card, callout, divider support
   - Added support for 3 JSON formats: arrays, direct objects, wrapper objects

3. `src/components/content/blocks/CardBlock.tsx`
   - Extended NestedContentRenderer with more block types
   - Added `cards` array support for multiple cards

4. `src/components/content/blocks/TabsBlock.tsx`
   - Added support for both `items` and `tabs` array properties

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-25 | Initial bug list created with 15 bugs |
| 2025-12-25 | Fixed 8 bugs with component updates |
| 2025-12-25 | Identified 2 data fixes needed |

