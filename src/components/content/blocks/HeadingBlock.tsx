/**
 * HeadingBlock - Semantic heading component with typography scale
 * Supports h1-h6 with ToC anchoring and RTL-aware styling
 */

import type { HeadingBlock as HeadingBlockType } from '@/types/content-blocks';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

// Typography scale mapping for heading levels
const headingStyles: Record<number, string> = {
  1: 'text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 scroll-mt-24',
  2: 'text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 scroll-mt-20',
  3: 'text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-3 scroll-mt-20',
  4: 'text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2 scroll-mt-16',
  5: 'text-lg md:text-xl font-medium text-slate-800 dark:text-slate-200 mt-3 mb-2 scroll-mt-16',
  6: 'text-base md:text-lg font-medium text-slate-700 dark:text-slate-300 mt-3 mb-2 scroll-mt-16',
};

function HeadingBlock({ block }: HeadingBlockProps) {
  const HeadingTag: ElementType = `h${block.level}`;
  const anchorId = block.anchor || `heading-${block.id}`;

  return (
    <HeadingTag
      id={anchorId}
      className={cn(
        headingStyles[block.level],
        'group relative leading-tight',
        // RTL-aware text direction
        'rtl:text-right ltr:text-left'
      )}
    >
      {/* Anchor link for ToC - appears on hover */}
      <a
        href={`#${anchorId}`}
        className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700 rtl:left-auto rtl:-right-6"
        aria-label={`Link to ${block.content}`}
      >
        #
      </a>

      {block.content}
    </HeadingTag>
  );
}

export default HeadingBlock;
