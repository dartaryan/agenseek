/**
 * GridBlock - Multi-column grid layout component
 * Story 3.10: Supports 1-4 columns with responsive design
 * and gap sizing. Renders nested content blocks in each cell.
 */

import React from 'react';
import type { GridBlock as GridBlockType, ContentBlock } from '@/types/content-blocks';
import { cn } from '@/lib/utils';
import TextBlock from './TextBlock';

interface GridBlockProps {
  block: GridBlockType;
}

/**
 * NestedContentRenderer - Renders nested content blocks within grid cells
 * Extended to support card, callout, and other block types
 */
function NestedContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        // Generate unique key with fallback to index
        const uniqueKey = block.id || `nested-block-${index}`;

        switch (block.type) {
          case 'text':
            // Use TextBlock component for proper markdown parsing
            return <TextBlock key={uniqueKey} block={block} />;
          case 'heading': {
            const headingTag = `h${block.level}`;
            // Support both 'content' and 'text' properties
            const headingText = block.content || (block as any).text || '';
            const headingProps = {
              key: uniqueKey,
              className: 'font-semibold text-slate-900 dark:text-slate-100',
            };
            return React.createElement(headingTag, headingProps, headingText);
          }
          case 'list': {
            const blockWithOrdered = block as any;
            const isOrdered = block.variant === 'ordered' || blockWithOrdered.ordered === true;
            const listTag = isOrdered ? 'ol' : 'ul';
            const listClass = `${
              isOrdered ? 'list-decimal' : 'list-disc'
            } list-inside space-y-1 text-slate-700 dark:text-slate-300`;
            return React.createElement(
              listTag,
              { key: uniqueKey, className: listClass },
              block.items.map((item, idx) => {
                // Support both 'content' and 'text' properties
                const itemContent = typeof item === 'string' ? item : (item.content || (item as any).text || '');
                return React.createElement('li', { key: idx }, itemContent);
              })
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
          case 'card': {
            // Support nested card blocks
            const cardBlock = block as any;
            return (
              <div
                key={uniqueKey}
                className={cn(
                  'p-4 rounded-lg border',
                  cardBlock.variant === 'elevated' ? 'shadow-lg bg-white dark:bg-slate-800' :
                  cardBlock.variant === 'outlined' ? 'border-2 border-emerald-500 bg-transparent' :
                  'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                )}
              >
                {cardBlock.title && (
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {cardBlock.title}
                  </h4>
                )}
                {cardBlock.content && Array.isArray(cardBlock.content) ? (
                  <NestedContentRenderer blocks={cardBlock.content} />
                ) : cardBlock.content ? (
                  <p className="text-slate-700 dark:text-slate-300">{cardBlock.content}</p>
                ) : null}
              </div>
            );
          }
          case 'callout': {
            // Support nested callout blocks
            const calloutBlock = block as any;
            const variantStyles: Record<string, string> = {
              info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
              warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
              success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
              error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
            };
            return (
              <div
                key={uniqueKey}
                className={cn('p-4 rounded-lg border', variantStyles[calloutBlock.variant] || variantStyles.info)}
              >
                {calloutBlock.title && (
                  <p className="font-semibold mb-1">{calloutBlock.title}</p>
                )}
                <p>{typeof calloutBlock.content === 'string' ? calloutBlock.content : ''}</p>
              </div>
            );
          }
          case 'divider':
            return <hr key={uniqueKey} className="my-4 border-slate-200 dark:border-slate-700" />;
          default:
            // Log unknown types for debugging but render gracefully
            console.warn(`GridBlock: Unknown nested block type: ${(block as any).type}`);
            return (
              <div key={uniqueKey} className="text-slate-500 text-sm">
                [Unsupported nested block type: {(block as any).type}]
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
      {block.items.map((cellContent, index) => {
        // Normalize cell content - handle multiple JSON formats:
        // 1. items: [[{block}]] - array of arrays (standard)
        // 2. items: [{block}] - array of direct block objects
        // 3. items: [{id, content: {block}}] - array of wrapper objects with nested content
        let normalizedContent: ContentBlock[];
        
        if (Array.isArray(cellContent) && cellContent.length > 0) {
          // Format 1: Standard array of blocks
          normalizedContent = cellContent;
        } else if (cellContent && typeof cellContent === 'object') {
          const item = cellContent as any;
          
          if ('type' in item) {
            // Format 2: Direct block object - wrap it in array
            normalizedContent = [item as ContentBlock];
          } else if ('content' in item && item.content && typeof item.content === 'object') {
            // Format 3: Wrapper object with nested content {id, content: {block}}
            if ('type' in item.content) {
              normalizedContent = [item.content as ContentBlock];
            } else if (Array.isArray(item.content)) {
              normalizedContent = item.content as ContentBlock[];
            } else {
              normalizedContent = [];
            }
          } else {
            normalizedContent = [];
          }
        } else {
          // Empty or invalid cell
          normalizedContent = [];
        }

        return (
          <div
            key={`grid-cell-${index}`}
            className="min-w-0" // Prevent overflow
          >
            {normalizedContent.length > 0 ? (
              <NestedContentRenderer blocks={normalizedContent} />
            ) : (
              <div className="text-slate-400 text-sm italic">תא ריק</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GridBlock;
