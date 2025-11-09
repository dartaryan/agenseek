/**
 * Connecting Line Component - Story 0.10.2
 *
 * Visual line connecting phase cards with dynamic styling based on phase status
 */

import { motion } from 'framer-motion';
import { IconLock } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ConnectingLineProps {
  previousPhaseCompleted: boolean;
  nextPhaseStatus: 'completed' | 'in_progress' | 'locked';
  isCurrentConnection: boolean;
  index: number;
}

export function ConnectingLine({
  previousPhaseCompleted,
  nextPhaseStatus,
  isCurrentConnection,
  index,
}: ConnectingLineProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLocked = nextPhaseStatus === 'locked';

  return (
    <div className="flex justify-center my-4 relative">
      {/* SVG Line */}
      <svg className="w-2 h-12" style={{ overflow: 'visible' }}>
        <motion.line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={previousPhaseCompleted ? '0' : '8 8'}
          initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
          animate={prefersReducedMotion ? undefined : { pathLength: 1 }}
          transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
          className={cn(
            'transition-colors',
            previousPhaseCompleted
              ? 'text-emerald-500'
              : 'text-gray-300 dark:text-gray-700',
            isCurrentConnection && 'animate-pulse'
          )}
        />
      </svg>

      {/* Lock Icon for Locked Phases */}
      {isLocked && (
        <motion.div
          initial={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.5, type: 'spring', stiffness: 200 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 border-2 border-gray-300 dark:border-gray-700"
        >
          <IconLock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        </motion.div>
      )}

      {/* Current Phase Indicator */}
      {isCurrentConnection && !isLocked && (
        <motion.div
          initial={prefersReducedMotion ? undefined : { scale: 0 }}
          animate={prefersReducedMotion ? undefined : { scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </motion.div>
      )}
    </div>
  );
}

