/**
 * useKeyboardShortcuts Hook - Story 7.5
 *
 * Global keyboard shortcuts for navigation and actions
 *
 * Shortcuts:
 * - Ctrl+K / Cmd+K: Open command palette (already in layout)
 * - Ctrl+F / Cmd+F: Focus header search
 * - Ctrl+T / Cmd+T: Create new task
 * - Ctrl+N / Cmd+N: Create new note
 * - Alt+1 to Alt+5: Navigate to pages (Dashboard, Guides, Notes, Tasks, Profile)
 * - /: Focus search (like GitHub)
 * - Esc: Close modals (built into Dialog components)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsConfig {
  onOpenTaskModal?: () => void;
  onOpenNoteModal?: () => void;
  onFocusSearch?: () => void;
  onOpenCommandPalette?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea (except for specific shortcuts)
      const isTyping =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLElement && e.target.isContentEditable;

      // Ctrl/Cmd + F: Focus header search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        config.onFocusSearch?.();
        return;
      }

      // Ctrl/Cmd + K: Command palette (handled in Layout, but we can trigger it here too)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        config.onOpenCommandPalette?.();
        return;
      }

      // Alt + T: Create new task (changed from Ctrl+T to avoid browser conflict)
      if (e.altKey && e.key === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        config.onOpenTaskModal?.();
        return;
      }

      // Alt + N: Create new note (changed from Ctrl+N to avoid browser conflict)
      if (e.altKey && e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        config.onOpenNoteModal?.();
        return;
      }

      // Don't handle navigation shortcuts if user is typing (unless it's a special shortcut)
      if (isTyping) return;

      // Alt + 1-5: Navigation shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case '2':
            e.preventDefault();
            navigate('/guides');
            break;
          case '3':
            e.preventDefault();
            navigate('/notes');
            break;
          case '4':
            e.preventDefault();
            navigate('/tasks');
            break;
          case '5':
            e.preventDefault();
            navigate('/profile');
            break;
        }
        return;
      }

      // /: Focus search (like GitHub)
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        config.onFocusSearch?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, config]);
}

/**
 * Detect if user is on Mac
 */
export function isMac(): boolean {
  return navigator.platform.toLowerCase().includes('mac');
}

/**
 * Get keyboard shortcut display text (⌘ for Mac, Ctrl for Windows/Linux)
 */
export function getShortcutText(key: string): string {
  const modifier = isMac() ? '⌘' : 'Ctrl';
  return `${modifier}+${key}`;
}

/**
 * Get all keyboard shortcuts for display in help/tooltips
 */
export interface KeyboardShortcut {
  keys: string;
  description: string;
  category: 'navigation' | 'actions' | 'search';
}

export function getAllKeyboardShortcuts(): KeyboardShortcut[] {
  const modifier = isMac() ? '⌘' : 'Ctrl';

  return [
    // Search shortcuts
    {
      keys: `${modifier}+K`,
      description: 'פתח לוח פקודות',
      category: 'search',
    },
    {
      keys: `${modifier}+F`,
      description: 'התמקד בשדה חיפוש',
      category: 'search',
    },
    {
      keys: '/',
      description: 'התמקד בחיפוש',
      category: 'search',
    },

    // Action shortcuts
    {
      keys: 'Alt+T',
      description: 'צור משימה חדשה',
      category: 'actions',
    },
    {
      keys: 'Alt+N',
      description: 'צור רשומה חדשה',
      category: 'actions',
    },
    {
      keys: 'Esc',
      description: 'סגור חלונות קופצים',
      category: 'actions',
    },

    // Navigation shortcuts
    {
      keys: 'Alt+1',
      description: 'עבור ללוח בקרה',
      category: 'navigation',
    },
    {
      keys: 'Alt+2',
      description: 'עבור למדריכים',
      category: 'navigation',
    },
    {
      keys: 'Alt+3',
      description: 'עבור לרשומות',
      category: 'navigation',
    },
    {
      keys: 'Alt+4',
      description: 'עבור למשימות',
      category: 'navigation',
    },
    {
      keys: 'Alt+5',
      description: 'עבור לפרופיל',
      category: 'navigation',
    },
  ];
}

