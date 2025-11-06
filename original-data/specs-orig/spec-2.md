מעולה! זה בעצם יותר חכם - JSON יתן לך גמישות מלאה לרנדר קומפוננטות מותאמות אישית. הנה המסמך המחודש:

---

# BMAD-METHOD Learning Platform - Complete Technical Specification
## Content as JSON with Dynamic Component Rendering

---

## 📦 CONTENT MANAGEMENT SYSTEM

### Content Structure Philosophy

**All platform content is stored in structured JSON files organized by:**
- Language support (Hebrew only for now, but structure supports future translations)
- Content type (UI strings, guide content, metadata)
- Feature modules (auth, dashboard, guides, etc.)

**Benefits:**
- ✅ Dynamic component rendering (charts, tables, diagrams)
- ✅ Easy content updates without code changes
- ✅ Structured data for search indexing
- ✅ Support for complex layouts (grids, tabs, accordions)
- ✅ Reusable content blocks
- ✅ Type-safe with TypeScript interfaces

---

## 🗂️ PROJECT STRUCTURE

```
bmad-learning-platform/
├── public/
│   └── assets/
│       └── images/              # Static images
├── src/
│   ├── content/                 # ⭐ ALL CONTENT HERE
│   │   ├── locale/
│   │   │   └── he/              # Hebrew content
│   │   │       ├── ui.json      # UI strings (buttons, labels, messages)
│   │   │       ├── auth.json    # Auth pages content
│   │   │       ├── onboarding.json
│   │   │       ├── dashboard.json
│   │   │       ├── guides/      # ⭐ Guide content
│   │   │       │   ├── index.json           # Guides metadata & catalog
│   │   │       │   ├── roles/
│   │   │       │   │   ├── developers.json
│   │   │       │   │   ├── product-managers.json
│   │   │       │   │   └── ...
│   │   │       │   ├── general/
│   │   │       │   │   ├── quick-start.json
│   │   │       │   │   ├── agents-guide.json
│   │   │       │   │   └── ...
│   │   │       │   └── onboarding/
│   │   │       │       └── ...
│   │   │       ├── tasks.json
│   │   │       ├── notes.json
│   │   │       ├── profile.json
│   │   │       └── admin.json
│   │   └── schemas/             # TypeScript types for content
│   │       ├── guide.types.ts
│   │       ├── component.types.ts
│   │       └── content.types.ts
│   ├── components/
│   │   ├── ui/                  # Shadcn components
│   │   ├── content/             # ⭐ Dynamic content renderers
│   │   │   ├── ContentRenderer.tsx      # Main renderer
│   │   │   ├── blocks/                   # Content block types
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   ├── HeadingBlock.tsx
│   │   │   │   ├── CodeBlock.tsx
│   │   │   │   ├── CalloutBlock.tsx
│   │   │   │   ├── ListBlock.tsx
│   │   │   │   ├── TableBlock.tsx
│   │   │   │   ├── ChartBlock.tsx       # Recharts integration
│   │   │   │   ├── DiagramBlock.tsx     # Mermaid or custom
│   │   │   │   ├── AccordionBlock.tsx
│   │   │   │   ├── TabsBlock.tsx
│   │   │   │   ├── GridBlock.tsx
│   │   │   │   ├── CardBlock.tsx
│   │   │   │   ├── ImageBlock.tsx
│   │   │   │   └── VideoBlock.tsx
│   │   │   └── GuideRenderer.tsx         # Specialized for guides
│   │   ├── guides/
│   │   ├── dashboard/
│   │   └── ...
│   ├── lib/
│   │   ├── content-loader.ts     # Load & parse JSON
│   │   ├── supabase.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useContent.ts         # Hook to load content
│   │   └── ...
│   └── ...
└── ...
```

---

## 📝 CONTENT JSON STRUCTURE

### 1️⃣ UI Strings (`locale/he/ui.json`)

**Purpose:** All static UI text (buttons, labels, tooltips, messages)

