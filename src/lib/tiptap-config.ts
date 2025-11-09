/**
 * Tiptap Editor Configuration
 * Story 6.1: Rich text note editor configuration
 */

import type { EditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

export const getTiptapExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm',
      },
    },
    // Note: Link is not part of StarterKit, but we add it separately below
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-emerald-600 hover:text-emerald-700 underline',
    },
  }),
  Placeholder.configure({
    placeholder: 'התחל לכתוב את ההערה שלך כאן...',
  }),
];

export const getTiptapEditorProps = (): EditorOptions['editorProps'] => ({
  attributes: {
    class:
      'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] max-w-none',
  },
});

export const tiptapKeyboardShortcuts = {
  bold: 'Ctrl+B',
  italic: 'Ctrl+I',
  strike: 'Ctrl+Shift+X',
  code: 'Ctrl+E',
  heading1: 'Ctrl+Alt+1',
  heading2: 'Ctrl+Alt+2',
  heading3: 'Ctrl+Alt+3',
  bulletList: 'Ctrl+Shift+8',
  orderedList: 'Ctrl+Shift+7',
  codeBlock: 'Ctrl+Alt+C',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  save: 'Ctrl+S',
};

