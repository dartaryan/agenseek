/**
 * JourneyCard Component - Story 0.18
 *
 * Full-width card displayed at the top of the dashboard
 * showing the user's learning journey progress and next recommended guide.
 *
 * Features:
 * - Overall journey progress
 * - Current phase name and progress
 * - Next recommended guide
 * - CTA button to navigate to /journey
 * - Beautiful gradient design
 */

import { useNavigate } from 'react-router-dom';
import { IconRoute, IconArrowLeft, IconClock } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { formatEstimatedTime } from '@/lib/journey';

interface JourneyCardProps {
  overallProgress: number; // 0-100
  currentPhase: {
    id: string;
    name: string;
    progress: number; // 0-100
  };
  nextGuide: {
    id: string;
    title: string;
    estimatedMinutes: number;
  } | null;
  totalGuides: number;
  completedGuides: number;
}

export function JourneyCard({
  overallProgress,
  currentPhase,
  nextGuide,
  totalGuides,
  completedGuides,
}: JourneyCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/journey')}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-800',
        'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50',
        'dark:from-emerald-950/30 dark:via-gray-900 dark:to-emerald-950/20',
        'p-6 md:p-8 cursor-pointer transition-all duration-300',
        'hover:shadow-xl hover:scale-[1.01] hover:border-emerald-300 dark:hover:border-emerald-700',
        'group'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/journey');
        }
      }}
      aria-label="עבור למסלול הלמידה שלי"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Container */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
        {/* Left Section - Progress Info */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <IconRoute className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                מסלול הלמידה שלי
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedGuides} מתוך {totalGuides} מדריכים הושלמו
              </p>
            </div>
          </div>

          {/* Current Phase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                אתה בשלב: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentPhase.name}</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {currentPhase.progress}% הושלם
              </span>
            </div>

            {/* Progress Bar - Current Phase */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${currentPhase.progress}%` }}
              />
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                התקדמות כללית במסע
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(overallProgress)}%
              </span>
            </div>

            {/* Progress Bar - Overall */}
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full relative overflow-hidden"
                style={{ width: `${overallProgress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Next Guide */}
          {nextGuide && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-emerald-200 dark:border-emerald-800">
              <IconClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  המדריך הבא שלך
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {nextGuide.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatEstimatedTime(nextGuide.estimatedMinutes)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - CTA Button */}
        <div className="shrink-0 w-full md:w-auto">
          <button
            className={cn(
              'w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-lg',
              'bg-gradient-to-r from-emerald-600 to-emerald-500',
              'hover:from-emerald-700 hover:to-emerald-600',
              'text-white shadow-lg shadow-emerald-500/30',
              'transition-all duration-300',
              'hover:shadow-xl hover:shadow-emerald-500/40',
              'hover:scale-105',
              'flex items-center justify-center gap-2',
              'group-hover:animate-pulse'
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/journey');
            }}
          >
            המשך במסע
            <IconArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

