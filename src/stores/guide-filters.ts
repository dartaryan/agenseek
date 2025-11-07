/**
 * Guide Filters Store - Story 4.4
 *
 * Zustand store for managing guide library filters and sorting
 */

import { create } from 'zustand';
import type { GuideCategory, GuideDifficulty } from '@/types/guide-catalog';

/**
 * Status filter options
 */
export type StatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed';

/**
 * Sort options for guide library
 */
export type SortOption =
  | 'recommended' // Personalized based on user role
  | 'alphabetical' // A-Z by title
  | 'recent' // Recently updated
  | 'popular' // Most viewed
  | 'completion'; // By completion status

/**
 * Sort option configurations
 */
export const SORT_OPTIONS: Record<SortOption, { label: string; icon: string }> = {
  recommended: { label: 'מומלצים', icon: 'IconSparkles' },
  alphabetical: { label: 'אלפביתי', icon: 'IconSortAscending' },
  recent: { label: 'עודכנו לאחרונה', icon: 'IconClock' },
  popular: { label: 'פופולריים', icon: 'IconTrendingUp' },
  completion: { label: 'לפי סטטוס השלמה', icon: 'IconCheckbox' },
};

/**
 * Status filter configurations
 */
export const STATUS_FILTERS: Record<StatusFilter, { label: string; icon: string }> = {
  all: { label: 'הכל', icon: 'IconList' },
  'not-started': { label: 'לא התחלתי', icon: 'IconCircle' },
  'in-progress': { label: 'בתהליך', icon: 'IconProgress' },
  completed: { label: 'הושלמו', icon: 'IconCircleCheck' },
};

/**
 * View mode options
 */
export type ViewMode = 'grid' | 'list';

/**
 * Guide filter state interface
 */
interface GuideFilterState {
  // Current filters
  selectedCategories: GuideCategory[];
  selectedDifficulties: GuideDifficulty[];
  statusFilter: StatusFilter;
  sortBy: SortOption;
  viewMode: ViewMode;

  // Actions
  toggleCategory: (category: GuideCategory) => void;
  toggleDifficulty: (difficulty: GuideDifficulty) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setSortBy: (sortBy: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  clearAllFilters: () => void;

  // Computed helpers
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

/**
 * Default filter state
 */
const defaultState = {
  selectedCategories: [] as GuideCategory[],
  selectedDifficulties: [] as GuideDifficulty[],
  statusFilter: 'all' as StatusFilter,
  sortBy: 'recommended' as SortOption,
  viewMode: 'grid' as ViewMode,
};

/**
 * Guide filters Zustand store
 */
export const useGuideFilters = create<GuideFilterState>((set, get) => ({
  ...defaultState,

  /**
   * Toggle a category filter
   */
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),

  /**
   * Toggle a difficulty filter
   */
  toggleDifficulty: (difficulty) =>
    set((state) => ({
      selectedDifficulties: state.selectedDifficulties.includes(difficulty)
        ? state.selectedDifficulties.filter((d) => d !== difficulty)
        : [...state.selectedDifficulties, difficulty],
    })),

  /**
   * Set status filter
   */
  setStatusFilter: (status) =>
    set(() => ({
      statusFilter: status,
    })),

  /**
   * Set sort option
   */
  setSortBy: (sortBy) =>
    set(() => ({
      sortBy,
    })),

  /**
   * Set view mode
   */
  setViewMode: (mode) =>
    set(() => ({
      viewMode: mode,
    })),

  /**
   * Clear all filters (reset to defaults)
   */
  clearAllFilters: () =>
    set(() => ({
      ...defaultState,
    })),

  /**
   * Check if any filters are active
   */
  hasActiveFilters: () => {
    const state = get();
    return (
      state.selectedCategories.length > 0 ||
      state.selectedDifficulties.length > 0 ||
      state.statusFilter !== 'all'
    );
  },

  /**
   * Get count of active filters
   */
  getActiveFilterCount: () => {
    const state = get();
    let count = 0;
    count += state.selectedCategories.length;
    count += state.selectedDifficulties.length;
    if (state.statusFilter !== 'all') count += 1;
    return count;
  },
}));
