/**
 * Learning Journey Data Layer - Story 0.10.1
 *
 * Core data fetching and calculation logic for the 4-phase learning journey.
 * This module handles:
 * - Phase categorization (using learning-path.ts)
 * - Progress calculation per phase
 * - Phase unlocking logic
 * - Overall journey statistics
 *
 * Story 0.10.3: Added phase completion handlers and gamification
 */

import type { Database } from '@/types/database';
import { getGuideCatalog } from '@/lib/guide-catalog';
import type { GuideCatalogEntry } from '@/types/guide-catalog';
import {
  categorizeGuidesByLearningPath,
  type UserLearningProfile,
  getCategoryProgress,
  isCategoryComplete,
} from '@/lib/learning-path';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { celebratePhaseCompletion } from '@/lib/celebrations';
import { awardPhaseAchievement } from '@/lib/achievements';

/**
 * Phase status types
 */
export type PhaseStatus = 'locked' | 'in_progress' | 'completed';

/**
 * Phase configuration with metadata
 */
export interface PhaseConfig {
  id: 'core' | 'recommended' | 'interests' | 'optional';
  title: string;
  description: string;
  icon: string; // Tabler icon name
  gradient: string; // Tailwind gradient classes
  color: string; // Base color for progress bars
}

/**
 * Phase data with progress and guides
 */
export interface PhaseData extends PhaseConfig {
  guides: Array<{
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    icon: string;
    completed: boolean;
    progress: number;
  }>;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  status: PhaseStatus;
  unlockMessage?: string;
  estimatedMinutes: number; // Total time for all guides in phase
}

/**
 * Overall journey statistics
 */
export interface JourneyStats {
  totalGuides: number;
  completedGuides: number;
  overallPercentage: number;
  estimatedMinutesRemaining: number;
  weeklyProgress: number; // Percentage gained this week
  currentPhase: 'core' | 'recommended' | 'interests' | 'optional';
}

/**
 * Complete journey data
 */
export interface JourneyData {
  phases: PhaseData[];
  stats: JourneyStats;
  profile: UserLearningProfile;
}

/**
 * Phase configurations with Hebrew content and visual design
 */
export const PHASE_CONFIGS: PhaseConfig[] = [
  {
    id: 'core',
    title: 'מדריכי ליבה',
    description: 'יסודות חיוניים להתחלת עבודה עם BMAD - כל משתמש צריך לקרוא',
    icon: 'IconBook',
    gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    color: 'emerald',
  },
  {
    id: 'recommended',
    title: 'מומלץ עבורך',
    description: 'מדריכים מותאמים למפתחים - תהליכי עבודה, agents, workflows',
    icon: 'IconStar',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    color: 'purple',
  },
  {
    id: 'interests',
    title: 'תחומי העניין שלך',
    description: 'מדריכים מותאמים לתחומי העניין שבחרת באון בורדינג',
    icon: 'IconHeart',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    color: 'blue',
  },
  {
    id: 'optional',
    title: 'חקור עוד',
    description: 'מדריכים נוספים להעמקה - חקור לפי העניין שלך',
    icon: 'IconDots',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    color: 'orange',
  },
];

/**
 * Get role-specific description for recommended phase
 */
function getRecommendedDescription(role?: string | null): string {
  const roleDescriptions: Record<string, string> = {
    developer: 'מדריכים מותאמים למפתחים - תהליכי עבודה, agents, workflows',
    product_manager: 'מדריכים למנהלי מוצר - תכנון, אסטרטגיה, ניהול',
    designer: 'מדריכים למעצבים - UX, תכנון חוויית משתמש, עיצוב ויזואלי',
    architect: 'מדריכים לארכיטקטים - תכנון מערכות, עיצוב ארכיטקטוני',
    project_manager: 'מדריכים למנהלי פרויקטים - ניהול, תכנון, Agile',
    qa_engineer: 'מדריכים לאנשי QA - בדיקות, איכות, אוטומציה',
    executive: 'מדריכים למנהלים - אסטרטגיה, חזון, מנהיגות',
    game_developer: 'מדריכים למפתחי משחקים - פיתוח משחקים, עיצוב משחק',
    non_technical: 'מדריכים בסיסיים - סקירה כללית, מושגים, הקדמה',
  };

  const roleKey = role?.toLowerCase().replace(/\s+/g, '_');
  return roleDescriptions[roleKey || ''] || 'מדריכים מומלצים בהתאם לתפקיד שלך';
}

/**
 * Determine phase status based on progress and dependencies
 */
