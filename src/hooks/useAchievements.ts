/**
 * Story 5.3: Achievement Hooks
 * React hooks for checking and managing user achievements
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { BadgeDefinition, UserStats } from '../lib/achievements';
import {
  ALL_BADGES,
  checkEarnedBadges,
  getBadgeById
} from '../lib/achievements';

export interface UserAchievement {
  id: string;
  user_id: string;
  badge_id: string;
  badge_type: string;
  progress_current: number;
  progress_target: number;
  earned: boolean;
  earned_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AchievementWithBadge extends UserAchievement {
  badge: BadgeDefinition;
}

/**
 * Hook to fetch user statistics for achievement calculation
 */
export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch completed guides with categories
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('guide_slug, guide_category, completed, time_spent_seconds')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const completedGuides = progressData?.filter(p => p.completed) || [];
      const completedGuidesCount = completedGuides.length;

      // Count by category
      const completedByCategory: Record<string, number> = {};
      completedGuides.forEach(guide => {
        const category = guide.guide_category || 'other';
        completedByCategory[category] = (completedByCategory[category] || 0) + 1;
      });

      // Core guides (assuming 'core' category has 2 guides)
      const completedCoreGuidesCount = completedByCategory['core'] || 0;

      // Recommended (assuming first 10 guides are core + recommended)
      const completedRecommendedGuidesCount = completedGuidesCount >= 10 ? 10 : completedGuidesCount;

      // Total guides by category (hardcoded for now, should match catalog)
      const totalGuidesByCategory: Record<string, number> = {
        'core': 2,
        'roles': 12,
        'agents': 11,
        'workflows': 17,
      };

      // Fetch notes count
      const { count: notesCount, error: notesError } = await supabase
        .from('user_notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (notesError) throw notesError;

      // Fetch completed tasks count
      const { count: completedTasksCount, error: tasksError } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'done');

      if (tasksError) throw tasksError;

      // Calculate streak (simplified - check activities for consecutive days)
      const { data: activities, error: activityError } = await supabase
        .from('user_activity')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (activityError) throw activityError;

      const currentStreak = calculateStreak(activities || []);

      // Quick learner count (completed guides faster than estimated)
      // For now, simplified to 0 (needs time tracking implementation)
      const quickCompletionsCount = 0;

      setStats({
        completedGuidesCount,
        completedCoreGuidesCount,
        completedRecommendedGuidesCount,
        completedByCategory,
        totalGuidesByCategory,
        currentStreak,
        longestStreak: currentStreak, // Simplified for now
        quickCompletionsCount,
        notesCount: notesCount || 0,
        completedTasksCount: completedTasksCount || 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetchStats: fetchStats };
}

/**
 * Calculate current streak from activity dates
 */
function calculateStreak(activities: { created_at: string }[]): number {
  if (activities.length === 0) return 0;

  const dates = activities.map(a => {
    const date = new Date(a.created_at);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  });

  const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Check if user has activity today or yesterday
  if (uniqueDates[0] < todayTime - oneDayMs) {
    return 0; // Streak broken
  }

  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i - 1] - uniqueDates[i] === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Hook to fetch and manage user achievements
 */
export function useAchievements() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, refetchStats } = useUserStats();
  const [achievements, setAchievements] = useState<AchievementWithBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<BadgeDefinition | null>(null);

  // Fetch achievements from database
  const fetchAchievements = useCallback(async () => {
    if (!user || !stats) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map achievements to include badge definitions
      const achievementsWithBadges: AchievementWithBadge[] = (data || [])
        .map(achievement => {
          const badge = getBadgeById(achievement.badge_id);
          if (!badge) return null;

          const result: AchievementWithBadge = {
            id: achievement.id,
            user_id: achievement.user_id,
            badge_id: achievement.badge_id,
            badge_type: achievement.badge_type,
            progress_current: achievement.progress_current,
            progress_target: achievement.progress_target,
            earned: achievement.earned,
            earned_at: achievement.earned_at ? new Date(achievement.earned_at) : null,
            created_at: new Date(achievement.created_at),
            updated_at: new Date(achievement.updated_at),
            badge,
          };
          return result;
        })
        .filter((a): a is AchievementWithBadge => a !== null);

      setAchievements(achievementsWithBadges);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [user, stats]);

  useEffect(() => {
    if (stats) {
      fetchAchievements();
    }
  }, [fetchAchievements, stats]);

  /**
   * Check for new achievements and update database
   */
  const checkAndUpdateAchievements = useCallback(async (): Promise<BadgeDefinition | null> => {
    if (!user || !stats) return null;

    try {
      // Calculate which badges should be earned
      const earnedBadgeIds = checkEarnedBadges(stats);

      // Find newly earned badges
      const newlyEarned = earnedBadgeIds.filter(id => {
        const achievement = achievements.find(a => a.badge_id === id);
        return !achievement || !achievement.earned;
      });

      if (newlyEarned.length === 0) {
        return null; // No new badges earned
      }

      // Update/insert achievements in database
      for (const badgeId of newlyEarned) {
        const badge = getBadgeById(badgeId);
        if (!badge) continue;

        const { progress } = badge.checkCondition(stats);

        await supabase.from('user_achievements').upsert({
          user_id: user.id,
          badge_id: badgeId,
          badge_type: badge.type,
          progress_current: progress,
          progress_target: badge.target,
          earned: true,
          earned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,badge_id'
        });

        // Log activity
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'earn_achievement',
          target_slug: badgeId,
          metadata: {
            badge_name: badge.nameHe,
            badge_type: badge.type,
          },
        });
      }

      // Refetch achievements
      await fetchAchievements();
      await refetchStats();

      // Return first newly earned badge for animation
      const firstNewBadge = getBadgeById(newlyEarned[0]);
      return firstNewBadge || null;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return null;
    }
  }, [user, stats, achievements, fetchAchievements, refetchStats]);

  // Get earned and locked badges
  const earnedBadges = achievements.filter(a => a.earned);
  const lockedBadges = ALL_BADGES.filter(badge =>
    !achievements.find(a => a.badge_id === badge.id && a.earned)
  );

  return {
    achievements,
    earnedBadges,
    lockedBadges,
    stats,
    loading: loading || statsLoading,
    newlyEarnedBadge,
    setNewlyEarnedBadge,
    checkAndUpdateAchievements,
    refetchAchievements: fetchAchievements,
    refetchStats,
  };
}

