/**
 * Learning Path Categorization - Story 5.2
 *
 * Utilities for categorizing guides into personalized learning path categories
 * based on user profile (role, interests, experience level).
 *
 * Categories:
 * - Core: Essential guides everyone should read
 * - Recommended: Guides matching user's role
 * - Interests: Guides matching user's selected topics
 * - Optional: All remaining guides
 */

import type { GuideCatalog } from '@/types/guide-catalog';

/**
 * Learning path category types
 */
export type LearningPathCategory = 'core' | 'recommended' | 'interests' | 'optional';

/**
 * Categorized guide collections
 */
export interface CategorizedGuides {
  core: GuideCatalog;
  recommended: GuideCatalog;
  interests: GuideCatalog;
  optional: GuideCatalog;
}

/**
 * User profile subset needed for learning path categorization
 */
export interface UserLearningProfile {
  role?: string | null;
  interests?: string[] | null;
  experience_level?: 'beginner' | 'intermediate' | 'advanced' | null;
}

/**
 * Core guide IDs that everyone should read
 * These are defined based on guide category 'core'
 */
const CORE_GUIDE_CATEGORIES = ['core', 'onboarding'];

/**
 * Role-to-tag mapping for recommended guides
 * Maps user roles to guide tags that are relevant for that role
 */
const ROLE_TAG_MAPPING: Record<string, string[]> = {
  developer: ['development', 'coding', 'implementation', 'technical', 'architecture'],
  product_manager: ['product', 'requirements', 'planning', 'strategy', 'business'],
  designer: ['design', 'ux', 'ui', 'user-experience', 'visual'],
  architect: ['architecture', 'design-patterns', 'system-design', 'technical', 'scalability'],
  project_manager: ['project-management', 'agile', 'scrum', 'planning', 'coordination'],
  qa_engineer: ['testing', 'quality', 'qa', 'automation', 'test-strategy'],
  executive: ['strategy', 'business', 'leadership', 'vision', 'high-level'],
  game_developer: ['game-development', 'game-design', 'gameplay', 'technical', 'coding'],
  non_technical: ['overview', 'introduction', 'basics', 'concepts', 'non-technical'],
};

/**
 * Categorize guides into personalized learning path categories
 *
 * @param catalog - Full guide catalog
 * @param profile - User learning profile (role, interests)
 * @returns Categorized guide collections
 */
export function categorizeGuidesByLearningPath(
  catalog: GuideCatalog,
  profile: UserLearningProfile
): CategorizedGuides {
  // Initialize categories
  const categorized: CategorizedGuides = {
    core: [],
    recommended: [],
    interests: [],
    optional: [],
  };

  // Track which guides have been categorized to avoid duplicates
  const categorizedGuideIds = new Set<string>();

  // Step 1: Categorize Core guides (everyone should read these)
  catalog.forEach((guide) => {
    if (CORE_GUIDE_CATEGORIES.includes(guide.category)) {
      categorized.core.push(guide);
      categorizedGuideIds.add(guide.id);
    }
  });

  // Step 2: Categorize Recommended guides (based on role)
  if (profile.role) {
    const roleKey = profile.role.toLowerCase().replace(/\s+/g, '_');
    const relevantTags = ROLE_TAG_MAPPING[roleKey] || [];

    catalog.forEach((guide) => {
      // Skip if already categorized
      if (categorizedGuideIds.has(guide.id)) return;

      // Check if guide tags match role-relevant tags
      const hasRelevantTag = guide.tags.some((tag) =>
        relevantTags.some((roleTag) =>
          tag.toLowerCase().includes(roleTag.toLowerCase()) ||
          roleTag.toLowerCase().includes(tag.toLowerCase())
        )
      );

      // Also check if guide category matches role (e.g., 'roles' category with role in tags)
      const isRoleSpecific =
        guide.category === 'roles' &&
        guide.tags.some((tag) => tag.toLowerCase().includes(roleKey.toLowerCase()));

      if (hasRelevantTag || isRoleSpecific) {
        categorized.recommended.push(guide);
        categorizedGuideIds.add(guide.id);
      }
    });
  }

  // Step 3: Categorize Interest guides (based on selected interests)
  if (profile.interests && profile.interests.length > 0) {
    catalog.forEach((guide) => {
      // Skip if already categorized
      if (categorizedGuideIds.has(guide.id)) return;

      // Check if guide tags match any user interests
      const matchesInterest = guide.tags.some((tag) =>
        profile.interests!.some(
          (interest) =>
            tag.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(tag.toLowerCase())
        )
      );

      if (matchesInterest) {
        categorized.interests.push(guide);
        categorizedGuideIds.add(guide.id);
      }
    });
  }

  // Step 4: Everything else goes to Optional
  catalog.forEach((guide) => {
    if (!categorizedGuideIds.has(guide.id)) {
      categorized.optional.push(guide);
    }
  });

  return categorized;
}

/**
 * Get progress statistics for a category
 *
 * @param guides - Guides in the category
 * @param completedGuideIds - Set of completed guide IDs
 * @returns Progress stats (completed count, total count, percentage)
 */
export function getCategoryProgress(
  guides: GuideCatalog,
  completedGuideIds: Set<string>
): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = guides.length;
  const completed = guides.filter((guide) => completedGuideIds.has(guide.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

/**
 * Check if a category is 100% complete
 *
 * @param guides - Guides in the category
 * @param completedGuideIds - Set of completed guide IDs
 * @returns True if all guides in category are completed
 */
export function isCategoryComplete(guides: GuideCatalog, completedGuideIds: Set<string>): boolean {
  if (guides.length === 0) return false;
  return guides.every((guide) => completedGuideIds.has(guide.id));
}

/**
 * Get all category progress stats at once
 *
 * @param categorizedGuides - All categorized guides
 * @param completedGuideIds - Set of completed guide IDs
 * @returns Progress stats for all categories
 */
export function getAllCategoryProgress(
  categorizedGuides: CategorizedGuides,
  completedGuideIds: Set<string>
) {
  return {
    core: getCategoryProgress(categorizedGuides.core, completedGuideIds),
    recommended: getCategoryProgress(categorizedGuides.recommended, completedGuideIds),
    interests: getCategoryProgress(categorizedGuides.interests, completedGuideIds),
    optional: getCategoryProgress(categorizedGuides.optional, completedGuideIds),
  };
}

