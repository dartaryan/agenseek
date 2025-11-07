/**
 * Guide Breadcrumbs Component - Story 4.5
 *
 * Breadcrumb navigation: Home > Category > Guide Title
 */

import { Link } from 'react-router-dom';
import { IconChevronLeft } from '@tabler/icons-react';
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
      {/* Home */}
      <Link
        to="/dashboard"
        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        בית
      </Link>

      <IconChevronLeft className="w-4 h-4" />

      {/* Category */}
      <Link
        to={`/guides?category=${category}`}
        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        {categoryConfig.label}
      </Link>

      <IconChevronLeft className="w-4 h-4" />

      {/* Current guide */}
      <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-md">
        {guideTitle}
      </span>
    </nav>
  );
}
