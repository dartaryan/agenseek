/**
 * VideoBlock - Placeholder component for video blocks
 * Full implementation in Story 3.10
 */

import type { VideoBlock as VideoBlockType } from '@/types/content-blocks';

interface VideoBlockProps {
  block: VideoBlockType;
}

function VideoBlock({ block }: VideoBlockProps) {
  // Note: aspectRatio format is '16/9', '4/3', '1/1' (with slash)
  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  };

  const ratioClass = block.aspectRatio ? aspectRatioClass[block.aspectRatio] : 'aspect-video';

  return (
    <div className="my-4">
      {block.title && <p className="text-sm font-semibold text-slate-700 mb-2">{block.title}</p>}
      <div className={`${ratioClass} bg-slate-100 rounded-lg overflow-hidden`}>
        <video src={block.src} controls className="w-full h-full" poster={block.thumbnail}>
          הדפדפן שלך אינו תומך בתגית הווידאו.
        </video>
      </div>
    </div>
  );
}

export default VideoBlock;
