# 🧱 רשימת בלוקים זמינים - מדריך מלא

**תאריך:** 8 נובמבר 2025
**מטרה:** רשימה מפורטת של כל 14 הבלוקים הזמינים במערכת

---

## 📋 רשימת הבלוקים

| # | שם הבלוק | שם באנגלית | כשלהשתמש |
|---|----------|------------|----------|
| 1 | כותרת | Heading | כותרות סקשנים (H1-H6) |
| 2 | טקסט | Text | פסקאות טקסט רגילות |
| 3 | רשימה | List | רשימות ממוספרות או bulleted |
| 4 | קוד | Code | דוגמאות קוד עם syntax highlighting |
| 5 | קאלאאוט | Callout | מידע חשוב, אזהרות, טיפים |
| 6 | טבלה | Table | נתונים טבלאיים |
| 7 | אקורדיון | Accordion | תוכן שניתן לקפל/לפתוח |
| 8 | טאבים | Tabs | תוכן מחולק לטאבים |
| 9 | גרף | Chart | ויזואליזציות נתונים |
| 10 | רשת | Grid | סידור תוכן ברשת |
| 11 | כרטיס | Card | קופסת מידע מעוצבת |
| 12 | תמונה | Image | תמונות |
| 13 | וידאו | Video | סרטוני הדרכה |
| 14 | מפריד | Divider | קו הפרדה בין סקשנים |

---

## 1️⃣ Heading (כותרת)

### מתי להשתמש:
- כותרות ראשיות (H1) - רק אחת למדריך
- כותרות סקשנים (H2)
- כותרות תת-סקשנים (H3-H6)

### מבנה:
```json
{
  "type": "heading",
  "level": 2,                    // 1-6 (H1-H6)
  "text": "כותרת הסקשן",
  "id": "unique-section-id"      // חובה! לטובת ToC
}
```

### פרמטרים:
- `type`: **"heading"** (חובה)
- `level`: **1-6** (חובה) - רמת הכותרת
- `text`: **string** (חובה) - הטקסט של הכותרת
- `id`: **string** (חובה) - מזהה ייחודי לטובת ToC וקישורים

### דוגמה:
```json
{
  "type": "heading",
  "level": 2,
  "text": "איך להתקין את BMAD?",
  "id": "installation-guide"
}
```

### טיפים:
- ✅ השתמש ב-H1 רק לכותרת הראשית
- ✅ H2 לסקשנים עיקריים
- ✅ H3 לתת-סקשנים
- ✅ אל תדלג רמות (H2 → H4)
- ✅ id חייב להיות ייחודי
- ✅ id בשפה אנגלית (למשל: "intro", "setup")

---

## 2️⃣ Text (טקסט)

### מתי להשתמש:
- פסקאות טקסט רגילות
- הסברים
- תיאורים

### מבנה:
```json
{
  "type": "text",
  "content": "טקסט עם **bold** ו-*italic* ו-`code`\n\nפסקה נוספת",
  "markdown": true,              // אופציונלי - תמיכה במארקדאון
  "alignment": "left"            // אופציונלי - left/center/right
}
```

### פרמטרים:
- `type`: **"text"** (חובה)
- `content`: **string** (חובה) - תוכן הפסקה
- `markdown`: **boolean** (אופציונלי, ברירת מחדל: false) - תמיכה במארקדאון inline
- `alignment`: **"left"|"center"|"right"** (אופציונלי, ברירת מחדל: left)

### תמיכה במארקדאון (כש-markdown: true):
- `**bold**` → **מודגש**
- `*italic*` → *נטוי*
- `` `code` `` → `קוד`
- `[link](url)` → [קישור](url)
- `\n\n` → הפרדת פסקאות (line breaks)

### דוגמה - עם markdown:
```json
{
  "type": "text",
  "markdown": true,
  "content": "**הגדרה:** BMAD הוא מערכת ניהול פרויקטים המבוססת על אגנטים.\n\n**דוגמה:** הוא מאפשר לכם לעבוד עם *אגנטים מקצועיים* שמבינים את התפקיד שלכם.\n\n**ראו גם:** מדריך התחלה מהירה"
}
```

