# Hebrew-Only UI Policy for Agenseek

**Status:** ENFORCED
**Date:** November 6, 2025
**Priority:** P0 (Critical)

---

## ⚠️ CRITICAL POLICY

**ALL UI TEXT MUST BE IN HEBREW**

**Only Exception:** "Agenseek" brand name

---

## Why This Matters

Agenseek is an **internal Hebrew-first learning platform** for BMAD-METHOD. The target audience is Hebrew-speaking employees within the company. English text creates friction and reduces user experience quality.

---

## Rules

### ✅ ALLOWED:
- Hebrew text for ALL UI elements
- Hebrew text for ALL labels, buttons, titles, descriptions
- Hebrew text for ALL error messages, toasts, notifications
- Hebrew text for ALL placeholder text
- Hebrew text for ALL form labels
- "Agenseek" brand name ONLY
- Tabler Icons (professional SVG icons)

### ❌ NOT ALLOWED:
- English UI text (except "Agenseek")
- Emojis (📚 📝 ✅ 👤 etc.)
- Mixed Hebrew/English text
- Hardcoded English strings in components

---

## Implementation

### Centralized Locale File

**ALL Hebrew strings MUST be in:**
```
src/lib/locale/he.ts
```

**Never hardcode Hebrew text in components.**

### Example - ❌ WRONG:
```typescript
<h1>Dashboard</h1>
<Button>Browse Guides</Button>
<p>Welcome back</p>
```

### Example - ✅ CORRECT:
```typescript
import { hebrewLocale } from '@/lib/locale/he';

<h1>{hebrewLocale.dashboard.title}</h1>  // לוח בקרה
<Button>{hebrewLocale.actions.browseGuides}</Button>  // עיון במדריכים
<p>{hebrewLocale.dashboard.welcomeBack}</p>  // ברוכים השבים
```

---

## Icon Usage

### ❌ NEVER Use Emojis:
```typescript
<span>📚 Guides</span>  // WRONG!
<span>📝 Notes</span>   // WRONG!
```

### ✅ ALWAYS Use Tabler Icons:
```typescript
import { IconBooks, IconNote } from '@tabler/icons-react';

<IconBooks className="w-5 h-5" stroke={1.5} />
<span>{hebrewLocale.nav.guides}</span>  // מדריכים
```

---

## New Features Checklist

Before submitting ANY new feature, verify:

- [ ] **Zero English text** (except "Agenseek")
- [ ] **Zero emojis** anywhere
- [ ] **All strings** use `hebrewLocale`
- [ ] **Icons** are from Tabler Icons
- [ ] **RTL layout** works correctly
- [ ] **Hebrew translations** are natural and accurate

---

## Adding New Strings

### Step 1: Add to Locale Interface

Edit `src/lib/locale/he.ts`:

```typescript
export interface LocaleStrings {
  // ... existing sections ...

  // Add your new section
  myNewFeature: {
    title: string;
    description: string;
    action: string;
  };
}
```

### Step 2: Add Hebrew Translations

```typescript
export const hebrewLocale: LocaleStrings = {
  // ... existing translations ...

  myNewFeature: {
    title: 'כותרת בעברית',
    description: 'תיאור בעברית',
    action: 'פעולה',
  },
};
```

### Step 3: Use in Component

```typescript
import { hebrewLocale } from '@/lib/locale/he';

<h2>{hebrewLocale.myNewFeature.title}</h2>
<p>{hebrewLocale.myNewFeature.description}</p>
<Button>{hebrewLocale.myNewFeature.action}</Button>
```

---

## Verification Tools

### Check for Emojis:
```bash
grep -r "[😀-🙏🌀-🗿🚀-🛿]" src/
# Should return: No matches found
```

### Check for Common English Words:
```bash
grep -r "Dashboard\|Guides\|Notes\|Tasks\|Profile\|Settings" src/app
# Should only find them in comments, never in JSX
```

### Build Test:
```bash
npm run build
# Should complete successfully
```

---

## Current Status

### ✅ Fully Localized Components:

1. **Navigation (Sidebar)**
   - All 7 items: לוח בקרה, מדריכים, הערות, משימות, פרופיל, הגדרות, ניהול
   - Help section: צריכים עזרה?

2. **Header**
   - Search: חיפוש מדריכים...
   - Logout: התנתקות

3. **Dashboard**
   - All titles, descriptions, and quick links
   - Zero emojis, using Tabler Icons

4. **Pages**
   - Guides: מדריכי למידה
   - Notes: ההערות שלי
   - Tasks: המשימות שלי
   - Profile: פרופיל
   - Settings: הגדרות
   - Admin: לוח בקרה לניהול

---

## Future Development

**For ALL new features, stories, and components:**

1. **First:** Add Hebrew strings to `he.ts`
2. **Second:** Use icons from Tabler Icons
3. **Third:** Implement component using `hebrewLocale`
4. **Fourth:** Verify no English/emojis
5. **Fifth:** Test RTL layout

**This policy is NON-NEGOTIABLE.**

---

## Resources

- Hebrew Locale File: `src/lib/locale/he.ts`
- Tabler Icons: https://tabler-icons.io/
- RTL Layout Guide: Already configured with `dir="rtl"` in `index.html`

---

## Contact

If you need help with:
- Hebrew translations
- Icon selection
- RTL layout issues

**Refer to this document and existing examples in the codebase.**

---

**Last Updated:** November 6, 2025
**Enforced By:** Story 1.11 - Full Hebrew Localization

