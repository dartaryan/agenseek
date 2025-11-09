# Story 11.5: Keyboard Shortcuts Improvements

**Status:** 📋 Ready for Implementation
**Type:** User Experience / Accessibility
**Priority:** P2 - Medium
**Sprint:** TBD | **Points:** 2 (Small-Medium)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Issues:**

1. **Keyboard shortcuts not easily accessible** - Users don't know how to view them again
2. **Backwards text (RTL issue)** - Keyboard shortcut keys display in wrong direction
3. **Ctrl+K modal design** - Current design is "odd" and needs improvement

**Impact:**
- Users can't discover/remember keyboard shortcuts
- Shortcuts displayed incorrectly (RTL bug)
- Ctrl+K search modal doesn't look polished
- Reduced productivity for keyboard users
- Poor accessibility

---

## 📖 User Story

**As a keyboard-focused user,**
**I want easy access to keyboard shortcuts with proper RTL display and a beautiful Ctrl+K modal,**
**So that I can efficiently navigate the app using keyboard commands.**

---

## ✅ Acceptance Criteria

### 1. Make Keyboard Shortcuts Viewable

**Given** keyboard shortcuts exist
**When** user wants to view them
**Then:**

- [ ] Add clear access point to view shortcuts
- [ ] Options:
  - **Option A**: Help menu item "קיצורי מקלדת" (Keyboard Shortcuts)
  - **Option B**: Settings page section
  - **Option C**: Footer link
  - **Option D**: Keyboard shortcut to show shortcuts (e.g., `?` or `Shift+/`)
  - **Option E**: Multiple access points (recommended)

- [ ] Choose 2-3 access points for best discoverability

**Recommended Access Points:**
1. Help menu in sidebar: "קיצורי מקלדת"
2. Footer link: "קיצורי מקלדת"
3. Press `?` key anywhere → shows shortcuts modal

---

### 2. Create Keyboard Shortcuts Modal/Page

**Given** user wants to view shortcuts
**When** clicking "Keyboard Shortcuts"
**Then:**

- [ ] Modal or dedicated page opens
- [ ] Title: "קיצורי מקלדת" (Keyboard Shortcuts)
- [ ] Organized by category:
  - **ניווט כללי** (General Navigation)
  - **חיפוש** (Search)
  - **מדריכים** (Guides)
  - **משימות** (Tasks)
  - **אחר** (Other)

- [ ] Each shortcut shows:
  - Key combination (properly formatted for RTL)
  - Description in Hebrew
  - Icon (optional)

- [ ] Clean, scannable layout
- [ ] Mobile-friendly
- [ ] Dark mode support

**Example Modal Structure:**

```
┌─────────────────────────────────────────┐
│  ⌨️ קיצורי מקלדת                   [X] │
│                                         │
│  ניווט כללי                             │
│  ─────────────────────────────────────  │
│  לוח הבקרה                    Ctrl + D  │
│  מדריכים                      Ctrl + G  │
│  משימות                       Ctrl + T  │
│                                         │
│  חיפוש                                  │
│  ─────────────────────────────────────  │
│  פתח חיפוש                    Ctrl + K  │
│  חיפוש במדריכים                Ctrl + F │
│                                         │
│  [סגור]                                 │
└─────────────────────────────────────────┘
```

---

### 3. Fix RTL Display of Keyboard Keys

**Given** keyboard shortcuts displayed
**When** showing key combinations
**Then:**