### טיפים:
- ✅ פסקאות קצרות (3-5 משפטים)
- ✅ משפטים קצרים (10-20 מילים)
- ✅ השתמש ב-`markdown: true` + `\n\n` להפרדת פסקאות
- ✅ השתמש במארקדאון להדגשות: `**bold**`, `*italic*`, `` `code` ``
- ❌ אל תכתוב פסקאות ארוכות (>8 שורות)

---

## 3️⃣ List (רשימה)

### מתי להשתמש:
- צעדים
- נקודות עיקריות
- רשימות פריטים

### מבנה:
```json
{
  "type": "list",
  "variant": "ordered",          // "ordered" או "unordered"
  "items": [
    {
      "content": "פריט ראשון"
    },
    {
      "content": "פריט שני",
      "children": [                // תת-רשימה (אופציונלי)
        { "content": "תת-פריט 1" },
        { "content": "תת-פריט 2" }
      ]
    }
  ]
}
```

### פרמטרים:
- `type`: **"list"** (חובה)
- `variant`: **"ordered"|"unordered"** (חובה)
  - `ordered` - רשימה ממוספרת (1, 2, 3...)
  - `unordered` - רשימה עם bullets (•)
- `items`: **array** (חובה) - מערך של פריטים
  - כל פריט יכול להכיל `children` לתת-רשימה

### דוגמה - רשימה ממוספרת:
```json
{
  "type": "list",
  "variant": "ordered",
  "items": [
    { "content": "התקן את BMAD" },
    { "content": "הפעל את האגנט" },
    { "content": "הרץ workflow" }
  ]
}
```

### דוגמה - רשימה עם תת-רשימה:
```json
{
  "type": "list",
  "variant": "unordered",
  "items": [
    { "content": "אגנטי פיתוח" },
    {
      "content": "אגנטי ניהול",
      "children": [
        { "content": "PM (Product Manager)" },
        { "content": "SM (Scrum Master)" }
      ]
    }
  ]
}
```

### טיפים:
- ✅ `ordered` לצעדים ברצף
- ✅ `unordered` לנקודות שאין סדר מסויים
- ✅ תת-רשימות עד 2 רמות בלבד
- ❌ אל תעשה תת-רשימות עמוקות מדי

---

## 4️⃣ Code (קוד)

### מתי להשתמש:
- דוגמאות קוד
- פקודות terminal
- קונפיגורציה

### מבנה:
```json
{
  "type": "code",
  "language": "typescript",      // שפת התכנות
  "code": "const x = 5;",        // הקוד עצמו
  "filename": "example.ts",      // אופציונלי - שם הקובץ
  "showLineNumbers": true,       // אופציונלי - מספרי שורות
  "highlightedLines": [1, 3]     // אופציונלי - שורות מודגשות
}
```

### פרמטרים:
- `type`: **"code"** (חובה)
- `language`: **string** (חובה) - שפת הקוד
- `code`: **string** (חובה) - הקוד עצמו
- `filename`: **string** (אופציונלי) - שם הקובץ
- `showLineNumbers`: **boolean** (אופציונלי, ברירת מחדל: true)
- `highlightedLines`: **number[]** (אופציונלי) - שורות להדגשה

### שפות נתמכות:
- `typescript`, `javascript`, `tsx`, `jsx`
- `python`, `java`, `csharp`, `go`, `rust`
- `bash`, `shell`, `powershell`
- `json`, `yaml`, `xml`, `markdown`
- `sql`, `html`, `css`, `scss`
- עוד 10+ שפות...

### דוגמה - TypeScript:
```json
{
  "type": "code",
  "language": "typescript",
  "code": "// יצירת אגנט חדש\nconst agent = new Agent({\n  name: 'MyAgent',\n  role: 'developer'\n});",
  "filename": "agent.ts",
  "showLineNumbers": true
}
```

### דוגמה - Bash:
```json
{
  "type": "code",
  "language": "bash",
  "code": "# התקנת BMAD\nnpm install -g bmad-method\n\n# הרצת workflow\nbmad run product-brief",
  "showLineNumbers": false
}
```

### טיפים:
- ✅ תמיד ציין `language` נכון
- ✅ הוסף comments בעברית לקוד
- ✅ הוסף `filename` לבהירות
- ✅ השתמש ב-`highlightedLines` להדגשת שורות חשובות
- ✅ קוד חייב להיות תקין (לא סתם דוגמה)

