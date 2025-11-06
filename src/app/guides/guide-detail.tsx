import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';

/**
 * Guide Detail/Reader Page (Protected)
 * Epic 4 will implement the 3-panel guide reader
 */
export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Guide: {slug}</h1>
            <p className="text-gray-600">3-panel guide reader will be implemented in Story 4.5</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-4">
              <h3 className="font-semibold">Table of Contents</h3>
              <div className="space-y-2 text-gray-500">
                <p>• Section 1</p>
                <p>• Section 2</p>
                <p>• Section 3</p>
              </div>
            </div>

            <div className="col-span-6 space-y-4">
              <h3 className="font-semibold">Content</h3>
              <div className="prose max-w-none">
                <p className="text-gray-500">
                  Dynamic content rendering will be implemented in Epic 3. The guide reader will
                  support 14 different block types including text, headings, code, callouts, tables,
                  charts, and more.
                </p>
              </div>
            </div>

            <div className="col-span-3 space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="space-y-2 text-gray-500">
                <p>• Bookmark</p>
                <p>• Take Notes</p>
                <p>• Create Task</p>
                <p>• Mark Complete</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
