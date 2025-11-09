/**
 * CardBlock - Card component for highlighted content sections
 * Story 3.10: Uses Shadcn/ui Card with 3 variants (default, elevated, outlined)
 * Renders nested content blocks with optional title and footer.
 */

import React from 'react';
import type { CardBlock as CardBlockType, ContentBlock } from '@/types/content-blocks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardBlockProps {
  block: CardBlockType;
}

/**
 * NestedContentRenderer - Renders nested content blocks within cards
 * Simplified version to avoid circular imports with ContentRenderer
 */
function NestedContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={block.id} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {block.content}
              </p>
            );
          case 'heading': {
            const headingTag = `h${block.level}`;
            const headingProps = {
              key: block.id,
              className: 'font-semibold text-slate-900 dark:text-slate-100 mb-2',
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
              { key: block.id, className: listClass },
              block.items.map((item, idx) => React.createElement('li', { key: idx }, item.content))
            );
          }
          case 'image':
            return (
              <img
                key={block.id}
                src={block.src}
                alt={block.alt}
                loading={block.lazy ? 'lazy' : 'eager'}
                className="w-full h-auto rounded"
              />
            );
          case 'code':
            return (
              <pre
                key={block.id}
                className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto"
              >
                <code>{block.code}</code>
              </pre>
            );
          default:
            return (
              <div key={block.id} className="text-slate-500 text-sm">
                [Unsupported nested block type: {block.type}]
              </div>
            );
        }
      })}
    </div>
  );
}

function CardBlock({ block }: CardBlockProps) {
  // Variant-specific styling using Shadcn/ui Card
  const variantClasses = {
    default: '', // Default Shadcn styling
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'border-2 border-emerald-500 dark:border-emerald-600',
  };

  const variant = block.variant || 'default';
  const variantClass = variantClasses[variant];

  return (
    <Card className={cn('my-4', variantClass, 'rtl:text-right ltr:text-left')}>
      {/* Optional Header with Title */}
      {block.title && (
        <CardHeader>
          <CardTitle className="text-lg">{block.title}</CardTitle>
        </CardHeader>
      )}

      {/* Content - renders nested blocks */}
      <CardContent className={cn(block.title ? '' : 'pt-6')}>
        {block.content && Array.isArray(block.content) && block.content.length > 0 ? (
          <NestedContentRenderer blocks={block.content} />
        ) : (
          <p className="text-slate-400 text-sm italic">אין תוכן</p>
        )}
      </CardContent>

      {/* Optional Footer */}
      {block.footer && (
        <CardFooter className="text-sm text-slate-600 dark:text-slate-400">
          {block.footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default CardBlock;