```json
{
  "common": {
    "buttons": {
      "save": "שמור",
      "cancel": "ביטול",
      "delete": "מחק",
      "edit": "ערוך",
      "create": "צור חדש",
      "back": "חזור",
      "next": "הבא",
      "previous": "הקודם",
      "close": "סגור",
      "submit": "שלח"
    },
    "labels": {
      "search": "חיפוש",
      "filter": "סינון",
      "sort": "מיון",
      "loading": "טוען...",
      "noResults": "לא נמצאו תוצאות",
      "error": "שגיאה"
    },
    "messages": {
      "saveSuccess": "השינויים נשמרו בהצלחה",
      "deleteConfirm": "האם אתה בטוח שברצונך למחוק?",
      "networkError": "שגיאת רשת. נסה שוב מאוחר יותר."
    }
  },
  "nav": {
    "dashboard": "לוח בקרה",
    "guides": "מדריכים",
    "notes": "הערות",
    "tasks": "משימות",
    "profile": "פרופיל",
    "settings": "הגדרות",
    "admin": "ניהול"
  },
  "auth": {
    "login": "כניסה",
    "register": "הרשמה",
    "logout": "יציאה",
    "forgotPassword": "שכחתי סיסמה",
    "resetPassword": "איפוס סיסמה",
    "loginWithGoogle": "כניסה עם Google"
  },
  "dashboard": {
    "welcome": "שלום, {{name}}!",
    "overview": "סקירה כללית",
    "progress": "התקדמות",
    "continueReading": "המשך קריאה",
    "recentActivity": "פעילות אחרונה",
    "stats": "סטטיסטיקות"
  }
  // ... more sections
}
```

**Usage in code:**
```tsx
import ui from '@/content/locale/he/ui.json';

<Button>{ui.common.buttons.save}</Button>
```

---

### 2️⃣ Guide Index (`locale/he/guides/index.json`)

**Purpose:** Catalog of all guides with metadata

```json
{
  "categories": [
    {
      "id": "core",
      "name": "ליבה (חובה)",
      "description": "מדריכים בסיסיים שחובה לקרוא כדי להבין את BMAD-METHOD",
      "icon": "target",
      "color": "emerald"
    },
    {
      "id": "roles",
      "name": "לפי תפקיד",
      "description": "מדריכים מותאמים לתפקידים שונים בארגון",
      "icon": "users",
      "color": "teal"
    },
    {
      "id": "general",
      "name": "כללי",
      "description": "מדריכים נוספים למידע מעמיק",
      "icon": "book-open",
      "color": "mint"
    },
    {
      "id": "onboarding",
      "name": "הדרכה",
      "description": "מדריכי הדרכה ראשונית",
      "icon": "graduation-cap",
      "color": "forest"
    }
  ],
  "guides": [
    {
      "id": "quick-start",
      "slug": "quick-start",
      "category": "core",
      "title": "התחלה מהירה לכולם",
      "description": "למד את היסודות של BMAD-METHOD ב-15 דקות",
      "difficulty": "beginner",
      "estimatedMinutes": 15,
      "icon": "rocket",
      "tags": ["יסודות", "מתחילים", "סקירה"],
      "isCore": true,
      "order": 1
    },
    {
      "id": "developers",
      "slug": "developers",
      "category": "roles",
      "title": "מדריך למפתחים",
      "description": "כל מה שמפתח צריך לדעת על BMAD-METHOD",
      "difficulty": "intermediate",
      "estimatedMinutes": 45,
      "icon": "code",
      "tags": ["פיתוח", "קוד", "אג'נטים"],
      "relatedTo": ["agents-guide", "workflows-guide"],
      "order": 1
    }
    // ... all guides
  ],
  "roles": [
    {
      "id": "developer",
      "name": "מפתח/ת",
      "icon": "code",
      "description": "מתמחה בפיתוח תוכנה",
      "recommendedGuides": ["quick-start", "developers", "agents-guide", "workflows-guide"]
    },
    {
      "id": "product-manager",
      "name": "מנהל/ת מוצר",
      "icon": "briefcase",
      "description": "מנהל מוצר ואנליסט",
      "recommendedGuides": ["quick-start", "product-managers", "planning-guide"]
    }
    // ... all roles
  ],
  "interests": [
    {
      "id": "agents",
      "name": "אג'נטים ווורקפלואים",
      "icon": "bot",
      "guides": ["agents-guide", "workflows-guide", "developers"]
    },
    {
      "id": "architecture",
      "name": "ארכיטקטורה ועיצוב",
      "icon": "building",
      "guides": ["architecture-guide", "design-guide"]
    }
    // ... all interests
  ]
}
```

---

### 3️⃣ Individual Guide Content (`locale/he/guides/roles/developers.json`)

