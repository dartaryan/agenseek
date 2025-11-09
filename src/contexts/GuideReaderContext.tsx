/**
 * Guide Reader Context
 *
 * Provides guide reading state to header and other components
 * - isCompleted: Whether current guide is marked as complete
 * - onMarkComplete: Handler to mark guide as complete
 * - onUnmarkComplete: Handler to unmark guide as complete
 * - onAddNote: Handler to add a note
 * - onCreateTask: Handler to create a task
 * - onShare: Handler to share the guide
 */

import { createContext, useContext, useState, useRef, useMemo, useCallback, type ReactNode } from 'react';

interface GuideReaderContextValue {
  isCompleted: boolean;
  onMarkComplete: (() => void) | null;
  onUnmarkComplete: (() => void) | null;
  onAddNote: (() => void) | null;
  onCreateTask: (() => void) | null;
  onShare: (() => void) | null;
  setGuideState: (state: {
    isCompleted: boolean;
    onMarkComplete: () => void;
    onUnmarkComplete: () => void;
    onAddNote: () => void;
    onCreateTask: () => void;
    onShare: () => void;
  }) => void;
  clearGuideState: () => void;
}

const GuideReaderContext = createContext<GuideReaderContextValue | undefined>(undefined);

export function GuideReaderProvider({ children }: { children: ReactNode }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasGuide, setHasGuide] = useState(false); // Track if guide is active

  // Use refs to store functions to avoid re-render loops
  const onMarkCompleteRef = useRef<(() => void) | null>(null);
  const onUnmarkCompleteRef = useRef<(() => void) | null>(null);
  const onAddNoteRef = useRef<(() => void) | null>(null);
  const onCreateTaskRef = useRef<(() => void) | null>(null);
  const onShareRef = useRef<(() => void) | null>(null);

  const setGuideState = useCallback((state: {
    isCompleted: boolean;
    onMarkComplete: () => void;
    onUnmarkComplete: () => void;
    onAddNote: () => void;
    onCreateTask: () => void;
    onShare: () => void;
  }) => {
    setIsCompleted(state.isCompleted);
    setHasGuide(true);
    onMarkCompleteRef.current = state.onMarkComplete;
    onUnmarkCompleteRef.current = state.onUnmarkComplete;
    onAddNoteRef.current = state.onAddNote;
    onCreateTaskRef.current = state.onCreateTask;
    onShareRef.current = state.onShare;
  }, []);

  const clearGuideState = useCallback(() => {
    setIsCompleted(false);
    setHasGuide(false);
    onMarkCompleteRef.current = null;
    onUnmarkCompleteRef.current = null;
    onAddNoteRef.current = null;
    onCreateTaskRef.current = null;
    onShareRef.current = null;
  }, []);

  // Create stable wrapper functions that call the latest refs
  const onMarkComplete = useCallback(() => {
    if (onMarkCompleteRef.current) {
      onMarkCompleteRef.current();
    }
  }, []);

  const onUnmarkComplete = useCallback(() => {
    if (onUnmarkCompleteRef.current) {
      onUnmarkCompleteRef.current();
    }
  }, []);

  const onAddNote = useCallback(() => {
    if (onAddNoteRef.current) {
      onAddNoteRef.current();
    }
  }, []);

  const onCreateTask = useCallback(() => {
    if (onCreateTaskRef.current) {
      onCreateTaskRef.current();
    }
  }, []);

  const onShare = useCallback(() => {
    if (onShareRef.current) {
      onShareRef.current();
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isCompleted,
    onMarkComplete: hasGuide ? onMarkComplete : null,
    onUnmarkComplete: hasGuide ? onUnmarkComplete : null,
    onAddNote: hasGuide ? onAddNote : null,
    onCreateTask: hasGuide ? onCreateTask : null,
    onShare: hasGuide ? onShare : null,
    setGuideState,
    clearGuideState,
  }), [isCompleted, hasGuide, onMarkComplete, onUnmarkComplete, onAddNote, onCreateTask, onShare, setGuideState, clearGuideState]);

  return (
    <GuideReaderContext.Provider value={value}>
      {children}
    </GuideReaderContext.Provider>
  );
}

export function useGuideReader() {
  const context = useContext(GuideReaderContext);
  if (context === undefined) {
    throw new Error('useGuideReader must be used within GuideReaderProvider');
  }
  return context;
}

