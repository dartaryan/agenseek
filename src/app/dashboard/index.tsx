import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';

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
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <p className="text-gray-500">Progress tracking will be implemented in Epic 5</p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Progress Charts
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <p className="text-gray-500">Badges and achievements coming in Epic 5</p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Badge Collection
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Continue Learning</h3>
            <p className="text-gray-500">Recent guides will be shown here</p>
            <Button variant="outline" className="w-full">
              Browse Guides
            </Button>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20" asChild>
              <a href="/guides">📚 Guides</a>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <a href="/notes">📝 Notes</a>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <a href="/tasks">✅ Tasks</a>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <a href="/profile">👤 Profile</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

