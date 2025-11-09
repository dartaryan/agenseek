'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

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

export function PreferencesProvider({ children }: { children: ReactNode }) {
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
          setNotificationPrefs({ ...DEFAULT_NOTIFICATION_PREFS, ...((data as any).notification_prefs || {}) });
          setAppearancePrefs({ ...DEFAULT_APPEARANCE_PREFS, ...((data as any).appearance_prefs || {}) });
          setPrivacyPrefs({ ...DEFAULT_PRIVACY_PREFS, ...((data as any).privacy_prefs || {}) });
          setLanguagePrefs({ ...DEFAULT_LANGUAGE_PREFS, ...((data as any).language_prefs || {}) });
        }
      } catch (error) {
        // Silent error - user will see defaults
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
        .update({ notification_prefs: newPrefs } as any)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
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
        .update({ appearance_prefs: newPrefs } as any)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
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
        .update({ privacy_prefs: newPrefs } as any)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
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
        .update({ language_prefs: newPrefs } as any)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      setLanguagePrefs(languagePrefs);
      throw error;
    }
  }, [user?.id, languagePrefs]);

  const resetToDefaults = useCallback(async (category: 'notification' | 'appearance' | 'privacy' | 'language') => {
    if (!user?.id) return;

    try {
      let update: Record<string, unknown> = {};

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
        .update(update as any)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
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

