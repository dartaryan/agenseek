/**
 * Mobile Action Bar Component - Story 10.2
 *
 * Sticky bottom action bar for mobile guide readers
 * Features:
 * - 3 action buttons: Add Note, Create Task, Share
 * - Fixed at bottom with safe area support
 * - 48x48px touch targets
 * Note: Mark Complete button moved to header
 */

import { IconNotes, IconChecklist, IconShare } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileActionBarProps {
  onAddNote: () => void;
  onCreateTask: () => void;
  onShare: () => void;
  className?: string;
}

export function MobileActionBar({
  onAddNote,
  onCreateTask,
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

