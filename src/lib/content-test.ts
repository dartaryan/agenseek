/**
 * Content Block Types Test
 * Demonstrates usage of content block types
 */

import type {
  ContentBlock,
  Guide,
  HeadingBlock,
  TextBlock,
  CodeBlock,
  CalloutBlock,
} from '../types/content-blocks';

// Sample content blocks demonstrating type safety
export const sampleBlocks: ContentBlock[] = [
  {
    id: 'h1',
    type: 'heading',
    level: 1,
    content: 'Welcome to Agenseek',
    anchor: 'welcome',
  } satisfies HeadingBlock,

  {
    id: 'p1',
    type: 'text',
    content: 'This is a sample guide demonstrating the content block system.',
    markdown: true,
  } satisfies TextBlock,

  {
    id: 'code1',
    type: 'code',
    language: 'typescript',
    code: `interface User {
  id: string;
  name: string;
  email: string;
}`,
    filename: 'user.ts',
    showLineNumbers: true,
  } satisfies CodeBlock,

  {
    id: 'callout1',
    type: 'callout',
    variant: 'info',
    title: 'Important Note',
    content: 'This is an informational callout demonstrating the callout block type.',
  } satisfies CalloutBlock,

  {
    id: 'div1',
    type: 'divider',
  },
];

// Sample guide demonstrating full structure
export const sampleGuide: Guide = {
  metadata: {
    id: 'getting-started',
    slug: 'getting-started',
    title: 'Getting Started with BMAD',
    description: 'Learn the basics of the BMAD method and how to apply it to your projects',
    category: 'Core Principles',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    icon: 'IconRocket',
    tags: ['getting-started', 'basics', 'introduction'],
  },
  tableOfContents: [
    {
      id: 'welcome',
      title: 'Welcome',
      level: 1,
      anchor: 'welcome',
    },
    {
      id: 'basics',
      title: 'BMAD Basics',
      level: 1,
      anchor: 'basics',
      children: [
        {
          id: 'what-is-bmad',
          title: 'What is BMAD?',
          level: 2,
          anchor: 'what-is-bmad',
        },
        {
          id: 'why-bmad',
          title: 'Why use BMAD?',
          level: 2,
          anchor: 'why-bmad',
        },
      ],
    },
  ],
  content: sampleBlocks,
};

// Test type guards
export function testTypeGuards(block: ContentBlock): string {
  if (block.type === 'heading') {
    // TypeScript knows this is a HeadingBlock
    return `Heading level ${block.level}: ${block.content}`;
  }

  if (block.type === 'text') {
    // TypeScript knows this is a TextBlock
    return `Text: ${block.content}`;
  }

  if (block.type === 'code') {
    // TypeScript knows this is a CodeBlock
    return `Code (${block.language}): ${block.code.length} characters`;
  }

  return `Unknown block type: ${block.type}`;
}

// Test discriminated union exhaustiveness checking
export function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case 'heading':
      return `<h${block.level}>${block.content}</h${block.level}>`;
    case 'text':
      return `<p>${block.content}</p>`;
    case 'list':
      return `<${block.variant === 'ordered' ? 'ol' : 'ul'}>${block.items.length} items</${block.variant === 'ordered' ? 'ol' : 'ul'}>`;
    case 'code':
      return `<pre><code class="language-${block.language}">${block.code}</code></pre>`;
    case 'callout':
      return `<div class="callout callout-${block.variant}">${block.content}</div>`;
    case 'table':
      return `<table>${block.rows.length} rows</table>`;
    case 'accordion':
      return `<accordion>${block.items.length} items</accordion>`;
    case 'tabs':
      return `<tabs>${block.items.length} tabs</tabs>`;
    case 'chart':
      return `<chart type="${block.chartType}">${block.data.length} points</chart>`;
    case 'grid':
      return `<grid columns="${block.columns}">${block.items.length} cells</grid>`;
    case 'card':
      return `<card variant="${block.variant}"></card>`;
    case 'image':
      return `<img src="${block.src}" alt="${block.alt}" />`;
    case 'video':
      return `<video src="${block.src}"></video>`;
    case 'divider':
      return `<hr />`;
    default:
      // TypeScript ensures this is unreachable if all cases are handled
      const _exhaustive: never = block;
      return _exhaustive;
  }
}
