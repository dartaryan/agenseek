/**
 * SearchBar Component - Story 7.2
 *
 * Header search bar with dropdown results, keyboard navigation, and match highlighting
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconBook,
  IconNote,
  IconChecklist,
  IconArrowRight
} from '@tabler/icons-react';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { highlightMatches } from '@/lib/search';
import type { SearchResult } from '@/lib/search';

/**
 * SearchBar component with dropdown results
 */
export function SearchBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use search hook with user ID for personalized results
  const { query, setQuery, results, isSearching, error } = useSearch({
    userId: user?.id,
    debounceMs: 300,
    limitPerType: 5, // Top 5 per type as per AC
    autoSearch: true,
  });

  // Calculate total results count
  const totalResults = results.guides.length + results.notes.length + results.tasks.length;

  // Debug logging
  useEffect(() => {
    if (query) {
      console.log('🔍 Search Query:', query);
      console.log('📊 Results:', {
        guides: results.guides.length,
        notes: results.notes.length,
        tasks: results.tasks.length
      });
      console.log('⏳ Is Searching:', isSearching);
      if (error) console.error('❌ Search Error:', error);
    }
  }, [query, results, isSearching, error]);

  // Flatten results for keyboard navigation
  const flatResults: SearchResult[] = [
    ...results.guides,
    ...results.notes,
    ...results.tasks,
  ];

  // Show dropdown when query is not empty and has results
  useEffect(() => {
    setShowDropdown(query.length > 0 && totalResults > 0);
    setSelectedIndex(-1); // Reset selection when results change
  }, [query, totalResults]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || flatResults.length === 0) {
      if (e.key === 'Escape') {
        setQuery('');
        setShowDropdown(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
          navigateToResult(flatResults[selectedIndex]);
        } else if (totalResults > 5) {
          navigateToSearchResults();
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Navigate to a specific search result
  const navigateToResult = (result: SearchResult) => {
    switch (result.type) {
      case 'guide':
        navigate(`/guides/${result.item.id}`);
        break;
      case 'note':
        navigate(`/notes/${result.item.id}`);
        break;
      case 'task':
        navigate(`/tasks?id=${result.item.id}`);
        break;
    }
    setShowDropdown(false);
    setQuery('');
  };

  // Navigate to full search results page
  const navigateToSearchResults = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowDropdown(false);
    setQuery('');
  };

  // Get highlighted title for a result
  const getHighlightedTitle = (result: SearchResult): string => {
    const titleMatch = result.matches?.find((m) => m.key === 'title');
    if (titleMatch && titleMatch.indices.length > 0) {
      return highlightMatches(result.item.title, titleMatch.indices);
    }
    return result.item.title;
  };

  // Get snippet for a result (2 lines max)
  const getSnippet = (result: SearchResult): string => {
    // Try to find description or content match
    const descMatch = result.matches?.find(
      (m) => m.key === 'description' || m.key === 'contentText'
    );

    if (descMatch && descMatch.indices.length > 0) {
      let text = '';

      if (result.type === 'guide') {
        text = result.item.description;
      } else if (result.type === 'note') {
        text = result.item.contentText || '';
      } else if (result.type === 'task') {
        text = result.item.description || '';
      }

      // Create snippet with match highlighted
      const snippet = highlightMatches(text, descMatch.indices);
      // Truncate to ~100 chars
      if (snippet.length > 100) {
        return snippet.substring(0, 100) + '...';
      }
      return snippet;
    }

    // Fallback to plain description/content (truncated)
    if (result.type === 'guide') {
      return result.item.description.substring(0, 100) + '...';
    } else if (result.type === 'note') {
      const text = result.item.contentText || '';
      return text ? text.substring(0, 100) + '...' : 'ללא תוכן';
    } else if (result.type === 'task') {
      return result.item.description
        ? result.item.description.substring(0, 100) + '...'
        : 'ללא תיאור';
    }

    return '';
  };

  // Get metadata badge for result
  const getMetadataBadge = (result: SearchResult): string => {
    if (result.type === 'guide') {
      return result.item.category;
    } else if (result.type === 'note') {
      return result.item.tags && result.item.tags.length > 0
        ? result.item.tags.join(', ')
        : 'הערה';
    } else if (result.type === 'task') {
      return result.item.status === 'done'
        ? 'הושלם'
        : result.item.status === 'in_progress'
        ? 'בביצוע'
        : 'לביצוע';
    }
    return '';
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="חפש מדריכים, הערות, משימות..."
          className="w-full px-4 py-2 pl-10 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-[500px] overflow-y-auto z-50">
          {isSearching ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              מחפש...
            </div>
          ) : (
            <>
              {/* Guides Section */}
              {results.guides.length > 0 && (
                <SearchResultSection
                  title="מדריכים"
                  icon={<IconBook className="h-5 w-5 text-emerald-600" />}
                  results={results.guides}
                  selectedIndex={selectedIndex}
                  startIndex={0}
                  onSelect={navigateToResult}
                  getHighlightedTitle={getHighlightedTitle}
                  getSnippet={getSnippet}
                  getMetadataBadge={getMetadataBadge}
                />
              )}

              {/* Notes Section */}
              {results.notes.length > 0 && (
                <SearchResultSection
                  title="הערות"
                  icon={<IconNote className="h-5 w-5 text-blue-600" />}
                  results={results.notes}
                  selectedIndex={selectedIndex}
                  startIndex={results.guides.length}
                  onSelect={navigateToResult}
                  getHighlightedTitle={getHighlightedTitle}
                  getSnippet={getSnippet}
                  getMetadataBadge={getMetadataBadge}
                />
              )}

              {/* Tasks Section */}
              {results.tasks.length > 0 && (
                <SearchResultSection
                  title="משימות"
                  icon={<IconChecklist className="h-5 w-5 text-purple-600" />}
                  results={results.tasks}
                  selectedIndex={selectedIndex}
                  startIndex={results.guides.length + results.notes.length}
                  onSelect={navigateToResult}
                  getHighlightedTitle={getHighlightedTitle}
                  getSnippet={getSnippet}
                  getMetadataBadge={getMetadataBadge}
                />
              )}

              {/* View All Results Link */}
              {totalResults > 0 && (
                <div className="border-t px-4 py-3">
                  <button
                    onClick={navigateToSearchResults}
                    className="w-full flex items-center justify-between text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    <span>צפה בכל {totalResults} התוצאות</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Search result section component
 */
interface SearchResultSectionProps {
  title: string;
  icon: React.ReactNode;
  results: SearchResult[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (result: SearchResult) => void;
  getHighlightedTitle: (result: SearchResult) => string;
  getSnippet: (result: SearchResult) => string;
  getMetadataBadge: (result: SearchResult) => string;
}

function SearchResultSection({
  title,
  icon,
  results,
  selectedIndex,
  startIndex,
  onSelect,
  getHighlightedTitle,
  getSnippet,
  getMetadataBadge,
}: SearchResultSectionProps) {
  return (
    <div className="border-b last:border-b-0">
      {/* Section Header */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          <span className="text-xs text-gray-500">({results.length})</span>
        </div>
      </div>

      {/* Results */}
      <div>
        {results.map((result, index) => {
          const globalIndex = startIndex + index;
          const isSelected = globalIndex === selectedIndex;

          return (
            <button
              key={`${result.type}-${result.item.id}`}
              onClick={() => onSelect(result)}
              className={`w-full px-4 py-3 text-right hover:bg-emerald-50 transition-colors ${
                isSelected ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="space-y-1">
                {/* Title with highlight */}
                <div
                  className="text-sm font-medium text-gray-900 line-clamp-1"
                  dangerouslySetInnerHTML={{
                    __html: getHighlightedTitle(result),
                  }}
                />

                {/* Snippet with highlight */}
                <div
                  className="text-xs text-gray-600 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: getSnippet(result),
                  }}
                />

                {/* Metadata Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                    {getMetadataBadge(result)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Score: {result.score?.toFixed(3)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

