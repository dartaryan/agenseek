/**
 * KeyboardShortcut Component - Story 7.5
 *
 * Displays keyboard shortcut badges (e.g., ⌘K, Ctrl+F)
 * Automatically detects Mac vs Windows/Linux
 */

import { cn } from '@/lib/utils';
import { isMac } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutProps {
  keys: string; // e.g., "Ctrl+K", "Alt+1", "/"
  className?: string;
}

/**
 * Formats keyboard shortcut text for display
 * Converts "Ctrl" to "⌘" on Mac
 */
function formatKeys(keys: string): string {
  if (isMac()) {
    return keys
      .replace(/Ctrl/gi, '⌘')
      .replace(/Alt/gi, '⌥')
      .replace(/Shift/gi, '⇧')
      .replace(/Enter/gi, '↵')
      .replace(/Esc/gi, '⎋');
  }
  return keys;
}

/**
 * KeyboardShortcut badge component
 */
export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  const formattedKeys = formatKeys(keys);

  // Split by + to render each key separately
  const keyParts = formattedKeys.split('+');

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {keyParts.map((key, index) => (
        <span key={index} className="inline-flex items-center gap-0.5">
          <kbd
            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded shadow-sm"
            dir="ltr"
          >
            {key}
          </kbd>
          {index < keyParts.length - 1 && (
            <span className="text-gray-400 text-xs">+</span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * Inline keyboard shortcut hint (smaller, subtle)
 */
export function KeyboardShortcutHint({ keys, className }: KeyboardShortcutProps) {
  const formattedKeys = formatKeys(keys);

  return (
    <span
      className={cn(
        'ml-auto text-xs font-mono text-gray-400 tabular-nums',
        className
      )}
      dir="ltr"
    >
      {formattedKeys}
    </span>
  );
}

