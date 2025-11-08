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
 * Shows recent user activity with day grouping
 * Story 5.1 - Dashboard Home Page (initial placeholder)
 * Story 5.5 - Full implementation with day grouping (Today, Yesterday, This Week, Earlier)
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

/**
 * Story 5.5 - Day grouping categories
 */
type DayGroup = 'today' | 'yesterday' | 'thisWeek' | 'earlier';

interface GroupedActivities {
  today: Activity[];
  yesterday: Activity[];
  thisWeek: Activity[];
  earlier: Activity[];
}

/**
 * Determines which day group an activity belongs to
 * Story 5.5
 */
function getDayGroup(timestamp: string): DayGroup {
  const now = new Date();
  const activityDate = new Date(timestamp);

  // Set to start of day for comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const activityStart = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());

  if (activityStart.getTime() === todayStart.getTime()) {
    return 'today';
  } else if (activityStart.getTime() === yesterdayStart.getTime()) {
    return 'yesterday';
  } else if (activityStart >= weekStart) {
    return 'thisWeek';
  } else {
    return 'earlier';
  }
}

/**
 * Groups activities by day (Today, Yesterday, This Week, Earlier)
 * Story 5.5
 */
function groupActivitiesByDay(activities: Activity[]): GroupedActivities {
  const grouped: GroupedActivities = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: [],
  };

  activities.forEach((activity) => {
    const group = getDayGroup(activity.timestamp);
    grouped[group].push(activity);
  });

  return grouped;
}

/**
 * Gets the Hebrew label for a day group
 * Story 5.5
 */
function getDayGroupLabel(group: DayGroup): string {
  switch (group) {
    case 'today':
      return hebrewLocale.dashboard.activityToday;
    case 'yesterday':
      return hebrewLocale.dashboard.activityYesterday;
    case 'thisWeek':
      return hebrewLocale.dashboard.activityThisWeek;
    case 'earlier':
      return hebrewLocale.dashboard.activityEarlier;
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

  // Story 5.5 - Group activities by day
  const groupedActivities = groupActivitiesByDay(activities);

  // Order of day groups to display
  const dayGroupOrder: DayGroup[] = ['today', 'yesterday', 'thisWeek', 'earlier'];

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
          <div className="space-y-4">
            {/* Story 5.5 - Render activities grouped by day */}
            {dayGroupOrder.map((group) => {
              const groupActivities = groupedActivities[group];
              if (groupActivities.length === 0) return null;

              return (
                <div key={group} className="space-y-2">
                  {/* Day Group Header */}
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                    {getDayGroupLabel(group)}
                  </h4>

                  {/* Activities in this group */}
                  {groupActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              );
            })}
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