---

## 5️⃣ Callout (קאלאאוט)

### מתי להשתמש:
- מידע חשוב
- אזהרות
- טיפים
- שגיאות נפוצות

### מבנה:
```json
{
  "type": "callout",
  "variant": "info",             // info, warning, success, error
  "title": "כותרת",             // אופציונלי
  "content": "תוכן הקאלאאוט"
}
```

### פרמטרים:
- `type`: **"callout"** (חובה)
- `variant`: **"info"|"warning"|"success"|"error"** (חובה)
- `title`: **string** (אופציונלי) - כותרת הקאלאאוט
- `content`: **string** (חובה) - תוכן הקאלאאוט

### ארבעת הסוגים:

#### 1. Info (כחול) - מידע חשוב
```json
{
  "type": "callout",
  "variant": "info",
  "title": "חשוב לדעת",
  "content": "BMAD דורש Node.js גרסה 18 ומעלה"
}
```
**כשלהשתמש:** הסברים, רקע, מידע נוסף

#### 2. Warning (צהוב/כתום) - אזהרות
```json
{
  "type": "callout",
  "variant": "warning",
  "title": "שימו לב!",
  "content": "פעולה זו תמחק את כל הנתונים. אי אפשר לבטל אותה."
}
```
**כשלהשתמש:** דברים שצריך להיזהר מהם, סיכונים

#### 3. Success (ירוק) - טיפים והצלחות
```json
{
  "type": "callout",
  "variant": "success",
  "title": "טיפ מקצועי",
  "content": "השתמש בדגל --dry-run כדי לראות מה יקרה לפני שמריצים באמת"
}
```
**כשלהשתמש:** best practices, טיפים, הצלחות

#### 4. Error (אדום) - שגיאות
```json
{
  "type": "callout",
  "variant": "error",
  "title": "שגיאה נפוצה",
  "content": "אם אתם רואים 'Module not found', וודאו שהתקנתם את התלויות"
}
```
**כשלהשתמש:** שגיאות נפוצות, מה לא לעשות

### טיפים:
- ✅ 1-3 callouts לכל מדריך
- ✅ השתמש בvariant המתאים
- ✅ תוכן קצר וממוקד
- ❌ אל תשים callout אחרי callout

---

## 6️⃣ Table (טבלה)

### מתי להשתמש:
- השוואת אפשרויות
- נתונים מובנים
- רשימת פרמטרים

### מבנה:
```json
{
  "type": "table",
  "caption": "השוואת אגנטים",  // אופציונלי
  "headers": ["אגנט", "תפקיד", "רמת מורכבות"],
  "rows": [
    ["PM", "ניהול מוצר", "בינונית"],
    ["Dev", "פיתוח", "מתקדמת"]
  ],
  "alignment": ["left", "left", "center"]  // אופציונלי
}
```

### פרמטרים:
- `type`: **"table"** (חובה)
- `caption`: **string** (אופציונלי) - כותרת הטבלה
- `headers`: **string[]** (חובה) - כותרות העמודות
- `rows`: **string[][]** (חובה) - שורות הנתונים
- `alignment`: **("left"|"center"|"right")[]** (אופציונלי) - יישור עמודות

### דוגמה:
```json
{
  "type": "table",
  "caption": "תפקידי האגנטים",
  "headers": ["אגנט", "תפקיד", "וורקפלואים עיקריים"],
  "rows": [
    ["PM", "ניהול מוצר", "product-brief, prd"],
    ["Architect", "ארכיטקטורה", "tech-spec, architecture"],
    ["Dev", "פיתוח", "dev-story, code-review"]
  ],
  "alignment": ["left", "left", "left"]
}
```

### טיפים:
- ✅ עמודות פשוטות (2-5)
- ✅ שורות קצרות (3-10)
- ✅ טקסט קצר בתאים
- ❌ אל תעשה טבלאות ענקיות

---

## 7️⃣ Accordion (אקורדיון)

### מתי להשתמש:
- שאלות ותשובות (FAQ)
- תוכן ארוך שרוצים לקפל
- מידע נוסף שלא חובה לקרוא

