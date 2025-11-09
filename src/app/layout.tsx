import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, type HeaderRef } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { SidebarProvider } from '../contexts/SidebarContext';
import { PreferencesProvider } from '../contexts/PreferencesContext';
import { CommandPalette } from '../components/common/CommandPalette';
import { TaskModal } from '../components/tasks/TaskModal';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { KeyboardShortcutsModal, useKeyboardShortcutsModal } from '../components/common/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { Database } from '../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];
type UserNote = Database['public']['Tables']['user_notes']['Row'];

/**
 * Layout Component
 *
 * Main layout wrapper for protected pages.
 * Combines Header, Sidebar, content area (Outlet), and Footer.
 *
 * Layout Structure:
 * - Sticky header at top
 * - Sidebar on left (collapsible on mobile)
 * - Main content area in center (via Outlet)
 * - Footer at bottom
 *
 * Story 6.12: Wrapped in SidebarProvider for collapsible sidebar state management
 * Story 7.4: Added CommandPalette with Ctrl+K keyboard shortcut
 * Story 7.5: Integrated global keyboard shortcuts (Ctrl+F, Alt+T, Alt+N, Alt+1-5, /, ?)
 *            Also includes first-time keyboard shortcuts help modal
 */
export function Layout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const headerRef = useRef<HeaderRef>(null);

  // Story 7.5: Keyboard shortcuts help modal (shows on first visit, or with ? key)
  const { isOpen: shortcutsModalOpen, setIsOpen: setShortcutsModalOpen } = useKeyboardShortcutsModal();

  // Story 7.5: Global keyboard shortcuts
  useKeyboardShortcuts({
    onOpenCommandPalette: () => setCommandPaletteOpen((open) => !open),
    onOpenTaskModal: () => setTaskModalOpen(true),
    onOpenNoteModal: () => setNoteModalOpen(true),
    onFocusSearch: () => headerRef.current?.focusSearch(),
  });

  // Handler for task modal save
  const handleTaskSaved = (task: UserTask) => {
    console.log('Task saved:', task);
    setTaskModalOpen(false);
    // Optionally: Navigate to tasks page or show toast
  };

  // Handler for note modal save
  const handleNoteSaved = (note: UserNote) => {
    console.log('Note saved:', note);
    setNoteModalOpen(false);
    // Optionally: Navigate to notes page or show toast
  };

  return (
    <PreferencesProvider>
      <SidebarProvider>
        <div className="relative flex min-h-screen flex-col">
        {/* Story 10.3: Skip to Main Content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          דלג לתוכן הראשי
        </a>

        {/* Story 6.15: Animated background shapes for main app */}
        <AnimatedBackground variant="app" />

        {/* Story 7.4: Command Palette (Ctrl+K) */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
        />

        {/* Story 7.5: Global Task Modal (Ctrl+T) */}
        <TaskModal
          open={taskModalOpen}
          onOpenChange={setTaskModalOpen}
          onSaved={handleTaskSaved}
        />

        {/* Story 7.5: Global Note Modal (Alt+N) */}
        <NoteEditorModal
          open={noteModalOpen}
          onOpenChange={setNoteModalOpen}
          onSaved={handleNoteSaved}
        />

        {/* Story 7.5: Keyboard Shortcuts Help Modal (shows on first visit or with ? key) */}
        <KeyboardShortcutsModal
          open={shortcutsModalOpen}
          onOpenChange={setShortcutsModalOpen}
        />

        {/* Header */}
        <Header ref={headerRef} />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content - Story 10.3: Added id and aria-label for accessibility */}
          <main
            id="main-content"
            className="flex-1 flex flex-col transition-all duration-[250ms] ease-in-out"
            aria-label="תוכן ראשי"
          >
            <div className="flex-1">
              <Outlet />
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </div>
      </div>
      </SidebarProvider>
    </PreferencesProvider>
  );
}