- [ ] Keys display correctly in RTL context
- [ ] Key order preserved (don't reverse Ctrl+K → K+Ctrl)
- [ ] Proper spacing and styling
- [ ] Use `<kbd>` HTML element or styled component

**Current Issue:**

```
← WRONG (reversed)
K + lrtC

← CORRECT
Ctrl + K
```

**Implementation:**

```tsx
// Use KBD component with proper RTL handling
<div className="flex items-center gap-2" dir="ltr">
  {/* Force LTR for keyboard shortcuts */}
  <kbd className="kbd">Ctrl</kbd>
  <span>+</span>
  <kbd className="kbd">K</kbd>
</div>
```

**KBD Styling:**

```tsx
// components/ui/Kbd.tsx
export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-md shadow-sm dark:text-slate-200 dark:bg-slate-700 dark:border-slate-600">
    {children}
  </kbd>
);
```

---

### 4. Redesign Ctrl+K Modal

**Given** Ctrl+K opens search modal
**When** user presses Ctrl+K
**Then:**

#### Current Issues (to fix):
- Modal design "odd" (needs modernization)
- Could be more beautiful
- Possibly missing polish

#### Improvements:

- [ ] **Header**: Clean title with search icon
- [ ] **Search Input**:
  - Large, prominent input field
  - Placeholder: "חפש מדריכים, משימות, דפים..."
  - Clear icon to reset search
  - Focus on open
- [ ] **Results Display**:
  - Categorized results (Guides, Tasks, Pages)
  - Icons for each result type
  - Highlight matching text
  - Keyboard navigation (arrow keys, enter)
- [ ] **Footer**:
  - Keyboard shortcuts hint
  - "↑↓ לניווט, ↵ לפתיחה, Esc לסגירה"
- [ ] **Animations**:
  - Smooth open/close animation
  - Fade-in results
  - Subtle hover effects
- [ ] **Responsive**: Works well on mobile
- [ ] **Dark Mode**: Beautiful in both modes

**Modern Design Reference:**

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-2xl p-0 gap-0" dir="rtl">
    {/* Header with search */}
    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
      <IconSearch className="text-slate-400" size={20} stroke={1.5} />
      <input
        type="text"
        placeholder="חפש מדריכים, משימות, דפים..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-lg"
        autoFocus
      />
      {query && (
        <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
          <IconX size={18} />
        </button>
      )}
    </div>

    {/* Results */}
    <div className="max-h-96 overflow-y-auto">
      {results.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <IconFileOff size={48} className="mx-auto mb-3 opacity-50" />
          <p>לא נמצאו תוצאות</p>
        </div>
      ) : (
        <>
          {/* Guides */}
          {guideResults.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">מדריכים</h3>
              {guideResults.map(result => (
                <SearchResult key={result.id} result={result} />
              ))}
            </div>
          )}

          {/* Tasks */}
          {taskResults.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">משימות</h3>
              {taskResults.map(result => (
                <SearchResult key={result.id} result={result} />
              ))}
            </div>
          )}
        </>
      )}
    </div>

    {/* Footer hints */}
    <div className="flex items-center justify-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
      <span className="flex items-center gap-1">
        <Kbd>↑↓</Kbd> לניווט
      </span>
      <span className="flex items-center gap-1">
        <Kbd>↵</Kbd> לפתיחה
      </span>
      <span className="flex items-center gap-1">
        <Kbd>Esc</Kbd> לסגירה
      </span>
    </div>
  </DialogContent>
</Dialog>
```

---

### 5. Add Keyboard Shortcuts Hook

**Given** need centralized keyboard shortcuts management
**When** implementing shortcuts
**Then:**

- [ ] Create or update `useKeyboardShortcuts` hook
- [ ] Register all shortcuts in one place
- [ ] Handle conflicts (prevent duplicate bindings)
- [ ] Support conditional shortcuts (page-specific)

**Example Hook:**

```typescript
// src/hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+K: Open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Open search modal
        document.dispatchEvent(new CustomEvent('open-search'));
      }

      // Ctrl+D: Go to dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // Ctrl+G: Go to guides
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        navigate('/guides');
      }

      // Ctrl+T: Go to tasks
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        navigate('/tasks');
      }

      // ?: Show keyboard shortcuts
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('show-shortcuts'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};
```

---

### 6. Update Keyboard Shortcuts List

**Given** existing shortcuts documentation
**When** creating shortcuts modal
**Then:**

Document all available shortcuts:

#### Navigation Shortcuts
- `Ctrl + D` - לוח הבקרה (Dashboard)
- `Ctrl + G` - מדריכים (Guides)
- `Ctrl + T` - משימות (Tasks)
- `Ctrl + P` - פרופיל (Profile)
- `Ctrl + ,` - הגדרות (Settings)

#### Search Shortcuts
- `Ctrl + K` - חיפוש (Search)
- `Ctrl + F` - חיפוש במדריך (Search in guide - when in guide)
- `/` - עבור לחיפוש (Jump to search)

#### Guide Reader Shortcuts (when in guide)
- `←` - עמוד הבא (Next page)
- `→` - עמוד קודם (Previous page)
- `Esc` - סגור מדריך (Close guide)

#### General Shortcuts
- `?` or `Shift + /` - הצג קיצורי מקלדת (Show shortcuts)
- `Esc` - סגור modal (Close modal)

---

### 7. Add Keyboard Shortcuts to Help Menu

**Given** sidebar has help section
**When** user views help menu
**Then:**

- [ ] Add "קיצורי מקלדת" menu item
- [ ] Icon: `IconKeyboard` from Tabler Icons
- [ ] Clicking opens shortcuts modal
- [ ] Show shortcut hint: `?`

```tsx
// src/components/layout/Sidebar.tsx

<div className="sidebar-section">
  <h3 className="text-sm font-semibold text-slate-500 px-4 mb-2">עזרה</h3>

  <button
    onClick={() => setShowShortcutsModal(true)}
    className="sidebar-item"
  >
    <IconKeyboard size={20} stroke={1.5} />
    <span>קיצורי מקלדת</span>
    <kbd className="kbd-hint">?</kbd>
  </button>

  <button onClick={handleReportBug} className="sidebar-item">
    <IconBug size={20} stroke={1.5} />
    <span>דיווח על באג</span>
  </button>
