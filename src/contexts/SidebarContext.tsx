import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface SidebarContextType {
  isCollapsed: boolean;
  isManuallyControlled: boolean;
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
 * Provides global sidebar state management with localStorage persistence
 * and context-aware auto-collapse behavior.
 *
 * Features:
 * - Persistent state (localStorage)
 * - Toggle, collapse, expand functions
 * - No FOUC (Flash of Unstyled Content)
 * - Story 6.14: Auto-collapse on scroll down, auto-expand on scroll up
 * - Manual control overrides auto-collapse
 * - Disabled in guide reading mode and mobile
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

  const [isManuallyControlled, setIsManuallyControlled] = useState(false);
  const location = useLocation();
  const scrollDirection = useScrollDirection({ threshold: 50 });

  // Determine if we're in guide reading mode (no sidebar exists)
  const isGuideReading = location.pathname.startsWith('/guides/') &&
                         location.pathname !== '/guides';

  // Determine if we're on mobile (check window width)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse on scroll down, expand on scroll up
  useEffect(() => {
    // Don't auto-collapse if:
    // 1. User manually controlled
    // 2. In guide reading mode (no sidebar)
    // 3. On mobile
    if (isManuallyControlled || isGuideReading || isMobile) return;

    const handleAutoCollapse = () => {
      const scrollY = window.scrollY;

      if (scrollDirection === 'down' && scrollY > 100) {
        // Auto-collapse when scrolling down past 100px
        setIsCollapsed(true);
      } else if (scrollDirection === 'up' && scrollY > 0) {
        // Auto-expand when scrolling up
        setIsCollapsed(false);
      }
    };

    handleAutoCollapse();
  }, [scrollDirection, isManuallyControlled, isGuideReading, isMobile]);

  useEffect(() => {
    // Save to localStorage on change
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch (error) {
      console.error('Failed to save sidebar state to localStorage:', error);
    }
  }, [isCollapsed]);

  const toggle = () => {
    setIsCollapsed((prev) => !prev);
    setIsManuallyControlled(true); // Mark as manually controlled
  };

  const collapse = () => {
    setIsCollapsed(true);
    setIsManuallyControlled(true);
  };

  const expand = () => {
    setIsCollapsed(false);
    setIsManuallyControlled(false); // Re-enable auto-collapse when manually expanding
  };

  // Reset manual control when changing pages
  useEffect(() => {
    setIsManuallyControlled(false);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isManuallyControlled, toggle, collapse, expand }}
    >
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