**Purpose:** Full guide content with dynamic components

```json
{
  "metadata": {
    "id": "developers",
    "title": "מדריך למפתחים - שליטה מלאה ב-BMAD-METHOD",
    "description": "מדריך מקיף למפתחים שמלמד איך לעבוד עם כל מרכיבי BMAD-METHOD",
    "difficulty": "intermediate",
    "estimatedMinutes": 45,
    "lastUpdated": "2025-01-15",
    "author": "צוות BMAD",
    "icon": "code",
    "tags": ["פיתוח", "אג'נטים", "וורקפלואים"]
  },
  "tableOfContents": [
    {
      "id": "intro",
      "title": "מבוא",
      "level": 1
    },
    {
      "id": "who-is-this-for",
      "title": "למי מדריך זה מיועד",
      "level": 2
    },
    {
      "id": "learning-path",
      "title": "מסלול למידה מומלץ",
      "level": 1
    }
    // ... auto-generated from content headings
  ],
  "content": [
    {
      "type": "heading",
      "id": "intro",
      "level": 1,
      "text": "מבוא"
    },
    {
      "type": "text",
      "content": "ברוכים הבאים למדריך המקיף למפתחים! מדריך זה יעזור לך לשלוט בכל היכולות של BMAD-METHOD.",
      "className": "text-lg"
    },
    {
      "type": "callout",
      "variant": "info",
      "icon": "info",
      "title": "מה תלמד במדריך זה",
      "content": "בסוף המדריך תדע להשתמש בכל 12 האג'נטים, להריץ וורקפלואים, ולבנות פרויקטים מורכבים."
    },
    {
      "type": "heading",
      "id": "who-is-this-for",
      "level": 2,
      "text": "למי מדריך זה מיועד"
    },
    {
      "type": "list",
      "ordered": false,
      "items": [
        "מפתחים עם ניסיון בפיתוח תוכנה",
        "מפתחים שרוצים להשתמש ב-AI בתהליך הפיתוח",
        "מפתחים שעובדים עם IDE כמו VS Code או Cursor"
      ]
    },
    {
      "type": "heading",
      "id": "learning-path",
      "level": 1,
      "text": "מסלול למידה מומלץ - צעד אחר צעד"
    },
    {
      "type": "accordion",
      "items": [
        {
          "title": "שלב 1: הבנת היסודות (שבוע 1)",
          "icon": "circle-1",
          "content": [
            {
              "type": "text",
              "content": "התחל עם המושגים הבסיסיים:"
            },
            {
              "type": "list",
              "ordered": true,
              "items": [
                "מהו BMAD-METHOD ולמה הוא רלוונטי",
                "המושגים: אג'נט, וורקפלואו, מודול",
                "מבנה הפרויקט ותיקיות"
              ]
            },
            {
              "type": "callout",
              "variant": "success",
              "icon": "check-circle",
              "content": "צפה בסרטון ההסבר הראשון בערוץ YouTube"
            }
          ]
        },
        {
          "title": "שלב 2: התקנה והגדרה (שבוע 1-2)",
          "icon": "circle-2",
          "content": [
            {
              "type": "text",
              "content": "הוראות התקנה מפורטות:"
            },
            {
              "type": "code",
              "language": "bash",
              "code": "npx bmad-method@alpha install",
              "filename": "terminal",
              "showLineNumbers": false
            },
            {
              "type": "text",
              "content": "לאחר ההתקנה, הפעל את workflow-init:"
            },
            {
              "type": "code",
              "language": "bash",
              "code": "*workflow-init",
              "filename": "IDE",
              "showLineNumbers": false
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "id": "agents-overview",
      "level": 1,
      "text": "האג'נטים שלך - סקירה"
    },
    {
      "type": "text",
      "content": "כמפתח, אלו הם האג'נטים שתשתמש בהם הכי הרבה:"
    },
    {
      "type": "grid",
      "columns": 3,
      "gap": "md",
      "items": [
        {
          "type": "card",
          "icon": "user-code",
          "iconColor": "emerald",
          "title": "Developer Agent",
          "description": "האג'נט הראשי לפיתוח קוד",
          "content": [
            {
              "type": "text",
              "content": "משתמש: 80% מהזמן",
              "className": "text-sm text-muted-foreground"
            }
          ]
        },
        {
          "type": "card",
          "icon": "building",
          "iconColor": "teal",
          "title": "Architect Agent",
          "description": "החלטות ארכיטקטורה",
          "content": [
            {
              "type": "text",
              "content": "משתמש: פרויקטים מורכבים",
              "className": "text-sm text-muted-foreground"
            }
          ]
        },
        {
          "type": "card",
          "icon": "test-tube",
          "iconColor": "mint",
          "title": "Test Architect (TEA)",
          "description": "בדיקות ואיכות",
          "content": [
            {
              "type": "text",
              "content": "משתמש: כל סטורי",
              "className": "text-sm text-muted-foreground"
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "id": "agent-details",
      "level": 2,
      "text": "Developer Agent - מדריך מפורט"
    },
    {
      "type": "tabs",
      "defaultTab": "overview",
      "items": [
        {
          "id": "overview",
          "label": "סקירה",
          "icon": "eye",
          "content": [
            {
              "type": "text",
              "content": "האג'נט Developer הוא הכלי העיקרי שלך לפיתוח קוד. הוא מבין את ההקשר של הפרויקט ועוזר לך לכתוב קוד איכותי."
            }
          ]
        },
        {
          "id": "when-to-use",
          "label": "מתי להשתמש",
          "icon": "calendar",
          "content": [
            {
              "type": "list",
              "ordered": false,
              "items": [
                "כתיבת קוד חדש",
                "רפקטורינג קוד קיים",
                "תיקון באגים",
                "הוספת פיצ'רים"
              ]
            }
          ]
        },
        {
          "id": "examples",
          "label": "דוגמאות",
          "icon": "code",
          "content": [
            {
              "type": "text",
              "content": "דוגמה לפקודה:"
            },
            {
              "type": "code",
              "language": "bash",
              "code": "Load Developer agent and implement user authentication feature",
              "showCopyButton": true
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "id": "workflow-comparison",
      "level": 1,
      "text": "השוואת וורקפלואים"
    },
    {
      "type": "table",
      "caption": "השוואה בין הוורקפלואים השונים",
      "headers": ["וורקפלואו", "מתי להשתמש", "רמת מורכבות", "זמן"],
      "rows": [
        ["Quick Spec", "באג או פיצ'ר קטן", "נמוכה ⭐", "2-5 דק'"],
        ["Full BMM", "פרויקט בינוני", "בינונית ⭐⭐", "30-60 דק'"],
        ["Architecture Flow", "מערכת מורכבת", "גבוהה ⭐⭐⭐", "2-4 שעות"]
      ]
    },
    {
      "type": "heading",
      "id": "progress-chart",
      "level": 1,
      "text": "מסלול ההתקדמות שלך"
    },
    {
      "type": "chart",
      "chartType": "line",
      "title": "זמן ללמידה משוער לפי שלבים",
      "data": [
        { "stage": "יסודות", "hours": 2, "label": "שבוע 1" },
        { "stage": "התקנה", "hours": 3, "label": "שבוע 2" },
        { "stage": "אג'נטים", "hours": 8, "label": "שבוע 3-4" },
        { "stage": "מתקדם", "hours": 10, "label": "שבוע 5-8" }
      ],
      "xKey": "stage",
      "yKey": "hours",
      "yLabel": "שעות",
      "color": "emerald"
    },
    {
      "type": "heading",
      "id": "practical-scenarios",
      "level": 1,
      "text": "תרחישים מעשיים"
    },
    {
      "type": "text",
      "content": "להלן תרחישים אמיתיים מהעבודה היומיומית של מפתח:"
    },
    {
      "type": "card",
      "variant": "bordered",
      "icon": "bug",
      "iconColor": "red",
      "title": "תרחיש 1: תיקון באג דחוף",
      "content": [
        {
          "type": "text",
          "content": "**הקונטקסט:** נמצא באג קריטי בפרודקשן שגורם למשתמשים להתנתק.",
          "className": "font-medium"
        },
        {
          "type": "text",
          "content": "**הפתרון עם BMAD:**"
        },
        {
          "type": "list",
          "ordered": true,
          "items": [
            "טען את Developer Agent",
            "הרץ Quick Spec Flow",
            "תאר את הבאג והסביבה",
            "האג'נט מנתח ומציע פתרון",
            "בדוק עם TEA Agent"
          ]
        },
        {
          "type": "callout",
          "variant": "success",
          "icon": "clock",
          "content": "זמן חיסכון: מ-2 שעות ל-20 דקות!"
        }
      ]
    },
    {
      "type": "heading",
      "id": "faq",
      "level": 1,
      "text": "שאלות נפוצות"
    },
    {
      "type": "accordion",
      "allowMultiple": true,
      "items": [
        {
          "title": "האם אני צריך ניסיון קודם עם AI?",
          "content": [
            {
              "type": "text",
              "content": "לא! BMAD-METHOD מתאים גם למי שלא עבד עם AI בעבר. המערכת מנחה אותך בכל שלב."
            }
          ]
        },
        {
          "title": "איזה IDE נתמך?",
          "content": [
            {
              "type": "text",
              "content": "BMAD תומך ב:"
            },
            {
              "type": "list",
              "items": ["VS Code", "Cursor", "Windsurf", "Claude Code"]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "id": "next-steps",
      "level": 1,
      "text": "הצעדים הבאים"
    },
    {
      "type": "callout",
      "variant": "info",
      "icon": "arrow-right",
      "title": "מוכן להמשיך?",
      "content": "עבור למדריך הבא: **מדריך אג'נטים מקיף** ללמידה מעמיקה."
    }
  ]
}
```

