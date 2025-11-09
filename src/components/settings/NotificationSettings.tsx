import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { IconBell, IconRefresh } from '@tabler/icons-react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useToast } from '../../hooks/use-toast';

/**
 * NotificationSettings Component
 * Story 0.9: Notification preferences settings (simplified - in-app only)
 */
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
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-foreground">התראות</h3>
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

      {/* In-App Notifications */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          התראות באפליקציה
        </h4>

        <p className="text-sm text-muted-foreground">
          קבל התראות על פעילויות חשובות ישירות בתוך האתר
        </p>

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

