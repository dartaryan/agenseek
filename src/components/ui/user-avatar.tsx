/**
 * User Avatar Component
 * Story 0.3: User Avatar Picture Selection
 * Story 0.10.1: Fixed avatar display - always shows selected avatar
 * 
 * Displays user avatar using DiceBear with Agenseek logo as loading placeholder.
 * If no config is provided, generates a default avatar based on userId.
 * Logo only shows briefly while the avatar image is loading.
 */

import { useMemo, useState } from 'react';
import { generateAvatarDataUrl, type AvatarConfig, getDefaultAvatarConfig } from '@/lib/avatar';
import { cn } from '@/lib/utils';
import AgenseekLogo from '@/assets/agenseek-logo.svg';

interface UserAvatarProps {
  config?: AvatarConfig | null;
  userId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

/**
 * User avatar component that renders DiceBear avatar
 * 
 * Shows Agenseek logo only briefly while the avatar image is loading.
 * Always renders the avatar - either from provided config or generates default from userId.
 */
export function UserAvatar({ config, userId, size = 'md', className }: UserAvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Generate avatar config - either use provided config or generate default
  const avatarConfig = useMemo(() => {
    if (config) return config;
    if (userId) return getDefaultAvatarConfig(userId);
    return getDefaultAvatarConfig('default');
  }, [config, userId]);

  const avatarUrl = useMemo(() => {
    return generateAvatarDataUrl(avatarConfig);
  }, [avatarConfig]);

  // Show logo only while image is still loading
  const showPlaceholder = !imageLoaded;

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {/* Placeholder - Agenseek Logo (shown only while image is loading) */}
      {showPlaceholder && (
        <img
          src={AgenseekLogo}
          alt="Loading..."
          className="w-3/4 h-3/4 object-contain opacity-30"
          aria-hidden="true"
        />
      )}
      
      {/* Actual Avatar */}
      <img
        src={avatarUrl}
        alt="אווטר משתמש"
        className={cn(
          'w-full h-full transition-opacity duration-200',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)} // Show even on error
        style={{ position: imageLoaded ? 'static' : 'absolute' }}
      />
    </div>
  );
}