### מבנה:
```json
{
  "type": "accordion",
  "allowMultiple": false,        // אופציונלי - אפשר לפתוח כמה
  "items": [
    {
      "id": "item-1",              // חובה! מזהה ייחודי
      "title": "שאלה 1",
      "content": [                 // חובה! מערך של ContentBlock[]
        {
          "id": "item-1-text",
          "type": "text",
          "markdown": true,            // חשוב! אפשר markdown formatting
          "content": "תשובה 1"
        }
      ]
    },
    {
      "id": "item-2",
      "title": "שאלה 2",
      "content": [
        {
          "id": "item-2-text",
          "type": "text",
          "content": "תשובה 2"
        }
      ]
    }
  ]
}
```

### פרמטרים:
- `type`: **"accordion"** (חובה)
- `allowMultiple`: **boolean** (אופציונלי, ברירת מחדל: false)
  - `false` - רק אחד פתוח בכל פעם
  - `true` - אפשר לפתוח כמה יחד
- `items`: **array** (חובה) - מערך של פריטים
  - `id`: מזהה ייחודי (חובה!)
  - `title`: כותרת הפריט (מה שרואים כשזה סגור)
  - `content`: **ContentBlock[]** (חובה!) - מערך של בלוקים, לא string!

### דוגמה - FAQ:
```json
{
  "type": "accordion",
  "allowMultiple": true,
  "items": [
    {
      "id": "faq-1",
      "title": "מה זה BMAD?",
      "content": [
        {
          "id": "faq-1-text",
          "type": "text",
          "markdown": true,
          "content": "BMAD הוא מערכת ניהול פרויקטים המבוססת על אגנטים..."
        }
      ]
    },
    {
      "id": "faq-2",
      "title": "איך מתקינים?",
      "content": [
        {
          "id": "faq-2-text",
          "type": "text",
          "markdown": true,
          "content": "ההתקנה מתבצעת ב-3 צעדים פשוטים..."
        }
      ]
    },
    {
      "id": "faq-3",
      "title": "מה זה אגנט?",
      "content": [
        {
          "id": "faq-3-text",
          "type": "text",
          "markdown": true,
          "content": "אגנט הוא מומחה וירטואלי שיודע תחום מסויים..."
        }
      ]
    }
  ]
}
```

