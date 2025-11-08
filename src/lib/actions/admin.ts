/**
 * Admin Analytics Actions
 * Story 9.1: Build Admin Dashboard Overview
 * Story 9.2: Build User Management Page
 * Story 9.3: Build Content Analytics Page
 *
 * Functions for fetching admin dashboard data:
 * - Overall statistics
 * - Activity graphs
 * - Popular guides
 * - Recent activity
 * - User management
 * - Content analytics
 */

import { supabase } from '../supabase';

// Type definitions - Story 9.1
export interface AdminStats {
  totalUsers: number;
  totalGuidesViewed: number;
  activeUsersLast30Days: number;
  avgCompletionRate: number;
}

export interface ActivityDataPoint {
  date: string;
  activeUsers: number;
  guideViews: number;
}

export interface PopularGuide {
  guideSlug: string;
  guideTitle: string;
  views: number;
  uniqueViewers: number;
  avgTimeMinutes: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  activityType: string;
  userName: string;
  targetSlug: string | null;
  metadata: any;
  createdAt: string;
}

// Type definitions - Story 9.2
export interface UserManagementRow {
  id: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  lastActiveAt: string | null;
  progressPercentage: number;
}

export interface UserDetails {
  profile: {
    id: string;
    displayName: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    lastActiveAt: string | null;
    selectedRole: string | null;
    selectedInterests: string[];
    experienceLevel: string | null;
  };
  progress: {
    totalProgress: number;
    guidesCompleted: number;
    guidesInProgress: number;
  };
  activity: {
    notesCount: number;
    tasksCount: number;
    commentsCount: number;
    lastActivityDate: string | null;
  };
}

export type SortColumn = 'displayName' | 'email' | 'createdAt' | 'progressPercentage';

// Type definitions - Story 9.3
export interface GuidePerformance {
  guideSlug: string;
  guideTitle: string;
  category: string;
  views: number;
  uniqueViewers: number;
  avgTimeMinutes: number;
  completionRate: number;
  helpfulVotes: number;
  commentsCount: number;
  engagementLevel: 'high' | 'medium' | 'low';
}

export interface ContentEngagementSummary {
  totalNotes: number;
  totalTasks: number;
  totalComments: number;
  avgSessionDurationMinutes: number;
}

export interface CategoryPerformance {
  category: string;
  guidesCount: number;
  totalViews: number;
  avgCompletionRate: number;
}

export type GuidesSortColumn = 'views' | 'uniqueViewers' | 'avgTimeMinutes' | 'completionRate' | 'helpfulVotes' | 'commentsCount';

/**
 * Fetch overall admin statistics
 */
