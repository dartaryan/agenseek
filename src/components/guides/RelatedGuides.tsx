/**
 * Related Guides Component - Story 4.8 + Story 5.1.3
 *
 * Shows 3-4 related guides from the same category
 * Helps users discover similar content
 * Story 5.1.3: Fixed icon rendering to use IconBook from Tabler Icons
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconClock, IconArrowLeft, IconBook } from '@tabler/icons-react';
import type { GuideCategory, GuideCatalogEntry } from '@/types/guide-catalog';
import { getGuideCatalog } from '@/lib/guide-catalog';

interface RelatedGuidesProps {
  currentGuideId: string;
  category: GuideCategory;
  className?: string;
}

export function RelatedGuides({ currentGuideId, category, className = '' }: RelatedGuidesProps) {
  // Get related guides from same category (excluding current guide)
  const relatedGuides = useMemo(() => {
    const catalog = getGuideCatalog();
    return catalog
      .filter((guide: GuideCatalogEntry) => guide.category === category && guide.id !== currentGuideId)
      .slice(0, 4); // Show max 4 related guides
  }, [currentGuideId, category]);

  if (relatedGuides.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        מדריכים קשורים
      </h3>

      <div className="space-y-3">
        {relatedGuides.map((guide: GuideCatalogEntry) => (
          <Link
            key={guide.id}
            to={`/guides/${guide.id}`}
            className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Icon - Story 5.1.3: Fixed to use IconBook */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center flex-shrink-0">
                <IconBook className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {guide.title}
                </h4>

                {/* Metadata */}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    {guide.estimatedMinutes} דקות
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {guide.difficulty === 'beginner'
                      ? 'מתחיל'
                      : guide.difficulty === 'intermediate'
                        ? 'בינוני'
                        : 'מתקדם'}
                  </span>
                </div>
              </div>

              {/* Arrow icon */}
              <IconArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>

      {/* View all in category link */}
      <Link
        to={`/guides?category=${category}`}
        className="block mt-4 text-sm text-center text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        צפה בכל המדריכים בקטגוריה
      </Link>
    </div>
  );
}

