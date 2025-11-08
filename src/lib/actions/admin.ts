/**
 * Admin Analytics Actions
 * Story 9.1: Build Admin Dashboard Overview
 * Story 9.2: Build User Management Page
 *
 * Functions for fetching admin dashboard data:
 * - Overall statistics
 * - Activity graphs
 * - Popular guides
 * - Recent activity
 * - User management
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

