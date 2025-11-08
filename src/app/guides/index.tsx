/**
 * Guides Library Page - Story 4.4
 *
 * Complete guide library with filtering, sorting, and grid/list views
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as TablerIcons from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuideCard } from '@/components/guides/GuideCard';
import { getGuideCatalog, getCategoryCounts, getTotalGuideCount } from '@/lib/guide-catalog';
import {
  CATEGORY_CONFIG,
  DIFFICULTY_CONFIG,
  type GuideCategory,
  type GuideDifficulty,
} from '@/types/guide-catalog';
import {
  useGuideFilters,
  SORT_OPTIONS,
  STATUS_FILTERS,
  type StatusFilter,
  type SortOption,
} from '@/stores/guide-filters';
import { categorizeGuidesByLearningPath } from '@/lib/learning-path';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

/**
 * Guide progress data (mock for now - will integrate with Supabase in Story 4.6)
 */
interface GuideProgress {
  guideId: string;
  progressPercent: number;
  isStarted: boolean;
  isCompleted: boolean;
}

/**
 * Get mock progress data
 * TODO: Replace with real Supabase query in Story 4.6
 */
function getMockProgress(): Record<string, GuideProgress> {
  return {
    'quick-start': {
      guideId: 'quick-start',
      progressPercent: 45,
      isStarted: true,
      isCompleted: false,
    },
  };
}

/**
 * Main Guides Library Page Component
 */
