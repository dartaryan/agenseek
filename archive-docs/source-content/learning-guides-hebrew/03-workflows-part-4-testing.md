# מדריך וורקפלואים - חלק 4: וורקפלואי בדיקות (TEA)

<div dir="rtl">

## 📋 תוכן עניינים

- [מבוא: וורקפלואי בדיקות של TEA](#מבוא-וורקפלואי-בדיקות-של-tea)
- [testarch-framework - אתחול מסגרת בדיקות](#testarch-framework---אתחול-מסגרת-בדיקות)
- [testarch-test-design - תכנון בדיקות והערכת סיכונים](#testarch-test-design---תכנון-בדיקות-והערכת-סיכונים)
- [testarch-atdd - בדיקות לפני מימוש](#testarch-atdd---בדיקות-לפני-מימוש)
- [testarch-automate - הרחבת כיסוי בדיקות](#testarch-automate---הרחבת-כיסוי-בדיקות)
- [testarch-ci - צינור בדיקות אוטומטי](#testarch-ci---צינור-בדיקות-אוטומטי)
- [testarch-test-review - ביקורת איכות בדיקות](#testarch-test-review---ביקורת-איכות-בדיקות)
- [testarch-trace - מטריצת עקיבות](#testarch-trace---מטריצת-עקיבות)
- [testarch-nfr - הערכת דרישות לא-פונקציונליות](#testarch-nfr---הערכת-דרישות-לא-פונקציונליות)

---

## מבוא: וורקפלואי בדיקות של TEA

### מה הם וורקפלואי TEA?

**Test Engineer Architect (TEA)** מציע **8 וורקפלואים מיוחדים** ליצירת אסטרטגיית בדיקות מקצועית מקצה לקצה. זהו מערך שלם של כלים לבניית תשתית בדיקות, תכנון, מימוש, וניהול איכות.

### למי זה מיועד?

✅ **בודקי תוכנה (QA Engineers)**  
✅ **מהנדסי אוטומציה (Test Automation Engineers)**  
✅ **ארכיטקטי בדיקות (Test Architects)**  
✅ **מפתחים שרוצים TDD/ATDD**  
✅ **מנהלי פרויקטים המעוניינים באיכות**

### מתי להשתמש בוורקפלואי TEA?

**בתחילת פרויקט:**
- `testarch-framework` - הקמת תשתית בדיקות

**לפני פיתוח:**
- `testarch-test-design` - תכנון סיכונים וכיסוי
- `testarch-atdd` - כתיבת בדיקות כושלות (TDD)

**במהלך פיתוח:**
- `testarch-automate` - הרחבת כיסוי בדיקות
- `testarch-ci` - אינטגרציה ל-CI/CD

**אחרי פיתוח:**
- `testarch-test-review` - ביקורת איכות בדיקות
- `testarch-trace` - מיפוי כיסוי דרישות
- `testarch-nfr` - הערכת ביצועים ואמינות

### המחזור השלם של TEA

```
📦 פרויקט חדש
  ↓
🏗️ testarch-framework (פעם אחת)
  ↓
📋 testarch-test-design (לכל Epic/Story)
  ↓
🔴 testarch-atdd (כתיבת בדיקות כושלות)
  ↓
💻 [DEV מממש את התכונה]
  ↓
🟢 [בדיקות עוברות]
  ↓
🤖 testarch-automate (הרחבת כיסוי)
  ↓
🔄 testarch-ci (אוטומציה ב-CI/CD)
  ↓
📊 testarch-test-review (ביקורת איכות)
  ↓
✅ testarch-trace (אימות כיסוי)
  ↓
⚡ testarch-nfr (ביצועים ואבטחה)
  ↓
🚀 שחרור לייצור
```

### העקרונות המנחים

**1. Test-First (בדיקות קודם)**
- כתוב בדיקות לפני הקוד (Red-Green-Refactor)
- הבדיקות מגדירות את ההתנהגות הצפויה

**2. Deterministic Tests (בדיקות דטרמיניסטיות)**
- אותה בדיקה תמיד מחזירה אותה תוצאה
- אין תלות במקריות או timing

**3. Isolated Tests (בדיקות מבודדות)**
- כל בדיקה עצמאית
- ניקוי אוטומטי של נתונים

**4. Network-First (רשת קודם)**
- יירוט רשת לפני ניווט
- המתנה דטרמיניסטית

**5. Explicit Assertions (טענות מפורשות)**
- טענה אחת לבדיקה
- הודעות שגיאה ברורות

---

## testarch-framework - אתחול מסגרת בדיקות

### 🎯 מטרה

יצירת תשתית בדיקות מוכנה לייצור עם **Playwright** או **Cypress** - כולל קונפיגורציה, מבנה תיקיות, Fixtures, Factories, ובדיקות לדוגמה.

### 📥 תשומות נדרשות

- `package.json` קיים בפרויקט
- **אין** מסגרת בדיקות E2E קיימת (Playwright/Cypress)
- הקשר ארכיטקטוני (React, Vue, Next.js, וכו')

### 📤 פלט צפוי

**קבצי קונפיגורציה:**
- `playwright.config.ts` או `cypress.config.ts`
- `.env.example` עם משתני סביבה
- `.nvmrc` עם גרסת Node.js

**מבנה תיקיות:**
```
tests/
├── e2e/              # בדיקות E2E
├── api/              # בדיקות API
├── support/          # תשתית
│   ├── fixtures/     # Fixtures עם ניקוי אוטומטי
│   ├── factories/    # יצרני נתונים (faker)
│   └── helpers/      # פונקציות עזר
└── README.md         # תיעוד מלא
```

**בדיקות לדוגמה:**
- בדיקת homepage
- בדיקת יצירת משתמש עם Factory
- דוגמה לשימוש ב-Fixtures

### ⏱️ זמן משוער

**30-45 דקות** (הווורקפלואו מייצר הכל אוטומטית)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה בתשתיות בדיקות

```
@tea *testarch-framework
```

### 📋 תהליך שלב אחר שלב

**שלב 1: בדיקות קדם-הרצה**
1. קריאת `package.json` לזיהוי סוג הפרויקט
2. בדיקה שאין מסגרת בדיקות קיימת
3. זיהוי bundler (Vite, Webpack, וכו')

**שלב 2: בחירת מסגרת**

**Playwright מומלץ כאשר:**
- פרויקט גדול (100+ קבצים)
- דרוש תמיכה במספר דפדפנים
- נדרשת מקביליות (workers)
- חשובים כלי debugging (trace viewer)

**Cypress מומלץ כאשר:**
- צוות קטן שמעדיף developer experience
- דגש על component testing
- real-time reloading חשוב

**ברירת מחדל: Playwright** (אם לא בטוח)

**שלב 3: יצירת קונפיגורציה**

עבור Playwright:
```typescript
timeout: 60s           // Test timeout
expect: 15s            // Assertion timeout
actionTimeout: 15s     // Action timeout
navigationTimeout: 30s // Navigation timeout
trace: retain-on-failure
screenshot: only-on-failure
video: retain-on-failure
```

**שלב 4: יצירת Fixture Architecture**

```typescript
// tests/support/fixtures/index.ts
import { test as base } from '@playwright/test';
import { UserFactory } from './factories/user-factory';

export const test = base.extend({
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    await factory.cleanup(); // 🔑 ניקוי אוטומטי
  },
});
```

**שלב 5: יצירת Data Factories**

```typescript
// tests/support/fixtures/factories/user-factory.ts
import { faker } from '@faker-js/faker';

export class UserFactory {
  private createdUsers: string[] = [];

  async createUser(overrides = {}) {
    const user = {
      email: faker.internet.email(), // 🔑 נתונים אקראיים
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 12 }),
      ...overrides, // 🔑 אפשרות לדריסה
    };

    // יצירה דרך API
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });

    const created = await response.json();
    this.createdUsers.push(created.id); // 🔑 מעקב למחיקה
    return created;
  }

  async cleanup() {
    // מחיקה אוטומטית של כל המשתמשים שנוצרו
    for (const userId of this.createdUsers) {
      await fetch(`${process.env.API_URL}/users/${userId}`, {
        method: 'DELETE',
      });
    }
  }
}
```

**שלב 6: בדיקות לדוגמה**

```typescript
import { test, expect } from '../support/fixtures';

test('should create user and login', async ({ page, userFactory }) => {
  // GIVEN: יצירת משתמש
  const user = await userFactory.createUser();

  // WHEN: התחברות
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');

  // THEN: אימות הצלחה
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  
  // ניקוי אוטומטי בסיום הבדיקה ✅
});
```

### 💡 דוגמה מעשית

**תרחיש:** צוות פיתוח מתחיל פרויקט Next.js חדש ורוצה להוסיף בדיקות E2E.

**ביצוע:**
```
אתה: @tea *testarch-framework
Murat: [בודק package.json]
       Project type: Next.js with TypeScript
       Framework recommendation: Playwright
       
       Creating test infrastructure...
       ✅ playwright.config.ts created
       ✅ tests/ directory structure created
       ✅ Fixtures and factories scaffolded
       ✅ Sample tests generated
       ✅ README.md with setup instructions
       
       Next steps:
       1. Copy .env.example to .env
       2. Run: npm install
       3. Run: npm run test:e2e
```

**תוצאה:**
- תשתית בדיקות מוכנה תוך 5 דקות
- בדיקות לדוגמה עובדות
- צוות יכול להתחיל לכתוב בדיקות מיד

### ⚠️ מתי לא להשתמש

❌ כבר יש מסגרת בדיקות מותקנת (Playwright/Cypress)  
❌ רוצים רק unit tests (השתמשו ב-Vitest/Jest)  
❌ פרויקט קטן מאוד (בדיקה ידנית מספיקה)

### 🔗 וורקפלואים קשורים

**אחרי זה:**
- `testarch-test-design` - תכנון הבדיקות הראשונות
- `testarch-atdd` - כתיבת בדיקות כושלות

### 🐛 פתרון בעיות

**בעיה: "Framework already detected"**
- **פתרון:** יש כבר Playwright/Cypress. אם רוצים להחליף, מחקו את הקונפיגורציה הקיימת.

**בעיה: "Cannot find package.json"**
- **פתרון:** הוורקפלואו חייב לרוץ מ-root הפרויקט.

**בעיה: "Node version mismatch"**
- **פתרון:** התקינו את גרסת Node.js המצוינת ב-`.nvmrc`.

### 🎓 טיפים מתקדמים

**1. העדיפו data-testid selectors**
```typescript
// ✅ טוב - יציב
await page.click('[data-testid="submit-button"]');

// ❌ רע - שביר
await page.click('.btn-primary.submit');
```

**2. השתמשו ב-Faker לכל נתוני בדיקה**
```typescript
// ✅ טוב - נתונים חדשים בכל הרצה
const email = faker.internet.email();

// ❌ רע - התנגשויות
const email = 'test@example.com';
```

**3. תמיד נקו נתונים**
```typescript
// ✅ טוב - ניקוי אוטומטי דרך Fixture
test('test', async ({ userFactory }) => {
  const user = await userFactory.createUser();
  // ניקוי אוטומטי ✅
});

// ❌ רע - ניקוי ידני
test('test', async () => {
  const user = await createUser();
  // שכחתי למחוק... ❌
});
```

---

## testarch-test-design - תכנון בדיקות והערכת סיכונים

### 🎯 מטרה

תכנון אסטרטגיית בדיקות מקיפה עם **הערכת סיכונים**, **סיווג עדיפויות (P0-P3)**, ובחירת רמות בדיקה מתאימות (E2E, API, Component, Unit).

### 📥 תשומות נדרשות

- Story עם קריטריוני קבלה (acceptance criteria)
- PRD או Epic לקונטקסט
- מסמכי ארכיטקטורה (רצוי)

### 📤 פלט צפוי

**מסמך Test Design** הכולל:

**1. מטריצת הערכת סיכונים:**
```
| Risk ID | קטגוריה | תיאור | הסתברות | השפעה | ציון | צעדי הפחתה |
| R-001 | SEC | עקיפת הזדהות | 2 | 3 | 6 | הוספת בדיקת הרשאות |
| R-002 | PERF | זמן תגובה >3s | 3 | 2 | 6 | אופטימיזציה של שאילתות |
```

**2. מטריצת כיסוי:**
```
| דרישה | רמת בדיקה | עדיפות | קישור לסיכון | מספר בדיקות |
| תהליך התחברות | E2E | P0 | R-001 | 3 |
| ולידציית email | API | P1 | - | 2 |
```

**3. קריטריוני Quality Gate:**
- P0 tests: 100% עוברות
- P1 tests: ≥95% עוברות
- כיסוי קוד: ≥80% בנתיבים קריטיים

**4. הערכת משאבים:**
- P0: 15 בדיקות × 2 שעות = 30 שעות
- P1: 25 בדיקות × 1 שעה = 25 שעות
- **סה"כ:** 55 שעות (~7 ימי עבודה)

### ⏱️ זמן משוער

**45-60 דקות** להרצת הווורקפלואו (הכנת מסמך Test Design מלא)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה בתכנון בדיקות

```
@tea *testarch-test-design
```

### 📋 תהליך שלב אחר שלב

**שלב 1: טעינת הקשר**
1. קריאת Story עם acceptance criteria
2. קריאת PRD ו-Epic למטרות עסקיות
3. קריאת מסמכי ארכיטקטורה
4. זיהוי כל הדרישות הניתנות לבדיקה

**שלב 2: הערכה וסיווג סיכונים**

**קטגוריות סיכון:**

**TECH (טכני/ארכיטקטורה):**
- פגמים ארכיטקטוניים
- כשלי אינטגרציה
- בעיות scalability

**SEC (אבטחה):**
- בקרות גישה חסרות
- עקיפת הזדהות
- חשיפת מידע רגיש

**PERF (ביצועים):**
- הפרת SLA
- תגובה איטית
- מיצוי משאבים

**DATA (שלמות נתונים):**
- אובדן נתונים
- שחיתות מידע
- מצב לא עקבי

**BUS (השפעה עסקית):**
- פגיעה בחוויית משתמש
- שגיאות בלוגיקה עסקית
- השפעה על הכנסות

**OPS (תפעול):**
- כשלי deployment
- טעויות הגדרה
- פערי ניטור

**מתודולוגיית ניקוד:**
```
ציון סיכון = הסתברות × השפעה

הסתברות:
1 = לא סביר (<10%)
2 = אפשרי (10-50%)
3 = סביר (>50%)

השפעה:
1 = מינורית (עקיפה קיימת)
2 = פגועה (עקיפה קשה)
3 = קריטית (אין עקיפה)

סף קריטי: ציון ≥6 דורש הפחתה מיידית
```

**שלב 3: תכנון כיסוי בדיקות**

**בחירת רמת בדיקה:**

**E2E (End-to-End):**
- ✅ מסעות משתמש קריטיים
- ✅ אינטגרציה רב-מערכתית
- ⏱️ אמינות גבוהה, הרצה איטית

**API (Integration):**
- ✅ לוגיקה עסקית
- ✅ חוזי שירות
- ⏱️ איזון טוב, יציבות

**Component:**
- ✅ התנהגות רכיבי UI
- ✅ אינטראקציות
- ⏱️ מהיר, מבודד

**Unit:**
- ✅ לוגיקה טהורה
- ✅ edge cases
- ⏱️ מהיר ביותר

**עקרון: אל תשכפלו כיסוי!**
- אל תבדקו אותה התנהגות ברמות מרובות
- E2E רק לנתיב הקריטי
- API לווריאציות לוגיקה
- Unit ל-edge cases

**הקצאת עדיפויות (P0-P3):**

**P0 (קריטי):**
- ✅ חוסם תהליך ליבה
- ✅ סיכון גבוה (ציון ≥6)
- ✅ אין עקיפה
- 🔄 **רץ בכל commit**

**P1 (גבוה):**
- ✅ תכונה חשובה
- ✅ סיכון בינוני (ציון 3-5)
- ✅ עקיפה קיימת אך קשה
- 🔄 **רץ ב-PR למסטר**

**P2 (בינוני):**
- ✅ תכונות משניות
- ✅ סיכון נמוך (ציון 1-2)
- ✅ edge cases
- 🔄 **רץ לילי/שבועי**

**P3 (נמוך):**
- ✅ nice-to-have
- ✅ בדיקות חקרניות
- ✅ מדדי ביצועים
- 🔄 **רץ לפי דרישה**

**שלב 4: הגדרת סדר ביצוע**

```
1. Smoke tests (תת-קבוצה של P0, <5 דקות)
   ↓
2. P0 tests (נתיבים קריטיים, <10 דקות)
   ↓
3. P1 tests (תכונות חשובות, <30 דקות)
   ↓
4. P2/P3 tests (רגרסיה מלאה, <60 דקות)
```

### 💡 דוגמה מעשית

**תרחיש:** תכונת "Forgot Password" חדשה עבור אפליקציית e-commerce.

**ביצוע:**
```
אתה: @tea *testarch-test-design
Murat: [קורא Story ו-PRD]
       
       Story: Forgot Password Feature
       - User can request password reset
       - Email sent with reset link
       - Link expires after 1 hour
       - User sets new password
       
       === Risk Assessment ===
       
       🔴 R-001 [SEC, Score: 9]
       Description: Token reuse - Same reset token can be used multiple times
       Mitigation: Invalidate token after first use
       
       🟡 R-002 [BUS, Score: 6]
       Description: Email not delivered - User stuck without password
       Mitigation: Add "try again" flow + support contact
       
       🟢 R-003 [DATA, Score: 2]
       Description: Old password still works after reset
       Mitigation: Hash new password immediately
       
       === Coverage Plan ===
       
       P0 Tests (Critical):
       - E2E: Full forgot password flow [R-001, R-002]
       - API: Token invalidation after use [R-001]
       - API: Token expiration validation [R-001]
       
       P1 Tests (High):
       - E2E: Email not delivered - retry flow [R-002]
       - API: Multiple reset requests handling
       
       P2 Tests (Medium):
       - Component: Reset form validation
       - Unit: Password strength validation
       
       === Resource Estimate ===
       P0: 3 tests × 2h = 6 hours
       P1: 2 tests × 1h = 2 hours
       P2: 2 tests × 0.5h = 1 hour
       Total: 9 hours (~1.5 days)
       
       === Quality Gate ===
       ✅ P0 pass rate: 100%
       ✅ P1 pass rate: ≥95%
       ✅ High-risk (≥6) mitigations: 100%
```

**תוצאה:**
- זוהו 3 סיכונים (1 קריטי)
- תוכננו 7 בדיקות ברמות שונות
- מוכן ל-ATDD workflow

### ⚠️ מתי לא להשתמש

❌ Story ללא acceptance criteria (אי אפשר לתכנן)  
❌ תכונה טריוויאלית (refactoring פנימי)  
❌ proof-of-concept (עדיין לא יציב)

### 🔗 וורקפלואים קשורים

**לפני זה:**
- `testarch-framework` - הכנת תשתית

**אחרי זה:**
- `testarch-atdd` - מימוש הבדיקות המתוכננות
- `testarch-trace` - אימות שכל הסיכונים כוסו

### 🐛 פתרון בעיות

**בעיה: "לא יודע איזו רמת בדיקה לבחור"**
- **פתרון:** 
  - E2E → אם מערב UI ומספר מערכות
  - API → אם בודק לוגיקה עסקית
  - Component → אם בודק רכיב UI ספציפי
  - Unit → אם בודק פונקציה טהורה

**בעיה: "כל הבדיקות יוצאות P0"**
- **פתרון:** P0 רק למה שחוסם ליבה. שאלו: "האם המערכת לגמרי לא שימושית בלי זה?"

**בעיה: "קשה להעריך סיכונים"**
- **פתרון:** התבססו על עדויות (לא ניחושים):
  - היסטוריית באגים
  - משוב משתמשים
  - ביקורות אבטחה

### 🎓 טיפים מתקדמים

**1. אל תמציאו סיכונים**
```
❌ רע: "אולי המערכת תקרוס אם יהיו מיליון משתמשים"
✅ טוב: "PRD מציין 10K משתמשים, נבדוק ביצועים בעומס הזה"
```

**2. השתמשו במסגרת TIME לסיווג עדיפויות**
```
P0 = Blocks core flow + High risk + No workaround
P1 = Important feature + Medium risk + Difficult workaround
P2 = Secondary + Low risk + Workaround exists
P3 = Nice-to-have + Minimal risk
```

**3. תכננו עבור CI/CD מההתחלה**
```
Smoke (<5 min) → בכל commit
P0 (<10 min) → בכל PR
P1 (<30 min) → merge למסטר
P2/P3 (>30 min) → לילי
```

---

## testarch-atdd - בדיקות לפני מימוש

### 🎯 מטרה

יצירת בדיקות כושלות (RED phase) **לפני מימוש התכונה** לפי מחזור **Red-Green-Refactor**. הווורקפלואו יוצר בדיקות מקיפות, Fixtures, Factories, ורשימת משימות למפתחים.

### 📥 תשומות נדרשות

- Story מאושר עם קריטריוני קבלה
- תשתית בדיקות קיימת (testarch-framework)
- מסמך Test Design (רצוי - לעדיפויות וסיכונים)

### 📤 פלט צפוי

**קבצי בדיקה:**
```
tests/
├── e2e/
│   └── forgot-password.spec.ts      # בדיקות E2E כושלות
├── api/
│   └── password-reset.api.spec.ts   # בדיקות API כושלות
├── support/
│   ├── fixtures/
│   │   └── password-reset.fixture.ts # Fixture עם ניקוי אוטומטי
│   └── factories/
│       └── reset-token.factory.ts    # Factory לנתוני בדיקה
```

**מסמך ATDD Checklist:**
- רשימת בדיקות שנוצרו
- רשימת data-testid נדרשים ל-DEV
- דרישות mock לשירותים חיצוניים
- checklist מימוש למפתחים (Red→Green→Refactor)
- פקודות הרצה

### ⏱️ זמן משוער

**60-90 דקות** (יצירת 5-10 בדיקות כולל תשתית)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה ב-TDD/ATDD

```
@tea *testarch-atdd
```

### 📋 תהליך שלב אחר שלב

**שלב 1: ניתוח קריטריוני קבלה**
1. קריאת Story
2. זיהוי כל התנהגות ניתנת לבדיקה
3. מיפוי לרמות בדיקה (E2E/API/Component)
4. סנכרון עם Test Design (אם קיים)

**שלב 2: יצירת בדיקות כושלות**

**מבנה Given-When-Then:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Forgot Password', () => {
  test('should send reset email for valid user', async ({ page }) => {
    // GIVEN: משתמש רשום קיים
    const userEmail = 'john@example.com';
    
    // WHEN: מבקש איפוס סיסמה
    await page.goto('/forgot-password');
    await page.fill('[data-testid="email-input"]', userEmail);
    await page.click('[data-testid="submit-button"]');
    
    // THEN: מתקבל אישור
    await expect(page.locator('[data-testid="success-message"]'))
      .toHaveText('Reset link sent to your email');
    
    // 🔴 בדיקה זו תיכשל - הדף והלוגיקה עדיין לא קיימים
  });
});
```

**עקרון Network-First (קריטי!):**

```typescript
test('should invalidate token after first use', async ({ page, request }) => {
  // 🔑 קריטי: יירוט לפני ניווט!
  await page.route('**/api/reset-password', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
  );
  
  // עכשיו ניווט
  await page.goto('/reset-password?token=abc123');
  
  await page.fill('[data-testid="new-password"]', 'NewPass123!');
  await page.click('[data-testid="submit-button"]');
  
  // THEN: token לא עובד שוב
  await page.goto('/reset-password?token=abc123');
  await expect(page.locator('[data-testid="error"]'))
    .toHaveText('Reset link has expired or already been used');
});
```

**שלב 3: יצירת Data Factories**

```typescript
// tests/support/factories/reset-token.factory.ts
import { faker } from '@faker-js/faker';

export const createResetToken = (overrides = {}) => ({
  token: faker.string.uuid(),
  userId: faker.number.int({ min: 1, max: 10000 }),
  email: faker.internet.email(),
  expiresAt: faker.date.future().toISOString(),
  used: false,
  ...overrides, // 🔑 אפשרות לדריסה למקרי קצה
});

export const createExpiredToken = () =>
  createResetToken({
    expiresAt: faker.date.past().toISOString(), // token שפג
  });

export const createUsedToken = () =>
  createResetToken({
    used: true, // token שכבר נוצל
  });
```

**שלב 4: יצירת Fixtures עם ניקוי אוטומטי**

```typescript
// tests/support/fixtures/password-reset.fixture.ts
import { test as base } from '@playwright/test';

type ResetFixtures = {
  resetToken: { token: string; email: string };
};

export const test = base.extend<ResetFixtures>({
  resetToken: async ({ request }, use) => {
    // Setup: יצירת token אמיתי דרך API
    const response = await request.post('/api/users/request-reset', {
      data: { email: 'test@example.com' },
    });
    const { token, email } = await response.json();
    
    // מספקים לבדיקה
    await use({ token, email });
    
    // 🔑 Cleanup: ניקוי אוטומטי
    await request.delete(`/api/reset-tokens/${token}`);
  },
});

export { expect } from '@playwright/test';
```

**שימוש ב-Fixture:**
```typescript
import { test, expect } from '../support/fixtures/password-reset.fixture';

test('should reset password with valid token', async ({ page, resetToken }) => {
  // resetToken נוצר אוטומטית ✅
  await page.goto(`/reset-password?token=${resetToken.token}`);
  
  await page.fill('[data-testid="new-password"]', 'NewPass123!');
  await page.click('[data-testid="submit"]');
  
  await expect(page).toHaveURL('/login');
  
  // resetToken נמחק אוטומטית בסיום ✅
});
```

**שלב 5: רשימת data-testid ל-DEV**

הווורקפלואו יוצר מסמך:

```markdown
### Required data-testid Attributes

**Forgot Password Page** (`/forgot-password`):
- `email-input` - Email input field
- `submit-button` - Submit button
- `success-message` - Success message container
- `error-message` - Error message container

**Reset Password Page** (`/reset-password`):
- `new-password` - New password input
- `confirm-password` - Confirm password input
- `submit-button` - Submit button
- `success-message` - Success message
- `error-message` - Error message
```

**שלב 6: Implementation Checklist למפתחים**

```markdown
## Implementation Checklist - Red→Green→Refactor

### 🔴 RED Phase (Complete)
- ✅ All tests written and failing
- ✅ Fixtures and factories created
- ✅ data-testid list provided

### 🟢 GREEN Phase (DEV Team)

#### Test: Send reset email for valid user
- [ ] Create `/forgot-password` page
- [ ] Create form with email input
- [ ] Add `data-testid="email-input"`
- [ ] Add `data-testid="submit-button"`
- [ ] Integrate email service API
- [ ] Display success message with `data-testid="success-message"`
- [ ] Run: `npm run test:e2e -- forgot-password.spec.ts`
- [ ] ✅ Test passes

#### Test: Invalidate token after first use
- [ ] Create `/reset-password` page
- [ ] Accept `token` query parameter
- [ ] Validate token hasn't been used
- [ ] Mark token as used after reset
- [ ] Add all required data-testid attributes
- [ ] Run: `npm run test:e2e -- forgot-password.spec.ts`
- [ ] ✅ Test passes

### 🔄 REFACTOR Phase (DEV Team)
- [ ] Extract duplicated code
- [ ] Optimize API calls
- [ ] Add error handling
- [ ] Ensure tests still pass ✅
```

### 💡 דוגמה מעשית

**תרחיש:** צוות מתחיל Story "User Login" ורוצה TDD נכון.

**ביצוע:**
```
אתה: @tea *testarch-atdd
Murat: [קורא Story]
       
       Story TASK-123: User Login
       
       Acceptance Criteria:
       - Valid credentials → redirect to dashboard
       - Invalid credentials → show error
       - Empty fields → disable submit button
       
       === Test Generation ===
       
       Creating E2E tests:
       ✅ tests/e2e/login.spec.ts (3 tests)
       
       Creating Fixtures:
       ✅ tests/support/fixtures/auth.fixture.ts
       
       Creating Factories:
       ✅ tests/support/factories/user.factory.ts
       
       === Running Tests (RED Phase) ===
       
       $ npm run test:e2e
       
       ❌ should login with valid credentials - FAIL
          Reason: /login page not found
       ❌ should show error for invalid credentials - FAIL
          Reason: /login page not found
       ❌ should disable submit for empty fields - FAIL
          Reason: /login page not found
       
       ✅ All tests failing as expected (RED phase)
       
       === Next Steps for DEV ===
       
       1. Review: docs/atdd-checklist-TASK-123.md
       2. Implement one test at a time
       3. Run test after each implementation
       4. Move to next test when green ✅
```

**תוצאה:**
- 3 בדיקות כושלות מוכנות
- Fixtures + Factories תומכים
- DEV יכול להתחיל מימוש מיד

### ⚠️ מתי לא להשתמש

❌ אין acceptance criteria ברור  
❌ התכונה כבר מומשה (השתמשו ב-`testarch-automate`)  
❌ proof-of-concept (עדיין לא יציב לבדיקות)

### 🔗 וורקפלואים קשורים

**לפני זה:**
- `testarch-test-design` - תכנון סיכונים ועדיפויות
- `testarch-framework` - הכנת תשתית

**אחרי זה:**
- [DEV מממש → בדיקות עוברות]
- `testarch-test-review` - ביקורת איכות
- `testarch-trace` - אימות כיסוי

### 🐛 פתרון בעיות

**בעיה: "בדיקות עוברות מההתחלה (GREEN)"**
- **פתרון:** זו לא בדיקת ATDD תקינה! בדיקות חייבות להיכשל (RED) עד שיש מימוש.

**בעיה: "בדיקות נכשלות עם שגיאות תחביר"**
- **פתרון:** זו שגיאת הבדיקה, לא כשל מתוכנן. תקנו את הבדיקה.

**בעיה: "לא יודע איזה רמת בדיקה ליצור"**
- **פתרון:** התחילו מ-E2E לקריטריוני קבלה המערבים UI. API לבדיקת לוגיקה.

### 🎓 טיפים מתקדמים

**1. טענה אחת לבדיקה (Atomic Tests)**
```typescript
// ✅ טוב - טענה אחת
test('should display success message', async ({ page }) => {
  await expect(page.locator('[data-testid="success"]'))
    .toHaveText('Login successful');
});

// ❌ רע - מספר טענות (לא אטומי)
test('should display user info', async ({ page }) => {
  await expect(page.locator('[data-testid="name"]')).toHaveText('John');
  await expect(page.locator('[data-testid="email"]')).toHaveText('john@example.com');
  // אם השני נכשל, לא יודעים אם הראשון עדיין תקין
});
```

**2. Network-First תמיד**
```typescript
// ✅ קריטי: יירוט לפני ניווט
await page.route('**/api/data', handler);
await page.goto('/page');

// ❌ מסוכן: race condition
await page.goto('/page');
await page.route('**/api/data', handler); // מאוחר מדי!
```

**3. Faker לכל נתוני בדיקה**
```typescript
// ✅ טוב
const email = faker.internet.email(); // כל הרצה שונה

// ❌ רע
const email = 'test@example.com'; // התנגשויות
```

---

## testarch-automate - הרחבת כיסוי בדיקות

### 🎯 מטרה

הרחבת כיסוי בדיקות אוטומטיות **אחרי מימוש** או ניתוח codebase קיים ליצירת suite בדיקות מקיף. תומך הן ב**BMad Mode** (עם Story/PRD) והן ב**Standalone Mode** (ניתוח קוד ישיר).

### 📥 תשומות נדרשות

**BMad Mode (מומלץ):**
- Story/Epic מומש
- תשתית בדיקות קיימת
- Tech-spec או ארכיטקטורה (רצוי)

**Standalone Mode (brownfield):**
- קוד מקור מומש (`src/` directory)
- תשתית בדיקות קיימת
- אין צורך ב-Story/PRD

### 📤 פלט צפוי

**קבצי בדיקה חדשים:**
- בדיקות E2E לתהליכים קריטיים
- בדיקות API לנקודות קצה
- בדיקות Component לרכיבי UI
- Factories ו-Fixtures נוספים

**מסמך Automation Summary:**
- רשימת בדיקות שנוספו
- פערי כיסוי שזוהו
- המלצות לשיפור
- הערכת כיסוי נוכחי vs יעד

### ⏱️ זמן משוער

**60-120 דקות** (תלוי בהיקף - 10-20 בדיקות)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה באוטומציה

```
@tea *testarch-automate
```

### 📋 תהליך שלב אחר שלב

**שלב 1: זיהוי מצב עבודה**

**BMad Mode:**
1. קריאת Story עם acceptance criteria
2. קריאת Tech-spec/PRD
3. זיהוי בדיקות קיימות
4. מיפוי פערי כיסוי מול דרישות

**Standalone Mode:**
1. סריקת קוד מקור (`src/`)
2. זיהוי API endpoints (routes, controllers)
3. זיהוי UI components
4. זיהוי בדיקות קיימות
5. מיפוי פערי כיסוי

**שלב 2: ניתוח פערי כיסוי**

```
=== Coverage Gap Analysis ===

Feature: User Profile Management

Existing Tests:
✅ GET /api/users/:id (API test)
✅ Update profile form (Component test)

Missing Tests:
❌ PUT /api/users/:id (API test)
❌ Profile image upload (E2E test)
❌ Email verification flow (E2E test)
❌ Error handling - 404 user not found (API test)
❌ Error handling - invalid data (Component test)

Priority: P1 (High)
Estimated effort: 5 tests × 1.5h = 7.5 hours
```

**שלב 3: יצירת בדיקות חסרות**

**דוגמה - בדיקת API:**
```typescript
// tests/api/user-profile.api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Profile API', () => {
  test('PUT /api/users/:id - should update user profile', async ({ request }) => {
    // GIVEN: משתמש קיים
    const userId = 123;
    const updatedData = {
      name: 'John Updated',
      bio: 'New bio text',
    };
    
    // WHEN: עדכון פרופיל
    const response = await request.put(`/api/users/${userId}`, {
      data: updatedData,
    });
    
    // THEN: עדכון הצליח
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(updatedData.name);
    expect(body.bio).toBe(updatedData.bio);
  });
  
  test('PUT /api/users/:id - should return 404 for non-existent user', async ({ request }) => {
    // WHEN: עדכון משתמש לא קיים
    const response = await request.put('/api/users/999999', {
      data: { name: 'Test' },
    });
    
    // THEN: שגיאה 404
    expect(response.status()).toBe(404);
  });
});
```

**דוגמה - בדיקת E2E:**
```typescript
// tests/e2e/profile-image.spec.ts
import { test, expect } from '../support/fixtures';

test.describe('Profile Image Upload', () => {
  test('should upload and display new profile image', async ({ page, authenticatedUser }) => {
    // GIVEN: משתמש מחובר
    await page.goto(`/profile/${authenticatedUser.id}`);
    
    // WHEN: העלאת תמונה
    const fileInput = page.locator('[data-testid="image-upload"]');
    await fileInput.setInputFiles('tests/fixtures/test-avatar.jpg');
    await page.click('[data-testid="upload-button"]');
    
    // THEN: תמונה מוצגת
    await expect(page.locator('[data-testid="profile-image"]'))
      .toHaveAttribute('src', /avatar\.jpg/);
    
    // AND: הודעת הצלחה
    await expect(page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  });
});
```

**שלב 4: הרחבת Factories**

```typescript
// tests/support/factories/user.factory.ts (מורחב)
import { faker } from '@faker-js/faker';

export class UserFactory {
  // ... existing code ...
  
  // 🆕 תמיכה ביצירת משתמש עם פרופיל מלא
  async createUserWithProfile(overrides = {}) {
    const user = await this.createUser({
      bio: faker.lorem.paragraph(),
      website: faker.internet.url(),
      location: faker.location.city(),
      avatar: faker.image.avatar(),
      ...overrides,
    });
    return user;
  }
  
  // 🆕 תמיכה ביצירת מספר משתמשים
  async createUsers(count: number) {
    return Promise.all(
      Array.from({ length: count }, () => this.createUser())
    );
  }
}
```

**שלב 5: דוח כיסוי מסכם**

```markdown
## Automation Summary

**Feature**: User Profile Management
**Coverage Target**: Comprehensive

### Tests Added

**API Tests** (3 new):
- ✅ PUT /api/users/:id - update profile
- ✅ PUT /api/users/:id - 404 error handling
- ✅ DELETE /api/users/:id - account deletion

**E2E Tests** (2 new):
- ✅ Profile image upload flow
- ✅ Email verification flow

**Component Tests** (2 new):
- ✅ ProfileForm validation
- ✅ ProfileForm error states

### Coverage Analysis

Before: 45% (3 tests)
After: 85% (10 tests)
Improvement: +40%

### Remaining Gaps

Low Priority (P3):
- Password change with 2FA
- Export user data (GDPR)

Recommendation: Address in next sprint.

### Effort

Actual: 8 hours
Estimated: 7.5 hours
Accuracy: 93%
```

### 💡 דוגמה מעשית

**תרחיש:** אפליקציה קיימת עם כיסוי בדיקות חלקי (30%). רוצים להגיע ל-80%.

**ביצוע:**
```
אתה: @tea *testarch-automate
Murat: Standalone mode detected (no Story provided)
       
       Scanning codebase...
       
       === Discovered Features ===
       
       1. Authentication (src/auth/)
          Existing tests: 5 E2E, 3 API
          Coverage: ~70%
          
       2. Product Catalog (src/products/)
          Existing tests: 2 E2E, 1 API
          Coverage: ~30% ⚠️
          
       3. Shopping Cart (src/cart/)
          Existing tests: 1 E2E, 0 API
          Coverage: ~15% 🔴
       
       Recommendation: Focus on Shopping Cart (highest gap)
       
       === Generating Tests for Shopping Cart ===
       
       Creating:
       - tests/e2e/cart-add-item.spec.ts
       - tests/e2e/cart-update-quantity.spec.ts
       - tests/e2e/cart-remove-item.spec.ts
       - tests/e2e/cart-checkout-flow.spec.ts
       - tests/api/cart-api.spec.ts
       
       Creating Factories:
       - tests/support/factories/product.factory.ts
       - tests/support/factories/cart.factory.ts
       
       === Results ===
       
       Shopping Cart Coverage:
       Before: 15% (1 test)
       After: 75% (9 tests)
       
       Overall Coverage:
       Before: 30%
       After: 58%
       
       Next iteration target: Product Catalog (30% → 70%)
```

**תוצאה:**
- 8 בדיקות חדשות נוצרו
- כיסוי גדל ב-28%
- יעד ברור להמשך

### ⚠️ מתי לא להשתמש

❌ לפני מימוש (השתמשו ב-`testarch-atdd`)  
❌ הקוד עדיין מתפתח (לא יציב)  
❌ כיסוי כבר גבוה (>80%)

### 🔗 וורקפלואים קשורים

**לפני זה:**
- `testarch-atdd` - בדיקות לפני מימוש
- [DEV מממש התכונה]

**אחרי זה:**
- `testarch-test-review` - ביקורת איכות
- `testarch-trace` - מיפוי כיסוי מלא

### 🐛 פתרון בעיות

**בעיה: "לא מוצא מה לבדוק"**
- **פתרון:** הריצו `testarch-test-design` קודם לזיהוי פערים.

**בעיה: "יוצרות יותר מדי בדיקות"**
- **פתרון:** התמקדו ב-critical paths. אל תבדקו getters/setters פשוטים.

**בעיה: "בדיקות דומות לקיימות"**
- **פתרון:** בדקו בדיקות קיימות לפני יצירה. אל תשכפלו.

### 🎓 טיפים מתקדמים

**1. Brownfield Mode - תשתמשו בסריקת קוד**
```
אם אין Story/PRD:
1. סרקו src/ לזיהוי API routes
2. סרקו src/ לזיהוי UI components
3. השוו לבדיקות קיימות
4. מלאו את הפערים
```

**2. התמקדו בערך עסקי**
```
P0 (חובה):
- תהליכי checkout
- תשלום
- הזדהות

P1 (חשוב):
- חיפוש
- פילטרים
- עגלה

P2 (nice-to-have):
- המלצות
- שיתוף ברשתות חברתיות
```

**3. משיכת leverage מ-Factories**
```typescript
// ✅ טוב - Factory רב-תכליתי
export class ProductFactory {
  createProduct(overrides = {}) { /* ... */ }
  createProducts(count) { /* ... */ }
  createOutOfStockProduct() { return this.createProduct({ stock: 0 }); }
  createDiscountedProduct() { return this.createProduct({ discount: 20 }); }
}
```

---

## testarch-ci - צינור בדיקות אוטומטי

### 🎯 מטרה

יצירת pipeline CI/CD מוכן לייצור עם הרצת בדיקות אוטומטית, burn-in loops, artifact collection, ודיווח. תומך ב-**GitHub Actions**, **GitLab CI**, **Circle CI**, ו-**Jenkins**.

### 📥 תשומות נדרשות

- תשתית בדיקות קיימת (testarch-framework)
- קובץ `package.json` עם scripts
- repository Git (לזיהוי פלטפורמה)
- `.nvmrc` (אופציונלי - לגרסת Node)

### 📤 פלט צפוי

**קובץ קונפיגורציית CI:**

- `.github/workflows/test.yml` (GitHub Actions)
- `.gitlab-ci.yml` (GitLab CI)
- קונפיגורציית burn-in loops
- artifact collection
- דיווח HTML + JUnit

### ⏱️ זמן משוער

30-45 דקות (זיהוי פלטפורמה + יצירת pipeline)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה ל-CI/CD testing

### 📋 תהליך שלב אחר שלב

**שלב 1: זיהוי פלטפורמה**
```
1. סריקת .git/config לזיהוי GitHub/GitLab
2. קריאת קונפיגורציית framework (Playwright/Cypress)
3. קביעת פלטפורמת CI אוטומטית
```

**שלב 2: יצירת Pipeline**
```yaml
# דוגמה: GitHub Actions
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version-file: '.nvmrc'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:e2e
      
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

**שלב 3: Burn-in Loop**
```yaml
# ריצת בדיקות מספר פעמים לגילוי flakiness
- name: Burn-in Tests (P0 only)
  run: |
    for i in {1..3}; do
      npm run test:e2e -- --grep @P0
    done
```

**שלב 4: Artifact Collection**
```yaml
- name: Collect artifacts
  uses: actions/upload-artifact@v3
  with:
    name: test-artifacts
    path: |
      test-results/
      playwright-report/
      screenshots/
```

### 💡 דוגמה מעשית

**תרחיש:** הוספת CI לפרויקט חדש

```
1. @tea היי, תריץ testarch-ci
2. TEA מזהה: GitHub Actions + Playwright
3. יוצר .github/workflows/test.yml
4. מגדיר: P0 בכל commit, P1 ב-PR, P2 nightly
5. מוסיף burn-in loop ל-P0 (x3 runs)
6. שומר artifacts רק בכישלון
```

**תוצאה:**
- ✅ Pipeline פועל אוטומטית
- ✅ בדיקות רצות בכל commit
- ✅ artifacts נשמרים בכישלון
- ✅ דיווח HTML זמין

### ⚠️ מתי לא להשתמש

- ❌ אין תשתית בדיקות (הריצו testarch-framework קודם)
- ❌ בדיקות לא יציבות (תקנו flakiness קודם)
- ❌ אין repository Git

### 🔗 וורקפלואים קשורים

**לפני:**
- `testarch-framework` - תשתית בדיקות
- `testarch-atdd` או `testarch-automate` - יצירת בדיקות

**אחרי:**
- `testarch-trace` - מיפוי כיסוי
- `testarch-nfr` - בדיקות NFR

### 🐛 פתרון בעיות

**בעיה: "Pipeline נכשל - מציאת Node"**
- **פתרון:** הוסיפו `.nvmrc` עם גרסת Node. CI יזהה אוטומטית.

**בעיה: "בדיקות עוברות local, נכשלות ב-CI"**
- **פתרון:** environment variables. יצרו `.env.ci` והוסיפו ל-pipeline:
  ```yaml
  - run: cp .env.ci .env
  ```

**בעיה: "Artifacts תופסים יותר מדי מקום"**
- **פתרון:** שמרו רק בכישלון:
  ```yaml
  if: failure()
  ```

### 🎓 טיפים מתקדמים

**1. Selective Testing - רק מה שהשתנה**
```yaml
- name: Get changed files
  id: changed
  run: |
    git diff --name-only ${{ github.event.before }} > changed.txt

- name: Run selective tests
  run: |
    if grep -q "src/auth" changed.txt; then
      npm run test:e2e -- auth.spec.ts
    fi
```

**2. Parallel Execution - מהיר יותר**
```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
```

**3. Burn-in רק ל-Flaky Tests**
```yaml
- name: Identify flaky tests
  run: npm run test:e2e -- --grep @flaky --repeat-each=5
```

---

## testarch-test-review - ביקורת איכות בדיקות

### 🎯 מטרה

סקירה מקצועית של איכות הבדיקות מול knowledge base מקיף של best practices. מזהה בעיות נפוצות, מציע שיפורים, ומוודא עמידה בתקנים.

### 📥 תשומות נדרשות

- קובץ/תיקיית בדיקות לסקירה
- Story markdown (אופציונלי - לקונטקסט)
- test-design document (אופציונלי - לעדיפויות)

### 📤 פלט צפוי

**דוח ביקורת מפורט:**
```markdown
## Test Review Report

### Summary
- Files reviewed: 5
- Issues found: 12 (3 critical, 5 medium, 4 minor)
- Overall quality score: 7.5/10

### Critical Issues
1. Hard waits detected (await page.waitForTimeout(3000))
2. Missing auto-cleanup in fixtures
3. Brittle CSS selectors without data-testid

### Recommendations
[רשימת שיפורים ממוקדת]
```

### ⏱️ זמן משוער

- קובץ בודד: 5-10 דקות
- תיקייה: 20-30 דקות
- Suite שלם: 45-60 דקות

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה ל-test quality

### 📋 תהליך שלב אחר שלב

**שלב 1: טעינת Knowledge Base**
```
TEA טוען אוטומטית:
- test-quality.md
- selector-resilience.md
- timing-debugging.md
- test-healing-patterns.md
- fixture-architecture.md
```

**שלב 2: ניתוח הבדיקות**
```
סריקה אוטומטית:
✅ מבנה Given-When-Then
✅ data-testid selectors
✅ network-first pattern
✅ auto-cleanup בfixtures
✅ atomic assertions
✅ no hard waits
✅ deterministic data
```

**שלב 3: זיהוי Anti-patterns**
```
❌ await page.waitForTimeout(3000)  // Hard wait
❌ page.locator('.class-123')       // Brittle selector
❌ email: 'test@example.com'        // Hardcoded data
❌ multiple assertions per test     // Not atomic
❌ no cleanup after test            // Leaked data
```

**שלב 4: יצירת דוח**
```markdown
### Critical Issues (חובה לתקן)
- 3 hard waits → replace with waitForSelector
- 5 brittle selectors → add data-testid

### Medium Issues (מומלץ לתקן)
- Missing Given-When-Then comments
- Hardcoded test data (use faker)

### Minor Issues (nice-to-have)
- Tests could be more atomic
- Consider splitting into smaller files
```

### 💡 דוגמה מעשית

**תרחיש:** ביקורת לפני merge

```
1. @tea תעשה test-review על tests/e2e/checkout.spec.ts
2. TEA מזהה:
   - ❌ Hard wait: waitForTimeout(5000)
   - ❌ Selector: .btn-primary (לא יציב)
   - ❌ Data: email: 'test@test.com' (hardcoded)
   - ✅ Given-When-Then: יש
   - ✅ Cleanup: יש
3. TEA מציע תיקונים:
```

**לפני (בעייתי):**
```typescript
test('checkout flow', async ({ page }) => {
  await page.goto('/cart');
  await page.waitForTimeout(5000); // ❌ Hard wait
  await page.click('.btn-primary'); // ❌ Brittle
  // ... הרבה assertions // ❌ Not atomic
});
```

**אחרי (מתוקן):**
```typescript
test('should display checkout button on cart page', async ({ page }) => {
  // GIVEN: User is on cart page with items
  await page.goto('/cart');
  await page.waitForSelector('[data-testid="checkout-btn"]'); // ✅
  
  // WHEN: Page loads
  const btn = page.locator('[data-testid="checkout-btn"]'); // ✅
  
  // THEN: Checkout button is visible
  await expect(btn).toBeVisible(); // ✅ Atomic
});
```

### ⚠️ מתי לא להשתמש

- ❌ בדיקות פשוטות מאוד (1-2 שורות)
- ❌ ליצור בדיקות חדשות (השתמשו ב-atdd)
- ❌ לתקן bugs (השתמשו ב-dev-story)

### 🔗 וורקפלואים קשורים

**לפני:**
- `testarch-atdd` או `testarch-automate` - יצירת בדיקות

**אחרי:**
- תיקון הבעיות המזוהות
- `testarch-trace` - מיפוי כיסוי

### 🐛 פתרון בעיות

**בעיה: "מדווח false positives"**
- **פתרון:** TEA משתמש ב-knowledge base מוכח. אם זה נראה false positive, שאלו "למה זה נחשב בעיה?"

**בעיה: "יותר מדי issues - לא יודע מאיפה להתחיל"**
- **פתרון:** התחילו מ-Critical. התעלמו מ-Minor בשלב ראשון.

**בעיה: "לא מבין את ההמלצות"**
- **פתרון:** בקשו דוגמה מלאה: "תראה לי איך לתקן את hard wait הזה"

### 🎓 טיפים מתקדמים

**1. Pre-commit Hook**
```bash
# .husky/pre-commit
npm run test:review-changed
```

**2. CI Integration**
```yaml
- name: Test quality check
  run: npx playwright test-review tests/
  continue-on-error: true  # Warning only
```

**3. טיפים לביקורת עצמית**
```
לפני commit:
✅ יש Given-When-Then comments?
✅ משתמש ב-data-testid?
✅ אין hard waits?
✅ יש auto-cleanup?
✅ assertions atomic (אחד לבדיקה)?
```

---

## testarch-trace - מיפוי כיסוי דרישות

### 🎯 מטרה

יצירת **traceability matrix** המקשרת דרישות לבדיקות, ניתוח כיסוי, והחלטת **Quality Gate** (PASS/CONCERNS/FAIL/WAIVED). מוודא שכל דרישה מכוסה ושכל בדיקה קריטית עוברת.

### 📥 תשומות נדרשות

- Story markdown עם acceptance criteria
- קבצי בדיקות (E2E/API/Component/Unit)
- test-design document (לסיווג סיכונים)
- test results מ-CI/CD (לגייט החלטה)

### 📤 פלט צפוי

**Traceability Matrix:**
```markdown
| Requirement ID | Description        | Test Level | Test File           | Priority | Status |
|----------------|--------------------|------------|---------------------|----------|--------|
| AC-001         | User can login     | E2E        | auth/login.spec.ts  | P0       | ✅ Pass |
| AC-002         | Login shows error  | E2E        | auth/login.spec.ts  | P0       | ✅ Pass |
| AC-003         | Dashboard displays | API        | api/dashboard.spec  | P1       | ❌ Fail |
```

**Quality Gate Decision:**
```yaml
gate_decision: CONCERNS  # PASS | CONCERNS | FAIL | WAIVED
gate_timestamp: 2024-11-05T14:30:00Z
decision_factors:
  - P0 pass rate: 100% ✅
  - P1 pass rate: 90% ⚠️ (threshold: 95%)
  - High-risk mitigations: 100% ✅
  - Coverage: 85% ✅

recommendation: "Fix 1 P1 test failure before release"
```

### ⏱️ זמן משוער

15-30 דקות (תלוי בגודל Story)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה ל-traceability

### 📋 תהליך שלב אחר שלב

**שלב 1: קריאת Acceptance Criteria**
```
מה-Story:
AC-001: User can log in with valid credentials
AC-002: System shows error for invalid credentials
AC-003: Dashboard displays user name after login
```

**שלב 2: סריקת בדיקות**
```
חיפוש בקבצי בדיקות:
- test.describe('User Login', ...)
- test('should login with valid credentials', ...)
- test('should show error for invalid', ...)
```

**שלב 3: מיפוי דרישות לבדיקות**
```
AC-001 → tests/e2e/auth/login.spec.ts:15 [P0]
AC-002 → tests/e2e/auth/login.spec.ts:28 [P0]
AC-003 → tests/api/dashboard.spec.ts:42 [P1]
```

**שלב 4: ניתוח כיסוי**
```
✅ Covered: 3/3 requirements (100%)
⚠️ Gaps: None
✅ P0 coverage: 2/2 (100%)
✅ P1 coverage: 1/1 (100%)
```

**שלב 5: Quality Gate Decision**
```
קריאת test results:
- P0 tests: 2 passed, 0 failed → 100% ✅
- P1 tests: 0 passed, 1 failed → 0% ❌

Decision: CONCERNS
Reason: P1 test failing (threshold: 95%)
Action: Fix dashboard test before release
```

### 💡 דוגמה מעשית

**תרחיש:** בדיקת כיסוי לפני release

```
1. @tea תריץ testarch-trace עבור Story-42
2. TEA קורא:
   - Story-42.md (4 acceptance criteria)
   - tests/ (מוצא 6 בדיקות)
   - test-results/ (CI results)
3. TEA יוצר:
   - Traceability matrix (מקשר 4 AC ל-6 tests)
   - Coverage analysis (100% covered)
   - Gate decision (PASS - כל הבדיקות עברו)
```

**Matrix:**
```markdown
| AC | Description          | Tests | Priority | Result |
|----|----------------------|-------|----------|--------|
| 1  | Login success        | 2     | P0       | ✅ Pass |
| 2  | Login error          | 2     | P0       | ✅ Pass |
| 3  | Dashboard loads      | 1     | P1       | ✅ Pass |
| 4  | Logout works         | 1     | P1       | ✅ Pass |

Coverage: 4/4 AC (100%)
Gate Decision: ✅ PASS - All critical tests passing
```

### ⚠️ מתי לא להשתמש

- ❌ אין Story/דרישות מוגדרות
- ❌ אין בדיקות (צרו קודם עם atdd)
- ❌ בדיקות לא רצו עדיין (הריצו ב-CI קודם)

### 🔗 וורקפלואים קשורים

**לפני:**
- `testarch-test-design` - זיהוי סיכונים
- `testarch-atdd` או `testarch-automate` - יצירת בדיקות
- הרצת בדיקות ב-CI (testarch-ci)

**אחרי:**
- `testarch-nfr` - בדיקות NFR
- `solutioning-gate-check` - gate כללי

### 🐛 פתרון בעיות

**בעיה: "לא מוצא בדיקות ל-AC מסוים"**
- **פתרון:** gap בכיסוי. צרו בדיקה חסרה או עדכנו traceability.

**בעיה: "כל הבדיקות עוברות אבל Gate=FAIL"**
- **פתרון:** יש high-risk items לא מטופלים. בדקו test-design.

**בעיה: "Gate מדווח CONCERNS - מה עושים?"**
- **פתרון:** קראו `recommendation` ב-output. בדרך כלל צריך לתקן P1 failures.

### 🎓 טיפים מתקדמים

**1. Gate בכל PR**
```yaml
# .github/workflows/pr.yml
- name: Quality gate check
  run: npx bmad testarch-trace
  
- name: Block merge on FAIL
  run: |
    gate=$(grep "gate_decision" traceability.yaml | cut -d: -f2)
    if [ "$gate" == "FAIL" ]; then
      exit 1
    fi
```

**2. Traceability Tags בבדיקות**
```typescript
test('AC-001: should login successfully @P0 @auth', async ({ page }) => {
  // TEA יזהה אוטומטית AC-001 מה-description
});
```

**3. Coverage Dashboard**
```
השתמשו ב-trace output ליצירת dashboard:
- Coverage per epic
- Gate history (PASS/FAIL trends)
- High-risk items status
```

---

## testarch-nfr - הערכת דרישות לא-פונקציונליות

### 🎯 מטרה

הערכה מקיפה של **Non-Functional Requirements (NFR)** לפני release: **ביצועים**, **אבטחה**, **אמינות**, **תחזוקתיות**. מספק validation מבוססת ראיות והחלטת go/no-go לייצור.

### 📥 תשומות נדרשות

- Story/tech-spec עם דרישות NFR
- test results (performance, security, etc.)
- metrics אפליקטיביים (response times, error rates)
- logs (לניתוח אמינות)
- CI results (לבדיקת burn-in)

### 📤 פלט צפוי

**NFR Assessment Report:**
```markdown
## NFR Assessment Summary

### Performance: ✅ PASS
- Response time: 150ms (target: <200ms)
- Throughput: 500 req/s (target: >100 req/s)
- P95 latency: 280ms (target: <500ms)

### Security: ⚠️ CONCERNS
- Authentication: ✅ Working
- Authorization: ✅ Role-based
- SQL Injection: ⚠️ Not tested (recommendation: add tests)

### Reliability: ✅ PASS
- Uptime: 99.9% (target: >99%)
- Error rate: 0.1% (target: <1%)
- Recovery time: 2min (target: <5min)

### Maintainability: ✅ PASS
- Code coverage: 85% (target: >80%)
- Documentation: Complete
- Test quality: High

**Overall Decision: ⚠️ CONCERNS**
Recommendation: Add SQL injection tests before release
```

### ⏱️ זמן משוער

45-60 דקות (ניתוח מקיף של כל NFR categories)

### 🤖 אג'נט מומלץ

**Murat (TEA)** - מומחה ל-NFR

### 📋 תהליך שלב אחר שלב

**שלב 1: קריאת NFR targets**
```
מ-tech-spec או Story:
- Performance: Response time <200ms
- Security: OWASP Top 10 covered
- Reliability: Uptime >99%
- Maintainability: Coverage >80%
```

**שלב 2: איסוף ראיות**
```
- Performance metrics: test-results/performance.json
- Security scan: security-report.html
- Logs analysis: app-logs/*.log
- Coverage report: coverage/coverage-summary.json
```

**שלב 3: הערכה לפי category**

**Performance:**
```
✅ Response time: 150ms (target: <200ms)
✅ Throughput: 500 req/s
✅ P95: 280ms
→ PASS
```

**Security:**
```
✅ Authentication tested
✅ Authorization tested
⚠️ SQL Injection NOT tested
→ CONCERNS
```

**Reliability:**
```
✅ 99.9% uptime (3 months)
✅ 0.1% error rate
→ PASS
```

**Maintainability:**
```
✅ 85% code coverage
✅ All docs complete
→ PASS
```

**שלב 4: החלטה כוללת**
```
Performance: PASS
Security: CONCERNS
Reliability: PASS
Maintainability: PASS

Overall: CONCERNS
Blocker: SQL Injection tests missing
Action: Add security tests before release
```

### 💡 דוגמה מעשית

**תרחיש:** NFR check לפני production release

```
1. @tea תריץ testarch-nfr עבור release v2.0
2. TEA אוסף:
   - Performance: Lighthouse scores
   - Security: npm audit + OWASP check
   - Reliability: Error logs מ-3 חודשים
   - Maintainability: Coverage reports
3. TEA מזהה:
   - ✅ Performance: מעולה (95+ lighthouse)
   - ⚠️ Security: 2 medium vulnerabilities
   - ✅ Reliability: 99.95% uptime
   - ✅ Maintainability: 88% coverage
4. Decision: CONCERNS
   Recommendation: "תקנו 2 vulnerabilities לפני release"
```

**דוח מפורט:**
```markdown
### Security Findings

⚠️ MEDIUM: Outdated dependency (express 4.16.0)
   Impact: Known XSS vulnerability
   Fix: npm update express@latest
   Timeline: Before release

⚠️ MEDIUM: Missing rate limiting on /api/login
   Impact: Brute force attacks possible
   Fix: Add express-rate-limit middleware
   Timeline: Before release

✅ All OWASP Top 10 covered in tests
```

### ⚠️ מתי לא להשתמש

- ❌ תחילת פיתוח (אין מה להעריך)
- ❌ אין targets מוגדרים (הגדירו ב-tech-spec קודם)
- ❌ אין metrics/logs (אספו נתונים קודם)

### 🔗 וורקפלואים קשורים

**לפני:**
- `tech-spec` או `architecture` - הגדרת NFR targets
- `testarch-framework` + בדיקות - איסוף metrics
- CI runs - burn-in validation

**אחרי:**
- תיקון NFR gaps
- `testarch-trace` - gate decision כולל
- Production deployment

### 🐛 פתרון בעיות

**בעיה: "אין metrics זמינים"**
- **פתרון:** הריצו בדיקות performance או אספו מ-production monitoring.

**בעיה: "כל NFR עובר אבל Decision=FAIL"**
- **פתרון:** יש קטגוריה קריטית missing. בדקו tech-spec targets.

**בעיה: "לא יודע איך למדוד reliability"**
- **פתרון:** TEA מציע metrics: uptime, error rate, MTTR, MTBF.

### 🎓 טיפים מתקדמים

**1. Automated NFR Pipeline**
```yaml
# .github/workflows/nfr.yml
- name: Performance test
  run: npm run test:performance
  
- name: Security scan
  run: npm audit --audit-level=moderate
  
- name: NFR Assessment
  run: npx bmad testarch-nfr
```

**2. NFR Targets ב-Code**
```typescript
// performance.config.ts
export const NFR_TARGETS = {
  performance: {
    responseTime: 200,  // ms
    throughput: 100,    // req/s
    p95Latency: 500,    // ms
  },
  security: {
    owasp: 'top10-covered',
    vulnerabilities: 'none-high',
  },
};
```

**3. Continuous NFR Monitoring**
```
שילוב עם monitoring:
- Datadog/New Relic → Auto-collect metrics
- Weekly NFR reports
- Alerts on threshold violations
```

---

## 🎯 סיכום: מתי להשתמש בכל workflow?

### מפת החלטות מהירה

```
האם יש לך תשתית בדיקות?
├─ לא → testarch-framework (התחל כאן!)
└─ כן → המשך ↓

האם אתה מתחיל Story חדש?
├─ כן → testarch-test-design (תכנן קודם)
│       └→ testarch-atdd (כתוב בדיקות failing)
└─ לא → המשך ↓

האם קוד כבר קיים ללא בדיקות?
├─ כן → testarch-automate (הוסף בדיקות)
└─ לא → המשך ↓

האם צריך CI/CD?
├─ כן → testarch-ci (הגדר pipeline)
└─ לא → המשך ↓

האם בדיקות כבר קיימות?
├─ כן → testarch-test-review (שפר איכות)
│       └→ testarch-trace (בדוק כיסוי)
│           └→ testarch-nfr (בדוק NFR לפני release)
└─ לא → חזור ל-testarch-atdd
```

### טבלת השוואה

| Workflow | מתי? | זמן | פלט עיקרי |
|----------|------|-----|-----------|
| **framework** | התחלה - אין תשתית | 1-2h | playwright/cypress setup |
| **test-design** | לפני פיתוח - תכנון | 1-1.5h | Risk matrix + coverage plan |
| **atdd** | לפני פיתוח - TDD | 1.5-2h | Failing tests (RED phase) |
| **automate** | אחרי פיתוח - הוספה | 1-2h | Additional test coverage |
| **ci** | הגדרת pipeline | 30-45min | GitHub Actions / GitLab CI |
| **test-review** | שיפור איכות | 20-45min | Quality report + fixes |
| **trace** | בדיקת כיסוי | 15-30min | Traceability matrix + gate |
| **nfr** | לפני release | 45-60min | NFR assessment + decision |

### רצף עבודה מומלץ

**🌟 Happy Path (פרויקט חדש):**
```
1. testarch-framework        [פעם אחת]
   ↓
2. testarch-ci               [פעם אחת]
   ↓
3. לכל Story:
   a. testarch-test-design   [תכנון]
   b. testarch-atdd          [כתיבת בדיקות]
   c. dev-story              [פיתוח]
   d. testarch-test-review   [ביקורת]
   e. testarch-trace         [כיסוי]
   ↓
4. לפני Release:
   testarch-nfr              [NFR check]
```

**🔧 Brownfield (קוד קיים):**
```
1. testarch-framework        [אם אין]
   ↓
2. testarch-automate         [הוסף בדיקות]
   ↓
3. testarch-test-review      [שפר איכות]
   ↓
4. testarch-ci               [הוסף pipeline]
   ↓
5. testarch-trace            [מפה כיסוי]
```

---

## 🎓 משאבים נוספים

### קבצים קשורים

- `bmad/bmm/workflows/testarch/` - כל workflows
- `bmad/bmm/testarch/tea-index.csv` - Knowledge base index
- `bmad/bmm/docs/testing-guide.md` - מדריך מקיף

### דוגמאות מלאות

ראו:
- `examples/testing/` - דוגמאות קוד
- `examples/workflows/` - הרצות workflow מלאות

### למידה נוספת

1. **Playwright Docs**: https://playwright.dev
2. **Cypress Docs**: https://docs.cypress.io
3. **Test-Driven Development**: Kent Beck's book
4. **Testing Best Practices**: Martin Fowler's blog

---

## 💡 טיפים לסיום

### Do's ✅

1. **תמיד התחילו מ-framework** - תשתית יציבה = בדיקות יציבות
2. **תכננו לפני שאתם כותבים** - test-design חוסך זמן
3. **TDD = RED-GREEN-REFACTOR** - atdd קודם, פיתוח אחר כך
4. **בדקו איכות** - test-review מונע technical debt
5. **מפו כיסוי** - trace מוודא שלא פספסתם דרישות

### Don'ts ❌

1. **אל תדלגו על framework** - בדיקות ללא תשתית = כאוס
2. **אל תכתבו בדיקות אחרי הכל** - איכות נמוכה יותר
3. **אל תתעלמו מ-NFR** - performance/security קריטיים
4. **אל תכתבו בדיקות ידניות** - automate הכל
5. **אל תשכחו CI** - בדיקות שלא רצות = חסרות ערך

---

<div align="center">

## 🎉 סיימתם את חלק 4: Testing Workflows!

**המשיכו ל:**
- [חלק 5: CIS Workflows + סיכום](./03-workflows-part-5-cis-synthesis.md) - וורקפלואי יצירתיות וחדשנות

**או חזרו ל:**
- [תוכן עניינים ראשי](./README.md)
- [חלק 3: פיתוח](./03-workflows-part-3c-development.md)

</div>

</div>