---

### 4️⃣ Dashboard Content (`locale/he/dashboard.json`)

```json
{
  "hero": {
    "greeting": "שלום, {{displayName}}!",
    "subtitle": "מה נלמד היום?"
  },
  "progress": {
    "title": "ההתקדמות שלך",
    "totalLabel": "סה\"כ מדריכים",
    "completedLabel": "הושלמו",
    "categories": {
      "core": {
        "label": "ליבה (חובה)",
        "color": "emerald",
        "description": "מדריכים בסיסיים שחובה לקרוא"
      },
      "recommended": {
        "label": "מומלצים",
        "color": "teal",
        "description": "מותאמים לתפקיד שלך"
      },
      "interests": {
        "label": "תחומי עניין",
        "color": "mint",
        "description": "נושאים שבחרת"
      },
      "optional": {
        "label": "נוספים",
        "color": "gray",
        "description": "כל שאר המדריכים"
      }
    }
  },
  "continueReading": {
    "title": "המשך לקרוא",
    "emptyState": {
      "title": "עדיין לא התחלת לקרוא",
      "description": "עבור לדף המדריכים כדי להתחיל ללמוד",
      "actionText": "עבור למדריכים"
    },
    "lastRead": "נקרא לאחרונה {{timeAgo}}"
  },
  "badges": {
    "title": "ההישגים שלך",
    "bronze": {
      "name": "מתחיל",
      "description": "השלמת את כל מדריכי הליבה",
      "icon": "medal"
    },
    "silver": {
      "name": "מתקדם",
      "description": "השלמת ליבה + מומלצים",
      "icon": "award"
    },
    "gold": {
      "name": "מומחה",
      "description": "השלמת 100% מהמדריכים",
      "icon": "trophy"
    },
    "notEarned": "לא הושג עדיין",
    "nextGoal": "היעד הבא: {{badgeName}}"
  },
  "tasks": {
    "title": "המשימות שלי",
    "statusLabels": {
      "todo": "לביצוע",
      "inProgress": "בתהליך",
      "done": "הושלם"
    },
    "viewAll": "צפה בכל המשימות",
    "emptyState": "אין משימות. צור משימה חדשה!"
  },
  "notes": {
    "title": "ההערות שלי",
    "viewAll": "צפה בכל ההערות",
    "lastNotes": "הערות אחרונות",
    "emptyState": "אין הערות עדיין"
  },
  "activity": {
    "title": "פעילות אחרונה",
    "types": {
      "completedGuide": "השלים: {{guideName}}",
      "createdNote": "יצר הערה ב{{guideName}}",
      "createdTask": "יצר משימה: {{taskTitle}}",
      "commented": "הגיב על {{guideName}}"
    },
    "emptyState": "אין פעילות להצגה"
  },
  "stats": {
    "title": "הסטטיסטיקות שלי",
    "readingTime": "זמן קריאה",
    "hours": "שעות",
    "guidesCompleted": "מדריכים הושלמו",
    "notesCreated": "הערות נוצרו",
    "tasksCompleted": "משימות הושלמו"
  },
  "popularGuides": {
    "title": "מדריכים פופולריים השבוע",
    "views": "צפיות"
  }
}
```

