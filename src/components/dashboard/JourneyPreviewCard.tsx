/**
 * Journey Preview Card - Story 0.10.1
 *
 * Dashboard widget that shows a mini preview of the user's learning journey:
 * - Current phase name and progress
 * - Mini visual roadmap with 4 phases
 * - Overall journey progress percentage
 * - Call-to-action button to view full journey
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getJourneyData, type JourneyData } from '@/lib/journey';
import {
  IconBook,
  IconStar,
  IconHeart,
  IconDots,
  IconCheck,
  IconLock,
  IconArrowRight,
  IconLoader2,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// Icon mapping
const PHASE_ICONS = {
  IconBook,
  IconStar,
  IconHeart,
  IconDots,
};

export function JourneyPreviewCard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJourneyData() {
      if (!user?.id || !profile) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getJourneyData(user.id, {
          role: profile.role,
          interests: profile.interests,
          experience_level: profile.experience_level,
        });
        setJourneyData(data);
      } catch (err) {
        console.error('Error loading journey preview:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadJourneyData();
  }, [user?.id, profile]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!journeyData) {
    return null;
  }

  const currentPhase = journeyData.phases.find((p) => p.id === journeyData.stats.currentPhase);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl shadow-lg border border-emerald-200 dark:border-emerald-800 p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            מסלול הלמידה שלי
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPhase?.title || 'מדריכי ליבה'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {journeyData.stats.overallPercentage}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">התקדמות כוללת</div>
        </div>
      </div>

      {/* Current Phase Progress */}
      {currentPhase && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>
              {currentPhase.progress.completed} / {currentPhase.progress.total} הושלמו
            </span>
            <span>{currentPhase.progress.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${currentPhase.progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Mini Roadmap - 4 Phases */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {journeyData.phases.map((phase) => {
          const Icon = PHASE_ICONS[phase.icon as keyof typeof PHASE_ICONS] || IconBook;
          const isActive = phase.id === journeyData.stats.currentPhase;
          const isCompleted = phase.status === 'completed';
          const isLocked = phase.status === 'locked';

          return (
            <div
              key={phase.id}
              className={cn(
                'relative p-3 rounded-lg text-center transition-all',
                isCompleted &&
                  'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500 ring-inset',
                isActive &&
                  !isCompleted &&
                  'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-inset',
                isLocked && 'bg-gray-100 dark:bg-gray-800 opacity-50'
              )}
              title={phase.title}
            >
              {/* Icon */}
              <div className="flex justify-center mb-1">
                {isCompleted && (
                  <IconCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
                {!isCompleted && !isLocked && (
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  />
                )}
                {isLocked && <IconLock className="w-5 h-5 text-gray-400 dark:text-gray-600" />}
              </div>

              {/* Progress Indicator */}
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {phase.progress.percentage}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {journeyData.stats.completedGuides}
          </span>
          <span className="mx-1">/</span>
          <span>{journeyData.stats.totalGuides}</span>
          <span className="mr-1">מדריכים הושלמו</span>
        </div>
        {journeyData.stats.weeklyProgress > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="font-semibold">+{journeyData.stats.weeklyProgress}</span>
            <span>השבוע</span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/journey')}
        className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group"
      >
        <span>המשך במסלול</span>
        <IconArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
      </button>
    </div>
  );
}

