# Story X.X: Hebrew Display Name Suggestion

**Epic:** User Profile & Preferences
**Priority:** P2 (Nice to have)
**Sprint:** TBD
**Story Points:** 3
**Status:** Backlog
**Created:** November 8, 2025

---

## 📝 Story Description

**As a** Hebrew-speaking user of Agenseek
**I want** the system to suggest changing my English display name to Hebrew
**So that** my profile aligns with the platform's Hebrew-first UX policy

---

## 🎯 Acceptance Criteria

### Detection & Display

**Given** I am a logged-in user with an English display name (e.g., "John Cohen")
**When** I load the dashboard for the first time in a session
**Then**:
- The system detects my name is primarily in English (>50% Latin characters)
- A friendly banner appears at the top of the dashboard
- The banner suggests changing my name to Hebrew
- The banner has two actions: "כן, עדכן" (Yes, update) and "אל תציג שוב" (Don't show again)

**And** the banner is:
- Non-intrusive (doesn't block content)
- Dismissible
- Uses Hebrew text only (per policy)
- Uses Tabler Icons (IconLanguage or IconWorld)

### Display Name Editing

**Given** I click "כן, עדכן" on the suggestion banner
**When** the profile page opens
**Then**:
- A modal appears with a display name edit form
- The form shows:
  - Current name (readonly, for reference)
  - Input field for new Hebrew name
  - Example text: "למשל: יוסי כהן"
  - Validation: Must contain Hebrew characters
  - Save and Cancel buttons
- I can enter my Hebrew name
- Clicking "שמור" (Save) updates my profile
- My new Hebrew name appears immediately in the header and dashboard
- The banner is permanently dismissed

### Dismissal Behavior

**Given** I click "אל תציג שוב" on the suggestion banner
**When** the banner is dismissed
**Then**:
- The banner disappears immediately
- A flag is set in my profile: `hebrew_name_suggestion_dismissed = true`
- The banner never appears again for my account
- No error or success message is shown (silent dismissal)

### Name Change Detection

**Given** I have a Hebrew display name
**When** I change my name to an English name via profile settings
**Then**:
- The system resets the dismissal flag: `hebrew_name_suggestion_dismissed = false`
- On next dashboard load, the banner appears again
- The suggestion cycle restarts

### Edge Cases

**Given** various name scenarios
**Then** the detection works correctly:
- "John Cohen" → Detected as English (show suggestion)
- "יוחנן כהן" → Detected as Hebrew (no suggestion)
- "John כהן" → Detected as English (>50% Latin, show suggestion)
- "J" → Too short, ignored (no suggestion)
- "123456" → Invalid name, ignored (no suggestion)
- Empty or null name → No suggestion

---

## 🔨 Implementation Details

### 1. Database Schema Changes

**Add column to profiles table:**

```sql
-- Migration: Add hebrew name suggestion flag
ALTER TABLE public.profiles
ADD COLUMN hebrew_name_suggestion_dismissed BOOLEAN DEFAULT false;

-- Index for quick lookup
CREATE INDEX idx_profiles_hebrew_suggestion
ON public.profiles(hebrew_name_suggestion_dismissed)
WHERE hebrew_name_suggestion_dismissed = false;
```

**Update TypeScript types:**

```typescript
// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          // ... existing fields
          hebrew_name_suggestion_dismissed: boolean;
        };
        Insert: {
          // ... existing fields
          hebrew_name_suggestion_dismissed?: boolean;
        };
        Update: {
          // ... existing fields
          hebrew_name_suggestion_dismissed?: boolean;
        };
      };
    };
  };
}
```

### 2. Detection Utility

**File:** `src/lib/utils/detectLanguage.ts`

```typescript
/**
 * Detects if a display name is primarily in English (Latin characters)
 * @param name - The display name to check
 * @returns true if name is primarily English (>50% Latin chars)
 */
export function isEnglishName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (name.length < 2) return false; // Too short to determine

  // Count Latin vs Hebrew characters
  const latinChars = (name.match(/[A-Za-z]/g) || []).length;
  const hebrewChars = (name.match(/[\u0590-\u05FF]/g) || []).length;
  const totalAlphaChars = latinChars + hebrewChars;

  if (totalAlphaChars === 0) return false; // No alphabetic characters

  // Name is "English" if >50% Latin characters
  return latinChars / totalAlphaChars > 0.5;
}

/**
 * Validates that a name contains Hebrew characters
 * @param name - The display name to validate
 * @returns true if name contains at least some Hebrew characters
 */
export function hasHebrewCharacters(name: string): boolean {
  return /[\u0590-\u05FF]/.test(name);
}
```

### 3. Banner Component

**File:** `src/components/banners/HebrewNameSuggestionBanner.tsx`

```typescript
import { useState } from 'react';
import { IconLanguage, IconX } from '@tabler/icons-react';
import { Button } from '../ui/button';

interface HebrewNameSuggestionBannerProps {
  onAccept: () => void;
  onDismiss: () => void;
}

export function HebrewNameSuggestionBanner({
  onAccept,
  onDismiss,
}: HebrewNameSuggestionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconLanguage className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              שמנו לב שהשם שלך באנגלית. האם תרצה לשנות אותו לעברית?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onAccept}
              className="whitespace-nowrap"
            >
              כן, עדכן
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="whitespace-nowrap"
            >
              אל תציג שוב
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Display Name Edit Modal

**File:** `src/components/profile/EditDisplayNameModal.tsx`

```typescript
import { useState } from 'react';
import { IconUser, IconX } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { hasHebrewCharacters } from '../../lib/utils/detectLanguage';

interface EditDisplayNameModalProps {
  currentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
}

export function EditDisplayNameModal({
  currentName,
  isOpen,
  onClose,
  onSave,
}: EditDisplayNameModalProps) {
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    // Validation
    if (!newName.trim()) {
      setError('אנא הזן שם');
      return;
    }

    if (!hasHebrewCharacters(newName)) {
      setError('השם חייב להכיל תווים בעברית');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(newName.trim());
      onClose();
    } catch (err) {
      setError('שגיאה בשמירת השם. אנא נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <IconUser className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">עדכון שם תצוגה</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <IconX className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Name (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם נוכחי
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400">
              {currentName}
            </div>
          </div>

          {/* New Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם חדש בעברית
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="למשל: יוסי כהן"
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              הזן את שמך בעברית
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'שומר...' : 'שמור'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Dashboard Integration

**File:** `src/app/dashboard/index.tsx` (add to existing component)

```typescript
// Add imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEnglishName } from '../../lib/utils/detectLanguage';
import { HebrewNameSuggestionBanner } from '../../components/banners/HebrewNameSuggestionBanner';
import { supabase } from '../../lib/supabase';

// Inside DashboardPage component:
export function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [showHebrewNameBanner, setShowHebrewNameBanner] = useState(false);

  // Check if we should show Hebrew name suggestion
  useEffect(() => {
    if (
      profile &&
      profile.display_name &&
      !profile.hebrew_name_suggestion_dismissed &&
      isEnglishName(profile.display_name)
    ) {
      setShowHebrewNameBanner(true);
    }
  }, [profile]);

  const handleAcceptHebrewSuggestion = () => {
    setShowHebrewNameBanner(false);
    // Navigate to profile with edit mode query param
    navigate('/profile?edit=display_name');
  };

  const handleDismissHebrewSuggestion = async () => {
    if (!user?.id) return;

    setShowHebrewNameBanner(false);

    // Update profile to dismiss suggestion permanently
    await supabase
      .from('profiles')
      .update({ hebrew_name_suggestion_dismissed: true })
      .eq('id', user.id);

    // Refresh profile to update local state
    await refreshProfile();
  };

  // ... rest of component

  return (
    <>
      {/* Hebrew Name Suggestion Banner */}
      {showHebrewNameBanner && (
        <HebrewNameSuggestionBanner
          onAccept={handleAcceptHebrewSuggestion}
          onDismiss={handleDismissHebrewSuggestion}
        />
      )}

      {/* Rest of dashboard content */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-[1600px] mx-auto">
        {/* ... existing dashboard content */}
      </div>
    </>
  );
}
```

### 6. Profile Page Enhancement

**File:** `src/app/profile/index.tsx` (enhance existing component)

Add display name editing capability:

```typescript
// Add to existing ProfilePage component
import { useSearchParams } from 'react-router-dom';
import { EditDisplayNameModal } from '../../components/profile/EditDisplayNameModal';

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  // Check if we should open edit modal from query param
  useEffect(() => {
    if (searchParams.get('edit') === 'display_name') {
      setIsEditingDisplayName(true);
      // Remove query param
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleUpdateDisplayName = async (newName: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: newName,
          hebrew_name_suggestion_dismissed: false, // Reset flag on name change
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'השם עודכן בהצלחה',
        description: 'שם התצוגה שלך עודכן',
      });
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  };

  return (
    <>
      {/* Edit Display Name Modal */}
      <EditDisplayNameModal
        currentName={profile?.display_name || ''}
        isOpen={isEditingDisplayName}
        onClose={() => setIsEditingDisplayName(false)}
        onSave={handleUpdateDisplayName}
      />

      {/* Rest of profile page */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-[1600px] mx-auto">
        {/* Add edit display name button to profile header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{profile?.display_name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingDisplayName(true)}
          >
            ערוך שם
          </Button>
        </div>

        {/* ... rest of profile content */}
      </div>
    </>
  );
}
```

### 7. Hebrew Locale Additions

**File:** `src/lib/locale/he.ts`

Add new strings:

```typescript
export interface LocaleStrings {
  // ... existing sections

  profile: {
    // ... existing fields
    editDisplayName: string;
    currentName: string;
    newHebrewName: string;
    enterHebrewName: string;
    nameSaved: string;
    nameUpdateFailed: string;
    exampleName: string;
    nameRequiresHebrew: string;
  };

  banners: {
    hebrewNameSuggestion: string;
    hebrewNameAccept: string;
    hebrewNameDismiss: string;
  };
}

export const hebrewLocale: LocaleStrings = {
  // ... existing translations

  profile: {
    // ... existing fields
    editDisplayName: 'ערוך שם',
    currentName: 'שם נוכחי',
    newHebrewName: 'שם חדש בעברית',
    enterHebrewName: 'הזן את שמך בעברית',
    nameSaved: 'השם עודכן בהצלחה',
    nameUpdateFailed: 'שגיאה בשמירת השם. אנא נסה שוב.',
    exampleName: 'למשל: יוסי כהן',
    nameRequiresHebrew: 'השם חייב להכיל תווים בעברית',
  },

  banners: {
    hebrewNameSuggestion: 'שמנו לב שהשם שלך באנגלית. האם תרצה לשנות אותו לעברית?',
    hebrewNameAccept: 'כן, עדכן',
    hebrewNameDismiss: 'אל תציג שוב',
  },
};
```

---

## 🧪 Testing Scenarios

### Scenario 1: English Name Detection
1. Register with English name: "John Smith"
2. Complete onboarding
3. Navigate to dashboard
4. **Expected**: Banner appears with Hebrew name suggestion

### Scenario 2: Accept Suggestion
1. See banner
2. Click "כן, עדכן"
3. **Expected**: Navigate to profile page with edit modal open
4. Enter Hebrew name: "יוחנן שמעון"
5. Click "שמור"
6. **Expected**: Name updates in header, modal closes, banner never appears again

### Scenario 3: Dismiss Suggestion
1. See banner
2. Click "אל תציג שוב"
3. **Expected**: Banner disappears, never appears again
4. Logout and login
5. **Expected**: Banner does not reappear

### Scenario 4: Hebrew Name (No Suggestion)
1. Register with Hebrew name: "יוסי כהן"
2. Complete onboarding
3. Navigate to dashboard
4. **Expected**: No banner appears

### Scenario 5: Mixed Name
1. Register with mixed name: "John כהן"
2. Complete onboarding
3. Navigate to dashboard
4. **Expected**: Banner appears (>50% English)

### Scenario 6: Name Change Detection
1. Have Hebrew name: "יוסי כהן"
2. Change to English name: "Joe Cohen" (via profile settings)
3. Return to dashboard
4. **Expected**: Banner appears again (flag was reset)

### Scenario 7: Validation
1. Click "כן, עדכן" on banner
2. Try to save English name: "John Smith"
3. **Expected**: Error message: "השם חייב להכיל תווים בעברית"
4. Enter Hebrew name with English: "יוסי Smith"
5. **Expected**: Saves successfully (contains Hebrew)

### Scenario 8: Close Banner (X)
1. See banner
2. Click X button
3. **Expected**: Banner closes for current session
4. Refresh page
5. **Expected**: Banner reappears (not permanently dismissed)

---

## ✅ Definition of Done

- [ ] Database migration creates `hebrew_name_suggestion_dismissed` column
- [ ] TypeScript types updated for new profile field
- [ ] `detectLanguage.ts` utility created with tests
- [ ] `HebrewNameSuggestionBanner` component created
- [ ] `EditDisplayNameModal` component created
- [ ] Dashboard integrated with banner logic
- [ ] Profile page enhanced with display name editing
- [ ] Hebrew locale strings added
- [ ] All 8 test scenarios pass
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Responsive design tested (mobile + desktop)
- [ ] RTL layout verified
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Story documented in completion file

---

## 📚 Dependencies

**Depends On:**
- Story 5.1 (Dashboard)
- Story 2.10 (Profile Page)
- Hebrew-Only Policy (HEBREW-ONLY-POLICY.md)

**Blocks:**
- None

**Related:**
- Epic: User Profile & Preferences
- Profile editing features

---

## 🎨 Design Notes

### UI/UX Principles
- **Non-intrusive**: Banner at top, doesn't block content
- **Clear actions**: Two distinct buttons with clear outcomes
- **Single task modal**: Edit modal focuses only on name change
- **Validation feedback**: Immediate feedback on input validation
- **Dismissible**: User has full control (temporary close or permanent dismiss)

### Visual Design
- **Banner**: Light blue background (`bg-blue-50`), subtle border
- **Icon**: IconLanguage (represents translation/language)
- **Buttons**: Primary for "Accept", Ghost for "Dismiss"
- **Modal**: Centered, clean design, shows current vs new name
- **Example text**: Shows Hebrew name format

### Hebrew Text
All UI text in Hebrew:
- "שמנו לב שהשם שלך באנגלית. האם תרצה לשנות אותו לעברית?"
- "כן, עדכן" / "אל תציג שוב"
- "עדכון שם תצוגה"
- "שם נוכחי" / "שם חדש בעברית"
- "למשל: יוסי כהן"

---

## 🔮 Future Enhancements

**Post-MVP:**
- Auto-translate names using external API (e.g., Google Translate)
- Suggest Hebrew name based on common English→Hebrew mappings
- Allow users to store both English + Hebrew names (display name + native name)
- Add "Remind me later" option (shows again in X days)
- Analytics: Track how many users accept vs dismiss suggestion
- A/B test different banner messages for better conversion

---

## 📝 Notes

**Why This Matters:**
- Aligns with Hebrew-Only Policy
- Improves user experience for Hebrew-speaking users
- Gentle nudge, not forced (respects user autonomy)
- Helps maintain consistent Hebrew UI throughout platform

**Implementation Priority:**
- P2 (Nice to have)
- Can be implemented after core features (Epics 1-6)
- Good candidate for Epic 10 (Settings & Preferences)

**Technical Complexity:**
- **Low-Medium**: Straightforward detection + UI components
- **Story Points: 3**
  - 1 point: Database migration + detection logic
  - 1 point: Banner component + dashboard integration
  - 1 point: Profile editing + modal component

---

**Created By:** BMad Master
**Date:** November 8, 2025
**Status:** Ready for Sprint Planning

