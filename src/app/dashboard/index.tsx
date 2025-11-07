import { Link } from 'react-router-dom';
import { IconBooks, IconNote, IconChecklist, IconUser } from '@tabler/icons-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Dashboard Page (Protected)
 * Epic 5 will implement the full dashboard with progress tracking
 */
export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.dashboard.title}</h1>
          <p className="text-gray-600">
            {hebrewLocale.dashboard.welcomeBack}, {user?.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{hebrewLocale.dashboard.yourProgress}</h3>
            <p className="text-gray-500">{hebrewLocale.dashboard.progressDescription}</p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              {hebrewLocale.dashboard.progressPlaceholder}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{hebrewLocale.dashboard.achievements}</h3>
            <p className="text-gray-500">{hebrewLocale.dashboard.achievementsDescription}</p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              {hebrewLocale.dashboard.badgesPlaceholder}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{hebrewLocale.dashboard.continueLearning}</h3>
            <p className="text-gray-500">{hebrewLocale.dashboard.recentGuidesDescription}</p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/guides">{hebrewLocale.actions.browseGuides}</Link>
            </Button>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{hebrewLocale.sections.quickLinks}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/guides">
                <IconBooks className="w-6 h-6" stroke={1.5} />
                {hebrewLocale.nav.guides}
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/notes">
                <IconNote className="w-6 h-6" stroke={1.5} />
                {hebrewLocale.nav.notes}
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/tasks">
                <IconChecklist className="w-6 h-6" stroke={1.5} />
                {hebrewLocale.nav.tasks}
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/profile">
                <IconUser className="w-6 h-6" stroke={1.5} />
                {hebrewLocale.nav.profile}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
