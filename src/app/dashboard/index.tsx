import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { hebrewLocale } from '../../lib/locale/he';
import { getGuideCatalog } from '../../lib/guide-catalog';
import { categorizeGuidesByLearningPath, getAllCategoryProgress } from '../../lib/learning-path';
import { getNotesStatistics, type NotesStatistics } from '../../lib/api/notes';
import { getTasksStatistics, type TasksStatistics } from '../../lib/api/tasks';
import { isEnglishName } from '../../lib/utils/detectLanguage';
import { HebrewNameSuggestionBanner } from '../../components/banners/HebrewNameSuggestionBanner';
import { OverallProgressCard } from '../../components/dashboard/OverallProgressCard';
import { ContinueReadingCard } from '../../components/dashboard/ContinueReadingCard';
import { QuickActionsCard } from '../../components/dashboard/QuickActionsCard';
import { AchievementsPreviewCard } from '../../components/dashboard/AchievementsPreviewCard';
import { ActivityFeedCard } from '../../components/dashboard/ActivityFeedCard';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { PopularGuidesCard } from '../../components/dashboard/PopularGuidesCard';
import { NotesStatisticsCard } from '../../components/dashboard/NotesStatisticsCard';
import { TasksStatisticsCard } from '../../components/dashboard/TasksStatisticsCard';
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

