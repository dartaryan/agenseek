/**
 * Unmark Complete Confirmation Dialog - Story 5.1.2
 *
 * Confirmation dialog before unmarking guide as complete
 * Warns user that progress will be restored to pre-completion state
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IconRotateClockwise } from '@tabler/icons-react';

interface UnmarkCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  guideTitle: string;
  restoredProgress?: number;
  isLoading?: boolean;
}

export function UnmarkCompleteDialog({
  open,
  onOpenChange,
  onConfirm,
  guideTitle,
  restoredProgress = 0,
  isLoading = false,
}: UnmarkCompleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20">
              <IconRotateClockwise className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>סמן מדריך כלא הושלם?</AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="pt-4">
          האם אתה בטוח שברצונך לסמן את המדריך <strong>"{guideTitle}"</strong> כלא הושלם?
          <br />
          <br />
          התקדמות תשוחזר ל-<strong>{restoredProgress}%</strong> ותוכל להמשיך לקרוא ולעקוב אחר ההתקדמות שלך.
        </AlertDialogDescription>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isLoading}>ביטול</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? 'מסמן...' : 'כן, סמן כלא הושלם'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

