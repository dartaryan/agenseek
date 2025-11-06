import { Card } from '../../components/ui/card';

/**
 * Notes Page (Protected)
 * Epic 6 will implement the rich text notes editor
 */
export function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600">Personal learning notes and insights</p>
        </div>

        <Card className="p-8">
          <p className="text-center text-gray-500">
            Rich text notes editor will be implemented in Epic 6 (Stories 6.1-6.3)
          </p>
          <div className="mt-8 h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Tiptap Rich Text Editor
          </div>
        </Card>
      </div>
    </div>
  );
}

