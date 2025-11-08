/**
 * Notes Statistics Card
 * Story 6.8: Build Task and Note Statistics Dashboard
 * Shows total notes count, top tags, weekly trend, and associated guides count
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconNote, IconTag, IconTrendingUp, IconBook } from '@tabler/icons-react';
import type { NotesStatistics } from '../../lib/api/notes';

interface NotesStatisticsCardProps {
  statistics: NotesStatistics;
}

export function NotesStatisticsCard({ statistics }: NotesStatisticsCardProps) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      onClick={() => navigate('/notes')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <IconNote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">סיכום הערות</h3>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {/* Total Notes */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">סה"כ הערות</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {statistics.totalCount}
          </span>
        </div>

        {/* Notes Created This Week */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">השבוע</span>
          </div>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            +{statistics.createdThisWeek}
          </span>
        </div>

        {/* Associated Guides */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <IconBook className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">מדריכים מקושרים</span>
          </div>
          <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {statistics.associatedGuidesCount}
          </span>
        </div>

        {/* Top Tags */}
        {statistics.topTags.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <IconTag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                תגיות פופולריות
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {statistics.topTags.map((tag) => (
                <div
                  key={tag.tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium"
                >
                  <span>{tag.tag}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">({tag.count})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View All Button */}
      <button
        className="mt-6 w-full py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/notes');
        }}
      >
        צפה בכל ההערות
      </button>
    </div>
  );
}