export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total guide views (count of user_activity with activity_type = 'view_guide')
    const { count: totalGuidesViewed } = await supabase
      .from('user_activity')
      .select('*', { count: 'exact', head: true })
      .eq('activity_type', 'view_guide');

    // Active users in last 30 days (unique users with any activity)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: activeUsersData } = await supabase
      .from('user_activity')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const uniqueActiveUsers = new Set(activeUsersData?.map(a => a.user_id) || []).size;

    // Average completion rate (% of all guides completed)
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('completed');

    const totalProgress = progressData?.length || 0;
    const completedGuides = progressData?.filter(p => p.completed).length || 0;
    const avgCompletionRate = totalProgress > 0
      ? Math.round((completedGuides / totalProgress) * 100)
      : 0;

    return {
      totalUsers: totalUsers || 0,
      totalGuidesViewed: totalGuidesViewed || 0,
      activeUsersLast30Days: uniqueActiveUsers,
      avgCompletionRate,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

/**
 * Fetch activity data for graph (daily active users and guide views)
 * @param days Number of days to fetch (default 30)
 */
export async function fetchActivityData(days: number = 30): Promise<ActivityDataPoint[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all activities in date range
    const { data: activities } = await supabase
      .from('user_activity')
      .select('user_id, activity_type, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (!activities || activities.length === 0) {
      return [];
    }

    // Group by date
    const dateMap = new Map<string, { users: Set<string>; views: number }>();

    activities.forEach((activity) => {
      const date = new Date(activity.created_at).toISOString().split('T')[0];

      if (!dateMap.has(date)) {
        dateMap.set(date, { users: new Set(), views: 0 });
      }

      const dayData = dateMap.get(date)!;
      dayData.users.add(activity.user_id);

      if (activity.activity_type === 'view_guide') {
        dayData.views++;
      }
    });

    // Convert to array and sort
    const result: ActivityDataPoint[] = [];
    dateMap.forEach((data, date) => {
      result.push({
        date,
        activeUsers: data.users.size,
        guideViews: data.views,
      });
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching activity data:', error);
    throw error;
  }
}

/**
 * Fetch popular guides (top 10 by views)
 */
export async function fetchPopularGuides(): Promise<PopularGuide[]> {
  try {
    // Fetch all view_guide activities
    const { data: viewActivities } = await supabase
      .from('user_activity')
      .select('user_id, target_slug, metadata')
      .eq('activity_type', 'view_guide');

    if (!viewActivities || viewActivities.length === 0) {
      return [];
    }

    // Group by guide slug
    const guideMap = new Map<string, {
      views: number;
      uniqueViewers: Set<string>;
      totalTime: number;
    }>();

    viewActivities.forEach((activity) => {
      const slug = activity.target_slug;
      if (!slug) return;

      if (!guideMap.has(slug)) {
        guideMap.set(slug, {
          views: 0,
          uniqueViewers: new Set(),
          totalTime: 0,
        });
      }

      const guideData = guideMap.get(slug)!;
      guideData.views++;
      guideData.uniqueViewers.add(activity.user_id);

      // Add time from metadata if available
      if (activity.metadata && typeof activity.metadata === 'object' && 'time_spent' in activity.metadata) {
        const timeSpent = activity.metadata.time_spent;
        if (typeof timeSpent === 'number') {
          guideData.totalTime += timeSpent;
        }
      }
    });

    // Fetch completion data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('guide_slug, completed');

    const completionMap = new Map<string, { total: number; completed: number }>();
    progressData?.forEach((progress) => {
      if (!completionMap.has(progress.guide_slug)) {
        completionMap.set(progress.guide_slug, { total: 0, completed: 0 });
      }
      const data = completionMap.get(progress.guide_slug)!;
      data.total++;
      if (progress.completed) data.completed++;
    });

    // Convert to array and calculate completion rates
    const guides: PopularGuide[] = [];
    guideMap.forEach((data, slug) => {
      const completionData = completionMap.get(slug);
      const completionRate = completionData && completionData.total > 0
        ? Math.round((completionData.completed / completionData.total) * 100)
        : 0;

      guides.push({
        guideSlug: slug,
        guideTitle: formatGuideTitle(slug),
        views: data.views,
        uniqueViewers: data.uniqueViewers.size,
        avgTimeMinutes: data.views > 0 ? Math.round(data.totalTime / data.views / 60) : 0,
        completionRate,
      });
    });

    // Sort by views and return top 10
    return guides
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching popular guides:', error);
    throw error;
  }
}

/**
 * Fetch recent activity (last 50 activities)
 */
export async function fetchRecentActivity(): Promise<RecentActivity[]> {
  try {
    const { data: activities } = await supabase
      .from('user_activity')
      .select(`
        id,
        activity_type,
        target_slug,
        metadata,
        created_at,
        profiles!user_activity_user_id_fkey (
          display_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!activities || activities.length === 0) {
      return [];
    }

    return activities.map((activity: any) => ({
      id: activity.id,
      activityType: activity.activity_type,
      userName: activity.profiles?.display_name || 'משתמש לא ידוע',
      targetSlug: activity.target_slug,
      metadata: activity.metadata,
      createdAt: activity.created_at,
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

/**
 * Helper function to format guide slug to title
 * In a real implementation, this would fetch from the guide catalog
 */
function formatGuideTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Export data to CSV format
 * @param data Array of data objects
 * @param filename Name for the CSV file
 */
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Build CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== Story 9.2: User Management Functions ====================

/**
 * Fetch users with pagination, search, and sorting
 * @param page Page number (0-indexed)
 * @param pageSize Number of users per page (default 50)
 * @param searchTerm Optional search term for name/email
 * @param sortColumn Column to sort by
 * @param sortAscending Sort direction
 */
export async function fetchUsers(
  page: number = 0,
  pageSize: number = 50,
  searchTerm: string = '',
  sortColumn: SortColumn = 'createdAt',
  sortAscending: boolean = false
): Promise<{ users: UserManagementRow[]; totalCount: number }> {
  try {
    // Build base query
    let query = supabase
      .from('profiles')
      .select('id, display_name, email, is_admin, created_at', { count: 'exact' });

    // Apply search filter
    if (searchTerm.trim()) {
      query = query.or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    // Apply sorting (map column names to database columns)
    const columnMap: Record<SortColumn, string> = {
      displayName: 'display_name',
      email: 'email',
      createdAt: 'created_at',
      progressPercentage: 'created_at', // Will sort by progress in client
    };

    query = query.order(columnMap[sortColumn], { ascending: sortAscending });

    // Apply pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute query
    const { data: profiles, count, error } = await query;

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      return { users: [], totalCount: count || 0 };
    }

    // Fetch progress for each user
    const userIds = profiles.map(p => p.id);
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed')
      .in('user_id', userIds);

    // Calculate progress percentage for each user
    const progressMap = new Map<string, number>();
    progressData?.forEach((progress) => {
      if (!progressMap.has(progress.user_id)) {
        progressMap.set(progress.user_id, 0);
      }
    });

    // Count completed guides per user
    progressData?.forEach((progress) => {
      if (progress.completed) {
        progressMap.set(progress.user_id, (progressMap.get(progress.user_id) || 0) + 1);
      }
    });

    // Total guides (42 according to brief)
    const totalGuides = 42;

    // Map profiles to UserManagementRow
    let users: UserManagementRow[] = profiles.map((profile) => {
      const completedCount = progressMap.get(profile.id) || 0;
      const progressPercentage = Math.round((completedCount / totalGuides) * 100);

      return {
        id: profile.id,
        displayName: profile.display_name || 'משתמש ללא שם',
        email: profile.email || '',
        isAdmin: profile.is_admin || false,
        createdAt: profile.created_at,
        lastActiveAt: profile.created_at, // Use created_at as fallback until last_active_at is implemented
        progressPercentage,
      };
    });

    // If sorting by progress, sort in JavaScript
    if (sortColumn === 'progressPercentage') {
      users = users.sort((a, b) =>
        sortAscending
          ? a.progressPercentage - b.progressPercentage
          : b.progressPercentage - a.progressPercentage
      );
    }

    return { users, totalCount: count || 0 };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Fetch detailed information for a specific user
 * @param userId User ID
 */
export async function fetchUserDetails(userId: string): Promise<UserDetails | null> {
  try {
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) return null;

    // Fetch progress data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('completed')
      .eq('user_id', userId);

    const totalProgress = progressData?.length || 0;
    const guidesCompleted = progressData?.filter(p => p.completed).length || 0;
    const guidesInProgress = progressData?.filter(p => !p.completed).length || 0;

    // Fetch activity counts
    const [
      { count: notesCount },
      { count: tasksCount },
      { count: commentsCount },
    ] = await Promise.all([
      supabase.from('user_notes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_tasks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('guide_comments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    // Fetch last activity date
    const { data: lastActivity } = await supabase
      .from('user_activity')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      profile: {
        id: profile.id,
        displayName: profile.display_name || 'משתמש ללא שם',
        email: profile.email || '',
        isAdmin: profile.is_admin || false,
        createdAt: profile.created_at,
        lastActiveAt: lastActivity?.created_at || profile.created_at, // Use last activity or created_at as fallback
        selectedRole: profile.role,
        selectedInterests: profile.interests || [],
        experienceLevel: profile.experience_level,
      },
      progress: {
        totalProgress,
        guidesCompleted,
        guidesInProgress,
      },
      activity: {
        notesCount: notesCount || 0,
        tasksCount: tasksCount || 0,
        commentsCount: commentsCount || 0,
        lastActivityDate: lastActivity?.created_at || null,
      },
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

/**
 * Delete a user and all associated data
 * WARNING: This is a destructive operation
 * @param userId User ID to delete
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // Delete user profile (cascading deletes should handle related data via RLS)
    // In production, you may want to soft-delete or archive users instead
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    // Note: Supabase RLS and foreign key constraints should cascade delete:
    // - user_progress
    // - user_activity
    // - notes
    // - tasks
    // - comments
    // If not configured, you'd need to manually delete each table
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Story 9.3: Content Analytics Functions

/**
 * Fetch guide performance data
 * @param categoryFilter Optional category filter
 * @param sortColumn Column to sort by
 * @param sortAscending Sort direction
 */
export async function fetchGuidePerformance(
  categoryFilter?: string,
  sortColumn: GuidesSortColumn = 'views',
  sortAscending: boolean = false
): Promise<GuidePerformance[]> {
  try {
    // Get all guides from JSON catalog
    const guidesResponse = await fetch('/content/guides-catalog.json');
    const guidesCatalog = await guidesResponse.json();

    const guides = guidesCatalog.guides || [];

    // Filter by category if specified
    const filteredGuides = categoryFilter
      ? guides.filter((g: any) => g.category === categoryFilter)
      : guides;

    // Fetch performance data for each guide
    const performancePromises = filteredGuides.map(async (guide: any) => {
      const guideSlug = guide.slug;

      // Views count
      const { count: views } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'view_guide')
        .eq('target_slug', guideSlug);

      // Unique viewers
      const { data: uniqueViewersData } = await supabase
        .from('user_activity')
        .select('user_id')
        .eq('activity_type', 'view_guide')
        .eq('target_slug', guideSlug);

      const uniqueViewers = new Set(uniqueViewersData?.map(d => d.user_id)).size;

      // Average time spent (from metadata if stored)
      const { data: timeData } = await supabase
        .from('user_activity')
        .select('metadata')
        .eq('activity_type', 'view_guide')
        .eq('target_slug', guideSlug);

      const avgTimeMinutes = timeData?.length
        ? Math.round(
            timeData.reduce((sum, d) => sum + ((d.metadata as any)?.duration_minutes || 0), 0) / timeData.length
          )
        : 0;

      // Completion rate
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('guide_slug', guideSlug);

      const completionRate = progressData?.length
        ? Math.round((progressData.filter(p => p.completed).length / progressData.length) * 100)
        : 0;

      // Helpful votes (from comments)
      const { data: commentsData } = await supabase
        .from('guide_comments')
        .select('helpful_count')
        .eq('guide_slug', guideSlug);

      const helpfulVotes = commentsData?.reduce((sum, c) => sum + (c.helpful_count || 0), 0) || 0;

      // Comments count
      const { count: commentsCount } = await supabase
        .from('guide_comments')
        .select('*', { count: 'exact', head: true })
        .eq('guide_slug', guideSlug);

      // Engagement level (based on views and completion rate)
      let engagementLevel: 'high' | 'medium' | 'low' = 'low';
      if ((views || 0) > 50 && completionRate > 60) {
        engagementLevel = 'high';
      } else if ((views || 0) > 20 || completionRate > 40) {
        engagementLevel = 'medium';
      }

      return {
        guideSlug,
        guideTitle: guide.title,
        category: guide.category,
        views: views || 0,
        uniqueViewers,
        avgTimeMinutes,
        completionRate,
        helpfulVotes,
        commentsCount: commentsCount || 0,
        engagementLevel,
      };
    });

    let performance = await Promise.all(performancePromises);

    // Sort by selected column
    performance = performance.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      return sortAscending ? aVal - bVal : bVal - aVal;
    });

    return performance;
  } catch (error) {
    console.error('Error fetching guide performance:', error);
    return [];
  }
}

/**
 * Fetch content engagement summary
 */
export async function fetchContentEngagementSummary(): Promise<ContentEngagementSummary> {
  try {
    // Total notes
    const { count: totalNotes } = await supabase
      .from('user_notes')
      .select('*', { count: 'exact', head: true });

    // Total tasks
    const { count: totalTasks } = await supabase
      .from('user_tasks')
      .select('*', { count: 'exact', head: true });

    // Total comments
    const { count: totalComments } = await supabase
      .from('guide_comments')
      .select('*', { count: 'exact', head: true });

    // Average session duration
    const { data: sessionData } = await supabase
      .from('user_activity')
      .select('metadata')
      .eq('activity_type', 'view_guide');

    const avgSessionDurationMinutes = sessionData?.length
      ? Math.round(
          sessionData.reduce((sum, d) => sum + ((d.metadata as any)?.duration_minutes || 0), 0) / sessionData.length
        )
      : 0;

    return {
      totalNotes: totalNotes || 0,
      totalTasks: totalTasks || 0,
      totalComments: totalComments || 0,
      avgSessionDurationMinutes,
    };
  } catch (error) {
    console.error('Error fetching content engagement summary:', error);
    return {
      totalNotes: 0,
      totalTasks: 0,
      totalComments: 0,
      avgSessionDurationMinutes: 0,
    };
  }
}

/**
 * Fetch category performance data for bar chart
 */
export async function fetchCategoryPerformance(): Promise<CategoryPerformance[]> {
  try {
    // Get all guides from catalog
    const guidesResponse = await fetch('/content/guides-catalog.json');
    const guidesCatalog = await guidesResponse.json();

    const guides = guidesCatalog.guides || [];

    // Group by category
    const categoryMap = new Map<string, string[]>();
    guides.forEach((guide: any) => {
      const category = guide.category || 'אחר';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(guide.slug);
    });

    // Calculate performance for each category
    const performancePromises = Array.from(categoryMap.entries()).map(async ([category, slugs]) => {
      // Total views for this category
      const { count: totalViews } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'view_guide')
        .in('target_slug', slugs);

      // Completion rate for this category
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed')
        .in('guide_slug', slugs);

      const avgCompletionRate = progressData?.length
        ? Math.round((progressData.filter(p => p.completed).length / progressData.length) * 100)
        : 0;

      return {
        category,
        guidesCount: slugs.length,
        totalViews: totalViews || 0,
        avgCompletionRate,
      };
    });

    return await Promise.all(performancePromises);
  } catch (error) {
    console.error('Error fetching category performance:', error);
    return [];
  }
}

// Story 9.4 - User Engagement Report Types

export interface UserSegment {
  segment: 'highly_engaged' | 'moderately_engaged' | 'low_engagement' | 'at_risk';
  segmentName: string;
  description: string;
  userCount: number;
  percentage: number;
  userIds: string[];
}

export interface EngagementFunnelStep {
  step: string;
  userCount: number;
  percentage: number;
  dropOffRate: number;
}

export interface ActivityHeatmapData {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hourOfDay: number; // 0-23
  activityCount: number;
}

export interface CohortData {
  cohortMonth: string; // YYYY-MM
  userCount: number;
  retentionRate: number;
  completionRate: number;
}

/**
 * Fetch user segmentation data
 * Segments users by engagement level based on progress
 */
export async function fetchUserSegmentation(): Promise<UserSegment[]> {
  try {
    // Get all users with their progress
    const { data: users } = await supabase
      .from('profiles')
      .select('id, completed_onboarding');

    if (!users) return [];

    // Get progress for all users
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed');

    // Calculate progress percentage for each user
    const userProgressMap = new Map<string, number>();
    users.forEach(user => {
      const userProgress = progressData?.filter(p => p.user_id === user.id) || [];
      const completedCount = userProgress.filter(p => p.completed).length;
      const progressPercentage = userProgress.length > 0
        ? Math.round((completedCount / userProgress.length) * 100)
        : 0;
      userProgressMap.set(user.id, progressPercentage);
    });

    // Segment users
    const segments = {
      highly_engaged: { userIds: [] as string[], name: 'מעורבים מאוד', desc: 'משתמשים עם התקדמות 70%+' },
      moderately_engaged: { userIds: [] as string[], name: 'מעורבים בינוני', desc: 'משתמשים עם התקדמות 30-70%' },
      low_engagement: { userIds: [] as string[], name: 'מעורבות נמוכה', desc: 'משתמשים עם התקדמות פחות מ-30%' },
      at_risk: { userIds: [] as string[], name: 'בסיכון', desc: 'משתמשים שמעולם לא השלימו הטמעה' }
    };

    users.forEach(user => {
      const progress = userProgressMap.get(user.id) || 0;

      if (!user.completed_onboarding) {
        segments.at_risk.userIds.push(user.id);
      } else if (progress >= 70) {
        segments.highly_engaged.userIds.push(user.id);
      } else if (progress >= 30) {
        segments.moderately_engaged.userIds.push(user.id);
      } else {
        segments.low_engagement.userIds.push(user.id);
      }
    });

    const totalUsers = users.length;

    return [
      {
        segment: 'highly_engaged',
        segmentName: segments.highly_engaged.name,
        description: segments.highly_engaged.desc,
        userCount: segments.highly_engaged.userIds.length,
        percentage: totalUsers > 0 ? Math.round((segments.highly_engaged.userIds.length / totalUsers) * 100) : 0,
        userIds: segments.highly_engaged.userIds,
      },
      {
        segment: 'moderately_engaged',
        segmentName: segments.moderately_engaged.name,
        description: segments.moderately_engaged.desc,
        userCount: segments.moderately_engaged.userIds.length,
        percentage: totalUsers > 0 ? Math.round((segments.moderately_engaged.userIds.length / totalUsers) * 100) : 0,
        userIds: segments.moderately_engaged.userIds,
      },
      {
        segment: 'low_engagement',
        segmentName: segments.low_engagement.name,
        description: segments.low_engagement.desc,
        userCount: segments.low_engagement.userIds.length,
        percentage: totalUsers > 0 ? Math.round((segments.low_engagement.userIds.length / totalUsers) * 100) : 0,
        userIds: segments.low_engagement.userIds,
      },
      {
        segment: 'at_risk',
        segmentName: segments.at_risk.name,
        description: segments.at_risk.desc,
        userCount: segments.at_risk.userIds.length,
        percentage: totalUsers > 0 ? Math.round((segments.at_risk.userIds.length / totalUsers) * 100) : 0,
        userIds: segments.at_risk.userIds,
      },
    ];
  } catch (error) {
    console.error('Error fetching user segmentation:', error);
    return [];
  }
}

/**
 * Fetch engagement funnel data
 */
export async function fetchEngagementFunnel(): Promise<EngagementFunnelStep[]> {
  try {
    // Get all users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, completed_onboarding');

    if (!users) return [];

    const totalRegistered = users.length;

    // Count onboarded users
    const onboardedCount = users.filter(u => u.completed_onboarding).length;

    // Get progress data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed');

    // Count users who completed at least 1 guide
    const usersWithProgress = new Set(progressData?.filter(p => p.completed).map(p => p.user_id) || []);
    const firstGuideCount = usersWithProgress.size;

    // Count users who completed at least 5 guides
    const userCompletionCounts = new Map<string, number>();
    progressData?.forEach(p => {
      if (p.completed) {
        userCompletionCounts.set(p.user_id, (userCompletionCounts.get(p.user_id) || 0) + 1);
      }
    });

    const fiveGuidesCount = Array.from(userCompletionCounts.values()).filter(count => count >= 5).length;

    // Count users who completed all core guides (assuming 10 core guides)
    const CORE_GUIDES_COUNT = 10;
    const allCoreCompleteCount = Array.from(userCompletionCounts.values()).filter(count => count >= CORE_GUIDES_COUNT).length;

    // Calculate drop-off rates
    const steps = [
      { step: 'נרשמו', userCount: totalRegistered, percentage: 100, dropOffRate: 0 },
      {
        step: 'השלימו הטמעה',
        userCount: onboardedCount,
        percentage: totalRegistered > 0 ? Math.round((onboardedCount / totalRegistered) * 100) : 0,
        dropOffRate: totalRegistered > 0 ? Math.round(((totalRegistered - onboardedCount) / totalRegistered) * 100) : 0,
      },
      {
        step: 'השלימו מדריך ראשון',
        userCount: firstGuideCount,
        percentage: totalRegistered > 0 ? Math.round((firstGuideCount / totalRegistered) * 100) : 0,
        dropOffRate: onboardedCount > 0 ? Math.round(((onboardedCount - firstGuideCount) / onboardedCount) * 100) : 0,
      },
      {
        step: 'השלימו 5 מדריכים',
        userCount: fiveGuidesCount,
        percentage: totalRegistered > 0 ? Math.round((fiveGuidesCount / totalRegistered) * 100) : 0,
        dropOffRate: firstGuideCount > 0 ? Math.round(((firstGuideCount - fiveGuidesCount) / firstGuideCount) * 100) : 0,
      },
      {
        step: 'השלימו את כל מדריכי הליבה',
        userCount: allCoreCompleteCount,
        percentage: totalRegistered > 0 ? Math.round((allCoreCompleteCount / totalRegistered) * 100) : 0,
        dropOffRate: fiveGuidesCount > 0 ? Math.round(((fiveGuidesCount - allCoreCompleteCount) / fiveGuidesCount) * 100) : 0,
      },
    ];

    return steps;
  } catch (error) {
    console.error('Error fetching engagement funnel:', error);
    return [];
  }
}

/**
 * Fetch activity heatmap data
 */
export async function fetchActivityHeatmap(): Promise<ActivityHeatmapData[]> {
  try {
    // Get all activity from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: activities } = await supabase
      .from('user_activity')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (!activities) return [];

    // Create a map of day/hour to count
    const heatmapMap = new Map<string, number>();

    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      const dayOfWeek = date.getDay(); // 0-6
      const hourOfDay = date.getHours(); // 0-23
      const key = `${dayOfWeek}-${hourOfDay}`;
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
    });

    // Convert to array format
    const heatmapData: ActivityHeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        heatmapData.push({
          dayOfWeek: day,
          hourOfDay: hour,
          activityCount: heatmapMap.get(key) || 0,
        });
      }
    }

    return heatmapData;
  } catch (error) {
    console.error('Error fetching activity heatmap:', error);
    return [];
  }
}

/**
 * Fetch cohort analysis data
 */
export async function fetchCohortAnalysis(): Promise<CohortData[]> {
  try {
    // Get all users with their registration date
    const { data: users } = await supabase
      .from('profiles')
      .select('id, created_at');

    if (!users) return [];

    // Group users by month
    const cohortMap = new Map<string, string[]>();
    users.forEach(user => {
      const date = new Date(user.created_at);
      const cohortMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!cohortMap.has(cohortMonth)) {
        cohortMap.set(cohortMonth, []);
      }
      cohortMap.get(cohortMonth)!.push(user.id);
    });

    // Get progress data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed');

    // Get activity data from last 30 days for retention calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentActivities } = await supabase
      .from('user_activity')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const activeUserIds = new Set(recentActivities?.map(a => a.user_id) || []);

    // Calculate metrics for each cohort
    const cohortDataArray: CohortData[] = [];

    for (const [cohortMonth, userIds] of cohortMap.entries()) {
      const userCount = userIds.length;

      // Retention: percentage still active in last 30 days
      const activeInCohort = userIds.filter(id => activeUserIds.has(id)).length;
      const retentionRate = userCount > 0 ? Math.round((activeInCohort / userCount) * 100) : 0;

      // Completion: average progress percentage
      let totalProgress = 0;
      userIds.forEach(userId => {
        const userProgress = progressData?.filter(p => p.user_id === userId) || [];
        const completedCount = userProgress.filter(p => p.completed).length;
        const progressPercentage = userProgress.length > 0
          ? Math.round((completedCount / userProgress.length) * 100)
          : 0;
        totalProgress += progressPercentage;
      });

      const completionRate = userCount > 0 ? Math.round(totalProgress / userCount) : 0;

      cohortDataArray.push({
        cohortMonth,
        userCount,
        retentionRate,
        completionRate,
      });
    }

    // Sort by month (most recent first)
    cohortDataArray.sort((a, b) => b.cohortMonth.localeCompare(a.cohortMonth));

    return cohortDataArray;
  } catch (error) {
    console.error('Error fetching cohort analysis:', error);
    return [];
  }
}

/**
 * Export user list for a specific segment to CSV
 */
export async function exportSegmentUsers(userIds: string[]): Promise<string> {
  try {
    // Get user details for the segment
    const { data: users } = await supabase
      .from('profiles')
      .select('id, display_name, email, created_at')
      .in('id', userIds);

    if (!users || users.length === 0) {
      return '';
    }

    // Get progress for these users
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed')
      .in('user_id', userIds);

    // Calculate progress for each user
    const userProgressMap = new Map<string, number>();
    users.forEach(user => {
      const userProgress = progressData?.filter(p => p.user_id === user.id) || [];
      const completedCount = userProgress.filter(p => p.completed).length;
      const progressPercentage = userProgress.length > 0
        ? Math.round((completedCount / userProgress.length) * 100)
        : 0;
      userProgressMap.set(user.id, progressPercentage);
    });

    // Create CSV content
    const headers = ['User ID', 'Display Name', 'Email', 'Created At', 'Progress %'];
    const rows = users.map(user => [
      user.id,
      user.display_name,
      user.email,
      user.created_at,
      userProgressMap.get(user.id) || 0,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  } catch (error) {
    console.error('Error exporting segment users:', error);
    return '';
  }
}

