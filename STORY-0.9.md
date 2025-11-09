# Story 0.9: Implement Settings Page Features

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 5
**Priority:** P2 (Medium)
**Dependencies:** Story 0.6 (Dark Mode) recommended but not required

---

## User Story

As a user,
I want to configure my notification preferences, appearance, privacy settings, and language,
So that I can customize my experience and control how the application behaves.

---

## Business Context

**Current State:**
- Settings page has 4 placeholder cards with "coming soon" messages:
  - Notifications settings (התראות)
  - Appearance/Theme settings (מראה)
  - Privacy settings (פרטיות)
  - Language settings (שפה)
- Users cannot customize these preferences
- No persistence of user preferences
- Missing important privacy and personalization controls

**Impact:**
- Users lack control over their experience
- Cannot disable unwanted notifications
- Cannot control privacy of their profile/activity
- Cannot switch languages or adjust appearance
- Incomplete settings page looks unprofessional

**Solution:**
- Implement **Notification Preferences**: Control email notifications and in-app alerts
- Implement **Appearance Settings**: Dark mode toggle, compact view, font size
- Implement **Privacy Settings**: Profile visibility, activity tracking, data sharing
- Implement **Language Settings**: UI language selection, RTL toggle (future: English/Hebrew switch)
- Store all preferences in `profiles` table or new `user_preferences` table
- Apply preferences immediately without page reload

---

## Acceptance Criteria

### 1. Notification Preferences Settings

**Given I am on the Settings page**
**When I view the Notifications card**
**Then I should see:**

