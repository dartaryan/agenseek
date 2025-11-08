import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { hebrewLocale } from '../../lib/locale/he';
import { getGuideCatalog } from '../../lib/guide-catalog';
import { categorizeGuidesByLearningPath, getAllCategoryProgress } from '../../lib/learning-path';
import { OverallProgressCard } from '../../components/dashboard/OverallProgressCard';
import { ContinueReadingCard } from '../../components/dashboard/ContinueReadingCard';
import { QuickActionsCard } from '../../components/dashboard/QuickActionsCard';
import { AchievementsPreviewCard } from '../../components/dashboard/AchievementsPreviewCard';
import { ActivityFeedCard } from '../../components/dashboard/ActivityFeedCard';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { PopularGuidesCard } from '../../components/dashboard/PopularGuidesCard';
import type { GuideCatalogEntry } from '../../types/guide-catalog';
import type { CategorizedGuides } from '../../lib/learning-path';

/**
 * Dashboard Page (Protected)
 * Story 5.1 - Build Dashboard Home Page
 * Enhanced in Story 5.2 - Added category breakdown in progress card
 * Enhanced in Story 5.7 - Added popular guides widget
 * Shows welcome message, overall progress, continue reading, quick actions, achievements, and activity
 */

interface PopularGuide extends GuideCatalogEntry {
  viewCount: number;
  isTrending: boolean;
}

