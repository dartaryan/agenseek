/**
 * Story 5.3: Badge Display Component
 * Shows achievement badges in earned (color + glow) or locked (grayscale + lock) state
 */

import { motion } from 'framer-motion';
import { IconLock } from '@tabler/icons-react';
import { BadgeDefinition } from '@/lib/achievements';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: BadgeDefinition;
  earned: boolean;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  showProgress?: boolean;
}

const sizeClasses = {
  small: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    text: 'text-xs',
    lock: 'w-4 h-4',
  },
  medium: {
    container: 'w-20 h-20',
    icon: 'w-10 h-10',
    text: 'text-sm',
    lock: 'w-5 h-5',
  },
  large: {
    container: 'w-32 h-32',
    icon: 'w-16 h-16',
    text: 'text-base',
    lock: 'w-6 h-6',
  },
};

const colorClasses: Record<string, string> = {
  emerald: 'text-emerald-500 shadow-emerald-500/50',
  amber: 'text-amber-600 shadow-amber-600/50',
  slate: 'text-slate-400 shadow-slate-400/50',
  yellow: 'text-yellow-500 shadow-yellow-500/50',
  blue: 'text-blue-500 shadow-blue-500/50',
  orange: 'text-orange-500 shadow-orange-500/50',
  red: 'text-red-500 shadow-red-500/50',
  purple: 'text-purple-500 shadow-purple-500/50',
  indigo: 'text-indigo-500 shadow-indigo-500/50',
  teal: 'text-teal-500 shadow-teal-500/50',
};

export function BadgeDisplay({
  badge,
  earned,
  progress,
  size = 'medium',
  onClick,
  showProgress = true,
}: BadgeDisplayProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[badge.color] || colorClasses.emerald;
  const Icon = badge.icon;

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center gap-2',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Badge Circle */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          'border-2 transition-all duration-300',
          sizeClass.container,
          earned
            ? cn(
                'bg-gradient-to-br from-white to-gray-50',
                'border-current shadow-lg',
                colorClass
              )
            : 'bg-gray-100 border-gray-300 grayscale'
        )}
      >
        {/* Badge Icon */}
        <Icon
          className={cn(
            sizeClass.icon,
            earned ? colorClass.split(' ')[0] : 'text-gray-400'
          )}
        />

        {/* Lock Icon for Locked Badges */}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
            <IconLock className={cn(sizeClass.lock, 'text-gray-600')} />
          </div>
        )}

        {/* Glow Effect for Earned Badges */}
        {earned && (
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              'animate-pulse opacity-75',
              colorClass.split(' ')[1] // Get shadow class
            )}
            style={{
              boxShadow: `0 0 20px currentColor`,
            }}
          />
        )}
      </div>

      {/* Badge Name */}
      <div className="text-center max-w-[100px]">
        <p
          className={cn(
            'font-semibold leading-tight',
            sizeClass.text,
            earned ? 'text-gray-900' : 'text-gray-500'
          )}
        >
          {badge.nameHe}
        </p>

        {/* Progress Indicator */}
        {showProgress && progress && !earned && progress.current > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {progress.current}/{progress.target}
          </p>
        )}

        {showProgress && progress && !earned && progress.percentage > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

