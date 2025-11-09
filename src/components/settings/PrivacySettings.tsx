import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { IconShield, IconRefresh, IconDownload } from '@tabler/icons-react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';
import { exportUserData } from '../../lib/actions/exportUserData';

/**
 * PrivacySettings Component
 * Story 0.9: Privacy preferences settings with GDPR data export
 */
export function PrivacySettings() {
  const { privacyPrefs, updatePrivacyPrefs, resetToDefaults } = usePreferences();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleVisibilityChange = async (profile_visibility: 'public' | 'private' | 'registered') => {
    try {
      await updatePrivacyPrefs({ profile_visibility });
      toast({
        title: 'נראות פרופיל עודכנה',
        description: 'הגדרת הנראות שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן נראות פרופיל',
      });
    }
  };

  const handleToggle = async (key: keyof typeof privacyPrefs, value: boolean) => {
    try {
      await updatePrivacyPrefs({ [key]: value });
      toast({
        title: 'העדפות פרטיות עודכנו',
        description: 'הגדרות הפרטיות שלך נשמרו',
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
      await resetToDefaults('privacy');
      toast({
        title: 'איפוס הושלם',
        description: 'הגדרות הפרטיות אופסו לברירת המחדל',
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

  const handleDataExport = async () => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לזהות משתמש',
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportUserData(user.id);
      toast({
        title: 'ייצוא הושלם',
        description: 'הנתונים שלך הורדו בהצלחה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לייצא נתונים',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconShield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-foreground">פרטיות</h3>
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

      {/* Profile Visibility */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          נראות פרופיל
        </h4>

        <RadioGroup
          value={privacyPrefs.profile_visibility}
          onValueChange={(value) => handleVisibilityChange(value as 'public' | 'private' | 'registered')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="public" id="visibility-public" />
            <Label htmlFor="visibility-public" className="text-sm">
              פומבי (כולם יכולים לראות)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="registered" id="visibility-registered" />
            <Label htmlFor="visibility-registered" className="text-sm">
              משתמשים רשומים בלבד (ברירת מחדל)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="private" id="visibility-private" />
            <Label htmlFor="visibility-private" className="text-sm">
              פרטי (רק מנהלים)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Activity Visibility */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          נראות פעילות
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-progress" className="text-sm">
              הצג התקדמות קריאה פומבית
            </Label>
            <Switch
              id="show-progress"
              checked={privacyPrefs.show_reading_progress}
              onCheckedChange={(checked) => handleToggle('show_reading_progress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-completed" className="text-sm">
              הצג מדריכים שהשלמתי
            </Label>
            <Switch
              id="show-completed"
              checked={privacyPrefs.show_completed_guides}
              onCheckedChange={(checked) => handleToggle('show_completed_guides', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-comments" className="text-sm">
              הצג תגובות שלי פומבית
            </Label>
            <Switch
              id="show-comments"
              checked={privacyPrefs.show_comments}
              onCheckedChange={(checked) => handleToggle('show_comments', checked)}
            />
          </div>
        </div>
      </div>

      {/* Data & Analytics */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          נתונים וניתוח
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-analytics" className="text-sm">
              אפשר ניתוח שימוש
            </Label>
            <Switch
              id="allow-analytics"
              checked={privacyPrefs.allow_analytics}
              onCheckedChange={(checked) => handleToggle('allow_analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow-recommendations" className="text-sm">
              אפשר המלצות מותאמות אישית
            </Label>
            <Switch
              id="allow-recommendations"
              checked={privacyPrefs.allow_recommendations}
              onCheckedChange={(checked) => handleToggle('allow_recommendations', checked)}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          אנחנו אוספים נתונים אנונימיים על שימוש כדי לשפר את החוויה שלך.
          ניתן לבטל זאת בכל עת.
        </p>
      </div>

      {/* Data Export (GDPR) */}
      <div className="space-y-3 pt-2 border-t">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          ייצוא נתונים (GDPR)
        </h4>

        <p className="text-sm text-muted-foreground">
          הורד עותק של כל הנתונים שלך בפורמט JSON
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDataExport}
          disabled={isExporting}
        >
          <IconDownload className="w-4 h-4 ml-2" />
          {isExporting ? 'מייצא...' : 'הורד את הנתונים שלי'}
        </Button>
      </div>
    </Card>
  );
}

