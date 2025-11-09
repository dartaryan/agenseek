/**
 * Admin Notification Bell Component
 * Story 9.5: Implement Admin Notifications and Alerts
 *
 * Bell icon with badge count and dropdown showing recent notifications
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconBell, IconCheck, IconSettings, IconTrash } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import {
  fetchAdminNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllReadNotifications,
  type AdminNotificationWithDetails,
} from '@/lib/actions/adminNotifications';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * AdminNotificationBell Component
 */
export function AdminNotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotificationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const locale = hebrewLocale.pages.admin.notifications;

  // Load notifications and unread count
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Reload notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  /**
   * Load notifications
   */
  async function loadNotifications() {
    setIsLoading(true);
    try {
      const data = await fetchAdminNotifications(20, false);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Load unread count
   */
  async function loadUnreadCount() {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }

  /**
   * Handle notification click
   */
  async function handleNotificationClick(notification: AdminNotificationWithDetails) {
    // Mark as read
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      setIsOpen(false);
      navigate(notification.action_url);
    }
  }

  /**
   * Handle mark all as read
   */
  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('כל ההתראות סומנו כנקראו');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('שגיאה בסימון ההתראות');
    }
  }

  /**
   * Handle clear read notifications
   */
  async function handleClearRead() {
    try {
      await clearAllReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success('התראות שנקראו נמחקו');
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      toast.error('שגיאה במחיקת התראות');
    }
  }

  /**
   * Get notification icon by type
   */
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'new_user_digest':
        return '👤';
      case 'content_flagged':
        return '⚠️';
      case 'low_engagement':
        return '📉';
      case 'performance_issue':
        return '🔧';
      case 'milestone':
        return '🎉';
      default:
        return '📢';
    }
  }

  /**
   * Get notification type label
   */
  function getNotificationTypeLabel(type: string) {
    switch (type) {
      case 'new_user_digest':
        return locale.newUserDigest;
      case 'content_flagged':
        return locale.contentFlagged;
      case 'low_engagement':
        return locale.lowEngagement;
      case 'performance_issue':
        return locale.performanceIssue;
      case 'milestone':
        return locale.milestone;
      default:
        return type;
    }
  }

  /**
   * Get priority badge color
   */
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={locale.bellIcon}
        >
          <IconBell size={20} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-lg">{locale.title}</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 text-xs"
              >
                <IconCheck size={14} className="ml-1" />
                {locale.markAllAsRead}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                navigate('/admin/notifications/preferences');
              }}
              className="h-8 w-8"
            >
              <IconSettings size={16} />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              טוען...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <IconBell size={48} className="mb-2 opacity-50" />
              <p className="text-sm">{locale.noNotifications}</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 ${
                    !notification.is_read ? 'bg-emerald-50/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm leading-tight">
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {/* Type Badge */}
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {getNotificationTypeLabel(notification.type)}
                        </span>

                        {/* Priority Indicator */}
                        {notification.priority === 'high' && (
                          <span className={`inline-flex w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                        )}

                        {/* Time */}
                        <span>
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: he,
                          })}
                        </span>
                      </div>

                      {/* Action Button */}
                      {notification.action_label && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}
                        >
                          {notification.action_label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-2 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearRead}
                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <IconTrash size={14} className="ml-1" />
                {locale.clearRead}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

