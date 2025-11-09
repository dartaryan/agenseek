import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { IconLanguage, IconRefresh } from '@tabler/icons-react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useToast } from '../../hooks/use-toast';

/**
 * LanguageSettings Component
 * Story 0.9: Language/locale preferences settings
 */
export function LanguageSettings() {
  const { languagePrefs, updateLanguagePrefs, resetToDefaults } = usePreferences();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleLanguageChange = async (ui_language: 'he' | 'en') => {
    try {
      await updateLanguagePrefs({ ui_language });
      toast({
        title: 'שפה עודכנה',
        description: 'העדפת השפה שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן שפה',
      });
    }
  };

  const handleDateFormatChange = async (date_format: 'he' | 'international') => {
    try {
      await updateLanguagePrefs({ date_format });
      toast({
        title: 'פורמט תאריך עודכן',
        description: 'העדפת פורמט התאריך שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן פורמט תאריך',
      });
    }
  };

  const handleNumberFormatChange = async (number_format: 'he' | 'european') => {
    try {
      await updateLanguagePrefs({ number_format });
      toast({
        title: 'פורמט מספרים עודכן',
        description: 'העדפת פורמט המספרים שלך נשמרה',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'לא ניתן לעדכן פורמט מספרים',
      });
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults('language');
      toast({
        title: 'איפוס הושלם',
        description: 'הגדרות השפה אופסו לברירת המחדל',
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

  // Format current date for preview
  const formatDatePreview = () => {
    const now = new Date();
    if (languagePrefs.date_format === 'he') {
      return now.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } else {
      return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconLanguage className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-foreground">שפה</h3>
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

      {/* UI Language */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          שפת ממשק
        </h4>

        <RadioGroup
          value={languagePrefs.ui_language}
          onValueChange={(value) => handleLanguageChange(value as 'he' | 'en')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="he" id="lang-he" />
            <Label htmlFor="lang-he" className="text-sm">
              עברית (Hebrew)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="en" id="lang-en" disabled />
            <Label htmlFor="lang-en" className="text-sm text-muted-foreground">
              English (בקרוב)
            </Label>
          </div>
        </RadioGroup>

        <p className="text-xs text-muted-foreground">
          תמיכה מלאה ב-RTL לעברית
        </p>
      </div>

      {/* Date & Time Format */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          פורמט תאריך ושעה
        </h4>

        <RadioGroup
          value={languagePrefs.date_format}
          onValueChange={(value) => handleDateFormatChange(value as 'he' | 'international')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="he" id="date-he" />
            <Label htmlFor="date-he" className="text-sm">
              פורמט עברי (DD/MM/YYYY)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="international" id="date-international" />
            <Label htmlFor="date-international" className="text-sm">
              פורמט בינלאומי (YYYY-MM-DD)
            </Label>
          </div>
        </RadioGroup>

        {/* Date Preview */}
        <div className="p-3 bg-muted rounded-md">
          <p className="text-muted-foreground text-sm">
            דוגמה: {formatDatePreview()}
          </p>
        </div>
      </div>

      {/* Number Format */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          פורמט מספרים
        </h4>

        <RadioGroup
          value={languagePrefs.number_format}
          onValueChange={(value) => handleNumberFormatChange(value as 'he' | 'european')}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="he" id="num-he" />
            <Label htmlFor="num-he" className="text-sm">
              עברי (1,234.56)
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="european" id="num-european" />
            <Label htmlFor="num-european" className="text-sm">
              אירופאי (1.234,56)
            </Label>
          </div>
        </RadioGroup>

        {/* Number Preview */}
        <div className="p-3 bg-muted rounded-md">
          <p className="text-muted-foreground text-sm">
            דוגמה: {languagePrefs.number_format === 'he' ? '1,234.56' : '1.234,56'}
          </p>
        </div>
      </div>

      {/* Content Language Preference (Future) */}
      <div className="space-y-3 pt-2 border-t">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          העדפת שפת תוכן (בעתיד)
        </h4>

        <div className="space-y-2 opacity-50">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="content-he" checked disabled />
            <Label htmlFor="content-he" className="text-sm">
              תוכן עברי
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="content-en" disabled />
            <Label htmlFor="content-en" className="text-sm">
              תוכן אנגלי
            </Label>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          תמיכה במספר שפות תגיע בקרוב
        </p>
      </div>
    </Card>
  );
}

