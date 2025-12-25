# מדריך וורקפלואים - חלק 3B: הכנת ספרינט (Phase 4)

<div dir="rtl">

## 📋 תוכן עניינים

1. [מבוא להכנת ספרינט](#מבוא)
2. [sprint-planning - תכנון ומעקב](#sprint-planning)
3. [create-story - יצירת סיפור משתמש](#create-story)
4. [story-ready - סימון מוכנות](#story-ready)
5. [epic-tech-context - הקשר טכני לאפיק](#epic-tech-context)

---

## 🎯 מבוא להכנת ספרינט {#מבוא}

### מה זה Phase 4: Implementation?

Phase 4 היא שלב המימוש והפיתוח בפרויקט BMAD. לפני שמתחילים לפתח באמת, צריך להכין את הסביבה, את המעקב ואת המסמכים שידריכו את הפיתוח.

**ארבעת הוורקפלואים בחלק זה מהווים את השלב ההכנה לפני הפיתוח:**

1. **sprint-planning** - יוצר קובץ מעקב אחר כל האפיקים והסיפורים
2. **epic-tech-context** - יוצר מפרט טכני מפורט לאפיק
3. **create-story** - יוצר סיפור משתמש בודד מהאפיק
4. **story-ready** - מסמן שסיפור מוכן לפיתוח

### הסדר ההגיוני

```
1. sprint-planning → יוצר מבנה מעקב כללי
2. epic-tech-context → מפרט טכני לאפיק ראשון
3. create-story → יוצר סיפור ראשון מהאפיק
4. story-ready → מסמן שהסיפור מוכן
5. [עובר לוורקפלואי הפיתוח הבא: story-context, dev-story]
```

**חשוב:** אלו הם וורקפלואים הכנתיים. הפיתוח עצמו יתבצע בוורקפלואים שיבואו בחלק 3C.

---

## 📊 sprint-planning - תכנון ומעקב ספרינט {#sprint-planning}

**שם באנגלית:** sprint-planning  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation (Preparation)  
**סטטוס:** Required (חובה!)

### 🎯 מטרה

הוורקפלואו `sprint-planning` סורק את כל קבצי האפיקים שלכם, מחלץ את כל האפיקים והסיפורים, ויוצר קובץ מעקב מרכזי בשם `sprint-status.yaml`. זהו לב ניהול הפרויקט - כל אגנט שיעבוד על הפרויקט יקרא מקובץ זה ויעדכן אותו.

**במילים פשוטות:** זה כמו יצירת "לוח משימות" אוטומטי שמכיל את כל הסיפורים מכל האפיקים, עם סטטוס לכל אחד.

### 📥 תשומות נדרשות

לפני הרצת הוורקפלואו, וודאו שקיימים:
- ✅ קובץ אפיקים (בדרך כלל `docs/epics.md` או `docs/epic-1.md`, `docs/epic-2.md`)
- ✅ הקובץ מכיל אפיקים וסיפורים במבנה ברור (Epic 1, Story 1.1, Story 1.2...)
- ✅ תיקיית `docs/stories` קיימת (למעקב אחר סיפורים)

**אם יש לכם:**
- תיקיית `docs` עם `epic-1-context.md` - הוורקפלואו יזהה שהאפיק כבר עבר contexting
- קבצי סיפורים ב-`docs/stories` - הוורכפלואו יזהה את הסטטוס הנוכחי שלהם

### 📤 פלט צפוי

**קובץ אחד חשוב:** `docs/sprint-status.yaml`

מבנה הקובץ:
```yaml
generated: 2025-01-15
project: my-awesome-app
tracking_system: file-system
story_location: "{project-root}/docs/stories"

development_status:
  epic-1: backlog           # אפיק 1 עדיין לא עבר contexting
  1-1-user-authentication: backlog  # סיפור 1.1 עדיין לא נוצר
  1-2-password-reset: backlog
  epic-1-retrospective: optional    # רטרוספקטיבה לאפיק
  
  epic-2: contexted          # אפיק 2 כבר עבר contexting
  2-1-dashboard-layout: drafted  # סיפור 2.1 כבר נוצר
  2-2-data-display: backlog
  epic-2-retrospective: optional
```

**הסטטוסים השונים:**

**עבור אפיקים:**
- `backlog` - האפיק קיים אבל טרם עבר contexting
- `contexted` - נוצר קובץ `epic-X-context.md` (מפרט טכני)

**עבור סיפורים:**
- `backlog` - הסיפור קיים רק בקובץ האפיקים
- `drafted` - נוצר קובץ סיפור ב-`docs/stories/`
- `ready-for-dev` - הסיפור אושר ונוצר context file
- `in-progress` - מפתח עובד על הסיפור
- `review` - ממתין לבדיקת קוד
- `done` - הסיפור הושלם

### ⏱️ זמן משוער

**5-10 דקות** (תלוי במספר האפיקים והסיפורים)

הוורקפלואו מהיר מאוד - הוא סורק קבצים ויוצר YAML, ללא פיתוח.

### 🤖 אג'נט מומלץ

**Scrum Master (Bob)** - בוב הוא אג'נט ניהול הפרויקט, הוא מתמחה במעקב אחר ספרינטים וסטטוסים.

**חלופה:** BMad Master יכול להריץ את זה, אבל Bob יותר מתאים לניהול sprint.

### 📋 תהליך שלב אחר שלב

**שלב 1: חיפוש קבצי אפיקים**
```
הוורקפלואו מחפש:
- docs/epics.md (קובץ מאוחד)
- או docs/epic-1.md, docs/epic-2.md... (קבצים נפרדים)
- או docs/epics/index.md (גרסה מפוצלת)
```

**שלב 2: חילוץ מידע**
```
לכל אפיק:
  - מספר אפיק (Epic 1, Epic 2...)
  - רשימת סיפורים (Story 1.1, Story 1.2...)
  
המרה לפורמט:
  Epic 1 → epic-1
  Story 1.1: User Authentication → 1-1-user-authentication
```

**שלב 3: זיהוי סטטוס אוטומטי**
```
בדיקת אפיק:
  - אם קיים epic-1-context.md → סטטוס: contexted
  - אחרת → סטטוס: backlog

בדיקת סיפור:
  - אם קיים stories/1-1-user-authentication.md → drafted
  - אם קיים stories/1-1-user-authentication-context.md → ready-for-dev
  - אחרת → backlog
```

**שלב 4: יצירת קובץ מעקב**
```
יצירת sprint-status.yaml עם:
  - מטאדאטה (תאריך, שם פרויקט)
  - סטטוס לכל אפיק
  - סטטוס לכל סיפור
  - רשומת retrospective לכל אפיק
```

**שלב 5: דיווח**
```
הצגת סיכום:
  - כמה אפיקים נמצאו
  - כמה סיפורים בסך הכל
  - כמה אפיקים כבר contexted
  - כמה סיפורים בעבודה/הושלמו
```

### 💡 דוגמה מעשית

**תרחיש:** יש לנו פרויקט "Plant Management App" עם 2 אפיקים ו-5 סיפורים

**ביצוע:**

1. **פותחים את Bob (Scrum Master)**
   ```
   @bob - שלום! אני צריך להכין תכנון ספרינט.
   ```

2. **Bob טוען את הוורקפלואו:**
   ```
   Bob: "אטעון את workflow sprint-planning..."
   ```

3. **Bob סורק את הקבצים:**
   ```
   Bob מוצא:
   - docs/epics.md עם 2 אפיקים
   - Epic 1: 3 סיפורים
   - Epic 2: 2 סיפורים
   - סה"כ: 2 אפיקים, 5 סיפורים
   ```

4. **Bob בודק מה כבר קיים:**
   ```
   Bob מזהה:
   - epic-1-context.md קיים → Epic 1 הוא contexted
   - stories/1-1-user-login.md קיים → Story 1.1 הוא drafted
   - שאר הסיפורים → backlog
   ```

5. **Bob יוצר sprint-status.yaml:**
   ```yaml
   development_status:
     epic-1: contexted
     1-1-user-login: drafted
     1-2-user-registration: backlog
     1-3-password-reset: backlog
     epic-1-retrospective: optional
     
     epic-2: backlog
     2-1-plant-dashboard: backlog
     2-2-add-plant: backlog
     epic-2-retrospective: optional
   ```

6. **Bob מדווח:**
   ```
   ✅ Sprint Status Generated Successfully!
   
   📊 Summary:
   - Total Epics: 2
   - Total Stories: 5
   - Contexted Epics: 1
   - Drafted Stories: 1
   - Stories Done: 0
   
   📁 File created: docs/sprint-status.yaml
   
   Next steps:
   1. Review the sprint-status.yaml file
   2. Run epic-tech-context for Epic 2
   3. Start creating stories using create-story workflow
   ```

**תוצאה:**
עכשיו יש לנו מערכת מעקב מרכזית! כל פעם שנפעיל workflow אחר (כמו create-story או dev-story), האג'נטים יקראו מקובץ זה וידעו מה הסטטוס הנוכחי.

### ⚠️ מתי לא להשתמש

- ❌ **אין לכם עדיין קובץ אפיקים** - קודם צריך להריץ `prd` ו-`create-epics-and-stories`
- ❌ **אתם עובדים על Level 0 (Quick Flow)** - Level 0 משתמש ב-tech-spec ולא באפיקים
- ❌ **רוצים לעדכן סטטוס של סיפור בודד** - לזה יש workflows ייעודיים (`story-ready`, `story-done`)

### 🔗 וורקפלואים קשורים

**לפני:**
- ✅ `prd` - יצירת מסמך דרישות
- ✅ `create-epics-and-stories` - יצירת קובץ האפיקים

**אחרי:**
- ➡️ `epic-tech-context` - יצירת מפרט טכני לאפיק
- ➡️ `create-story` - יצירת סיפורים בודדים
- ➡️ `workflow-status` - בדיקת מה לעשות הלאה

### 🐛 פתרון בעיות

**בעיה 1: "Could not find epic files"**
```
פתרון:
- וודאו שיש קובץ epics.md בתיקיית docs
- או קבצים epic-1.md, epic-2.md
- שמו של הקובץ חייב להכיל "epic"
```

**בעיה 2: "All stories showing as backlog"**
```
פתרון:
זה תקין! בפעם הראשונה שמריצים sprint-planning,
כל הסיפורים יהיו backlog אם עוד לא יצרתם אותם.
```

**בעיה 3: "Sprint status not updating"**
```
פתרון:
sprint-status.yaml לא מתעדכן אוטומטית.
צריך להריץ שוב את sprint-planning כדי לרענן,
או שהאג'נטים יעדכנו ידנית בעת עבודה.
```

**בעיה 4: "Epic shows 'backlog' but I created context file"**
```
פתרון:
הקובץ חייב להיקרא בדיוק: epic-1-context.md
ולהיות בתיקיית docs (או בתיקייה שמוגדרת ב-config).
```

**בעיה 5: "Too many stories, file is huge"**
```
פתרון:
זה תקין. sprint-status.yaml יכול להיות ארוך בפרויקט גדול.
זהו קובץ מכונה (machine-readable), לא צריך לערוך אותו ידנית.
```

---

## 📝 create-story - יצירת סיפור משתמש {#create-story}

**שם באנגלית:** create-story  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation (Preparation)  
**סטטוס:** Required (חובה לכל סיפור)

### 🎯 מטרה

הוורקפלואו `create-story` לוקח **סיפור בודד** מקובץ האפיקים ויוצר עבורו **קובץ סיפור מפורט** בתיקיית `stories/`. הקובץ כולל: תיאור, קריטריוני קבלה, משימות, והקשר טכני.

**במילים פשוטות:** זה הופך "שורה אחת באפיק" לקובץ עבודה מלא שמפתח יכול לקחת ולהתחיל לעבוד עליו.

### 📥 תשומות נדרשות

לפני הרצת הוורקפלואו:
- ✅ קובץ אפיקים (`docs/epics.md` או `docs/epic-X.md`)
- ✅ מומלץ: קובץ PRD (`docs/PRD.md`) - למידע נוסף על הדרישות
- ✅ מומלץ: קובץ Architecture (`docs/architecture.md`) - להקשר טכני
- ✅ מומלץ: Epic tech context (`docs/epic-1-context.md`) - מפרט לאפיק הספציפי
- ✅ תיקיית `docs/stories` קיימת

**מה צריך לדעת לפני ההרצה:**
- מספר האפיק (Epic 1, 2, 3...)
- מספר הסיפור (Story 1.1, 1.2, 2.1...)

### 📤 פלט צפוי

**קובץ סיפור בתיקייה:** `docs/stories/[story-key].md`

דוגמה: `docs/stories/1-1-user-authentication.md`

**מבנה הקובץ:**
```markdown
# Story 1.1: User Authentication

## Story Details
- Epic: 1 - User Management
- Story: 1.1
- Priority: High
- Estimated Effort: 5 points

## User Story
As a user, I want to authenticate using email and password
so that I can securely access my account.

## Acceptance Criteria
- [ ] User can enter email and password
- [ ] System validates credentials against database
- [ ] Successful login redirects to dashboard
- [ ] Failed login shows error message
- [ ] Password must be hashed before storage

## Technical Context
- Use bcrypt for password hashing
- JWT tokens for session management
- Implement rate limiting (5 attempts per minute)

## Tasks
- [ ] Create login form component
- [ ] Implement authentication API endpoint
- [ ] Add password hashing middleware
- [ ] Write unit tests for auth logic
- [ ] Add integration tests for login flow

## Dependencies
- Database user table must exist
- JWT library configured

## Notes
This is the foundation for all user-related features.
Security is paramount - follow OWASP guidelines.
```

### ⏱️ זמן משוער

**10-20 דקות** (תלוי במורכבות הסיפור)

הוורקפלואו צריך לקרוא מספר מסמכים ולסנתז מידע, לכן זה לוקח זמן.

### 🤖 אג'נט מומלץ

**Scrum Master (Bob)** - בוב יודע לנתח דרישות, לחלק למשימות, ולכתוב קריטריוני קבלה ברורים.

**חלופה:** PM (John) יכול גם להריץ את זה, אבל Bob יותר מתמחה בפירוק למשימות טכניות.

### 📋 תהליך שלב אחר שלב

**שלב 1: זיהוי הסיפור**
```
הוורקפלואו שואל:
- איזה אפיק? (למשל: 1)
- איזה סיפור? (למשל: 1)

חילוץ מידע מהאפיקים:
- מצא את Epic 1
- מצא את Story 1.1 בתוכו
- חלץ את הכותרת והתיאור הבסיסי
```

**שלב 2: איסוף הקשר**
```
קריאת מסמכים רלוונטיים:
- PRD: מה המטרה העסקית?
- Architecture: איך המערכת בנויה?
- Epic Context: מה ההקשר הטכני לאפיק הזה?
- UX Design: אם יש עיצוב רלוונטי

הכל כדי להבין את הסיפור בהקשר רחב.
```

**שלב 3: יצירת קריטריוני קבלה**
```
ניתוח הדרישות:
- מה המשתמש צריך לעשות?
- מה המערכת צריכה לבצע?
- מה חייב לעבוד?

המרה לצ'קליסט ברור:
- [ ] קריטריון 1
- [ ] קריטריון 2
...
```

**שלב 4: פירוק למשימות**
```
חלוקת הסיפור למשימות פיתוח:
- [ ] משימה 1: Frontend component
- [ ] משימה 2: Backend API
- [ ] משימה 3: Tests
- [ ] משימה 4: Documentation

כל משימה צריכה להיות ברורה וניתנת לביצוע.
```

**שלב 5: הוספת הקשר טכני**
```
מידע שמפתח צריך לדעת:
- אילו טכנולוגיות להשתמש
- אילו ספריות רלוונטיות
- שיקולים אבטחה/ביצועים
- תלויות בקוד אחר
```

**שלב 6: שמירה ועדכון סטטוס**
```
שמירת הקובץ:
- docs/stories/1-1-user-authentication.md

עדכון סטטוס (אופציונלי):
- אם sprint-status.yaml קיים, עדכן סטטוס ל-drafted
```

### 💡 דוגמה מעשית

**תרחיש:** אנחנו ב-Epic 1 "User Management" ורוצים ליצור את הסיפור הראשון: "User Login"

**ביצוע:**

1. **פותחים את Bob**
   ```
   @bob - שלום! אני רוצה ליצור את הסיפור הראשון מאפיק 1.
   ```

2. **Bob מתחיל את create-story**
   ```
   Bob: "אטען את workflow create-story..."
   Bob: "איזה אפיק? איזה סיפור?"
   אתם: "אפיק 1, סיפור 1"
   ```

3. **Bob קורא מסמכים**
   ```
   Bob קורא:
   - docs/epics.md → מוצא "Epic 1, Story 1.1: User Login"
   - docs/PRD.md → מוצא דרישות אבטחה ו-UX
   - docs/architecture.md → מוצא שצריך JWT tokens
   - docs/epic-1-context.md → מוצא פרטים טכניים
   ```

4. **Bob מנתח ויוצר**
   ```
   Bob מזהה:
   - זה סיפור authentication
   - צריך form, API, validation
   - יש דרישות אבטחה חזקות
   
   Bob יוצר קובץ עם:
   - 5 קריטריוני קבלה
   - 6 משימות (3 frontend, 2 backend, 1 tests)
   - הקשר טכני מפורט
   ```

5. **Bob שומר את הקובץ**
   ```
   ✅ Story created successfully!
   
   📁 File: docs/stories/1-1-user-login.md
   
   📋 Summary:
   - Acceptance Criteria: 5
   - Tasks: 6
   - Estimated Effort: 5 points
   - Priority: High
   
   Next steps:
   1. Review the story file
   2. If approved, run story-ready workflow
   3. Then run story-context to build full context
   4. Finally, run dev-story to implement
   ```

**תוצאה:**
יש לנו כעת קובץ עבודה מפורט! המפתח יכול לפתוח את הקובץ ולהבין בדיוק מה צריך לעשות, איך לעשות, ומה ההגדרה של "done".

### ⚠️ מתי לא להשתמש

- ❌ **הסיפור עדיין לא באפיקים** - קודם צריך להוסיף אותו לקובץ האפיקים
- ❌ **רוצים ליצור את כל הסיפורים בבת אחת** - create-story יוצר סיפור **אחד** בכל פעם (זה מכוון!)
- ❌ **Level 0 / Quick Flow** - ב-Level 0 אין סיפורים, יש רק tech-spec
- ❌ **הסיפור כבר נוצר ורוצים לערוך** - עדכנו את הקובץ ידנית, אל תריצו שוב create-story

### 🔗 וורקפלואים קשורים

**לפני:**
- ✅ `create-epics-and-stories` - יצירת רשימת הסיפורים באפיקים
- ✅ `epic-tech-context` - מומלץ! יוצר הקשר טכני לאפיק
- ✅ `sprint-planning` - מומלץ למעקב

**אחרי:**
- ➡️ `story-ready` - סימון שהסיפור מוכן לפיתוח
- ➡️ `story-context` - יצירת הקשר דינמי לסיפור
- ➡️ `dev-story` - פיתוח הסיפור

### 🐛 פתרון בעיות

**בעיה 1: "Story not found in epic file"**
```
פתרון:
- בדקו שהסיפור באמת קיים באפיקים
- הפורמט חייב להיות: "Story 1.1:" או "### Story 1.1:"
- מספרים חייבים להתאים (אפיק 1, סיפור 1)
```

**בעיה 2: "Story file already exists"**
```
פתרון:
- הסיפור כבר נוצר בעבר
- אם רוצים לעדכן, ערכו את הקובץ הקיים ידנית
- אל תריצו create-story שוב - זה ידרוס את הקובץ
```

**בעיה 3: "Missing epic context, story is generic"**
```
פתרון:
זה לא באג, אבל הסיפור יהיה פחות מפורט.
מומלץ:
1. הריצו epic-tech-context קודם
2. אז הריצו create-story שוב
התוצאה תהיה הרבה יותר מפורטת.
```

**בעיה 4: "Tasks are too vague"**
```
פתרון:
create-story יוצר משימות כלליות.
זה תקין - המשימות יתרחבו בשלב story-context ו-dev-story.
אם רוצים יותר פירוט כבר עכשיו, ערכו את הקובץ ידנית.
```

**בעיה 5: "Story is too big"**
```
פתרון:
אם create-story יוצר סיפור ענק (20+ משימות), זה אומר:
- הסיפור באפיק גדול מדי
- צריך לחזור ל-epics.md ולפצל אותו ל-2-3 סיפורים קטנים יותר
- כלל אצבע: סיפור = 3-8 משימות
```

---

## ✅ story-ready - סימון מוכנות לפיתוח {#story-ready}

**שם באנגלית:** story-ready  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation (Preparation)  
**סטטוס:** Recommended (מומלץ)

### 🎯 מטרה

הוורקפלואו `story-ready` **מסמן סיפור כמוכן לפיתוח** ומעדכן את הסטטוס ב-`sprint-status.yaml` מ-`drafted` ל-`ready-for-dev`.

**במילים פשוטות:** זה כמו "אישור" שהסיפור נבדק, מוכן, ומפתח יכול להתחיל לעבוד עליו.

### 📥 תשומות נדרשות

- ✅ קובץ סיפור קיים (`docs/stories/1-1-user-login.md`)
- ✅ הסיפור נבדק ואושר על ידי SM או PM
- ✅ קובץ `sprint-status.yaml` קיים

### 📤 פלט צפוי

**עדכון הסטטוס:**

לפני:
```yaml
development_status:
  1-1-user-login: drafted
```

אחרי:
```yaml
development_status:
  1-1-user-login: ready-for-dev
```

**זהו!** זה workflow פשוט מאוד - הוא רק מעדכן שדה אחד בקובץ.

### ⏱️ זמן משוער

**1-2 דקות**

זה הכי מהיר workflow שיש - פשוט עדכון סטטוס.

### 🤖 אג'נט מומלץ

**Scrum Master (Bob)** - Bob אחראי על ניהול הסטטוסים והאישורים.

**חלופה:** PM (John) יכול גם לאשר סיפורים.

### 📋 תהליך שלב אחר שלב

**שלב 1: זיהוי הסיפור**
```
הוורקפלואו שואל:
- איזה סיפור לסמן? (למשל: 1-1-user-login)
```

**שלב 2: קריאת sprint-status.yaml**
```
מציאת הסיפור ברשימה:
development_status:
  1-1-user-login: drafted ← מצא אותו!
```

**שלב 3: בדיקת תקינות**
```
וידוא ש:
- הסיפור קיים ב-sprint-status
- הסטטוס הנוכחי הוא drafted (לא backlog או done)
- קובץ הסיפור באמת קיים
```

**שלב 4: עדכון הסטטוס**
```
שינוי הערך:
1-1-user-login: drafted → ready-for-dev
```

**שלב 5: שמירה ודיווח**
```
שמירת sprint-status.yaml
הצגת הודעה:
"✅ Story 1-1-user-login marked as ready for development!"
```

### 💡 דוגמה מעשית

**תרחיש:** יצרנו את הסיפור "1-1-user-login" בעזרת create-story, בדקנו אותו, והוא נראה טוב. עכשיו רוצים לסמן שהוא מוכן.

**ביצוע:**

1. **פותחים את Bob**
   ```
   @bob - היי! בדקתי את סיפור 1-1-user-login והוא נראה מעולה.
   אפשר לסמן אותו כמוכן לפיתוח?
   ```

2. **Bob מריץ story-ready**
   ```
   Bob: "בטח! אטען את workflow story-ready..."
   Bob: "איזה סיפור?"
   אתם: "1-1-user-login"
   ```

3. **Bob מעדכן**
   ```
   Bob קורא sprint-status.yaml...
   Bob מוצא את הסיפור...
   Bob משנה: drafted → ready-for-dev
   Bob שומר את הקובץ
   ```

4. **Bob מדווח**
   ```
   ✅ Story marked as ready!
   
   📋 Story: 1-1-user-login
   📊 Status: drafted → ready-for-dev
   
   Next steps:
   1. Run story-context to build development context
   2. Then run dev-story to implement
   ```

**תוצאה:**
הסיפור עכשיו מסומן רשמית כ-"מוכן". המפתח יכול להתחיל לעבוד עליו.

### ⚠️ מתי לא להשתמש

- ❌ **הסיפור עדיין לא נוצר** - צריך קודם להריץ `create-story`
- ❌ **הסיפור כבר בסטטוס ready-for-dev או in-progress** - אין צורך להריץ שוב
- ❌ **רוצים לסמן סיפור כ-done** - לזה יש `story-done` workflow

### 🔗 וורקפלואים קשורים

**לפני:**
- ✅ `create-story` - יצירת הסיפור
- ✅ (אופציונלי) בדיקה ידנית של הסיפור

**אחרי:**
- ➡️ `story-context` - יצירת הקשר דינמי
- ➡️ `dev-story` - פיתוח הסיפור

### 🐛 פתרון בעיות

**בעיה 1: "Story not found in sprint-status"**
```
פתרון:
- הריצו sprint-planning כדי ליצור/לרענן את sprint-status.yaml
- בדקו שהסיפור באמת קיים באפיקים
```

**בעיה 2: "Story is already ready-for-dev"**
```
פתרון:
זה לא באג - הסיפור כבר מוכן!
אפשר לדלג ישר ל-story-context או dev-story.
```

**בעיה 3: "Can't change status from backlog to ready"**
```
פתרון:
סיפור ב-backlog אומר שהוא עדיין לא נוצר (drafted).
צריך קודם:
1. להריץ create-story (מעבר ל-drafted)
2. אז להריץ story-ready (מעבר ל-ready-for-dev)
```

---

## 🏗️ epic-tech-context - מפרט טכני לאפיק {#epic-tech-context}

**שם באנגלית:** epic-tech-context  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation (Preparation)  
**סטטוס:** Highly Recommended (מומלץ מאוד!)

### 🎯 מטרה

הוורקפלואו `epic-tech-context` יוצר **מפרט טכני מקיף** עבור אפיק שלם. המפרט כולל: פירוט טכני של כל הסיפורים, קריטריוני קבלה מפורטים, מיפוי traceability, והחלטות ארכיטקטוניות ספציפיות לאפיק.

**במילים פשוטות:** זה כמו "תכנית פיתוח מפורטת" לאפיק - מה צריך לבנות, איך לבנות, ומה ההגדרה של הצלחה.

**למה זה חשוב?**
- מפחית שגיאות בפיתוח (המפתח יודע בדיוק מה לעשות)
- מאפשר AI agents לעבוד בעקביות
- יוצר traceability בין דרישות לקוד
- מזהה תלויות בין סיפורים מראש

### 📥 תשומות נדרשות

לפני הרצת הוורקפלואו:
- ✅ קובץ אפיקים (`docs/epics.md` או `docs/epic-X.md`)
- ✅ PRD (`docs/PRD.md`) - לדרישות העסקיות
- ✅ Architecture (`docs/architecture.md`) - לארכיטקטורה כללית
- ✅ מומלץ: UX Design (`docs/ux-design.md`) - לעיצוב ממשק
- ✅ מומלץ: מפרטים טכניים של אפיקים קודמים (לעקביות)

**מה צריך לדעת:**
- מספר האפיק שרוצים לעשות לו context (למשל: 1)

### 📤 פלט צפוי

**קובץ מפרט טכני:** `docs/tech-spec-epic-1.md` (או `docs/epic-1-context.md`)

**מבנה המפרט:**

```markdown
# Technical Specification - Epic 1: User Management

## Epic Overview
[תיאור כללי של האפיק]

## Goals and Objectives
- Goal 1: Enable user authentication
- Goal 2: Support user profile management
- Goal 3: Implement role-based access control

## Technical Approach
[פירוט הגישה הטכנית]

## Architecture Decisions
- Decision 1: Use JWT for authentication
  - Rationale: Stateless, scalable
  - Alternatives considered: Session-based auth
- Decision 2: bcrypt for password hashing
  - Rationale: Industry standard, secure
  
## Stories Technical Breakdown

### Story 1.1: User Login
**Technical Requirements:**
- Frontend: React login form component
- Backend: POST /api/auth/login endpoint
- Validation: Email format, password length
- Security: Rate limiting (5/min), HTTPS only

**Acceptance Criteria:**
- [ ] API returns JWT token on success
- [ ] Token expires after 24 hours
- [ ] Failed attempts are logged
- [ ] Rate limiting prevents brute force

**Implementation Notes:**
- Use Formik for form handling
- Zod for validation
- JWT library: jsonwebtoken
- Hash comparison: bcrypt.compare()

**Dependencies:**
- Database user table
- JWT secret in environment variables

**Estimated Effort:** 5 points

### Story 1.2: User Registration
[...]

## Traceability Matrix
| Requirement (PRD) | Story | Acceptance Criteria |
|-------------------|-------|---------------------|
| REQ-1: Secure login | 1.1 | AC-1.1.1, AC-1.1.2 |
| REQ-2: User profiles | 1.2 | AC-1.2.1 |

## Testing Strategy
[איך לבדוק את האפיק]

## Risks and Mitigations
[סיכונים טכניים ופתרונות]

## Definition of Done
[מתי האפיק נחשב הושלם]
```

### ⏱️ זמן משוער

**20-40 דקות** (תלוי במורכבות האפיק ומספר הסיפורים)

זהו workflow מקיף - האג'נט צריך לקרוא הרבה מסמכים, לנתח, ולסנתז מידע טכני.

### 🤖 אג'נט מומלץ

**Architect (Winston)** - וינסטון הוא האדריכל הטכני, הוא מתמחה בפירוט ארכיטקטוני ומיפוי טכני.

**חלופות טובות:**
- **DEV (Amelia)** - אמיליה יכולה ליצור מפרט מפורט מאוד עם נקודת מבט של מפתח
- **SM (Bob)** - בוב יכול גם, אבל פחות טכני

### 📋 תהליך שלב אחר שלב

**שלב 1: זיהוי האפיק**
```
הוורקפלואו שואל:
- איזה אפיק? (למשל: 1)

חילוץ מידע:
- מצא Epic 1 בקובץ האפיקים
- חלץ את כל הסיפורים שלו (1.1, 1.2, 1.3...)
```

**שלב 2: איסוף הקשר עסקי**
```
קריאת PRD:
- מה המטרות העסקיות של האפיק?
- אילו דרישות קשורות לאפיק?
- מה ה-success metrics?

קריאת UX Design (אם קיים):
- איך הממשק צריך להיראות?
- מה החוויה צפויה?
```

**שלב 3: איסוף הקשר טכני**
```
קריאת Architecture:
- איך המערכת הכללית בנויה?
- אילו טכנולוגיות נבחרו?
- מה הדפוסים הארכיטקטוניים?

קריאת מפרטים קודמים (אם יש):
- איך אפיקים אחרים מתועדים?
- מה הסגנון והפורמט?
```

**שלב 4: ניתוח טכני**
```
לכל סיפור באפיק:
  - מה צריך לבנות? (Frontend, Backend, DB)
  - אילו טכנולוגיות להשתמש?
  - מה האתגרים הטכניים?
  - אילו ספריות/כלים נדרשים?
```

**שלב 5: החלטות ארכיטקטוניות**
```
זיהוי החלטות קריטיות:
- איך לארגן את הקוד?
- אילו דפוסי עיצוב להשתמש?
- איך לטפל בשגיאות?
- איך לבדוק?

תיעוד הנימוקים:
- למה בחרנו ב-X ולא ב-Y?
```

**שלב 6: מיפוי Traceability**
```
יצירת מטריצה:
דרישה מה-PRD → סיפור → קריטריון קבלה

זה מאפשר מעקב מדרישה עסקית ועד קוד.
```

**שלב 7: יצירת המפרט**
```
כתיבת מסמך מקיף:
- סקירה כללית
- פירוט טכני לכל סיפור
- החלטות ארכיטקטוניות
- מיפוי traceability
- אסטרטגיית בדיקות
- סיכונים

שמירה: docs/tech-spec-epic-1.md
```

**שלב 8: עדכון סטטוס**
```
עדכון sprint-status.yaml:
epic-1: backlog → contexted

זה מאותת שהאפיק מוכן ליצירת סיפורים.
```

### 💡 דוגמה מעשית

**תרחיש:** יש לנו Epic 1 "User Management" עם 3 סיפורים (login, registration, profile). רוצים ליצור מפרט טכני מקיף.

**ביצוע:**

1. **פותחים את Winston (Architect)**
   ```
   @winston - שלום וינסטון! אני צריך מפרט טכני מפורט לאפיק 1.
   ```

2. **Winston מתחיל את epic-tech-context**
   ```
   Winston: "Certainly! I'll create a comprehensive technical specification for Epic 1."
   Winston: "Let me load the workflow..."
   Winston: "Which epic should I create context for?"
   אתם: "Epic 1"
   ```

3. **Winston קורא מסמכים**
   ```
   Winston קורא:
   - docs/PRD.md → "Epic 1 should enable secure user management"
   - docs/architecture.md → "Use microservices, JWT auth, PostgreSQL"
   - docs/ux-design.md → "Login form should be clean, mobile-friendly"
   - docs/epics.md → "Epic 1 has 3 stories: 1.1, 1.2, 1.3"
   ```

4. **Winston מנתח טכנית**
   ```
   Winston מזהה:
   
   Story 1.1 (Login):
   - Frontend: React form + validation
   - Backend: Express.js auth endpoint
   - DB: Query users table
   - Security: Rate limiting, bcrypt
   
   Story 1.2 (Registration):
   - Frontend: Multi-step form
   - Backend: POST /api/users
   - DB: Insert with validation
   - Email: Send welcome email
   
   Story 1.3 (Profile):
   - Frontend: Profile page
   - Backend: GET/PUT /api/users/:id
   - Authorization: JWT middleware
   ```

5. **Winston מתעד החלטות**
   ```
   Architecture Decisions:
   
   AD-1: JWT for authentication
   Rationale: Stateless, scales horizontally
   Alternatives: Session-based (rejected - doesn't scale)
   
   AD-2: bcrypt for passwords
   Rationale: Industry standard, secure
   Cost: 10 rounds (balance security/performance)
   
   AD-3: Email validation at API level
   Rationale: Prevent invalid data at source
   Library: validator.js
   ```

6. **Winston יוצר Traceability Matrix**
   ```
   | PRD Requirement | Story | Acceptance Criteria |
   |-----------------|-------|---------------------|
   | REQ-1: Secure authentication | 1.1 | AC-1.1.1 (JWT), AC-1.1.2 (HTTPS) |
   | REQ-2: User registration | 1.2 | AC-1.2.1 (Email validation) |
   | REQ-3: Profile management | 1.3 | AC-1.3.1 (Update profile) |
   ```

7. **Winston שומר את המפרט**
   ```
   ✅ Technical Specification Created!
   
   📁 File: docs/tech-spec-epic-1.md
   
   📊 Summary:
   - Epic: 1 - User Management
   - Stories: 3
   - Architecture Decisions: 5
   - Technical Requirements: 12
   - Traceability Mappings: 8
   
   🏗️ Epic Status: backlog → contexted
   
   Next steps:
   1. Review the tech spec for accuracy
   2. Use create-story to draft individual stories
   3. The tech spec will provide rich context for implementation
   ```

**תוצאה:**
יש לנו מפרט טכני מקיף בן 10-15 עמודים! כשנריץ create-story עכשיו, הסיפורים יהיו הרבה יותר מפורטים כי הם ישתמשו במידע מהמפרט הזה.

### ⚠️ מתי לא להשתמש

- ❌ **Level 0 (Quick Flow)** - Level 0 לא משתמש באפיקים, רק ב-tech-spec
- ❌ **אפיק קטן עם 1-2 סיפורים פשוטים** - לפעמים זה overkill, create-story יספיק
- ❌ **אין PRD ו-Architecture** - בלי מסמכי תשתית, המפרט יהיה דל מדי
- ❌ **רוצים לעדכן מפרט קיים** - epic-tech-context יוצר מפרט חדש, לא עורך

### 🔗 וורקפלואים קשורים

**לפני:**
- ✅ `prd` - יצירת מסמך דרישות
- ✅ `architecture` - תכנון ארכיטקטוני
- ✅ `create-epics-and-stories` - יצירת האפיקים
- ✅ מומלץ: `create-ux-design` - עיצוב ממשק

**אחרי:**
- ➡️ `create-story` - יצירת סיפורים (יהיו מפורטים יותר!)
- ➡️ `sprint-planning` - מעקב כללי

### 🐛 פתרון בעיות

**בעיה 1: "Tech spec is too generic"**
```
פתרון:
זה קורה אם חסרים מסמכים:
- וודאו שיש PRD מפורט
- וודאו שיש Architecture document
- אם יש UX Design, זה יעזור מאוד
- הריצו שוב את epic-tech-context אחרי שתשלימו את המסמכים
```

**בעיה 2: "Epic tech context is 30+ pages"**
```
פתרון:
אם המפרט ענק, זה אומר שהאפיק גדול מדי!
שיקולים:
- אפיק צריך להיות 3-8 סיפורים
- אם יש יותר, כדאי לפצל לשני אפיקים
- או להריץ epic-tech-context פעמיים (epic 1, epic 2)
```

**בעיה 3: "Missing traceability matrix"**
```
פתרון:
זה קורה אם ה-PRD לא מכיל requirement IDs.
לא קריטי - המפרט עדיין תקף.
אם רוצים traceability:
- עדכנו את ה-PRD עם requirement IDs (REQ-1, REQ-2...)
- הריצו שוב epic-tech-context
```

**בעיה 4: "Tech spec conflicts with architecture doc"**
```
פתרון:
זו בעיה אמיתית! צריך לתקן.
תהליך:
1. בדקו מה הסתירה
2. עדכנו את architecture.md (או את ההחלטה)
3. הריצו epic-tech-context שוב
4. בדקו שהמפרט עקבי
```

**בעיה 5: "Winston is making wrong technology choices"**
```
פתרון:
epic-tech-context משתמש במידע מ-architecture.md.
אם ההחלטות לא נכונות:
1. עדכנו את architecture.md עם ההחלטות הנכונות
2. או הדריכו את Winston ישירות:
   "Winston, please use React Query instead of Redux"
3. Winston יתאים את המפרט
```

---

## 🎯 סיכום: מסלול ההכנה המלא

הנה הסדר המומלץ להכנת ספרינט:

```
Phase 2 (כבר הושלם):
✅ PRD created
✅ Architecture created
✅ Epics and stories created

Phase 4 Preparation (זה החלק!):
1️⃣ sprint-planning
   → יוצר sprint-status.yaml
   → רואים את כל האפיקים והסיפורים
   
2️⃣ epic-tech-context (Epic 1)
   → יוצר tech-spec-epic-1.md
   → מפרט מפורט לאפיק הראשון
   
3️⃣ create-story (Story 1.1)
   → יוצר stories/1-1-user-login.md
   → סיפור עבודה מפורט
   
4️⃣ story-ready (Story 1.1)
   → מעדכן סטטוס: ready-for-dev
   → אישור שהסיפור מוכן

Phase 4 Development (הבא):
5️⃣ story-context
6️⃣ dev-story
[...]
```

### 💡 טיפים חשובים

1. **אל תדלגו על epic-tech-context**
   - זה נראה אופציונלי, אבל זה ממש משפר את איכות הפיתוח
   - הסיפורים שנוצרים אחריו יהיו הרבה יותר טובים

2. **אל תיצרו את כל הסיפורים בבת אחת**
   - BMAD מעודדת גישה של "סיפור אחד בכל פעם"
   - יוצרים סיפור ראשון, מפתחים, לומדים, אז יוצרים הבא

3. **sprint-planning הוא החבר הכי טוב שלכם**
   - הריצו אותו בתחילת כל יום עבודה
   - הוא מרענן את הסטטוסים ומראה איפה אתם

4. **story-ready הוא אופציונלי אבל מומלץ**
   - זה יוצר "נקודת אישור" רשמית
   - במיוחד חשוב בצוותים (SM מאשר לפני שDEV מתחיל)

### 📚 מה הלאה?

אחרי ארבעת הוורקפלואים האלו, אתם מוכנים לפיתוח!

**הוורקפלואים הבאים (חלק 3C):**
- `story-context` - בניית הקשר דינמי לסיפור
- `dev-story` - פיתוח הסיפור בפועל
- `code-review` - סקירת קוד
- `story-done` - סיום וסגירה

**קישורים לחלקים אחרים:**
- [חזרה לחלק 3A: Solutioning](03-workflows-part-3a-solutioning.md)
- [המשך לחלק 3C: Development](03-workflows-part-3c-development.md) (בקרוב)
- [חזרה למדריך הראשי](README.md)

</div>