function determinePhaseStatus(
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  phaseProgress: { completed: number; total: number; percentage: number },
  coreComplete: boolean,
  recommendedProgress: number
): PhaseStatus {
  // Core is always unlocked
  if (phaseId === 'core') {
    return phaseProgress.percentage === 100 ? 'completed' : 'in_progress';
  }

  // Recommended unlocks after core is complete
  if (phaseId === 'recommended') {
    if (!coreComplete) return 'locked';
    return phaseProgress.percentage === 100 ? 'completed' : 'in_progress';
  }

  // Interests unlocks after 50% of recommended
  if (phaseId === 'interests') {
    if (!coreComplete || recommendedProgress < 50) return 'locked';
    return phaseProgress.percentage === 100 ? 'completed' : 'in_progress';
  }

  // Optional unlocks after recommended complete and interests complete
  if (phaseId === 'optional') {
    // Simplified: unlocks after core complete and 50% recommended
    if (!coreComplete || recommendedProgress < 50) return 'locked';
    return phaseProgress.percentage === 100 ? 'completed' : 'in_progress';
  }

  return 'in_progress';
}

/**
 * Get unlock message for locked phases
 */
function getUnlockMessage(
  phaseId: 'core' | 'recommended' | 'interests' | 'optional'
): string | undefined {
  const messages: Record<string, string> = {
    recommended: '🔒 ננעל - השלם את מדריכי הליבה תחילה',
    interests: '🔒 ננעל - השלם 50% מהמומלצים תחילה',
    optional: '🔒 ננעל - השלם את המומלצים ותחומי העניין תחילה',
  };

  return messages[phaseId];
}

/**
 * Calculate weekly progress (percentage gained in last 7 days)
 */
function calculateWeeklyProgress(
  userProgress: Array<Database['public']['Tables']['user_progress']['Row']>
): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentCompletions = userProgress.filter((progress) => {
    if (!progress.completed_at) return false;
    const completedDate = new Date(progress.completed_at);
    return completedDate >= oneWeekAgo;
  });

  // Return count of guides completed this week
  // (percentage calculation would require total guide count context)
  return recentCompletions.length;
}

/**
 * Fetch user progress data from database
 */
export async function fetchUserProgress(
  userId: string
): Promise<Array<Database['public']['Tables']['user_progress']['Row']>> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data || [];
}

/**
 * Main function: Get complete journey data for user
 */
export async function getJourneyData(
  userId: string,
  profile: UserLearningProfile
): Promise<JourneyData> {
  // 1. Load guide catalog
  const catalog = getGuideCatalog();

  // 2. Categorize guides based on user profile
  const categorizedGuides = categorizeGuidesByLearningPath(catalog, profile);

  // 3. Fetch user progress
  const userProgress = await fetchUserProgress(userId);
  const completedGuideIds = new Set(
    userProgress.filter((p) => p.completed).map((p) => p.guide_slug)
  );
  const progressMap = new Map(
    userProgress.map((p) => [p.guide_slug, p.progress_percent])
  );

  // 4. Calculate progress for each phase
  const coreProgress = getCategoryProgress(categorizedGuides.core, completedGuideIds);
  const recommendedProgress = getCategoryProgress(categorizedGuides.recommended, completedGuideIds);
  const interestsProgress = getCategoryProgress(categorizedGuides.interests, completedGuideIds);
  const optionalProgress = getCategoryProgress(categorizedGuides.optional, completedGuideIds);

  const coreComplete = isCategoryComplete(categorizedGuides.core, completedGuideIds);

  // 5. Build phase data
  const phases: PhaseData[] = PHASE_CONFIGS.map((config) => {
    const guidesForPhase = categorizedGuides[config.id];
    const progress =
      config.id === 'core'
        ? coreProgress
        : config.id === 'recommended'
          ? recommendedProgress
          : config.id === 'interests'
            ? interestsProgress
            : optionalProgress;

    const status = determinePhaseStatus(
      config.id,
      progress,
      coreComplete,
      recommendedProgress.percentage
    );

    // Update description for recommended phase based on role
    const description =
      config.id === 'recommended'
        ? getRecommendedDescription(profile.role)
        : config.description;

    // Calculate total estimated time
    const estimatedMinutes = guidesForPhase.reduce(
      (sum, guide) => sum + guide.estimatedMinutes,
      0
    );

    return {
      ...config,
      description,
      guides: guidesForPhase.map((guide) => ({
        id: guide.id,
        title: guide.title,
        description: guide.description,
        estimatedMinutes: guide.estimatedMinutes,
        icon: guide.icon,
        completed: completedGuideIds.has(guide.id),
        progress: progressMap.get(guide.id) || 0,
      })),
      progress,
      status,
      unlockMessage: status === 'locked' ? getUnlockMessage(config.id) : undefined,
      estimatedMinutes,
    };
  });

  // 6. Calculate overall statistics
  const totalGuides = catalog.length;
  const completedGuides = completedGuideIds.size;
  const overallPercentage = Math.round((completedGuides / totalGuides) * 100);

  // Calculate remaining time (only for incomplete guides in unlocked phases)
  const estimatedMinutesRemaining = phases.reduce((sum, phase) => {
    if (phase.status === 'locked') return sum;
    const incompleteGuides = phase.guides.filter((g) => !g.completed);
    return sum + incompleteGuides.reduce((s, g) => s + g.estimatedMinutes, 0);
  }, 0);

  // Determine current phase (first non-completed phase)
  const currentPhase =
    phases.find((p) => p.status === 'in_progress')?.id || 'core';

  // Calculate weekly progress
  const weeklyProgress = calculateWeeklyProgress(userProgress);

  const stats: JourneyStats = {
    totalGuides,
    completedGuides,
    overallPercentage,
    estimatedMinutesRemaining,
    weeklyProgress,
    currentPhase,
  };

  return {
    phases,
    stats,
    profile,
  };
}

