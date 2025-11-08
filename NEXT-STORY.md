# 🚀 NEXT STORY: Story 7.1 - Implement Global Search Infrastructure

**Updated:** November 8, 2025

---

## ✅ Story 6.8 Complete!

The task and note statistics dashboard has been successfully implemented! Users can now:

- View comprehensive notes statistics (total, top tags, weekly trend, associated guides)
- Monitor task statistics (status counts, completion rate, high priority tasks, weekly chart)
- See visual representations with Recharts bar charts
- Navigate easily to full notes/tasks pages
- Track productivity and learning habits at a glance

**Completion File:** See `STORY-6.8-COMPLETE.md` for full details.

**Epic 6 Status:** ✅ **100% COMPLETE** (8/8 stories) 🎉

---

## 📍 Next Story to Implement

### **Story 7.1: Implement Global Search Infrastructure**

**Epic:** 7 - Global Search & Command Palette
**Priority:** P0
**Sprint:** 10
**Story Points:** 2
**Dependencies:** Epic 6 Complete ✅

---

## 🎯 Story 7.1 Overview

Build the foundational search infrastructure using Fuse.js to enable fuzzy search across all content types (guides, notes, tasks). This infrastructure will power the header search bar, search results page, and command palette.

### Acceptance Criteria

**Given** I need to enable search functionality
**When** I set up search infrastructure
**Then**:

- Create `src/lib/search.ts` with:
  - Fuse.js configuration
  - Search index builder
  - Type definitions for search results
- Search index includes:
  - All guide metadata (title, description, content preview)
  - All user notes (title, content)
  - All user tasks (title, description)
- Fuse.js configuration:
  - Keys: title (weight: 3), description (weight: 2), content (weight: 1)
  - Threshold: 0.3 (fuzzy matching)
  - Include score and matches
  - Limit: 50 results
- Create `src/hooks/useSearch.ts`:
  - Hook that builds index from all content
  - Returns search function and results
  - Debounced search (300ms)
  - Loading state management

**And** search updates when content changes (notes, tasks added/edited)

---

## 🔨 Implementation Plan

### 1. Install Fuse.js

```bash
npm install fuse.js
```

**Library Choice:** Fuse.js is lightweight, powerful, and perfect for client-side fuzzy search.

### 2. Create Search Library

**File:** `src/lib/search.ts`

**Key Components:**
- `SearchResult` type definition (item, type, score, matches)
- `buildSearchIndex()` function to combine all content
- `searchContent()` function with Fuse.js
- Fuse.js configuration object

**Search Types:**
```typescript
export type SearchableItem = Guide | Note | Task;
export type SearchResultType = 'guide' | 'note' | 'task';

export interface SearchResult {
  item: SearchableItem;
  type: SearchResultType;
  score: number;
  matches: FuseResultMatch[];
}
```

### 3. Create Search Hook

**File:** `src/hooks/useSearch.ts`

**Features:**
- Build search index from guides catalog + user notes + user tasks
- Debounce search queries (300ms) using lodash or custom debounce
- Return: `{ search, results, isLoading }`
- Update index when notes/tasks change
- Use useMemo to cache Fuse instance

**Hook Pattern:**
```typescript
export function useSearch(userId: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Build index
  // Create Fuse instance
  // Debounced search function
  // Return { search, results, isLoading }
}
```

### 4. Fuse.js Configuration

**Search Keys:**
- `title` - weight: 3 (most important)
- `description` - weight: 2 (secondary)
- `content` - weight: 1 (tertiary)

**Options:**
- `threshold`: 0.3 (balance between strict and fuzzy)
- `includeScore`: true
- `includeMatches`: true (for highlighting)
- `minMatchCharLength`: 2
- `limit`: 50

### 5. Index Building Strategy

**Combine Content:**
```typescript
const guides = getGuideCatalog().map(g => ({ ...g, type: 'guide' }));
const notes = await getUserNotes(userId).map(n => ({ ...n, type: 'note' }));
const tasks = await getUserTasks(userId).map(t => ({ ...t, type: 'task' }));
const allContent = [...guides, ...notes, ...tasks];
```

**Build Index:**
```typescript
const fuse = new Fuse(allContent, fuseOptions);
```

### 6. Search Function

**Input:** Query string
**Output:** SearchResult[] (sorted by score)

**Process:**
1. Check if query is empty → return []
2. Run Fuse search: `fuse.search(query)`
3. Transform results to SearchResult format
4. Return up to 50 results

---

## 📚 Technical Resources

### Fuse.js Documentation
- Main docs: https://fusejs.io/
- API reference: https://fusejs.io/api/
- Examples: https://fusejs.io/examples.html

### Debouncing Patterns
- lodash.debounce: Already installed (can use from `lodash`)
- Custom debounce hook: Use `useCallback` + `setTimeout`

### Search Best Practices
- Client-side search (< 10K items)
- Index updates on content changes
- Highlight matching text in results
- Sort by relevance score

---

## 🎨 UI/UX Considerations (Future Stories)

This story sets up the infrastructure. The UI components will be built in:
- Story 7.2: Header Search Bar
- Story 7.3: Search Results Page
- Story 7.4: Command Palette

**For Now:**
- Focus on accurate search results
- Ensure performance (< 100ms search time)
- Provide highlighting data for UI

---

## ✅ Acceptance Criteria Checklist

Before marking story complete:

- [ ] `src/lib/search.ts` created with Fuse.js configuration
- [ ] `src/hooks/useSearch.ts` created with search hook
- [ ] Fuse.js installed and imported
- [ ] Search index includes guides, notes, tasks
- [ ] Search function returns results with scores and matches
- [ ] Debounced search (300ms) implemented
- [ ] Loading state management works
- [ ] Search updates when content changes
- [ ] Type definitions for SearchResult, SearchableItem
- [ ] Search limited to 50 results
- [ ] Fuzzy matching threshold set to 0.3
- [ ] Weighted keys (title:3, description:2, content:1)
- [ ] No TypeScript errors
- [ ] No linter errors

---

## 🧪 Testing Scenarios

### Basic Search
1. Search for "BMAD" → Returns relevant guides
2. Search for note title → Returns that note
3. Search for task title → Returns that task
4. Empty query → Returns []
5. No matches → Returns []

### Fuzzy Matching
1. Search "bmal" → Matches "BMAD" (typo tolerance)
2. Search "devloper" → Matches "Developer" (1 char typo)
3. Search partial words → Returns matches

### Performance
1. Search 100+ items → < 100ms response time
2. Rapid typing → Debounced correctly (no lag)
3. Index rebuilding → Smooth, no UI freeze

### Content Updates
1. Create new note → Appears in search results
2. Delete task → Removed from search results
3. Edit note title → Updated in search results

---

## 🚀 Ready to Implement!

Story 6.8 complete with comprehensive statistics dashboard. Epic 6 is 100% complete!

Story 7.1 begins Epic 7 (Search & Command Palette) by building the search infrastructure foundation.

**Start Command:**
```bash
npm install fuse.js
```

Then implement in this order:
1. Install Fuse.js
2. Create search library (`src/lib/search.ts`)
3. Create search hook (`src/hooks/useSearch.ts`)
4. Test search functionality
5. Verify all acceptance criteria
6. Complete story documentation

---

**Let's build powerful search functionality! 🔍✨**
