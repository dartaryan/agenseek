/**
 * SearchResultsPage Component - Story 7.3
 *
 * Full search results page with filters, sorting, pagination, and grouped results
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  IconSearch,
  IconBook,
  IconNote,
  IconChecklist,
  IconFilter,
  IconSortAscending,
  IconMoodEmpty,
  IconArrowRight,
  IconClock,
  IconAlphabetLatin,
  IconStar,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { highlightMatches } from '@/lib/search';
import type { SearchResult } from '@/lib/search';

// Filter type
type FilterType = 'all' | 'guides' | 'notes' | 'tasks';

// Sort type
type SortType = 'relevance' | 'recent' | 'alphabetical';

// Results per page
const RESULTS_PER_PAGE = 20;

/**
 * SearchResultsPage component
 */
export function SearchResultsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get query from URL
  const urlQuery = searchParams.get('q') || '';

  // Local state
  const [query, setQuery] = useState(urlQuery);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync query with URL
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Use search hook
  const { results, isSearching, setQuery: setSearchQuery } = useSearch({
    userId: user?.id,
    debounceMs: 300,
    autoSearch: true,
  });

  // Set initial query from URL
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery, setSearchQuery]);

  // Flatten and filter results
  const allResults: SearchResult[] = useMemo(() => {
    let filtered: SearchResult[] = [];

    switch (filter) {
      case 'all':
        filtered = [...results.guides, ...results.notes, ...results.tasks];
        break;
      case 'guides':
        filtered = results.guides;
        break;
      case 'notes':
        filtered = results.notes;
        break;
      case 'tasks':
        filtered = results.tasks;
        break;
    }

    return filtered;
  }, [results, filter]);

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...allResults];

    switch (sort) {
      case 'relevance':
        // Already sorted by relevance (score)
        break;
      case 'recent':
        sorted.sort((a, b) => {
          const dateA =
            a.type === 'guide'
              ? 0 // Guides don't have lastUpdated, keep them at end
              : new Date((a.item as any).updated_at || 0).getTime();
          const dateB =
            b.type === 'guide'
              ? 0 // Guides don't have lastUpdated, keep them at end
              : new Date((b.item as any).updated_at || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'alphabetical':
        sorted.sort((a, b) => {
          const titleA =
            a.type === 'guide' ? a.item.title : (a.item as any).title || '';
          const titleB =
            b.type === 'guide' ? b.item.title : (b.item as any).title || '';
          return titleA.localeCompare(titleB, 'he');
        });
        break;
    }

    return sorted;
  }, [allResults, sort]);

  // Paginate results
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    return sortedResults.slice(start, end);
  }, [sortedResults, currentPage]);

  const totalPages = Math.ceil(sortedResults.length / RESULTS_PER_PAGE);

  // Result counts by type
  const resultCounts = useMemo(() => ({
    all: results.guides.length + results.notes.length + results.tasks.length,
    guides: results.guides.length,
    notes: results.notes.length,
    tasks: results.tasks.length,
  }), [results]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setCurrentPage(1); // Reset to first page
    }
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType);
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value as SortType);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header - Story 10.5: Responsive typography */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">חיפוש</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            חפש מדריכים, הערות ומשימות
          </p>
        </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="הקלד לחיפוש..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'מחפש...' : 'חפש'}
          </Button>
        </div>
      </form>

      {/* Results Count */}
      {urlQuery && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isSearching ? (
              'מחפש...'
            ) : sortedResults.length > 0 ? (
              <>
                נמצאו <span className="font-semibold">{sortedResults.length}</span> תוצאות
                עבור "{urlQuery}"
              </>
            ) : (
              <>לא נמצאו תוצאות עבור "{urlQuery}"</>
            )}
          </p>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={handleFilterChange} className="flex-1">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="gap-1">
              <IconFilter className="h-4 w-4" />
              <span>הכל ({resultCounts.all})</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="gap-1">
              <IconBook className="h-4 w-4" />
              <span>מדריכים ({resultCounts.guides})</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1">
              <IconNote className="h-4 w-4" />
              <span>הערות ({resultCounts.notes})</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1">
              <IconChecklist className="h-4 w-4" />
              <span>משימות ({resultCounts.tasks})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sort Dropdown */}
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <IconSortAscending className="h-4 w-4 ml-2" />
            <SelectValue placeholder="מיין לפי" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              <div className="flex items-center gap-2">
                <IconStar className="h-4 w-4" />
                <span>רלוונטיות</span>
              </div>
            </SelectItem>
            <SelectItem value="recent">
              <div className="flex items-center gap-2">
                <IconClock className="h-4 w-4" />
                <span>עדכני</span>
              </div>
            </SelectItem>
            <SelectItem value="alphabetical">
              <div className="flex items-center gap-2">
                <IconAlphabetLatin className="h-4 w-4" />
                <span>אלפביתי</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {urlQuery ? (
        <>
          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">מחפש...</p>
            </div>
          ) : paginatedResults.length > 0 ? (
            <>
              {/* Results List */}
              <div className="space-y-8 mb-8">
                {paginatedResults.map((result, index) => (
                  <div key={`${result.type}-${index}`} className="mb-4">
                    <SearchResultCard
                      result={result}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    הקודם
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    עמוד {currentPage} מתוך {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    הבא
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState query={urlQuery} />
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

/**
 * Search Result Card Component
 */
interface SearchResultCardProps {
  result: SearchResult;
}

function SearchResultCard({ result }: SearchResultCardProps) {
  // Get result details based on type
  const { icon, title, snippet, url, metadata } = useMemo(() => {
    switch (result.type) {
      case 'guide': {
        const guide = result.item;
        return {
          icon: <IconBook className="h-5 w-5 text-emerald-500" />,
          title: guide.title,
          snippet: guide.description || 'אין תיאור זמין',
          url: `/guides/${guide.id}`,
          metadata: [
            guide.category,
            guide.difficulty,
            `${guide.estimatedMinutes} דקות`,
          ].filter(Boolean),
        };
      }
      case 'note': {
        const note = result.item as any;
        return {
          icon: <IconNote className="h-5 w-5 text-blue-500" />,
          title: note.title || 'הערה ללא כותרת',
          snippet: note.content || 'אין תוכן',
          url: `/notes?id=${note.id}`,
          metadata: [
            note.guide_id ? 'מקושר למדריך' : undefined,
            new Date(note.created_at).toLocaleDateString('he-IL'),
          ].filter(Boolean),
        };
      }
      case 'task': {
        const task = result.item as any;
        return {
          icon: <IconChecklist className="h-5 w-5 text-orange-500" />,
          title: task.title || 'משימה ללא כותרת',
          snippet: task.description || 'אין תיאור',
          url: `/tasks?id=${task.id}`,
          metadata: [
            task.status === 'done' ? 'הושלם' : 'בתהליך',
            task.priority === 'high' ? 'עדיפות גבוהה' : undefined,
            new Date(task.created_at).toLocaleDateString('he-IL'),
          ].filter(Boolean),
        };
      }
    }
  }, [result]);

  // Highlight matches in title and snippet
  // Extract match indices for title and content
  const titleMatches = result.matches.find(m => m.key === 'title');
  const contentMatches = result.matches.find(m => m.key === 'description' || m.key === 'content');

  const highlightedTitle = titleMatches
    ? highlightMatches(title, titleMatches.indices)
    : title;
  const highlightedSnippet = contentMatches
    ? highlightMatches(snippet.slice(0, 300), contentMatches.indices)
    : snippet.slice(0, 300);

  return (
    <Link to={url}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">{icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3
                className="text-lg font-semibold mb-1 line-clamp-1"
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />

              {/* Snippet */}
              <p
                className="text-sm text-muted-foreground mb-2 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
              />

              {/* Metadata */}
              {metadata.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {metadata.map((meta, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-muted rounded-md"
                    >
                      {meta}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <IconArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Empty State Component
 */
interface EmptyStateProps {
  query?: string;
}

function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <IconMoodEmpty className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">
        {query ? 'לא נמצאו תוצאות' : 'התחל לחפש'}
      </h3>
      <p className="text-muted-foreground mb-6">
        {query
          ? 'נסה לחפש במילים אחרות או בטרמינולוגיה שונה'
          : 'הקלד משהו בשדה החיפוש למעלה כדי להתחיל'}
      </p>

      {query && (
        <div className="max-w-md mx-auto text-right">
          <h4 className="font-semibold mb-2">הצעות:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• בדוק שאין שגיאות כתיב</li>
            <li>• נסה מילות חיפוש כלליות יותר</li>
            <li>• השתמש במילות מפתח שונות</li>
            <li>• חפש במדריכים פופולריים דרך <Link to="/guides" className="text-emerald-500 hover:underline">ספריית המדריכים</Link></li>
          </ul>
        </div>
      )}

      {!query && (
        <div className="max-w-md mx-auto text-right">
          <h4 className="font-semibold mb-2">תוכל לחפש:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• מדריכים לפי נושא או מיומנות</li>
            <li>• הערות אישיות שיצרת</li>
            <li>• משימות פתוחות או שהושלמו</li>
            <li>• כל תוכן באפליקציה</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;

