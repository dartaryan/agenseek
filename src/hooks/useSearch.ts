/**
 * useSearch Hook - Story 7.1
 *
 * Custom hook for debounced search across guides, notes, and tasks
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getGuideCatalog } from '@/lib/guide-catalog';
import { getUserNotes } from '@/lib/api/notes';
import { getUserTasks } from '@/lib/api/tasks';
import { searchAll } from '@/lib/search';
import type { SearchResults } from '@/lib/search';
import type { GuideCatalogEntry } from '@/types/guide-catalog';
import type { Database } from '@/types/database';

type UserNote = Database['public']['Tables']['user_notes']['Row'];
type UserTask = Database['public']['Tables']['user_tasks']['Row'];

/**
 * Hook options
 */
export interface UseSearchOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Limit results per type (default: 50) */
  limitPerType?: number;
  /** User ID for fetching notes and tasks (required for personalized search) */
  userId?: string;
  /** Enable/disable auto-search on query change (default: true) */
  autoSearch?: boolean;
}

/**
 * Hook return value
 */
export interface UseSearchReturn {
  /** Current search query */
  query: string;
  /** Set search query (triggers debounced search) */
  setQuery: (query: string) => void;
  /** Search results grouped by type */
  results: SearchResults;
  /** Is search in progress */
  isSearching: boolean;
  /** Search error if any */
  error: Error | null;
  /** Manually trigger search (useful when autoSearch is false) */
  search: (query?: string) => Promise<void>;
  /** Clear search query and results */
  clear: () => void;
}

/**
 * Custom hook for debounced search with Fuse.js
 *
 * @param options - Search options
 * @returns Search state and functions
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 300,
    limitPerType = 50,
    userId,
    autoSearch = true,
  } = options;

  // State
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    guides: [],
    notes: [],
    tasks: [],
    all: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Data sources (memoized)
  const [guides, setGuides] = useState<GuideCatalogEntry[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);

  // Load guides (static data)
  useEffect(() => {
    try {
      const catalog = getGuideCatalog();
      setGuides(catalog);
    } catch (err) {
      console.error('[useSearch] Error loading guides:', err);
      setError(err instanceof Error ? err : new Error('Failed to load guides'));
    }
  }, []);

  // Load user's notes and tasks when userId changes
  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setTasks([]);
      return;
    }

    const loadUserData = async () => {
      try {
        const [userNotes, userTasks] = await Promise.all([
          getUserNotes(userId),
          getUserTasks(userId),
        ]);
        setNotes(userNotes);
        setTasks(userTasks);
      } catch (err) {
        console.error('[useSearch] Error loading user data:', err);
        // Don't set error here, allow search to work with just guides
      }
    };

    loadUserData();
  }, [userId]);

  // Debounce query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults({
          guides: [],
          notes: [],
          tasks: [],
          all: [],
        });
        setIsSearching(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = searchAll(searchQuery, guides, notes, tasks, {
          limitPerType,
        });
        setResults(searchResults);
      } catch (err) {
        console.error('[useSearch] Search error:', err);
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults({
          guides: [],
          notes: [],
          tasks: [],
          all: [],
        });
      } finally {
        setIsSearching(false);
      }
    },
    [guides, notes, tasks, limitPerType]
  );

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch, autoSearch]);

  // Manual search function
  const search = useCallback(
    async (searchQuery?: string) => {
      const queryToSearch = searchQuery !== undefined ? searchQuery : query;
      await performSearch(queryToSearch);
    },
    [query, performSearch]
  );

  // Clear function
  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults({
      guides: [],
      notes: [],
      tasks: [],
      all: [],
    });
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    search,
    clear,
  };
}

/**
 * Hook for searching only guides (no user data required)
 */
export function useGuideSearch(options: Omit<UseSearchOptions, 'userId'> = {}) {
  const { debounceMs = 300, autoSearch = true } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResults['guides']>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load guides
  const guides = useMemo(() => {
    try {
      return getGuideCatalog();
    } catch (err) {
      console.error('[useGuideSearch] Error loading guides:', err);
      setError(err instanceof Error ? err : new Error('Failed to load guides'));
      return [];
    }
  }, []);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = searchAll(searchQuery, guides, [], [], {
          limitPerType: 50,
        });
        setResults(searchResults.guides);
      } catch (err) {
        console.error('[useGuideSearch] Search error:', err);
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [guides]
  );

  // Auto-search
  useEffect(() => {
    if (autoSearch) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch, autoSearch]);

  // Manual search
  const search = useCallback(
    async (searchQuery?: string) => {
      const queryToSearch = searchQuery !== undefined ? searchQuery : query;
      await performSearch(queryToSearch);
    },
    [query, performSearch]
  );

  // Clear
  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    search,
    clear,
  };
}

