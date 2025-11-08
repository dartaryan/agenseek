# 📚 Tech Writer - פרומפט מוכן לשימוש

## הפעלת Tech Writer

העתק והדבק את הפרומפט הבא בצ'אט עם Cursor:

---

## 🎯 פרומפט מלא (העתק מכאן למטה)

```
@tech-writer.mdc

שלום Paige! 👋

אני Ben, ואני צריך את העזרה המקצועית שלך ליצירת סדרה של מדריכי למידה טכניים עבור פלטפורמת BMAD Learning Hub (Agenseek).

## 📋 רקע על הפרויקט

**Agenseek** הוא פלטפורמת למידה עבור BMAD-METHOD - מתודולוגיה לפיתוח תוכנה מבוססת AI. הפלטפורמה כוללת:
- מערכת רינדור תוכן מתקדמת עם 14 סוגי בלוקים
- ספריית מדריכים דינמית
- מעקב התקדמות ואתגרים
- מרחב לימוד אישי
- תמיכה מלאה בעברית (RTL)

## 🎯 המשימה שלך

אני צריך שתיצרי מדריכי למידה בפורמט JSON מובנה. יש לי 42 מדריכים שצריך ליצור, מחולקים ל-7 קטגוריות.

### 📖 קבצי ההנחיות (קראי אותם תחילה!)

**קובץ 1: הפרומפט המלא לסוכנים**
`content-stories/FOR-AI-AGENTS.md`
→ זה המדריך המלא שלך! כולל:
- מבנה JSON מדויק
- כל 14 סוגי הבלוקים
- דוגמאות קוד
- חוקי כתיבה בעברית
- validation checklist

**קובץ 2: רשימת כל הסטוריז**
`content-stories/stories/INDEX.md`
→ רשימה מלאה של כל 42 המדריכים

**קובץ 3: דוגמה מוצלחת**
`src/content/locale/he/guides/core/quick-start.json`
→ מדריך מוכן שעובד מצוין - השתמשי בו כרפרנס!

**קובץ 4: קובץ האינדקס הראשי**
`src/content/locale/he/guides/index.json`
→ כל מדריך חדש צריך להתווסף לכאן

**קובץ 5: הגדרות הטייפים**
`src/types/content-blocks.ts`
→ TypeScript types לכל סוגי הבלוקים

## 📝 הפורמט הנדרש

### מבנה קובץ JSON:

```json
{
  "metadata": {
    "title": "כותרת בעברית",
    "description": "תיאור קצר (2-3 שורות)",
    "category": "core | onboarding | roles | workflows | testarch | integration | resources",
    "difficulty": "beginner | intermediate | advanced",
    "estimatedMinutes": 15,
    "icon": "IconName",
    "tags": ["תג1", "תג2", "תג3"],
    "author": "BMAD Team",
    "lastUpdated": "2024-01-15",
    "version": "1.0"
  },
  "tableOfContents": [
    {
      "id": "section-1",
      "title": "כותרת סקשן",
      "level": 2,
      "children": []
    }
  ],
  "content": [
    // בלוקים מסוג heading, text, list, code, callout, וכו'
  ],
  "relatedGuides": [
    "guide-id-1",
    "guide-id-2"
  ],
  "prerequisites": [
    "prerequisite-guide-id"
  ],
  "nextSteps": [
    "next-guide-id"
  ]
}
```

### 14 סוגי הבלוקים הזמינים:

1. **heading** - כותרות (h1-h6)
2. **text** - פסקאות טקסט (markdown inline)
3. **list** - רשימות (ordered/unordered)
4. **code** - קוד עם syntax highlighting
5. **callout** - הדגשות (info/warning/success/error)
6. **table** - טבלאות
7. **accordion** - תוכן מתקפל
8. **tabs** - טאבים
9. **chart** - גרפים
10. **grid** - רשתות
11. **card** - כרטיסים
12. **image** - תמונות
13. **video** - סרטונים
14. **divider** - מפרידים

## 🎨 סגנון הכתיבה

### עברית:
- ✅ עברית שוטפת ומקצועית (לא תרגום מילולי)
- ✅ משפטים קצרים וברורים
- ✅ הסברים מעשיים עם דוגמאות
- ✅ טון ידידותי אך מקצועי
- ❌ לא אמוג'י! רק Tabler Icons
- ❌ לא סלנג או אנגלית מיותרת

### מבנה:
- התחל עם סקירה כללית
- חלק למקטעים לוגיים
- הוסף דוגמאות קוד רלוונטיות
- סיים עם Next Steps

### תמיכה ב-Markdown (TextBlock):
- ✅ **חובה:** הוסף `"markdown": true` לבלוק טקסט כדי לאפשר עיצוב
- ✅ השתמש ב-`**bold**` להדגשות חשובות
- ✅ השתמש ב-`*italic*` לדגשים משניים
- ✅ השתמש ב-`` `code` `` לקוד inline
- ✅ השתמש ב-`[טקסט](url)` לקישורים
- ✅ **קריטי:** השתמש ב-`\n\n` להפרדת פסקאות בתוך בלוק אחד
- ❌ אל תפצל לבלוקי text נפרדים - השתמש ב-`\n\n` במקום

## 🚀 איך להתחיל?

### אופציה 1: מדריך בודד (מומלץ להתחלה)

"Paige, צרי את המדריך הראשון:
**core/glossary** - מילון מונחים של BMAD

קראי את:
1. content-stories/FOR-AI-AGENTS.md
2. content-stories/stories/core/glossary.md
3. src/content/locale/he/guides/core/quick-start.json

שמרי ב: src/content/locale/he/guides/core/glossary.json
עדכני את: src/content/locale/he/guides/index.json"

### אופציה 2: קטגוריה שלמה

"Paige, צרי את כל מדריכי קטגוריית CORE (7 מדריכים):
1. glossary
2. bmad-overview
3. architecture
4. getting-started
5. troubleshooting
6. faq
7. changelog"

### אופציה 3: מצב ייצור המוני

"Paige, בואי נעבוד בשיטה:
1. אני אספק לך את פרטי המדריך הבא
2. את תיצרי אותו לפי הפורמט
3. נבדוק יחד
4. ממשיכים להבא

מוכנה? בואי נתחיל עם core/glossary"

## ✅ Checklist לפני שליחת כל מדריך

- [ ] הקובץ הוא JSON תקין (valid JSON)
- [ ] כל הבלוקים עם `id` ייחודי
- [ ] כל הכותרות עם `anchor` ל-TOC
- [ ] הטקסט בעברית שוטפת
- [ ] אין emojis, רק Tabler Icons
- [ ] יש 3-5 callouts רלוונטיים
- [ ] יש לפחות דוגמת קוד אחת
- [ ] הקובץ נשמר ב: src/content/locale/he/guides/{category}/{id}.json
- [ ] המדריך נוסף ל: src/content/locale/he/guides/index.json

## 🎯 המדריך הראשון - core/glossary

אם את מוכנה, בואי נתחיל עם המדריך הראשון:

**קראי:**
- content-stories/stories/core/glossary.md (הסטורי המלא)

**צרי:**
- src/content/locale/he/guides/core/glossary.json

**התוכן:**
מילון מונחים מקיף של BMAD-METHOD עם:
- 20-25 מונחים מרכזיים
- הסבר לכל מונח בעברית ברורה
- דוגמאות שימוש
- קישורים למדריכים רלוונטיים
- חיפוש מהיר (accordion או tabs)

---

**Paige, את מוכנה להתחיל?** 🚀📚

מה את אומרת - נתחיל עם glossary או שיש לך שאלות?
```

