/**
 * Avatar Selector Component
 * Story 0.3: User Avatar Picture Selection
 * Modal for choosing and customizing user avatar with many options
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  avatarStyles,
  generateAvatarPreviews,
  type AvatarStyle,
  type AvatarConfig
} from '@/lib/avatar';
import { IconCheck, IconX } from '@tabler/icons-react';

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  userId: string;
}

/**
 * Avatar selector modal with scrollable grid of many avatar options
 */
export function AvatarSelector({
  open,
  onClose,
  currentConfig,
  onSave,
}: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(currentConfig.style);
  const [selectedConfig, setSelectedConfig] = useState<AvatarConfig>(currentConfig);

  // Generate 24 preview variations for the selected style
  const avatarPreviews = useMemo(() => {
    return generateAvatarPreviews(selectedStyle, 24);
  }, [selectedStyle]);

  const handleStyleChange = (style: AvatarStyle) => {
    setSelectedStyle(style);
    // Auto-select first preview of new style
    setSelectedConfig({
      style,
      seed: `${style}-preview-0`,
      options: {},
    });
  };

  const handleAvatarSelect = (config: AvatarConfig) => {
    setSelectedConfig(config);
  };

  const handleSave = () => {
    onSave(selectedConfig);
    onClose();
  };

  const handleCancel = () => {
    // Reset to current config on cancel
    setSelectedStyle(currentConfig.style);
    setSelectedConfig(currentConfig);
    onClose();
  };

  const isSelected = (seed: string) => selectedConfig.seed === seed;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            בחר אווטר
          </h2>
          <button
            onClick={handleCancel}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <IconX className="h-5 w-5" />
            <span className="sr-only">סגור</span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Selection Preview */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <UserAvatar config={selectedConfig} size="xl" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              תצוגה מקדימה
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {avatarStyles.find(s => s.value === selectedStyle)?.labelHe}
            </p>
          </div>
        </div>

        {/* Style Tabs */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">סגנון</p>
          <div className="flex gap-2 flex-wrap">
            {avatarStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleStyleChange(style.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStyle === style.value
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {style.labelHe}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Avatar Grid */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            בחר מתוך {avatarPreviews.length} אפשרויות
          </p>
          <div className="overflow-y-auto max-h-[40vh] pr-2">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {avatarPreviews.map((preview, index) => (
                <button
                  key={preview.seed}
                  onClick={() => handleAvatarSelect(preview.config)}
                  className={`relative p-2 border-2 rounded-lg transition-all hover:border-emerald-400 hover:shadow-md ${
                    isSelected(preview.seed)
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  aria-label={`אווטר ${index + 1}`}
                  aria-pressed={isSelected(preview.seed)}
                >
                  <UserAvatar
                    config={preview.config}
                    size="md"
                    className="mx-auto"
                  />
                  {isSelected(preview.seed) && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
                      <IconCheck className="w-3 h-3 text-white" aria-hidden="true" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleCancel}>
            ביטול
          </Button>
          <Button onClick={handleSave} className="min-w-[120px]">
            שמור אווטר
          </Button>
        </div>
      </div>
    </div>
  );
}

