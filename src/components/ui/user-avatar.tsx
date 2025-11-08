/**
 * User Avatar Component
 * Story 0.3: User Avatar Picture Selection
 * Displays user avatar using DiceBear with Agenseek logo as placeholder
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
 * Shows Agenseek logo as placeholder while config loads from database
 */
export function UserAvatar({ config, userId, size = 'md', className }: UserAvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Only generate avatar if we have an actual config from the database
  // If config is null, we're still loading from DB - show logo
  const shouldShowAvatar = config !== null && config !== undefined;
  
  const avatarConfig = useMemo(() => {
    if (config) return config;
    if (userId) return getDefaultAvatarConfig(userId);
    return getDefaultAvatarConfig('default');
  }, [config, userId]);

  const avatarUrl = useMemo(() => {
    return generateAvatarDataUrl(avatarConfig);
  }, [avatarConfig]);

  // Show logo while config is loading OR while image is loading
  const showPlaceholder = !shouldShowAvatar || !imageLoaded;

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {/* Placeholder - Agenseek Logo (shown until config loads AND image loads) */}
      {showPlaceholder && (
        <img
          src={AgenseekLogo}
          alt="Loading..."
          className="w-3/4 h-3/4 object-contain opacity-30"
          aria-hidden="true"
        />
      )}
      
      {/* Actual Avatar (only render when we have config) */}
      {shouldShowAvatar && (
        <img
          src={avatarUrl}
          alt="אווטר משתמש"
          className={cn(
            'w-full h-full transition-opacity duration-200',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ position: imageLoaded ? 'static' : 'absolute' }}
        />
      )}
    </div>
  );
}

