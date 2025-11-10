# מדריך מערכת העיצוב של Agenseek
**מדריך מהיר ומקיף לבניית SPA**

---

## תוכן עניינים
1. [סקירה כללית](#סקירה-כללית)
2. [צבעים](#צבעים)
3. [טיפוגרפיה](#טיפוגרפיה)
4. [מרווחים ו-Layout](#מרווחים-ו-layout)
5. [רכיבי UI בסיסיים](#רכיבי-ui-בסיסיים)
6. [אנימציות](#אנימציות)
7. [נגישות](#נגישות)
8. [Responsive Design](#responsive-design)
9. [דוגמאות קוד](#דוגמאות-קוד)

---

## סקירה כללית

### עקרונות העיצוב
**Agenseek** הוא פלטפורמת למידה מודרנית עם עיצוב "Emerald Learning" - טרי, מקצועי, ומעורר השראה.

**ערכי הליבה:**
- **מהירות:** כל פעולה צריכה להרגיש מיידית
- **חגיגיות:** נחגוג הצלחות עם אנימציות מרשימות
- **נגישות:** כולם יכולים להשתמש בפלטפורמה
- **RTL Native:** תמיכה מלאה בעברית מימין לשמאל

### טכנולוגיות מרכזיות
```
- React 18 + TypeScript
- Vite 5
- TailwindCSS 3.4
- Shadcn/ui (Radix UI)
- Tabler Icons (לא אמוג'ים!)
- Framer Motion (אנימציות)
```

---

## צבעים

### פלטת הצבעים העיקרית

#### מצב בהיר (Light Mode)
```css
/* צבעים מרכזיים */
--primary: #10B981          /* Emerald 500 - צבע המותג */
--secondary: #6EE7B7        /* Emerald 300 - תמיכה */
--accent: #2DD4BF           /* Teal 400 - הדגשות */

/* רקעים */
--background: #FFFFFF       /* לבן */
--surface: #F9FAFB         /* אפור 50 */

/* טקסט */
--foreground: #064E3B      /* Emerald 900 - טקסט ראשי */
--text-secondary: #047857  /* Emerald 700 */
--text-muted: #6B7280      /* אפור 500 */

/* צבעים סמנטיים */
--success: #10B981         /* הצלחה - ירוק */
--warning: #F59E0B         /* אזהרה - כתום */
--error: #EF4444           /* שגיאה - אדום */
--info: #3B82F6            /* מידע - כחול */
```

#### מצב כהה (Dark Mode)
```css
/* רקע כהה - יער אמרלד */
--background: 160 35% 12%      /* רקע כהה ירוק */
--card: 160 25% 22%            /* כרטיסים בולטים יותר */

/* טקסט - ניגודיות מקסימלית */
--foreground: 150 10% 98%      /* לבן כמעט */
--muted-foreground: 150 8% 82% /* קריא מאוד */

/* גבולות בולטים */
--border: 160 15% 32%          /* נראים טוב */
```

### שימוש בצבעים

**Primary (Emerald)** - כפתורי פעולה ראשיים, קישורים, התקדמות:
```html
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  התחל ללמוד
</button>
```

**Secondary** - כפתורים משניים, רקעים קלים:
```html
<button className="bg-secondary text-secondary-foreground">
  דלג
</button>
```

**Accent** - תגיות, אייקונים מיוחדים, אלמנטים מונפשים:
```html
<span className="bg-accent text-white px-3 py-1 rounded-full">
  חדש
</span>
```

---

## טיפוגרפיה

### פונט ראשי: Varela Round
**למה Varela Round?**
- נקי ומודרני
- קריא מעולה בעברית
- תומך RTL בצורה מושלמת
- חינמי ב-Google Fonts

### טעינת הפונט
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet">
```

### קונפיגורציה ב-Tailwind
```javascript
// tailwind.config.js
fontFamily: {
  sans: ['Varela Round', 'system-ui', 'sans-serif'],
  serif: ['Varela Round', 'Georgia', 'serif']
}
```

### סולם טיפוגרפי

```css
/* כותרות */
h1: 2.5rem (40px)  / font-weight: 700  /* כותרות עמודים */
h2: 2rem (32px)    / font-weight: 700  /* כותרות מדורים */
h3: 1.5rem (24px)  / font-weight: 600  /* כותרות משנה */
h4: 1.25rem (20px) / font-weight: 600

/* טקסט גוף */
body-lg: 1.125rem (18px) / weight: 400  /* הקדמות */
body: 1rem (16px)        / weight: 400  /* ברירת מחדל */
body-sm: 0.875rem (14px) / weight: 400  /* מטא-אינפורמציה */
tiny: 0.75rem (12px)     / weight: 400  /* הערות שוליים */
```

### דוגמאות שימוש

```html
<!-- כותרת עמוד -->
<h1 className="text-4xl font-bold text-foreground">
  ברוכים הבאים ל-Agenseek
</h1>

<!-- טקסט רגיל -->
<p className="text-base text-foreground leading-relaxed">
  זהו טקסט גוף רגיל עם מרווח שורות נוח לקריאה
</p>

<!-- טקסט משני -->
<span className="text-sm text-text-muted">
  עודכן לפני 5 דקות
</span>
```

---

## מרווחים ו-Layout

### מערכת המרווחים
**יחידת בסיס: 4px** (סטנדרט Tailwind)

```
space-1:  0.25rem (4px)
space-2:  0.5rem (8px)
space-3:  0.75rem (12px)
space-4:  1rem (16px)
space-6:  1.5rem (24px)
space-8:  2rem (32px)
space-12: 3rem (48px)
space-16: 4rem (64px)
```

### דפוסי מרווחים נפוצים

```html
<!-- Padding בכרטיס -->
<div className="p-6">קונטנט</div>

<!-- מרווח בין אלמנטים -->
<div className="space-y-6">
  <div>אלמנט 1</div>
  <div>אלמנט 2</div>
</div>

<!-- שוליים רספונסיביים -->
<div className="px-4 md:px-8 lg:px-12">
  תוכן עם שוליים מותאמים
</div>
```

### Border Radius (פינות מעוגלות)

```css
rounded-sm:   0.25rem (4px)   /* קטן */
rounded-md:   0.75rem (12px)  /* בינוני - inputs */
rounded-lg:   1rem (16px)     /* גדול - כפתורים */
rounded-xl:   1.5rem (24px)   /* מאוד גדול - כרטיסים */
rounded-full: 9999px          /* עגול לחלוטין - תגיות, אווטרים */
```

### דוגמאות

```html
<!-- כרטיס עם פינות מעוגלות -->
<div className="rounded-xl border-2 border-border p-6">
  כרטיס
</div>

<!-- כפתור -->
<button className="rounded-lg px-4 py-2 bg-primary">
  לחץ כאן
</button>

<!-- תג עגול -->
<span className="rounded-full bg-accent text-white px-3 py-1">
  מומלץ
</span>
```

### Grid System

```html
<!-- גריד רספונסיבי: 1 טור במובייל, 2 בטאבלט, 3 בדסקטופ -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>פריט 1</div>
  <div>פריט 2</div>
  <div>פריט 3</div>
</div>
```

---

## רכיבי UI בסיסיים

### כפתורים (Buttons)

#### וריאנטים
```tsx
// Primary - פעולה ראשית
<Button variant="default">
  התחל ללמוד
</Button>

// Secondary - פעולה משנית
<Button variant="secondary">
  דלג
</Button>

// Outline - גבול בלבד
<Button variant="outline">
  צפה בעוד
</Button>

// Ghost - שקוף
<Button variant="ghost">
  סגור
</Button>

// Destructive - מחיקה
<Button variant="destructive">
  מחק
</Button>

// Link - קישור
<Button variant="link">
  למד עוד
</Button>
```

#### גדלים
```tsx
<Button size="sm">קטן</Button>
<Button size="default">רגיל</Button>
<Button size="lg">גדול</Button>
<Button size="icon">🔍</Button>  {/* רק אייקון */}
```

### כרטיסים (Cards)

```tsx
import { Card, CardHeader, CardTitle, CardDescription,
         CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>כותרת הכרטיס</CardTitle>
    <CardDescription>תיאור קצר</CardDescription>
  </CardHeader>
  <CardContent>
    <p>תוכן הכרטיס כאן</p>
  </CardContent>
  <CardFooter>
    <Button>פעולה</Button>
  </CardFooter>
</Card>
```

**מאפיינים מיוחדים:**
- `border-2` - גבול בולט
- `shadow-lg` - צל עמוק
- `hover:shadow-xl` - צל גדול יותר ב-hover
- `transition-shadow` - מעבר חלק

### תגיות (Badges)

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">ברירת מחדל</Badge>
<Badge variant="secondary">משני</Badge>
<Badge variant="destructive">דחוף</Badge>
<Badge variant="outline">מתאר</Badge>
```

### Input Fields

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">אימייל</Label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
    className="text-right"  {/* עבור עברית */}
  />
</div>
```

---

## אנימציות

### Framer Motion - אנימציות מרשימות

#### התקנה
```bash
npm install framer-motion
```

#### אנימציות מובנות ב-globals.css

**Float אנימציות:**
```html
<!-- צף איטי -->
<div className="animate-float-1">אלמנט צף</div>

<!-- צף מהיר -->
<div className="animate-float-fast-1">צף מהיר</div>

<!-- צף דק -->
<div className="animate-float-subtle-1">תנועה עדינה</div>
```

#### מעברי עמודים
```tsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

<motion.div
  initial="initial"
  animate="enter"
  exit="exit"
  variants={pageVariants}
  transition={{ duration: 0.3 }}
>
  תוכן העמוד
</motion.div>
```

#### Hover אפקטים לכרטיסים
```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    y: -4,
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)"
  }}
  transition={{ duration: 0.2 }}
  className="rounded-xl bg-card p-6"
>
  כרטיס עם hover
</motion.div>
```

#### אנימציית התקדמות
```tsx
<motion.div
  className="h-2 bg-primary rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 1, ease: "easeOut" }}
/>
```

#### חגיגת השלמה (Confetti)
```tsx
import confetti from 'canvas-confetti';

const celebrate = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10B981', '#6EE7B7', '#2DD4BF']
  });
};

<Button onClick={celebrate}>
  סיים מדריך
</Button>
```

---

## נגישות

### עקרונות WCAG 2.1 AA

#### ניגודיות צבעים
```
✓ #064E3B על רקע לבן: 9.4:1 (מצוין!)
✓ #10B981 על רקע לבן: 3.3:1 (טוב לטקסט גדול)
✓ טקסט רגיל: לפחות 4.5:1
✓ טקסט גדול: לפחות 3:1
```

#### ניווט מקלדת
```tsx
// כל אלמנט אינטראקטיבי חייב להיות נגיש במקלדת
<button
  className="focus-visible:outline-2 focus-visible:outline-ring"
>
  כפתור נגיש
</button>

// דלג לתוכן (Skip to content)
<a
  href="#main"
  className="sr-only focus:not-sr-only"
>
  דלג לתוכן הראשי
</a>
```

#### ARIA Labels
```tsx
// כפתור עם אייקון בלבד
<button aria-label="חיפוש">
  <IconSearch />
</button>

// קישור חיצוני
<a
  href="..."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="פתח במסך חדש"
>
  קישור
</a>
```

#### גדלי מטרות מגע
```
✓ מינימום: 44x44px
✓ אידיאלי: 48x48px
✓ מרווח בין מטרות: 8px לפחות
```

```html
<button className="min-h-[44px] min-w-[44px] p-3">
  כפתור נגיש
</button>
```

---

## Responsive Design

### Breakpoints
```
sm:  640px   (טאבלט קטן)
md:  768px   (טאבלט)
lg:  1024px  (דסקטופ)
xl:  1280px  (דסקטופ רחב)
2xl: 1536px  (מסך גדול)
```

### דוגמאות רספונסיביות

#### טקסט רספונסיבי
```html
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  כותרת שמתאימה לכל מסך
</h1>
```

#### גריד רספונסיבי
```html
<!-- 1 טור במובייל, 2 בטאבלט, 3 בדסקטופ, 4 במסך רחב -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div>פריט</div>
  <div>פריט</div>
  <div>פריט</div>
  <div>פריט</div>
</div>
```

#### הסתרה/הצגה לפי מסך
```html
<!-- מוסתר במובייל, מוצג בדסקטופ -->
<div className="hidden lg:block">
  תפריט צד
</div>

<!-- מוצג במובייל, מוסתר בדסקטופ -->
<div className="block lg:hidden">
  תפריט המבורגר
</div>
```

#### Padding רספונסיבי
```html
<div className="p-4 md:p-6 lg:p-8">
  Padding שגדל עם המסך
</div>
```

### תמיכה ב-RTL (עברית)

```html
<!-- הוסף ל-HTML root -->
<html dir="rtl" lang="he">

<!-- השתמש ב-logical properties של Tailwind -->
<div className="ms-4">     {/* margin-start במקום margin-left */}
<div className="me-4">     {/* margin-end במקום margin-right */}
<div className="ps-4">     {/* padding-start */}
<div className="pe-4">     {/* padding-end */}
```

---

## דוגמאות קוד

### 1. כרטיס מדריך (Guide Card)

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconBook } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function GuideCard({ title, description, category, progress }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        {/* Header עם gradient */}
        <div className="h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-t-xl">
          <IconBook size={48} className="text-white" />
        </div>

        <CardHeader>
          <div className="flex gap-2 mb-2">
            <Badge>{category}</Badge>
            <Badge variant="secondary">{progress}%</Badge>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardFooter>
          <Button className="w-full">
            {progress > 0 ? 'המשך לקרוא' : 'התחל ללמוד'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
```

### 2. פס התקדמות מעגלי

```tsx
import { motion } from 'framer-motion';

export function CircularProgress({ percent, size = 80 }) {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-gray-200"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{percent}%</span>
      </div>
    </div>
  );
}
```

### 3. Modal פשוט

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ConfirmModal({ open, onClose, onConfirm, title, description }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            ביטול
          </Button>
          <Button onClick={onConfirm}>
            אישור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Dashboard Grid

```tsx
import { CircularProgress } from './CircularProgress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function Dashboard({ user, stats }) {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        שלום, {user.name}! 👋
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>ההתקדמות שלך</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CircularProgress percent={stats.completionRate} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>מדריכים שהושלמו</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {stats.completed}
              </p>
              <p className="text-sm text-muted-foreground">
                מתוך {stats.total}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>רצף למידה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {stats.streak} 🔥
              </p>
              <p className="text-sm text-muted-foreground">
                ימים ברצף
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
```

### 5. טופס עם Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(8, 'סיסמה חייבת להיות לפחות 8 תווים')
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">אימייל</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-error' : ''}
        />
        {errors.email && (
          <p className="text-sm text-error">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-error' : ''}
        />
        {errors.password && (
          <p className="text-sm text-error">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        התחבר
      </Button>
    </form>
  );
}
```

---

## Utilities חשובות

### Classes מותאמות אישית (globals.css)

```css
/* מניעת גלישת טקסט */
.card-text-safe {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
}

/* Ellipsis ל-2 שורות */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Glassmorphism */
.glass-card {
  backdrop-filter: blur(16px);
  background-color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### שימוש
```html
<div className="glass-card p-6">
  כרטיס עם אפקט זכוכית
</div>

<h3 className="text-ellipsis-2">
  כותרת ארוכה מאוד שתיחתך אחרי שתי שורות...
</h3>
```

---

## טיפים מהירים

### 1. כפתורים - היררכיה נכונה
```tsx
// ראשי - פעולה עיקרית אחת בעמוד
<Button variant="default">שמור שינויים</Button>

// משני - פעולות נוספות
<Button variant="outline">ביטול</Button>

// Ghost - פעולות שקטות
<Button variant="ghost">סגור</Button>

// Destructive - מחיקה בלבד!
<Button variant="destructive">מחק חשבון</Button>
```

### 2. מרווחים עקביים
```tsx
// בין רכיבים קרובים
<div className="space-y-4">

// בין מדורים
<div className="space-y-8">

// Padding בכרטיסים
<Card className="p-6">
```

### 3. הודעות למשתמש

```tsx
// הצלחה
import { toast } from '@/components/ui/use-toast';

toast({
  title: "הצלחה!",
  description: "המדריך הושלם בהצלחה",
  variant: "default"
});

// שגיאה
toast({
  title: "שגיאה",
  description: "לא ניתן לשמור שינויים",
  variant: "destructive"
});
```

### 4. אייקונים - Tabler Icons בלבד!

```tsx
import { IconBook, IconUser, IconSettings, IconHeart } from '@tabler/icons-react';

<IconBook size={24} className="text-primary" />
<IconUser size={20} stroke={1.5} />
```

**⚠️ חשוב: אין אמוג'ים! רק Tabler Icons.**

---

## משאבים נוספים

### קבצים חשובים בפרויקט
```
📁 src/
  📁 styles/
    📄 globals.css           # כל ההגדרות הגלובליות
  📁 components/ui/
    📄 button.tsx            # רכיב כפתור
    📄 card.tsx              # רכיב כרטיס
    📄 badge.tsx             # רכיב תג

📁 docs/
  📄 ux-design-specification.md  # מפרט UX מלא
  📄 ux-color-themes.html        # ויזואליזציה אינטראקטיבית

📄 tailwind.config.js      # קונפיגורציית Tailwind
📄 components.json         # קונפיגורציית Shadcn/ui
```

### לינקים שימושיים
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Shadcn/ui:** https://ui.shadcn.com/
- **Tabler Icons:** https://tabler-icons.io/
- **Framer Motion:** https://www.framer.com/motion/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## סיכום

### עקרונות מפתח לזכור
1. **צבע המותג:** #10B981 (Emerald) - השתמש בו לפעולות ראשיות
2. **פונט:** Varela Round בלבד
3. **אייקונים:** Tabler Icons בלבד (לא אמוג'ים!)
4. **אנימציות:** Framer Motion לכל אינטראקציה
5. **נגישות:** WCAG 2.1 AA - תמיד
6. **RTL:** עברית מימין לשמאל
7. **Responsive:** נבדק על כל הגדלים

### צ'קליסט למרכיב חדש
- [ ] משתמש בצבעים ממערכת העיצוב
- [ ] פונט Varela Round
- [ ] אייקונים מ-Tabler Icons
- [ ] יש אנימציית hover/focus
- [ ] נגיש במקלדת (tabindex, aria-labels)
- [ ] רספונסיבי (sm/md/lg/xl)
- [ ] עובד ב-RTL
- [ ] יש מצב loading/error
- [ ] ניגודיות צבעים תקינה

---

**🎉 בהצלחה בבניית ה-SPA! 🚀**

*מדריך זה מעודכן ומבוסס על מערכת העיצוב המלאה של Agenseek. לשאלות או הבהרות, עיין במפרט ה-UX המלא.*

