/**
 * Admin Notification Preferences Page
 * Story 9.5: Implement Admin Notifications and Alerts
 *
 * Page for admins to configure their notification preferences
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BrandedLoader } from '@/components/ui/branded-loader';
import { IconCheck, IconSettings } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import {
  fetchAdminNotificationPreferences,
  updateAdminNotificationPreferences,
  type AdminNotificationPreferences,
} from '@/lib/actions/adminNotifications';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/**
 * Admin Notification Preferences Page
 */
export function AdminNotificationPreferencesPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AdminNotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const locale = hebrewLocale.pages.admin.notifications;

  // Load preferences
  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id]);

  /**
   * Load admin notification preferences
   */
  async function loadPreferences() {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const data = await fetchAdminNotificationPreferences(user.id);
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('שגיאה בטעינת הגדרות');
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Save preferences
   */
  async function savePreferences() {
    if (!user?.id || !preferences) return;

    setIsSaving(true);
    try {
      await updateAdminNotificationPreferences(user.id, preferences);
      toast.success(locale.preferencesSaved);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('שגיאה בשמירת הגדרות');
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Update preference field
   */
  function updatePreference<K extends keyof AdminNotificationPreferences>(
    key: K,
    value: AdminNotificationPreferences[K]
  ) {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      [key]: value,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full -mt-20">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full -mt-20">
        <div className="text-center text-gray-500">
          לא נמצאו הגדרות
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <IconSettings size={32} className="text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">{locale.preferencesTitle}</h1>
          </div>
          <p className="text-gray-600">{locale.preferencesDescription}</p>
        </div>

        {/* Preferences Grid */}
        <div className="space-y-6">
          {/* New User Digest */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{locale.newUserDigestLabel}</h3>
                  <p className="text-sm text-gray-600">{locale.newUserDigestDescription}</p>
                </div>
                <Switch
                  checked={preferences.new_user_digest_enabled}
                  onCheckedChange={(checked) => updatePreference('new_user_digest_enabled', checked)}
                />
              </div>

              {preferences.new_user_digest_enabled && (
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Label className="text-sm font-medium">{locale.frequency}:</Label>
                  <Select
                    value={preferences.new_user_digest_frequency}
                    onValueChange={(value) => updatePreference('new_user_digest_frequency', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{locale.immediate}</SelectItem>
                      <SelectItem value="daily">{locale.daily}</SelectItem>
                      <SelectItem value="weekly">{locale.weekly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Content Flagged */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{locale.contentFlaggedLabel}</h3>
                  <p className="text-sm text-gray-600">{locale.contentFlaggedDescription}</p>
                </div>
                <Switch
                  checked={preferences.content_flagged_enabled}
                  onCheckedChange={(checked) => updatePreference('content_flagged_enabled', checked)}
                />
              </div>

              {preferences.content_flagged_enabled && (
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Label className="text-sm font-medium">{locale.frequency}:</Label>
                  <Select
                    value={preferences.content_flagged_frequency}
                    onValueChange={(value) => updatePreference('content_flagged_frequency', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{locale.immediate}</SelectItem>
                      <SelectItem value="daily">{locale.daily}</SelectItem>
                      <SelectItem value="weekly">{locale.weekly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Low Engagement */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{locale.lowEngagementLabel}</h3>
                  <p className="text-sm text-gray-600">{locale.lowEngagementDescription}</p>
                </div>
                <Switch
                  checked={preferences.low_engagement_enabled}
                  onCheckedChange={(checked) => updatePreference('low_engagement_enabled', checked)}
                />
              </div>

              {preferences.low_engagement_enabled && (
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Label className="text-sm font-medium">{locale.frequency}:</Label>
                  <Select
                    value={preferences.low_engagement_frequency}
                    onValueChange={(value) => updatePreference('low_engagement_frequency', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{locale.immediate}</SelectItem>
                      <SelectItem value="daily">{locale.daily}</SelectItem>
                      <SelectItem value="weekly">{locale.weekly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Performance Issues */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{locale.performanceIssuesLabel}</h3>
                  <p className="text-sm text-gray-600">{locale.performanceIssuesDescription}</p>
                </div>
                <Switch
                  checked={preferences.performance_issues_enabled}
                  onCheckedChange={(checked) => updatePreference('performance_issues_enabled', checked)}
                />
              </div>

              {preferences.performance_issues_enabled && (
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Label className="text-sm font-medium">{locale.frequency}:</Label>
                  <Select
                    value={preferences.performance_issues_frequency}
                    onValueChange={(value) => updatePreference('performance_issues_frequency', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{locale.immediate}</SelectItem>
                      <SelectItem value="daily">{locale.daily}</SelectItem>
                      <SelectItem value="weekly">{locale.weekly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Milestones */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{locale.milestonesLabel}</h3>
                  <p className="text-sm text-gray-600">{locale.milestonesDescription}</p>
                </div>
                <Switch
                  checked={preferences.milestones_enabled}
                  onCheckedChange={(checked) => updatePreference('milestones_enabled', checked)}
                />
              </div>

              {preferences.milestones_enabled && (
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Label className="text-sm font-medium">{locale.frequency}:</Label>
                  <Select
                    value={preferences.milestones_frequency}
                    onValueChange={(value) => updatePreference('milestones_frequency', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{locale.immediate}</SelectItem>
                      <SelectItem value="daily">{locale.daily}</SelectItem>
                      <SelectItem value="weekly">{locale.weekly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={savePreferences}
            disabled={isSaving}
            className="min-w-[200px]"
          >
            {isSaving ? (
              'שומר...'
            ) : (
              <>
                <IconCheck size={20} className="ml-2" />
                {locale.savePreferences}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