---

## 🎨 CONTENT BLOCK TYPES

### TypeScript Types Definition

```typescript
// src/content/schemas/component.types.ts

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | TableBlock
  | ChartBlock
  | DiagramBlock
  | AccordionBlock
  | TabsBlock
  | GridBlock
  | CardBlock
  | ImageBlock
  | VideoBlock;

export interface BaseBlock {
  type: string;
  id?: string;
  className?: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id: string; // for ToC links
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // can include markdown inline formatting
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered: boolean;
  items: string[] | ContentBlock[][]; // nested content support
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  code: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  showCopyButton?: boolean;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: 'info' | 'warning' | 'success' | 'error';
  icon?: string; // Lucide icon name
  title?: string;
  content: string | ContentBlock[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  align?: ('left' | 'center' | 'right')[];
}

export interface ChartBlock extends BaseBlock {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'radar';
  title?: string;
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
  color?: string; // emerald, teal, mint, etc.
  showLegend?: boolean;
  showGrid?: boolean;
}

export interface DiagramBlock extends BaseBlock {
  type: 'diagram';
  diagramType: 'mermaid' | 'custom';
  content: string; // Mermaid syntax or custom
  title?: string;
}

export interface AccordionBlock extends BaseBlock {
  type: 'accordion';
  allowMultiple?: boolean;
  items: {
    title: string;
    icon?: string;
    content: ContentBlock[];
  }[];
}

export interface TabsBlock extends BaseBlock {
  type: 'tabs';
  defaultTab: string;
  items: {
    id: string;
    label: string;
    icon?: string;
    content: ContentBlock[];
  }[];
}

export interface GridBlock extends BaseBlock {
  type: 'grid';
  columns: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  items: ContentBlock[];
}

export interface CardBlock extends BaseBlock {
  type: 'card';
  variant?: 'default' | 'bordered' | 'elevated';
  icon?: string;
  iconColor?: string;
  title?: string;
  description?: string;
  content?: ContentBlock[];
  footer?: ContentBlock[];
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string; // YouTube, Vimeo, etc.
  title?: string;
  aspectRatio?: '16:9' | '4:3';
}
```

