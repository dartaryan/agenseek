import { Card } from '../../components/ui/card';
import { useAuth } from '../../hooks/useAuth';

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
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Profile Settings</h3>
            <p className="text-gray-500">Profile customization will be implemented in Epic 2</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Learning Preferences</h3>
            <p className="text-gray-500">Preferences will be set during onboarding (Stories 2.5-2.9)</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

