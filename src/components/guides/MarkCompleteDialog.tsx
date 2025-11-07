/**
 * Mark Complete Confirmation Dialog - Story 4.7
 *
 * Simple confirmation dialog before marking guide as complete
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
import { IconCheck } from '@tabler/icons-react';

interface MarkCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  guideTitle: string;
  isLoading?: boolean;
}

export function MarkCompleteDialog({
  open,
  onOpenChange,
  onConfirm,
  guideTitle,
  isLoading = false,
}: MarkCompleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <IconCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>סמן מדריך כהושלם?</AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="pt-4">
          האם אתה בטוח שברצונך לסמן את המדריך <strong>"{guideTitle}"</strong> כהושלם?
          <br />
          <br />
          פעולה זו תעדכן את ההתקדמות שלך ל-100% ותסמן את המדריך כהושלם.
        </AlertDialogDescription>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isLoading}>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? 'מסמן...' : 'כן, סמן כהושלם'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

