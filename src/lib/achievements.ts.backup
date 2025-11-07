/**
 * Story 5.3: Achievement Badge System
 * Defines all achievement types, badges, and unlock conditions
 */

import {
  IconTrophy,
  IconMedal,
  IconAward,
  IconFlame,
  IconCalendar,
  IconClock,
  IconNotebook,
  IconChecklist,
  IconStar
} from '@tabler/icons-react';

export type BadgeType = 'milestone' | 'streak' | 'skill' | 'special';

// Use any type for icon component to avoid JSX/React type issues in .ts file
export type BadgeIcon = any;

export interface BadgeDefinition {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  type: BadgeType;
  icon: BadgeIcon;
  color: string; // Tailwind color class for glow effect
  target: number; // Target value to earn the badge
  checkCondition: (stats: UserStats) => {
    earned: boolean;
    progress: number;
  };
}

export interface UserStats {
  // Guides
  completedGuidesCount: number;
  completedCoreGuidesCount: number;
  completedRecommendedGuidesCount: number;
  completedByCategory: Record<string, number>;
  totalGuidesByCategory: Record<string, number>;

  // Streaks
  currentStreak: number;
  longestStreak: number;

  // Quick Learner (completed under estimated time)
  quickCompletionsCount: number;

  // Notes & Tasks
  notesCount: number;
  completedTasksCount: number;
}

