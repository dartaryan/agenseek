/**
 * CalloutBlock - Highlighted content blocks with variant styling
 *
 * Story 3.5: Supports 4 variants (info, warning, success, error)
 * with colored icons, borders, and optional titles.
 * Content can be string or nested ContentBlock arrays.
 */

import React from 'react';
import type { CalloutBlock as CalloutBlockType, ContentBlock } from '@/types/content-blocks';
import { cn } from '@/lib/utils';
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { Icon } from '@tabler/icons-react';

interface CalloutBlockProps {
  block: CalloutBlockType;
}

// Variant configuration with icons and styling
const variantConfig: Record<
  CalloutBlockType['variant'],
  {
    icon: Icon;
    containerClasses: string;
    iconClasses: string;
    titleClasses: string;
    borderClasses: string;
  }
> = {
  info: {
    icon: IconInfoCircle,
    containerClasses: 'bg-blue-50 dark:bg-blue-950/30',
    iconClasses: 'text-blue-600 dark:text-blue-400',
    titleClasses: 'text-blue-900 dark:text-blue-100',
    borderClasses: 'border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500 dark:border-l-blue-400',
  },
  warning: {
    icon: IconAlertTriangle,
    containerClasses: 'bg-amber-50 dark:bg-amber-950/30',
    iconClasses: 'text-amber-600 dark:text-amber-400',
    titleClasses: 'text-amber-900 dark:text-amber-100',
    borderClasses: 'border-amber-200 dark:border-amber-800 border-l-4 border-l-amber-500 dark:border-l-amber-400',
  },
  success: {
    icon: IconCircleCheck,
    containerClasses: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconClasses: 'text-emerald-600 dark:text-emerald-400',
    titleClasses: 'text-emerald-900 dark:text-emerald-100',
    borderClasses: 'border-emerald-200 dark:border-emerald-800 border-l-4 border-l-emerald-500 dark:border-l-emerald-400',
  },
  error: {
    icon: IconAlertCircle,
    containerClasses: 'bg-red-50 dark:bg-red-950/30',
    iconClasses: 'text-red-600 dark:text-red-400',
    titleClasses: 'text-red-900 dark:text-red-100',
    borderClasses: 'border-red-200 dark:border-red-800 border-l-4 border-l-red-500 dark:border-l-red-400',
  },
};

/**
 * NestedContentRenderer - Internal component for rendering nested blocks
 * This avoids circular imports by implementing simplified rendering inline
 */
function NestedContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        // For nested blocks, we'll render a simplified version
        // to avoid deep recursion and circular imports
        switch (block.type) {
          case 'text':
            return (
              <p
                key={block.id}
                className="text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {block.content}
              </p>
            );
          case 'heading': {
            const headingTag = `h${block.level}`;
            const headingProps = {
              key: block.id,
              className: 'font-semibold text-slate-900 dark:text-slate-100 mt-2',
            };
            // Use React.createElement for dynamic heading tags
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
              block.items.map((item, idx) =>
                React.createElement('li', { key: idx }, item.content)
              )
            );
          }
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

/**
 * Render content - either string or nested blocks
 */
function renderContent(content: string | ContentBlock[]): React.ReactNode {
  if (typeof content === 'string') {
    return (
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
        {content}
      </p>
    );
  }

  // For nested blocks, use our internal renderer
  return <NestedContentRenderer blocks={content} />;
}

function CalloutBlock({ block }: CalloutBlockProps) {
  const config = variantConfig[block.variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 my-4',
        'flex gap-3',
        config.containerClasses,
        config.borderClasses,
        // RTL-aware layout
        'rtl:border-l-0 rtl:border-r-4',
        'rtl:flex-row-reverse'
      )}
      role="note"
      aria-label={`${block.variant} callout`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon
          className={cn(config.iconClasses, 'w-5 h-5')}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Optional Title */}
        {block.title && (
          <h4
            className={cn(
              'font-semibold text-base mb-2',
              config.titleClasses,
              'rtl:text-right ltr:text-left'
            )}
          >
            {block.title}
          </h4>
        )}

        {/* Content - string or nested blocks */}
        <div className="text-sm rtl:text-right ltr:text-left">
          {renderContent(block.content)}
        </div>
      </div>
    </div>
  );
}

export default CalloutBlock;
