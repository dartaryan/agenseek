# שאלות ותשובות - התקנה והגדרה (FAQ Part 1B)

> **מדריך פתרון בעיות** למי שנתקל בבעיות בהתקנת BMAD או באינטגרציה ל-IDE

---

## 📋 תוכן עניינים

1. [ההתקנה נכשלה - מה לעשות?](#1-ההתקנה-נכשלה---מה-לעשות)
2. [לא מוצא את Node.js - איך לתקן?](#2-לא-מוצא-את-nodejs---איך-לתקן)
3. [בעיות עם אינטגרציה ל-IDE - פתרונות?](#3-בעיות-עם-אינטגרציה-ל-ide---פתרונות)
4. [שגיאות בקונפיגורציה - איך לפתור?](#4-שגיאות-בקונפיגורציה---איך-לפתור)
5. [בעיות בעדכון BMAD - מה עושים?](#5-בעיות-בעדכון-bmad---מה-עושים)
6. [איך לוודא שההתקנה הצליחה?](#6-איך-לוודא-שההתקנה-הצליחה)
7. [במה להשתמש - Claude Code או Cursor?](#7-במה-להשתמש---claude-code-או-cursor)
8. [היכן נמצאים קבצי התצורה?](#8-היכן-נמצאים-קבצי-התצורה)
9. [איך למחוק ולהתקין מחדש?](#9-איך-למחוק-ולהתקין-מחדש)
10. [בעיות עם הרשאות קבצים - פתרון?](#10-בעיות-עם-הרשאות-קבצים---פתרון)

---

## 1. ההתקנה נכשלה - מה לעשות?

### ❓ שאלה

הרצתי `npx bmad-method@alpha install` והתקבלה שגיאה. מה עושים?

**תשובה קצרה:** בדקו את הודעת השגיאה המדויקת והתחילו מאבחון בסיסי - Node.js, גרסה, חיבור לאינטרנט, והרשאות.

**תשובה מפורטת:**

כשהתקנה נכשלת, הסיבה הנפוצה ביותר היא בעיית תלויות או הרשאות. השגיאה תמיד מכילה רמז למה קרה. שגיאות נפוצות כוללות: `EACCES` (בעיית הרשאות), `ECONNREFUSED` (בעיית רשת), או `MODULE_NOT_FOUND` (חסרה תלות). 

ההתקנה של BMAD מורכבת משלושה שלבים עיקריים: הורדת החבילה מ-npm, התקנת התלויות, ויצירת קבצי התצורה ב-IDE. כל שלב יכול להיכשל, אבל הודעת השגיאה תספר לכם בדיוק איפה.

**פתרון שלב אחר שלב:**

1. **קראו את השגיאה בקפידה** - החלק האחרון בדרך כלל מכיל את המידע החשוב
2. **בדקו גרסת Node.js** - הריצו `node --version` (צריך להיות לפחות v20.0.0)
3. **בדקו חיבור לאינטרנט** - הריצו `npm ping` כדי לוודא גישה ל-npm registry
4. **נסו להריץ עם sudo/admin** (Linux/Mac):
   ```bash
   sudo npx bmad-method@alpha install
   ```
   או ב-Windows, פתחו PowerShell כ-Administrator
5. **נקו את cache של npm** והריצו שוב:
   ```bash
   npm cache clean --force
   npx bmad-method@alpha install
   ```
6. **נסו להתקין במיקום אחר** - צרו תיקייה חדשה ללא רווחים או תווים מיוחדים בשם

**אם זה לא עבד:**

- **שגיאת EACCES (הרשאות)**: תקנו הרשאות npm גלובליות:
  ```bash
  # Linux/Mac
  sudo chown -R $(whoami) ~/.npm
  ```
- **שגיאת network timeout**: השתמשו ב-registry חליפי:
  ```bash
  npm config set registry https://registry.npmjs.org/
  ```
- **שגיאת incompatible**: עדכנו את Node.js לגרסה האחרונה של LTS

**קישורים רלוונטיים:**
- [מדריך התחלה מהירה - צעד 2](./00-התחלה-מהירה-לכולם.md#צעד-2-הריצו-את-פקודת-ההתקנה)
- [מילון מונחים - npm](./01-מילון-מונחים-מלא.md#npm)

---

## 2. לא מוצא את Node.js - איך לתקן?

### ❓ שאלה

המערכת אומרת `'node' is not recognized` או `command not found`. מה זה אומר?

**תשובה קצרה:** Node.js לא מותקן או לא נמצא ב-PATH של המערכת. צריך להתקין או לתקן את ה-PATH.

**תשובה מפורטת:**

השגיאה הזו מתרחשת כאשר המערכת ההפעלה לא מוצאת את Node.js במשתנה הסביבה PATH. זה יכול לקרות אם Node.js לא מותקן בכלל, אם ההתקנה לא הצליחה, או אם הנתיב לא נוסף אוטומטית ל-PATH במהלך ההתקנה. ב-Windows זה קורה יותר כי לפעמים צריך לסגור ולפתוח מחדש את ה-Terminal אחרי ההתקנה.

**פתרון שלב אחר שלב:**

1. **בדקו אם Node.js באמת מותקן**:
   - Windows: חפשו "Node.js" בתפריט Start
   - Mac: חפשו את `/usr/local/bin/node`
   - Linux: הריצו `which node`

2. **אם Node.js לא מותקן - הורידו והתקינו**:
   - לכו ל-https://nodejs.org
   - הורידו את גרסת LTS (המומלצת)
   - הריצו את המתקין ועקבו אחרי ההוראות
   - **חשוב:** בחרו באופציה "Add to PATH" בזמן ההתקנה

3. **אם Node.js מותקן אבל לא עובד**:
   - **Windows**: סגרו ופתחו מחדש את PowerShell/CMD
   - **Mac/Linux**: הריצו `source ~/.bashrc` או `source ~/.zshrc`

4. **תקנו את PATH ידנית** (אם עדיין לא עובד):
   - **Windows**: הוסיפו `C:\Program Files\nodejs\` ל-PATH
   - **Mac/Linux**: הוסיפו לקובץ `~/.bashrc`:
     ```bash
     export PATH="/usr/local/bin:$PATH"
     ```

**אם זה לא עבד:**

- נסו להתקין דרך **nvm** (Node Version Manager) - מנהל גרסאות שמטפל ב-PATH אוטומטית:
  ```bash
  # Mac/Linux
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install --lts
  ```
- בדקו אם יש התנגשות עם התקנה קודמת - הסירו גרסאות ישנות לפני התקנה מחדש

**קישורים רלוונטיים:**
- [מדריך התחלה מהירה - צעד 1](./00-התחלה-מהירה-לכולם.md#צעד-1-תוודאו-שיש-לכם-nodejs)
- [Node.js דף הורדה רשמי](https://nodejs.org)

---

## 3. בעיות עם אינטגרציה ל-IDE - פתרונות?

### ❓ שאלה

BMAD התקין אבל לא רואה את האג'נטים ב-Claude Code / Cursor. מה הבעיה?

**תשובה קצרה:** ההתקנה יצרה קבצים אבל ה-IDE לא זיהה אותם אוטומטית. צריך לרענן או לעדכן את ה-IDE.

**תשובה מפורטת:**

כל IDE עובד אחרת עם BMAD. Claude Code משתמש בקבצי slash commands בתיקייה `.claude/commands/bmad/`, Cursor משתמש ב-rules ב-`.cursor/rules/bmad/`, ו-Windsurf משתמש ב-`.windsurf/rules/bmad/`. לפעמים ההתקנה יוצרת את הקבצים אבל ה-IDE לא טוען אותם אוטומטית כי הוא כבר פועל. זה במיוחד נפוץ אם ה-IDE היה פתוח בזמן ההתקנה.

במקרים אחרים, יכול להיות שה-IDE שנבחר בזמן ההתקנה לא תואם למה שבאמת משתמשים. למשל, בחרתם "VS Code" אבל אתם עובדים עם Cursor, אז הקבצים נוצרו בתיקייה הלא נכונה.

**פתרון שלב אחר שלב:**

1. **וודאו שההתקנה יצרה את הקבצים**:
   - **Claude Code**: בדקו אם קיימת תיקייה `.claude/commands/bmad/`
   - **Cursor**: בדקו אם קיימת תיקייה `.cursor/rules/bmad/`
   - **Windsurf**: בדקו אם קיימת תיקייה `.windsurf/rules/bmad/`

2. **רעננו את ה-IDE**:
   - סגרו את הפרויקט לגמרי
   - סגרו את כל חלונות ה-IDE
   - פתחו מחדש ופתחו את התיקייה מחדש

3. **בדקו שאתם משתמשים ב-IDE הנכון**:
   - אם אתם ב-Cursor אבל נוצרה תיקיית `.claude/` - צריך להריץ install שוב ולבחור Cursor

4. **בדקו את קבצי האג'נטים**:
   - **Claude Code**: האג'נטים צריכים להיות בשם `{agent-name}.md`
   - **Cursor**: האג'נטים צריכים להיות בשם `{agent-name}.md` עם frontmatter מיוחד

5. **נסו לטעון אג'נט ידנית**:
   - **Claude Code**: כתבו `/` ובדקו אם רואים slash commands
   - **Cursor**: כתבו `@` ובדקו אם רואים rules

**אם זה לא עבד:**

- **Claude Code**: התקינו מחדש עם `npx bmad-method@alpha install --ide claude-code --force`
- **Cursor**: התקינו מחדש עם `npx bmad-method@alpha install --ide cursor --force`
- **אם יש קבצים אבל לא רואים**: רעננו את ה-index של ה-IDE:
  - Cursor: Command Palette → "Reload Window"
  - Claude Code: Command Palette → "Reload Window"

**קישורים רלוונטיים:**
- [מדריך Claude Code](../../docs/ide-info/claude-code.md)
- [מדריך Cursor](../../docs/ide-info/cursor.md)
- [מדריך התחלה - שלב 1](./00-התחלה-מהירה-לכולם.md#שלב-1-פתחו-את-האגנט-הראשון-שלכם)

---

## 4. שגיאות בקונפיגורציה - איך לפתור?

### ❓ שאלה

האג'נט אומר `config not loaded` או `user_name undefined`. מה זה אומר?

**תשובה קצרה:** קובץ התצורה הראשי חסר או פגום. צריך לתקן או ליצור מחדש את `bmad/core/config.yaml`.

**תשובה מפורטת:**

השגיאה הזו קורית כאשר האג'נט BMad Master מנסה לטעון את קובץ התצורה `bmad/core/config.yaml` ולא מוצא אותו או שהקובץ לא מכיל את כל השדות הנדרשים. הקובץ הזה נוצר בזמן ההתקנה ומכיל מידע קריטי כמו השם שלכם, שפת התקשורת, ותיקיית הפלט. בלי הקובץ הזה, האג'נטים לא יכולים לעבוד כי הם לא יודעים איך לפנות אליכם ובאיזו שפה לכתוב.

**פתרון שלב אחר שלב:**

1. **בדקו אם הקובץ קיים**:
   ```bash
   # בדקו שקיים:
   cat bmad/core/config.yaml
   # או ב-Windows:
   type bmad\core\config.yaml
   ```

2. **אם הקובץ קיים אבל ריק או לא מלא** - ערכו אותו:
   ```yaml
   user_name: השם שלכם
   communication_language: Hebrew
   document_output_language: Hebrew
   output_folder: '{project-root}/docs'
   ```

3. **אם הקובץ לא קיים** - צרו אותו ידנית:
   - צרו קובץ בשם `config.yaml` בתיקייה `bmad/core/`
   - העתיקו את התוכן מלמעלה והתאימו את הערכים שלכם

4. **וודאו שהמבנה תקין**:
   - שימו לב ל-indentation (רווחים, לא tabs)
   - וודאו שאין תווים מיוחדים בשם המשתמש
   - וודאו ש-`communication_language` הוא `English` או `Hebrew`

**אם זה לא עבד:**

- הריצו את ההתקנה שוב אבל **רק את קובץ התצורה**:
  ```bash
  npx bmad-method@alpha install --config-only
  ```
- אם זה לא עובד, מחקו את כל תיקיית `bmad/` והריצו התקנה מלאה מחדש

**קישורים רלוונטיים:**
- [מילון מונחים - config.yaml](./01-מילון-מונחים-מלא.md#config)
- [מדריך התחלה מהירה](./00-התחלה-מהירה-לכולם.md)

---

## 5. בעיות בעדכון BMAD - מה עושים?

### ❓ שאלה

ניסיתי לעדכן BMAD לגרסה חדשה והתקבלה שגיאה או שלא השתנה כלום. איך מעדכנים נכון?

**תשובה קצרה:** עדכון BMAD דורש הרצת פקודת ההתקנה מחדש. היא תשמור על ההגדרות שלכם ותעדכן רק את המודולים.

**תשובה מפורטת:**

BMAD v6 תוכנן כך שעדכונים לא משפיעים על ההתאמות האישיות שלכם. כשאתם מריצים `npx bmad-method@alpha install` על התקנה קיימת, המערכת מזהה שיש כבר `bmad/_cfg/` עם הקונפיגורציה שלכם ושומרת אותה. היא רק מעדכנת את המודולים עצמם ואת האג'נטים/וורקפלואים החדשים. אבל לפעמים זה נכשל אם יש קונפליקטים או אם הגרסה החדשה דורשת שינויים במבנה.

**פתרון שלב אחר שלב:**

1. **גבו את ההגדרות האישיות** (למקרה שיהיה קונפליקט):
   ```bash
   # גבו את התיקייה
   cp -r bmad/_cfg/ bmad/_cfg_backup/
   # או ב-Windows:
   xcopy bmad\_cfg bmad\_cfg_backup /E /I
   ```

2. **הריצו את פקודת העדכון**:
   ```bash
   npx bmad-method@alpha install
   ```
   המערכת תשאל אתכם אם לשמור על ההגדרות - בחרו **Yes**

3. **בדקו את הגרסה החדשה**:
   ```bash
   cat bmad/core/config.yaml
   # וודאו ששדה version מעודכן
   ```

4. **אם הייתה שגיאה** - נסו עם force:
   ```bash
   npx bmad-method@alpha install --force
   ```

**אם זה לא עבד:**

- **שגיאת merge conflict**: אם קיבלתם שגיאה על קונפליקט:
  1. שחזרו את הגיבוי: `cp -r bmad/_cfg_backup/* bmad/_cfg/`
  2. הריצו `npx bmad-method@alpha install --preserve-config`
  
- **שגיאת permissions**: הריצו עם sudo/admin
  ```bash
  sudo npx bmad-method@alpha install
  ```

**קישורים רלוונטיים:**
- [CHANGELOG](../../CHANGELOG.md) - מה השתנה בכל גרסה
- [מדריך שדרוג מ-v4 ל-v6](../../docs/v4-to-v6-upgrade.md)

---

## 6. איך לוודא שההתקנה הצליחה?

### ❓ שאלה

ההתקנה הסתיימה אבל אני לא בטוח שהכל תקין. איך אני בודק שהכל עבד?

**תשובה קצרה:** בדקו שקיימת תיקיית `bmad/` עם כל המודולים, קובץ `config.yaml` תקין, ושה-IDE שלכם רואה את האג'נטים.

**תשובה מפורטת:**

התקנה מוצלחת של BMAD יוצרת מספר תיקיות וקבצים במבנה מסוים. התיקייה הראשית היא `bmad/` שמכילה מודולים כמו `core/`, `bmm/`, `bmb/`, ו-`cis/`. בתוך כל מודול יש תיקיות `agents/` ו-`workflows/`. בנוסף, צריכה להיווצר תיקיית `bmad/_cfg/` עם קבצי manifest וקונפיגורציה. אם כל זה קיים ו-IDE רואה את האג'נטים, ההתקנה הצליחה.

**פתרון שלב אחר שלב:**

1. **בדקו שהמבנה הבסיסי קיים**:
   ```bash
   ls bmad/
   # אמורים לראות: core, bmm, bmb, cis, _cfg, docs
   ```

2. **בדקו שקובץ התצורה תקין**:
   ```bash
   cat bmad/core/config.yaml
   # אמורים לראות: user_name, communication_language, etc.
   ```

3. **בדקו שיש אג'נטים**:
   ```bash
   ls bmad/bmm/agents/
   # אמורים לראות: pm.md, dev.md, architect.md, וכו'
   ```

4. **בדקו את אינטגרציית ה-IDE**:
   - **Claude Code**: `ls .claude/commands/bmad/`
   - **Cursor**: `ls .cursor/rules/bmad/`
   - אמורים לראות קבצי אג'נטים

5. **הריצו test של אג'נט**:
   - פתחו את `bmad/core/agents/bmad-master.md` ב-IDE
   - הוסיפו אותו לצ'אט (Cursor: `@bmad-master`, Claude Code: `/bmad-master`)
   - כתבו `hi` - האג'נט צריך להגיב בשם שלכם

**אם זה לא עבד:**

אם חסר משהו מהרשימה למעלה:
- חסרה תיקיית מודול? הריצו: `npx bmad-method@alpha install --modules bmm,bmb,cis`
- חסרה אינטגרציית IDE? הריצו: `npx bmad-method@alpha install --ide cursor` (או claude-code)
- config.yaml פגום? ראו [שאלה 4](#4-שגיאות-בקונפיגורציה---איך-לפתור)

**קישורים רלוונטיים:**
- [מדריך התחלה - ניצחון ראשון](./00-התחלה-מהירה-לכולם.md#ניצחון-ראשון---הפקודה-הראשונה-שלכם)
- [README ראשי](../../README.md#installation)

---

## 7. במה להשתמש - Claude Code או Cursor?

### ❓ שאלה

יש לי גישה לשני IDEs. מה יותר מומלץ לעבודה עם BMAD?

**תשובה קצרה:** שניהם מצוינים. Cursor טוב יותר לאוטומציה וגמישות, Claude Code טוב יותר לשיחות ארוכות ומעמיקות.

**תשובה מפורטת:**

Claude Code ו-Cursor הם שני ה-IDEs הפופולריים ביותר לעבודה עם BMAD, וכל אחד מהם מביא יתרונות שונים. Claude Code משתלב ישירות עם Claude מבית Anthropic ומספק שיחות עם context window גדול מאוד (עד מיליון טוקנים), מה שמצוין לפרויקטים מורכבים עם הרבה מסמכים. Cursor משתמש במנוע AI שמבוסס על GPT-4/Claude אבל עם דגש על עריכת קוד מהירה וכלים לאוטומציה. 

האמת היא ששני ה-IDEs מתאימים מצוין, וזה תלוי בסגנון העבודה שלכם. אם אתם עובדים עם אג'נטים בשיחות ארוכות (למשל, PM שמכין PRD), Claude Code עדיף. אם אתם מפתחים שצריכים לערוך קוד מהר, Cursor עדיף.

**פתרון שלב אחר שלב:**

1. **הבינו את ההבדלים**:
   - **Claude Code**:
     - ✅ Context window גדול מאוד (מיליון טוקנים)
     - ✅ שיחות ארוכות ללא איבוד הקשר
     - ✅ Slash commands פשוטים (`/bmad-pm`)
     - ❌ פחות אוטומציה בעריכת קוד
   
   - **Cursor**:
     - ✅ עריכת קוד מהירה עם Composer
     - ✅ אוטומציה חכמה (Tab to autocomplete)
     - ✅ Rules system גמיש (`@bmad/bmm/agents/dev`)
     - ❌ Context window קטן יותר (200K טוקנים)

2. **נסו את שניהם**:
   - התקינו את BMAD בפרויקט אחד עם Cursor
   - התקינו בפרויקט אחר עם Claude Code
   - עבדו שבוע עם כל אחד ותחליטו

3. **המלצות לפי תפקיד**:
   - **מפתחים**: Cursor (עריכת קוד מהירה)
   - **PM/Analyst**: Claude Code (PRDs ארוכים)
   - **Architect**: Claude Code (תכנון מעמיק)
   - **Scrum Master**: שניהם טובים (תלוי בהעדפה)

4. **אפשר גם לעבוד עם שניהם**:
   - התקינו BMAD עם שני IDEs: `npx bmad-method@alpha install --ide cursor,claude-code`
   - זה יצור אינטגרציה לשניהם במקביל

**אם זה לא עבד:**

- אם אין לכם גישה לשניהם - תתחילו עם מה שיש לכם
- אם לא בטוחים - Claude Code יותר פשוט למתחילים
- אם רוצים אוטומציה מקסימלית - Cursor

**קישורים רלוונטיים:**
- [מדריך Claude Code](../../docs/ide-info/claude-code.md)
- [מדריך Cursor](../../docs/ide-info/cursor.md)
- [השוואת IDEs](../../docs/ide-info/README.md)

---

## 8. היכן נמצאים קבצי התצורה?

### ❓ שאלה

אני רוצה לשנות הגדרות או לראות מה הקונפיגורציה שלי. איפה הקבצים?

**תשובה קצרה:** כל קבצי התצורה נמצאים ב-`bmad/_cfg/` עם manifest files, וקונפיגורציית המודולים ב-`bmad/{module}/config.yaml`.

**תשובה מפורטת:**

BMAD v6 מפריד בין קבצי המקור של המודולים לבין ההתאמות האישיות שלכם. המודולים עצמם (אג'נטים, וורקפלואים) נמצאים ב-`bmad/core/`, `bmad/bmm/`, וכו'. אבל ההתאמות האישיות - שמות מותאמים של אג'נטים, קונפיגורציות מיוחדות, בחירת מודולים - כל אלה נמצאים ב-`bmad/_cfg/`. זה מאפשר לכם לעדכן את BMAD בלי לאבד התאמות אישיות.

**פתרון שלב אחר שלב:**

1. **קבצי תצורה עיקריים**:
   ```
   bmad/
   ├── core/config.yaml           ← שם, שפה, תיקיית פלט
   ├── bmm/config.yaml            ← הגדרות מודול BMM
   ├── bmb/config.yaml            ← הגדרות מודול BMB
   ├── cis/config.yaml            ← הגדרות מודול CIS
   └── _cfg/                      ← התאמות אישיות
       ├── manifest.yaml          ← רשימת מודולים מותקנים
       ├── agent-manifest.csv     ← רשימת אג'נטים
       ├── workflow-manifest.csv  ← רשימת וורקפלואים
       └── agents/                ← התאמות אישיות לאג'נטים
           ├── pm.yaml
           ├── dev.yaml
           └── ...
   ```

2. **לשנות שם או שפה**:
   - ערכו את `bmad/core/config.yaml`:
   ```yaml
   user_name: השם החדש שלכם
   communication_language: Hebrew
   ```

3. **להתאים אג'נט**:
   - ערכו את `bmad/_cfg/agents/{agent-name}.yaml`
   - שנו שם, תיאור, תכונות אישיות

4. **לראות אילו מודולים מותקנים**:
   ```bash
   cat bmad/_cfg/manifest.yaml
   ```

**אם זה לא עבד:**

- תיקיית `_cfg` לא קיימת? הריצו `npx bmad-method@alpha install --config-only`
- קובץ config.yaml פגום? ראו [שאלה 4](#4-שגיאות-בקונפיגורציה---איך-לפתור)

**קישורים רלוונטיים:**
- [README - קונפיגורציה](../../README.md#-update-safe-customization)
- [מילון מונחים - Manifest](./01-מילון-מונחים-מלא.md#manifest)

---

## 9. איך למחוק ולהתקין מחדש?

### ❓ שאלה

הכל התבלבל ואני רוצה להתחיל מאפס. איך מוחקים BMAD לגמרי ומתקינים מחדש?

**תשובה קצרה:** מחקו את תיקיית `bmad/` ואת תיקיות אינטגרציית ה-IDE (`.cursor/rules/bmad/` או `.claude/commands/bmad/`), ואז הריצו install מחדש.

**תשובה מפורטת:**

לפעמים התקנה מתבלבלת כל כך שקל יותר פשוט למחוק הכל ולהתחיל מחדש. זה לא אמור לקרות, אבל אם זה קורה - זה תהליך פשוט. אתם צריכים למחוק שלוש תיקיות: את תיקיית `bmad/` שמכילה את כל המודולים, את תיקיית אינטגרציית ה-IDE שמכילה את הסימלינקים לאג'נטים, ואם יש - את תיקיית cache של npm. אחרי שמחקתם הכל, התקנה חדשה תתחיל מנקודת אפס.

אבל שימו לב: אם יש לכם התאמות אישיות ב-`bmad/_cfg/`, כדאי לגבות אותן לפני המחיקה!

**פתרון שלב אחר שלב:**

1. **גבו התאמות אישיות** (אם יש):
   ```bash
   cp -r bmad/_cfg ~/bmad_backup
   # או ב-Windows:
   xcopy bmad\_cfg %USERPROFILE%\bmad_backup /E /I
   ```

2. **מחקו את תיקיית BMAD הראשית**:
   ```bash
   rm -rf bmad/
   # או ב-Windows:
   rmdir /S bmad
   ```

3. **מחקו את אינטגרציית ה-IDE**:
   - **Claude Code**:
     ```bash
     rm -rf .claude/commands/bmad/
     # Windows: rmdir /S .claude\commands\bmad
     ```
   - **Cursor**:
     ```bash
     rm -rf .cursor/rules/bmad/
     # Windows: rmdir /S .cursor\rules\bmad
     ```

4. **נקו cache של npm** (אופציונלי אבל מומלץ):
   ```bash
   npm cache clean --force
   ```

5. **התקינו מחדש**:
   ```bash
   npx bmad-method@alpha install
   ```

6. **שחזרו התאמות אישיות** (אם גיבתם):
   ```bash
   cp -r ~/bmad_backup/* bmad/_cfg/
   ```

**אם זה לא עבד:**

- אם אין הרשאה למחוק קבצים - הריצו עם sudo/admin:
  ```bash
  sudo rm -rf bmad/
  ```
- אם קבצים לא נמחקים - סגרו את ה-IDE לגמרי לפני המחיקה
- אם ההתקנה מחדש נכשלת - ראו [שאלה 1](#1-ההתקנה-נכשלה---מה-לעשות)

**קישורים רלוונטיים:**
- [מדריך התחלה מהירה](./00-התחלה-מהירה-לכולם.md#התקנה-ב-3-צעדים)
- [Installation Guide](../../README.md#installation)

---

## 10. בעיות עם הרשאות קבצים - פתרון?

### ❓ שאלה

מקבל שגיאת `EACCES` או `Permission denied` בזמן ההתקנה. איך מתקנים?

**תשובה קצרה:** בעיית הרשאות נפוצה מאוד. הפתרון הוא להריץ עם הרשאות מתאימות (sudo/admin) או לתקן הרשאות npm גלובליות.

**תשובה מפורטת:**

שגיאת `EACCES` (Access Denied) קורית כשתהליך ההתקנה מנסה לכתוב קבצים במיקום שאין לו הרשאה לגשת אליו. זה מאוד נפוץ ב-Mac/Linux כשמנסים להתקין חבילות npm גלובליות, וקצת פחות נפוץ ב-Windows. הסיבה העיקרית היא שתיקייה כמו `/usr/local/lib/node_modules` שייכת ל-root user, ואתם מריצים את הפקודה כמשתמש רגיל.

יש שני פתרונות עיקריים: (1) להריץ את ההתקנה עם הרשאות admin (sudo/administrator), או (2) לתקן את הבעיה פעם אחת על ידי שינוי הבעלות של תיקיית npm ל-user שלכם. הפתרון השני עדיף כי אז לא תצטרכו sudo בכל פעם.

**פתרון שלב אחר שלב:**

1. **פתרון מהיר (Linux/Mac)** - הריצו עם sudo:
   ```bash
   sudo npx bmad-method@alpha install
   ```

2. **פתרון מהיר (Windows)** - פתחו PowerShell כ-Administrator:
   - לחצו ימין על PowerShell
   - בחרו "Run as Administrator"
   - הריצו `npx bmad-method@alpha install`

3. **פתרון קבוע (Linux/Mac)** - תקנו הרשאות npm:
   ```bash
   # גלו איפה npm מותקן
   npm config get prefix
   # בדרך כלל: /usr/local
   
   # שנו בעלות לuser שלכם
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   sudo chown -R $(whoami) /usr/local/bin
   sudo chown -R $(whoami) ~/.npm
   ```

4. **פתרון קבוע (אלטרנטיבה)** - התקינו npm במיקום של user:
   ```bash
   # צרו תיקייה חדשה
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   
   # הוסיפו ל-PATH (הוסיפו לקובץ ~/.bashrc או ~/.zshrc):
   export PATH=~/.npm-global/bin:$PATH
   
   # טענו את הקובץ מחדש:
   source ~/.bashrc
   ```

**אם זה לא עבד:**

- **שגיאה על תיקייה ספציפית**: תקנו הרשאות רק לאותה תיקייה:
  ```bash
  sudo chown -R $(whoami) /path/to/folder
  ```
- **בעיה ב-Windows עם תיקיית Program Files**: התקינו בתיקייה אחרת:
  ```bash
  cd C:\Users\YourName\Projects
  npx bmad-method@alpha install
  ```
- **שגיאות כתיבה ב-IDE folders**: בדקו שאתם בעלים של הפרויקט

**קישורים רלוונטיים:**
- [מדריך התקנה npm רשמי](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
- [מדריך התחלה מהירה](./00-התחלה-מהירה-לכולם.md#התקנה-ב-3-צעדים)

---

## 🆘 עזרה נוספת

אם אף אחד מהפתרונות האלה לא עבד:

1. **Discord Community**: הצטרפו לקהילה - https://discord.gg/gk8jAdXWmj
2. **GitHub Issues**: פתחו issue - https://github.com/bmad-code-org/BMAD-METHOD/issues
3. **תיעוד מלא**: https://github.com/bmad-code-org/BMAD-METHOD/tree/main/docs

---

## 📚 מדריכים קשורים

- **[התחלה מהירה](./00-התחלה-מהירה-לכולם.md)** - מדריך 15 דקות למתחילים
- **[מילון מונחים](./01-מילון-מונחים-מלא.md)** - כל המונחים הטכניים מוסברים
- **[שאלות ותשובות כלליות](./06-שאלות-ותשובות-כלליות.md)** - FAQ חלק 1A (שאלות בסיס)

---

<div dir="rtl" align="center">

**עדכון אחרון: נובמבר 2024**

**בהצלחה עם ההתקנה! 🚀**

</div>

