import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { IconCheck, IconBook, IconStar, IconHeart, IconDots } from '@tabler/icons-react';
import { hebrewLocale } from '../../lib/locale/he';
import type { CategorizedGuides } from '../../lib/learning-path';

/**
 * Progress Category Breakdown Component
 * Story 5.2 - Build Overall Progress Tracking System
 *
 * Displays an accordion showing progress for each learning path category:
 * - Core (Essential guides)
 * - Recommended (Based on role)
 * - Interests (Based on selected topics)
 * - Optional (Everything else)
 *
 * Each category shows:
 * - Progress bar
 * - Completion count (X out of Y)
 * - Checkmark if 100% complete
 */

interface CategoryProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressCategoryBreakdownProps {
  categorizedGuides: CategorizedGuides;
  progress: {
    core: CategoryProgress;
    recommended: CategoryProgress;
    interests: CategoryProgress;
    optional: CategoryProgress;
  };
}

interface CategoryItemProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  progress: CategoryProgress;
  isComplete: boolean;
}

function CategoryItem({ value, icon, label, progress, isComplete }: CategoryItemProps) {
  return (
    <AccordionItem value={value} className="border-b border-gray-200 dark:border-gray-700">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center justify-between w-full pr-4">
          {/* Left side: Icon + Label */}
          <div className="flex items-center gap-3">
            <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
          </div>

          {/* Right side: Progress or Checkmark */}
          <div className="flex items-center gap-2">
            {isComplete ? (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <IconCheck className="w-5 h-5" stroke={2} />
                <span className="text-sm font-semibold">
                  {hebrewLocale.dashboard.categoryCompleted}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {progress.completed} {hebrewLocale.dashboard.categoryProgress} {progress.total}
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        {/* Progress Bar */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {progress.percentage}% {hebrewLocale.dashboard.categoryCompleted}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {progress.completed} / {progress.total}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ProgressCategoryBreakdown({
  categorizedGuides,
  progress,
}: ProgressCategoryBreakdownProps) {
  // Determine which categories are complete
  const isCoreComplete = progress.core.percentage === 100 && progress.core.total > 0;
  const isRecommendedComplete =
    progress.recommended.percentage === 100 && progress.recommended.total > 0;
  const isInterestsComplete =
    progress.interests.percentage === 100 && progress.interests.total > 0;
  const isOptionalComplete =
    progress.optional.percentage === 100 && progress.optional.total > 0;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
        {hebrewLocale.dashboard.categoryBreakdown}
      </h4>

      <Accordion type="multiple" className="w-full">
        {/* Core Category */}
        {categorizedGuides.core.length > 0 && (
          <CategoryItem
            value="core"
            icon={<IconBook className="w-5 h-5" stroke={1.5} />}
            label={hebrewLocale.dashboard.categoryCore}
            progress={progress.core}
            isComplete={isCoreComplete}
          />
        )}

        {/* Recommended Category */}
        {categorizedGuides.recommended.length > 0 && (
          <CategoryItem
            value="recommended"
            icon={<IconStar className="w-5 h-5" stroke={1.5} />}
            label={hebrewLocale.dashboard.categoryRecommended}
            progress={progress.recommended}
            isComplete={isRecommendedComplete}
          />
        )}

        {/* Interests Category */}
        {categorizedGuides.interests.length > 0 && (
          <CategoryItem
            value="interests"
            icon={<IconHeart className="w-5 h-5" stroke={1.5} />}
            label={hebrewLocale.dashboard.categoryInterests}
            progress={progress.interests}
            isComplete={isInterestsComplete}
          />
        )}

        {/* Optional Category */}
        {categorizedGuides.optional.length > 0 && (
          <CategoryItem
            value="optional"
            icon={<IconDots className="w-5 h-5" stroke={1.5} />}
            label={hebrewLocale.dashboard.categoryOptional}
            progress={progress.optional}
            isComplete={isOptionalComplete}
          />
        )}
      </Accordion>
    </div>
  );
}

