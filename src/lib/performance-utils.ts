/**
 * Performance Utilities
 * Story 10.4: Debounce, throttle, and other performance optimization utilities
 */

/**
 * Debounce a function - delays execution until after wait time has elapsed since last call
 * Useful for: search inputs, window resize, scroll events
 *
 * @param fn - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle a function - limits execution to once per wait time
 * Useful for: scroll events, resize events, frequent updates
 *
 * @param fn - Function to throttle
 * @param wait - Wait time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    if (now - lastCall >= wait) {
      lastCall = now;
      fn.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        fn.apply(context, args);
      }, wait - (now - lastCall));
    }
  };
}

/**
 * RequestAnimationFrame-based throttle for smooth animations
 * Useful for: smooth scroll tracking, animation updates
 *
 * @param fn - Function to throttle
 * @returns Throttled function
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    if (rafId) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      fn.apply(context, args);
      rafId = null;
    });
  };
}

/**
 * Create a lazy-loaded image with fade-in effect
 *
 * @param src - Image source
 * @param alt - Alt text
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch multiple state updates into a single render
 * Useful for: multiple related state updates
 *
 * @param fn - Function containing state updates
 */
export function batchUpdates(fn: () => void): void {
  // React 18+ automatically batches updates
  // This function is here for API consistency and future compatibility
  fn();
}

/**
 * Measure performance of a function
 *
 * @param name - Name of the measurement
 * @param fn - Function to measure
 * @returns Result of the function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();

  try {
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;

    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Create an idle callback that runs during browser idle time
 * Useful for: non-critical background tasks
 *
 * @param fn - Function to run during idle time
 * @param timeout - Maximum time to wait in milliseconds
 */
export function runWhenIdle(fn: () => void, timeout: number = 5000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, timeout);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed information
 */
export function getConnectionSpeed(): {
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
} {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    return {
      effectiveType: null,
      downlink: null,
      rtt: null,
      saveData: false,
    };
  }

  return {
    effectiveType: connection.effectiveType || null, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink || null, // Mbps
    rtt: connection.rtt || null, // Round-trip time in ms
    saveData: connection.saveData || false,
  };
}

/**
 * Check if connection is slow (3G or worse)
 */
export function isSlowConnection(): boolean {
  const { effectiveType } = getConnectionSpeed();
  return effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g';
}

/**
 * Log Web Vitals for monitoring
 */
export function logWebVitals(metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
}): void {
  console.log('[Web Vitals]', {
    name: metric.name,
    value: Math.round(metric.value),
    delta: Math.round(metric.delta),
    id: metric.id,
  });

  // In production, send to analytics
  // Example: sendToAnalytics(metric);
}

