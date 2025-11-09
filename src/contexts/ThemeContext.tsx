/**
 * Theme Context - Story 0.6: Dark Mode Full Implementation
 *
 * Provides theme state management across the application with:
 * - Light/Dark/System theme modes
 * - localStorage persistence
 * - System preference detection
 * - No flash of wrong theme on page load
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'agenseek-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load theme from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored;
        }
      } catch (e) {
        console.error('[ThemeProvider] Failed to load theme from localStorage:', e);
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Resolve theme based on preference and system settings
  useEffect(() => {
    let resolved: ResolvedTheme = 'light';

    if (theme === 'system') {
      // Check system preference
      if (typeof window !== 'undefined') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
    } else {
      resolved = theme as ResolvedTheme;
    }

    setResolvedTheme(resolved);

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Also set data attribute for additional flexibility
    root.setAttribute('data-theme', resolved);
  }, [theme]);

  // Listen for system theme changes when using 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolved);
      root.setAttribute('data-theme', newResolved);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    } catch (e) {
      console.error('[ThemeProvider] Failed to save theme to localStorage:', e);
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

