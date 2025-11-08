/**
 * Global Search Infrastructure - Story 7.1
 *
 * Provides fuzzy search across guides, notes, and tasks using Fuse.js
 */

import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';
import type { GuideCatalogEntry } from '@/types/guide-catalog';
import type { Database } from '@/types/database';

// Database types
type UserNote = Database['public']['Tables']['user_notes']['Row'];
type UserTask = Database['public']['Tables']['user_tasks']['Row'];

/**
 * Search result types
 */
export type SearchResultType = 'guide' | 'note' | 'task';

/**
 * Base search result with score and highlights
 */
export interface BaseSearchResult {
  type: SearchResultType;
  score: number; // 0-1, lower is better match
  matches: SearchMatch[];
}

/**
 * Search match highlighting information
 */
export interface SearchMatch {
  key: string; // Field name that matched
  value: string; // Original value
  indices: [number, number][]; // Character indices of matches
}

/**
 * Guide search result
 */
export interface GuideSearchResult extends BaseSearchResult {
  type: 'guide';
  item: GuideCatalogEntry;
}

/**
 * Note search result
 */
export interface NoteSearchResult extends BaseSearchResult {
  type: 'note';
  item: UserNote & { contentText: string }; // Include plain text version of content
}

/**
 * Task search result
 */
export interface TaskSearchResult extends BaseSearchResult {
  type: 'task';
  item: UserTask;
}

/**
 * Union type for all search results
 */
export type SearchResult = GuideSearchResult | NoteSearchResult | TaskSearchResult;

/**
 * Search results grouped by type
 */
export interface SearchResults {
  guides: GuideSearchResult[];
  notes: NoteSearchResult[];
  tasks: TaskSearchResult[];
  all: SearchResult[];
}

/**
 * Fuse.js configuration for guides
 */
export const GUIDE_SEARCH_CONFIG: IFuseOptions<GuideCatalogEntry> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'tags', weight: 1.2 },
    { name: 'category', weight: 0.8 },
  ],
  threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true, // Search entire string
};

/**
 * Fuse.js configuration for notes
 */
export const NOTE_SEARCH_CONFIG: IFuseOptions<UserNote & { contentText: string }> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'contentText', weight: 1 },
    { name: 'tags', weight: 1.2 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
};

/**
 * Fuse.js configuration for tasks
 */
export const TASK_SEARCH_CONFIG: IFuseOptions<UserTask> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'status', weight: 0.5 },
    { name: 'priority', weight: 0.5 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
};

/**
 * Extract plain text from Tiptap JSON content
 */
export function extractTextFromTiptap(content: unknown): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const contentObj = content as { type?: string; text?: string; content?: unknown[] };

  // If this is a text node, return its text
  if (contentObj.type === 'text' && contentObj.text) {
    return contentObj.text;
  }

  // If this node has children, recursively extract text
  if (Array.isArray(contentObj.content)) {
    return contentObj.content.map((child) => extractTextFromTiptap(child)).join(' ');
  }

  return '';
}

/**
 * Create a Fuse instance for guides
 */
export function createGuideFuse(guides: GuideCatalogEntry[]): Fuse<GuideCatalogEntry> {
  return new Fuse(guides, GUIDE_SEARCH_CONFIG);
}

/**
 * Create a Fuse instance for notes
 */
export function createNoteFuse(
  notes: UserNote[]
): Fuse<UserNote & { contentText: string }> {
  // Convert notes to include plain text content
  const notesWithText = notes.map((note) => ({
    ...note,
    contentText: extractTextFromTiptap(note.content),
  }));

  return new Fuse(notesWithText, NOTE_SEARCH_CONFIG);
}

/**
 * Create a Fuse instance for tasks
 */
export function createTaskFuse(tasks: UserTask[]): Fuse<UserTask> {
  return new Fuse(tasks, TASK_SEARCH_CONFIG);
}

/**
 * Convert Fuse result to typed search result
 */
function convertFuseResult<T>(
  result: FuseResult<T>,
  type: SearchResultType
): BaseSearchResult & { item: T } {
  return {
    type,
    item: result.item,
    score: result.score || 0,
    matches:
      result.matches?.map((match) => ({
        key: match.key || '',
        value: match.value || '',
        indices: (match.indices as [number, number][]) || [],
      })) || [],
  };
}

/**
 * Search across all content types
 *
 * @param query - Search query string
 * @param guides - Array of guide catalog entries
 * @param notes - Array of user notes
 * @param tasks - Array of user tasks
 * @param options - Search options (limit per type, etc.)
 * @returns Grouped search results
 */
