import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'agenseek_sidebar_collapsed';

interface SidebarProviderProps {
  children: ReactNode;
}

/**
 * SidebarProvider Component
 *
 * Provides global sidebar state management with localStorage persistence.
 * Manages collapsed/expanded state and provides toggle functions.
 *
 * Features:
 * - Persistent state (localStorage)
 * - Toggle, collapse, expand functions
 * - No FOUC (Flash of Unstyled Content)
 */
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage on init to prevent FOUC
    if (typeof window === 'undefined') return false;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'true';
    } catch (error) {
      console.error('Failed to load sidebar state from localStorage:', error);
      return false;
    }
  });

  useEffect(() => {
    // Save to localStorage on change
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch (error) {
      console.error('Failed to save sidebar state to localStorage:', error);
    }
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed((prev) => !prev);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, collapse, expand }}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * useSidebar Hook
 *
 * Access sidebar state and control functions from any component.
 * Must be used within SidebarProvider.
 *
 * @returns {SidebarContextType} Sidebar state and control functions
 * @throws {Error} If used outside SidebarProvider
 */
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

