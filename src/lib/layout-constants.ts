/**
 * Layout Constants - Story 6.9
 *
 * Centralized spacing and layout configuration for consistent spacing
 * across the application.
 */

export const LAYOUT_SPACING = {
  /**
   * Sidebar configuration
   */
  sidebar: {
    width: 240, // px (w-60 in Tailwind)
  },

  /**
   * Content container configuration
   */
  content: {
    maxWidth: 1600, // px for dashboard and main pages
    marginDesktop: 32, // px (lg:px-8)
    marginTablet: 24, // px (md:px-6)
    marginMobile: 16, // px (px-4)
  },

  /**
   * Grid spacing configuration
   */
  grid: {
    gapDesktop: 24, // px (gap-6)
    gapTablet: 20, // px (gap-5)
    gapMobile: 16, // px (gap-4)
  },

  /**
   * Card padding configuration
   */
  card: {
    padding: 20, // px (p-5)
    paddingLarge: 24, // px (p-6)
  },

  /**
   * Section spacing configuration
   */
  section: {
    marginBottom: 24, // px (mb-6)
    marginBetweenSections: 32, // px (space-y-8)
  },

  /**
   * Guide library specific
   */
  guides: {
    filterSidebarWidth: 220, // px (w-55)
    gridColumns: {
      wide: 4, // >1440px
      desktop: 3, // 1024-1440px
      tablet: 2, // 768-1024px
      mobile: 1, // <768px
    },
  },
} as const;

/**
 * Get responsive padding classes for main content
 */
export function getContentPaddingClasses(): string {
  return 'px-4 md:px-6 lg:px-8';
}

/**
 * Get responsive max-width classes for main content
 */
export function getContentMaxWidthClasses(): string {
  return 'max-w-[1600px]';
}

/**
 * Get responsive grid gap classes
 */
export function getGridGapClasses(): string {
  return 'gap-4 md:gap-5 lg:gap-6';
}

