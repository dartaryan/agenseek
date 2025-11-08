import {
  IconClock,
  IconNote,
  IconChecklist,
  IconFlame,
  IconTrendingUp,
  IconCircleCheck,
} from '@tabler/icons-react';
import { Card } from '../ui/card';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Dashboard Stats Component
 * Shows key statistics (reading time, guides completed, notes, tasks, streak)
 * Story 5.1 - Dashboard Home Page
 * Story 5.6 - Enhanced with guides completed, trends, and improved layout
 */

interface TrendData {
  value: number;
  positive: boolean;
}

interface DashboardStatsProps {
  totalReadingTimeMinutes: number;
  guidesCompleted: number;
  notesCreated: number;
  tasksCompleted: number;
  currentStreakDays: number;
  // Story 5.6 - Optional trend data
  trends?: {
    readingTime?: TrendData;
    guidesCompleted?: TrendData;
    notes?: TrendData;
    tasks?: TrendData;
    streak?: TrendData;
  };
}

function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} ${hebrewLocale.dashboard.minutes}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} ${hebrewLocale.dashboard.hours}`;
  }
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')} ${hebrewLocale.dashboard.hours}`;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

function StatCard({ icon: Icon, label, value, iconColor, trend }: StatCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" stroke={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</div>

        {/* Trend (optional) */}
        {trend && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs ${
              trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            <IconTrendingUp
              className={`w-3 h-3 ${trend.positive ? '' : 'rotate-180'}`}
              stroke={1.5}
            />
            {trend.positive ? '+' : ''}
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardStats({
  totalReadingTimeMinutes,
  guidesCompleted,
  notesCreated,
  tasksCompleted,
  currentStreakDays,
  trends,
}: DashboardStatsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {hebrewLocale.dashboard.statistics}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hebrewLocale.dashboard.statisticsDescription}
          </p>
        </div>

        {/* Stats Grid - Story 5.6: Now includes 5 stats with trends */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={IconClock}
            label={hebrewLocale.dashboard.totalReadingTime}
            value={formatReadingTime(totalReadingTimeMinutes)}
            iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={trends?.readingTime}
          />
          <StatCard
            icon={IconCircleCheck}
            label={hebrewLocale.dashboard.guidesCompleted}
            value={guidesCompleted}
            iconColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
            trend={trends?.guidesCompleted}
          />
          <StatCard
            icon={IconFlame}
            label={hebrewLocale.dashboard.currentStreak}
            value={`${currentStreakDays} ${hebrewLocale.dashboard.days}`}
            iconColor="bg-gradient-to-br from-orange-500 to-orange-600"
            trend={trends?.streak}
          />
          <StatCard
            icon={IconNote}
            label={hebrewLocale.dashboard.notesCreated}
            value={notesCreated}
            iconColor="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={trends?.notes}
          />
          <StatCard
            icon={IconChecklist}
            label={hebrewLocale.dashboard.tasksCompleted}
            value={tasksCompleted}
            iconColor="bg-gradient-to-br from-teal-500 to-teal-600"
            trend={trends?.tasks}
          />
        </div>
      </div>
    </Card>
  );
}

