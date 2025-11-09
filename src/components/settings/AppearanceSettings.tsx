import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { IconPalette, IconRefresh } from '@tabler/icons-react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useToast } from '../../hooks/use-toast';

/**
 * AppearanceSettings Component
 * Story 0.9: Appearance preferences settings (theme, density, font-size, sidebar)
 */
export function AppearanceSettings() {
  const { appearancePrefs, updateAppearancePrefs, resetToDefaults } = usePreferences();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    try {
      await updateAppearancePrefs({ theme });
      toast({
        title: 'ערכת נושא עודכנה',
        description: 'העדפת הערכה שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן ערכת נושא',
      });
    }
  };

  const handleDensityChange = async (density: 'comfortable' | 'compact' | 'spacious') => {
    try {
      await updateAppearancePrefs({ density });
      toast({
        title: 'צפיפות עודכנה',
        description: 'צפיפות התצוגה שונתה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן צפיפות',
      });
    }
  };

  const handleFontSizeChange = async (font_size: 'small' | 'medium' | 'large') => {
    try {
      await updateAppearancePrefs({ font_size });
      toast({
        title: 'גודל גופן עודכן',
        description: 'גודל הגופן שונה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן גודל גופן',
      });
    }
  };

  const handleSidebarBehaviorChange = async (sidebar_behavior: 'always_expanded' | 'always_collapsed' | 'auto') => {
    try {
      await updateAppearancePrefs({ sidebar_behavior });
      toast({
        title: 'התנהגות סרגל צד עודכנה',
        description: 'העדפת סרגל הצד שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן התנהגות סרגל צד',
      });
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults('appearance');
      toast({
        title: 'איפוס הושלם',
        description: 'הגדרות המראה אופסו לברירת המחדל',
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
          <IconPalette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-foreground">מראה</h3>
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

      {/* Theme Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          ערכת נושא
        </h4>

        <RadioGroup
          value={appearancePrefs.theme}
          onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="text-sm">
              מצב בהיר
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="text-sm">
              מצב כהה
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system" className="text-sm">
              ברירת מחדל של המערכת
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Display Density */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          צפיפות תצוגה
        </h4>

        <RadioGroup
          value={appearancePrefs.density}
          onValueChange={(value) => handleDensityChange(value as 'comfortable' | 'compact' | 'spacious')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="comfortable" id="density-comfortable" />
            <Label htmlFor="density-comfortable" className="text-sm">
              נוח (ברירת מחדל)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="compact" id="density-compact" />
            <Label htmlFor="density-compact" className="text-sm">
              קומפקטי
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="spacious" id="density-spacious" />
            <Label htmlFor="density-spacious" className="text-sm">
              מרווח
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          גודל גופן
        </h4>

        <RadioGroup
          value={appearancePrefs.font_size}
          onValueChange={(value) => handleFontSizeChange(value as 'small' | 'medium' | 'large')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="small" id="font-small" />
            <Label htmlFor="font-small" className="text-sm">
              קטן
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="medium" id="font-medium" />
            <Label htmlFor="font-medium" className="text-sm">
              בינוני (ברירת מחדל)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="large" id="font-large" />
            <Label htmlFor="font-large" className="text-sm">
              גדול
            </Label>
          </div>
        </RadioGroup>

        {/* Preview text */}
        <div className="p-3 bg-muted rounded-md">
          <p className="text-muted-foreground text-sm">
            דוגמה: זה טקסט לדוגמה בגודל {' '}
            {appearancePrefs.font_size === 'small' && 'קטן'}
            {appearancePrefs.font_size === 'medium' && 'בינוני'}
            {appearancePrefs.font_size === 'large' && 'גדול'}
          </p>
        </div>
      </div>

      {/* Sidebar Behavior */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          התנהגות סרגל צד
        </h4>

        <RadioGroup
          value={appearancePrefs.sidebar_behavior}
          onValueChange={(value) => handleSidebarBehaviorChange(value as 'always_expanded' | 'always_collapsed' | 'auto')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="always_expanded" id="sidebar-expanded" />
            <Label htmlFor="sidebar-expanded" className="text-sm">
              תמיד מורחב
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="always_collapsed" id="sidebar-collapsed" />
            <Label htmlFor="sidebar-collapsed" className="text-sm">
              תמיד מכווץ
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="auto" id="sidebar-auto" />
            <Label htmlFor="sidebar-auto" className="text-sm">
              אוטומטי (לפי גודל מסך)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
}

