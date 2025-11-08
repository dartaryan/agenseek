import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import { DeleteAccountDialog } from '../../components/settings/DeleteAccountDialog';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { UserAvatar } from '../../components/ui/user-avatar';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { AvatarConfig } from '../../lib/avatar';
import { Link } from 'react-router-dom';

/**
 * Settings Page (Protected)
 * Story 2.12: Account deletion feature
 * Story 0.3: User avatar display
 */
export function SettingsPage() {
  const { user, profile } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const he = hebrewLocale.accountDeletion;

  // Load avatar configuration - Story 0.3
  useEffect(() => {
    async function loadAvatar() {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', user.id)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || user.id,
          options: data.avatar_options || {},
        });
      }
    }
    loadAvatar();
  }, [user?.id]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{hebrewLocale.pages.settings.title}</h1>
          <p className="text-gray-600">{hebrewLocale.pages.settings.description}</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Avatar - Story 0.3 */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">פרופיל</h3>
            <div className="flex items-center gap-4">
              <UserAvatar 
                config={avatarConfig} 
                userId={user?.id} 
                size="lg" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.display_name || 'משתמש'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
                <Link 
                  to="/profile" 
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                >
                  ערוך פרופיל ואווטר
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">התראות</h3>
            <p className="text-gray-500">הגדרות התראות יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">מראה</h3>
            <p className="text-gray-500">הגדרות ערכת נושא ותצוגה יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">פרטיות</h3>
            <p className="text-gray-500">בקרות פרטיות יגיעו בקרוב</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">שפה</h3>
            <p className="text-gray-500">תמיכה ב-RTL לעברית ויכולות דו-לשוניות</p>
          </Card>

          {/* Danger Zone - Account Deletion */}
          <Card className="p-6 space-y-3 border-red-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{he.title}</h3>
              <IconAlertTriangle className="w-5 h-5 text-red-500" />
            </div>

            <p className="text-sm text-gray-600">{he.warningDataLoss}</p>

            {/* Delete Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
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
