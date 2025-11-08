# 📚 דוגמאות פרומפטים למדריכים ספציפיים

## 🎯 למדריך Glossary (מילון מונחים)

```
@tech-writer.mdc 

Paige, צרי מדריך: **core/glossary** - מילון מונחים של BMAD

**קראי:**
- content-stories/FOR-AI-AGENTS.md
- content-stories/stories/core/glossary.md
- src/content/locale/he/guides/core/quick-start.json (דוגמה)

**תוכן:**
מילון של 20-25 מונחים מרכזיים ב-BMAD-METHOD:
- Agent, Workflow, Task, Persona, Memory
- BMM, BMad Master, Validation, Epic, Story
- Context, Prompt, Tool, Activation, Module

**סגנון:**
- כל מונח: כותרת + הסבר 2-3 שורות
- דוגמת שימוש בקוד
- קישור למדריך מורחב
- השתמשי ב-Accordion (מונח לחיצה = הסבר)

**שמרי ב:** src/content/locale/he/guides/core/glossary.json
**עדכני:** src/content/locale/he/guides/index.json

בואי! 🎯
```

---

## 🚀 למדריך BMAD Overview

```
@tech-writer.mdc 

Paige, צרי: **core/bmad-overview** - סקירה כללית על BMAD-METHOD

**קראי:**
- content-stories/stories/core/bmad-overview.md
- original-data/specs-orig/bmad-intro.md

**תוכן:**
1. מה זה BMAD? (2-3 פסקאות)
2. למה להשתמש ב-BMAD? (5-7 יתרונות)
3. רכיבים מרכזיים (Agents, Workflows, Tasks)
4. מקרי שימוש (3-4 דוגמאות)
5. תהליך עבודה טיפוסי

**בלוקים:**
- Callout עם "למי זה מתאים?"
- Grid עם 4 רכיבים מרכזיים
- Code example של workflow פשוט
- Chart של תהליך העבודה

**שמרי ב:** src/content/locale/he/guides/core/bmad-overview.json

מוכנה? 🚀
```

---

## 🏗️ למדריך Architecture

```
@tech-writer.mdc 

Paige, צרי: **core/architecture** - ארכיטקטורה של BMAD

**קראי:**
- content-stories/stories/core/architecture.md
- bmad/core/README.md

**תוכן:**
1. סקירה ארכיטקטונית (High-level)
2. Core Module (bmad/core/)
3. BMM Module (bmad/bmm/)
4. תהליך הרצת Workflow
5. ניהול Memory ו-Context
6. קבצי Config

**בלוקים:**
- Chart של ארכיטקטורה (hierarchy)
- Tabs עם Core/BMM
- Code examples של config.yaml
- Accordion עם פירוט כל מודול

**שמרי ב:** src/content/locale/he/guides/core/architecture.json

בואי! 🏗️
```

---

## 🎓 למדריך Onboarding Day 1

```
@tech-writer.mdc 

Paige, צרי: **onboarding/day1** - יום ראשון עם BMAD

**קראי:**
- content-stories/stories/onboarding/day1.md
- src/content/locale/he/guides/core/quick-start.json

**תוכן:**
תכנית ליום הראשון (60-90 דקות):

**שלב 1: הכנה (15 דק')**
- התקנת BMAD
- הגדרת config.yaml
- בדיקה שהכל עובד

**שלב 2: היכרות ראשונית (20 דק')**
- הפעלת BMad Master
- היכרות עם התפריט
- הרצת Workflow ראשון

**שלב 3: תרגול (25 דק')**
- יצירת Agent פשוט
- כתיבת Workflow בסיסי
- בדיקה והרצה

**שלב 4: סיכום (10 דק')**
- מה למדנו?
- Next Steps
- משאבים נוספים

**בלוקים:**
- Callout "מה תדעו בסוף?"
- List עם checklist של משימות
- Code examples לכל שלב
- Card עם "בעיות נפוצות"

**שמרי ב:** src/content/locale/he/guides/onboarding/day1.json

מוכנה? 🎓
```

---

## 👤 למדריך Product Manager Role

```
@tech-writer.mdc 

Paige, צרי: **roles/product-managers** - BMAD למנהלי מוצר

**קראי:**
- content-stories/stories/roles/product-managers.md
- bmad/bmm/agents/pm.mdc

**תוכן:**
מדריך ייעודי למנהלי מוצר:

1. למה PM צריך BMAD? (4-5 יתרונות)
2. Workflows רלוונטיים:
   - product-brief
   - prd (Product Requirements Document)
   - create-epics-and-stories
   - sprint-planning
3. עבודה עם Agents:
   - PM Agent (John)
   - Analyst
   - UX Designer
4. מקרי שימוש:
   - כתיבת PRD מהירה
   - יצירת User Stories
   - תכנון Sprint
5. Best Practices

**בלוקים:**
- Grid עם 4 Workflows מרכזיים
- Tabs: Workflow לכל תרחיש
- Code example של PRD workflow
- Table: השוואת תרחישים

**שמרי ב:** src/content/locale/he/guides/roles/product-managers.json

בואי! 👤
```

---

