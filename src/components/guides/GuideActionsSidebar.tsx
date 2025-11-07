/**
 * Guide Actions Sidebar - Story 4.5
 *
 * Right sidebar (left in RTL) with:
 * - Circular progress widget
 * - Mark Complete button
 * - Quick action buttons (bookmark, note, task)
 * - Helpful feedback (thumbs up/down)
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  IconBookmark,
  IconNote,
  IconChecklist,
  IconCheck,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';

interface GuideActionsSidebarProps {
  progress: number; // 0-100
  isCompleted: boolean;
  onMarkComplete: () => void;
  onBookmark?: () => void;
  onAddNote?: () => void;
  onCreateTask?: () => void;
  onFeedback?: (helpful: boolean) => void;
  className?: string;
}

export function GuideActionsSidebar({
  progress,
  isCompleted,
  onMarkComplete,
  onBookmark,
  onAddNote,
  onCreateTask,
  onFeedback,
  className = '',
}: GuideActionsSidebarProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress widget */}
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Circular progress */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 339.292} 339.292`}
                className="text-emerald-500 transition-all duration-300"
              />
            </svg>
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Progress text */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {isCompleted ? 'הושלם!' : 'התקדמות במדריך'}
          </p>
        </div>
      </Card>

      {/* Mark Complete button */}
      <Button
        onClick={onMarkComplete}
        disabled={isCompleted}
        className="w-full"
        size="lg"
        variant={isCompleted ? 'outline' : 'default'}
      >
        <IconCheck className="w-5 h-5 ml-2" />
        {isCompleted ? 'הושלם' : 'סמן כהושלם'}
      </Button>

      {/* Quick actions */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          פעולות מהירות
        </h3>
        <div className="space-y-2">
          <Button
            onClick={onBookmark}
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            <IconBookmark className="w-4 h-4 ml-2" />
            שמור למועדפים
          </Button>
          <Button onClick={onAddNote} variant="ghost" className="w-full justify-start" size="sm">
            <IconNote className="w-4 h-4 ml-2" />
            הוסף הערה
          </Button>
          <Button
            onClick={onCreateTask}
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            <IconChecklist className="w-4 h-4 ml-2" />
            צור משימה
          </Button>
        </div>
      </Card>

      {/* Helpful feedback */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          האם המדריך עזר לך?
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => onFeedback?.(true)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <IconThumbUp className="w-4 h-4 ml-1" />
            כן
          </Button>
          <Button
            onClick={() => onFeedback?.(false)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <IconThumbDown className="w-4 h-4 ml-1" />
            לא
          </Button>
        </div>
      </Card>
    </div>
  );
}

