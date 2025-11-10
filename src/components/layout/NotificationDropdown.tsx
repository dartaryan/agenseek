import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconBell } from '@tabler/icons-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '../../hooks/useAuth';
import {
  fetchNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../lib/actions/notifications';
import type { Notification } from '../../types/notifications';
import { hebrewLocale } from '../../lib/locale/he';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

/**
 * NotificationDropdown Component - Story 8.6
 *
 * Features:
 * - Bell icon with unread badge count
 * - Dropdown with recent notifications
 * - Click notification to navigate to comment thread
 * - Mark individual notifications as read
 * - Mark all notifications as read
 * - Real-time updates via polling
 */
export function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications and unread count
  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);

    // Fetch both notifications and unread count
    const [notificationsResult, countResult] = await Promise.all([
      fetchNotifications(user.id, 10),
      getUnreadCount(user.id),
    ]);

    if (notificationsResult.success && notificationsResult.notifications) {
      setNotifications(notificationsResult.notifications);
    }

    if (countResult.success && countResult.count !== undefined) {
      setUnreadCount(countResult.count);
    }

    setIsLoading(false);
  };

  // Load notifications on mount and when dropdown opens
  useEffect(() => {
    if (user) {
      loadNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Reload when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen]);

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markNotificationRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Close dropdown
    setIsOpen(false);

    // Navigate to comment thread (handled by Link)
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    if (!user) return;

    const result = await markAllNotificationsRead(user.id);
    if (result.success) {
      setUnreadCount(0);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  // Get notification message
  const getNotificationMessage = (notification: Notification): string => {
    if (notification.type === 'comment_reply') {
      return hebrewLocale.notifications.repliedToYourComment;
    } else if (notification.type === 'solution_marked') {
      return hebrewLocale.notifications.markedYourAnswerAsSolution;
    }
    return '';
  };

  // Get time ago in Hebrew
  const getTimeAgo = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: he,
      });
    } catch {
      return '';
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label={hebrewLocale.notifications.title}>
          <IconBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[600px] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{hebrewLocale.notifications.title}</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-auto p-1 text-xs text-emerald-600 hover:text-emerald-700"
            >
              {hebrewLocale.notifications.markAllRead}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading && notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            {hebrewLocale.auth.loading}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            {hebrewLocale.notifications.noNotifications}
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
                <Link
                  to={`/guides/${notification.guide_slug}?commentId=${notification.comment_id}`}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex flex-col gap-1 p-3 ${
                    !notification.is_read ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {notification.actor?.display_name || 'משתמש'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getNotificationMessage(notification)}
                      </p>
                      {notification.comment_preview && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {notification.comment_preview}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                {hebrewLocale.dashboard.viewAllActivity}
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