export function GuidesPage() {
  const catalog = getGuideCatalog();
  const categoryCounts = getCategoryCounts();
  const totalCount = getTotalGuideCount();
  const { profile } = useAuth();

  // Filter state from Zustand
  const {
    selectedCategories,
    selectedDifficulties,
    statusFilter,
    sortBy,
    viewMode,
    toggleCategory,
    toggleDifficulty,
    setStatusFilter,
    setSortBy,
    setViewMode,
    clearAllFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useGuideFilters();

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Progress data
  const [progressData] = useState<Record<string, GuideProgress>>(getMockProgress());

  /**
   * Filter and sort guides based on current state
   */
  const filteredAndSortedGuides = useMemo(() => {
    let guides = [...catalog];

    // Apply category filter (OR logic - show guides in ANY selected category)
    if (selectedCategories.length > 0) {
      guides = guides.filter((guide) => selectedCategories.includes(guide.category));
    }

    // Apply difficulty filter (OR logic)
    if (selectedDifficulties.length > 0) {
      guides = guides.filter((guide) => selectedDifficulties.includes(guide.difficulty));
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      guides = guides.filter((guide) => {
        const progress = progressData[guide.id];
        if (statusFilter === 'not-started') {
          return !progress || !progress.isStarted;
        } else if (statusFilter === 'in-progress') {
          return progress && progress.isStarted && !progress.isCompleted;
        } else if (statusFilter === 'completed') {
          return progress && progress.isCompleted;
        }
        return true;
      });
    }

    // Apply sorting
    guides.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title, 'he');

        case 'recent':
          // TODO: Implement with real update timestamps from DB in future stories
          return 0;

        case 'popular':
          // TODO: Implement with real view_count from guide_stats in future stories
          return 0;

        case 'completion': {
          // Sort by completion status: completed > in-progress > not-started
          const aProgress = progressData[a.id];
          const bProgress = progressData[b.id];
          const aStatus = aProgress?.isCompleted ? 2 : aProgress?.isStarted ? 1 : 0;
          const bStatus = bProgress?.isCompleted ? 2 : bProgress?.isStarted ? 1 : 0;
          return bStatus - aStatus;
        }

        case 'recommended':
        default: {
          // Personalized based on user preferences (role, interests, experience)
          // If user has preferences, use smart categorization
          if (profile && (profile.role || (profile.interests && profile.interests.length > 0))) {
            const categorized = categorizeGuidesByLearningPath(catalog, {
              role: profile.role,
              interests: profile.interests,
              experience_level: profile.experience_level,
            });

            // Assign priority based on personalized category
            // core = 4, recommended = 3, interests = 2, optional = 1
            const getPriority = (guideId: string): number => {
              if (categorized.core.some((g) => g.id === guideId)) return 4;
              if (categorized.recommended.some((g) => g.id === guideId)) return 3;
              if (categorized.interests.some((g) => g.id === guideId)) return 2;
              return 1; // optional
            };

            const aPriority = getPriority(a.id);
            const bPriority = getPriority(b.id);

            if (aPriority !== bPriority) {
              return bPriority - aPriority;
            }

            // Within same personalized category, sort by estimated minutes (shorter first)
            return a.estimatedMinutes - b.estimatedMinutes;
          } else {
            // Fallback: Generic priority if no preferences set
            const categoryPriority: Record<GuideCategory, number> = {
              core: 5,
              onboarding: 4,
              roles: 3,
              agents: 2,
              workflows: 2,
              practical: 2,
              faq: 1,
            };

            const aPriority = categoryPriority[a.category] || 0;
            const bPriority = categoryPriority[b.category] || 0;

            if (aPriority !== bPriority) {
              return bPriority - aPriority;
            }

            // Within same priority, sort by estimated minutes (shorter first)
            return a.estimatedMinutes - b.estimatedMinutes;
          }
        }
      }
    });

    return guides;
  }, [catalog, selectedCategories, selectedDifficulties, statusFilter, sortBy, progressData, profile]);

  /**
   * Get active filter chips for display
   */
  const activeFilterChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    // Category chips
    selectedCategories.forEach((category) => {
      chips.push({
        id: `category-${category}`,
        label: CATEGORY_CONFIG[category].label,
        onRemove: () => toggleCategory(category),
      });
    });

    // Difficulty chips
    selectedDifficulties.forEach((difficulty) => {
      chips.push({
        id: `difficulty-${difficulty}`,
        label: DIFFICULTY_CONFIG[difficulty].label,
        onRemove: () => toggleDifficulty(difficulty),
      });
    });

    // Status chip
    if (statusFilter !== 'all') {
      chips.push({
        id: 'status',
        label: STATUS_FILTERS[statusFilter].label,
        onRemove: () => setStatusFilter('all'),
      });
    }

    return chips;
  }, [
    selectedCategories,
    selectedDifficulties,
    statusFilter,
    toggleCategory,
    toggleDifficulty,
    setStatusFilter,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and count */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מדריכים</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {filteredAndSortedGuides.length} מדריכים
                {filteredAndSortedGuides.length !== totalCount && ` מתוך ${totalCount}`}
              </p>
            </div>

            {/* View toggle and sort */}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <TablerIcons.IconLayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <TablerIcons.IconList className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <TablerIcons.IconFilter className="w-4 h-4 ml-2" />
                סינון
                {getActiveFilterCount() > 0 && (
                  <span className="mr-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">סינון פעיל:</span>
              {activeFilterChips.map((chip) => (
                <motion.div
                  key={chip.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-sm rounded-full"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.onRemove}
                    className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                  >
                    <TablerIcons.IconX className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              {activeFilterChips.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  <TablerIcons.IconX className="w-4 h-4 ml-1" />
                  נקה הכל
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={cn(
              'lg:w-64 flex-shrink-0',
              'fixed lg:static inset-y-0 right-0 z-40 lg:z-0',
              'bg-white dark:bg-gray-800 lg:bg-transparent',
              'border-l lg:border-none border-gray-200 dark:border-gray-700',
              'transform lg:transform-none transition-transform duration-300',
              'p-6 lg:p-0',
              'overflow-y-auto',
              isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            )}
          >
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 left-4"
            >
              <TablerIcons.IconX className="w-5 h-5" />
            </Button>

            <div className="space-y-6 mt-12 lg:mt-0">
              {/* Category filters */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  קטגוריות
                </h3>
                <div className="space-y-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const category = key as GuideCategory;
                    const count = categoryCounts[category];
                    const isChecked = selectedCategories.includes(category);

                    return (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="flex items-center justify-between flex-1 cursor-pointer text-sm"
                        >
                          <span>{config.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({count})
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty filters */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  רמת קושי
                </h3>
                <div className="space-y-2">
                  {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
                    const difficulty = key as GuideDifficulty;
                    const isChecked = selectedDifficulties.includes(difficulty);

                    return (
                      <div key={difficulty} className="flex items-center gap-2">
                        <Checkbox
                          id={`difficulty-${difficulty}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleDifficulty(difficulty)}
                        />
                        <Label
                          htmlFor={`difficulty-${difficulty}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {config.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status filter */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">סטטוס</h3>
                <div className="space-y-2">
                  {Object.entries(STATUS_FILTERS).map(([key, config]) => {
                    const status = key as StatusFilter;
                    const isSelected = statusFilter === status;

                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          'w-full text-right px-3 py-2 rounded-md text-sm transition-colors',
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        )}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear filters button */}
              {hasActiveFilters() && (
                <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
                  <TablerIcons.IconX className="w-4 h-4 ml-2" />
                  נקה סינונים
                </Button>
              )}
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main guide grid */}
          <main className="flex-1 min-w-0">
            {/* Empty state */}
            {filteredAndSortedGuides.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <TablerIcons.IconSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  לא נמצאו מדריכים
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  נסה לשנות את הסינונים או לנקות אותם
                </p>
                {hasActiveFilters() && (
                  <Button onClick={clearAllFilters} variant="default">
                    <TablerIcons.IconX className="w-4 h-4 ml-2" />
                    נקה סינונים
                  </Button>
                )}
              </motion.div>
            ) : (
              /* Guide cards grid */
              <motion.div
                layout
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedGuides.map((guide) => {
                    const progress = progressData[guide.id];

                    return (
                      <motion.div
                        key={guide.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GuideCard
                          guide={guide}
                          progressPercent={progress?.progressPercent}
                          isStarted={progress?.isStarted}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
