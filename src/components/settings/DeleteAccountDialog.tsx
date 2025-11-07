/**
 * Delete Account Confirmation Dialog
 * Story 2.12: Account deletion with confirmation input
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { hebrewLocale } from '../../lib/locale/he';
import { deleteAccount } from '../../lib/api/deleteAccount';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Delete Account Confirmation Dialog
 * Requires user to type "מחק" or "DELETE" to confirm
 */
export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const he = hebrewLocale.accountDeletion;

  // Check if confirmation text is valid (Hebrew or English)
  const isConfirmationValid =
    confirmText.trim().toLowerCase() === he.confirmTextHebrew.toLowerCase() ||
    confirmText.trim().toLowerCase() === he.confirmTextEnglish.toLowerCase();

  const handleDelete = async () => {
    if (!isConfirmationValid) {
      toast({
        title: 'שגיאת אימות',
        description: "אנא הקלד 'מחק' או 'DELETE' כדי לאשר",
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (result.success) {
        // Show success message
        toast({
          title: he.deleteSuccessMessage,
          description: 'נתנתק אותך עכשיו.',
          variant: 'default',
        });

        // Close dialog
        onOpenChange(false);

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 1500);
      } else {
        toast({
          title: he.deleteErrorMessage,
          description: result.error || 'אנא נסה שוב מאוחר יותר',
          variant: 'destructive',
        });
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('[DeleteAccountDialog] Error:', error);
      toast({
        title: he.deleteErrorMessage,
        description: error instanceof Error ? error.message : 'אנא נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IconAlertTriangle className="w-5 h-5 text-red-600" />
            {he.confirmDialogTitle}
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-700">
            {he.confirmDialogWarning}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              {he.confirmInputLabel}
            </Label>
            <Input
              id="confirm-delete"
              type="text"
              placeholder={he.confirmInputPlaceholder}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting}
              className={
                confirmText && !isConfirmationValid
                  ? 'border-red-300 focus:border-red-500 bg-white'
                  : 'bg-white'
              }
              autoComplete="off"
            />
            {confirmText && !isConfirmationValid && (
              <p className="text-xs text-red-600">
                הקלד 'מחק' (בעברית) או 'DELETE' (באנגלית) כדי לאשר
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setConfirmText('');
              onOpenChange(false);
            }}
            disabled={isDeleting}
            className="bg-white"
          >
            {hebrewLocale.actions.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? he.deleteAccountLoading : he.confirmDeleteButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
