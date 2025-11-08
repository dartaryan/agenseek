/**
 * Tasks Statistics Card
 * Story 6.8: Build Task and Note Statistics Dashboard
 * Shows tasks by status, completion rate, high priority count, and weekly chart
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChecklist, IconAlertTriangle, IconChartBar } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TasksStatistics } from '../../lib/api/tasks';

interface TasksStatisticsCardProps {
  statistics: TasksStatistics;
}

export function TasksStatisticsCard({ statistics }: TasksStatisticsCardProps) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Prepare chart data
  const chartData = [
    {
      name: 'נוצרו',
      value: statistics.weeklyData.created,
      fill: '#10b981', // emerald-500
    },
    {
      name: 'הושלמו',
      value: statistics.weeklyData.completed,
      fill: '#3b82f6', // blue-500
    },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      onClick={() => navigate('/tasks')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <IconChecklist className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">סיכום משימות</h3>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {/* Status Counts */}
        <div className="grid grid-cols-3 gap-2">
          {/* To Do */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {statistics.statusCounts.todo}
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">לביצוע</div>
          </div>

          {/* In Progress */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {statistics.statusCounts.in_progress}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">בתהליך</div>
          </div>

          {/* Done */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {statistics.statusCounts.done}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">הושלמו</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">שיעור השלמה</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistics.completionRate}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${statistics.completionRate}%` }}
            />
          </div>
        </div>

        {/* High Priority Tasks */}
        {statistics.highPriorityCount > 0 && (
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              statistics.highPriorityCount > 5
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <IconAlertTriangle
                className={`w-4 h-4 ${
                  statistics.highPriorityCount > 5
                    ? 'text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">עדיפות גבוהה</span>
            </div>
            <span
              className={`text-lg font-semibold ${
                statistics.highPriorityCount > 5
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {statistics.highPriorityCount}
            </span>
          </div>
        )}

        {/* Weekly Chart */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <IconChartBar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              השבוע האחרון
            </span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* View All Button */}
      <button
        className="mt-6 w-full py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/tasks');
        }}
      >
        צפה בכל המשימות
      </button>
    </div>
  );
}