</div>
```

---

### 8. Test All Keyboard Shortcuts

**Given** shortcuts are implemented
**When** testing functionality
**Then:**

- [ ] All shortcuts work as expected
- [ ] Shortcuts don't conflict with browser defaults
- [ ] Shortcuts don't trigger when typing in inputs
- [ ] Shortcuts work in all relevant pages
- [ ] Modal opens/closes correctly
- [ ] Keyboard navigation within modal works

---

## 🔧 Technical Implementation

### Files to Create/Modify

1. **Shortcuts Modal**: `src/components/modals/KeyboardShortcutsModal.tsx` (new)
2. **KBD Component**: `src/components/ui/Kbd.tsx` (new)
3. **Keyboard Hook**: `src/hooks/useKeyboardShortcuts.ts` (update)
4. **Ctrl+K Modal**: `src/components/search/CommandPalette.tsx` (redesign)
5. **Sidebar**: Add help menu item
6. **Locale**: Add Hebrew strings

### Locale Strings

```typescript
// src/lib/locale/he.ts

keyboardShortcuts: {
  title: 'קיצורי מקלדת',
  categories: {
    navigation: 'ניווט כללי',
    search: 'חיפוש',
    guides: 'מדריכים',
    tasks: 'משימות',
    general: 'כללי',
  },
  shortcuts: {
    dashboard: 'לוח הבקרה',
    guides: 'מדריכים',
    tasks: 'משימות',
    profile: 'פרופיל',
    settings: 'הגדרות',
    search: 'חיפוש',
    searchInGuide: 'חיפוש במדריך',
    jumpToSearch: 'עבור לחיפוש',
    nextPage: 'עמוד הבא',
    previousPage: 'עמוד קודם',
    closeGuide: 'סגור מדריך',
    showShortcuts: 'הצג קיצורי מקלדת',
    closeModal: 'סגור',
  },
  hints: {
    navigate: 'לניווט',
    open: 'לפתיחה',
    close: 'לסגירה',
  },
},
```

---

## 🧪 Testing Checklist

### Keyboard Shortcuts Modal
- [ ] Opens from help menu
- [ ] Opens from footer link
- [ ] Opens when pressing `?`
- [ ] All shortcuts listed and categorized
- [ ] Keys display correctly (not backwards)
- [ ] Modal responsive on mobile
- [ ] Works in dark mode
- [ ] Closes with Esc or X button

### Ctrl+K Modal Redesign
- [ ] Opens with Ctrl+K
- [ ] Search input focused on open
- [ ] Results categorized correctly
- [ ] Keyboard navigation works (arrow keys)
- [ ] Enter opens selected result
- [ ] Esc closes modal
- [ ] Clear button works
- [ ] Looks beautiful in light mode
- [ ] Looks beautiful in dark mode
- [ ] Mobile responsive

### RTL Key Display
- [ ] Keys not backwards
- [ ] Proper spacing between keys
- [ ] `+` separator shows correctly
- [ ] Styling consistent

### Keyboard Shortcuts Functionality
- [ ] Ctrl+D → Dashboard
- [ ] Ctrl+G → Guides
- [ ] Ctrl+T → Tasks
- [ ] Ctrl+K → Search
- [ ] ? → Show shortcuts
- [ ] All shortcuts work
- [ ] No conflicts with browser shortcuts
- [ ] Don't trigger in input fields

---

## ✅ Definition of Done

Before marking story complete, verify:

### Access Points
- [ ] Help menu has "Keyboard Shortcuts" item
- [ ] Pressing `?` shows shortcuts
- [ ] At least 2 access points implemented

### Keyboard Shortcuts Modal
- [ ] Modal created and functional
- [ ] All shortcuts documented
- [ ] Keys display correctly (RTL fix)
- [ ] Mobile responsive
- [ ] Dark mode works

### Ctrl+K Modal
- [ ] Redesigned with improvements
- [ ] Modern, polished look
- [ ] Smooth animations
- [ ] Keyboard navigation works
- [ ] Mobile friendly

### Testing
- [ ] All shortcuts tested and working
- [ ] No conflicts with existing functionality
- [ ] Cross-browser testing passed

---

## 📊 Success Metrics

**Discoverability:**
- Users can find shortcuts within 30 seconds
- Multiple access points available

**Usability:**
- All keyboard shortcuts functional
- Keys display correctly (no RTL bugs)
- Ctrl+K modal beautiful and responsive

---

## 🚀 Implementation Plan

### Phase 1: Keyboard Shortcuts Modal (1 hour)
1. Create modal component
2. List all shortcuts
3. Add access points (help menu, `?` key)
4. Fix RTL key display

### Phase 2: Ctrl+K Modal Redesign (1 hour)
1. Update search modal design
2. Improve layout and styling
3. Add animations
4. Test keyboard navigation

### Phase 3: Testing & Polish (30 min)
1. Test all shortcuts
2. Mobile testing
3. Dark mode testing
4. Final polish

**Total Estimated Time:** 2.5 hours (2 points)

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (standalone enhancement)

### Related:
- Story 11.3 - RTL layout fixes (similar RTL issues)
- Story 11.6 - Dashboard enhancements (both improve UX)

---

**Created by:** Ben Akiva
**Date:** November 9, 2025
**Story Type:** UX Enhancement / Accessibility (Epic 11)
**Estimated Effort:** 2 story points (~2.5 hours)

---

*Making Agenseek more accessible and keyboard-friendly!*

