/**
 * Guide Breadcrumbs Component - Story 4.5 + 4.8 + 10.2
 *
 * Breadcrumb navigation: Home > Category > Guide Title
 * Story 4.8: Responsive mobile collapse
 * Story 10.2: Mobile "< Back" button with category badge
 */

import { Link } from 'react-router-dom';
import { IconChevronLeft, IconArrowRight } from '@tabler/icons-react';
import type { GuideCategory } from '@/types/guide-catalog';
import { CATEGORY_CONFIG } from '@/types/guide-catalog';
import { Badge } from '@/components/ui/badge';

interface GuideBreadcrumbsProps {
  category: GuideCategory;
  guideTitle: string;
  className?: string;
}

export function GuideBreadcrumbs({ category, guideTitle, className = '' }: GuideBreadcrumbsProps) {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <div className={className}>
      {/* Desktop: Full breadcrumbs */}
      <nav
        className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        aria-label="ניווט דף"
      >
        {/* Home */}
        <Link
          to="/dashboard"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          בית
        </Link>

        <IconChevronLeft className="w-4 h-4 flex-shrink-0" />

        {/* Category */}
        <Link
          to={`/guides?category=${category}`}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {categoryConfig.label}
        </Link>

        <IconChevronLeft className="w-4 h-4 flex-shrink-0" />

        {/* Current guide */}
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-md">
          {guideTitle}
        </span>
      </nav>

      {/* Mobile: Back button with title and category badge */}
      <div className="md:hidden space-y-3">
        {/* Back button */}
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <IconArrowRight className="w-4 h-4" />
          <span>חזרה לספרייה</span>
        </Link>

        {/* Guide title and category */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {guideTitle}
          </h1>
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
          >
            {categoryConfig.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}
