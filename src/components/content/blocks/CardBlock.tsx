/**
 * CardBlock - Card component for highlighted content sections
 * Story 3.10: Uses Shadcn/ui Card with 3 variants (default, elevated, outlined)
 * Renders nested content blocks with optional title and footer.
 * Extended: Supports 'cards' array for rendering multiple cards
 */

import React from 'react';
import type { CardBlock as CardBlockType, ContentBlock } from '@/types/content-blocks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import TextBlock from './TextBlock';

/**
 * Extended CardBlock type to support 'cards' array from JSON
 */
interface ExtendedCardBlockType extends CardBlockType {
  cards?: Array<{
    title?: string;
    content?: string | ContentBlock[];
    variant?: 'default' | 'elevated' | 'outlined';
    footer?: string;
  }>;
}

interface CardBlockProps {
  block: ExtendedCardBlockType;
}

/**
 * NestedContentRenderer - Renders nested content blocks within cards
 * Extended to support more block types
 */
function NestedContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        const uniqueKey = block.id || `nested-${index}`;
        
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
              className: 'font-semibold text-slate-900 dark:text-slate-100 mb-2',
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
                className={cn('p-3 rounded-lg border text-sm', variantStyles[calloutBlock.variant] || variantStyles.info)}
              >
                {calloutBlock.title && (
                  <p className="font-semibold mb-1">{calloutBlock.title}</p>
                )}
                <p>{typeof calloutBlock.content === 'string' ? calloutBlock.content : ''}</p>
              </div>
            );
          }
          case 'divider':
            return <hr key={uniqueKey} className="my-3 border-slate-200 dark:border-slate-700" />;
          default:
            console.warn(`CardBlock: Unknown nested block type: ${(block as any).type}`);
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

/**
 * Single Card component - renders one card
 */
function SingleCard({ 
  title, 
  content, 
  footer, 
  variant = 'default' 
}: { 
  title?: string; 
  content?: string | ContentBlock[]; 
  footer?: string; 
  variant?: 'default' | 'elevated' | 'outlined';
}) {
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'border-2 border-emerald-500 dark:border-emerald-600',
  };

  const variantClass = variantClasses[variant];

  return (
    <Card className={cn('my-4', variantClass, 'rtl:text-right ltr:text-left')}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}

      <CardContent className={cn(title ? '' : 'pt-6')}>
        {content && Array.isArray(content) && content.length > 0 ? (
          <NestedContentRenderer blocks={content} />
        ) : typeof content === 'string' && content ? (
          <p className="text-slate-700 dark:text-slate-300">{content}</p>
        ) : (
          <p className="text-slate-400 text-sm italic">אין תוכן</p>
        )}
      </CardContent>

      {footer && (
        <CardFooter className="text-sm text-slate-600 dark:text-slate-400">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

function CardBlock({ block }: CardBlockProps) {
  // Check if this is a multi-card block (has 'cards' array)
  if (block.cards && Array.isArray(block.cards) && block.cards.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {block.cards.map((card, index) => (
          <SingleCard
            key={`card-${index}`}
            title={card.title}
            content={card.content}
            footer={card.footer}
            variant={card.variant || 'default'}
          />
        ))}
      </div>
    );
  }

  // Single card rendering (original behavior)
  return (
    <SingleCard
      title={block.title}
      content={block.content}
      footer={block.footer}
      variant={block.variant || 'default'}
    />
  );
}

export default CardBlock;
