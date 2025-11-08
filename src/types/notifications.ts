/**
 * Notification type definitions
 */

export type NotificationType = 'comment_reply' | 'solution_marked';

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  guide_slug: string;
  comment_id: string;
  reply_id: string | null;
  comment_preview: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;

  // Joined data
  actor?: {
    display_name: string;
  };
}

export interface NotificationInsert {
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  guide_slug: string;
  comment_id: string;
  reply_id?: string | null;
  comment_preview?: string | null;
  is_read?: boolean;
}

