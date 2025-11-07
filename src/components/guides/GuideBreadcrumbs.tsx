/**
 * Guide Breadcrumbs Component - Story 4.5 + 4.8
 *
 * Breadcrumb navigation: Home > Category > Guide Title
 * Story 4.8: Responsive mobile collapse
 */

import { Link } from 'react-router-dom';
import { IconChevronLeft, IconHome } from '@tabler/icons-react';
import type { GuideCategory } from '@/types/guide-catalog';
import { CATEGORY_CONFIG } from '@/types/guide-catalog';

interface GuideBreadcrumbsProps {
  category: GuideCategory;
  guideTitle: string;
  className?: string;
}

export function GuideBreadcrumbs({ category, guideTitle, className = '' }: GuideBreadcrumbsProps) {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <nav
      className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}
      aria-label="ניווט דף"
    >
      {/* Desktop: Full breadcrumbs */}
      <div className="hidden sm:flex items-center gap-2">
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
      </div>

      {/* Mobile: Collapsed breadcrumbs (home icon + category only) */}
      <div className="flex sm:hidden items-center gap-2">
        {/* Home icon */}
        <Link
          to="/dashboard"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          aria-label="בית"
        >
          <IconHome className="w-4 h-4" />
        </Link>

        <IconChevronLeft className="w-4 h-4 flex-shrink-0" />

        {/* Category */}
        <Link
          to={`/guides?category=${category}`}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs"
        >
          {categoryConfig.label}
        </Link>

        {/* Guide title shown below in mobile layout */}
      </div>
    </nav>
  );
}
