import { Card } from '../../components/ui/card';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Guides Library Page (Protected)
 * Epic 4 will implement the full guide library
 */
export function GuidesPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.pages.guides.title}</h1>
          <p className="text-gray-600">{hebrewLocale.pages.guides.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="h-32 bg-emerald-100 rounded"></div>
              <h3 className="text-lg font-semibold">
                {hebrewLocale.nav.guides} {i}
              </h3>
              <p className="text-gray-500">{hebrewLocale.pages.guides.placeholder}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
