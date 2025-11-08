/**
 * ImageBlock - Image component with lazy loading and captions
 * Story 3.10: Supports lazy loading, optional width/height,
 * responsive design, and captions with proper semantic HTML.
 */

import type { ImageBlock as ImageBlockType } from '@/types/content-blocks';
import { cn } from '@/lib/utils';

interface ImageBlockProps {
  block: ImageBlockType;
}

function ImageBlock({ block }: ImageBlockProps) {
  // Default to lazy loading unless explicitly set to false
  const shouldLazyLoad = block.lazy !== false;

  // Build image attributes
  const imgAttributes: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: block.src,
    alt: block.alt,
    loading: shouldLazyLoad ? 'lazy' : 'eager',
    // Add explicit dimensions if provided for better CLS (Cumulative Layout Shift)
    ...(block.width && { width: block.width }),
    ...(block.height && { height: block.height }),
  };

  return (
    <figure className="my-6">
      <img
        {...imgAttributes}
        className={cn(
          'w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700',
          'max-w-full object-contain',
          // Smooth loading transition
          'transition-opacity duration-300',
          // RTL-aware
          'rtl:text-right ltr:text-left'
        )}
      />
      {block.caption && (
        <figcaption
          className={cn(
            'mt-3 text-sm text-center text-slate-600 dark:text-slate-400',
            'px-4 leading-relaxed',
            'rtl:text-right ltr:text-left'
          )}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

export default ImageBlock;
