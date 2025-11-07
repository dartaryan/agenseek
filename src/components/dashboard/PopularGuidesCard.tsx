import { Link } from 'react-router-dom';
import { IconFlame, IconEye, IconTrendingUp, IconBook } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { hebrewLocale } from '../../lib/locale/he';
import type { GuideCatalogEntry } from '../../types/guide-catalog';

/**
 * Popular Guides Card Component
 * Story 5.7 - Build Popular Guides Widget
 *
 * Shows top 5 most viewed guides in the last 7 days with:
 * - Icon, title, view count
 * - Trend indicator (flame icon if increasing)
 * - "Trending" badge for top 3
 */

interface PopularGuide extends GuideCatalogEntry {
  viewCount: number;
  isTrending: boolean;
}

interface PopularGuidesCardProps {
  popularGuides: PopularGuide[];
}

function PopularGuideItem({ guide, rank }: { guide: PopularGuide; rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            isTopThree
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          {rank}
        </div>

        {/* Guide Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-lg">
          {guide.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 text-sm">
              {guide.title}
            </h4>
            {isTopThree && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                🔥 Trending
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <IconEye className="w-3.5 h-3.5" stroke={1.5} />
              {guide.viewCount} צפיות
            </span>
            {guide.isTrending && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <IconFlame className="w-3.5 h-3.5" stroke={1.5} />
                  עולה
                </span>
              </>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        {guide.isTrending && (
          <IconTrendingUp
            className="flex-shrink-0 w-5 h-5 text-orange-500 dark:text-orange-400"
            stroke={1.5}
          />
        )}
      </div>
    </Link>
  );
}

export function PopularGuidesCard({ popularGuides }: PopularGuidesCardProps) {
  const hasGuides = popularGuides.length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <IconFlame className="w-6 h-6 text-orange-500" stroke={1.5} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {hebrewLocale.dashboard.popularGuides || 'מדריכים פופולריים'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              המדריכים הנצפים ביותר בשבוע האחרון
            </p>
          </div>
        </div>

        {/* Guide List or Empty State */}
        {hasGuides ? (
          <div className="space-y-2">
            {popularGuides.slice(0, 5).map((guide, index) => (
              <PopularGuideItem key={guide.id} guide={guide} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <IconBook className="w-8 h-8 text-gray-400" stroke={1.5} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              אין עדיין נתוני צפיות לשבוע האחרון
            </p>
          </div>
        )}

        {/* Info Note */}
        {hasGuides && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            מבוסס על צפיות ב-7 הימים האחרונים
          </p>
        )}
      </div>
    </Card>
  );
}

