import { Card } from '../../components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Profile Page (Protected)
 * Will be implemented with user profile features
 */
export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.pages.profile.title}</h1>
          <p className="text-gray-600">{hebrewLocale.pages.profile.description}</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">פרטי חשבון</h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>{hebrewLocale.auth.email}:</strong> {user?.email}
              </p>
              <p>
                <strong>User ID:</strong> {user?.id}
              </p>
              <p>
                <strong>נוצר:</strong>{' '}
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'לא זמין'}
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{hebrewLocale.pages.profile.settings}</h3>
            <p className="text-gray-500">{hebrewLocale.pages.profile.settingsDescription}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">העדפות למידה</h3>
            <p className="text-gray-500">העדפות יוגדרו במהלך תהליך ההכנה</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
