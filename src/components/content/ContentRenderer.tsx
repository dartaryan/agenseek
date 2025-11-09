/**
 * ContentRenderer - Orchestrator component for rendering JSON content blocks
 *
 * Story 3.2: Dispatches content blocks to specific block components based on type
 * Story 10.4: Lazy load heavy components to reduce initial bundle size
 * Handles error boundaries and provides fallbacks for unknown block types
 */

import type { ContentBlock } from '@/types/content-blocks';
import React, { Suspense, lazy } from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import ListBlock from './blocks/ListBlock';
import CodeBlock from './blocks/CodeBlock';
import CalloutBlock from './blocks/CalloutBlock';
import ImageBlock from './blocks/ImageBlock';
import DividerBlock from './blocks/DividerBlock';
// Keep recursive blocks eager to avoid circular dependency issues
import AccordionBlock from './blocks/AccordionBlock';
import TabsBlock from './blocks/TabsBlock';
import { ContentErrorBoundary } from './ContentErrorBoundary';

// Story 10.4: Lazy load heavy/less common components
// ChartBlock is large (~100KB with Recharts)
const ChartBlock = lazy(() => import('./blocks/ChartBlock'));
// TableBlock, GridBlock, CardBlock, VideoBlock are less common and can be deferred
const TableBlock = lazy(() => import('./blocks/TableBlock'));
const GridBlock = lazy(() => import('./blocks/GridBlock'));
const CardBlock = lazy(() => import('./blocks/CardBlock'));
const VideoBlock = lazy(() => import('./blocks/VideoBlock'));

/**
 * Skeleton fallback for lazy-loaded block components
 * Provides appropriate loading states based on block type
 */
function BlockSkeleton({ type }: { type: string }) {
  const skeletons: Record<string, React.JSX.Element> = {
    chart: (
      <div className="my-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
    ),
    table: (
      <div className="my-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-t-lg mb-2"></div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    ),
    grid: (
      <div className="my-6 grid grid-cols-2 gap-4 animate-pulse">
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
    ),
    card: (
      <div className="my-6 animate-pulse">
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
    ),
    video: (
      <div className="my-6 animate-pulse">
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    ),
  };

  return skeletons[type] || (
    <div className="my-6 animate-pulse">
      <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
    </div>
  );
}

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
      return (
        <Suspense fallback={<BlockSkeleton type="table" />}>
          <TableBlock block={block} />
        </Suspense>
      );

    case 'accordion':
      return <AccordionBlock block={block} />;

    case 'tabs':
      return <TabsBlock block={block} />;

    case 'chart':
      return (
        <Suspense fallback={<BlockSkeleton type="chart" />}>
          <ChartBlock block={block} />
        </Suspense>
      );

    case 'grid':
      return (
        <Suspense fallback={<BlockSkeleton type="grid" />}>
          <GridBlock block={block} />
        </Suspense>
      );

    case 'card':
      return (
        <Suspense fallback={<BlockSkeleton type="card" />}>
          <CardBlock block={block} />
        </Suspense>
      );

    case 'image':
      return <ImageBlock block={block} />;

    case 'video':
      return (
        <Suspense fallback={<BlockSkeleton type="video" />}>
          <VideoBlock block={block} />
        </Suspense>
      );

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