// Achievement Badge Definitions
export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  // Milestone Badges
  bronze_badge: {
    id: 'bronze_badge',
    name: 'Bronze Badge',
    nameHe: 'תג ארד',
    description: 'Complete all Core guides',
    descriptionHe: 'השלם את כל המדריכים הליבתיים',
    type: 'milestone',
    icon: IconMedal,
    color: 'amber',
    target: 2, // 2 core guides
    checkCondition: (stats) => ({
      earned: stats.completedCoreGuidesCount >= 2,
      progress: stats.completedCoreGuidesCount,
    }),
  },

  silver_badge: {
    id: 'silver_badge',
    name: 'Silver Badge',
    nameHe: 'תג כסף',
    description: 'Complete Core + Recommended guides',
    descriptionHe: 'השלם את המדריכים הליבתיים והמומלצים',
    type: 'milestone',
    icon: IconMedal,
    color: 'slate',
    target: 10, // Core + Recommended
    checkCondition: (stats) => ({
      earned: stats.completedGuidesCount >= 10,
      progress: stats.completedGuidesCount,
    }),
  },

  gold_badge: {
    id: 'gold_badge',
    name: 'Gold Badge',
    nameHe: 'תג זהב',
    description: 'Complete 100% of all guides',
    descriptionHe: 'השלם 100% מכל המדריכים',
    type: 'milestone',
    icon: IconTrophy,
    color: 'yellow',
    target: 42, // All 42 guides
    checkCondition: (stats) => ({
      earned: stats.completedGuidesCount >= 42,
      progress: stats.completedGuidesCount,
    }),
  },

  // Category Master Badges
  category_master_core: {
    id: 'category_master_core',
    name: 'Core Master',
    nameHe: 'מאסטר ליבה',
    description: 'Complete all guides in Core category',
    descriptionHe: 'השלם את כל המדריכים בקטגוריית הליבה',
    type: 'milestone',
    icon: IconAward,
    color: 'emerald',
    target: 2,
    checkCondition: (stats) => {
      const completed = stats.completedByCategory['core'] || 0;
      const total = stats.totalGuidesByCategory['core'] || 2;
      return {
        earned: completed >= total,
        progress: completed,
      };
    },
  },

  category_master_roles: {
    id: 'category_master_roles',
    name: 'Roles Master',
    nameHe: 'מאסטר תפקידים',
    description: 'Complete all guides in Roles category',
    descriptionHe: 'השלם את כל המדריכים בקטגוריית התפקידים',
    type: 'milestone',
    icon: IconAward,
    color: 'blue',
    target: 12,
    checkCondition: (stats) => {
      const completed = stats.completedByCategory['roles'] || 0;
      const total = stats.totalGuidesByCategory['roles'] || 12;
      return {
        earned: completed >= total,
        progress: completed,
      };
    },
  },

  // Streak Badges
  week_streak: {
    id: 'week_streak',
    name: 'Week Streak',
    nameHe: 'רצף שבועי',
    description: '7-day learning streak',
    descriptionHe: 'רצף למידה של 7 ימים',
    type: 'streak',
    icon: IconFlame,
    color: 'orange',
    target: 7,
    checkCondition: (stats) => ({
      earned: stats.currentStreak >= 7,
      progress: stats.currentStreak,
    }),
  },

  month_streak: {
    id: 'month_streak',
    name: 'Month Streak',
    nameHe: 'רצף חודשי',
    description: '30-day learning streak',
    descriptionHe: 'רצף למידה של 30 יום',
    type: 'streak',
    icon: IconCalendar,
    color: 'red',
    target: 30,
    checkCondition: (stats) => ({
      earned: stats.currentStreak >= 30,
      progress: stats.currentStreak,
    }),
  },

  // Skill Badges
  quick_learner: {
    id: 'quick_learner',
    name: 'Quick Learner',
    nameHe: 'לומד מהיר',
    description: 'Complete a guide under estimated time',
    descriptionHe: 'השלם מדריך מתחת לזמן המשוער',
    type: 'skill',
    icon: IconClock,
    color: 'purple',
    target: 1,
    checkCondition: (stats) => ({
      earned: stats.quickCompletionsCount >= 1,
      progress: stats.quickCompletionsCount,
    }),
  },

  note_taker: {
    id: 'note_taker',
    name: 'Note Taker',
    nameHe: 'רושם הערות',
    description: 'Create 10+ notes',
    descriptionHe: 'צור 10 הערות ומעלה',
    type: 'skill',
    icon: IconNotebook,
    color: 'indigo',
    target: 10,
    checkCondition: (stats) => ({
      earned: stats.notesCount >= 10,
      progress: stats.notesCount,
    }),
  },

  task_master: {
    id: 'task_master',
    name: 'Task Master',
    nameHe: 'מאסטר משימות',
    description: 'Complete 25+ tasks',
    descriptionHe: 'השלם 25 משימות ומעלה',
    type: 'skill',
    icon: IconChecklist,
    color: 'teal',
    target: 25,
    checkCondition: (stats) => ({
      earned: stats.completedTasksCount >= 25,
      progress: stats.completedTasksCount,
    }),
  },

  // Special Badge
  first_guide: {
    id: 'first_guide',
    name: 'First Steps',
    nameHe: 'צעדים ראשונים',
    description: 'Complete your first guide',
    descriptionHe: 'השלם את המדריך הראשון שלך',
    type: 'special',
    icon: IconStar,
    color: 'emerald',
    target: 1,
    checkCondition: (stats) => ({
      earned: stats.completedGuidesCount >= 1,
      progress: stats.completedGuidesCount,
    }),
  },
};

// Get all badges as array
export const ALL_BADGES = Object.values(BADGE_DEFINITIONS);

// Get badges by type
export const getBadgesByType = (type: BadgeType): BadgeDefinition[] => {
  return ALL_BADGES.filter(badge => badge.type === type);
};

// Get badge by ID
export const getBadgeById = (badgeId: string): BadgeDefinition | undefined => {
  return BADGE_DEFINITIONS[badgeId];
};

// Calculate which badges should be earned based on user stats
export const checkEarnedBadges = (stats: UserStats): string[] => {
  const earnedBadgeIds: string[] = [];

  ALL_BADGES.forEach(badge => {
    const { earned } = badge.checkCondition(stats);
    if (earned) {
      earnedBadgeIds.push(badge.id);
    }
  });

  return earnedBadgeIds;
};

// Get progress towards a specific badge
export const getBadgeProgress = (
  badgeId: string,
  stats: UserStats
): { current: number; target: number; percentage: number } => {
  const badge = getBadgeById(badgeId);
  if (!badge) {
    return { current: 0, target: 1, percentage: 0 };
  }

  const { progress } = badge.checkCondition(stats);
  const percentage = Math.min(100, Math.round((progress / badge.target) * 100));

  return {
    current: progress,
    target: badge.target,
    percentage,
  };
};

