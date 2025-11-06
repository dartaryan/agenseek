import { Card } from '../../components/ui/card';

/**
 * Settings Page (Protected)
 * Will be implemented with application settings
 */
export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your preferences</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-gray-500">Notification settings coming soon</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <p className="text-gray-500">Theme and display settings coming soon</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Privacy</h3>
            <p className="text-gray-500">Privacy controls coming soon</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Language</h3>
            <p className="text-gray-500">RTL support for Hebrew and bilingual features</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