### טיפים:
- ✅ מצוין ל-FAQ ומילוני מונחים
- ✅ 3-7 פריטים באקורדיון (או יותר במילונים)
- ✅ כותרות קצרות ומפתות
- ✅ **חשוב:** הוסף `markdown: true` לכל text block כדי לאפשר **bold** ו*italic*
- ✅ **חשוב:** השתמש ב-`\n\n` להפרדת פסקאות בתוך text block אחד
- ✅ TextBlock תומך ב: `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `\n\n` (paragraph breaks)
- ❌ אל תשים אקורדיון בתוך אקורדיון
- ❌ אל תפצל לבלוקי text נפרדים - השתמש ב-`\n\n` במקום

---

## 8️⃣ Tabs (טאבים)

### מתי להשתמש:
- תוכן שונה לפי תפקיד
- חלופות שונות (למשל: Mac vs Windows)
- קטגוריות שונות של מידע

### מבנה:
```json
{
  "type": "tabs",
  "defaultTab": "developers",    // איזה טאב פתוח בברירת מחדל
  "items": [
    {
      "id": "developers",
      "label": "למפתחים",
      "content": "תוכן למפתחים..."
    },
    {
      "id": "pms",
      "label": "למנהלי מוצר",
      "content": "תוכן למנהלי מוצר..."
    }
  ]
}
```

### פרמטרים:
- `type`: **"tabs"** (חובה)
- `defaultTab`: **string** (חובה) - id של הטאב שפתוח בברירת מחדל
- `items`: **array** (חובה) - מערך של טאבים
  - `id`: מזהה ייחודי
  - `label`: הכותרת של הטאב
  - `content`: התוכן של הטאב

### דוגמה - לפי תפקיד:
```json
{
  "type": "tabs",
  "defaultTab": "dev",
  "items": [
    {
      "id": "dev",
      "label": "מפתח",
      "content": "כמפתח, תשתמש באגנט Dev ל..."
    },
    {
      "id": "pm",
      "label": "מנהל מוצר",
      "content": "כמנהל מוצר, תשתמש באגנט PM ל..."
    },
    {
      "id": "designer",
      "label": "מעצב UX",
      "content": "כמעצב, תשתמש באגנט UX Designer ל..."
    }
  ]
}
```

### טיפים:
- ✅ 2-5 טאבים
- ✅ כותרות קצרות
- ✅ תוכן בסדר דומה בכל טאב
- ❌ אל תעשה טאבים עמוקים

---

## 9️⃣ Chart (גרף)

### מתי להשתמש:
- סטטיסטיקות
- נתונים ויזואליים
- השוואות

### מבנה:
```json
{
  "type": "chart",
  "chartType": "bar",            // line, bar, area, pie
  "title": "כותרת הגרף",
  "data": [
    { "name": "ינואר", "value": 100 },
    { "name": "פברואר", "value": 150 }
  ],
  "xKey": "name",                // מפתח לציר X
  "yKey": "value"                // מפתח לציר Y
}
```

### פרמטרים:
- `type`: **"chart"** (חובה)
- `chartType`: **"line"|"bar"|"area"|"pie"** (חובה)
- `title`: **string** (אופציונלי) - כותרת הגרף
- `data`: **array** (חובה) - נקודות הנתונים
- `xKey`: **string** (חובה) - שם המפתח לציר X
- `yKey`: **string** (חובה) - שם המפתח לציר Y

### דוגמה - גרף עמודות:
```json
{
  "type": "chart",
  "chartType": "bar",
  "title": "שימוש באגנטים",
  "data": [
    { "agent": "PM", "uses": 45 },
    { "agent": "Dev", "uses": 78 },
    { "agent": "Architect", "uses": 23 }
  ],
  "xKey": "agent",
  "yKey": "uses"
}
```

### טיפים:
- ✅ השתמש רק אם באמת צריך ויזואליזציה
- ✅ נתונים ברורים
- ❌ אל תשים גרפים מסובכים

---

## 🔟 Grid (רשת)

### מתי להשתמש:
- סידור כרטיסים במקביל
- השוואת מספר פריטים
- תצוגה ויזואלית

### מבנה:
```json
{
  "type": "grid",
  "columns": 2,                  // 1-4 עמודות
  "gap": "md",                   // sm, md, lg
  "items": [
    { "type": "card", "title": "כרטיס 1", "content": "..." },
    { "type": "card", "title": "כרטיס 2", "content": "..." }
  ]
}
```

### פרמטרים:
- `type`: **"grid"** (חובה)
- `columns`: **1-4** (חובה) - מספר העמודות
- `gap`: **"sm"|"md"|"lg"** (אופציונלי, ברירת מחדל: md)
- `items`: **ContentBlock[]** (חובה) - מערך של בלוקים

### דוגמה:
```json
{
  "type": "grid",
  "columns": 3,
  "gap": "md",
  "items": [
    {
      "type": "card",
      "icon": "IconRocket",
      "title": "מהיר",
      "content": "התחילו תוך דקות"
    },
    {
      "type": "card",
      "icon": "IconShield",
      "title": "בטוח",
      "content": "אבטחה מובנית"
    },
    {
      "type": "card",
      "icon": "IconHeart",
      "title": "קל לשימוש",
      "content": "ממשק אינטואיטיבי"
    }
  ]
}
```

### טיפים:
- ✅ 2-4 עמודות
- ✅ פריטים בגודל דומה
- ❌ אל תשים יותר מ-9 פריטים

---

## 1️⃣1️⃣ Card (כרטיס)

### מתי להשתמש:
- הדגשת מידע
- קופסאות מידע מעוצבות
- בתוך Grid

### מבנה:
```json
{
  "type": "card",
  "variant": "default",          // default, elevated, outlined
  "icon": "IconRocket",          // אופציונלי - Tabler Icon
  "title": "כותרת",
  "content": "תוכן הכרטיס",
  "footer": "פוטר"              // אופציונלי
}
```

### פרמטרים:
- `type`: **"card"** (חובה)
- `variant`: **"default"|"elevated"|"outlined"** (אופציונלי)
- `icon`: **string** (אופציונלי) - שם אייקון מ-Tabler Icons
- `title`: **string** (אופציונלי) - כותרת הכרטיס
- `content`: **string** (חובה) - תוכן הכרטיס
- `footer`: **string** (אופציונלי) - פוטר

### דוגמה:
```json
{
  "type": "card",
  "variant": "elevated",
  "icon": "IconRocket",
  "title": "התחלה מהירה",
  "content": "התקינו את BMAD ב-3 דקות והתחילו לעבוד מיד",
  "footer": "זמן התקנה: 3 דקות"
}
```

### טיפים:
- ✅ כותרות קצרות
- ✅ תוכן ממוקד
- ✅ השתמש באייקונים רלוונטיים

---

## 1️⃣2️⃣ Image (תמונה)

### מתי להשתמש:
- צילומי מסך
- דיאגרמות
- ממשקים

### מבנה:
```json
{
  "type": "image",
  "src": "/images/screenshot.png",
  "alt": "תיאור התמונה",
  "caption": "צילום מסך של...",  // אופציונלי
  "width": 800,                   // אופציונלי
  "height": 600                   // אופציונלי
}
```

### פרמטרים:
- `type`: **"image"** (חובה)
- `src`: **string** (חובה) - נתיב לתמונה
- `alt`: **string** (חובה) - תיאור לנגישות
- `caption`: **string** (אופציונלי) - כיתוב מתחת לתמונה
- `width`: **number** (אופציונלי) - רוחב בפיקסלים
- `height`: **number** (אופציונלי) - גובה בפיקסלים

### טיפים:
- ✅ תמיד ציין `alt` לנגישות
- ✅ השתמש בתמונות איכותיות
- ✅ הוסף `caption` להסבר

---

## 1️⃣3️⃣ Video (וידאו)

### מתי להשתמש:
- הדרכות וידאו
- דמואים

### מבנה:
```json
{
  "type": "video",
  "url": "https://youtube.com/...",
  "title": "כותרת הוידאו",
  "aspectRatio": "16:9"           // או "4:3"
}
```

### פרמטרים:
- `type`: **"video"** (חובה)
- `url`: **string** (חובה) - קישור לוידאו
- `title`: **string** (אופציונלי) - כותרת
- `aspectRatio`: **"16:9"|"4:3"** (אופציונלי, ברירת מחדל: 16:9)

---

## 1️⃣4️⃣ Divider (מפריד)

### מתי להשתמש:
- הפרדה בין סקשנים
- חלוקה ויזואלית

### מבנה:
```json
{
  "type": "divider",
  "variant": "solid"              // solid, dashed, dotted
}
```

### פרמטרים:
- `type`: **"divider"** (חובה)
- `variant`: **"solid"|"dashed"|"dotted"** (אופציונלי, ברירת מחדל: solid)

### טיפים:
- ✅ השתמש בסוף מבוא, לפני גוף
- ✅ הפרד בין סקשנים גדולים
- ❌ אל תשים יותר מדי מפרידים

---

## 🎨 שילובים מומלצים

### 1. מבנה בסיסי למדריך
```
Heading (H1) - כותרת
Callout (info) - תקציר
Divider
Heading (H2) - מבוא
Text - פסקת מבוא
```

### 2. הסבר צעד-אחר-צעד
```
Heading (H2) - שם הצעד
Text - הסבר
Code - דוגמה
Callout (success) - טיפ
List (ordered) - שלבים
```

### 3. FAQ
```
Heading (H2) - שאלות נפוצות
Accordion - רשימת שאלות ותשובות
```

### 4. השוואה
```
Heading (H2) - השוואה
Table - טבלת השוואה
או
Grid - כרטיסי השוואה
```

---

## ✅ Checklist - בדיקה לפני שמירה

- [ ] כל הבלוקים מהרשימה הזו
- [ ] `type` נכון לכל בלוק
- [ ] כל השדות החובה קיימים
- [ ] ערכים תקינים (למשל: level: 1-6)
- [ ] לא המצאתי בלוקים חדשים
- [ ] לא שניתי את המבנה

---

**זהו! אלו כל 14 הבלוקים. השתמש בהם בחוכמה! 🎯**

---

**תאריך:** 8 נובמבר 2025
**גרסה:** 1.0
**סטטוס:** פעיל ✅

