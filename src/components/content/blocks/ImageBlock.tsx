/**
 * ImageBlock - Placeholder component for image blocks
 * Full implementation in Story 3.10
 */

import type { ImageBlock as ImageBlockType } from '@/types/content-blocks';

interface ImageBlockProps {
  block: ImageBlockType;
}

function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className="my-4">
      <img
        src={block.src}
        alt={block.alt}
        loading={block.lazy ? 'lazy' : 'eager'}
        className="w-full rounded-lg border border-slate-200"
      />
      {block.caption && (
        <figcaption className="mt-2 text-sm text-center text-slate-600">{block.caption}</figcaption>
      )}
    </figure>
  );
}

export default ImageBlock;
