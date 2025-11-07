/**
 * ContentRenderer - Orchestrator component for rendering JSON content blocks
 *
 * Story 3.2: Dispatches content blocks to specific block components based on type
 * Handles error boundaries and provides fallbacks for unknown block types
 */

import type { ContentBlock } from '@/types/content-blocks';
import React from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import ListBlock from './blocks/ListBlock';
import CodeBlock from './blocks/CodeBlock';
import CalloutBlock from './blocks/CalloutBlock';
import TableBlock from './blocks/TableBlock';
import AccordionBlock from './blocks/AccordionBlock';
import TabsBlock from './blocks/TabsBlock';
import ChartBlock from './blocks/ChartBlock';
import GridBlock from './blocks/GridBlock';
import CardBlock from './blocks/CardBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import DividerBlock from './blocks/DividerBlock';
import { ContentErrorBoundary } from './ContentErrorBoundary';

interface ContentRendererProps {
  blocks: ContentBlock[];
}

/**
 * Main content renderer component
 * Maps over blocks and dispatches each to the appropriate block component
 */
export function ContentRenderer({ blocks }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>אין תוכן להצגה</p>
      </div>
    );
  }

  return (
    <div className="content-renderer space-y-4">
      {blocks.map((block, index) => (
        <ContentErrorBoundary key={block.id || `block-${index}`} blockType={block.type}>
          {renderBlock(block)}
        </ContentErrorBoundary>
      ))}
    </div>
  );
}

/**
 * Dispatcher function - switches on block type and renders the appropriate component
 * Returns fallback UI for unknown block types
 */
function renderBlock(block: ContentBlock): React.JSX.Element {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />;

    case 'text':
      return <TextBlock block={block} />;

    case 'list':
      return <ListBlock block={block} />;

    case 'code':
      return <CodeBlock block={block} />;

    case 'callout':
      return <CalloutBlock block={block} />;

    case 'table':
      return <TableBlock block={block} />;

    case 'accordion':
      return <AccordionBlock block={block} />;

    case 'tabs':
      return <TabsBlock block={block} />;

    case 'chart':
      return <ChartBlock block={block} />;

    case 'grid':
      return <GridBlock block={block} />;

    case 'card':
      return <CardBlock block={block} />;

    case 'image':
      return <ImageBlock block={block} />;

    case 'video':
      return <VideoBlock block={block} />;

    case 'divider':
      return <DividerBlock block={block} />;

    default:
      // Fallback for unknown block types
      console.warn(`Unknown block type encountered: ${(block as { type: string }).type}`);
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <p className="text-sm font-medium">
            סוג בלוק לא נתמך: {(block as { type: string }).type}
          </p>
          <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(block, null, 2)}</pre>
        </div>
      );
  }
}

export default ContentRenderer;
