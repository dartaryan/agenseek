import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import { ProgressCategoryBreakdown } from './ProgressCategoryBreakdown';
import type { CategorizedGuides } from '../../lib/learning-path';

/**
 * Overall Progress Card Component
 * Shows circular progress indicator with guide completion stats
 * Story 5.1 - Dashboard Home Page
 * Enhanced in Story 5.2 - Added category breakdown accordion
 */

interface CategoryProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface OverallProgressCardProps {
  guidesCompleted: number;
  guidesInProgress: number;
  totalGuides: number;
  // Story 5.2 additions
  categorizedGuides?: CategorizedGuides;
  categoryProgress?: {
    core: CategoryProgress;
    recommended: CategoryProgress;
    interests: CategoryProgress;
    optional: CategoryProgress;
  };
}

export function OverallProgressCard({
  guidesCompleted,
  guidesInProgress,
  totalGuides,
  categorizedGuides,
  categoryProgress,
}: OverallProgressCardProps) {
  // Calculate progress percentage
  const progressPercent = totalGuides > 0 ? Math.round((guidesCompleted / totalGuides) * 100) : 0;

  // SVG Circle parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {hebrewLocale.dashboard.yourProgress}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hebrewLocale.dashboard.progressDescription}
            </p>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="transform -rotate-90" width={size} height={size}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {progressPercent}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {hebrewLocale.dashboard.guidesCompleted}
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Story 6.10: Fixed text overflow */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1 min-w-0">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate" title={String(guidesCompleted)}>
              {guidesCompleted}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 break-words leading-relaxed">
              {hebrewLocale.dashboard.guidesCompleted}
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 truncate" title={String(guidesInProgress)}>
              {guidesInProgress}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 break-words leading-relaxed">
              {hebrewLocale.dashboard.guidesInProgress}
            </div>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 truncate" title={String(totalGuides)}>
              {totalGuides}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 break-words leading-relaxed">
              {hebrewLocale.dashboard.totalGuides}
            </div>
          </div>
        </div>

        {/* Story 5.2: Category Breakdown Accordion */}
        {categorizedGuides && categoryProgress && (
          <ProgressCategoryBreakdown
            categorizedGuides={categorizedGuides}
            progress={categoryProgress}
          />
        )}

        {/* Action Button */}
        <Button variant="outline" className="w-full" asChild>
          <Link to="/progress" className="flex items-center justify-center gap-2">
            {hebrewLocale.dashboard.viewAllProgress}
            <IconArrowRight className="w-4 h-4" stroke={1.5} />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

