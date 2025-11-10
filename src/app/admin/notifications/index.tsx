/**
 * Admin Notifications Page
 * Full-page view of all admin notifications with filtering and pagination
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconBell,
  IconCheck,
  IconTrash,
  IconFilter,
  IconRefresh,
  IconSettings,
} from '@tabler/icons-react';
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

type FilterType = 'all' | 'unread' | 'read';
type PriorityFilter = 'all' | 'high' | 'normal' | 'low';

export function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotificationWithDetails[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // Load notifications
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [filter]);

  async function loadNotifications() {
    setIsLoading(true);
    try {
      const isUnreadOnly = filter === 'unread';
      const data = await fetchAdminNotifications(100, isUnreadOnly);

      // Apply additional filters
      let filtered = data;
      if (filter === 'read') {
        filtered = data.filter(n => n.is_read);
      }
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(n => n.priority === priorityFilter);
      }

      setNotifications(filtered);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('שגיאה בטעינת התראות');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUnreadCount() {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('שגיאה בסימון ההתראה כנקראה');
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('כל ההתראות סומנו כנקראות');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('שגיאה בסימון כל ההתראות');
    }
  }

  async function handleClearAllRead() {
    try {
      await clearAllReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success('כל ההתראות שנקראו נמחקו');
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      toast.error('שגיאה במחיקת התראות');
    }
  }

  function handleNotificationClick(notification: AdminNotificationWithDetails) {
    // Mark as read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate if action URL exists
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  }

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

  function getPriorityLabel(priority: string) {
    switch (priority) {
      case 'high':
        return 'גבוהה';
      case 'normal':
        return 'רגילה';
      case 'low':
        return 'נמוכה';
      default:
        return priority;
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'new_user_digest':
        return 'משתמשים חדשים';
      case 'content_flagged':
        return 'תוכן מדווח';
      case 'low_engagement':
        return 'מעורבות נמוכה';
      case 'performance_issue':
        return 'בעיית ביצועים';
      case 'milestone':
        return 'אבן דרך';
      default:
        return type;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <IconBell className="w-8 h-8" />
            התראות אדמין
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/notifications/preferences')}
          >
            <IconSettings className="w-4 h-4 ml-2" />
            הגדרות התראות
          </Button>
        </div>
        <p className="text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} התראות שלא נקראו` : 'אין התראות שלא נקראו'}
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter by read status */}
            <div className="flex items-center gap-2">
              <IconFilter className="w-4 h-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="unread">לא נקראו</SelectItem>
                  <SelectItem value="read">נקראו</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by priority */}
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="עדיפות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל העדיפויות</SelectItem>
                <SelectItem value="high">עדיפות גבוהה</SelectItem>
                <SelectItem value="normal">עדיפות רגילה</SelectItem>
                <SelectItem value="low">עדיפות נמוכה</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadNotifications} disabled={isLoading}>
                <IconRefresh className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                רענן
              </Button>

              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <IconCheck className="w-4 h-4 ml-2" />
                  סמן הכל כנקרא
                </Button>
              )}

              {notifications.some((n) => n.is_read) && (
                <Button variant="outline" size="sm" onClick={handleClearAllRead}>
                  <IconTrash className="w-4 h-4 ml-2" />
                  מחק נקראו
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">טוען התראות...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconBell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">אין התראות</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'אין התראות שלא נקראו' : 'אין התראות להצגה'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-400px)] rounded-md border">
          <div className="space-y-2 p-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                    : 'bg-background'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Priority indicator */}
                    <div
                      className={`w-1 h-full ${getPriorityColor(notification.priority)} rounded-full flex-shrink-0`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`font-semibold ${
                              !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: he,
                          })}
                        </span>
                        {notification.action_label && (
                          <span className="text-blue-600 hover:underline">
                            {notification.action_label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mark as read button */}
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <IconCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default AdminNotificationsPage;

