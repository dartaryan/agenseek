/**
 * Guide Library Demo Page - For testing GuideCard component
 *
 * This is a temporary demo page to verify Story 4.3 is working correctly.
 */

import { GuideCard } from '@/components/guides/GuideCard';
import { getGuideCatalog } from '@/lib/guide-catalog';

/**
 * Demo page showing guide cards with various states
 */
export default function GuideLibraryDemo() {
  const catalog = getGuideCatalog();

  // Get first 6 guides for demo
  const demoGuides = catalog.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-right">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ספריית המדריכים</h1>
          <p className="text-lg text-gray-600">דוגמאות לכרטיסי מדריכים במצבים שונים</p>
        </div>

        {/* Guide Cards Grid - Different States */}
        <div className="space-y-12">
          {/* Not Started */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">מדריכים שלא התחלתי</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {demoGuides.slice(0, 2).map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>

          {/* In Progress */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">מדריכים בתהליך</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {demoGuides.slice(2, 4).map((guide, index) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  isStarted={true}
                  progressPercent={index === 0 ? 35 : 67}
                />
              ))}
            </div>
          </section>

          {/* Completed */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">מדריכים שסיימתי</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {demoGuides.slice(4, 6).map((guide) => (
                <GuideCard key={guide.id} guide={guide} isStarted={true} progressPercent={100} />
              ))}
            </div>
          </section>

          {/* All Categories */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">כל הקטגוריות</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalog.slice(0, 12).map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
