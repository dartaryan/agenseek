import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  threshold?: number; // Minimum scroll amount to trigger
  enabled?: boolean; // Enable/disable hook
}

/**
 * useScrollDirection Hook
 *
 * Detects scroll direction using requestAnimationFrame for optimal performance.
 * Implements a threshold to prevent excessive state changes.
 *
 * Features:
 * - RAF-based scroll detection (no jank)
 * - Configurable threshold
 * - Can be enabled/disabled
 * - Cleanup on unmount
 *
 * @param options - Configuration options
 * @returns Current scroll direction ('up', 'down', or 'none')
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 50, enabled = true } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');

  // Initialize lastScrollY with current scroll position to avoid first scroll issues
  const [lastScrollY, setLastScrollY] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY;
    }
    return 0;
  });

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY, threshold, enabled]);

  return scrollDirection;
}

