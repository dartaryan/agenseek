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
 * Story 0.9: Notification preferences - what to notify about
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

      <p className="text-sm text-muted-foreground">
        בחר על אילו פעילויות תרצה לקבל התראות באתר
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label htmlFor="notify-comments" className="text-sm font-medium">
              תגובות חדשות
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              קבל התראה כשמישהו מגיב על התגובה שלך
            </p>
          </div>
          <Switch
            id="notify-comments"
            checked={notificationPrefs.email_comment_replies}
            onCheckedChange={(checked) => handleToggle('email_comment_replies', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label htmlFor="notify-guides" className="text-sm font-medium">
              מדריכים חדשים
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              קבל התראה על מדריכים חדשים שמתאימים לתחומי העניין שלך
            </p>
          </div>
          <Switch
            id="notify-guides"
            checked={notificationPrefs.email_new_guides}
            onCheckedChange={(checked) => handleToggle('email_new_guides', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label htmlFor="notify-milestones" className="text-sm font-medium">
              הישגים וציוני דרך
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              קבל התראה כשאתה משלים יעדי למידה והישגים
            </p>
          </div>
          <Switch
            id="notify-milestones"
            checked={notificationPrefs.email_milestones}
            onCheckedChange={(checked) => handleToggle('email_milestones', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex-1">
            <Label htmlFor="notify-admin" className="text-sm font-medium">
              הודעות מנהלי המערכת
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              קבל התראה על עדכונים חשובים ושינויים באתר
            </p>
          </div>
          <Switch
            id="notify-admin"
            checked={notificationPrefs.email_admin_announcements}
            onCheckedChange={(checked) => handleToggle('email_admin_announcements', checked)}
          />
        </div>
      </div>
    </Card>
  );
}

