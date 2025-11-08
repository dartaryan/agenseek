# 📝 סטורי: מילון מונחים מלא

**שם הסטורי:** `core/glossary`
**כותרת:** מילון מונחים מלא
**קטגוריה:** core
**רמת קושי:** beginner
**זמן קריאה משוער:** 30 דקות
**סטטוס:** ⏳ לא הושלם
**עדיפות:** 🔴 P0 - קריטי!

---

## 🎯 מטרת המדריך

**מה:** מילון מקיף של כל המונחים והמושגים ב-BMAD-METHOD
**למה:** מסמך ייחוס למי שנתקל במונח לא מוכר
**למי:** כולם - מתחילים ומתקדמים

**לאחר קריאת המדריך, הקורא יוכל:**
- להבין כל מונח טכני ב-BMAD
- לקרוא את שאר המדריכים בביטחון
- להשתמש בטרמינולוגיה הנכונה

---

## 👥 קהל יעד

**עיקרי:**
- כל מי שמתחיל עם BMAD
- מי שנתקל במונח לא מוכר
- מי שצריך ייחוס מהיר

**משני:**
- מתקדמים שרוצים לרענן
- מי שכותב תיעוד

**רמת ידע נדרשת:**
- אין! זה המסמך הראשון

---

## 📐 מבנה מומלץ

### 1. פתיחה
```
- Heading (H1): מילון מונחים מלא
- Callout (info): המילון המקיף של BMAD - כל המונחים במקום אחד
- Divider
```

### 2. מבוא (H2: "איך להשתמש במילון?")
```
- Text: איך המילון בנוי
- Text: למי זה מיועד
- Callout (success): טיפ - סמן במועדפים לייחוס מהיר
```

### 3. קטגוריות (מספר H2, לפי נושא)

#### סקשן A: מושגי יסוד
```
- Heading (H2): מושגי יסוד
- Accordion: רשימת מונחים בסיסיים
  - BMAD
  - BMAD-METHOD
  - Cursor
  - AI Agent
  - Context Window
```

#### סקשן B: אגנטים
```
- Heading (H2): אגנטים (Agents)
- Accordion: רשימת כל האגנטים
  - Agent (כללי)
  - PM (Product Manager)
  - Analyst
  - Architect
  - SM (Scrum Master)
  - Dev (Developer)
  - TEA (Test Architect)
  - UX Designer
  - Tech Writer
  - BMAD Master
  - Game Designer
  - Game Architect
  - Game Dev
```

#### סקשן C: וורקפלואים
```
- Heading (H2): וורקפלואים (Workflows)
- Accordion: רשימת הוורקפלואים העיקריים
  - Workflow (כללי)
  - brainstorming
  - product-brief
  - game-brief
  - research
  - prd
  - tech-spec
  - architecture
  - create-ux-design
  - gdd
  - narrative
  - create-epics-and-stories
  - story-context
  - story-ready
  - dev-story
  - code-review
  - story-done
  - sprint-planning
  - retrospective
  - solutioning-gate-check
  - ועוד...
```

#### סקשן D: מושגי ניהול
```
- Heading (H2): מושגי ניהול
- Accordion: רשימת מונחי ניהול
  - Story
  - Epic
  - Sprint
  - Backlog
  - Velocity
  - Definition of Done
  - Story Points
  - ועוד...
```

#### סקשן E: מושגים טכניים
```
- Heading (H2): מושגים טכניים
- Accordion: רשימת מונחים טכניים
  - Repository
  - Branch
  - Commit
  - Pull Request
  - Merge
  - Conflict
  - CI/CD
  - ועוד...
```

#### סקשן F: קונפיגורציה וקבצים
```
- Heading (H2): קונפיגורציה וקבצים
- Accordion: רשימת קבצים וקונפיגורציות
  - config.yaml
  - workflow.yaml
  - .cursorrules
  - context files
  - output folder
  - ועוד...
```

### 4. מונחי קיצורים (H2: "קיצורים נפוצים")
```
- Table: טבלת קיצורים
  | קיצור | פירוש | הסבר |
  |-------|--------|------|
  | PM | Product Manager | מנהל מוצר |
  | SM | Scrum Master | סקראם מאסטר |
  | DEV | Developer | מפתח |
  | TEA | Test Architect | ארכיטקט בדיקות |
  | PRD | Product Requirements Document | מסמך דרישות מוצר |
  | GDD | Game Design Document | מסמך עיצוב משחק |
  | ועוד...
```

### 5. שאלות נפוצות (H2: "שאלות נפוצות")
```
- Accordion: שאלות על השימוש במילון
  - איך אני מוצא מונח מהר?
  - מה ההבדל בין Story ו-Epic?
  - מה ההבדל בין אגנט לוורקפלואו?
  - יש מונחים נוספים שלא במילון?
```

### 6. סיכום (H2: "סיכום")
```
- Text: למה המילון הזה חשוב
- Callout (success): סמן במועדפים!
- Text: מדריכים קשורים
```

---

## 🎨 בלוקים רלוונטיים

**חובה להשתמש:**
- ✅ Heading (H1, H2)
- ✅ Text
- ✅ Accordion - זה הבלוק המרכזי! כל מונח באקורדיון
- ✅ Table - לקיצורים
- ✅ Callout (info, success)
- ✅ Divider

**מומלץ להשתמש:**
- Grid + Card (למונחים מרכזיים)

**לא רלוונטי:**
- Code (אין קוד במילון)
- Chart (אין נתונים)

---

