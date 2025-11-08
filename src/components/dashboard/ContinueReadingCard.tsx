import { Link } from 'react-router-dom';
import * as TablerIcons from '@tabler/icons-react';
import { IconBook, IconClock, IconArrowRight } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import type { GuideCatalogEntry } from '../../types/guide-catalog';

/**
 * Continue Reading Card Component
 * Shows last 3 in-progress guides with progress bars and last section
 * Story 5.1 - Dashboard Home Page
 * Story 5.4 - Build Continue Reading Section (Enhanced)
 */

interface InProgressGuide extends GuideCatalogEntry {
  progress_percent: number;
  last_read_at: string;
  last_position: string | null;
}

interface ContinueReadingCardProps {
  inProgressGuides: InProgressGuide[];
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const lastRead = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - lastRead.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${hebrewLocale.dashboard.minutesAgo}`;
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${hebrewLocale.dashboard.hoursAgo}`;
  } else {
    const days = Math.floor(diffInMinutes / (24 * 60));
    return `${days} ${hebrewLocale.dashboard.daysAgo}`;
  }
}

/**
 * Get the Tabler icon component by name
 * Same logic as GuideCard component
 */
function getIconComponent(
  iconName: string
): React.ComponentType<{ size?: number; className?: string; stroke?: number }> {
  // Ensure icon name has the "Icon" prefix
  const fullIconName = iconName.startsWith('Icon') ? iconName : `Icon${iconName}`;

  // Get icon from TablerIcons using type-safe indexing
  const iconsMap = TablerIcons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; className?: string; stroke?: number }>
  >;
  const IconComponent = iconsMap[fullIconName];

  // Fallback to IconBook if icon not found
  return IconComponent || TablerIcons.IconBook;
}

/**
 * Format heading ID to readable section name
 * Converts "what-is-bmad" to "What is BMAD"
 */
function formatSectionName(headingId: string | null): string {
  if (!headingId) return '';

  // Replace hyphens with spaces and capitalize each word
  return headingId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function InProgressGuideItem({ guide }: { guide: InProgressGuide }) {
  const IconComponent = getIconComponent(guide.icon);

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
          <IconComponent size={24} stroke={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {guide.title}
          </h4>
          <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <IconClock className="w-3 h-3" stroke={1.5} />
                {guide.estimatedMinutes} {hebrewLocale.dashboard.minutes}
              </span>
              <span>•</span>
              <span>{hebrewLocale.dashboard.lastReadAt}: {formatTimeAgo(guide.last_read_at)}</span>
            </div>
            {guide.last_position && (
              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                {hebrewLocale.dashboard.lastSection}: {formatSectionName(guide.last_position)}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {Math.round(guide.progress_percent)}% הושלם
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${guide.progress_percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Arrow Icon */}
        <IconArrowRight
          className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors flex-shrink-0"
          stroke={1.5}
        />
      </div>
    </Link>
  );
}

export function ContinueReadingCard({ inProgressGuides }: ContinueReadingCardProps) {
  const hasGuides = inProgressGuides.length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {hebrewLocale.dashboard.continueReading}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hebrewLocale.dashboard.continueReadingDescription}
            </p>
          </div>
        </div>

        {/* Guide List or Empty State */}
        {hasGuides ? (
          <div className="space-y-3">
            {inProgressGuides.slice(0, 3).map((guide) => (
              <InProgressGuideItem key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <IconBook className="w-8 h-8 text-gray-400" stroke={1.5} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {hebrewLocale.dashboard.noInProgressGuides}
            </p>
            <Button variant="default" asChild>
              <Link to="/guides">{hebrewLocale.dashboard.startNewGuide}</Link>
            </Button>
          </div>
        )}

        {/* View All Button */}
        {hasGuides && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/guides" className="flex items-center justify-center gap-2">
              {hebrewLocale.dashboard.browseGuides}
              <IconArrowRight className="w-4 h-4" stroke={1.5} />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