## 🔄 למדריך Workflow: Product Brief

```
@tech-writer.mdc 

Paige, צרי: **workflows/product-brief** - יצירת Product Brief

**קראי:**
- content-stories/stories/workflows/product-brief.md
- bmad/bmm/workflows/product-brief/instructions.md
- bmad/bmm/workflows/product-brief/workflow.yaml

**תוכן:**
מדריך מקיף ל-Product Brief Workflow:

**חלק 1: מה זה Product Brief?**
- הגדרה
- מתי משתמשים?
- מה כולל?

**חלק 2: הרצת ה-Workflow**
```bash
@pm.mdc *product-brief
```

**חלק 3: שלבי ה-Workflow**
1. איסוף מידע ראשוני
2. הגדרת בעיה ופתרון
3. זיהוי משתמשי יעד
4. הגדרת מטרות
5. יצירת המסמך

**חלק 4: דוגמה מלאה**
תהליך יצירת Brief לפיצ'ר "Dashboard"

**חלק 5: טיפים**
- שאלות נפוצות
- בעיות ופתרונות
- Next Steps

**בלוקים:**
- Callout "מתי להשתמש?"
- Accordion עם שלבי Workflow
- Code example מלא
- Card עם דוגמה ריאלית

**שמרי ב:** src/content/locale/he/guides/workflows/product-brief.json

מוכנה? 🔄
```

---

## 🧪 למדריך Test Architecture

```
@tech-writer.mdc 

Paige, צרי: **testarch/testing-strategy** - אסטרטגיית בדיקות

**קראי:**
- content-stories/stories/testarch/testing-strategy.md
- bmad/bmm/testarch/testing-pyramid.md

**תוכן:**
מדריך לאסטרטגיית בדיקות ב-BMAD:

1. מה זה Test Architecture?
2. רמות בדיקה:
   - Unit Tests
   - Integration Tests
   - E2E Tests
   - Validation Tests
3. BMAD Testing Tools
4. Workflow: test-story
5. Best Practices

**בלוקים:**
- Chart: Testing Pyramid
- Table: סוגי בדיקות
- Tabs: דוגמאות לכל רמה
- Code: דוגמת test workflow

**שמרי ב:** src/content/locale/he/guides/testarch/testing-strategy.json

בואי! 🧪
```

---

## 🔗 למדריך Integration: Cursor

```
@tech-writer.mdc 

Paige, צרי: **integration/cursor** - אינטגרציה עם Cursor

**קראי:**
- content-stories/stories/integration/cursor.md
- .cursor/rules/bmad/index.mdc

**תוכן:**
מדריך להתקנה והגדרה של BMAD ב-Cursor:

**חלק 1: התקנה (5 דק')**
```bash
# Clone BMAD
git clone https://github.com/bmad-method/bmad
```

**חלק 2: הגדרה ב-Cursor**
1. העתק bmad/ לפרויקט
2. הוסף .cursor/rules/
3. ערוך config.yaml
4. הפעל @bmad-master

**חלק 3: שימוש יומיומי**
- קיצורי מקלדת
- פקודות נפוצות
- עבודה עם Agents

**חלק 4: Troubleshooting**

**בלוקים:**
- Callout "דרישות מוקדמות"
- List עם שלבי התקנה
- Code examples
- Accordion עם בעיות נפוצות

**שמרי ב:** src/content/locale/he/guides/integration/cursor.json

מוכנה? 🔗
```

---

## 📚 למדריך Resources: Community

```
@tech-writer.mdc 

Paige, צרי: **resources/community** - קהילת BMAD

**קראי:**
- content-stories/stories/resources/community.md

**תוכן:**
מדריך למשאבים קהילתיים:

1. ערוצי תקשורת:
   - Discord Server
   - GitHub Discussions
   - Reddit Community
   - Twitter/X

2. תרומה לפרויקט:
   - איך לתרום קוד?
   - יצירת Agents חדשים
   - כתיבת Workflows
   - דיווח באגים

3. אירועים:
   - Weekly Office Hours
   - Monthly Webinars
   - Annual Conference

4. משאבים נוספים:
   - Blog
   - YouTube
   - Newsletter

**בלוקים:**
- Grid: ערוצי תקשורת (4 cards)
- List: איך לתרום
- Table: אירועים קרובים
- Callout: "הצטרף היום!"

**שמרי ב:** src/content/locale/he/guides/resources/community.json

בואי! 📚
```

---

## 🎯 טיפים לשימוש בדוגמאות

1. **העתק והדבק** - כל דוגמה מוכנה לשימוש
2. **התאם לצורך** - שנה את הפרטים לפי המדריך הספציפי
3. **שמור עקביות** - השתמש באותו סגנון לכל המדריכים
4. **תוסיף/תפחית** - התאם את רמת הפירוט
5. **תבדוק תוצאות** - ודא שהפלט תואם את הציפיות

---

**Ben, יש לך דוגמה לכל סוג מדריך!** 🎉

פשוט בחר את המדריך שאתה רוצה, העתק את הפרומפט המתאים, ושלח ל-Tech Writer.

**רוצה שאתחיל איתך את הראשון?** 🚀