## 📝 הנחיות כתיבה

### סגנון:
- **הגדרה ברורה** - כל מונח מוגדר במשפט 1-2
- **דוגמה** - רוב המונחים צריכים דוגמה
- **קישורים** - קישור למדריכים רלוונטיים
- **עקביות** - כל המונחים באותו פורמט

### מבנה ההגדרה (באקורדיון):
```
כותרת: {שם המונח} ({באנגלית})

תוכן:
**הגדרה:** {הגדרה במשפט 1-2}

**דוגמה:** {דוגמה מעשית}

**קישורים:** [מדריך רלוונטי](#)
```

### דוגמה למונח באקורדיון:
```json
{
  "id": "term-agent",
  "title": "אגנט (Agent)",
  "content": [
    {
      "id": "term-agent-text",
      "type": "text",
      "markdown": true,
      "content": "**הגדרה:** אגנט הוא מומחה וירטואלי שמתמחה בתחום מסויים (כמו PM, Dev, Architect). כל אגנט יודע את התפקיד שלו, את הכלים שהוא צריך, ואת הפרוטוקולים לעבודה.\n\n**דוגמה:** אגנט PM יודע ליצור PRD, לנתח משתמשים, ולהגדיר דרישות מוצר.\n\n**ראו גם:** מדריך אגנטים - מבוא"
    }
  ]
}
```

**🔑 כללים קריטיים:**
- ✅ כל accordion item צריך `id` ייחודי
- ✅ `content` הוא מערך של ContentBlock[] (לא string!)
- ✅ **חובה:** `"markdown": true` בבלוק הטקסט
- ✅ **חובה:** השתמש ב-`\n\n` להפרדת פסקאות (הגדרה, דוגמה, ראו גם)
- ✅ השתמש ב-`**טקסט**` ל-bold, `*טקסט*` ל-italic
- ❌ אל תפצל לבלוקי טקסט נפרדים - השתמש ב-`\n\n` בתוך בלוק אחד

---

## 🔑 נקודות מפתח

### מה חייב להיות במילון:
1. **כל המונחים** - כל מונח שמופיע במדריכים אחרים
2. **הגדרות ברורות** - לא טכני מדי, לא פשטני מדי
3. **דוגמאות** - לכל מונח מורכב
4. **קישורים** - למדריכים רלוונטיים
5. **אקורדיונים** - לנוחות החיפוש

### רשימת המונחים (בערך 60-80 מונחים):

#### קטגוריה 1: מושגי יסוד (10)
- BMAD, BMAD-METHOD, Cursor, AI Agent, Context Window, Prompt, Rules, Configuration, Output Folder, Communication Language

#### קטגוריה 2: אגנטים (13)
- Agent, PM, Analyst, Architect, SM, Dev, TEA, UX Designer, Tech Writer, BMAD Master, Game Designer, Game Architect, Game Dev

#### קטגוריה 3: וורקפלואים (20+)
- Workflow, brainstorming, product-brief, research, prd, tech-spec, architecture, ux-design, gdd, narrative, epics-stories, story-context, story-ready, dev-story, code-review, story-done, sprint-planning, retrospective, ועוד...

#### קטגוריה 4: ניהול (15)
- Story, Epic, Sprint, Backlog, Velocity, Definition of Done, Story Points, Sprint Goal, Product Backlog, Sprint Backlog, Retrospective, Daily Standup, Planning Poker, User Story, Acceptance Criteria

#### קטגוריה 5: טכני (15)
- Repository, Branch, Commit, Pull Request, Merge, Conflict, CI/CD, Deploy, Release, Version Control, Git, GitHub, IDE, API, Database

#### קטגוריה 6: קבצים (10)
- config.yaml, workflow.yaml, .cursorrules, context files, output folder, templates, agents/, workflows/, tasks/, bmad/

---

## 📊 אורכים מומלצים

**זמן קריאה:** 30 דקות
**מילים:** כ-4000 מילים
**מונחים:** 60-80 מונחים מוגדרים
**אקורדיונים:** 6-8 סקשנים עיקריים

---

## ✅ Checklist לפני יצירה

- [ ] קראתי מדריכים קיימים לאיסוף מונחים
- [ ] רשמתי רשימה של כל המונחים
- [ ] קיבצתי לקטגוריות
- [ ] כתבתי הגדרות ברורות
- [ ] הוספתי דוגמאות לכל מונח מורכב
- [ ] הוספתי קישורים למדריכים רלוונטיים

---

## 💡 טיפים נוספים

### איך לאסוף מונחים:
1. עבור על כל המדריכים הקיימים
2. רשום כל מונח טכני
3. בדוק מונחים חוזרים
4. קבץ לקטגוריות

### איך לכתוב הגדרה טובה:
1. התחל עם "מה זה"
2. הסבר בפשטות
3. הוסף דוגמה
4. קשר למדריכים אחרים

### איך לארגן:
1. מושגי יסוד ראשונים
2. אגנטים ווורקפלואים אחר כך
3. מונחי ניהול וטכניים
4. קיצורים בסוף

---

## 🚀 מוכנים ליצור!

זהו המדריך החשוב ביותר במערכת!

**למה?**
- כל מדריך אחר מפנה למילון
- מי שלא מבין מונח - יבוא לכאן
- זה המסמך הראשון של מתחילים

**תעשו עבודה טובה!** 💪

---

**תאריך יצירה:** 8 נובמבר 2025
**תאריך עדכון:** -
**גרסה:** 1.0
**יוצר:** Content Team
**מאשר:** -

