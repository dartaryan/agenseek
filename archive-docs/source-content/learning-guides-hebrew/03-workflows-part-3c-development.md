# מדריך וורקפלואים - חלק 3C: פיתוח (Phase 4 Development)

<div dir="rtl">

## 📋 תוכן עניינים

1. [מבוא לפיתוח](#מבוא)
2. [story-context - הקשר דינמי לסיפור](#story-context)
3. [dev-story - פיתוח הסיפור](#dev-story)
4. [code-review - סקירת קוד](#code-review)
5. [story-done - סיום וסגירה](#story-done)

---

## 🎯 מבוא לפיתוח {#מבוא}

### מה זה Phase 4 Development?

אחרי ההכנה (חלק 3B: sprint-planning, create-story, story-ready), הגענו לליבת הפיתוח - **ארבעת הוורקפלואים שמממשים את הסיפורים בפועל**.

**ארבעת הוורקפלואים בחלק זה:**

1. **story-context** - בונה הקשר דינמי לפני פיתוח
2. **dev-story** - מממש את הסיפור בקוד
3. **code-review** - בודק איכות ותקינות
4. **story-done** - סוגר וסימן הסיפור כהושלם

### מה ההבדל מחלק 3B?

- **חלק 3B (Sprint Setup)** = הכנה: יצירת מעקב, סיפורים, הקשר טכני
- **חלק 3C (Development)** = מימוש: קוד, בדיקות, סקירה, סגירה

### הסדר ההגיוני

```
Sprint Setup (3B) → Development (3C)
================    ================
1. sprint-planning  5. story-context
2. create-story     6. dev-story
3. epic-tech-context 7. code-review
4. story-ready      8. story-done
                    9. חוזרים ל-#5 לסיפור הבא
```

**תזרים טיפוסי:**
```
story-context (מתכונן)
    ↓
dev-story (מפתח)
    ↓
code-review (בודק)
    ↓
dev-story שוב? (אם נדרשים תיקונים)
    ↓
story-done (סוגר)
```

---

## 🧩 story-context - הקשר דינמי לסיפור {#story-context}

**שם באנגלית:** story-context  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation  
**סטטוס:** Recommended (מומלץ מאוד!)

### 🎯 מטרה

הוורקפלואו `story-context` סורק את כל המידע הרלוונטי לסיפור ויוצר **קובץ הקשר דינמי בפורמט XML** שמכיל:

- קריטריוני קבלה ומשימות מהסיפור
- מסמכים רלוונטיים (PRD, Tech-Spec, Architecture)
- קוד קיים וממשקים שצריך להשתמש בהם
- תלויות וספריות במערכת
- תקני בדיקות ורעיונות לטסטים

**במילים פשוטות:** זה כמו "תיק מידע מלא" שהמפתח מקבל לפני שמתחיל לעבוד - כל מה שצריך במקום אחד.

### 📥 תשומות נדרשות

לפני הרצת הוורקפלואו:
- ✅ קובץ `sprint-status.yaml` עם סיפור במצב `drafted`
- ✅ קובץ הסיפור ב-`docs/stories/` (נוצר ב-`create-story`)
- ✅ קבצי תיעוד (PRD, Tech-Spec, Architecture) במערכת
- ✅ קוד מקור קיים (אם זה פרויקט brownfield)

**אם אין סיפור drafted:**
- הוורקפלואו יחפש את הסיפור הראשון עם סטטוס "drafted"
- אם לא מוצא, יציע להריץ `create-story` קודם

### 📤 פלט צפוי

**קובץ אחד חשוב:** `docs/stories/{story-key}.context.xml`

**מבנה הקובץ (XML מובנה):**
```xml
<story-context>
  <story>
    <asA>משתמש רשום</asA>
    <iWant>להתחבר עם סיסמה</iWant>
    <soThat>אוכל לגשת לחשבון שלי</soThat>
  </story>
  
  <artifacts>
    <docs>
      <!-- מסמכים רלוונטיים -->
      <doc path="docs/prd.md" section="Authentication">
        <snippet>Login requires email + password...</snippet>
      </doc>
    </docs>
    
    <code>
      <!-- קוד קיים לשימוש -->
      <file path="src/services/auth.js" symbol="validateUser">
        <reason>Existing validation logic to reuse</reason>
      </file>
    </code>
    
    <dependencies>
      <!-- ספריות וחבילות -->
      <node>
        <package>bcrypt</package>
        <package>jsonwebtoken</package>
      </node>
    </dependencies>
  </artifacts>
  
  <interfaces>
    <!-- ממשקים קיימים -->
    <api>POST /api/auth/login</api>
  </interfaces>
  
  <constraints>
    <!-- אילוצי פיתוח -->
    <constraint>Use JWT tokens (not sessions)</constraint>
  </constraints>
  
  <tests>
    <standards>Jest for unit tests, Cypress for E2E</standards>
    <ideas>
      <idea ac="AC1">Test invalid email format</idea>
      <idea ac="AC2">Test wrong password scenario</idea>
    </ideas>
  </tests>
</story-context>
```

### 🔄 תהליך הוורקפלואו

**מה הוורקפלואו עושה:**

1. **מוצא את הסיפור הראשון עם סטטוס "drafted"**
   - קורא את `sprint-status.yaml`
   - מזהה איזה אפיק (Epic 1, 2, 3...)
   - קורא את קובץ הסיפור המלא

2. **אוסף מסמכים רלוונטיים**
   - סורק PRD, Tech-Spec, Architecture
   - מחפש קטעים רלוונטיים לפי מילות מפתח
   - שומר קישורים למקורות

3. **מנתח קוד קיים**
   - מחפש קבצים רלוונטיים (controllers, services, components)
   - מזהה ממשקים וAPI קיימים
   - מחלץ אילוצי פיתוח

4. **מזהה תלויות**
   - סורק `package.json`, `requirements.txt`, `go.mod`
   - רושם ספריות וגרסאות

5. **מכין תקני בדיקות**
   - מחלץ מהמסמכים איך כותבים טסטים
   - מציע רעיונות לטסטים לפי קריטריוני הקבלה

6. **מעדכן את הסיפור ל-"ready-for-dev"**
   - משנה סטטוס בקובץ הסיפור
   - מעדכן את `sprint-status.yaml`
   - מוסיף קישור לקובץ ההקשר

### ✅ דוגמה מעשית

**לפני הרצה:**
```yaml
# sprint-status.yaml
development_status:
  1-2-user-login: drafted  # סיפור נוצר, אבל אין הקשר
```

**מריצים:**
```bash
*list-workflows
# בוחרים: story-context
```

**אחרי הרצה:**
```yaml
# sprint-status.yaml
development_status:
  1-2-user-login: ready-for-dev  # מוכן לפיתוח!
```

**ונוצר:**
- `docs/stories/1-2-user-login.context.xml` ← קובץ הקשר מלא!

### 💡 למה זה חשוב?

1. **חוסך זמן** - המפתח לא צריך לחפש מידע בכל הפרויקט
2. **מונע טעויות** - כל המגבלות והאילוצים כבר רשומים
3. **איכות גבוהה יותר** - הכל מבוסס על תיעוד אמיתי
4. **טסטים טובים יותר** - רעיונות לבדיקות כבר מוכנים

### ⚠️ מה אם קובץ הקשר כבר קיים?

אם הקובץ כבר קיים, הוורקפלואו ישאל:
1. **Replace** - יצור קובץ חדש (מחליף)
2. **Verify** - יבדוק את הקובץ הקיים
3. **Cancel** - יעצור בלי לעשות כלום

---

## 💻 dev-story - פיתוח הסיפור בפועל {#dev-story}

**שם באנגלית:** dev-story  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation  
**סטטוס:** Critical (קריטי!)

### 🎯 מטרה

הוורקפלואו `dev-story` הוא **ליבת הפיתוח ב-BMAD**. זה הוורקפלואו שבאמת **כותב את הקוד**, מריץ בדיקות, מאמת תקינות, ומעדכן את הסיפור עד שהוא מוכן לסקירה.

**במילים פשוטות:** זה המפתח שעובד על הסיפור - כותב קוד, כותב טסטים, מריץ בדיקות, ומסמן משימות כהושלמו.

### 📥 תשומות נדרשות

לפני הרצת הוורקפלואו:
- ✅ קובץ `sprint-status.yaml` עם סיפור במצב `ready-for-dev`
- ✅ קובץ הסיפור עם משימות ברורות (Tasks/Subtasks)
- ✅ (מומלץ) קובץ הקשר `.context.xml` (מ-`story-context`)
- ✅ סביבת פיתוח מוכנה (Git, dependencies)

**אופציונלי אבל חשוב:**
- קובץ הקשר (`.context.xml`) - מספק מידע עשיר למפתח
- הגדרת `run_tests_command` ב-`config.yaml`

### 🔄 תהליך הוורקפלואו (7 שלבים)

#### **שלב 1: טעינת הסיפור**

- מחפש את הסיפור הראשון עם סטטוס `ready-for-dev`
- קורא את קובץ הסיפור המלא
- טוען את קובץ ההקשר (אם קיים)
- מזהה את המשימה הראשונה שלא הושלמה

**אם יש קובץ הקשר:**
```
ℹ️ Context file loaded: 1-2-user-login.context.xml
✅ Using context: PRD, Tech-Spec, existing code, dependencies
```

**אם אין:**
```
ℹ️ No context file found
Proceeding with story file only
Consider running story-context first for better results
```

#### **שלב 1.5: זיהוי המשך אחרי Code Review**

הוורקפלואו חכם - הוא מזהה אם זה **פיתוח חדש** או **המשך אחרי סקירת קוד**:

**אם יש סעיף "Senior Developer Review (AI)":**
```
⏯️ Resuming Story After Code Review
Review Outcome: Changes Requested
Action Items: 3 remaining to address
Priorities: 2 High, 1 Medium
Strategy: Will prioritize review follow-up tasks first
```

**אם אין (פיתוח חדש):**
```
🚀 Starting Fresh Implementation
Story: 1-2-user-login
Context file: Available
First incomplete task: Implement login endpoint
```

#### **שלב 1.6: סימון in-progress**

```yaml
# sprint-status.yaml לפני:
1-2-user-login: ready-for-dev

# אחרי:
1-2-user-login: in-progress  # 🚀 מתחילים עבודה!
```

#### **שלב 2: תכנון ומימוש משימה**

לכל משימה שטרם הושלמה:

1. **תכנון:**
   - קורא את קריטריוני הקבלה
   - קורא את ה-Dev Notes
   - כותב תכנית קצרה ב-Debug Log

2. **מימוש:**
   - כותב את הקוד בפועל
   - עוקב אחר הדפוסים והסטנדרטים בפרויקט
   - מטפל במקרי קצה ושגיאות

3. **אילוצים:**
   - אם צריך תלות חדשה → שואל אישור מהמשתמש
   - אם 3 כשלונות ברצף → עוצר ומבקש עזרה
   - אם חסרה הגדרה → עוצר ומדווח

**דוגמה לתכנית ב-Debug Log:**
```markdown
## Debug Log

### Task: Implement login endpoint
**Plan:**
1. Create POST /api/auth/login route
2. Validate email format
3. Check password with bcrypt
4. Generate JWT token
5. Return token or 401 error

**Implementation:**
- Used existing validateEmail() from utils
- Reused hashPassword() from auth service
- Edge cases: empty fields, invalid format, wrong password
```

#### **שלב 3: כתיבת בדיקות מקיפות**

אחרי כל משימה, כותב טסטים:

1. **Unit Tests** - לוגיקה עסקית ופונקציות ליבה
2. **Integration Tests** - אינטראקציות בין רכיבים (אם נדרש)
3. **E2E Tests** - תרחישי משתמש קריטיים (אם נדרש)
4. **Edge Cases** - מקרי קצה ושגיאות

**דוגמה:**
```javascript
// tests/unit/auth.test.js
describe('Login API', () => {
  test('should return JWT on valid credentials', async () => {
    // AC1: Valid login returns token
  });
  
  test('should return 401 on invalid email', async () => {
    // AC2: Invalid email format rejected
  });
  
  test('should return 401 on wrong password', async () => {
    // AC3: Wrong password rejected
  });
});
```

#### **שלב 4: הרצת בדיקות**

1. מריץ את **כל הטסטים הקיימים** (regression)
2. מריץ את **הטסטים החדשים**
3. מריץ linting ובדיקות איכות (אם מוגדר)
4. מאמת שכל קריטריוני הקבלה מתקיימים

**אם יש כשלונות:**
- עוצר ומתקן לפני המשך
- מנתח למה הטסט נכשל
- מתקן ומריץ שוב

#### **שלב 5: סימון משימה כהושלמה**

רק אחרי ש**כל הטסטים עוברים**:

1. מסמן את המשימה `[x]` בקובץ הסיפור
2. מעדכן את File List בסיפורים שהשתנו
3. כותב הערות ב-Completion Notes

**אם זה תיקון מ-Code Review:**
- מסמן גם את המשימה בסעיף Tasks
- מסמן גם את הפריט בסעיף "Senior Developer Review"
- מוסיף הערה: "✅ Resolved review finding [High]: Add validation..."

**לולאה:**
- אם יש עוד משימות → חוזר לשלב 2
- אם כל המשימות הושלמו → ממשיך לשלב 6

#### **שלב 6: השלמת הסיפור**

כשכל המשימות מסומנות `[x]`:

1. **אימות סופי:**
   - בודק שכל המשימות סומנו ✅
   - מריץ regression מלא 🧪
   - בודק ש-File List מלא 📋
   - מריץ Definition of Done (אם קיים)

2. **עדכון סטטוס:**
   - משנה Status בסיפור: `review`
   - מעדכן `sprint-status.yaml`: `in-progress` → `review`

```yaml
# sprint-status.yaml
development_status:
  1-2-user-login: review  # ✅ מוכן לסקירה!
```

#### **שלב 7: תקשורת עם המשתמש**

**סיכום מפורט:**
```
✅ Story Implementation Complete!

**Story Details:**
- ID: 1.2
- Key: 1-2-user-login
- Title: User Login with Password
- Status: in-progress → review

**Key Changes:**
- Created POST /api/auth/login endpoint
- Added JWT token generation
- Implemented password validation with bcrypt
- Added 6 unit tests, all passing

**Files Modified:**
- src/routes/auth.js (new)
- src/services/auth-service.js (modified)
- tests/unit/auth.test.js (new)

**Next Steps:**
1. Review the story file
2. Test the changes manually
3. Run code-review workflow for peer review
```

**שאלות מותאמות למשתמש:**
- בהתאם ל-`user_skill_level` ב-config
- מציע הסברים על החלטות טכניות
- מוכן לענות על שאלות

### ⚙️ הגדרות חשובות ב-config.yaml

```yaml
# bmad/bmm/config.yaml
user_skill_level: "intermediate"  # beginner/intermediate/expert
run_tests_command: "npm test"     # פקודה להרצת טסטים
run_until_complete: true          # ממשיך עד סיום (לא עוצר באמצע)
```

### 💡 טיפים חשובים

1. **תמיד הריצו story-context קודם**
   - התוצאה תהיה הרבה יותר טובה
   - המפתח יקבל כל ההקשר הדרוש

2. **הגדירו run_tests_command**
   - זה מאפשר לוורקפלואו להריץ טסטים אוטומטית
   - בלי זה, הוא ינסה לנחש

3. **עקבו אחרי הסיפור**
   - קובץ הסיפור מתעדכן כל הזמן
   - אפשר לראות התקדמות בזמן אמת

4. **המשכים אחרי Code Review**
   - אם יש ממצאים מ-code-review
   - הוורקפלואו יתעדף אותם אוטומטית

---

## 🔍 code-review - סקירת קוד סיסטמטית {#code-review}

**שם באנגלית:** code-review  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation  
**סטטוס:** Recommended (מומלץ מאוד!)

### 🎯 מטרה

הוורקפלואו `code-review` מבצע **סקירת קוד Senior Developer מקיפה וסיסטמטית** על סיפור שסטטוסו "review". זו לא סקירה שטחית - זו בדיקה מעמיקה שמאמתת **כל קריטריון קבלה** ו**כל משימה** עם ראיות קונקרטיות.

**במילים פשוטות:** זה כמו Senior Developer מנוסה שבודק את הקוד בקפדנות ורושם ממצאים מפורטים עם המלצות מדויקות.

### 📥 תשומות נדרשות

- ✅ קובץ `sprint-status.yaml` עם סיפור במצב `review`
- ✅ קובץ הסיפור עם כל המשימות מסומנות `[x]`
- ✅ File List מלא (רשימת קבצים ששונו)
- ✅ קוד שהתווסף/השתנה

### 📤 פלט צפוי

**סעיף חדש בקובץ הסיפור:**

```markdown
## Senior Developer Review (AI)

**Reviewer:** BMad
**Date:** 2025-01-15
**Outcome:** Changes Requested

### Summary
Implementation is mostly correct but has 2 security issues and 1 missing test.

### Key Findings

**HIGH Severity:**
- [ ] [High] Add input validation on login endpoint (AC #1) [file: src/routes/auth.js:23-45]
  Missing email format validation before database query. Risk: SQL injection.
  Suggested fix: Use validator.isEmail() before querying.

**MEDIUM Severity:**
- [ ] [Med] Add unit test for invalid email format [file: tests/unit/auth.test.js]
  AC2 requires validation but test is missing.

**LOW Severity:**
- Note: Consider adding rate limiting for production deployment

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Valid login returns JWT | ✅ IMPLEMENTED | src/routes/auth.js:34 |
| AC2 | Invalid email rejected | ⚠️ PARTIAL | Validation missing |
| AC3 | Wrong password rejected | ✅ IMPLEMENTED | src/services/auth.js:56 |

**Summary:** 2 of 3 acceptance criteria fully implemented

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|------|-----------|-------------|----------|
| Implement login endpoint | ✅ Complete | ✅ VERIFIED | src/routes/auth.js:12-67 |
| Add JWT generation | ✅ Complete | ✅ VERIFIED | src/services/token.js:23 |
| Write unit tests | ✅ Complete | ⚠️ QUESTIONABLE | Missing email validation test |

**Summary:** 2 of 3 completed tasks fully verified, 1 questionable

### Action Items

**Code Changes Required:**
- [ ] [High] Add input validation on login endpoint (AC #1) [file: src/routes/auth.js:23-45]
- [ ] [Med] Add unit test for invalid email format [file: tests/unit/auth.test.js]

**Advisory Notes:**
- Note: Consider adding rate limiting for production deployment
- Note: Document the JWT expiration policy in README
```

### 🔄 תהליך הוורקפלואו

#### **שלב 1: מציאת סיפור לסקירה**

- מחפש את הסיפור הראשון עם סטטוס `review`
- אם לא מוצא → מציע להריץ `dev-story` או אפשרות לסקירה Ad-Hoc

**אפשרות Ad-Hoc Review:**
```
📋 No stories with status "review" found

What would you like to do?
1. Run dev-story to implement a story
2. Check sprint-status.yaml
3. Tell me what code to review and what to review it for

> 3

What code would you like me to review?
- File path(s): src/services/payment.js
- What to review for: Security concerns
```

#### **שלב 2-3: טעינת הקשר וזיהוי טכנולוגיות**

- טוען את קובץ ההקשר (אם קיים)
- טוען את Epic Tech Spec
- מזהה את המחסנית הטכנולוגית (Node, Python, Go...)
- קורא תקני קידוד ו-best practices

#### **שלב 4: אימות סיסטמטי**

**⚠️ זה החלק הקריטי - אפס סובלנות לחוסר דיוק!**

**4A: בדיקת קריטריוני קבלה**

לכל AC:
1. קורא את הדרישה
2. חיפוש בקוד: איפה זה מיושם?
3. קובע: IMPLEMENTED / PARTIAL / MISSING
4. רושם ראיות: `file:line`
5. בודק אם יש טסטים

**4B: בדיקת משימות שסומנו כהושלמו**

לכל משימה שמסומנת `[x]`:
1. קורא את התיאור
2. מחפש ראיות בקוד
3. קובע: VERIFIED / QUESTIONABLE / NOT DONE
4. **קריטי:** אם סומנה אבל לא נעשתה → HIGH SEVERITY!

**4C: בדיקת התאמה ל-Tech-Spec**

- בודק אם הקוד עוקב אחר הדפוסים שהוגדרו
- בודק אם יש הפרות של אילוצי אדריכלות

#### **שלב 5: סקירת איכות ואבטחה**

- טיפול בשגיאות
- אבטחת קלט (input validation)
- ניהול סודות (secrets)
- ביצועים ואנטי-פטרנים
- איכות הטסטים

#### **שלב 6: החלטה על תוצאת הסקירה**

```
BLOCKED        → יש ממצא HIGH (AC חסר, משימה לא נעשתה)
CHANGES REQUESTED → יש ממצאים MEDIUM או כמה LOW
APPROVE        → הכל בסדר, אין בעיות משמעותיות
```

#### **שלב 7-8: שמירה ועדכון סטטוס**

**עדכון sprint-status.yaml:**
```yaml
# אם APPROVE:
1-2-user-login: review → done

# אם CHANGES REQUESTED:
1-2-user-login: review → in-progress

# אם BLOCKED:
1-2-user-login: review  # נשאר review
```

#### **שלב 9: הוספת משימות מעקב**

הממצאים הופכים למשימות בסיפור:

```markdown
## Tasks / Subtasks

### Review Follow-ups (AI)
- [ ] [AI-Review][High] Add input validation on login endpoint (AC #1)
- [ ] [AI-Review][Med] Add unit test for invalid email format
```

### 💡 למה זה חשוב?

1. **תפיסת באגים מוקדם** - לפני production
2. **למידה** - הסקירה מסבירה למה משהו בעייתי
3. **תיעוד** - כל הממצאים מתועדים
4. **עקביות** - תמיד אותם תקנים

### ⚙️ מצבי סקירה

**1. סקירת סיפור רגילה:**
- מוצא סיפור במצב "review" ב-sprint-status
- מבצע סקירה מלאה
- מעדכן את הסיפור ואת sprint-status

**2. סקירת Ad-Hoc:**
- מקבל קבצים ספציפיים לבדוק
- מבצע סקירה ממוקדת
- יוצר דו"ח סקירה נפרד: `docs/code-review-{date}.md`

---

## ✅ story-done - סיום וסגירה {#story-done}

**שם באנגלית:** story-done  
**מודול:** BMM (BMAD Method)  
**פאזה:** Phase 4 - Implementation  
**סטטוס:** Required (חובה!)

### 🎯 מטרה

הוורקפלואו `story-done` הוא וורקפלואו **פשוט אבל קריטי** שמסמן סיפור כ**הושלם לחלוטין** (Definition of Done). זה הסגירה הרשמית של הסיפור.

**במילים פשוטות:** זה כמו "לחתום על המסמכים" - הסיפור סיים, נבדק, אושר, ועכשיו רשמית done.

### 📥 תשומות נדרשות

- ✅ קובץ `sprint-status.yaml` עם סיפור במצב `review`
- ✅ הסיפור עבר code-review בהצלחה (Approve או שתיקנו הכל)
- ✅ כל הטסטים עוברים
- ✅ Definition of Done מתקיימת

### 🔄 תהליך הוורקפלואו

וורקפלואו פשוט ב-3 שלבים:

#### **שלב 1: מציאת סיפור לסגירה**

- מחפש את הסיפור הראשון עם סטטוס `review`
- קורא את קובץ הסיפור

#### **שלב 2: עדכון סטטוס ל-done**

```yaml
# sprint-status.yaml לפני:
1-2-user-login: review

# אחרי:
1-2-user-login: done  # ✅ הושלם!
```

**מוסיף לסיפור:**
```markdown
### Completion Notes
**Completed:** 2025-01-15
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing
```

#### **שלב 3: אישור למשתמש**

```
✅ Story Approved and Marked Done, BMad!

**Completed Story:**
- ID: 1.2
- Key: 1-2-user-login
- Title: User Login with Password
- Completed: 2025-01-15

**Next Steps:**
1. Continue with next story in your backlog
   - Run create-story for next backlog story
   - Or run dev-story if ready stories exist
2. Check epic completion status
   - Run retrospective workflow if epic is complete
```

### 💡 מתי להריץ?

**הריצו `story-done` כאשר:**

1. ✅ `code-review` אישר (Approve)
2. ✅ כל הטסטים עוברים
3. ✅ אתם (או ה-Product Owner) בדקתם ידנית
4. ✅ Definition of Done מתקיימת

**אל תריצו אם:**

- ❌ יש ממצאים פתוחים מ-code-review
- ❌ יש טסטים שנכשלים
- ❌ לא בדקתם את התכונה ידנית
- ❌ חסרים דברים ב-Definition of Done

### 🎯 מה קורה אחרי?

**אפשרות 1: יש עוד סיפורים באפיק**
```bash
# הריצו את הבא:
*list-workflows
# בחרו: dev-story (יקפוץ על הסיפור הבא)
```

**אפשרות 2: כל הסיפורים באפיק הושלמו**
```bash
# הריצו:
*list-workflows
# בחרו: retrospective
# בודק אם האפיק הושלם ויוצר סיכום
```

**אפשרות 3: עוברים לאפיק הבא**
```bash
# הריצו:
*list-workflows
# בחרו: epic-tech-context (לאפיק הבא)
```

---

## 🔄 תזרים מלא Phase 4 Development

### סדר מלא מהכנה לסגירה

```
Sprint Setup (Part 3B):
=======================
1. sprint-planning     → יוצר מעקב כללי
2. create-story        → יוצר סיפור ראשון
3. epic-tech-context   → הקשר טכני לאפיק
4. story-ready         → מאשר מוכנות

Development (Part 3C):
======================
5. story-context       → הקשר דינמי לסיפור
6. dev-story           → פיתוח בפועל
7. code-review         → סקירה

   → אם נדרשים תיקונים:
     dev-story שוב   → מתקן ממצאים
     code-review שוב → בודק שוב

8. story-done          → סגירה רשמית

9. חוזר ל-#5 לסיפור הבא
```

### תזרים טיפוסי ביום עבודה

```
בוקר:
-----
09:00 - הפעלת sprint-planning (רענון סטטוסים)
09:10 - הפעלת story-context (סיפור הבא)
09:15 - הפעלת dev-story (מתחיל פיתוח)
     ↓
     מפתח עובד...
     ↓
12:00 - dev-story מסיים (סטטוס → review)

אחה"צ:
------
14:00 - הפעלת code-review
     ↓
     סקירה מוצאת 2 ממצאים
     ↓
14:30 - הפעלת dev-story (מתקן ממצאים)
     ↓
     תיקונים...
     ↓
16:00 - הפעלת code-review שוב (Approve!)
16:10 - הפעלת story-done (done!)

סיום:
-----
16:15 - הפעלת sprint-planning (רואים התקדמות)
16:20 - מתכנן את מחר (story-context לסיפור הבא)
```

---

## 💡 טיפים חשובים

### 1. **תמיד הריצו story-context**
- זה לא חובה, אבל הוא משפר דרמטית את איכות הפיתוח
- המפתח מקבל הכל במקום אחד

### 2. **הגדירו run_tests_command**
```yaml
# bmad/bmm/config.yaml
run_tests_command: "npm test"  # או pytest, go test, וכו'
```

### 3. **עקבו אחרי הסטטוסים**
```yaml
# sprint-status.yaml
development_status:
  1-1-story: done       # ✅ הושלם
  1-2-story: review     # 🔍 בסקירה
  1-3-story: in-progress # 💻 בפיתוח
  1-4-story: ready-for-dev # 🚀 מוכן
  1-5-story: drafted    # 📝 נוצר
  1-6-story: backlog    # 📋 ממתין
```

### 4. **אל תדלגו על code-review**
- זה תופס באגים לפני production
- זה מלמד best practices
- זה שומר על איכות

### 5. **תקנו ממצאים מיד**
- אם code-review מצא בעיה
- תקנו מיד עם dev-story
- אל תצטברו תיקונים

---

## 📚 מה הלאה?

אחרי שלמדתם את וורקפלואי הפיתוח (Part 3C), המשיכו ל:

**הוורקפלואים הבאים (חלק 3D - Phase 4 Management):**
- `correct-course` - תיקון כיוון באמצע ספרינט
- `retrospective` - רטרוספקטיבה לאפיק

**וורקפלואי בדיקות (חלק 4 - Testing):**
- 8 וורקפלואים של TEA (Test Engineer Architect)
- testarch-framework, test-design, atdd, ועוד

**קישורים לחלקים אחרים:**
- [חזרה לחלק 3B: Sprint Setup](03-workflows-part-3b-sprint-setup.md)
- [המשך לחלק 3D: Management](03-workflows-part-3d-management.md) (בקרוב)
- [חזרה למדריך הראשי](README.md)

</div>

