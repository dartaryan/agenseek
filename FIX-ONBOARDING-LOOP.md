# תיקון: לולאת אונבורדינג אינסופית

**תאריך:** 10 בנובמבר, 2025
**בעיה:** כל פעם שמתחברים, המערכת מעבירה לאונבורדינג
**סיבה:** הטריגר לא מגדיר במפורש `completed_onboarding = false`

---

## 🔍 הבעיה

### מה קורה:
1. משתמש נרשם → נוצר auth.users + profile
2. הטריגר `handle_new_oauth_user()` לא מגדיר במפורש `completed_onboarding`
3. הערך defaults ל-`false` (זה נכון)
4. משתמש עובר/מדלג על אונבורדינג
5. `completed_onboarding` **אמור** להתעדכן ל-`true`
6. אבל... משהו לא עובד 🤔

### למה זה קורה:

**תרחיש A: משתמש מחק חשבון**
- Profile נמחק ✅
- auth.users עדיין קיים ❌ (המיגרציה לא רצה)
- משתמש מתחבר שוב
- הטריגר לא רץ (זה AFTER INSERT, לא UPDATE)
- אין profile = מועבר לאונבורדינג
- מנסה לדלג → נכשל (בעיית הרשאות)
- **תקוע!**

**תרחיש B: הטריגר לא מעודכן בפרודקשן**
- המיגרציה הישנה לא מגדירה `completed_onboarding` במפורש
- ה-ON CONFLICT DO NOTHING לא עושה כלום אם profile קיים
- אם משהו מחק את ה-`completed_onboarding`, זה לא מתעדכן חזרה

---

## ✅ הפתרון

### שלב 1: מיגרציה משופרת

**קובץ:** `supabase/migrations/20251110_fix_profile_trigger.sql`

הטריגר המעודכן עושה:

1. **מגדיר במפורש** `completed_onboarding = false`
2. **ON CONFLICT DO UPDATE** במקום DO NOTHING
3. **מתקן משתמשים תקועים** - רץ על כל auth.users ללא profile ויוצר להם

```sql
INSERT INTO public.profiles (
  id,
  email,
  display_name,
  completed_onboarding,  -- ✅ EXPLICIT!
  created_at,
  updated_at
)
VALUES (
  NEW.id,
  NEW.email,
  ...,
  false,  -- ✅ EXPLICIT: User must complete onboarding
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET  -- ✅ UPDATE instead of NOTHING
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  updated_at = NOW();
```

### שלב 2: ניקוי משתמשים תקועים

המיגרציה כוללת סקריפט שרץ אוטומטית ומתקן:

```sql
DO $$
-- מוצא auth.users ללא profiles
-- יוצר להם profile עם completed_onboarding = false
-- הם יעברו אונבורדינג בפעם הבאה שיתחברו
END $$;
```

---

## 🚀 איך להפעיל

### אופציה 1: Supabase CLI (מומלץ)

```bash
cd supabase
supabase db push
```

### אופציה 2: Supabase Dashboard

1. פתח **Supabase Dashboard**
2. עבור ל-**SQL Editor**
3. הדבק את תוכן הקובץ: `supabase/migrations/20251110_fix_profile_trigger.sql`
4. לחץ **Run**

### אופציה 3: הרץ הכל ביחד

```bash
# בSupabase Dashboard SQL Editor:
# הדבק את כל 3 המיגרציות האלה:

-- 1. תיקון הטריגר
\i supabase/migrations/20251110_fix_profile_trigger.sql

-- 2. פונקציית מחיקה עצמית
\i supabase/migrations/20251110_self_delete_auth_user.sql

-- 3. טבלת guide_votes (אם עדיין לא רצה)
\i supabase/migrations/20251110_create_guide_votes.sql
```

---

## 🧪 בדיקות

### בדיקה 1: ודא שהטריגר קיים

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_oauth_user';
```

צריך להחזיר 1 שורה עם `FUNCTION`.

### בדיקה 2: בדוק משתמשים ללא profile

```sql
SELECT au.id, au.email, p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
```

צריך להחזיר **0 שורות** (אחרי המיגרציה).

### בדיקה 3: בדוק profiles עם onboarding לא מושלם

```sql
SELECT id, email, display_name, completed_onboarding, created_at
FROM public.profiles
WHERE completed_onboarding = false
ORDER BY created_at DESC
LIMIT 10;
```

אלה משתמשים שעדיין לא סיימו אונבורדינג - זה תקין.

### בדיקה 4: נסה להירשם ולהתחבר

1. צור משתמש חדש
2. עבור אונבורדינג או דלג
3. התנתק
4. התחבר שוב
5. ✅ צריך להיכנס ישר לדאשבורד (לא לאונבורדינג!)

---

## 📊 התוצאה הצפויה

### לפני התיקון ❌
```
User Register → Profile Created (completed_onboarding implicit false)
↓
Login → ProtectedRoute sees completed_onboarding=false → Redirect to Onboarding
↓
Complete/Skip Onboarding → Set completed_onboarding=true
↓
Login Again → ProtectedRoute sees completed_onboarding=false?? → Redirect to Onboarding 🔄
```

### אחרי התיקון ✅
```
User Register → Profile Created (completed_onboarding EXPLICIT false)
↓
Login → ProtectedRoute sees completed_onboarding=false → Redirect to Onboarding (ONCE)
↓
Complete/Skip Onboarding → Set completed_onboarding=true
↓
Login Again → ProtectedRoute sees completed_onboarding=true → Allow Access to Dashboard! 🎉
```

---

## 🎯 סיכום שינויים

| קובץ | שינוי | מטרה |
|------|-------|------|
| `20251110_fix_profile_trigger.sql` | טריגר משופר | מגדיר במפורש completed_onboarding |
| `20251110_self_delete_auth_user.sql` | מחיקה עצמית | מונע משתמשים תקועים |
| `src/app/onboarding/wizard.tsx` | כפתור התנתקות | רשת ביטחון למשתמשים תקועים |

---

## ⚠️ חשוב!

**אחרי שתריץ את כל 3 המיגרציות:**

1. ✅ משתמשים חדשים יעברו אונבורדינג פעם אחת בלבד
2. ✅ מחיקת חשבון תעבוד כראוי (ימחק גם auth.users)
3. ✅ משתמשים תקועים יכולים להתנתק
4. ✅ לא יהיו עוד לולאות אינסופיות!

---

**הכל מוכן לפריסה!** 🚀