---

## 🔧 DYNAMIC CONTENT RENDERER

### Main Content Renderer Component

```tsx
// src/components/content/ContentRenderer.tsx

import React from 'react';
import { ContentBlock } from '@/content/schemas/component.types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { ListBlock } from './blocks/ListBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { CalloutBlock } from './blocks/CalloutBlock';
import { TableBlock } from './blocks/TableBlock';
import { ChartBlock } from './blocks/ChartBlock';
import { AccordionBlock } from './blocks/AccordionBlock';
import { TabsBlock } from './blocks/TabsBlock';
import { GridBlock } from './blocks/GridBlock';
import { CardBlock } from './blocks/CardBlock';
// ... import all block types

interface ContentRendererProps {
  content: ContentBlock[];
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    const key = block.id || `block-${index}`;

    switch (block.type) {
      case 'heading':
        return <HeadingBlock key={key} {...block} />;
      case 'text':
        return <TextBlock key={key} {...block} />;
      case 'list':
        return <ListBlock key={key} {...block} />;
      case 'code':
        return <CodeBlock key={key} {...block} />;
      case 'callout':
        return <CalloutBlock key={key} {...block} />;
      case 'table':
        return <TableBlock key={key} {...block} />;
      case 'chart':
        return <ChartBlock key={key} {...block} />;
      case 'accordion':
        return <AccordionBlock key={key} {...block} />;
      case 'tabs':
        return <TabsBlock key={key} {...block} />;
      case 'grid':
        return <GridBlock key={key} {...block} />;
      case 'card':
        return <CardBlock key={key} {...block} />;
      // ... all other types
      default:
        console.warn('Unknown block type:', (block as any).type);
        return null;
    }
  };

  return (
    <div className={className}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
```

---

## 📊 EXAMPLE BLOCK COMPONENTS

### Chart Block (using Recharts + Shadcn)