---

## 📌 הערות שימוש

### מה לעשות אחרי שליחת הפרומפט:

1. **Tech Writer תיכנס למצב פעולה** - היא תקרא את הקבצים הרלוונטיים
2. **היא תשאל שאלות הבהרה** אם צריך
3. **היא תתחיל ליצור את המדריך** בפורמט JSON
4. **בדוק את הפלט** - וודא שהוא תואם את הדרישות

### אם משהו לא עובד:

**בעיה:** "הקובץ לא בפורמט הנכון"
**פתרון:** תראה לה את `src/content/locale/he/guides/core/quick-start.json` שוב

**בעיה:** "יש לי שאלות על BMAD"
**פתרון:** תפנה אותה ל-`original-data/specs-orig/` או תסביר בעצמך

**בעיה:** "אני לא בטוחה איך לכתוב את החלק הזה"
**פתרון:** תן לה דוגמה ספציפית או תבקש גרסה ראשונית

---

## 🎨 טיפים לעבודה יעילה

### 1. התחל קטן
צור מדריך אחד, תבדוק שהוא עובד, ואז המשך

### 2. השתמש בדוגמאות
quick-start.json הוא הדוגמה הטובה ביותר!

### 3. בדוק כל מדריך
אחרי שכל מדריך נוצר, תבדוק אותו באפליקציה

