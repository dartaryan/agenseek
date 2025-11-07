/**
 * Guide Catalog Loader - Story 4.1
 *
 * Utilities for loading and working with the guide catalog
 */

import type { GuideCatalog, GuideCatalogEntry } from '@/types/guide-catalog';
import guideCatalogData from '@/content/locale/he/guides/index.json';

/**
 * Load the guide catalog from JSON
 *
 * In production, this would be the full catalog.
 * For development, we can use this as the source of truth.
 */
export function getGuideCatalog(): GuideCatalog {
  return guideCatalogData as GuideCatalog;
}

/**
 * Get a specific guide by its slug ID
 *
 * @param id - Guide slug identifier
 * @returns Guide catalog entry or undefined if not found
 */
export function getGuideById(id: string): GuideCatalogEntry | undefined {
  const catalog = getGuideCatalog();
  return catalog.find((guide) => guide.id === id);
}

/**
 * Get guide count by category
 *
 * @returns Object with category counts
 */
export function getCategoryCounts() {
  const catalog = getGuideCatalog();
  const counts = {
    core: 0,
    roles: 0,
    agents: 0,
    workflows: 0,
    practical: 0,
    faq: 0,
    onboarding: 0,
  };

  catalog.forEach((guide) => {
    counts[guide.category]++;
  });

  return counts;
}

/**
 * Get total guide count
 */
export function getTotalGuideCount(): number {
  return getGuideCatalog().length;
}

/**
 * Validate guide catalog structure
 *
 * Useful for development/testing to ensure all guides have required fields
 */
export function validateGuideCatalog(): { valid: boolean; errors: string[] } {
  const catalog = getGuideCatalog();
  const errors: string[] = [];

  if (!Array.isArray(catalog)) {
    return { valid: false, errors: ['Catalog is not an array'] };
  }

  catalog.forEach((guide, index) => {
    if (!guide.id) {
      errors.push(`Guide at index ${index} missing id`);
    }
    if (!guide.title) {
      errors.push(`Guide ${guide.id || index} missing title`);
    }
    if (!guide.description) {
      errors.push(`Guide ${guide.id || index} missing description`);
    }
    if (!guide.category) {
      errors.push(`Guide ${guide.id || index} missing category`);
    }
    if (!guide.difficulty) {
      errors.push(`Guide ${guide.id || index} missing difficulty`);
    }
    if (typeof guide.estimatedMinutes !== 'number') {
      errors.push(`Guide ${guide.id || index} missing or invalid estimatedMinutes`);
    }
    if (!guide.icon) {
      errors.push(`Guide ${guide.id || index} missing icon`);
    }
    if (!Array.isArray(guide.tags)) {
      errors.push(`Guide ${guide.id || index} missing or invalid tags array`);
    }
    if (!guide.path) {
      errors.push(`Guide ${guide.id || index} missing path`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export the catalog for direct use
export const guideCatalog = getGuideCatalog();
