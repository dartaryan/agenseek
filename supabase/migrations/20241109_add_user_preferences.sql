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

-- Add comments
COMMENT ON COLUMN profiles.notification_prefs IS 'User notification preferences (Story 0.9)';
COMMENT ON COLUMN profiles.appearance_prefs IS 'User appearance/theme preferences (Story 0.9)';
COMMENT ON COLUMN profiles.privacy_prefs IS 'User privacy settings (Story 0.9)';
COMMENT ON COLUMN profiles.language_prefs IS 'User language/locale preferences (Story 0.9)';