- ✅ **Email Notifications** section:
  - Toggle: "New guide recommendations" (מדריכים חדשים מומלצים)
  - Toggle: "Learning milestone achievements" (הישגי ציוני דרך בלמידה)
  - Toggle: "Comment replies" (תגובות לתגובות שלי)
  - Toggle: "Admin announcements" (הודעות מנהל)
  - Toggle: "Weekly digest email" (דוא"ל סיכום שבועי)

- ✅ **In-App Notifications** section:
  - Toggle: "Push notifications" (התראות דחיפה)
  - Toggle: "Sound alerts" (התראות קוליות)
  - Toggle: "Desktop notifications" (התראות שולחן עבודה - browser)

- ✅ **Notification Frequency**:
  - Radio: "Real-time" (בזמן אמת)
  - Radio: "Daily digest" (סיכום יומי)
  - Radio: "Weekly digest" (סיכום שבועי)

- ✅ All changes save immediately (optimistic updates)
- ✅ Success toast on save
- ✅ "Test notification" button to verify settings work

### 2. Appearance Settings

**Given I am on the Settings page**
**When I view the Appearance card**
**Then I should see:**

- ✅ **Theme Selection**:
  - Radio: "Light mode" (מצב בהיר)
  - Radio: "Dark mode" (מצב כהה)
  - Radio: "System default" (ברירת מחדל של המערכת)
  - Preview swatch showing current theme

- ✅ **Display Density**:
  - Radio: "Comfortable" (נוח - default spacing)
  - Radio: "Compact" (קומפקטי - tighter spacing)
  - Radio: "Spacious" (מרווח - extra spacing)

- ✅ **Font Size**:
  - Slider or Radio: "Small" / "Medium" (default) / "Large"
  - Preview text showing selected size

- ✅ **Sidebar Behavior**:
  - Toggle: "Remember sidebar state" (זכור מצב סרגל צד)
  - Radio: "Always expanded" (תמיד מורחב)
  - Radio: "Always collapsed" (תמיד מכווץ)
  - Radio: "Auto (based on screen size)" (אוטומטי)

- ✅ All changes apply immediately
- ✅ Preferences persist across sessions

### 3. Privacy Settings

**Given I am on the Settings page**
**When I view the Privacy card**
**Then I should see:**

- ✅ **Profile Visibility**:
  - Radio: "Public" (פומבי - anyone can view)
  - Radio: "Private" (פרטי - only admins can view)
  - Radio: "Registered users only" (משתמשים רשומים בלבד)

- ✅ **Activity Visibility**:
  - Toggle: "Show my reading progress publicly" (הצג התקדמות קריאה פומבית)
  - Toggle: "Show my completed guides" (הצג מדריכים שהשלמתי)
  - Toggle: "Show my comments publicly" (הצג תגובות שלי פומבית)

- ✅ **Data & Analytics**:
  - Toggle: "Allow usage analytics" (אפשר ניתוח שימוש)
  - Toggle: "Allow personalized recommendations" (אפשר המלצות מותאמות אישית)
  - Info text explaining what data is collected

- ✅ **Data Export** (GDPR compliance):
  - Button: "Download my data" (הורד את הנתונים שלי)
  - Generates JSON/CSV with all user data
  - Success message after download

- ✅ All changes save immediately
- ✅ Warning modal for privacy-reducing changes

### 4. Language Settings

**Given I am on the Settings page**
**When I view the Language card**
**Then I should see:**

- ✅ **UI Language**:
  - Radio: "עברית (Hebrew)" - selected by default
  - Radio: "English" - disabled with note "Coming soon"
  - Info: "תמיכה מלאה ב-RTL לעברית"

- ✅ **Date & Time Format**:
  - Radio: "Hebrew format (DD/MM/YYYY)"
  - Radio: "International format (YYYY-MM-DD)"
  - Preview showing current date in selected format

- ✅ **Number Format**:
  - Radio: "Hebrew (1,234.56)"
  - Radio: "European (1.234,56)"

- ✅ **Content Language Preference** (for future multi-language content):
  - Checkbox: "Hebrew content" (checked, disabled)
  - Checkbox: "English content" (unchecked, disabled)
  - Note: "Multiple languages coming soon"

- ✅ Changes apply immediately
- ✅ Page doesn't need reload (use context)

### 5. Settings Card Layout & UX

**Given I am on the Settings page**
**Then:**

- ✅ Each card has clear title and icon
- ✅ Settings grouped logically within cards
- ✅ Toggle switches have clear labels
- ✅ Radio buttons grouped with proper spacing
- ✅ Disabled options clearly marked
- ✅ Info tooltips for complex settings
- ✅ "Reset to defaults" button per card
- ✅ Mobile-responsive (Story 0.8 patterns)
- ✅ Dark mode support (Story 0.6)

---

## Technical Implementation

### Step 1: Database Schema Updates

**Create migration:** `supabase/migrations/YYYYMMDD_add_user_preferences.sql`

```sql
-- ============================================
-- Migration: Add User Preferences
-- Story: 0.9 - Implement Settings Page Features
-- ============================================

-- Add preference columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{
  "email_new_guides": true,
  "email_milestones": true,
  "email_comment_replies": true,
  "email_admin_announcements": true,
  "email_weekly_digest": false,
  "in_app_push": true,
  "in_app_sound": true,
  "in_app_desktop": false,
  "frequency": "realtime"
}'::jsonb,

ADD COLUMN IF NOT EXISTS appearance_prefs JSONB DEFAULT '{
  "theme": "system",
  "density": "comfortable",
  "font_size": "medium",
  "sidebar_behavior": "auto"
}'::jsonb,

ADD COLUMN IF NOT EXISTS privacy_prefs JSONB DEFAULT '{
  "profile_visibility": "registered",
  "show_reading_progress": true,
  "show_completed_guides": true,
  "show_comments": true,
  "allow_analytics": true,
  "allow_recommendations": true
}'::jsonb,

ADD COLUMN IF NOT EXISTS language_prefs JSONB DEFAULT '{
  "ui_language": "he",
  "date_format": "he",
  "number_format": "he"
}'::jsonb;

-- Add comment
COMMENT ON COLUMN profiles.notification_prefs IS 'User notification preferences (Story 0.9)';
COMMENT ON COLUMN profiles.appearance_prefs IS 'User appearance/theme preferences (Story 0.9)';
COMMENT ON COLUMN profiles.privacy_prefs IS 'User privacy settings (Story 0.9)';
COMMENT ON COLUMN profiles.language_prefs IS 'User language/locale preferences (Story 0.9)';
```

---

### Step 2: Create Preferences Context

**File:** `src/contexts/PreferencesContext.tsx` (NEW FILE)

```typescript
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export interface NotificationPrefs {
  email_new_guides: boolean;
  email_milestones: boolean;
  email_comment_replies: boolean;
  email_admin_announcements: boolean;
  email_weekly_digest: boolean;
  in_app_push: boolean;
  in_app_sound: boolean;
  in_app_desktop: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
}

export interface AppearancePrefs {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact' | 'spacious';
  font_size: 'small' | 'medium' | 'large';
  sidebar_behavior: 'always_expanded' | 'always_collapsed' | 'auto';
}

export interface PrivacyPrefs {
  profile_visibility: 'public' | 'private' | 'registered';
  show_reading_progress: boolean;
  show_completed_guides: boolean;
  show_comments: boolean;
  allow_analytics: boolean;
  allow_recommendations: boolean;
}

export interface LanguagePrefs {
  ui_language: 'he' | 'en';
  date_format: 'he' | 'international';
  number_format: 'he' | 'european';
}

interface PreferencesContextType {
  notificationPrefs: NotificationPrefs;
  appearancePrefs: AppearancePrefs;
  privacyPrefs: PrivacyPrefs;
  languagePrefs: LanguagePrefs;
  updateNotificationPrefs: (prefs: Partial<NotificationPrefs>) => Promise<void>;
  updateAppearancePrefs: (prefs: Partial<AppearancePrefs>) => Promise<void>;
  updatePrivacyPrefs: (prefs: Partial<PrivacyPrefs>) => Promise<void>;
  updateLanguagePrefs: (prefs: Partial<LanguagePrefs>) => Promise<void>;
  resetToDefaults: (category: 'notification' | 'appearance' | 'privacy' | 'language') => Promise<void>;
  loading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  email_new_guides: true,
  email_milestones: true,
  email_comment_replies: true,
  email_admin_announcements: true,
  email_weekly_digest: false,
  in_app_push: true,
  in_app_sound: true,
  in_app_desktop: false,
  frequency: 'realtime',
};

const DEFAULT_APPEARANCE_PREFS: AppearancePrefs = {
  theme: 'system',
  density: 'comfortable',
  font_size: 'medium',
  sidebar_behavior: 'auto',
};

const DEFAULT_PRIVACY_PREFS: PrivacyPrefs = {
  profile_visibility: 'registered',
  show_reading_progress: true,
  show_completed_guides: true,
  show_comments: true,
  allow_analytics: true,
  allow_recommendations: true,
};

const DEFAULT_LANGUAGE_PREFS: LanguagePrefs = {
  ui_language: 'he',
  date_format: 'he',
  number_format: 'he',
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [appearancePrefs, setAppearancePrefs] = useState<AppearancePrefs>(DEFAULT_APPEARANCE_PREFS);
  const [privacyPrefs, setPrivacyPrefs] = useState<PrivacyPrefs>(DEFAULT_PRIVACY_PREFS);
  const [languagePrefs, setLanguagePrefs] = useState<LanguagePrefs>(DEFAULT_LANGUAGE_PREFS);
  const [loading, setLoading] = useState(true);

  // Load preferences from database
  useEffect(() => {
    async function loadPreferences() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_prefs, appearance_prefs, privacy_prefs, language_prefs')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setNotificationPrefs({ ...DEFAULT_NOTIFICATION_PREFS, ...(data.notification_prefs as any) });
          setAppearancePrefs({ ...DEFAULT_APPEARANCE_PREFS, ...(data.appearance_prefs as any) });
          setPrivacyPrefs({ ...DEFAULT_PRIVACY_PREFS, ...(data.privacy_prefs as any) });
          setLanguagePrefs({ ...DEFAULT_LANGUAGE_PREFS, ...(data.language_prefs as any) });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user?.id]);

  // Apply appearance preferences to DOM
  useEffect(() => {
    // Apply density class to body
    document.body.classList.remove('density-comfortable', 'density-compact', 'density-spacious');
    document.body.classList.add(`density-${appearancePrefs.density}`);

    // Apply font size class
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.body.classList.add(`font-size-${appearancePrefs.font_size}`);
  }, [appearancePrefs.density, appearancePrefs.font_size]);

  const updateNotificationPrefs = useCallback(async (prefs: Partial<NotificationPrefs>) => {
    if (!user?.id) return;

    const newPrefs = { ...notificationPrefs, ...prefs };
    setNotificationPrefs(newPrefs);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_prefs: newPrefs })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert on error
      setNotificationPrefs(notificationPrefs);
      throw error;
    }
  }, [user?.id, notificationPrefs]);

  const updateAppearancePrefs = useCallback(async (prefs: Partial<AppearancePrefs>) => {
    if (!user?.id) return;

    const newPrefs = { ...appearancePrefs, ...prefs };
    setAppearancePrefs(newPrefs);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ appearance_prefs: newPrefs })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating appearance preferences:', error);
      setAppearancePrefs(appearancePrefs);
      throw error;
    }
  }, [user?.id, appearancePrefs]);

  const updatePrivacyPrefs = useCallback(async (prefs: Partial<PrivacyPrefs>) => {
    if (!user?.id) return;

    const newPrefs = { ...privacyPrefs, ...prefs };
    setPrivacyPrefs(newPrefs);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ privacy_prefs: newPrefs })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating privacy preferences:', error);
      setPrivacyPrefs(privacyPrefs);
      throw error;
    }
  }, [user?.id, privacyPrefs]);

  const updateLanguagePrefs = useCallback(async (prefs: Partial<LanguagePrefs>) => {
    if (!user?.id) return;

    const newPrefs = { ...languagePrefs, ...prefs };
    setLanguagePrefs(newPrefs);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ language_prefs: newPrefs })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating language preferences:', error);
      setLanguagePrefs(languagePrefs);
      throw error;
    }
  }, [user?.id, languagePrefs]);

  const resetToDefaults = useCallback(async (category: 'notification' | 'appearance' | 'privacy' | 'language') => {
    if (!user?.id) return;

    try {
      let update: any = {};

      switch (category) {
        case 'notification':
          update = { notification_prefs: DEFAULT_NOTIFICATION_PREFS };
          setNotificationPrefs(DEFAULT_NOTIFICATION_PREFS);
          break;
        case 'appearance':
          update = { appearance_prefs: DEFAULT_APPEARANCE_PREFS };
          setAppearancePrefs(DEFAULT_APPEARANCE_PREFS);
          break;
        case 'privacy':
          update = { privacy_prefs: DEFAULT_PRIVACY_PREFS };
          setPrivacyPrefs(DEFAULT_PRIVACY_PREFS);
          break;
        case 'language':
          update = { language_prefs: DEFAULT_LANGUAGE_PREFS };
          setLanguagePrefs(DEFAULT_LANGUAGE_PREFS);
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }, [user?.id]);

  return (
    <PreferencesContext.Provider
      value={{
        notificationPrefs,
        appearancePrefs,
        privacyPrefs,
        languagePrefs,
        updateNotificationPrefs,
        updateAppearancePrefs,
        updatePrivacyPrefs,
        updateLanguagePrefs,
        resetToDefaults,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
```

---

### Step 3: Create Settings Components

**File:** `src/components/settings/NotificationSettings.tsx` (NEW FILE)

```typescript
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconBell, IconRefresh, IconCheck } from '@tabler/icons-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useToast } from '@/hooks/use-toast';

export function NotificationSettings() {
  const { notificationPrefs, updateNotificationPrefs, resetToDefaults } = usePreferences();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleToggle = async (key: keyof typeof notificationPrefs, value: boolean) => {
    try {
      await updateNotificationPrefs({ [key]: value });
      toast({
        title: 'העדפות עודכנו',
        description: 'הגדרות ההתראות שלך נשמרו',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן הגדרות',
      });
    }
  };

  const handleFrequencyChange = async (frequency: 'realtime' | 'daily' | 'weekly') => {
    try {
      await updateNotificationPrefs({ frequency });
      toast({
        title: 'תדירות עודכנה',
        description: 'הגדרות תדירות ההתראות שלך נשמרו',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן תדירות',
      });
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults('notification');
      toast({
        title: 'איפוס הושלם',
        description: 'הגדרות ההתראות אופסו לברירת המחדל',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לאפס הגדרות',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleTestNotification = () => {
    toast({
      title: 'התראת בדיקה',
      description: 'זוהי התראת בדיקה - ההגדרות שלך פועלות!',
      icon: <IconCheck className="w-5 h-5 text-green-500" />,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBell className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">התראות</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isResetting}
        >
          <IconRefresh className="w-4 h-4 ml-2" />
          איפוס
        </Button>
      </div>

      {/* Email Notifications */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          התראות במייל
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-new-guides" className="text-sm">
              מדריכים חדשים מומלצים
            </Label>
            <Switch
              id="email-new-guides"
              checked={notificationPrefs.email_new_guides}
              onCheckedChange={(checked) => handleToggle('email_new_guides', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-milestones" className="text-sm">
              הישגי ציוני דרך בלמידה
            </Label>
            <Switch
              id="email-milestones"
              checked={notificationPrefs.email_milestones}
              onCheckedChange={(checked) => handleToggle('email_milestones', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-replies" className="text-sm">
              תגובות לתגובות שלי
            </Label>
            <Switch
              id="email-replies"
              checked={notificationPrefs.email_comment_replies}
              onCheckedChange={(checked) => handleToggle('email_comment_replies', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-admin" className="text-sm">
              הודעות מנהל
            </Label>
            <Switch
              id="email-admin"
              checked={notificationPrefs.email_admin_announcements}
              onCheckedChange={(checked) => handleToggle('email_admin_announcements', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-weekly" className="text-sm">
              דוא"ל סיכום שבועי
            </Label>
            <Switch
              id="email-weekly"
              checked={notificationPrefs.email_weekly_digest}
              onCheckedChange={(checked) => handleToggle('email_weekly_digest', checked)}
            />
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          התראות באפליקציה
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="in-app-push" className="text-sm">
              התראות דחיפה
            </Label>
            <Switch
              id="in-app-push"
              checked={notificationPrefs.in_app_push}
              onCheckedChange={(checked) => handleToggle('in_app_push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="in-app-sound" className="text-sm">
              התראות קוליות
            </Label>
            <Switch
              id="in-app-sound"
              checked={notificationPrefs.in_app_sound}
              onCheckedChange={(checked) => handleToggle('in_app_sound', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="in-app-desktop" className="text-sm">
              התראות שולחן עבודה
            </Label>
            <Switch
              id="in-app-desktop"
              checked={notificationPrefs.in_app_desktop}
              onCheckedChange={(checked) => handleToggle('in_app_desktop', checked)}
            />
          </div>
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          תדירות התראות
        </h4>

        <RadioGroup
          value={notificationPrefs.frequency}
          onValueChange={(value) => handleFrequencyChange(value as any)}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="realtime" id="freq-realtime" />
            <Label htmlFor="freq-realtime" className="text-sm">
              בזמן אמת
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="daily" id="freq-daily" />
            <Label htmlFor="freq-daily" className="text-sm">
              סיכום יומי
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="weekly" id="freq-weekly" />
            <Label htmlFor="freq-weekly" className="text-sm">
              סיכום שבועי
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Test Button */}
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={handleTestNotification}>
          <IconBell className="w-4 h-4 ml-2" />
          בדוק התראה
        </Button>
      </div>
    </Card>
  );
}
```

**Similar files to create:**
- `src/components/settings/AppearanceSettings.tsx`
- `src/components/settings/PrivacySettings.tsx`
- `src/components/settings/LanguageSettings.tsx`

*(I'll provide abbreviated versions for brevity)*

---

### Step 4: Update Settings Page

**File:** `src/app/settings/index.tsx`

**Replace placeholder cards with real components:**

```typescript
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

export function SettingsPage() {
  // ... existing code ...

  return (
    <PreferencesProvider>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {hebrewLocale.pages.settings.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {hebrewLocale.pages.settings.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Avatar - existing */}
            <Card className="p-6 space-y-4">
              {/* ... existing profile card ... */}
            </Card>

            {/* Notification Settings - NEW */}
            <NotificationSettings />

            {/* Appearance Settings - NEW */}
            <AppearanceSettings />

            {/* Privacy Settings - NEW */}
            <PrivacySettings />

            {/* Language Settings - NEW */}
            <LanguageSettings />

            {/* Danger Zone - existing */}
            <Card className="p-6 space-y-3 border-red-200">
              {/* ... existing delete account card ... */}
            </Card>
          </div>

          <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
        </div>
      </div>
    </PreferencesProvider>
  );
}
```

---

### Step 5: Add CSS for Density and Font Size

**File:** `src/index.css` or `src/app/globals.css`

```css
/* Density variations - Story 0.9 */
body.density-comfortable {
  /* Default spacing - no changes needed */
}

body.density-compact {
  /* Reduce spacing globally */
  --spacing-scale: 0.75;
}

body.density-compact .card {
  padding: 1rem;
}

body.density-compact .space-y-6 > * + * {
  margin-top: 1rem;
}

body.density-spacious {
  /* Increase spacing globally */
  --spacing-scale: 1.25;
}

body.density-spacious .card {
  padding: 2rem;
}

body.density-spacious .space-y-6 > * + * {
  margin-top: 2rem;
}

/* Font size variations - Story 0.9 */
body.font-size-small {
  font-size: 14px;
}

body.font-size-medium {
  font-size: 16px; /* default */
}

body.font-size-large {
  font-size: 18px;
}
```

---

### Step 6: Integrate Theme Toggle with Story 0.6

**If Story 0.6 is complete**, integrate theme toggle:

```typescript
// In AppearanceSettings.tsx
import { useTheme } from '@/components/theme-provider';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { appearancePrefs, updateAppearancePrefs } = usePreferences();

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    // Update theme provider
    setTheme(newTheme);

    // Update preferences
    await updateAppearancePrefs({ theme: newTheme });
  };

  // ... rest of component
}
```

---

### Step 7: Implement Data Export (GDPR)

**File:** `src/lib/actions/exportUserData.ts` (NEW FILE)

```typescript
import { supabase } from '@/lib/supabase';

export async function exportUserData(userId: string) {
  try {
    // Fetch all user data
    const [profile, progress, comments, notifications] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_progress').select('*').eq('user_id', userId),
      supabase.from('guide_comments').select('*').eq('user_id', userId),
      supabase.from('user_notifications').select('*').eq('user_id', userId),
    ]);

    // Compile data
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      profile: profile.data,
      progress: progress.data,
      comments: comments.data,
      notifications: notifications.data,
    };

    // Convert to JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenseek-data-${userId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}
```

---

## Definition of Done

- [ ] Database migration created with preference columns
- [ ] PreferencesContext implemented
- [ ] NotificationSettings component created
- [ ] AppearanceSettings component created
- [ ] PrivacySettings component created
- [ ] LanguageSettings component created
- [ ] Settings page updated to use new components
- [ ] All toggles/switches save immediately
- [ ] Success toasts show on preference updates
- [ ] "Reset to defaults" buttons work per card
- [ ] Density classes applied to body
- [ ] Font size classes applied to body
- [ ] Theme toggle integrated (if Story 0.6 done)
- [ ] Data export button downloads JSON
- [ ] Test notification button works
- [ ] Mobile responsive (follows Story 0.8 patterns)
- [ ] Dark mode support (follows Story 0.6 patterns)
- [ ] TypeScript errors resolved
- [ ] Linter errors resolved
- [ ] Build completes successfully
- [ ] Manual testing on all preference types

---

## Related Files

**Created:**
- `supabase/migrations/YYYYMMDD_add_user_preferences.sql` - Database schema
- `src/contexts/PreferencesContext.tsx` - Preferences state management
- `src/components/settings/NotificationSettings.tsx` - Notification prefs UI
- `src/components/settings/AppearanceSettings.tsx` - Appearance prefs UI
- `src/components/settings/PrivacySettings.tsx` - Privacy prefs UI
- `src/components/settings/LanguageSettings.tsx` - Language prefs UI
- `src/lib/actions/exportUserData.ts` - GDPR data export

**Modified:**
- `src/app/settings/index.tsx` - Replace placeholders with real components
- `src/app/layout.tsx` - Add PreferencesProvider wrapper
- `src/index.css` or `src/app/globals.css` - Add density/font-size CSS

**Reference:**
- `STORY-0.6-COMPLETE.md` - Dark mode implementation (for theme toggle)
- `STORY-0.8-COMPLETE.md` - Mobile responsiveness patterns

---

## Estimated Effort

**Story Points:** 5

**Breakdown:**
- Database migration: 20 min
- PreferencesContext: 60 min
- NotificationSettings component: 45 min
- AppearanceSettings component: 45 min
- PrivacySettings component: 45 min
- LanguageSettings component: 30 min
- Update Settings page: 30 min
- CSS for density/font-size: 30 min
- Data export functionality: 30 min
- Theme integration (if 0.6 done): 20 min
- Testing all preferences: 60 min
- Mobile testing: 30 min
- Visual QA and polish: 30 min

**Total:** ~7.5 hours

---

## Success Metrics

**User Experience:**
- Users can customize notification delivery
- Users can personalize appearance
- Users can control privacy/visibility
- Users can configure language/locale settings
- All settings persist correctly

**Technical:**
- Clean preferences architecture
- Optimistic updates for instant feedback
- Proper error handling and recovery
- GDPR-compliant data export

**Engagement:**
- Higher user satisfaction with customization
- Reduced support requests about notifications
- Better privacy transparency

---

## Testing Scenarios

### Happy Path - Notification Preferences
1. User navigates to Settings
2. User toggles "Email new guides" OFF
3. **Expected:**
   - Toggle switches to OFF immediately
   - Success toast appears
   - Setting saves to database
   - After refresh, toggle still OFF

### Happy Path - Appearance Change
1. User on Settings page
2. User selects "Compact" density
3. **Expected:**
   - UI spacing reduces immediately
   - Cards become more compact
   - Success toast appears
   - Refresh maintains compact view

### Happy Path - Data Export
1. User on Settings > Privacy
2. User clicks "Download my data"
3. **Expected:**
   - JSON file downloads
   - Contains all user data (profile, progress, comments)
   - Success message appears

### Edge Case - Offline Save
1. User toggles preference
2. Network is offline
3. **Expected:**
   - UI updates optimistically
   - Error toast after timeout
   - Preference reverts to previous state
   - User can retry when online

### Edge Case - Concurrent Updates
1. User rapidly toggles multiple preferences
2. **Expected:**
   - All changes queue properly
   - No race conditions
   - All preferences save correctly

---

**Created:** November 9, 2025
**Author:** BMad Master
**Status:** Ready to Implement