interface DashboardData {
  guidesCompleted: number;
  guidesInProgress: number;
  totalGuides: number;
  inProgressGuides: Array<
    GuideCatalogEntry & {
      progress_percent: number;
      last_read_at: string;
      last_position: string | null;
    }
  >;
  totalReadingTimeMinutes: number;
  notesCreated: number;
  tasksCompleted: number;
  currentStreakDays: number;
  earnedBadges: number;
  lockedBadges: number;
  recentActivities: Array<{
    id: string;
    type: 'view_guide' | 'complete_guide' | 'create_note' | 'create_task' | 'earn_achievement';
    description: string;
    link?: string;
    timestamp: string;
  }>;
  // Story 5.2 additions
  categorizedGuides: CategorizedGuides;
  categoryProgress: {
    core: { completed: number; total: number; percentage: number };
    recommended: { completed: number; total: number; percentage: number };
    interests: { completed: number; total: number; percentage: number };
    optional: { completed: number; total: number; percentage: number };
  };
  // Story 5.7 addition
  popularGuides: PopularGuide[];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return hebrewLocale.dashboard.goodMorning;
  } else if (hour < 18) {
    return hebrewLocale.dashboard.goodAfternoon;
  } else {
    return hebrewLocale.dashboard.goodEvening;
  }
}

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setLoading(true);

        // Load guides catalog (imported at build time)
        const catalog: GuideCatalogEntry[] = getGuideCatalog();
        const totalGuides = catalog.length;

        // Fetch user progress data
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        // Calculate stats
        const completedGuides = progressData?.filter((p) => p.completed) || [];
        const inProgress = progressData?.filter(
          (p) => !p.completed && p.progress_percent > 0
        ) || [];
        const guidesCompleted = completedGuides.length;
        const guidesInProgress = inProgress.length;

        // Get in-progress guides with metadata from catalog
        const inProgressGuides = inProgress
          .sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime())
          .slice(0, 3)
          .map((progress) => {
            const guideInfo = catalog.find((g) => g.id === progress.guide_slug);
            return guideInfo
              ? {
                  ...guideInfo,
                  progress_percent: progress.progress_percent,
                  last_read_at: progress.last_read_at,
                  last_position: progress.last_position,
                }
              : null;
          })
          .filter(Boolean) as Array<
          GuideCatalogEntry & { progress_percent: number; last_read_at: string; last_position: string | null }
        >;

        // Calculate total reading time (sum of all time_spent_seconds, convert to minutes)
        const totalReadingTimeMinutes = Math.floor(
          (progressData?.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) || 0) / 60
        );

        // Fetch notes count
        const { count: notesCount } = await supabase
          .from('user_notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch completed tasks count
        const { count: tasksCompletedCount } = await supabase
          .from('user_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'done');

        // Calculate current streak (simplified - will be enhanced in Story 5.6)
        // For now, check if user has activity today and yesterday
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: recentActivity } = await supabase
          .from('user_activity')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: false });

        // Simple streak: 1 if activity today, 0 otherwise
        const hasActivityToday = recentActivity?.some((a) => {
          const activityDate = new Date(a.created_at);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() === today.getTime();
        });
        const currentStreakDays = hasActivityToday ? 1 : 0;

        // Fetch recent activities (last 5)
        const { data: activities } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Transform activities to display format
        const recentActivities =
          activities?.map((activity) => ({
            id: activity.id,
            type: activity.activity_type as 'view_guide' | 'complete_guide' | 'create_note' | 'create_task' | 'earn_achievement',
            description: getActivityDescription(activity.activity_type, activity.metadata as { guide_title?: string } | null),
            link: getActivityLink(activity.activity_type, activity.target_slug),
            timestamp: activity.created_at,
          })) || [];

        // Mock badge data (will be real in Story 5.3)
        const earnedBadges = Math.min(guidesCompleted, 2); // Simple calculation for now
        const lockedBadges = 10 - earnedBadges;

        // Story 5.2: Categorize guides by learning path
        const categorizedGuides = categorizeGuidesByLearningPath(catalog, {
          role: profile?.role,
          interests: profile?.interests,
          experience_level: profile?.experience_level,
        });

        // Story 5.2: Calculate progress for each category
        const completedGuideIds = new Set(completedGuides.map((g) => g.guide_slug));
        const categoryProgress = getAllCategoryProgress(categorizedGuides, completedGuideIds);

        // Story 5.7: Fetch popular guides (most viewed in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        // Get view counts for last 7 days
        const { data: recentViews } = await supabase
          .from('user_activity')
          .select('target_slug')
          .eq('activity_type', 'view_guide')
          .gte('created_at', sevenDaysAgo.toISOString());

        // Get view counts for previous 7 days (for trending detection)
        const { data: previousViews } = await supabase
          .from('user_activity')
          .select('target_slug')
          .eq('activity_type', 'view_guide')
          .gte('created_at', fourteenDaysAgo.toISOString())
          .lt('created_at', sevenDaysAgo.toISOString());

        // Count views per guide
        const viewCounts = new Map<string, number>();
        const previousViewCounts = new Map<string, number>();

        recentViews?.forEach((view) => {
          if (view.target_slug) {
            viewCounts.set(view.target_slug, (viewCounts.get(view.target_slug) || 0) + 1);
          }
        });

        previousViews?.forEach((view) => {
          if (view.target_slug) {
            previousViewCounts.set(view.target_slug, (previousViewCounts.get(view.target_slug) || 0) + 1);
          }
        });

        // Create popular guides list with trending indicators
        const popularGuides: PopularGuide[] = Array.from(viewCounts.entries())
          .sort((a, b) => b[1] - a[1]) // Sort by view count descending
          .slice(0, 5) // Top 5
          .map(([guideSlug, viewCount]) => {
            const guideInfo = catalog.find((g) => g.id === guideSlug);
            if (!guideInfo) return null;

            const previousCount = previousViewCounts.get(guideSlug) || 0;
            // Trending if current views > previous views (even if previous was 0)
            const isTrending = viewCount > previousCount;

            return {
              ...guideInfo,
              viewCount,
              isTrending,
            };
          })
          .filter(Boolean) as PopularGuide[];

        setDashboardData({
          guidesCompleted,
          guidesInProgress,
          totalGuides,
          inProgressGuides,
          totalReadingTimeMinutes,
          notesCreated: notesCount || 0,
          tasksCompleted: tasksCompletedCount || 0,
          currentStreakDays,
          earnedBadges,
          lockedBadges,
          recentActivities,
          // Story 5.2 additions
          categorizedGuides,
          categoryProgress,
          // Story 5.7 addition
          popularGuides,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  function getActivityDescription(type: string, metadata: { guide_title?: string } | null): string {
    switch (type) {
      case 'guide_started':
        return `התחלת לקרוא "${metadata?.guide_title || 'מדריך'}"`;
      case 'guide_read':
        return `המשכת לקרוא "${metadata?.guide_title || 'מדריך'}"`;
      case 'complete_guide':
        return `השלמת את "${metadata?.guide_title || 'מדריך'}" 🎉`;
      case 'create_note':
        return 'יצרת הערה חדשה';
      case 'create_task':
        return 'הוספת משימה חדשה';
      default:
        return 'פעילות חדשה';
    }
  }

  function getActivityLink(type: string, targetSlug: string | null): string | undefined {
    if (!targetSlug) return undefined;

    switch (type) {
      case 'guide_started':
      case 'guide_read':
      case 'complete_guide':
        return `/guides/${targetSlug}`;
      default:
        return undefined;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">טוען...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-600 dark:text-gray-400">לא ניתן לטעון את הנתונים</p>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'משתמש';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {displayName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {hebrewLocale.dashboard.welcomeBack} לאגנסיק - המשך במסע הלמידה שלך
          </p>
        </div>

        {/* Main Grid - 3 columns responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Stats */}
          <div className="space-y-6">
            <OverallProgressCard
              guidesCompleted={dashboardData.guidesCompleted}
              guidesInProgress={dashboardData.guidesInProgress}
              totalGuides={dashboardData.totalGuides}
              categorizedGuides={dashboardData.categorizedGuides}
              categoryProgress={dashboardData.categoryProgress}
            />
            <DashboardStats
              totalReadingTimeMinutes={dashboardData.totalReadingTimeMinutes}
              notesCreated={dashboardData.notesCreated}
              tasksCompleted={dashboardData.tasksCompleted}
              currentStreakDays={dashboardData.currentStreakDays}
            />
          </div>

          {/* Center Column - Continue Reading & Quick Actions */}
          <div className="space-y-6">
            <ContinueReadingCard inProgressGuides={dashboardData.inProgressGuides} />
            <QuickActionsCard />
          </div>

          {/* Right Column - Achievements & Activity */}
          <div className="space-y-6">
            {/* Story 5.3: AchievementsPreviewCard now manages its own state */}
            <AchievementsPreviewCard />
            <ActivityFeedCard activities={dashboardData.recentActivities} />
          </div>
        </div>

        {/* Story 5.7: Popular Guides Widget - Full Width */}
        <div className="mt-8">
          <PopularGuidesCard popularGuides={dashboardData.popularGuides} />
        </div>
      </div>
    </div>
  );
}
