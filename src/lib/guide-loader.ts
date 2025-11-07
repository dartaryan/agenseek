/**
 * Guide Content Loader - Story 4.5
 *
 * Utilities for loading full guide content (metadata + tableOfContents + content blocks)
 */

import type { Guide } from '@/types/content-blocks';
import type { GuideCatalogEntry } from '@/types/guide-catalog';
import { getGuideById, getGuideCatalog } from './guide-catalog';

// Use Vite's import.meta.glob to eagerly load all guide JSON files
// This works around Vite's limitation with fully dynamic import paths
const guideModules = import.meta.glob<{ default: Guide }>('@/content/locale/he/guides/**/*.json', {
  eager: true,
});

/**
 * Load a full guide by its slug
 *
 * @param slug - Guide slug identifier (e.g., "quick-start")
 * @returns Full guide object with metadata, ToC, and content blocks
 * @throws Error if guide not found or failed to load
 */
export async function loadGuide(slug: string): Promise<Guide> {
  // Get guide metadata from catalog
  const catalogEntry: GuideCatalogEntry | undefined = getGuideById(slug);

  if (!catalogEntry) {
    throw new Error(`Guide not found: ${slug}`);
  }

  // Build the full path to match the glob pattern
  const fullPath = `/src/content/locale/he/guides/${catalogEntry.path}`;

  // Find the matching module from our pre-loaded guides
  const guideModule = guideModules[fullPath];

  if (!guideModule) {
    console.error(`Failed to load guide: ${slug}`, `Path: ${fullPath}`, 'Available paths:', Object.keys(guideModules));
    throw new Error(`Failed to load guide content: ${slug}`);
  }

  return guideModule.default;
}

/**
 * Preload a guide (for prefetching)
 *
 * @param slug - Guide slug identifier
 */
export function preloadGuide(slug: string): void {
  loadGuide(slug).catch((error) => {
    console.warn(`Failed to preload guide: ${slug}`, error);
  });
}

/**
 * Get previous and next guide slugs for navigation
 *
 * @param currentSlug - Current guide slug
 * @param category - Optional category to filter by
 * @returns Object with prev and next guide slugs (or null if none)
 */
export function getAdjacentGuides(
  currentSlug: string,
  category?: string
): { prev: GuideCatalogEntry | null; next: GuideCatalogEntry | null } {
  const catalog = getGuideCatalog();

  // Filter by category if provided
  const filteredCatalog = category
    ? catalog.filter((guide: GuideCatalogEntry) => guide.category === category)
    : catalog;

  const currentIndex = filteredCatalog.findIndex(
    (guide: GuideCatalogEntry) => guide.id === currentSlug
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? filteredCatalog[currentIndex - 1] : null,
    next: currentIndex < filteredCatalog.length - 1 ? filteredCatalog[currentIndex + 1] : null,
  };
}
