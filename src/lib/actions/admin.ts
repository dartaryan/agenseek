/**
 * Admin Analytics Actions
 * Story 9.1: Build Admin Dashboard Overview
 *
 * Functions for fetching admin dashboard data:
 * - Overall statistics
 * - Activity graphs
 * - Popular guides
 * - Recent activity
 */

import { supabase } from '../supabase';

// Type definitions
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

