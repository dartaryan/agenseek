import { Card } from '../../components/ui/card';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Admin Dashboard (Protected - Admin Only)
 * Epic 9 will implement the full admin analytics dashboard
 */
export function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.pages.admin.title}</h1>
          <p className="text-gray-600">{hebrewLocale.pages.admin.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: hebrewLocale.pages.admin.totalUsers, value: '0' },
            { label: 'פעילים היום', value: '0' },
            { label: hebrewLocale.pages.admin.guidesCompleted, value: '0' },
            { label: 'תגובות', value: '0' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 space-y-2">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <h3 className="text-lg font-semibold mb-4">אנליטיקה</h3>
          <p className="text-gray-500">{hebrewLocale.pages.admin.placeholder}</p>
          <div className="mt-8 h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Recharts Analytics
          </div>
        </Card>
      </div>
    </div>
  );
}
