/**
 * Guide Content Loader - Story 4.5
 *
 * Utilities for loading full guide content (metadata + tableOfContents + content blocks)
 */

import type { Guide } from '@/types/content-blocks';
import type { GuideCatalogEntry } from '@/types/guide-catalog';
import { getGuideById, getGuideCatalog } from './guide-catalog';

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

  // Load full guide content from JSON file
  try {
    // Dynamic import of guide JSON based on path
    const guideModule = await import(`@/content/locale/he/guides/${catalogEntry.path}.json`);
    return guideModule.default as Guide;
  } catch (error) {
    console.error(`Failed to load guide: ${slug}`, error);
    throw new Error(`Failed to load guide content: ${slug}`);
  }
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
