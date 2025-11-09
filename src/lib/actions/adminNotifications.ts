/**
 * Admin Notifications Actions
 * Story 9.5: Implement Admin Notifications and Alerts
 *
 * Functions for managing admin notifications:
 * - Fetch notifications
 * - Mark as read
 * - Clear all
 * - Manage preferences
 * - Create notifications
 */

import { supabase } from '../supabase';
import type { Database } from '../../types/database';

// Type definitions
export type AdminNotification = Database['public']['Tables']['admin_notifications']['Row'];
export type AdminNotificationInsert = Database['public']['Tables']['admin_notifications']['Insert'];
export type AdminNotificationPreferences = Database['public']['Tables']['admin_notification_preferences']['Row'];

export interface AdminNotificationWithDetails extends AdminNotification {
  relatedUserName?: string;
  relatedUserEmail?: string;
}

/**
 * Fetch admin notifications
 * @param limit Number of notifications to fetch (default 50)
 * @param unreadOnly Whether to fetch only unread notifications
 */
export async function fetchAdminNotifications(
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<AdminNotificationWithDetails[]> {
  try {
    let query = supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) throw error;
    if (!notifications || notifications.length === 0) return [];

    // Fetch related user details for notifications that have related_user_id
    const userIds = notifications
      .filter(n => n.related_user_id)
      .map(n => n.related_user_id as string);

    if (userIds.length === 0) {
      return notifications as AdminNotificationWithDetails[];
    }

    const { data: users } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .in('id', userIds);

    const userMap = new Map(users?.map(u => [u.id, u]) || []);

    // Enrich notifications with user details
    return notifications.map(notification => {
      const user = notification.related_user_id
        ? userMap.get(notification.related_user_id)
        : null;

      return {
        ...notification,
        relatedUserName: user?.display_name,
        relatedUserEmail: user?.email,
      };
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    throw error;
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('admin_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
}

/**
 * Mark a notification as read
 * @param notificationId Notification ID
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 * @param notificationId Notification ID
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Delete all read notifications
 */
export async function clearAllReadNotifications(): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('is_read', true);

    if (error) throw error;
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
}

/**
 * Fetch admin notification preferences
 * @param adminId Admin user ID
 */
export async function fetchAdminNotificationPreferences(
  adminId: string
): Promise<AdminNotificationPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('admin_notification_preferences')
      .select('*')
      .eq('admin_id', adminId)
      .single();

    if (error) {
      // If no preferences exist, create default ones
      if (error.code === 'PGRST116') {
        return await createDefaultPreferences(adminId);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching admin notification preferences:', error);
    throw error;
  }
}

/**
 * Create default notification preferences for an admin
 * @param adminId Admin user ID
 */
async function createDefaultPreferences(
  adminId: string
): Promise<AdminNotificationPreferences> {
  try {
    const { data, error } = await supabase
      .from('admin_notification_preferences')
      .insert({
        admin_id: adminId,
        new_user_digest_enabled: true,
        new_user_digest_frequency: 'daily',
        content_flagged_enabled: true,
        content_flagged_frequency: 'immediate',
        low_engagement_enabled: true,
        low_engagement_frequency: 'weekly',
        performance_issues_enabled: true,
        performance_issues_frequency: 'immediate',
        milestones_enabled: true,
        milestones_frequency: 'immediate',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating default preferences:', error);
    throw error;
  }
}

/**
 * Update admin notification preferences
 * @param adminId Admin user ID
 * @param preferences Partial preferences to update
 */
export async function updateAdminNotificationPreferences(
  adminId: string,
  preferences: Partial<AdminNotificationPreferences>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_notification_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('admin_id', adminId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating admin notification preferences:', error);
    throw error;
  }
}

/**
 * Create a new admin notification
 * @param notification Notification data
 */
export async function createAdminNotification(
  notification: AdminNotificationInsert
): Promise<AdminNotification> {
  try {
    const { data, error } = await supabase
      .from('admin_notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating admin notification:', error);
    throw error;
  }
}

/**
 * Helper function to create a "low engagement" notification
 * Called by scheduled jobs or manual triggers
 */
export async function createLowEngagementNotification(
  userCount: number,
  segmentName: string
): Promise<void> {
  await createAdminNotification({
    type: 'low_engagement',
    priority: 'normal',
    title: 'התראת מעורבות נמוכה',
    message: `${userCount} משתמשים בקטגוריית "${segmentName}" עם מעורבות נמוכה`,
    metadata: { user_count: userCount, segment: segmentName },
    action_url: '/admin/engagement',
    action_label: 'צפה בדוח',
  });
}

/**
 * Helper function to create a "performance issue" notification
 */
export async function createPerformanceIssueNotification(
  issueType: string,
  issueDescription: string,
  affectedGuideSlug?: string
): Promise<void> {
  await createAdminNotification({
    type: 'performance_issue',
    priority: 'high',
    title: 'בעיית ביצועים',
    message: issueDescription,
    related_guide_slug: affectedGuideSlug || null,
    metadata: { issue_type: issueType },
    action_url: affectedGuideSlug ? `/guides/${affectedGuideSlug}` : '/admin/analytics',
    action_label: 'בדוק',
  });
}

/**
 * Helper function to create a "content flagged" notification
 */
export async function createContentFlaggedNotification(
  guideSlug: string,
  commentId: string,
  reason: string
): Promise<void> {
  await createAdminNotification({
    type: 'content_flagged',
    priority: 'high',
    title: 'תוכן דווח',
    message: `תגובה דווחה בגלל: ${reason}`,
    related_guide_slug: guideSlug,
    related_comment_id: commentId,
    metadata: { reason },
    action_url: `/guides/${guideSlug}#comment-${commentId}`,
    action_label: 'סקור תוכן',
  });
}

/**
 * Helper function to create a "milestone" notification
 */
export async function createMilestoneNotification(
  milestoneType: string,
  milestoneValue: string,
  description: string
): Promise<void> {
  await createAdminNotification({
    type: 'milestone',
    priority: 'high',
    title: 'אבן דרך חדשה הושגה!',
    message: description,
    metadata: { milestone_type: milestoneType, milestone_value: milestoneValue },
    action_url: '/admin',
    action_label: 'צפה בנתונים',
  });
}

