import { Card } from '../../components/ui/card';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Settings Page (Protected)
 * Will be implemented with application settings
 */
export function SettingsPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.pages.settings.title}</h1>
          <p className="text-gray-600">{hebrewLocale.pages.settings.description}</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">התראות</h3>
            <p className="text-gray-500">הגדרות התראות יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">מראה</h3>
            <p className="text-gray-500">הגדרות ערכת נושא ותצוגה יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">פרטיות</h3>
            <p className="text-gray-500">בקרות פרטיות יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">שפה</h3>
            <p className="text-gray-500">תמיכה ב-RTL לעברית ויכולות דו-לשוניות</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
