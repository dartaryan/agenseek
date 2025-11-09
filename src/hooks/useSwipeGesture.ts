/**
 * useSwipeGesture Hook - Story 10.2
 *
 * Detects left/right swipe gestures for touch devices
 * Used for navigating between guide sections/pages
 */

import { useEffect, useRef } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance for swipe (pixels)
  restraint?: number; // Maximum perpendicular distance (pixels)
  allowedTime?: number; // Maximum time for swipe (ms)
}

export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement | null>,
  options: SwipeGestureOptions
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 100, // 100px minimum swipe
    restraint = 100, // 100px max vertical movement
    allowedTime = 300, // 300ms max swipe time
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const distX = touch.clientX - touchStartRef.current.x;
      const distY = touch.clientY - touchStartRef.current.y;
      const elapsedTime = Date.now() - touchStartRef.current.time;

      // Check if swipe meets requirements
      if (elapsedTime <= allowedTime) {
        // Ensure horizontal swipe is dominant
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          if (distX < 0 && onSwipeLeft) {
            // Swipe left
            onSwipeLeft();
          } else if (distX > 0 && onSwipeRight) {
            // Swipe right
            onSwipeRight();
          }
        }
      }

      touchStartRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default if we're tracking a potential swipe
      if (touchStartRef.current) {
        const touch = e.touches[0];
        const distX = Math.abs(touch.clientX - touchStartRef.current.x);
        const distY = Math.abs(touch.clientY - touchStartRef.current.y);

        // If horizontal movement is dominant, prevent default (page scroll)
        if (distX > distY && distX > 10) {
          e.preventDefault();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, threshold, restraint, allowedTime]);
}