### 4. תקן לפי הצורך
אם משהו לא עובד, תתקן ותמשיך

### 5. שמור עקביות
כל המדריכים צריכים להרגיש אותו הדבר

---

## 🎯 סדר מומלץ ליצירת המדריכים

### Phase 1: Core (7 מדריכים)
הכי חשוב! תשתית בסיסית

### Phase 2: Onboarding (6 מדריכים)
למשתמשים חדשים

### Phase 3: Roles (7 מדריכים)
לתפקידים שונים

### Phase 4: Workflows (14 מדריכים)
תהליכי עבודה

### Phase 5: Test Architecture (4 מדריכים)
בדיקות

### Phase 6: Integration (2 מדריכים)
אינטגרציות

### Phase 7: Resources (2 מדריכים)
משאבים נוספים

---

---

## 🔄 מערכת מעקב התקדמות (חדש!)

**תאריך עדכון:** 8 נובמבר 2025

### 📊 סטטוס נוכחי: 7/47 מדריכים (15%)

**מה השתנה:**
- הוספתי מערכת מעקב אוטומטית
- כל סוכן שיוצר מדריך יידע מה הבא
- הקובץ `GUIDES-PROGRESS-TRACKER.md` עוקב אחר הכל

### איך זה עובד:

#### 1. **לפני שיצירת מדריך חדש:**
```
קרא את: content-stories/GUIDES-PROGRESS-TRACKER.md
```

הקובץ הזה מכיל:
- ✅ רשימה של כל המדריכים שכבר הושלמו
- ⏳ רשימה של מדריכים שצריך ליצור
- 🎯 **המדריך הבא בסדר עדיפות**
- 📊 סטטיסטיקות והתקדמות

#### 2. **צור את המדריך הבא:**
הטראקר מציין מה המדריך הבא לפי עדיפות (P0 → P1 → P2)

**כרגע המדריך הבא הוא:**
`role-product-managers` (מנהלי מוצר)

#### 3. **אחרי יצירת מדריך:**
עדכן את הטראקר:
- שנה את הסטטוס מ-⏳ ל-✅
- עדכן את הסטטיסטיקות
- סמן את המדריך הבא

### דוגמה מלאה:

```
## צעד 1: בדוק מה הבא
קרא: GUIDES-PROGRESS-TRACKER.md
→ רואה: "המדריך הבא: role-product-managers"

## צעד 2: קרא את הקבצים
1. content-stories/FOR-AI-AGENTS.md
2. content-stories/stories/roles/product-managers.md
3. src/content/locale/he/guides/roles/developers.json (דוגמה)

## צעד 3: צור את המדריך
src/content/locale/he/guides/roles/product-managers.json

## צעד 4: עדכן index.json
הוסף את המטא-דאטה של המדריך החדש

## צעד 5: עדכן את הטראקר
GUIDES-PROGRESS-TRACKER.md:
- שנה role-product-managers מ-⏳ ל-✅
- עדכן סטטיסטיקות (8/47 - 17%)
- סמן את המדריך הבא: role-architects
```

### יתרונות המערכת החדשה:

✅ **אין בלבול** - תמיד יודעים מה הבא
✅ **מעקב ברור** - רואים את ההתקדמות
✅ **עבודה צוותית** - כמה סוכנים יכולים לעבוד במקביל
✅ **סדר עדיפויות** - מתמקדים בחשוב ביותר

---

## 📝 הוראות לסוכן הבא

**אם אתה Tech Writer שמתחיל עבודה:**

1. **קרא תחילה:** `GUIDES-PROGRESS-TRACKER.md`
2. **זהה את המדריך הבא** (מסומן ב-🎯)
3. **עקוב אחר התהליך הרגיל** (7 צעדים)
4. **עדכן את הטראקר** בסוף
5. **המשך למדריך הבא!**

---

