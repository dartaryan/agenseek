import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UserAvatar } from '../ui/user-avatar';
import { supabase } from '../../lib/supabase';
import { hasHebrewCharacters } from '../../lib/utils/detectLanguage';
import type { AvatarConfig } from '../../lib/avatar';

/**
 * Edit Display Name Modal
 * Story X.X - Hebrew Display Name Suggestion
 *
 * Modal for editing user display name with Hebrew validation.
 * Ensures new names contain Hebrew characters to align with Hebrew-first UX policy.
 */

interface EditDisplayNameModalProps {
  currentName: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
}

export function EditDisplayNameModal({
  currentName,
  userId,
  isOpen,
  onClose,
  onSave,
}: EditDisplayNameModalProps) {
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Load avatar configuration
  useEffect(() => {
    async function loadAvatar() {
      if (!userId) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', userId)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || userId,
          options: data.avatar_options || {},
        });
      }
    }
    loadAvatar();
  }, [userId]);

  const handleSave = async () => {
    setError('');

    // Validation
    if (!newName.trim()) {
      setError('אנא הזן שם');
      return;
    }

    if (!hasHebrewCharacters(newName)) {
      setError('השם חייב להכיל תווים בעברית');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(newName.trim());
      setNewName(''); // Reset form
      onClose();
    } catch (err) {
      setError('שגיאה בשמירת השם. אנא נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNewName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <UserAvatar config={avatarConfig} userId={userId} size="sm" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              עדכון שם תצוגה
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <IconX className="w-5 h-5" />
            <span className="sr-only">סגור</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Name (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם נוכחי
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400">
              {currentName}
            </div>
          </div>

          {/* New Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם חדש בעברית
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="למשל: יוסי כהן"
              className="w-full"
              autoFocus
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSaving) {
                  handleSave();
                }
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              הזן את שמך בעברית
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={handleClose} disabled={isSaving}>
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'שומר...' : 'שמור'}
          </Button>
        </div>
      </div>
    </div>
  );
}

