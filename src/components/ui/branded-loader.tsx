import { useEffect, useState } from 'react';

interface BrandedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Branded animated loader with logo spinning inside a counter-rotating circle
 */
export function BrandedLoader({ size = 'md', className = '' }: BrandedLoaderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const logoSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}
      role="status"
      aria-label="טוען"
    >
      {/* Outer circle - spins counter-clockwise */}
      <div
        className={`absolute inset-0 rounded-full border-6 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400 ${
          prefersReducedMotion ? '' : 'animate-spin-reverse'
        }`}
        style={{
          animationDuration: '1.5s',
          borderWidth: size === 'lg' ? '8px' : size === 'md' ? '6px' : '4px'
        }}
      />

      {/* Inner logo - spins clockwise around its center like a wheel */}
      <div
        className={`${logoSizes[size]} ${prefersReducedMotion ? '' : 'animate-spin'} flex items-center justify-center`}
        style={{
          animationDuration: '2s',
          transformOrigin: 'center center'
        }}
      >
        <img
          src="/agenseek-icon.svg"
          alt="Agenseek"
          className="w-full h-full object-contain"
          style={{ transformOrigin: 'center center' }}
        />
      </div>
    </div>
  );
}