export function searchAll(
  query: string,
  guides: GuideCatalogEntry[],
  notes: UserNote[],
  tasks: UserTask[],
  options: { limitPerType?: number } = {}
): SearchResults {
  const { limitPerType = 50 } = options;

  if (!query.trim()) {
    return {
      guides: [],
      notes: [],
      tasks: [],
      all: [],
    };
  }

  // Create Fuse instances
  const guideFuse = createGuideFuse(guides);
  const noteFuse = createNoteFuse(notes);
  const taskFuse = createTaskFuse(tasks);

  // Search each content type
  const guideResults = guideFuse.search(query, { limit: limitPerType }).map((result) => ({
    ...convertFuseResult(result, 'guide' as const),
    item: result.item,
  })) as GuideSearchResult[];

  const noteResults = noteFuse.search(query, { limit: limitPerType }).map((result) => ({
    ...convertFuseResult(result, 'note' as const),
    item: result.item,
  })) as NoteSearchResult[];

  const taskResults = taskFuse.search(query, { limit: limitPerType }).map((result) => ({
    ...convertFuseResult(result, 'task' as const),
    item: result.item,
  })) as TaskSearchResult[];

  // Combine and sort all results by score (lower score = better match)
  const allResults = [...guideResults, ...noteResults, ...taskResults].sort(
    (a, b) => a.score - b.score
  );

  return {
    guides: guideResults,
    notes: noteResults,
    tasks: taskResults,
    all: allResults,
  };
}

/**
 * Search only guides
 */
export function searchGuides(query: string, guides: GuideCatalogEntry[]): GuideSearchResult[] {
  if (!query.trim()) return [];

  const fuse = createGuideFuse(guides);
  return fuse.search(query).map(
    (result) =>
      ({
        ...convertFuseResult(result, 'guide'),
        item: result.item,
      }) as GuideSearchResult
  );
}

/**
 * Search only notes
 */
export function searchNotes(query: string, notes: UserNote[]): NoteSearchResult[] {
  if (!query.trim()) return [];

  const fuse = createNoteFuse(notes);
  return fuse.search(query).map(
    (result) =>
      ({
        ...convertFuseResult(result, 'note'),
        item: result.item,
      }) as NoteSearchResult
  );
}

/**
 * Search only tasks
 */
export function searchTasks(query: string, tasks: UserTask[]): TaskSearchResult[] {
  if (!query.trim()) return [];

  const fuse = createTaskFuse(tasks);
  return fuse.search(query).map(
    (result) =>
      ({
        ...convertFuseResult(result, 'task'),
        item: result.item,
      }) as TaskSearchResult
  );
}

/**
 * Highlight matched text in a string
 *
 * @param text - Original text
 * @param indices - Match indices from Fuse.js
 * @returns Text with <mark> tags around matches
 */
export function highlightMatches(text: string, indices: [number, number][]): string {
  if (!indices || indices.length === 0) {
    return text;
  }

  let result = '';
  let lastIndex = 0;

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

  sortedIndices.forEach(([start, end]) => {
    // Add text before match
    result += text.slice(lastIndex, start);
    // Add highlighted match
    result += `<mark>${text.slice(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  });

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}

/**
 * Get snippet from text with highlighted matches
 *
 * @param text - Full text
 * @param indices - Match indices
 * @param maxLength - Maximum snippet length (default: 150)
 * @returns Snippet with ellipsis and highlights
 */
export function getMatchSnippet(
  text: string,
  indices: [number, number][],
  maxLength: number = 150
): string {
  if (!text) return '';
  if (!indices || indices.length === 0) {
    // No matches, return truncated text
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Find the first match
  const firstMatch = indices[0];
  const matchStart = firstMatch[0];

  // Calculate snippet start (try to center the match)
  const contextBefore = Math.floor(maxLength / 2);
  const snippetStart = Math.max(0, matchStart - contextBefore);

  // Extract snippet
  let snippet = text.slice(snippetStart, snippetStart + maxLength);

  // Add ellipsis
  if (snippetStart > 0) {
    snippet = '...' + snippet;
  }
  if (snippetStart + maxLength < text.length) {
    snippet = snippet + '...';
  }

  // Adjust indices for snippet
  const adjustedIndices = indices
    .map(([start, end]): [number, number] => [
      start - snippetStart + (snippetStart > 0 ? 3 : 0),
      end - snippetStart + (snippetStart > 0 ? 3 : 0),
    ])
    .filter(([start]) => start >= 0 && start < snippet.length);

  return highlightMatches(snippet, adjustedIndices);
}

