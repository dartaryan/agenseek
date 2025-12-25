# מדריך וורקפלואים - חלק 2ב: פאזה 2 - עיצוב ומשחקים

<div dir="rtl">

## 📋 תוכן עניינים

- [מבוא לעיצוב UX ופיתוח משחקים](#מבוא-לעיצוב-ux-ופיתוח-משחקים)
- [create-ux-design - עיצוב חווית משתמש](#create-ux-design---עיצוב-חווית-משתמש)
- [gdd - מסמך עיצוב משחק](#gdd---מסמך-עיצוב-משחק-game-design-document)
- [narrative - עיצוב נרטיב](#narrative---עיצוב-נרטיב-narrative-design)
- [סיכום: מתי להשתמש בכל וורקפלואו](#סיכום-מתי-להשתמש-בכל-וורקפלואו)

---

## מבוא לעיצוב UX ופיתוח משחקים

### למה עיצוב וחווית משתמש כל כך חשובים?

**עיצוב טוב = הצלחת המוצר**. אפשר לבנות את הקוד הכי מושלם בעולם, אבל אם המשתמשים לא מבינים איך להשתמש בו או שהחוויה לא נעימה - המוצר יכשל.

חשבו על זה ככה:
```
מוצר עם קוד מעולה + UX גרוע = כישלון ❌
מוצר עם קוד סביר + UX מצוין = הצלחה ✅
```

### 3 הוורקפלואים של פאזה 2 - עיצוב

| וורקפלואו | מתי להשתמש | פלט | זמן |
|-----------|-----------|-----|-----|
| **create-ux-design** | כל מוצר עם ממשק משתמש | UX Specification מלא | 2-4 שעות |
| **gdd** | פרויקטי משחקים | Game Design Document | 3-5 שעות |
| **narrative** | משחקים עם סיפור | Narrative Design Doc | 2-3 שעות |

### מה ההבדל בין הוורקפלואים האלה?

**create-ux-design** - לכל אפליקציה/מוצר עם UI
- מתמקד בחוויית המשתמש, זרימות, עיצוב ויזואלי
- לכל סוגי האפליקציות: ווב, מובייל, דסקטופ

**gdd (Game Design Document)** - רק למשחקים
- מתמקד במכניקות משחק, מערכות, progression
- כולל game loops, balance, monetization

**narrative** - למשחקים סיפוריים
- מתמקד בסיפור, דמויות, דיאלוגים, רגשות
- משלים את ה-GDD עם שכבת הסיפור

### איך זה משתלב בתהליך הכללי?

**מסלול אפליקציה רגילה:**
```
workflow-init
    ↓
product-brief (אופציונלי)
    ↓
prd
    ↓
create-ux-design ← עיצוב החוויה
    ↓
architecture
    ↓
sprint-planning
```

**מסלול משחק:**
```
workflow-init
    ↓
game-brief (אופציונלי)
    ↓
gdd ← עיצוב המשחק
    ↓
narrative ← עיצוב הסיפור (אם רלוונטי)
    ↓
architecture
    ↓
sprint-planning
```

---

## create-ux-design - עיצוב חווית משתמש 🎨

### מה זה create-ux-design?

**create-ux-design** הוא וורקפלואו ייחודי שמסייע לכם **ליצור עיצוב UX מקצועי** - לא רק מפרט יבש, אלא **חוויה חזותית מלאה** עם אפשרויות עיצוב אמיתיות.

זה **לא עוד וורקפלואו "מלא טמפלייט"** - הוא **עובד איתך בצורה שיתופית** לבנות את העיצוב, מציג אפשרויות ויזואליות בזמן אמת, ומסייע לך לקבל החלטות מעוצבות.

חשבו על זה כמו **לעבוד עם מעצב UX מקצועי** שמציג לכם mockups, שואל על העדפות, ובונה את המפרט המלא יחד איתכם.

### 🎯 מטרה

create-ux-design משרת 4 מטרות:

1. **חקר חזון העיצוב** - איזה סגנון, צבעים, תחושה מתאימים למוצר
2. **יצירה ויזואלית** - מציג אפשרויות עיצוב אמיתיות (HTML/CSS) שאפשר לראות
3. **הגדרת User Flows** - איך המשתמש נע במערכת
4. **מפרט UX מפורט** - מסמך שמתרגם את הכל לדרישות למפתחים

### 🎮 מתי להשתמש ב-create-ux-design?

**כן - השתמש ב-create-ux-design:**
- ✅ כל מוצר עם ממשק משתמש (web, mobile, desktop)
- ✅ אפליקציות שהחווית המשתמש קריטית להצלחתן
- ✅ כשרוצים להבטיח עיצוב מקצועי ועקבי
- ✅ כשיש צורך להציג mockups ללקוח/משקיעים
- ✅ לפני שמתחילים לקוד את ה-UI

**לא - דלג על create-ux-design:**
- ❌ APIs / Backend בלבד (אין UI)
- ❌ CLIs / Scripts (אין ממשק גרפי)
- ❌ פרויקטים פנימיים מאוד פשוטים (admin tools בסיסיים)
- ❌ כשאתם רק מתקנים באג קטן ב-UI קיים

### 📥 תשומות נדרשות

**חובה (לפחות אחד):**
- 📋 PRD - מסמך דרישות מוצר
- 📄 Product Brief - חזון המוצר
- 💡 רעיון ברור של המוצר

**מומלץ (אם קיימים):**
- 🎯 פרסונות משתמש (מ-PRD)
- 🔍 מחקר מתחרים (references לעיצובים)
- 🖼️ Brand guidelines (צבעים, פונטים)

### 📤 פלט צפוי

**קבצים:**
1. `{output_folder}/ux-design-specification.md` - מסמך UX מקיף
2. `{output_folder}/ux-color-themes.html` - דוגמאות צבעים חזותיות
3. `{output_folder}/ux-design-directions.html` - כיווני עיצוב ויזואליים

מסמך ה-UX Specification כולל:

**1. Design Vision (חזון העיצוב)**
- סגנון כללי (modern, minimal, playful, professional)
- תחושה רצויה (trustworthy, energetic, calm)
- השראות וריפרנסים

**2. Color Palette (פלטת צבעים)**
- צבעים ראשיים (Primary)
- צבעים משניים (Secondary)
- צבעי אקשן (Success, Error, Warning)
- קבצי HTML עם דוגמאות ויזואליות! 🎨

**3. Typography (טיפוגרפיה)**
- פונטים מומלצים
- גדלים לכותרות, טקסט רגיל, קטן
- משקלים (weights)

**4. Layout Patterns (תבניות פריסה)**
- מבנה דפים כללי
- Navigation structure
- Responsive behavior

**5. User Flows (זרימות משתמש)**
- מפת המסכים
- איך עוברים בין מסכים
- Actions ו-Navigation

**6. Component Specifications (מפרט קומפוננטות)**
- כפתורים: סגנונות, מצבים (hover, disabled)
- Forms: שדות, validation, errors
- Cards, Lists, Modals, etc.

**7. Interactive Patterns (דפוסי אינטראקציה)**
- Hover effects
- Animations
- Feedback למשתמש (loading, success)

### ⏱️ זמן משוער

**2-4 שעות** (תלוי במורכבות המוצר)

- מוצר פשוט (3-5 מסכים): ~2 שעות
- מוצר בינוני (10-15 מסכים): ~3 שעות
- מוצר מורכב (20+ מסכים): ~4 שעות

### 🤖 אגנט מומלץ

**Sally (UX Designer)**

```bash
@ux hi
*create-ux-design
```

### 📋 תהליך שלב אחר שלב

**שלב 1: גילוי חזון העיצוב**
```
Sally: "היי! בואו ניצור UX מדהים למוצר שלך! 
ספר לי על המוצר והמשתמשים..."

אתה: "זה TaskMaster - אפליקציית ניהול משימות
עם Pomodoro timer. למשתמשים צעירים (25-35), freelancers."

Sally: "מעולה! איזה תחושה אתה רוצה שהאפליקציה תעביר?
- ממוקד ומקצועי? 
- אנרגטי ומעורר מוטיבציה?
- רגוע ומינימליסטי?"

אתה: "ממוקד אבל לא משעמם - רוצה שיעזור להישאר
במוד עבודה, אבל לא קשוח מדי."

Sally: "הבנתי! בואו נחקור אפשרויות..."
```

**שלב 2: חקר פלטות צבעים**
```
Sally: "אני יוצרת 3 כיווני צבע שונים...

✅ נוצר קובץ: ux-color-themes.html
פתח אותו בדפדפן כדי לראות!

אני רואה 3 אפשרויות:
1. Focus Blue - כחול-אפור מקצועי
2. Energy Orange - כתום-צהוב מעורר מוטיבציה
3. Zen Green - ירוק-טבעי רגוע

איזה מדבר אליך?"

אתה: [פותח את הקובץ, רואה דוגמאות אמיתיות]
"אהבתי את Focus Blue!"

Sally: "מעולה! זה יעבוד נהדר!"
```

**שלב 3: הגדרת User Flows**
```
Sally: "בואו נתכנן את הזרימות המרכזיות:

Flow 1: Onboarding
→ Splash Screen → Login/Register → Tutorial → Dashboard

Flow 2: Create Task + Pomodoro
→ Dashboard → + Button → Task Form → Start Timer → Focus Mode

Flow 3: Review Stats
→ Dashboard → Stats Tab → Charts → Export

נשמע טוב? רוצה להוסיף עוד flows?"

אתה: "נראה מושלם!"
```

**שלב 4: פירוט מסכים וקומפוננטות**
```
Sally: "עכשיו בואו נפרט כל מסך:

Dashboard:
- Header: Logo + User menu + Notifications
- Quick stats: Tasks today, Pomodoros done, Time focused
- Task list: Scrollable, grouped by status
- FAB: Floating + button (bottom-right)
- Bottom nav: Home, Stats, Settings

איך זה נשמע? רוצה לשנות משהו?"

אתה: "אולי להוסיף quick timer גם ב-header?"

Sally: "רעיון מצוין! מוסיף..."
```

**שלב 5-7: השלמת מפרט מלא**
```
Sally: [עובר על כל מסך, קומפוננטה, interaction]
"כותב מפרט מפורט עם כל הפרטים..."

✅ Design Vision
✅ Color Palette (עם HTML preview)
✅ Typography
✅ Layout Patterns
✅ 8 User Flows מפורטים
✅ 15 מסכים מפורטים
✅ 20+ Component specs
✅ Interactive patterns
```

**שלב 8: סיכום**
```
Sally: "✅ UX Design הושלם!

נוצרו:
- ux-design-specification.md (מסמך מקיף, 25 עמודים)
- ux-color-themes.html (פלטת צבעים חזותית)
- ux-design-directions.html (כיווני עיצוב)

המפתחים שלך יכולים להתחיל לקוד עכשיו!

הצעד הבא: architecture
אגנט: Winston (Architect)
פקודה: @architect *architecture

בהצלחה! 🎨✨"
```

### 💡 דוגמה מעשית מלאה

**תרחיש:** מעצבת רוצה לבנות UX לאפליקציית כושר

```
אתה: @ux hi
Sally: "היי! איך אני יכולה לעזור?"

אתה: *create-ux-design
Sally: "מעולה! בואו ניצור UX מדהים!"

[3 שעות של עבודה שיתופית]

Sally: "✅ UX Design מושלם!

מה יצרנו:
- 12 מסכים מפורטים (Workout, Progress, Social, Profile...)
- 5 User Flows מרכזיים
- פלטת צבעים Energy Orange (מוטיבציה!)
- 25 קומפוננטות UI מפורטות
- Animations ו-Micro-interactions

קבצים:
- docs/ux-design-specification.md (28 עמודים!)
- docs/ux-color-themes.html (ויזואלי!)
- docs/ux-design-directions.html (mockups!)

הצוות שלך יאהב את זה! 💪🎨"
```

**תוצאה:**
- ✅ UX מקצועי ומפורט
- ✅ עיצוב ויזואלי (לא רק טקסט!)
- ✅ מפתחים יודעים בדיוק מה לבנות
- ✅ לקוח/משקיעים יכולים לראות את החזון

### 🤝 עובד טוב עם

**לפני create-ux-design:**
- prd - מספק דרישות פונקציונליות
- product-brief - מספק חזון
- research - מספק תובנות על משתמשים

**אחרי create-ux-design:**
- architecture - תכנון טכני יכול להסתמך על מפרט UX
- dev-story - מפתחים בונים לפי המפרט
- sprint-planning - תכנון העבודה

### ⚠️ טעויות נפוצות

1. **לדלג על create-ux-design**
   - ❌ "נעצב בדרך, במהלך הפיתוח"
   - ✅ תכננו את ה-UX קודם - חוסך refactoring אינסופי!

2. **לא להסתכל בקבצי HTML**
   - ❌ סתם לקרוא את המפרט הכתוב
   - ✅ פתחו את ux-color-themes.html וראו בעיניים!

3. **לא לאמת עם משתמשים**
   - ❌ "אנחנו יודעים מה הם רוצים"
   - ✅ הציגו את ה-UX למשתמשים פוטנציאליים, קבלו פידבק

4. **UX מתכנתים ולא ממעצבים**
   - ❌ "כפתור פה, טבלה שם, סיימנו"
   - ✅ חשבו על תחושה, זרימה, קלות שימוש

### 🔗 וורקפלואים קשורים

**לפני:** prd → **create-ux-design**  
**אחרי:** **create-ux-design** → architecture → sprint-planning

### 🐛 פתרון בעיות

**בעיה 1: "קובץ ה-HTML לא נוצר"**
- ✅ **פתרון:** בדקו ש-output_folder מוגדר נכון ב-config.yaml. וודאו שיש הרשאות כתיבה לתיקייה.

**בעיה 2: "העיצוב לא מתאים לברנד שלנו"**
- ✅ **פתרון:** הריצו שוב והזינו את brand guidelines בשלב הגילוי. Sally יתאים את העיצוב.

**בעיה 3: "חסרים מסכים במפרט"**
- ✅ **פתרון:** ערכו ידנית את ux-design-specification.md והוסיפו. אפשר גם להריץ שוב עם פוקוס על המסכים החסרים.

**בעיה 4: "המפתחים לא מבינים את המפרט"**
- ✅ **פתרון:** עברו יחד על הקבצים בוויזואליים (.html). הוסיפו screenshots/mockups אם צריך.

---

## gdd - מסמך עיצוב משחק (Game Design Document) 🎮

### מה זה GDD?

**GDD (Game Design Document)** הוא **התנ"ך של המשחק שלכם**. זהו מסמך מקיף שמתאר **כל היבט** של המשחק - מכניקות, מערכות, progression, balance, monetization, וכל מה שביניהם.

זה לא PRD רגיל - GDD הוא **מסמך מיוחד למשחקים** שמבין game loops, player psychology, balancing, ו-game feel.

חשבו על זה כמו **blueprint מלא למשחק** - אם אתם בונים בניין, ה-PRD אומר "בית עם 3 חדרים". ה-GDD אומר "Level 1 עם 3 אויבים, כל אויב עם HP=100, damage=20, spawn rate=5 שניות, reward=50 gold".

### 🎯 מטרה

GDD משרת 4 מטרות קריטיות:

1. **הגדרת Core Loop** - מה השחקן עושה כל הזמן, ולמה זה כיף
2. **תיאור מערכות** - Combat, Progression, Economy, Multiplayer
3. **Game Balance** - מספרים, פרמטרים, tuning
4. **מפת דרכים** - מה ב-MVP, מה ב-Full, מה ב-Vision

### 🎮 מתי להשתמש ב-GDD?

**כן - השתמש ב-GDD:**
- ✅ כל פרויקט משחק - מ-prototype קטן ועד AAA
- ✅ משחקים עם מכניקות (גם פשוטות)
- ✅ לפני שמתחילים לקוד את המשחק
- ✅ כשצריך לשכנע publisher / investor
- ✅ כשיש צוות פיתוח משחקים

**לא - אל תשתמש ב-GDD:**
- ❌ לא משחק? השתמש ב-PRD!
- ❌ interactive story בלי מכניקות? narrative workflow
- ❌ gamification קלה? הוסף לPRD רגיל

### 📥 תשומות נדרשות

**חובה:**
- 🎮 רעיון משחק - מה השחקן עושה
- 🎯 סוג משחק (platformer, RPG, puzzle, strategy...)
- 👥 קהל יעד

**מומלץ (אם קיימים):**
- 📄 Game Brief - חזון המשחק
- 🔍 Research - ניתוח מתחרים
- 🎨 Art style references

### 📤 פלט צפוי

**קובץ עיקרי:** `{output_folder}/GDD.md`

מסמך GDD מלא כולל:

**1. Game Overview (סקירה כללית)**
- High concept (המשחק במשפט אחד)
- Genre, Platform, Target audience
- Unique Selling Points (USP)

**2. Core Gameplay Loop (לולאת משחק מרכזית)**
- מה השחקן עושה כל הזמן?
- למה זה כיף? (Fun factor)
- Reward loops

**3. Game Mechanics (מכניקות)**
- Movement, Combat, Abilities
- כל מכניקה מפורטת עם מספרים
- Game feel וResponsiveness

**4. Progression Systems (מערכות התקדמות)**
- Levels, XP, Skills, Upgrades
- Unlock progression
- Difficulty curve

**5. Game Economy (כלכלה)**
- Currencies (gold, gems, etc.)
- Earning rates, Spending sinks
- Balance ו-Monetization (אם רלוונטי)

**6. Levels/Content (תוכן)**
- Level design principles
- World structure
- Content roadmap

**7. Balancing Parameters (פרמטרים)**
- טבלאות עם מספרים מדויקים
- HP, Damage, Speed, Costs
- Formulas ו-Scaling

### ⏱️ זמן משוער

**3-5 שעות** (תלוי במורכבות המשחק)

- פרוטוטייפ קטן: ~3 שעות
- משחק אינדי מלא: ~4 שעות
- משחק מורכב/מולטיפלייר: ~5+ שעות

### 🤖 אגנט מומלץ

**Game Designer Agent**

```bash
@game-designer hi
*gdd
```

### 📋 תהליך שלב אחר שלב

**שלב 1: הבנת חזון המשחק**
```
Game Designer: "היי! בואו נתכנן משחק מדהים!
ספר לי - מה סוג המשחק?"

אתה: "זה 2D platformer עם מכניקת grappling hook,
כמו Celeste אבל עם combat."

Game Designer: "אהבתי! מי קהל היעד?"

אתה: "Hardcore gamers, 18-30, אוהבי אתגר."

Game Designer: "מעולה! זיהיתי:
- Genre: 2D Action Platformer
- Difficulty: High (precision + combat)
- Style: Fast-paced, skill-based
בואו נתחיל!"
```

**שלב 2: הגדרת Core Loop**
```
Game Designer: "מה השחקן עושה כל הזמן?
מה ה-loop המרכזי?"

אתה: "רץ בלבלים, קופץ בין פלטפורמות,
נלחם באויבים, אוסף gems למכשירי שדרוג."

Game Designer: "נהדר! אז ה-Core Loop:
RUN → JUMP/GRAPPLE → FIGHT → COLLECT → UPGRADE → 
NEXT LEVEL → (חזור)

זה נכון?"

אתה: "בדיוק!"
```

**שלב 3: פירוט מכניקות**
```
Game Designer: "בואו נפרט מכניקות:

Movement:
- Walk Speed: 5 m/s
- Run Speed: 8 m/s
- Jump Height: 3 units
- Double Jump: Yes
- Air Control: 80%

Grappling Hook:
- Range: 10 units
- Pull Speed: 12 m/s
- Cooldown: 0.5s
- Can chain? Yes

Combat:
- Basic Attack: 25 damage, 0.3s animation
- Charged Attack: 75 damage, 1.2s charge
- Dash Attack: 40 damage + invulnerability

זה נשמע מאוזן?"

אתה: "כן! אולי להוריד את ה-Pull Speed ל-10?"

Game Designer: "שינוי מצוין! מעדכן..."
```

**שלבים 4-6: Progression, Economy, Levels**
```
Game Designer: [עובר על כל מערכת בפירוט]
"יוצר טבלאות balance עם כל המספרים..."
```

**שלב 7: כתיבת GDD מלא**
```
Game Designer: "✅ GDD הושלם!

מה יצרנו:
- 8 מכניקות מרכזיות (מפורטות!)
- 3 progression systems
- Full economy balance
- 15 רמות מתוכננות
- Boss fights מפורטים
- טבלאות balancing מלאות

נשמר ב: docs/GDD.md (35 עמודים!)

הצעד הבא:
- narrative (אם יש סיפור)
- architecture (תכנון טכני)

בהצלחה! 🎮"
```

### 💡 דוגמה מעשית מלאה

**תרחיש:** מפתח רוצה לבנות Roguelike dungeon crawler

```
אתה: @game-designer *gdd

[4 שעות של עבודה]

Game Designer: "✅ GDD מוכן!

המשחק שלך: 'DungeonRogue'
- סוג: Roguelike Dungeon Crawler
- Core Loop: Explore → Fight → Loot → Upgrade → Die → Restart Stronger
- 8 weapon types (מפורט עם DPS)
- Procedural generation rules
- 5 boss patterns
- Meta progression (permanent upgrades)
- 20 items balanced
- Drop rates calculated

GDD: docs/GDD.md (40 עמודים!)

אפשר להתחיל development! 🎮"
```

**תוצאה:**
- ✅ כל מכניקת משחק מתועדת
- ✅ מספרים מאוזנים
- ✅ צוות יודע מה לבנות
- ✅ אפשר לפתח!

### 🤝 עובד טוב עם

**לפני GDD:**
- game-brief - חזון המשחק
- brainstorm-game - רעיונות מכניקות
- research - ניתוח מתחרים

**אחרי GDD:**
- narrative - הוספת שכבת סיפור
- create-ux-design - UI/UX של המשחק
- architecture - תכנון טכני

### ⚠️ טעויות נפוצות

1. **GDD גנרי מדי**
   - ❌ "השחקן יכול לקפוץ"
   - ✅ "Jump Height: 3 units, Jump Duration: 0.4s, Coyote Time: 0.1s"

2. **לא balance מספרים**
   - ❌ "נחליט על הערכים בזמן פיתוח"
   - ✅ תכננו balance מראש (תוכלו לכוונן אחר כך)

3. **לשכוח Fun Factor**
   - ❌ רק מכניקות יבשות
   - ✅ הסבירו למה כל מכניקה כיפית!

### 🔗 וורקפלואים קשורים

**לפני:** game-brief → **gdd**  
**אחרי:** **gdd** → narrative (optional) → architecture

### 🐛 פתרון בעיות

**בעיה 1: "GDD יצא קצר מדי"**
- ✅ **פתרון:** הריצו שוב עם יותר פרטים. ציינו במפורש את כל המערכות שרוצים.

**בעיה 2: "חסרים balance numbers"**
- ✅ **פתרון:** הוסיפו ידנית טבלאות balance. השתמשו ב-spreadsheet לחישובים.

**בעיה 3: "GDD לא מתאים לסוג המשחק שלי"**
- ✅ **פתרון:** ציינו את הסוג במדויק (Puzzle, Strategy, etc.) - GDD יתאים את המבנה.

---

## narrative - עיצוב נרטיב (Narrative Design) 📖

### מה זה Narrative Design?

**Narrative Design** הוא **אומנות סיפור במשחקים** - איך משלבים סיפור, דמויות, דיאלוגים ורגשות לתוך המשחק.

זה לא סתם "לכתוב סיפור" - זה **סיפור אינטראקטיבי** שהשחקן חווה, משפיע עליו, ומתחבר אליו רגשית.

חשבו על זה ככה: GDD אומר **מה השחקן עושה**, Narrative אומר **למה השחקן אכפת לו**.

### 🎯 מטרה

Narrative Design משרת 3 מטרות:

1. **יצירת חיבור רגשי** - השחקן מתחבר לדמויות וסיפור
2. **הנעה קדימה** - הסיפור מניע להמשיך לשחק
3. **משמעות למכניקות** - הפעולות במשחק מקבלות הקשר סיפורי

### 🎮 מתי להשתמש ב-Narrative?

**כן - השתמש ב-Narrative:**
- ✅ משחקים סיפוריים (RPG, Adventure, Visual Novel)
- ✅ משחקים עם דמויות מרכזיות
- ✅ משחקים שהסיפור קריטי לחוויה
- ✅ אחרי GDD, כדי להוסיף שכבת סיפור

**לא - דלג על Narrative:**
- ❌ משחקי פאזל אבסטרקטיים (Tetris, Match-3)
- ❌ משחקי ספורט (FIFA, NBA 2K)
- ❌ משחקים שהסיפור לא חשוב (Flappy Bird)

### 📥 תשומות נדרשות

**מומלץ:**
- 🎮 GDD - מכניקות המשחק
- 📄 Game Brief - חזון וטון
- 💡 רעיון סיפורי ראשוני

### 📤 פלט צפוי

**קובץ עיקרי:** `{output_folder}/narrative-design.md`

מסמך Narrative כולל:

**1. Story Overview**
- High concept (הסיפור במשפט)
- Setting (עולם, תקופה)
- Themes (נושאים מרכזיים)

**2. Characters**
- Protagonist(s) - דמות ראשית
- Supporting characters
- Antagonist
- Character arcs

**3. Story Structure**
- Act 1, 2, 3 (או מבנה אחר)
- Key plot points
- Emotional beats

**4. Dialogue Systems**
- סוגי דיאלוגים
- Dialogue trees (אם רלוונטי)
- Voice/Tone

**5. World Building**
- תיאור העולם
- Lore ו-History
- Factions/Groups

**6. Narrative Integration**
- איך הסיפור משתלב במכניקות
- Cutscenes vs In-game narrative
- Player agency

### ⏱️ זמן משוער

**2-3 שעות**

- סיפור לינארי פשוט: ~2 שעות
- סיפור מסועף/מורכב: ~3 שעות

### 🤖 אגנט מומלץ

**Game Designer Agent** (או Storyteller Agent אם מותקן)

```bash
@game-designer hi
*narrative
```

### 📋 תהליך (מקוצר)

```
Game Designer: "בואו ניצור סיפור מדהים!
ספר לי על העולם והדמויות..."

[2-3 שעות של עבודה]

Game Designer: "✅ Narrative Design מוכן!
- 5 דמויות מרכזיות (עם character arcs!)
- סיפור ב-3 מערכות
- 8 cutscenes מתוכננות
- World lore מפורט
- 20+ dialogue examples

נשמר ב: docs/narrative-design.md"
```

### 💡 דוגמה מעשית

**תרחיש:** RPG עם סיפור על נקמה וסליחה

```
אתה: @game-designer *narrative

[2.5 שעות]

Game Designer: "✅ הסיפור שלך מוכן!

'Blade of Redemption'
- גיבור טרגי מחפש נקמה
- 3 מערכות עם twist רגשי
- 6 דמויות עם depth אמיתי
- נושאים: נקמה vs סליחה, מחיר של שנאה
- 15 cutscenes מתוכננות
- 30+ dialogue options בנקודות מפתח

docs/narrative-design.md (22 עמודים)

השחקנים שלך יבכו! 😢✨"
```

### 🤝 עובד טוב עם

**לפני:** gdd → **narrative**  
**אחרי:** **narrative** → architecture

### ⚠️ טעויות נפוצות

1. **לכתוב סיפור מנותק מהמשחק**
   - ❌ סיפור יפה אבל לא קשור למכניקות
   - ✅ הסיפור תומך במכניקות ולהיפך

2. **דמויות שטוחות**
   - ❌ "הגיבור הטוב והרשע הרע"
   - ✅ דמויות מורכבות עם מוטיבציות אמיתיות

3. **יותר מדי exposition**
   - ❌ 10 דקות cutscenes בהתחלה
   - ✅ "Show, don't tell" - גלו את הסיפור בהדרגה

---

## סיכום: מתי להשתמש בכל וורקפלואו

### מטריצת החלטה מהירה

| סוג פרויקט | וורקפלואו | זמן | מתי חובה? |
|-----------|-----------|-----|-----------|
| **אפליקציה/Web** | create-ux-design | 2-4 שעות | מומלץ מאוד |
| **משחק (כל סוג)** | gdd | 3-5 שעות | חובה |
| **משחק סיפורי** | narrative | 2-3 שעות | מומלץ |

### מסלולים מומלצים

**מסלול אפליקציה:**
```
workflow-init
    ↓
prd
    ↓
create-ux-design ← תכננו את ה-UX!
    ↓
architecture
    ↓
sprint-planning
```

**מסלול משחק פשוט:**
```
workflow-init
    ↓
gdd ← תכננו את המכניקות
    ↓
architecture
    ↓
sprint-planning
```

**מסלול משחק סיפורי:**
```
workflow-init
    ↓
game-brief (אופציונלי)
    ↓
gdd ← מכניקות
    ↓
narrative ← סיפור
    ↓
create-ux-design ← UI (אופציונלי)
    ↓
architecture
    ↓
sprint-planning
```

### 3 עקרונות זהב

1. **תכננו את החוויה לפני הקוד** - UX/Game Design קודם, implementation אחר כך
2. **בחרו את הכלי הנכון** - אפליקציה? UX. משחק? GDD + Narrative
3. **השקיעו בעיצוב** - חוויה טובה = מוצר מוצלח

### מה הלאה?

**סיימתם עיצוב?** המשיכו ל:
- **פאזה 3: Solutioning** - architecture
- **פאזה 4: Implementation** - sprint-planning, dev-story

**רוצים ללמוד עוד?**
- [חלק 2א: PRD, Tech-Spec, Epics](./03-workflows-part-2a-phase2-core.md)
- [חלק 1א: וורקפלואים קריטיים](./03-workflows-part-1a-intro-critical.md)
- [מדריך אגנטים](./02-agents-part-1a-intro-pm-analyst.md)

---

## 📚 קישורים נוספים

- [מילון מונחים מלא](./01-מילון-מונחים-מלא.md)
- [התחלה מהירה](./00-התחלה-מהירה-לכולם.md)
- [UX Designer Agent](./02-agents-part-2a-tea-ux.md)

---

<div align="center">

**חלק 2ב הושלם! 🎉**

**למדנו על עיצוב UX ומשחקים בBMAD!**

**create-ux-design, GDD, ו-Narrative - כלים מקצועיים לעיצוב חוויה!**

[⬆️ חזרה למעלה](#מדריך-וורקפלואים---חלק-2ב-פאזה-2---עיצוב-ומשחקים) | [📖 חזרה לתפריט הראשי](./README.md)

</div>

</div>

