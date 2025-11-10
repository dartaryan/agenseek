/**
 * Guide Catalog Types - Story 4.1
 *
 * Types for the guide catalog that contains metadata for all learning guides.
 * This is separate from the full guide content types (which include content blocks).
 */

/**
 * Guide categories with Hebrew descriptions
 */
export type GuideCategory =
  | 'core' // יסודות - Core guides everyone should read
  | 'roles' // תפקידים - Role-specific guides
  | 'agents' // סוכנים - Agent documentation
  | 'workflows' // וורקפלואים - Workflow guides
  | 'practical' // מעשי - Practical guides and how-tos
  | 'faq' // שאלות ותשובות - Frequently asked questions
  | 'onboarding'; // און בורדינג - Onboarding guides

/**
 * Difficulty levels
 */
export type GuideDifficulty =
  | 'beginner' // מתחילים
  | 'intermediate' // בינוני
  | 'advanced'; // מתקדם

/**
 * Guide metadata - stored in catalog (index.json)
 * This is the minimal information needed to display guide cards and lists
 */
export interface GuideCatalogEntry {
  /** Unique slug identifier */
  id: string;

  /** Guide title in Hebrew */
  title: string;

  /** Short description (2-3 sentences) in Hebrew */
  description: string;

  /** Category for grouping and filtering */
  category: GuideCategory;

  /** Difficulty level for user filtering */
  difficulty: GuideDifficulty;

  /** Estimated reading time in minutes */
  estimatedMinutes: number;

  /** Tabler icon name (without Icon prefix, e.g., "Rocket" for IconRocket) */
  icon: string;

  /** Tags for search and filtering */
  tags: string[];

  /** Relative path to the full guide JSON file */
  path: string;
}

/**
 * Guide catalog - array of all guide metadata entries
 */
export type GuideCatalog = GuideCatalogEntry[];

/**
 * Category configuration for UI display
 */
export interface CategoryConfig {
  label: string; // Hebrew label
  color: string; // Tailwind color class (e.g., 'emerald')
  description: string; // Hebrew description
  icon: string; // Tabler icon name
}

/**
 * Category configurations for UI
 */
export const CATEGORY_CONFIG: Record<GuideCategory, CategoryConfig> = {
  core: {
    label: 'יסודות',
    color: 'emerald',
    description: 'מדריכי יסוד שכולם צריכים לקרוא',
    icon: 'IconBook',
  },
  roles: {
    label: 'תפקידים',
    color: 'purple',
    description: 'מדריכים ממוקדים לפי תפקיד',
    icon: 'IconUsers',
  },
  agents: {
    label: 'סוכנים',
    color: 'blue',
    description: 'הכרת הסוכנים והשימוש בהם',
    icon: 'IconRobot',
  },
  workflows: {
    label: 'וורקפלואים',
    color: 'teal',
    description: 'תהליכי עבודה מובנים',
    icon: 'IconGitBranch',
  },
  practical: {
    label: 'מעשי',
    color: 'orange',
    description: 'מדריכים מעשיים והתאמה אישית',
    icon: 'IconTool',
  },
  faq: {
    label: 'שאלות ותשובות',
    color: 'yellow',
    description: 'שאלות נפוצות ותשובות',
    icon: 'IconQuestionMark',
  },
  onboarding: {
    label: 'און בורדינג',
    color: 'green',
    description: 'מדריכי און בורדינג ראשוניים',
    icon: 'IconCalendar',
  },
};

/**
 * Difficulty configuration for UI display
 */
export interface DifficultyConfig {
  label: string; // Hebrew label
  color: string; // Tailwind color class
  icon: string; // Tabler icon name
}

/**
 * Difficulty configurations for UI
 */
export const DIFFICULTY_CONFIG: Record<GuideDifficulty, DifficultyConfig> = {
  beginner: {
    label: 'מתחילים',
    color: 'green',
    icon: 'IconStarFilled',
  },
  intermediate: {
    label: 'בינוני',
    color: 'yellow',
    icon: 'IconStar',
  },
  advanced: {
    label: 'מתקדם',
    color: 'red',
    icon: 'IconFlame',
  },
};

/**
 * Utility function to get category config
 */
export function getCategoryConfig(category: GuideCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}

/**
 * Utility function to get difficulty config
 */
export function getDifficultyConfig(difficulty: GuideDifficulty): DifficultyConfig {
  return DIFFICULTY_CONFIG[difficulty];
}

/**
 * Utility function to filter guides by category
 */
export function filterByCategory(catalog: GuideCatalog, category: GuideCategory): GuideCatalog {
  return catalog.filter((guide) => guide.category === category);
}

/**
 * Utility function to filter guides by difficulty
 */
export function filterByDifficulty(
  catalog: GuideCatalog,
  difficulty: GuideDifficulty
): GuideCatalog {
  return catalog.filter((guide) => guide.difficulty === difficulty);
}

/**
 * Utility function to filter guides by tag
 */
export function filterByTag(catalog: GuideCatalog, tag: string): GuideCatalog {
  return catalog.filter((guide) => guide.tags.includes(tag));
}

/**
 * Utility function to search guides by title or description
 */
export function searchGuides(catalog: GuideCatalog, query: string): GuideCatalog {
  const lowerQuery = query.toLowerCase();
  return catalog.filter(
    (guide) =>
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Utility function to get all unique tags from catalog
 */
export function getAllTags(catalog: GuideCatalog): string[] {
  const tags = new Set<string>();
  catalog.forEach((guide) => {
    guide.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Utility function to get guides by category, sorted by estimated minutes
 */
export function getGuidesByCategory(catalog: GuideCatalog, category: GuideCategory): GuideCatalog {
  return filterByCategory(catalog, category).sort(
    (a, b) => a.estimatedMinutes - b.estimatedMinutes
  );
}

/**
 * Utility function to get recommended guides for beginners (core + onboarding)
 */
export function getBeginnerGuides(catalog: GuideCatalog): GuideCatalog {
  return catalog.filter(
    (guide) =>
      guide.category === 'core' ||
      guide.category === 'onboarding' ||
      guide.difficulty === 'beginner'
  );
}

/**
 * Utility function to get total estimated reading time for a set of guides
 */
export function getTotalEstimatedTime(guides: GuideCatalog): number {
  return guides.reduce((total, guide) => total + guide.estimatedMinutes, 0);
}
