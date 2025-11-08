/**
 * VideoBlock - Responsive video component with aspect ratio control
 * Story 3.10: Supports multiple aspect ratios (16/9, 4/3, 1/1),
 * optional title, thumbnail, autoplay, and controls.
 */

import type { VideoBlock as VideoBlockType } from '@/types/content-blocks';
import { cn } from '@/lib/utils';

interface VideoBlockProps {
  block: VideoBlockType;
}

function VideoBlock({ block }: VideoBlockProps) {
  // Aspect ratio mapping to Tailwind classes
  const aspectRatioClass = {
    '16/9': 'aspect-video', // Default for most videos
    '4/3': 'aspect-[4/3]', // Classic TV format
    '1/1': 'aspect-square', // Square videos
  };

  // Default to 16/9 if not specified
  const ratioClass = block.aspectRatio
    ? aspectRatioClass[block.aspectRatio]
    : aspectRatioClass['16/9'];

  // Video attributes - controls enabled by default unless explicitly disabled
  const showControls = block.controls !== false;
  const shouldAutoplay = block.autoplay === true;

  return (
    <div className="my-6">
      {/* Optional Title */}
      {block.title && (
        <h4
          className={cn(
            'text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3',
            'rtl:text-right ltr:text-left'
          )}
        >
          {block.title}
        </h4>
      )}

      {/* Video Container with Responsive Aspect Ratio */}
      <div
        className={cn(
          ratioClass,
          'bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden',
          'border border-slate-200 dark:border-slate-700',
          // Shadow for depth
          'shadow-sm hover:shadow-md transition-shadow'
        )}
      >
        <video
          src={block.src}
          controls={showControls}
          autoPlay={shouldAutoplay}
          poster={block.thumbnail}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline // Better mobile experience
        >
          {/* Fallback text for browsers that don't support video */}
          <p className="p-4 text-center text-slate-600 dark:text-slate-400">
            הדפדפן שלך אינו תומך בתגית הווידאו. נא להוריד את הקובץ ולצפות בו במנגן וידאו חיצוני.
          </p>
        </video>
      </div>
    </div>
  );
}

export default VideoBlock;
