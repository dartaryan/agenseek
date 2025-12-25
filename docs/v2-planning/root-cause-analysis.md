# Root Cause Analysis: Guide Rendering Issues

**Date:** December 25, 2025  
**Status:** Analysis Complete - Ready for Fix

---

## Executive Summary

After investigating the codebase, I found **4 root causes** that are responsible for most of the 10 guide rendering bugs. Fixing these core issues will resolve multiple bugs at once.

---

## 🔍 Root Causes Identified

### Root Cause #1: Schema Mismatch - `text` vs `content`

**Severity:** 🔴 High - Affects multiple guides  
**Bugs Fixed:** BUG-006 (empty numbered lists), possibly others

**The Problem:**
- Some JSON files use `text` property for headings and list items
- The TypeScript types and components expect `content` property
- Result: Empty headings, empty list items

**Evidence:**

In `workflows/development.json` (uses `text` - WRONG):
```json
{
  "type": "heading",
  "level": 1,
  "text": "מדריך וורקפלואים...",  // ❌ Uses 'text'
  "id": "main-title"
}

{
  "type": "list",
  "ordered": true,
  "items": [
    { "text": "**story-context** - ..." }  // ❌ Uses 'text'
  ]
}
```

In `roles/non-technical.json` (uses `content` - CORRECT):
```json
{
  "type": "heading",
  "level": 1,
  "content": "מדריך לתפקידים לא טכניים...",  // ✅ Uses 'content'
  "id": "main-title"
}
```

**TypeScript Interface** (`src/types/content-blocks.ts`):
```typescript
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;  // Expects 'content', not 'text'
}

export interface ListItem {
  content: string;  // Expects 'content', not 'text'
  children?: ListItem[];
}
```

**Solution Options:**
1. **Fix JSON files** - Update all guides to use `content` consistently
2. **Fix components** - Support both `text` and `content` properties
3. **Recommended:** Do both - fix components for backwards compatibility, then migrate JSON files

---

### Root Cause #2: Nested Block Types Not Supported

**Severity:** 🔴 High - Causes visible errors  
**Bugs Fixed:** BUG-008 ([Unsupported nested block type: card])

**The Problem:**
- `GridBlock.tsx` and `CardBlock.tsx` have `NestedContentRenderer` functions
- These only support: `text`, `heading`, `list`, `image`, `code`
- When JSON has `card` inside `grid`, it shows the error message

**Evidence:**

In `GridBlock.tsx` and `CardBlock.tsx`:
```typescript
function NestedContentRenderer({ blocks }) {
  // Only supports these types:
  switch (block.type) {
    case 'text': ...
    case 'heading': ...
    case 'list': ...
    case 'image': ...
    case 'code': ...
    default:
      return <div>[Unsupported nested block type: {block.type}]</div>;  // ❌
  }
}
```

But `non-technical.json` has cards inside a grid:
```json
{
  "type": "grid",
  "items": [
    [{
      "type": "card",  // ❌ Not supported in NestedContentRenderer!
      "title": "Marketing / שיווק",
      ...
    }]
  ]
}
```

**Solution:**
Add support for `card`, `callout`, `accordion`, `tabs`, and other block types in `NestedContentRenderer`.

---

### Root Cause #3: Tabs Schema Mismatch - `tabs` vs `items`

**Severity:** 🟠 High  
**Bugs Fixed:** BUG-009 (tabs block error)

**The Problem:**
- JSON files use `tabs` array property
- `TabsBlock.tsx` destructures `items` property
- Result: "בלוק טאבים חייב להכיל לפחות פריט אחד" error

**Evidence:**

In `non-technical.json`:
```json
{
  "type": "tabs",
  "id": "use-cases-tabs",
  "defaultTab": 0,
  "tabs": [...]  // ❌ Uses 'tabs'
}
```

In `TabsBlock.tsx`:
```typescript
function TabsBlock({ block }: TabsBlockProps) {
  const { items } = block;  // ❌ Expects 'items'
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <div>שגיאה: בלוק טאבים חייב להכיל...</div>;
  }
}
```

**Solution:**
```typescript
const { items, tabs } = block as any;
const tabItems = items || tabs;  // Support both
```

---

### Root Cause #4: Card Block with `cards` Array Not Rendered

**Severity:** 🟡 Medium  
**Bugs Fixed:** BUG-010 (empty recommended tasks)

**The Problem:**
- Some JSON has card blocks with a `cards` array (multiple cards)
- `CardBlock.tsx` only handles `content` array (single card content)
- The `cards` array isn't being rendered

**Evidence:**

In `non-technical.json` (line 530-549):
```json
{
  "type": "card",
  "id": "task-cards",
  "cards": [  // ❌ 'cards' array not supported
    {
      "title": "משימה 1: כתיבת מייל",
      "content": "...",
      "variant": "default"
    },
    ...
  ]
}
```

**CardBlock.tsx** only handles:
```typescript
{block.content && Array.isArray(block.content) && block.content.length > 0 ? (
  <NestedContentRenderer blocks={block.content} />
) : (
  <p>אין תוכן</p>  // ❌ Shows this because 'cards' is ignored
)}
```

**Solution:**
Add support for `cards` array - render multiple cards when present.

---

## 📊 Bug to Root Cause Mapping

| Bug | Root Cause | Fix Priority |
|-----|------------|--------------|
| BUG-006: Empty numbered lists | RC#1: text vs content | Fix RC#1 |
| BUG-008: Unsupported card type | RC#2: Nested block types | Fix RC#2 |
| BUG-009: Tabs error | RC#3: tabs vs items | Fix RC#3 |
| BUG-010: Empty tasks section | RC#4: cards array | Fix RC#4 |
| BUG-011: markdown:true showing | Likely RC#1 or data issue | Investigate |
| BUG-012: Empty agent content | Data issue | Fix JSON |
| BUG-013: Empty table cells | Data issue / RC#1 | Fix JSON + RC#1 |
| BUG-014: Empty bullets | RC#1: text vs content | Fix RC#1 |
| BUG-015: Raw link syntax | Data issue | Fix JSON |

---

## 🔧 Recommended Fix Order

### Phase 1: Component Fixes (Fixes ~80% of bugs)

1. **Fix RC#1** - Support both `text` and `content` in:
   - `HeadingBlock.tsx`
   - `ListBlock.tsx`
   - Any `NestedContentRenderer`

2. **Fix RC#2** - Extend `NestedContentRenderer` in:
   - `GridBlock.tsx`
   - `CardBlock.tsx`
   - Add support for: `card`, `callout`, `accordion`, `tabs`, `table`

3. **Fix RC#3** - Support both `tabs` and `items` in:
   - `TabsBlock.tsx`

4. **Fix RC#4** - Support `cards` array in:
   - `CardBlock.tsx`

### Phase 2: Data Cleanup

5. **Audit JSON files** - Find and fix:
   - Remaining schema inconsistencies
   - Empty content sections
   - Raw markdown flags

### Phase 3: Prevention

6. **Add JSON schema validation**
7. **Create guide content linter**
8. **Document content schema standards**

---

## ⏱️ Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 4 component fixes | 2-3 hours |
| Phase 2 | JSON audit + fixes | 2-4 hours |
| Phase 3 | Prevention tools | 4-8 hours |
| **Total** | | **8-15 hours** |

---

## 🎯 Next Steps

Ready to start fixing? Say "Let's fix" and we'll begin with Phase 1!