/**
 * Format time in hours/minutes (Hebrew)
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) {
    return `~${minutes} דקות`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `~${hours} שעות`;
  }

  return `~${hours} שעות ו-${remainingMinutes} דקות`;
}

/**
 * Get phase color classes for Tailwind
 */
export function getPhaseColorClasses(color: string) {
  return {
    bg: `bg-${color}-500`,
    text: `text-${color}-600`,
    border: `border-${color}-500`,
    hover: `hover:bg-${color}-600`,
    progress: `bg-${color}-500`,
  };
}

/**
 * Story 0.10.3: Phase Completion & Gamification
 */

/**
 * Handle phase completion with celebration and achievements
 *
 * @param userId - User ID
 * @param phaseId - Phase that was completed
 * @param allPhasesComplete - Whether all 4 phases are now complete
 */
export async function handlePhaseCompletion(
  userId: string,
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  allPhasesComplete: boolean
) {
  // 1. Celebrate with confetti
  celebratePhaseCompletion(phaseId);

  // 2. Show success toast
  const phaseNames = {
    core: 'מדריכי הליבה',
    recommended: 'המדריכים המומלצים',
    interests: 'תחומי העניין',
    optional: 'החקור עוד',
  };

  toast.success(`מזל טוב! השלמת את ${phaseNames[phaseId]}`, {
    description: 'השלב הבא נפתח - בוא נמשיך!',
    duration: 5000,
    action: {
      label: 'עבור למסלול',
      onClick: () => (window.location.href = '/journey'),
    },
  });

  // 3. Award achievement
  await awardPhaseAchievement(userId, phaseId, allPhasesComplete);

  // 4. Show next phase unlock toast (if applicable)
  if (!allPhasesComplete) {
    const nextPhaseNames: Record<string, string> = {
      core: 'מומלץ עבורך',
      recommended: 'תחומי העניין שלך',
      interests: 'חקור עוד',
    };

    if (nextPhaseNames[phaseId]) {
      setTimeout(() => {
        toast.info(`שלב חדש נפתח: ${nextPhaseNames[phaseId]}`, {
          description: 'מדריכים חדשים זמינים עבורך',
          duration: 4000,
        });
      }, 2000);
    }
  }
}

/**
 * Get next recommended guide in the journey
 *
 * @param phases - All journey phases
 * @param completedGuideIds - Set of completed guide IDs
 * @returns Next guide to complete, or null if all complete
 */
export function getNextRecommendedGuide(
  phases: PhaseData[],
  completedGuideIds: Set<string>
): GuideCatalogEntry | null {
  // Find current phase (first in_progress phase)
  const currentPhase = phases.find((p) => p.status === 'in_progress');
  if (!currentPhase) return null;

  // Find first incomplete guide in current phase
  const nextGuideInPhase = currentPhase.guides.find(
    (g) => !completedGuideIds.has(g.id)
  );

  if (nextGuideInPhase) {
    // Find full guide entry from catalog
    const catalog = getGuideCatalog();
    return catalog.find(g => g.id === nextGuideInPhase.id) || null;
  }

  // If current phase complete, find first guide in next unlocked phase
  const nextPhase = phases.find((p) => !p.status.match(/locked|completed/));
  if (!nextPhase || nextPhase.guides.length === 0) return null;

  const firstGuideInNextPhase = nextPhase.guides[0];
  // Find full guide entry from catalog
  const catalog = getGuideCatalog();
  return catalog.find(g => g.id === firstGuideInNextPhase.id) || null;
}

