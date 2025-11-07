/**
 * GuideCard Component - Story 4.3
 *
 * Visual card component for displaying guide metadata in the library.
 * Features:
 * - Category-specific gradient header with icon
 * - Title and description (2 lines truncated)
 * - Category and difficulty badges
 * - Progress indicator (when started)
 * - Action button (Start/Continue)
 * - Hover animations with emerald glow
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as TablerIcons from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type GuideCatalogEntry, CATEGORY_CONFIG, DIFFICULTY_CONFIG } from '@/types/guide-catalog';

interface GuideCardProps {
  /** Guide metadata from catalog */
  guide: GuideCatalogEntry;

  /** Optional: Current progress percentage (0-100) */
  progressPercent?: number;

  /** Optional: Whether guide is started */
  isStarted?: boolean;

  /** Optional: Additional CSS classes */
  className?: string;
}

/**
 * Get gradient classes for category header
 */
function getCategoryGradient(category: GuideCatalogEntry['category']): string {
  const gradients = {
    core: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    roles: 'bg-gradient-to-br from-purple-500 to-purple-600',
    agents: 'bg-gradient-to-br from-blue-500 to-blue-600',
    workflows: 'bg-gradient-to-br from-teal-500 to-teal-600',
    practical: 'bg-gradient-to-br from-orange-500 to-orange-600',
    faq: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    onboarding: 'bg-gradient-to-br from-green-500 to-green-600',
  };

  return gradients[category] || gradients.core;
}

/**
 * Get badge color classes for category
 */
function getCategoryBadgeColor(category: GuideCatalogEntry['category']): string {
  const colors = {
    core: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    roles: 'bg-purple-100 text-purple-800 border-purple-300',
    agents: 'bg-blue-100 text-blue-800 border-blue-300',
    workflows: 'bg-teal-100 text-teal-800 border-teal-300',
    practical: 'bg-orange-100 text-orange-800 border-orange-300',
    faq: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    onboarding: 'bg-green-100 text-green-800 border-green-300',
  };

  return colors[category] || colors.core;
}

/**
 * Get badge color classes for difficulty
 */
function getDifficultyBadgeColor(difficulty: GuideCatalogEntry['difficulty']): string {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    advanced: 'bg-red-100 text-red-800 border-red-300',
  };

  return colors[difficulty] || colors.beginner;
}

/**
 * Get the Tabler icon component by name
 */
function getIconComponent(
  iconName: string
): React.ComponentType<{ size?: number; className?: string }> {
  // Ensure icon name has the "Icon" prefix
  const fullIconName = iconName.startsWith('Icon') ? iconName : `Icon${iconName}`;

  // Get icon from TablerIcons using type-safe indexing
  const iconsMap = TablerIcons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  >;
  const IconComponent = iconsMap[fullIconName];

  // Fallback to IconBook if icon not found
  return IconComponent || TablerIcons.IconBook;
}

/**
 * GuideCard Component
 */
export function GuideCard({
  guide,
  progressPercent = 0,
  isStarted = false,
  className,
}: GuideCardProps) {
  const categoryConfig = CATEGORY_CONFIG[guide.category];
  const difficultyConfig = DIFFICULTY_CONFIG[guide.difficulty];
  const IconComponent = getIconComponent(guide.icon);

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
      }}
      transition={{ duration: 0.2 }}
      className={cn('h-full', className)}
    >
      <Link to={`/guides/${guide.id}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden hover:border-emerald-500 transition-colors">
          {/* Gradient Header with Icon */}
          <div
            className={cn(
              'h-[180px] flex items-center justify-center',
              getCategoryGradient(guide.category)
            )}
          >
            <IconComponent size={64} className="text-white" />
          </div>

          {/* Card Body */}
          <div className="flex-1 flex flex-col p-4">
            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2 text-right">
              {guide.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-right flex-1">
              {guide.description}
            </p>

            {/* Badge Row */}
            <div className="flex gap-2 mb-4 flex-wrap justify-end">
              {/* Category Badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  getCategoryBadgeColor(guide.category)
                )}
              >
                {categoryConfig.label}
              </span>

              {/* Difficulty Badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  getDifficultyBadgeColor(guide.difficulty)
                )}
              >
                {difficultyConfig.label}
              </span>
            </div>

            {/* Footer: Time + Progress */}
            <div className="flex items-center justify-between mb-3">
              {/* Estimated Time */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <TablerIcons.IconClock size={16} />
                <span>{guide.estimatedMinutes} דקות</span>
              </div>

              {/* Progress Indicator (only if started) */}
              {isStarted && progressPercent > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-emerald-600 font-medium">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              className={cn(
                'w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors',
                isStarted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              )}
              onClick={(e) => {
                e.preventDefault();
                // Navigation will be handled by the Link wrapper
              }}
            >
              {isStarted && progressPercent > 0 && progressPercent < 100
                ? `המשך קריאה • ${Math.round(progressPercent)}%`
                : isStarted && progressPercent === 100
                  ? 'קרא שוב'
                  : 'התחל לקרוא'}
            </button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
