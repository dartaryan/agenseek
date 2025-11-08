/**
 * KeyboardShortcutsModal Component
 *
 * Modal displaying all available keyboard shortcuts, shown on first visit
 * User can also open it manually with ? key or from settings
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getAllKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcut as KeyboardShortcutBadge } from '@/components/ui/KeyboardShortcut';
import {
  IconSearch,
  IconRocket,
  IconArrowRight,
} from '@tabler/icons-react';

const SHORTCUTS_SEEN_KEY = 'agenseek_keyboard_shortcuts_seen';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  const shortcuts = getAllKeyboardShortcuts();

  // Group shortcuts by category
  const searchShortcuts = shortcuts.filter((s) => s.category === 'search');
  const actionShortcuts = shortcuts.filter((s) => s.category === 'actions');
  const navigationShortcuts = shortcuts.filter((s) => s.category === 'navigation');

  const handleClose = () => {
    // Mark as seen
    localStorage.setItem(SHORTCUTS_SEEN_KEY, 'true');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <IconRocket className="h-6 w-6 text-emerald-600" />
            <DialogTitle className="text-2xl">קיצורי מקלדת - עבוד מהר יותר!</DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600 mt-2">
            השתמש בקיצורי מקלדת כדי לנווט ולבצע פעולות במהירות
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Search Shortcuts */}
          <ShortcutSection
            title="חיפוש"
            icon={<IconSearch className="h-5 w-5 text-emerald-600" />}
            shortcuts={searchShortcuts}
          />

          {/* Action Shortcuts */}
          <ShortcutSection
            title="פעולות מהירות"
            icon={<IconRocket className="h-5 w-5 text-blue-600" />}
            shortcuts={actionShortcuts}
          />

          {/* Navigation Shortcuts */}
          <ShortcutSection
            title="ניווט"
            icon={<IconArrowRight className="h-5 w-5 text-purple-600" />}
            shortcuts={navigationShortcuts}
          />

          {/* Pro Tips */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
              <IconRocket className="h-4 w-4" />
              טיפים מקצועיים
            </h4>
            <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
              <li>לחץ <KeyboardShortcutBadge keys="Ctrl+K" className="inline-flex mx-1" /> לפתיחת לוח הפקודות עם כל הפעולות</li>
              <li>השתמש ב-<KeyboardShortcutBadge keys="/" className="inline-flex mx-1" /> לחיפוש מהיר (כמו ב-GitHub)</li>
              <li>לחץ <KeyboardShortcutBadge keys="Esc" className="inline-flex mx-1" /> לסגירת כל החלונות הקופצים</li>
              <li>קיצורי Alt (Alt+1 עד Alt+5) עובדים בכל העמודים</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4 flex-shrink-0">
          <Button onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-700">
            הבנתי, תודה!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Shortcut section component
 */
interface ShortcutSectionProps {
  title: string;
  icon: React.ReactNode;
  shortcuts: KeyboardShortcut[];
}

function ShortcutSection({ title, icon, shortcuts }: ShortcutSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-700">{shortcut.description}</span>
            <KeyboardShortcutBadge keys={shortcut.keys} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook to manage keyboard shortcuts modal visibility
 */
export function useKeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the shortcuts modal before
    const hasSeenShortcuts = localStorage.getItem(SHORTCUTS_SEEN_KEY);

    if (!hasSeenShortcuts) {
      // Show modal after a short delay on first visit
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for ? key to open shortcuts modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ? key (Shift + /)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Check if user is typing in an input
        const isTyping =
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          (e.target instanceof HTMLElement && e.target.isContentEditable);

        if (!isTyping) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}

