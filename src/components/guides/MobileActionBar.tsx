/**
 * Mobile Action Bar Component - Story 10.2
 *
 * Sticky bottom action bar for mobile guide readers
 * Features:
 * - 4 action buttons: Add Note, Create Task, Mark Complete, Share
 * - Fixed at bottom with safe area support
 * - 48x48px touch targets
 * - Active/completed states
 */

import { IconNotes, IconChecklist, IconCheck, IconShare } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileActionBarProps {
  isCompleted: boolean;
  onAddNote: () => void;
  onCreateTask: () => void;
  onMarkComplete: () => void;
  onShare: () => void;
  className?: string;
}

export function MobileActionBar({
  isCompleted,
  onAddNote,
  onCreateTask,
  onMarkComplete,
  onShare,
  className,
}: MobileActionBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 md:hidden',
        'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
        'shadow-lg',
        'safe-area-inset-bottom', // iOS safe area
        className
      )}
    >
      <div className="flex items-center justify-around px-4 py-2 max-w-screen-sm mx-auto">
        {/* Add Note */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddNote}
          className="h-12 w-12 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          aria-label="הוספת הערה"
        >
          <IconNotes className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </Button>

        {/* Create Task */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateTask}
          className="h-12 w-12 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          aria-label="יצירת משימה"
        >
          <IconChecklist className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </Button>

        {/* Mark Complete */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMarkComplete}
          className={cn(
            'h-12 w-12 rounded-full',
            isCompleted
              ? 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
              : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
          )}
          aria-label={isCompleted ? 'ביטול סימון כהושלם' : 'סימון כהושלם'}
        >
          <IconCheck
            className={cn(
              'w-6 h-6',
              isCompleted
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-emerald-600 dark:text-emerald-400'
            )}
          />
        </Button>

        {/* Share */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="h-12 w-12 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          aria-label="שיתוף"
        >
          <IconShare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </Button>
      </div>
    </div>
  );
}

