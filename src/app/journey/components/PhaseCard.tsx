/**
 * Phase Card Component - Story 0.10.1 & 0.10.2
 *
 * Displays a phase of the learning journey with:
 * - Phase header (icon, title, description) - with entrance animation
 * - Progress bar and statistics - animated progress fill
 * - Status badge (completed/in_progress/locked)
 * - Expandable accordion with guide list - smooth transitions
 * - Individual guide items with action buttons - micro-interactions
 * - Hover effects and unlock animations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type PhaseData } from '@/lib/journey';
import {
  IconBook,
  IconStar,
  IconHeart,
  IconDots,
  IconCheck,
  IconLock,
  IconChevronDown,
  IconClock,
  IconArrowLeft,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { formatEstimatedTime } from '@/lib/journey';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface PhaseCardProps {
  phase: PhaseData;
  isExpanded: boolean;
  onToggle: () => void;
  onGuideClick: (guideId: string) => void;
  isCurrentPhase: boolean;
  index?: number; // For stagger animation
  nextRecommendedGuideId?: string | null; // Story 0.10.3
}

// Icon mapping
const PHASE_ICONS = {
  IconBook,
  IconStar,
  IconHeart,
  IconDots,
};

export function PhaseCard({
  phase,
  isExpanded,
  onToggle,
  onGuideClick,
  isCurrentPhase,
  index = 0,
  nextRecommendedGuideId = null,
}: PhaseCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = PHASE_ICONS[phase.icon as keyof typeof PHASE_ICONS] || IconBook;
  const isLocked = phase.status === 'locked';
  const isCompleted = phase.status === 'completed';

  // Animated progress percentage
  const [animatedProgress, setAnimatedProgress] = useState(
    prefersReducedMotion ? phase.progress.percentage : 0
  );

  // Animate progress bar on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(phase.progress.percentage);
      return;
    }

    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1000; // 1 second
      const target = phase.progress.percentage;
      const increment = target / (duration / 16); // 60fps
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedProgress(target);
          clearInterval(interval);
        } else {
          setAnimatedProgress(start);
        }
      }, 16);

      return () => clearInterval(interval);
    }, index * 100 + 300); // Delay based on card index

    return () => clearTimeout(timer);
  }, [phase.progress.percentage, index, prefersReducedMotion]);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={
        prefersReducedMotion || isLocked
          ? undefined
          : { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
      }
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 transition-colors',
        isCurrentPhase && !isLocked
          ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900'
          : 'border-gray-200 dark:border-gray-800',
        isLocked && 'opacity-60'
      )}
    >
      {/* Phase Header */}
      <div className={cn('rounded-t-xl p-6 text-white', phase.gradient)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{phase.title}</h2>
              <p className="text-white/90 text-sm">{phase.description}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            {isCompleted && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <IconCheck className="w-4 h-4" />
                <span className="text-sm font-semibold">הושלם!</span>
              </motion.div>
            )}
            {phase.status === 'in_progress' && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <span className="text-sm font-semibold">בתהליך</span>
              </motion.div>
            )}
            {isLocked && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 1 }}
                animate={prefersReducedMotion ? undefined : { scale: 1 }}
                exit={prefersReducedMotion ? undefined : { scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <IconLock className="w-4 h-4" />
                <span className="text-sm font-semibold">ננעל</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar - Animated */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold">
              {phase.progress.completed} / {phase.progress.total} מדריכים הושלמו
            </span>
            <span className="font-semibold">{Math.round(animatedProgress)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={prefersReducedMotion ? { width: `${phase.progress.percentage}%` } : { width: 0 }}
              animate={{ width: `${animatedProgress}%` }}
              transition={{ duration: prefersReducedMotion ? 0 : 1, ease: 'easeOut' }}
              className="h-full bg-white"
            />
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mt-4 flex items-center gap-2 text-sm text-white/90">
          <IconClock className="w-4 h-4" />
          <span>זמן משוער: {formatEstimatedTime(phase.estimatedMinutes)}</span>
        </div>

        {/* Unlock Message for Locked Phases */}
        {isLocked && phase.unlockMessage && (
          <div className="mt-4 px-4 py-2 bg-white/10 rounded-lg">
            <p className="text-sm text-white/90">{phase.unlockMessage}</p>
          </div>
        )}
      </div>

      {/* Accordion Toggle Button */}
      <button
        onClick={onToggle}
        disabled={isLocked && phase.guides.length === 0}
        className={cn(
          'w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700',
          'flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <span className="font-semibold text-gray-900 dark:text-white">
          {isExpanded ? 'הסתר מדריכים' : 'הצג מדריכים'} ({phase.guides.length})
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <IconChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.div>
      </button>

      {/* Guides List (Accordion Content) - Animated */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-800/30">
              {phase.guides.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  אין מדריכים בקטגוריה זו
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {phase.guides.map((guide, guideIndex) => (
                    <motion.div
                      key={guide.id}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={{ delay: guideIndex * 0.05 }}
                    >
                      <GuideItem
                        guide={guide}
                        onClick={() => onGuideClick(guide.id)}
                        isLocked={isLocked}
                        isNextRecommended={guide.id === nextRecommendedGuideId}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Individual Guide Item within a Phase
 */
interface GuideItemProps {
  guide: {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    icon: string;
    completed: boolean;
    progress: number;
  };
  onClick: () => void;
  isLocked: boolean;
  isNextRecommended?: boolean; // Story 0.10.3
}

function GuideItem({ guide, onClick, isLocked, isNextRecommended = false }: GuideItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      whileHover={
        prefersReducedMotion || isLocked
          ? undefined
          : { scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 1)' }
      }
      transition={{ duration: 0.15 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-lg border p-4 transition-colors relative',
        guide.completed
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
          : isNextRecommended
            ? 'border-2 border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'border-gray-200 dark:border-gray-700',
        isLocked && 'opacity-50',
        !isLocked && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Story 0.10.3: Next Recommended Badge */}
      {isNextRecommended && !isLocked && !guide.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 left-2 z-10"
        >
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-md animate-pulse">
            <IconArrowLeft size={14} />
            המלצה הבאה
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'p-2 rounded-lg flex-shrink-0',
            guide.completed
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          {guide.completed ? (
            <IconCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <IconBook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{guide.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {guide.description}
          </p>

          {/* Progress Bar (if partially read) */}
          {!guide.completed && guide.progress > 0 && (
            <div className="mb-2">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${guide.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{guide.progress}% הושלם</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <IconClock className="w-3.5 h-3.5" />
              <span>{formatEstimatedTime(guide.estimatedMinutes)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) onClick();
          }}
          disabled={isLocked}
          whileHover={prefersReducedMotion || isLocked ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion || isLocked ? undefined : { scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={cn(
            'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors flex-shrink-0',
            guide.completed
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
              : guide.progress > 0
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <span className="text-sm">
            {isLocked ? 'ננעל' : guide.completed ? 'קרא שוב' : guide.progress > 0 ? 'המשך' : 'התחל'}
          </span>
          {!isLocked && <IconArrowLeft className="w-4 h-4" />}
          {isLocked && <IconLock className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

