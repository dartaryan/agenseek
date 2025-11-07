import { Link } from 'react-router-dom';
import {
  IconBook,
  IconCircleCheck,
  IconNote,
  IconChecklist,
  IconTrophy,
  IconArrowRight,
} from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Activity Feed Card Component
 * Shows recent user activity
 * Story 5.1 - Dashboard Home Page (Placeholder for Story 5.5)
 * Full implementation will come in Story 5.5
 */

interface Activity {
  id: string;
  type: 'view_guide' | 'complete_guide' | 'create_note' | 'create_task' | 'earn_achievement';
  description: string;
  link?: string;
  timestamp: string;
}

interface ActivityFeedCardProps {
  activities: Activity[];
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'view_guide':
      return <IconBook className="w-5 h-5 text-blue-500" stroke={1.5} />;
    case 'complete_guide':
      return <IconCircleCheck className="w-5 h-5 text-emerald-500" stroke={1.5} />;
    case 'create_note':
      return <IconNote className="w-5 h-5 text-purple-500" stroke={1.5} />;
    case 'create_task':
      return <IconChecklist className="w-5 h-5 text-amber-500" stroke={1.5} />;
    case 'earn_achievement':
      return <IconTrophy className="w-5 h-5 text-yellow-500" stroke={1.5} />;
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const activityTime = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'עכשיו';
  } else if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60);
    return `לפני ${hours} שעות`;
  } else {
    const days = Math.floor(diffInMinutes / (24 * 60));
    return `לפני ${days} ימים`;
  }
}

function ActivityItem({ activity }: { activity: Activity }) {
  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        {getActivityIcon(activity.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{activity.description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );

  if (activity.link) {
    return <Link to={activity.link}>{content}</Link>;
  }

  return content;
}

export function ActivityFeedCard({ activities }: ActivityFeedCardProps) {
  const hasActivities = activities.length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {hebrewLocale.dashboard.recentActivity}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hebrewLocale.dashboard.recentActivityDescription}
          </p>
        </div>

        {/* Activity List or Empty State */}
        {hasActivities ? (
          <div className="space-y-2">
            {activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <IconBook className="w-8 h-8 text-gray-400" stroke={1.5} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {hebrewLocale.dashboard.noRecentActivity}
            </p>
          </div>
        )}

        {/* View All Button */}
        {hasActivities && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/profile" className="flex items-center justify-center gap-2">
              {hebrewLocale.dashboard.viewAllActivity}
              <IconArrowRight className="w-4 h-4" stroke={1.5} />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

