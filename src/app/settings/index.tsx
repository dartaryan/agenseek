import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import { DeleteAccountDialog } from '../../components/settings/DeleteAccountDialog';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';

/**
 * Settings Page (Protected)
 * Story 2.12: Account deletion feature
 * Story 0.9: Notification settings (simplified)
 */
export function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const he = hebrewLocale.accountDeletion;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{hebrewLocale.pages.settings.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{hebrewLocale.pages.settings.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Story 0.9: Notification Settings (in-app only) */}
          <NotificationSettings />

          {/* Danger Zone - Account Deletion */}
          <Card className="p-6 space-y-3 border-red-200 dark:border-red-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{he.title}</h3>
              <IconAlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>

            <p className="text-sm text-muted-foreground">{he.warningDataLoss}</p>

            {/* Delete Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300"
              >
                <IconTrash className="w-4 h-4 mr-2" />
                {he.deleteAccountButton}
              </Button>
            </div>
          </Card>
        </div>

        {/* Delete Account Dialog */}
        <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      </div>
    </div>
  );
}
