import { Card } from '../../components/ui/card';

/**
 * Tasks Page (Protected)
 * Epic 6 will implement the kanban board task manager
 */
export function TasksPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Track your learning goals and action items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Card key={status} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">{status}</h3>
              <p className="text-gray-500">Kanban board will be implemented in Epic 6 (Stories 6.4-6.7)</p>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Task Cards
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