interface TrendData {
  value: number;
  positive: boolean;
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
    type: 'view_guide' | 'complete_guide' | 'create_note' | 'create_task' | 'earn_achievement' | 'comment_reply' | 'solution_marked';
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
  // Story 5.6 addition
  trends: {
    readingTime?: TrendData;
    guidesCompleted?: TrendData;
    notes?: TrendData;
    tasks?: TrendData;
    streak?: TrendData;
  };
  // Story 6.8 additions
  notesStatistics: NotesStatistics;
  tasksStatistics: TasksStatistics;
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
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHebrewNameBanner, setShowHebrewNameBanner] = useState(false);

  // Check if we should show Hebrew name suggestion banner
  useEffect(() => {
    if (
      profile &&
      profile.display_name &&
      !profile.hebrew_name_suggestion_dismissed &&
      isEnglishName(profile.display_name)
    ) {
      setShowHebrewNameBanner(true);
    }
  }, [profile]);

  const handleAcceptHebrewSuggestion = () => {
    setShowHebrewNameBanner(false);
    // Navigate to profile with edit mode query param
    navigate('/profile?edit=display_name');
  };

  const handleDismissHebrewSuggestion = async () => {
    if (!user?.id) return;

    setShowHebrewNameBanner(false);

    // Update profile to dismiss suggestion permanently
    await supabase
      .from('profiles')
      .update({ hebrew_name_suggestion_dismissed: true })
      .eq('id', user.id);

    // Refresh profile to update local state
    await refreshProfile();
  };

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

        // Story 5.6: Enhanced streak calculation
        // Calculate consecutive days of activity
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: allActivity } = await supabase
          .from('user_activity')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(365); // Check up to a year

        // Calculate streak by checking consecutive days
        let currentStreakDays = 0;
        if (allActivity && allActivity.length > 0) {
          const activityDates = new Set<string>();
          allActivity.forEach((a) => {
            const date = new Date(a.created_at);
            date.setHours(0, 0, 0, 0);
            activityDates.add(date.toISOString().split('T')[0]);
          });

          // Check consecutive days starting from today
          let checkDate = new Date(today);
          while (activityDates.has(checkDate.toISOString().split('T')[0])) {
            currentStreakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }

        // Fetch recent activities (last 10) - Story 5.5
        const { data: activities } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Story 8.6: Fetch notifications (last 10)
        const { data: notifications } = await supabase
          .from('notifications')
          .select(`
            *,
            actor:profiles!notifications_actor_id_fkey (
              display_name
            )
          `)
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Transform activities to display format
        const activityItems =
          activities?.map((activity) => ({
            id: activity.id,
            type: activity.activity_type as 'view_guide' | 'complete_guide' | 'create_note' | 'create_task' | 'earn_achievement' | 'comment_reply' | 'solution_marked',
            description: getActivityDescription(activity.activity_type, activity.metadata as { guide_title?: string } | null),
            link: getActivityLink(activity.activity_type, activity.target_slug),
            timestamp: activity.created_at,
          })) || [];

        // Story 8.6: Transform notifications to activity format
        const notificationItems =
          notifications?.map((notification) => ({
            id: notification.id,
            type: notification.type as 'comment_reply' | 'solution_marked',
            description:
              notification.type === 'comment_reply'
                ? `${notification.actor?.display_name || 'משתמש'} ${hebrewLocale.notifications.repliedToYourComment}`
                : `${notification.actor?.display_name || 'משתמש'} ${hebrewLocale.notifications.markedYourAnswerAsSolution}`,
            link: `/guides/${notification.guide_slug}?commentId=${notification.comment_id}`,
            timestamp: notification.created_at,
          })) || [];

        // Merge activities and notifications, sort by timestamp, and limit to 10
        const recentActivities = [...activityItems, ...notificationItems]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);

        // Story 0.1: Fetch real badge data from user_achievements
        const { data: achievements } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_id', user.id)
          .not('earned_at', 'is', null);

        const earnedBadges = achievements?.length || 0;
        const totalBadges = 10; // Total possible badges (can be updated when more achievements are added)
        const lockedBadges = totalBadges - earnedBadges;

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

        // Story 5.6: Calculate trend indicators
        // Compare this week's stats with last week's stats
        const lastWeekStart = new Date(sevenDaysAgo);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        // Get last week's data for comparison
        const { data: lastWeekProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .lt('updated_at', sevenDaysAgo.toISOString());

        const { count: lastWeekNotesCount } = await supabase
          .from('user_notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lt('created_at', sevenDaysAgo.toISOString());

        const { count: lastWeekTasksCount } = await supabase
          .from('user_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'done')
          .lt('updated_at', sevenDaysAgo.toISOString());

        // Calculate last week's stats
        const lastWeekGuidesCompleted = lastWeekProgress?.filter((p) => p.completed).length || 0;
        const lastWeekReadingTime = Math.floor(
          (lastWeekProgress?.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) || 0) / 60
        );

        // Calculate last week's streak
        const { data: lastWeekActivity } = await supabase
          .from('user_activity')
          .select('created_at')
          .eq('user_id', user.id)
          .lt('created_at', sevenDaysAgo.toISOString())
          .gte('created_at', lastWeekStart.toISOString());

        const lastWeekActivityDates = new Set<string>();
        lastWeekActivity?.forEach((a) => {
          const date = new Date(a.created_at);
          date.setHours(0, 0, 0, 0);
          lastWeekActivityDates.add(date.toISOString().split('T')[0]);
        });
        const lastWeekStreak = lastWeekActivityDates.size;

        // Calculate percentage changes (trends)
        const calculateTrend = (current: number, previous: number) => {
          if (previous === 0) {
            return current > 0 ? { value: 100, positive: true } : undefined;
          }
          const change = ((current - previous) / previous) * 100;
          return {
            value: Math.abs(Math.round(change)),
            positive: change >= 0,
          };
        };

        const trends = {
          readingTime: calculateTrend(totalReadingTimeMinutes, lastWeekReadingTime),
          guidesCompleted: calculateTrend(guidesCompleted, lastWeekGuidesCompleted),
          notes: calculateTrend(notesCount || 0, lastWeekNotesCount || 0),
          tasks: calculateTrend(tasksCompletedCount || 0, lastWeekTasksCount || 0),
          streak: calculateTrend(currentStreakDays, lastWeekStreak),
        };

        // Story 6.8: Fetch notes and tasks statistics
        const notesStatistics = await getNotesStatistics(user.id);
        const tasksStatistics = await getTasksStatistics(user.id);

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
          // Story 5.6 addition
          trends,
          // Story 6.8 additions
          notesStatistics,
          tasksStatistics,
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
      // Story 5.5 - Support all activity types
      case 'guide_started':
      case 'view_guide':
        return `קראת את "${metadata?.guide_title || 'מדריך'}"`;
      case 'guide_read':
        return `המשכת לקרוא "${metadata?.guide_title || 'מדריך'}"`;
      case 'complete_guide':
        return `השלמת את "${metadata?.guide_title || 'מדריך'}"`;
      case 'uncomplete_guide':
        return `סימנת כלא הושלם את "${metadata?.guide_title || 'מדריך'}"`;
      case 'create_note':
        return 'יצרת הערה חדשה';
      case 'create_task':
        return 'הוספת משימה חדשה';
      case 'earn_achievement':
        return `קיבלת הישג חדש!`;
      default:
        return 'פעילות חדשה';
    }
  }

  function getActivityLink(type: string, targetSlug: string | null): string | undefined {
    if (!targetSlug) return undefined;

    // Story 5.5 - Support all activity types with proper links
    switch (type) {
      case 'guide_started':
      case 'guide_read':
      case 'view_guide':
      case 'complete_guide':
      case 'uncomplete_guide':
        return `/guides/${targetSlug}`;
      case 'create_note':
        return `/notes`;
      case 'create_task':
        return `/tasks`;
      case 'earn_achievement':
        return `/progress`; // Link to progress page where achievements are shown
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
    <>
      {/* Hebrew Name Suggestion Banner - Story X.X */}
      {showHebrewNameBanner && (
        <HebrewNameSuggestionBanner
          onAccept={handleAcceptHebrewSuggestion}
          onDismiss={handleDismissHebrewSuggestion}
        />
      )}

      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-[1600px] mx-auto">
        <div className="space-y-8">
          {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {displayName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {hebrewLocale.dashboard.welcomeBack} לאג'נסיק - המשך במסע הלמידה שלך
          </p>
        </div>

        {/* Main Grid - 3 columns responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
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
              guidesCompleted={dashboardData.guidesCompleted}
              notesCreated={dashboardData.notesCreated}
              tasksCompleted={dashboardData.tasksCompleted}
              currentStreakDays={dashboardData.currentStreakDays}
              trends={dashboardData.trends}
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

        {/* Story 6.8: Notes and Tasks Statistics - 2 Column Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            הלמידה שלי
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NotesStatisticsCard statistics={dashboardData.notesStatistics} />
            <TasksStatisticsCard statistics={dashboardData.tasksStatistics} />
          </div>
        </div>

        {/* Story 5.7: Popular Guides Widget - Full Width */}
        <div className="mt-8">
          <PopularGuidesCard popularGuides={dashboardData.popularGuides} />
        </div>
      </div>
    </div>
    </>
  );
}
