import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedBackgroundProps {
  variant: 'auth' | 'app';
}

/**
 * AnimatedBackground Component
 *
 * Adds subtle animated geometric shapes to page backgrounds.
 * Inspired by Agenseek logo colors and angular design.
 *
 * Story 6.15: Animated Geometric Backgrounds
 *
 * @param variant - 'auth' for login/register (more prominent), 'app' for main pages (subtle)
 */
export function AnimatedBackground({ variant }: AnimatedBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configuration for auth variant - ONLY TRIANGLES AND CIRCLES
  const authShapes = [
    // Small emerald triangle - top-left (FAST)
    {
      size: 'w-16 h-16 md:w-24 md:h-24',
      position: 'top-[8%] left-[5%]',
      color: 'bg-[#059669]',
      opacity: 'opacity-40',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-1',
    },
    // Tiny gray circle - top-right (VERY FAST)
    {
      size: 'w-12 h-12 md:w-20 md:h-20',
      position: 'top-[12%] right-[8%]',
      color: 'bg-[#AEAEAE]',
      opacity: 'opacity-35',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-1',
    },
    // Small emerald circle - bottom-right (MEDIUM)
    {
      size: 'w-20 h-20 md:w-28 md:h-28',
      position: 'bottom-[10%] right-[6%]',
      color: 'bg-emerald-400',
      opacity: 'opacity-42',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-2',
    },
    // Small gray triangle - bottom-left (FAST)
    {
      size: 'w-18 h-18 md:w-26 md:h-26',
      position: 'bottom-[15%] left-[7%]',
      color: 'bg-gray-400',
      opacity: 'opacity-38',
      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-2',
    },
    // Tiny teal triangle - center-right (VERY FAST)
    {
      size: 'w-14 h-14 md:w-22 md:h-22',
      position: 'top-[28%] right-[12%]',
      color: 'bg-teal-500',
      opacity: 'opacity-36',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-2',
    },
    // Small emerald circle - center-left (FAST)
    {
      size: 'w-16 h-16 md:w-24 md:h-24',
      position: 'top-[42%] left-[10%]',
      color: 'bg-emerald-500',
      opacity: 'opacity-40',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-1',
    },
    // Tiny teal triangle - top-center (VERY FAST)
    {
      size: 'w-10 h-10 md:w-18 md:h-18',
      position: 'top-[18%] left-[48%]',
      color: 'bg-teal-400',
      opacity: 'opacity-34',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-1',
    },
    // Small emerald triangle - mid-left (SLOW)
    {
      size: 'w-16 h-16 md:w-24 md:h-24',
      position: 'top-[55%] left-[15%]',
      color: 'bg-emerald-600',
      opacity: 'opacity-38',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-slow-1',
    },
    // Tiny gray circle - mid-right (VERY FAST)
    {
      size: 'w-12 h-12 md:w-18 md:h-18',
      position: 'top-[62%] right-[18%]',
      color: 'bg-gray-500',
      opacity: 'opacity-32',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-2',
    },
    // Small teal circle - bottom-center (MEDIUM)
    {
      size: 'w-18 h-18 md:w-26 md:h-26',
      position: 'bottom-[20%] left-[45%]',
      color: 'bg-teal-600',
      opacity: 'opacity-38',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-3',
    },
    // Tiny emerald triangle - upper-right (FAST)
    {
      size: 'w-14 h-14 md:w-20 md:h-20',
      position: 'top-[25%] right-[25%]',
      color: 'bg-emerald-400',
      opacity: 'opacity-36',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-1',
    },
    // Small gray circle - lower-left (SLOW)
    {
      size: 'w-16 h-16 md:w-22 md:h-22',
      position: 'bottom-[35%] left-[22%]',
      color: 'bg-gray-400',
      opacity: 'opacity-34',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-slow-2',
    },
  ];

  // Configuration for app variant - ONLY TRIANGLES AND CIRCLES (subtle)
  const appShapes = [
    // Small emerald triangle - top-left (FAST)
    {
      size: 'w-12 h-12 md:w-18 md:h-18',
      position: 'top-[8%] left-[6%]',
      color: 'bg-emerald-300',
      opacity: 'opacity-[0.12]',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-1',
    },
    // Tiny gray circle - top-right (SLOW)
    {
      size: 'w-10 h-10 md:w-16 md:h-16',
      position: 'top-[10%] right-[8%]',
      color: 'bg-gray-300',
      opacity: 'opacity-[0.10]',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-slow-1',
    },
    // Small emerald circle - bottom-right (MEDIUM)
    {
      size: 'w-14 h-14 md:w-20 md:h-20',
      position: 'bottom-[12%] right-[10%]',
      color: 'bg-emerald-300',
      opacity: 'opacity-[0.14]',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-subtle-3',
    },
    // Tiny gray triangle - bottom-left (FAST)
    {
      size: 'w-12 h-12 md:w-18 md:h-18',
      position: 'bottom-[14%] left-[12%]',
      color: 'bg-gray-300',
      opacity: 'opacity-[0.11]',
      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-2',
    },
    // Tiny teal triangle - center-right (VERY FAST)
    {
      size: 'w-10 h-10 md:w-16 md:h-16',
      position: 'top-[38%] right-[15%]',
      color: 'bg-teal-300',
      opacity: 'opacity-[0.10]',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-1',
    },
    // Small emerald circle - center-left (VERY FAST)
    {
      size: 'w-12 h-12 md:w-18 md:h-18',
      position: 'top-[52%] left-[18%]',
      color: 'bg-emerald-300',
      opacity: 'opacity-[0.12]',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-very-fast-2',
    },
    // Tiny teal circle - top-center (FAST)
    {
      size: 'w-10 h-10 md:w-14 md:h-14',
      position: 'top-[22%] left-[48%]',
      color: 'bg-teal-200',
      opacity: 'opacity-[0.09]',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-subtle-1',
    },
    // Small gray triangle - mid-screen (SLOW)
    {
      size: 'w-14 h-14 md:w-20 md:h-20',
      position: 'top-[35%] left-[40%]',
      color: 'bg-gray-300',
      opacity: 'opacity-[0.10]',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-slow-2',
    },
    // Tiny emerald triangle - lower-center (MEDIUM)
    {
      size: 'w-12 h-12 md:w-18 md:h-18',
      position: 'bottom-[28%] left-[52%]',
      color: 'bg-emerald-200',
      opacity: 'opacity-[0.11]',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: prefersReducedMotion ? '' : 'animate-float-2',
    },
    // Small teal circle - upper-right (FAST)
    {
      size: 'w-12 h-12 md:w-16 md:h-16',
      position: 'top-[25%] right-[28%]',
      color: 'bg-teal-300',
      opacity: 'opacity-[0.10]',
      clipPath: 'circle(50% at 50% 50%)',
      animation: prefersReducedMotion ? '' : 'animate-float-fast-1',
    },
  ];

  const shapes = variant === 'auth' ? authShapes : appShapes;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {shapes.map((shape, index) => (
        <div
          key={`shape-${variant}-${index}`}
          className={cn(
            'absolute transition-opacity duration-300',
            shape.size,
            shape.position,
            shape.color,
            // Apply 0.3 opacity on mobile for auth variant, otherwise use original opacity
            isMobile && variant === 'auth' ? 'opacity-30' : shape.opacity,
            shape.animation
          )}
          style={{
            clipPath: shape.clipPath,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
        />
      ))}
    </div>
  );
}

