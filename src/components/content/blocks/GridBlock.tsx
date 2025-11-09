/**
 * GridBlock - Multi-column grid layout component
 * Story 3.10: Supports 1-4 columns with responsive design
 * and gap sizing. Renders nested content blocks in each cell.
 */

import React from 'react';
import type { GridBlock as GridBlockType, ContentBlock } from '@/types/content-blocks';
import { cn } from '@/lib/utils';

interface GridBlockProps {
  block: GridBlockType;
}

/**
 * NestedContentRenderer - Renders nested content blocks within grid cells
 * Simplified version to avoid circular imports with ContentRenderer
 */
function NestedContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        // Generate unique key with fallback to index
        const uniqueKey = block.id || `nested-block-${index}`;

        switch (block.type) {
          case 'text':
            return (
              <p key={uniqueKey} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {block.content}
              </p>
            );
          case 'heading': {
            const headingTag = `h${block.level}`;
            const headingProps = {
              key: uniqueKey,
              className: 'font-semibold text-slate-900 dark:text-slate-100',
            };
            return React.createElement(headingTag, headingProps, block.content);
          }
          case 'list': {
            const listTag = block.variant === 'ordered' ? 'ol' : 'ul';
            const listClass = `${
              block.variant === 'ordered' ? 'list-decimal' : 'list-disc'
            } list-inside space-y-1 text-slate-700 dark:text-slate-300`;
            return React.createElement(
              listTag,
              { key: uniqueKey, className: listClass },
              block.items.map((item, idx) => React.createElement('li', { key: idx }, item.content))
            );
          }
          case 'image':
            return (
              <img
                key={uniqueKey}
                src={block.src}
                alt={block.alt}
                loading={block.lazy ? 'lazy' : 'eager'}
                className="w-full h-auto rounded"
              />
            );
          case 'code':
            return (
              <pre
                key={uniqueKey}
                className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto"
              >
                <code>{block.code}</code>
              </pre>
            );
          default:
            return (
              <div key={uniqueKey} className="text-slate-500 text-sm">
                [Unsupported nested block type: {block.type}]
              </div>
            );
        }
      })}
    </div>
  );
}

function GridBlock({ block }: GridBlockProps) {
  // Responsive grid columns based on configuration
  // Mobile: 1 column, Tablet: 2 columns max, Desktop: full columns
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  // Gap sizes
  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const gap = block.gap || 'md';
  const gridCols = gridColsMap[block.columns] || gridColsMap[2];
  const gapClass = gapMap[gap];

  return (
    <div
      className={cn(
        'grid my-6',
        gridCols,
        gapClass,
        // RTL support
        'rtl:text-right ltr:text-left'
      )}
    >
      {block.items.map((cellContent, index) => (
        <div
          key={`grid-cell-${index}`}
          className="min-w-0" // Prevent overflow
        >
          {cellContent && Array.isArray(cellContent) && cellContent.length > 0 ? (
            <NestedContentRenderer blocks={cellContent} />
          ) : (
            <div className="text-slate-400 text-sm italic">תא ריק</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GridBlock;
