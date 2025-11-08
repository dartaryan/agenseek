import { useState } from 'react';
import { IconLanguage, IconX } from '@tabler/icons-react';
import { Button } from '../ui/button';

/**
 * Hebrew Name Suggestion Banner
 * Story X.X - Hebrew Display Name Suggestion
 *
 * Displays a non-intrusive banner at the top of the dashboard suggesting users
 * change their English display name to Hebrew, aligning with the Hebrew-first UX policy.
 */

interface HebrewNameSuggestionBannerProps {
  onAccept: () => void;
  onDismiss: () => void;
}

export function HebrewNameSuggestionBanner({
  onAccept,
  onDismiss,
}: HebrewNameSuggestionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleTemporaryClose = () => {
    setIsVisible(false);
    // Don't call onDismiss - just hide for this session
  };

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconLanguage className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              שמנו לב שהשם שלך באנגלית. האם תרצה לשנות אותו לעברית?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onAccept}
              className="whitespace-nowrap"
            >
              כן, עדכן
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="whitespace-nowrap"
            >
              אל תציג שוב
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTemporaryClose}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <IconX className="w-4 h-4" />
              <span className="sr-only">סגור</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