```tsx
// src/components/content/blocks/ChartBlock.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBlock as ChartBlockType } from '@/content/schemas/component.types';

export function ChartBlock({ title, data, xKey, yKey, xLabel, yLabel, color = 'emerald', chartType = 'line', showLegend = true, showGrid = true, className }: ChartBlockType) {
  const colors = {
    emerald: '#10B981',
    teal: '#14B8A6',
    mint: '#6EE7B7',
    forest: '#064E3B'
  };

  const strokeColor = colors[color as keyof typeof colors] || colors.emerald;

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
  const DataComponent = chartType === 'bar' ? Bar : Line;

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            {showLegend && <Legend />}
            <DataComponent type="monotone" dataKey={yKey} stroke={strokeColor} fill={strokeColor} />
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Accordion Block (using Shadcn Accordion)

```tsx
// src/components/content/blocks/AccordionBlock.tsx

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionBlock as AccordionBlockType } from '@/content/schemas/component.types';
import { ContentRenderer } from '../ContentRenderer';
import * as Icons from 'lucide-react';

export function AccordionBlock({ items, allowMultiple = false, className }: AccordionBlockType) {
  return (
    <Accordion type={allowMultiple ? 'multiple' : 'single'} collapsible className={className}>
      {items.map((item, index) => {
        const Icon = item.icon ? (Icons as any)[item.icon] : null;
        
        return (
          <AccordionItem key={`item-${index}`} value={`item-${index}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ContentRenderer content={item.content} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
```

### Grid Block (responsive grid with Shadcn)

```tsx
// src/components/content/blocks/GridBlock.tsx

import React from 'react';
import { GridBlock as GridBlockType } from '@/content/schemas/component.types';
import { ContentRenderer } from '../ContentRenderer';
import { cn } from '@/lib/utils';

export function GridBlock({ columns, gap = 'md', items, className }: GridBlockType) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn('grid', gridCols[columns], gapClass[gap], className)}>
      {items.map((item, index) => (
        <div key={`grid-item-${index}`}>
          <ContentRenderer content={[item]} />
        </div>
      ))}
    </div>
  );
}
```

---

## 🔌 CONTENT LOADING HOOK

```typescript
// src/hooks/useContent.ts

import { useState, useEffect } from 'react';

export function useContent<T = any>(path: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        // Dynamic import of JSON file
        const content = await import(`@/content/${path}`);
        setData(content.default);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [path]);

  return { data, loading, error };
}

// Usage in components:
// const { data: guide, loading } = useContent('locale/he/guides/roles/developers.json');
```

---

## 🌍 INTERNATIONALIZATION SETUP (i18n)

Even though we're Hebrew-only now, structure supports future translation:

```typescript
// src/lib/i18n.ts

type Locale = 'he'; // future: 'he' | 'en'

const LOCALE_STORAGE_KEY = 'bmad_locale';

export function getCurrentLocale(): Locale {
  return (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) || 'he';
}

export function setLocale(locale: Locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export async function loadTranslations(locale: Locale, namespace: string) {
  return import(`@/content/locale/${locale}/${namespace}.json`);
}

// Usage:
// const ui = await loadTranslations('he', 'ui');
```

---

## 📁 COMPLETE CONTENT FILE LIST

```
src/content/
├── locale/
│   └── he/                           # Hebrew content
│       ├── ui.json                   # ✅ All UI strings
│       ├── auth.json                 # ✅ Auth pages
│       ├── onboarding.json           # ✅ Onboarding wizard
│       ├── dashboard.json            # ✅ Dashboard content
│       ├── guides/
│       │   ├── index.json            # ✅ Guides catalog + metadata
│       │   ├── roles/
│       │   │   ├── developers.json
│       │   │   ├── product-managers.json
│       │   │   ├── designers.json
│       │   │   ├── architects.json
│       │   │   ├── project-managers.json
│       │   │   ├── qa-engineers.json
│       │   │   ├── executives.json
│       │   │   ├── game-developers.json
│       │   │   ├── innovation-teams.json
│       │   │   └── non-technical.json
│       │   ├── general/
│       │   │   ├── quick-start.json
│       │   │   ├── glossary.json
│       │   │   ├── agents-guide.json
│       │   │   ├── workflows-guide.json
│       │   │   ├── installation.json
│       │   │   ├── best-practices.json
│       │   │   ├── faq.json
│       │   │   ├── customization.json
│       │   │   ├── integration.json
│       │   │   ├── learning-paths.json
│       │   │   └── case-studies.json
│       │   └── onboarding/
│       │       ├── day-1.json
│       │       ├── week-1.json
│       │       └── month-1.json
│       ├── notes.json                # ✅ Notes page content
│       ├── tasks.json                # ✅ Tasks page content
│       ├── profile.json              # ✅ Profile page content
│       ├── settings.json             # ✅ Settings page content
│       └── admin.json                # ✅ Admin panel content
└── schemas/
    ├── guide.types.ts                # ✅ Guide structure types
    ├── component.types.ts            # ✅ Content block types
    └── content.types.ts              # ✅ General content types
```

---

## 🎯 KEY BENEFITS OF JSON APPROACH

### 1. **Dynamic Component Rendering**
```json
{
  "type": "chart",
  "chartType": "line",
  "data": [...]
}
```
→ Renders beautiful Recharts component

### 2. **Easy Content Updates**
- No code changes needed
- Just edit JSON
- Hot reload in development

### 3. **Type Safety**
```typescript
const guide: Guide = useContent('guides/roles/developers.json');
// ✅ TypeScript validates structure
```

### 4. **Reusable Components**
```json
{
  "type": "callout",
  "variant": "success",
  "content": "..."
}
```
→ Consistent design across all guides

### 5. **Search Indexing**
```typescript
// Easy to index all content for search
const guides = loadAllGuides();
const searchIndex = createSearchIndex(guides);
```

### 6. **Future-Proof for Translation**
```
locale/he/  → Hebrew
locale/en/  → English (future)
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Step 1: Setup Content Structure
- [ ] Create `src/content/` directory
- [ ] Create `locale/he/` subdirectory
- [ ] Define TypeScript types in `schemas/`
- [ ] Create `ui.json` with all UI strings

### Step 2: Build Block Components
- [ ] Implement `ContentRenderer.tsx`
- [ ] Create all block components in `components/content/blocks/`
- [ ] Test each block type individually

### Step 3: Create Guide Content
- [ ] Create `guides/index.json` catalog
- [ ] Write 10 role-specific guides (JSON)
- [ ] Write 11 general guides (JSON)
- [ ] Write 3 onboarding guides (JSON)

### Step 4: Implement Content Loading
- [ ] Create `useContent` hook
- [ ] Implement content caching
- [ ] Add error handling
- [ ] Add loading states

### Step 5: Build Guide Renderer
- [ ] Create `GuideRenderer.tsx`
- [ ] Auto-generate Table of Contents
- [ ] Implement scroll tracking
- [ ] Add "helpful" voting

### Step 6: Search Implementation
- [ ] Index all guide content
- [ ] Implement Fuse.js search
- [ ] Build Command Palette (Ctrl+K)
- [ ] Add search highlighting

### Step 7: Testing & Polish
- [ ] Test all block types
- [ ] Test RTL layout
- [ ] Test responsive design
- [ ] Performance optimization

---

## 📚 EXAMPLE: Creating a New Guide

### 1. Add to Catalog (`guides/index.json`)
```json
{
  "guides": [
    {
      "id": "my-new-guide",
      "slug": "my-new-guide",
      "category": "general",
      "title": "מדריך חדש שלי",
      "description": "תיאור קצר",
      "difficulty": "beginner",
      "estimatedMinutes": 20,
      "icon": "book",
      "tags": ["יסודות"]
    }
  ]
}
```

### 2. Create Content File (`guides/general/my-new-guide.json`)
```json
{
  "metadata": {
    "id": "my-new-guide",
    "title": "מדריך חדש שלי"
  },
  "content": [
    {
      "type": "heading",
      "level": 1,
      "text": "ברוכים הבאים"
    },
    {
      "type": "text",
      "content": "זהו מדריך חדש מדהים..."
    }
  ]
}
```

### 3. Done! 🎉
- Automatically indexed for search
- Appears in guides library
- Fully functional with all features

---

## ✅ FINAL NOTES

**This JSON-based approach gives you:**
- ✅ Complete control over layout
- ✅ Beautiful Shadcn components
- ✅ Charts, tables, diagrams
- ✅ Easy content management
- ✅ Type-safe development
- ✅ Future-proof for i18n
- ✅ No Markdown limitations

**Perfect for your use case where you want:**
- Rich interactive components
- Custom layouts
- Easy content editing
- Professional design

---

**Ready to build! Need the complete deployment guide or any specific block component examples?** 🚀