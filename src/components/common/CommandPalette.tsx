/**
 * CommandPalette Component - Story 7.4
 *
 * Power-user command palette (Ctrl+K / Cmd+K) for quick navigation and actions
 *
 * Features:
 * - Opens with Ctrl+K (Cmd+K on Mac)
 * - Quick actions (navigation, theme toggle, etc.)
 * - Search integration (guides, notes, tasks)
 * - Keyboard navigation (arrows, Enter, Esc)
 * - Recent searches from localStorage
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  IconHome,
  IconBook,
  IconNotes,
  IconChecklist,
  IconUser,
  IconSettings,
  IconMoon,
  IconSun,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { highlightMatches, type SearchMatch } from '@/lib/search';

// Helper to extract indices from SearchMatch array for a specific key
const getMatchIndices = (matches: SearchMatch[], key: string): [number, number][] => {
  const match = matches.find((m) => m.key === key);
  return match?.indices || [];
};

// Types for quick actions
interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  action: () => void;
  shortcut?: string;
}

// localStorage key for recent searches
const RECENT_SEARCHES_KEY = 'agenseek_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Helper to detect Mac OS (for shortcut hints)
// Note: Currently not used, but useful for future enhancements
// const isMac = () => {
//   if (typeof navigator === 'undefined') return false;
//   return navigator.platform.toUpperCase().includes('MAC');
// };

// Helper to get/set theme
const getTheme = () => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const setTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

const toggleTheme = () => {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
};

// Helper to get/set recent searches
const getRecentSearches = (): string[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentSearch = (query: string) => {
  if (!query.trim()) return;
  const recent = getRecentSearches();
  // Remove if already exists
  const filtered = recent.filter((s) => s !== query);
  // Add to front
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [theme, setThemeState] = useState(getTheme());
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Search hook with user ID for personalized results
  const {
    results,
    isSearching,
    setQuery: setSearchQuery,
  } = useSearch({
    debounceMs: 200,
    limitPerType: 50,
    userId: user?.id,
    autoSearch: true, // Auto-search as user types
  });

  // Sync query with search hook
  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  // Load recent searches on mount
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Define quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'dashboard',
      label: 'לוח בקרה',
      icon: IconHome,
      keywords: ['dashboard', 'home', 'לוח', 'בקרה'],
      action: () => {
        navigate('/dashboard');
        onOpenChange(false);
      },
    },
    {
      id: 'guides',
      label: 'כל המדריכים',
      icon: IconBook,
      keywords: ['guides', 'library', 'מדריכים', 'ספרייה'],
      action: () => {
        navigate('/guides');
        onOpenChange(false);
      },
    },
    {
      id: 'notes',
      label: 'הרשומות שלי',
      icon: IconNotes,
      keywords: ['notes', 'רשומות'],
      action: () => {
        navigate('/notes');
        onOpenChange(false);
      },
    },
    {
      id: 'tasks',
      label: 'המשימות שלי',
      icon: IconChecklist,
      keywords: ['tasks', 'todos', 'משימות'],
      action: () => {
        navigate('/tasks');
        onOpenChange(false);
      },
    },
    {
      id: 'profile',
      label: 'פרופיל',
      icon: IconUser,
      keywords: ['profile', 'account', 'פרופיל', 'חשבון'],
      action: () => {
        navigate('/profile');
        onOpenChange(false);
      },
    },
    {
      id: 'settings',
      label: 'הגדרות',
      icon: IconSettings,
      keywords: ['settings', 'preferences', 'הגדרות'],
      action: () => {
        navigate('/settings');
        onOpenChange(false);
      },
    },
    {
      id: 'theme',
      label: theme === 'dark' ? 'מצב בהיר' : 'מצב כהה',
      icon: theme === 'dark' ? IconSun : IconMoon,
      keywords: ['theme', 'dark', 'light', 'mode', 'ערכת', 'נושא', 'כהה', 'בהיר'],
      action: () => {
        toggleTheme();
        setThemeState(getTheme());
        // Don't close palette, allow multiple toggles
      },
      shortcut: 'Alt+T',
    },
    {
      id: 'new-note',
      label: 'רשומה חדשה',
      icon: IconPlus,
      keywords: ['new', 'note', 'create', 'חדש', 'רשומה'],
      action: () => {
        navigate('/notes?new=true');
        onOpenChange(false);
      },
      shortcut: 'Alt+N',
    },
    {
      id: 'new-task',
      label: 'משימה חדשה',
      icon: IconPlus,
      keywords: ['new', 'task', 'create', 'חדש', 'משימה'],
      action: () => {
        navigate('/tasks?new=true');
        onOpenChange(false);
      },
      shortcut: 'Alt+T',
    },
  ];

  // Filter quick actions based on query
  const filteredActions = query.trim()
    ? quickActions.filter((action) =>
        action.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      )
    : quickActions;

  // Handle selecting a search result
  const handleSelectResult = useCallback(
    (type: 'guide' | 'note' | 'task', id: string) => {
      addRecentSearch(query);
      onOpenChange(false);

      switch (type) {
        case 'guide':
          navigate(`/guides/${id}`);
          break;
        case 'note':
          navigate(`/notes?id=${id}`);
          break;
        case 'task':
          navigate(`/tasks?id=${id}`);
          break;
      }
    },
    [query, navigate, onOpenChange]
  );

  // Handle selecting a recent search
  const handleSelectRecentSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  // Get search results for display
  const hasSearchResults =
    query.trim().length >= 2 &&
    (results.guides.length > 0 || results.notes.length > 0 || results.tasks.length > 0);

  // Show quick actions only when no query or query is too short
  const showQuickActions = query.trim().length < 2 || filteredActions.length > 0;

  // Show recent searches only when query is empty
  const showRecentSearches = !query.trim() && recentSearches.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="חפש פקודה או תוכן..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          לא נמצאו תוצאות. נסה מילות חיפוש אחרות.
        </CommandEmpty>

        {/* Recent Searches */}
        {showRecentSearches && (
          <>
            <CommandGroup heading="חיפושים אחרונים">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={`recent-${index}`}
                  onSelect={() => handleSelectRecentSearch(search)}
                >
                  <IconSearch className="ml-2 h-4 w-4" />
                  <span>{search}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Quick Actions */}
        {showQuickActions && filteredActions.length > 0 && (
          <>
            <CommandGroup heading="פעולות מהירות">
              {filteredActions.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => action.action()}
                  keywords={action.keywords}
                >
                  <action.icon className="ml-2 h-4 w-4" />
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <span className="mr-auto text-xs text-muted-foreground">
                      {action.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search Results - Guides */}
        {hasSearchResults && results.guides.length > 0 && (
          <>
            {showQuickActions && <CommandSeparator />}
            <CommandGroup heading={`מדריכים (${results.guides.length})`}>
              {results.guides.slice(0, 5).map((result) => (
                <CommandItem
                  key={`guide-${result.item.id}`}
                  onSelect={() => handleSelectResult('guide', result.item.id)}
                >
                  <IconBook className="ml-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(
                          result.item.title,
                          getMatchIndices(result.matches || [], 'title')
                        ),
                      }}
                    />
                    {result.item.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {result.item.description.slice(0, 60)}...
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search Results - Notes */}
        {hasSearchResults && results.notes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`רשומות (${results.notes.length})`}>
              {results.notes.slice(0, 3).map((result) => (
                <CommandItem
                  key={`note-${result.item.id}`}
                  onSelect={() => handleSelectResult('note', result.item.id)}
                >
                  <IconNotes className="ml-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(
                          result.item.title,
                          getMatchIndices(result.matches || [], 'title')
                        ),
                      }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search Results - Tasks */}
        {hasSearchResults && results.tasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`משימות (${results.tasks.length})`}>
              {results.tasks.slice(0, 3).map((result) => (
                <CommandItem
                  key={`task-${result.item.id}`}
                  onSelect={() => handleSelectResult('task', result.item.id)}
                >
                  <IconChecklist className="ml-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(
                          result.item.title,
                          getMatchIndices(result.matches || [], 'title')
                        ),
                      }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Loading state */}
        {isSearching && query.trim().length >= 2 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            מחפש...
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}

