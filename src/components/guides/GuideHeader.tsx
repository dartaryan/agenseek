/**
 * Guide Header Component - Story 4.5
 *
 * Guide header with:
 * - Title
 * - Metadata (difficulty, time, views)
 * - Progress bar
 * - Action bar (add note, create task, bookmark, copy link)
 */

import { Button } from '@/components/ui/button';
import {
  IconClock,
  IconEye,
  IconNote,
  IconChecklist,
  IconBookmark,
  IconBookmarkFilled,
  IconLink,
  IconFlame,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import type { GuideDifficulty } from '@/types/guide-catalog';

interface GuideHeaderProps {
  title: string;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  views?: number;
  progress: number; // 0-100
  onAddNote?: () => void;
  onCreateTask?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean; // Story 11.9: Show bookmark state
  onCopyLink?: () => void;
  className?: string;
}

const difficultyIcons = {
  beginner: IconStarFilled,
  intermediate: IconStar,
  advanced: IconFlame,
};

const difficultyColors = {
  beginner: 'text-green-600 dark:text-green-400',
  intermediate: 'text-yellow-600 dark:text-yellow-400',
  advanced: 'text-red-600 dark:text-red-400',
};

const difficultyLabels = {
  beginner: 'מתחילים',
  intermediate: 'בינוני',
  advanced: 'מתקדם',
};

export function GuideHeader({
  title,
  difficulty,
  estimatedMinutes,
  views = 0,
  progress,
  onAddNote,
  onCreateTask,
  onBookmark,
  isBookmarked = false,
  onCopyLink,
  className = '',
}: GuideHeaderProps) {
  const DifficultyIcon = difficultyIcons[difficulty];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
        {title}
      </h1>

      {/* Metadata badges */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Difficulty */}
        <div className={`flex items-center gap-1.5 ${difficultyColors[difficulty]}`}>
          <DifficultyIcon className="w-4 h-4" />
          <span className="font-medium">{difficultyLabels[difficulty]}</span>
        </div>

        {/* Estimated time */}
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <IconClock className="w-4 h-4" />
          <span>{estimatedMinutes} דקות קריאה</span>
        </div>

        {/* Views (if available) */}
        {views > 0 && (
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <IconEye className="w-4 h-4" />
            <span>{views.toLocaleString('he-IL')} צפיות</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">התקדמות</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action bar - Mobile only */}
      <div className="flex md:hidden flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onAddNote} variant="outline" size="sm">
          <IconNote className="w-4 h-4 ml-1" />
          הוסף הערה
        </Button>
        <Button onClick={onCreateTask} variant="outline" size="sm">
          <IconChecklist className="w-4 h-4 ml-1" />
          צור משימה
        </Button>
        <Button onClick={onBookmark} variant={isBookmarked ? 'default' : 'outline'} size="sm">
          {isBookmarked ? (
            <IconBookmarkFilled className="w-4 h-4 ml-1" />
          ) : (
            <IconBookmark className="w-4 h-4 ml-1" />
          )}
          {isBookmarked ? 'נשמר' : 'שמור'}
        </Button>
        <Button onClick={onCopyLink} variant="outline" size="sm">
          <IconLink className="w-4 h-4 ml-1" />
          העתק קישור
        </Button>
      </div>
    </div>
  );
}
