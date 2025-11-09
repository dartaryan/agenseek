/**
 * Journey Hero Component - Story 0.10.1 & 0.10.2
 *
 * Displays overall journey statistics at the top of the journey page:
 * - Large circular progress indicator (animated)
 * - Guides completed count (count-up animation)
 * - Estimated time remaining
 * - Weekly progress (count-up animation)
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatEstimatedTime, type JourneyStats } from '@/lib/journey';
import { IconBook, IconClock, IconTrendingUp } from '@tabler/icons-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface JourneyHeroProps {
  stats: JourneyStats;
}

/**
 * Helper component for animated stat display with count-up effect
 */
function AnimatedStat({ value, label, icon: Icon, colorClass, delay = 0 }: {
  value: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? numericValue : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(numericValue);
      return;
    }

    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1000; // 1 second
      const increment = numericValue / (duration / 16); // 60fps
      const interval = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [numericValue, prefersReducedMotion, delay]);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'string' ? value.replace(/^\d+/, Math.floor(displayValue).toString()) : Math.floor(displayValue)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
}

export function JourneyHero({ stats }: JourneyHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const radius = 54; // Circle radius
  const circumference = 2 * Math.PI * radius;
  const [animatedProgress, setAnimatedProgress] = useState(prefersReducedMotion ? stats.overallPercentage : 0);

  // Animate progress circle
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(stats.overallPercentage);
      return;
    }

    let start = 0;
    const duration = 1500; // 1.5 seconds
    const increment = stats.overallPercentage / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= stats.overallPercentage) {
        setAnimatedProgress(stats.overallPercentage);
        clearInterval(timer);
      } else {
        setAnimatedProgress(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [stats.overallPercentage, prefersReducedMotion]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress Indicator */}
        <div className="relative flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Percentage text (animated) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {Math.round(animatedProgress)}%
              </motion.div>
              <div className="text-xs text-gray-600 dark:text-gray-400">הושלם</div>
            </div>
          </div>
        </div>

        {/* Stats Grid - with staggered animations */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <AnimatedStat
            value={`${stats.completedGuides}/${stats.totalGuides}`}
            label="מדריכים שהושלמו"
            icon={IconBook}
            colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            delay={100}
          />
          <AnimatedStat
            value={formatEstimatedTime(stats.estimatedMinutesRemaining)}
            label="זמן קריאה משוער"
            icon={IconClock}
            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            delay={200}
          />
          <AnimatedStat
            value={stats.weeklyProgress}
            label="התקדמות שבועית"
            icon={IconTrendingUp}
            colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            delay={300}
          />
        </div>
      </div>
    </motion.div>
  );
}

