/**
 * API Caching and Network Resilience Utilities
 * Story 10.4: Implements retry logic, caching, and offline support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();

/**
 * Cache duration constants (in milliseconds)
 */
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/**
 * Get cached data if it exists and is not expired
 */
export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  const now = Date.now();
  const isExpired = now - entry.timestamp > entry.expiresIn;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Set data in cache with expiration
 */
export function setCachedData<T>(key: string, data: T, expiresIn: number = CACHE_DURATION.MEDIUM): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresIn,
  });
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear();
}

/**
 * Retry a promise-based function with exponential backoff
 *
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Promise with the result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

      // Add jitter (randomness) to prevent thundering herd
      const jitter = Math.random() * 0.3 * delay; // ±30% jitter
      const finalDelay = delay + jitter;

      console.warn(`[API] Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(finalDelay)}ms`, error);

      await new Promise(resolve => setTimeout(resolve, finalDelay));
    }
  }

  throw lastError;
}

/**
 * Fetch with caching and retry logic
 *
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param cacheOptions - Cache options
 * @returns Promise with the response data
 */
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: {
    cacheKey?: string;
    cacheDuration?: number;
    skipCache?: boolean;
    retryOptions?: RetryOptions;
  } = {}
): Promise<T> {
  const {
    cacheKey = url,
    cacheDuration = CACHE_DURATION.MEDIUM,
    skipCache = false,
    retryOptions,
  } = cacheOptions;

  // Check cache first (unless skipCache is true)
  if (!skipCache) {
    const cachedData = getCachedData<T>(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // Fetch with retry logic
  const data = await retryWithBackoff(async () => {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }, retryOptions);

  // Cache the result
  setCachedData(cacheKey, data, cacheDuration);

  return data;
}

/**
 * Network status detection
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onNetworkChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Create a cache key from multiple parameters
 */
export function createCacheKey(...params: (string | number | boolean | undefined | null)[]): string {
  return params.filter(p => p !== undefined && p !== null).join(':');
}

/**
 * Wrapper for Supabase queries with caching
 * Useful for queries that don't change frequently (user progress, profile, etc.)
 *
 * @param cacheKey - Unique cache key for this query
 * @param queryFn - Function that performs the Supabase query
 * @param cacheDuration - How long to cache the result (default: MEDIUM = 15min)
 * @returns Promise with the query result
 */
export async function cachedSupabaseQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  cacheDuration: number = CACHE_DURATION.MEDIUM
): Promise<T> {
  // Check cache first
  const cachedData = getCachedData<T>(cacheKey);
  if (cachedData !== null) {
    return cachedData;
  }

  // Execute query with retry logic
  const data = await retryWithBackoff(queryFn, {
    maxRetries: 2, // Fewer retries for database queries
    baseDelay: 500,
    maxDelay: 3000,
  });

  // Cache the result
  setCachedData(cacheKey, data, cacheDuration);

  return data;
}

