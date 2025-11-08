import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types/notifications';

/**
 * Fetch user's notifications
 */
export async function fetchNotifications(
  userId: string,
  limit: number = 20
): Promise<{ success: boolean; notifications?: Notification[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!notifications_actor_id_fkey (
          display_name
        )
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        error: 'שגיאה בטעינת התראות',
      };
    }

    return {
      success: true,
      notifications: data as Notification[],
    };
  } catch (error) {
    console.error('Unexpected error fetching notifications:', error);
    return {
      success: false,
      error: 'שגיאה בלתי צפויה',
    };
  }
}

/**
 * Get count of unread notifications
 */
export async function getUnreadCount(
  userId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return {
        success: false,
        error: 'שגיאה בטעינת ספירת התראות',
      };
    }

    return {
      success: true,
      count: count || 0,
    };
  } catch (error) {
    console.error('Unexpected error getting unread count:', error);
    return {
      success: false,
      error: 'שגיאה בלתי צפויה',
    };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: 'שגיאה בעדכון התראה',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error marking notification as read:', error);
    return {
      success: false,
      error: 'שגיאה בלתי צפויה',
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: 'שגיאה בעדכון התראות',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error marking all notifications as read:', error);
    return {
      success: false,
      error: 'שגיאה בלתי צפויה',
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: 'שגיאה במחיקת התראה',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error deleting notification:', error);
    return {
      success: false,
      error: 'שגיאה בלתי צפויה',
    };
  }
}

