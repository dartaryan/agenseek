# Story 0.5: Expand Avatar Collection & Add Onboarding Avatar Selection

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 3
**Priority:** P2 (Medium)
**Dependencies:** Story 0.3 Complete ✅

---

## User Story

As a new user,
I want to choose from a wider variety of avatars during onboarding,
So that I can express my personality and feel more connected to the platform from the start.

---

## Business Context

**Current State:**
- 4 avatar styles available (Cartoon, Robots, Illustrated, Diverse)
- 96 total avatar variations (24 per style)
- Avatar selection only available in Profile/Settings pages
- New users get auto-assigned default avatar
- No avatar personalization during first-time user experience

**Impact:**
- New users miss opportunity to personalize early
- Default avatars feel generic and impersonal
- Limited avatar variety for diverse user preferences
- Onboarding doesn't capture full user identity

**Solution:**
- Expand avatar collection from 4 to **8 different styles**
- Add new avatar step to onboarding wizard (between welcome and role selection)
- Increase total options from 96 to **192 avatars**
- Change Hebrew term to "און בורדינג" for better brand consistency
- Make avatar selection a core part of the first-time experience

---

## Acceptance Criteria

### 1. Expanded Avatar Collection

**Given I am selecting an avatar**
**Then I should see:**

- ✅ **8 avatar styles** (expanded from 4):
  1. **Avataaars** (פרצופים מצוירים) - Existing
  2. **Bottts** (רובוטים) - Existing
  3. **Lorelei** (פרצופים מאוירים) - Existing
  4. **Personas** (פרצופים מגוונים) - Existing
  5. **Micah** (דמויות מינימליסטיות) - NEW
  6. **Adventurer** (הרפתקנים) - NEW
  7. **Big Smile** (חיוך גדול) - NEW
  8. **Fun Emoji** (אימוג'ים כיפיים) - NEW

- ✅ 24 variations per style
- ✅ Total 192 avatar options (doubled from 96)
- ✅ All styles work with existing avatar infrastructure
- ✅ Hebrew labels for all new styles

### 2. Onboarding Avatar Selection Step

**Given I am going through onboarding**
**When I reach the avatar selection step**
**Then:**

- ✅ Avatar step is **Step 2** (after welcome, before role)
- ✅ Progress indicator shows "2 / 6" (updated from 1 / 5)
- ✅ Total steps increased from 5 to **6 steps**
- ✅ Step shows title: "בחר את האווטר שלך" (Choose Your Avatar)
- ✅ Description: "בחר תמונה שמייצגת אותך בצורה הטובה ביותר" (Choose an image that best represents you)
- ✅ Displays simplified avatar selector:
  - Style tabs at top (8 options)
  - Grid of 12 avatars per style (simplified for onboarding)
  - Selected avatar highlighted with checkmark
  - Large preview of selected avatar
- ✅ "Next" button proceeds to role selection (Step 3)
- ✅ "Back" button returns to welcome (Step 1)
- ✅ "Skip" link uses default avatar and continues
- ✅ Selected avatar saves immediately on "Next"

### 3. Updated Onboarding Flow

**New 6-step flow:**
1. **Welcome** (ברוכים הבאים)
2. **Avatar Selection** (בחירת אווטר) - NEW
3. **Role Selection** (תפקיד)
4. **Interests** (תחומי עניין)
5. **Experience Level** (רמת ניסיון)
6. **Learning Path** (נתיב למידה)

**Updates required:**
- ✅ `TOTAL_STEPS = 6` (changed from 5)
- ✅ All step numbers increment by 1 after welcome
- ✅ Progress dots show 6 steps
- ✅ Progress dots update with new step label

### 4. Hebrew Localization Update

**Given** the Hebrew localization for onboarding
**Then:**

- ✅ Update term: "הדרכה" → "און בורדינג"
- ✅ Apply to all instances of onboarding references:
  - Profile page "Return to Onboarding" button
  - Navigation breadcrumbs
  - Guide category labels
  - Settings references
- ✅ Keep English "Onboarding" in any mixed-language contexts
- ✅ Update locale file with new avatar step strings

### 5. Avatar Component Enhancements

**Given** the expanded avatar collection
**Then:**

- ✅ `src/lib/avatar.ts` supports all 8 styles
- ✅ Avatar type definition includes new styles
- ✅ `avatarStyles` array includes 8 entries with Hebrew labels
- ✅ Preview generation works for all 8 styles
- ✅ Existing avatar selection in Profile/Settings shows all 8 styles
- ✅ No performance degradation with doubled options

### 6. User Experience Requirements

**Avatar Selection in Onboarding:**
- ✅ Fast loading of avatar previews
- ✅ Smooth animations between steps
- ✅ Clear visual feedback on selection
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Simplified interface compared to full avatar selector
- ✅ Can skip if user wants to choose later
- ✅ Default avatar auto-selected if skipped

---

## Technical Implementation

### Step 1: Install New DiceBear Collections

**File:** `package.json`

**Add dependencies:**
```bash
npm install @dicebear/micah @dicebear/adventurer @dicebear/big-smile @dicebear/fun-emoji
```

**New packages:**
- `@dicebear/micah` - Minimalist illustrated characters
- `@dicebear/adventurer` - Adventure-themed avatars
- `@dicebear/big-smile` - Happy, friendly faces
- `@dicebear/fun-emoji` - Emoji-style avatars

---

### Step 2: Update Avatar Library

**File:** `src/lib/avatar.ts`

**Update imports:**
```typescript
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import * as bottts from '@dicebear/bottts';
import * as lorelei from '@dicebear/lorelei';
import * as personas from '@dicebear/personas';
import * as micah from '@dicebear/micah'; // NEW
import * as adventurer from '@dicebear/adventurer'; // NEW
import * as bigSmile from '@dicebear/big-smile'; // NEW
import * as funEmoji from '@dicebear/fun-emoji'; // NEW
```

**Update type:**
```typescript
export type AvatarStyle =
  | 'avataaars'
  | 'bottts'
  | 'lorelei'
  | 'personas'
  | 'micah'        // NEW
  | 'adventurer'   // NEW
  | 'bigSmile'     // NEW
  | 'funEmoji';    // NEW
```

**Update collections:**
```typescript
const styleCollections = {
  avataaars,
  bottts,
  lorelei,
  personas,
  micah,
  adventurer,
  bigSmile,
  funEmoji,
};
```

**Update styles array:**
```typescript
export const avatarStyles: Array<{
  value: AvatarStyle;
  label: string;
  labelHe: string;
  description?: string;
}> = [
  {
    value: 'avataaars',
    label: 'Cartoon Faces',
    labelHe: 'פרצופים מצוירים',
    description: 'Classic cartoon-style avatars'
  },
  {
    value: 'bottts',
    label: 'Robots',
    labelHe: 'רובוטים',
    description: 'Fun robot characters'
  },
  {
    value: 'lorelei',
    label: 'Illustrated Faces',
    labelHe: 'פרצופים מאוירים',
    description: 'Hand-drawn illustrated style'
  },
  {
    value: 'personas',
    label: 'Diverse Faces',
    labelHe: 'פרצופים מגוונים',
    description: 'Diverse human characters'
  },
  {
    value: 'micah',
    label: 'Minimalist',
    labelHe: 'דמויות מינימליסטיות',
    description: 'Clean, simple designs'
  },
  {
    value: 'adventurer',
    label: 'Adventurers',
    labelHe: 'הרפתקנים',
    description: 'Adventure-themed characters'
  },
  {
    value: 'bigSmile',
    label: 'Big Smile',
    labelHe: 'חיוך גדול',
    description: 'Happy, friendly faces'
  },
  {
    value: 'funEmoji',
    label: 'Fun Emoji',
    labelHe: 'אימוג׳ים כיפיים',
    description: 'Emoji-style avatars'
  },
];
```

---

### Step 3: Create Onboarding Avatar Step Component

**File:** `src/components/onboarding/AvatarSelectionStep.tsx` (NEW FILE)

**Create component:**
```typescript
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IconCheck, IconSparkles, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  avatarStyles,
  generatePreviews,
  type AvatarStyle,
  type AvatarConfig
} from '@/lib/avatar';
import { hebrewLocale } from '@/lib/locale/he';
import { cn } from '@/lib/utils';

interface AvatarSelectionStepProps {
  userId: string;
  initialConfig?: AvatarConfig | null;
  onNext: (config: AvatarConfig) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function AvatarSelectionStep({
  userId,
  initialConfig,
  onNext,
  onBack,
  onSkip
}: AvatarSelectionStepProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(
    initialConfig?.style || 'avataaars'
  );
  const [selectedSeed, setSelectedSeed] = useState<string>(
    initialConfig?.seed || userId
  );

  // Generate 12 preview options per style (simplified for onboarding)
  const previewOptions = useMemo(() => {
    return generatePreviews(selectedStyle, 12);
  }, [selectedStyle]);

  const selectedConfig: AvatarConfig = {
    style: selectedStyle,
    seed: selectedSeed,
    options: {},
  };

  const handleSelectAvatar = (seed: string) => {
    setSelectedSeed(seed);
  };

  const handleNext = () => {
    onNext(selectedConfig);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
        >
          <IconSparkles className="w-8 h-8 text-primary" />
        </motion.div>

        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {hebrewLocale.onboarding.avatarStepTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {hebrewLocale.onboarding.avatarStepDescription}
        </p>
      </div>

      {/* Large Preview */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <UserAvatar config={selectedConfig} size="xl" />
          <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
            <IconCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {avatarStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                selectedStyle === style.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {style.labelHe}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Grid - Simplified (12 options) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          בחר מתוך 12 אפשרויות
        </p>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {previewOptions.map((preview) => (
            <button
              key={preview.seed}
              onClick={() => handleSelectAvatar(preview.seed)}
              className={cn(
                'relative rounded-lg overflow-hidden transition-all hover:scale-105',
                preview.seed === selectedSeed
                  ? 'ring-4 ring-primary shadow-lg'
                  : 'hover:ring-2 hover:ring-gray-300'
              )}
            >
              <UserAvatar config={preview} size="lg" />
              {preview.seed === selectedSeed && (
                <div className="absolute top-1 left-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <IconCheck className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <IconArrowLeft className="w-5 h-5" />
          {hebrewLocale.actions.back}
        </Button>

        <button
          onClick={onSkip}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline underline-offset-4 text-sm"
        >
          {hebrewLocale.actions.skip}
        </button>

        <Button
          onClick={handleNext}
          className="gap-2"
        >
          {hebrewLocale.actions.next}
          <IconArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
```

---

### Step 4: Update Onboarding Wizard

**File:** `src/app/onboarding/wizard.tsx`

**Update constants:**
```typescript
const TOTAL_STEPS = 6; // Changed from 5
```

**Add avatar state:**
```typescript
const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig | null>(null);
```

**Add avatar step to wizard:**
```typescript
{currentStep === 2 && (
  <AvatarSelectionStep
    key="avatar"
    userId={user?.id || ''}
    initialConfig={selectedAvatar}
    onNext={(config) => {
      setSelectedAvatar(config);
      handleNext();
    }}
    onBack={handleBack}
    onSkip={handleNext}
  />
)}

{currentStep === 3 && (
  <RoleStep
    key="role"
    selectedRole={selectedRole}
    onSelectRole={setSelectedRole}
    onNext={handleNext}
    onBack={handleBack}
  />
)}

// ... all other steps increment by 1
```

**Update save function to include avatar:**
```typescript
const handleComplete = async () => {
  try {
    setIsSubmitting(true);

    // Save profile data including avatar
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: selectedRole,
        interests: selectedInterests,
        experience_level: selectedExperience,
        completed_onboarding: true,
        // Avatar config
        avatar_style: selectedAvatar?.style,
        avatar_seed: selectedAvatar?.seed,
        avatar_options: selectedAvatar?.options || {},
      })
      .eq('id', user?.id);

    // ... rest of completion logic
  }
};
```

---

### Step 5: Update Hebrew Localization

**File:** `src/lib/locale/he.ts`

**Update onboarding section:**
```typescript
onboarding: {
  welcome: 'ברוכים הבאים ל-Agenseek!',
  welcomeHebrew: 'ברוכים הבאים ל-Agenseek!',
  description: 'מסע הלמידה המותאם אישית שלך ב-BMAD מתחיל כאן',
  letsPersonalize: 'בואו נתאים אישית את המסע שלכם',
  skipLater: 'אעשה זאת מאוחר יותר',
  skipDescription: 'תוכל להשלים את הפרופיל שלך בכל עת מההגדרות',

  // NEW: Avatar step
  avatarStepTitle: 'בחר את האווטר שלך',
  avatarStepDescription: 'בחר תמונה שמייצגת אותך בצורה הטובה ביותר',

  step2Title: 'מה התפקיד שלך?',
  step2Description: 'זה עוזר לנו להמליץ על תוכן רלוונטי עבורך',
  step3Title: 'מה מעניין אותך?',
  step3Description: 'בחר נושאים שמעניינים אותך',
  step4Title: 'מה רמת הניסיון שלך?',
  step4Description: 'עזור לנו להתאים את התוכן לרמתך',
  step5Title: 'מסלול הלמידה שלך',
  step5Description: 'בנינו מסלול מותאם אישית עבורך',
  complete: 'השלמת את תהליך ההכנה!',
  stepsInfo: '6 שלבים מהירים', // Changed from 5
  timeInfo: '3 דקות', // Changed from 2
  personalizedInfo: 'מותאם אישית עבורך',
},
```

**Update term throughout file:**
```typescript
// Find and replace all instances:
'הדרכה' → 'און בורדינג'

// Examples:
nav: {
  // ...
  onboarding: 'און בורדינג', // if exists
},

profile: {
  // ...
  returnToOnboarding: 'חזור לאון בורדינג', // if exists
},
```

---

### Step 6: Update Progress Dots Component

**File:** `src/components/onboarding/ProgressDots.tsx`

**Update step labels:**
```typescript
const stepLabels = [
  'ברוכים הבאים',       // Welcome
  'בחירת אווטר',        // Avatar (NEW)
  'תפקיד',              // Role
  'תחומי עניין',        // Interests
  'ניסיון',             // Experience
  'נתיב למידה',         // Learning Path
];
```

**Ensure component supports 6 steps:**
```typescript
// Component should dynamically render based on totalSteps prop
// No hardcoded assumptions about step count
```

---

### Step 7: Update Profile Page

**File:** `src/app/profile/index.tsx`

**Update "Return to Onboarding" button text:**
```typescript
// Find existing button, update Hebrew text:
<Button variant="outline" onClick={handleResetOnboarding}>
  <IconRotate className="w-4 h-4" />
  חזור לאון בורדינג {/* Changed from: חזור להדרכה */}
</Button>
```

---

### Step 8: Update Guide Category References

**File:** Check these files for onboarding category references:
- `src/content/locale/he/guides/index.json`
- Any guide metadata with category "onboarding"
- Category labels in guide catalog

**Update:**
```json
{
  "category": "onboarding",
  "categoryLabel": "און בורדינג" // Changed from "הדרכה"
}
```

---

## Definition of Done

- [ ] New DiceBear packages installed (micah, adventurer, big-smile, fun-emoji)
- [ ] `src/lib/avatar.ts` updated with 8 styles
- [ ] All 8 styles generate previews correctly
- [ ] Avatar selector in Profile/Settings shows 8 styles
- [ ] `AvatarSelectionStep` component created
- [ ] Onboarding wizard updated to 6 steps
- [ ] Progress dots show 6 steps with correct labels
- [ ] Avatar step appears as Step 2
- [ ] All subsequent steps renumbered correctly
- [ ] Selected avatar saves to database on completion
- [ ] Hebrew locale updated with "און בורדינג" throughout
- [ ] Profile page button updated with new term
- [ ] Guide categories updated with new term
- [ ] Avatar step skippable (uses default if skipped)
- [ ] Avatar selection responsive on all devices
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Existing avatar functionality still works
- [ ] Build completes successfully
- [ ] Manual testing passed on all 6 onboarding steps

---

## Related Files

**Created:**
- `src/components/onboarding/AvatarSelectionStep.tsx` - New avatar selection step component

**Modified:**
- `package.json` - Add 4 new DiceBear packages
- `src/lib/avatar.ts` - Expand to 8 styles, update types
- `src/app/onboarding/wizard.tsx` - Add Step 2, update TOTAL_STEPS, save avatar
- `src/components/onboarding/ProgressDots.tsx` - Add avatar step label
- `src/lib/locale/he.ts` - Add avatar step strings, update "הדרכה" → "און בורדינג"
- `src/app/profile/index.tsx` - Update button text
- `src/content/locale/he/guides/index.json` - Update category labels (if applicable)

**Reference:**
- `src/components/avatar-selector.tsx` - Full avatar selector (for Profile/Settings)
- `src/components/ui/user-avatar.tsx` - Avatar display component
- `STORY-0.3-COMPLETE.md` - Original avatar implementation

---

## Estimated Effort

**Story Points:** 3

**Breakdown:**
- Install new DiceBear packages: 5 min
- Update avatar library (8 styles): 30 min
- Create AvatarSelectionStep component: 60 min
- Update onboarding wizard: 45 min
- Update progress dots: 15 min
- Update Hebrew localization: 30 min
- Update Profile page: 10 min
- Update guide categories: 10 min
- Test all 8 avatar styles: 20 min
- Test 6-step onboarding flow: 30 min
- End-to-end testing: 30 min
- Visual QA: 20 min

**Total:** ~4.5 hours

---

## Success Metrics

**User Experience:**
- Doubled avatar variety (96 → 192 options)
- Avatar personalization happens during first-time experience
- Reduced time to personalization (no need to visit Profile later)
- Better user identity expression from day 1

**Technical:**
- Clean integration of 4 new avatar styles
- No performance impact with doubled options
- Smooth onboarding flow with 6 steps
- Consistent Hebrew terminology throughout

**Engagement:**
- Higher percentage of users with custom avatars
- Increased onboarding completion rate (personalization adds value)
- Better user satisfaction with avatar selection

---

## Visual Reference

### Onboarding Avatar Step (Step 2)

```
┌─────────────────────────────────────────────────┐
│         Progress: ● ● ○ ○ ○ ○  (2/6)           │
├─────────────────────────────────────────────────┤
│                                                 │
│              [✨ Icon]                          │
│                                                 │
│          בחר את האווטר שלך                      │
│   בחר תמונה שמייצגת אותך בצורה הטובה ביותר     │
│                                                 │
│              [Large Avatar Preview]             │
│                     [✓]                         │
│                                                 │
│  [מצוירים] [רובוטים] [מאוירים] [מגוונים]      │
│  [מינימליסטיים] [הרפתקנים] [חיוך] [אימוג'ים]  │
│                                                 │
│        בחר מתוך 12 אפשרויות                     │
│  ┌─────────────────────────────────────┐        │
│  │ [▫] [▫] [▫] [▫] [▫] [▫]            │        │
│  │ [▫] [▫] [✓] [▫] [▫] [▫]            │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  [◀ חזור]        [דלג]         [הבא ▶]        │
└─────────────────────────────────────────────────┘
```

### Updated Onboarding Flow

```
Step 1: Welcome (ברוכים הבאים)
  ↓
Step 2: Avatar Selection (בחירת אווטר) ⭐ NEW
  ↓
Step 3: Role Selection (תפקיד)
  ↓
Step 4: Interests (תחומי עניין)
  ↓
Step 5: Experience (ניסיון)
  ↓
Step 6: Learning Path (נתיב למידה)
  ↓
Complete! (השלמת את תהליך ההכנה!)
```

---

## Testing Scenarios

### Happy Path - New User Onboarding with Avatar
1. New user registers account
2. Redirected to onboarding Step 1 (Welcome)
3. Clicks "Let's personalize"
4. **Step 2: Avatar Selection displays**
5. User sees 8 style tabs
6. User selects "הרפתקנים" (Adventurer)
7. Grid shows 12 adventurer avatars
8. User selects favorite avatar
9. Large preview updates
10. User clicks "Next"
11. **Expected:**
    - Avatar saved to profile
    - Proceeds to Step 3 (Role)
    - Progress shows "3 / 6"

### Happy Path - Skip Avatar Selection
1. User reaches Step 2 (Avatar)
2. User clicks "דלג" (Skip)
3. **Expected:**
    - Default avatar assigned
    - Proceeds to Step 3 (Role)
    - User can change avatar later in Profile

### Happy Path - Back Navigation
1. User at Step 3 (Role)
2. User clicks "Back"
3. **Expected:**
    - Returns to Step 2 (Avatar)
    - Previously selected avatar still selected
    - Can change avatar and continue

### Happy Path - All 8 Styles Work
1. User on Avatar Selection step
2. User clicks each of 8 style tabs
3. **Expected:**
    - Each style loads 12 unique avatars
    - No errors or broken images
    - Preview updates correctly
    - All styles visually distinct

### Edge Case - User Returns to Onboarding
1. Existing user with saved avatar
2. User clicks "חזור לאון בורדינג" on Profile
3. Reaches Step 2 (Avatar)
4. **Expected:**
    - Current avatar pre-selected
    - User can change or keep existing
    - Changes save on completion

### Edge Case - Network Failure on Save
1. User completes all 6 steps
2. Network fails during save
3. **Expected:**
    - Error toast displayed
    - User can retry
    - Avatar selection preserved

---

## Security & Validation

### Client-Side
- Validate avatar style is in allowed list
- Validate seed string format
- Sanitize avatar options JSON
- Prevent XSS in avatar SVG rendering

### Server-Side (Database)
- Avatar style must match enum/constraint
- Avatar seed max length validation
- Avatar options JSONB validation
- Profile update requires authenticated user

---

## Migration Notes

**No Database Migration Required!**

Story 0.3 already added the necessary columns:
- `avatar_style VARCHAR(50)`
- `avatar_seed VARCHAR(100)`
- `avatar_options JSONB`

These columns support all avatar styles (existing and new). The VARCHAR(50) field accommodates style names like "adventurer" and "funEmoji".

---

## Hebrew Terminology Update

**Before:** הדרכה (Hadracha - meaning "guidance" or "instruction")
**After:** און בורדינג (On Boarding - Hebrew transliteration of "Onboarding")

**Rationale:**
- More modern, tech-savvy term
- Aligns with global tech industry terminology
- Better brand consistency with international products
- Easier for users familiar with English tech terms
- Still Hebrew characters, maintaining Hebrew-first policy

**Affected Areas:**
- Navigation labels
- Profile page button
- Guide categories
- Settings references
- Progress indicators
- Documentation

---

## Post-Implementation Checklist

After completing the story:

- [ ] Test all 8 avatar styles render correctly
- [ ] Test 6-step onboarding flow end-to-end
- [ ] Verify avatar saves on onboarding completion
- [ ] Test skip functionality (default avatar assigned)
- [ ] Verify back navigation preserves selections
- [ ] Test on mobile, tablet, desktop
- [ ] Verify Hebrew term "און בורדינג" appears everywhere
- [ ] Check Profile page avatar selector has 8 styles
- [ ] Test existing users returning to onboarding
- [ ] Verify no performance issues with 192 options
- [ ] Check accessibility (keyboard nav, screen readers)
- [ ] Verify RTL layout correctness
- [ ] Test dark mode compatibility
- [ ] Run full build and lint checks

---

**Created:** November 8, 2025
**Author:** BMad Master
**Status:** Ready to Implement

---

## Additional Notes

### Why 6 Steps Instead of Inserting Elsewhere?

Avatar selection is placed as Step 2 (after welcome) because:
1. **Early Personalization:** Users engage with visual customization immediately
2. **Low Cognitive Load:** Avatar selection is fun and easy (before making role decisions)
3. **Identity First:** Users establish their visual identity before describing themselves
4. **Momentum Building:** Quick win encourages continuing through remaining steps

### Why Only 12 Avatars Per Style in Onboarding?

The full avatar selector (Profile/Settings) shows 24 options per style, but onboarding shows only 12 because:
1. **Faster Decision:** Less choice paralysis for new users
2. **Better Performance:** Faster initial load
3. **Mobile Friendly:** Fits better on small screens
4. **Sufficient Variety:** 12 options per style = 96 total (still plenty)
5. **Users Can Change Later:** Full 192 options available in Profile

### Backward Compatibility

Existing users with avatars from the original 4 styles will continue to work seamlessly. The expanded library adds new options without breaking existing configurations.

---


