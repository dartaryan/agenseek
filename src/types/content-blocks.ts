/**
 * Content Block Type Definitions for Agenseek
 *
 * Defines 14 content block types used in guide rendering:
 * 1. Heading
 * 2. Text
 * 3. List
 * 4. Code
 * 5. Callout
 * 6. Table
 * 7. Accordion
 * 8. Tabs
 * 9. Chart
 * 10. Grid
 * 11. Card
 * 12. Image
 * 13. Video
 * 14. Divider
 *
 * Uses discriminated unions for type-safe rendering
 */

// ============================================================================
// Base Block Type
// ============================================================================

export interface BaseBlock {
  id: string;
  type: string;
}

// ============================================================================
// 1. Heading Block
// ============================================================================

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
  anchor?: string; // For table of contents linking
}

// ============================================================================
// 2. Text Block (Paragraph with optional markdown)
// ============================================================================

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  markdown?: boolean; // Support inline markdown (bold, italic, links)
  alignment?: 'left' | 'center' | 'right';
}

// ============================================================================
// 3. List Block (Ordered or Unordered)
// ============================================================================

export interface ListItem {
  content: string;
  children?: ListItem[]; // For nested lists
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  variant: 'ordered' | 'unordered';
  items: ListItem[];
}

// ============================================================================
// 4. Code Block with Syntax Highlighting
// ============================================================================

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string; // e.g., 'typescript', 'javascript', 'python'
  code: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightedLines?: number[]; // Array of line numbers to highlight
}

// ============================================================================
// 5. Callout Block (Info, Warning, Success, Error)
// ============================================================================

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  content: string | ContentBlock[]; // Can contain nested blocks
}

// ============================================================================
// 6. Table Block
// ============================================================================

export interface TableCell {
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  caption?: string;
  headers: TableCell[];
  rows: TableRow[];
}

// ============================================================================
// 7. Accordion Block (Collapsible sections)
// ============================================================================

export interface AccordionItem {
  id: string;
  title: string;
  content: ContentBlock[]; // Can contain nested blocks
}

export interface AccordionBlock extends BaseBlock {
  type: 'accordion';
  items: AccordionItem[];
  allowMultiple?: boolean; // Allow multiple items open simultaneously
}

// ============================================================================
// 8. Tabs Block
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: ContentBlock[]; // Can contain nested blocks
}

export interface TabsBlock extends BaseBlock {
  type: 'tabs';
  items: TabItem[];
}

// ============================================================================
// 9. Chart Block (for data visualization)
// ============================================================================

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartBlock extends BaseBlock {
  type: 'chart';
  chartType: 'line' | 'bar' | 'area' | 'pie';
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
}

// ============================================================================
// 10. Grid Block (Multi-column layout)
// ============================================================================

export interface GridBlock extends BaseBlock {
  type: 'grid';
  columns: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  items: ContentBlock[][]; // Each array is content for one grid cell
}

// ============================================================================
// 11. Card Block
// ============================================================================

export interface CardBlock extends BaseBlock {
  type: 'card';
  variant: 'default' | 'elevated' | 'outlined';
  title?: string;
  content: ContentBlock[];
  footer?: string;
}

// ============================================================================
// 12. Image Block
// ============================================================================

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  lazy?: boolean; // Lazy loading
}

// ============================================================================
// 13. Video Block
// ============================================================================

export interface VideoBlock extends BaseBlock {
  type: 'video';
  src: string;
  title?: string;
  thumbnail?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
  autoplay?: boolean;
  controls?: boolean;
}

// ============================================================================
// 14. Divider Block (Horizontal rule)
// ============================================================================

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  variant?: 'solid' | 'dashed' | 'dotted';
}

// ============================================================================
// Discriminated Union of All Content Blocks
// ============================================================================

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | TableBlock
  | AccordionBlock
  | TabsBlock
  | ChartBlock
  | GridBlock
  | CardBlock
  | ImageBlock
  | VideoBlock
  | DividerBlock;

// ============================================================================
// Table of Contents Types
// ============================================================================

export interface TocSection {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: TocSection[];
}

// ============================================================================
// Guide Metadata and Structure
// ============================================================================

export interface GuideMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  icon: string;
  tags: string[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: string;
}

export interface Guide {
  metadata: GuideMetadata;
  tableOfContents: TocSection[];
  content: ContentBlock[];
}

// ============================================================================
// Category Types
// ============================================================================

export type GuideCategory =
  | 'Core Principles'
  | 'Agents & Workflows'
  | 'Architecture & Design'
  | 'Implementation & Development'
  | 'Testing & Quality'
  | 'Game Development'
  | 'Creative Processes'
  | 'Team Collaboration'
  | 'Project Management'
  | 'Tools & Resources';

export type GuideDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ============================================================================
// Type Guards for Runtime Type Checking
// ============================================================================

export function isHeadingBlock(block: ContentBlock): block is HeadingBlock {
  return block.type === 'heading';
}

export function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text';
}

export function isListBlock(block: ContentBlock): block is ListBlock {
  return block.type === 'list';
}

export function isCodeBlock(block: ContentBlock): block is CodeBlock {
  return block.type === 'code';
}

export function isCalloutBlock(block: ContentBlock): block is CalloutBlock {
  return block.type === 'callout';
}

export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === 'table';
}

export function isAccordionBlock(block: ContentBlock): block is AccordionBlock {
  return block.type === 'accordion';
}

export function isTabsBlock(block: ContentBlock): block is TabsBlock {
  return block.type === 'tabs';
}

export function isChartBlock(block: ContentBlock): block is ChartBlock {
  return block.type === 'chart';
}

export function isGridBlock(block: ContentBlock): block is GridBlock {
  return block.type === 'grid';
}

export function isCardBlock(block: ContentBlock): block is CardBlock {
  return block.type === 'card';
}

export function isImageBlock(block: ContentBlock): block is ImageBlock {
  return block.type === 'image';
}

export function isVideoBlock(block: ContentBlock): block is VideoBlock {
  return block.type === 'video';
}

export function isDividerBlock(block: ContentBlock): block is DividerBlock {
  return block.type === 'divider';
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract block type from ContentBlock discriminated union
 */
export type BlockType = ContentBlock['type'];

/**
 * Map block type string to specific block interface
 */
export type BlockTypeMap = {
  heading: HeadingBlock;
  text: TextBlock;
  list: ListBlock;
  code: CodeBlock;
  callout: CalloutBlock;
  table: TableBlock;
  accordion: AccordionBlock;
  tabs: TabsBlock;
  chart: ChartBlock;
  grid: GridBlock;
  card: CardBlock;
  image: ImageBlock;
  video: VideoBlock;
  divider: DividerBlock;
};

// ============================================================================
// Sample Guide Structure (for testing/documentation)
// ============================================================================

export const SAMPLE_GUIDE: Guide = {
  metadata: {
    id: 'sample-guide',
    slug: 'sample-guide',
    title: 'Sample Guide Title',
    description: 'This is a sample guide demonstrating all content block types',
    category: 'Core Principles',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    icon: 'IconBook',
    tags: ['sample', 'demo', 'example'],
  },
  tableOfContents: [
    {
      id: 'intro',
      title: 'Introduction',
      level: 1,
      anchor: 'introduction',
    },
    {
      id: 'content',
      title: 'Content Types',
      level: 1,
      anchor: 'content-types',
      children: [
        {
          id: 'text',
          title: 'Text Blocks',
          level: 2,
          anchor: 'text-blocks',
        },
        {
          id: 'code',
          title: 'Code Blocks',
          level: 2,
          anchor: 'code-blocks',
        },
      ],
    },
  ],
  content: [
    {
      id: 'h1',
      type: 'heading',
      level: 1,
      content: 'Sample Guide Title',
      anchor: 'introduction',
    },
    {
      id: 'p1',
      type: 'text',
      content: 'This is a paragraph of text demonstrating the text block type.',
    },
    {
      id: 'code1',
      type: 'code',
      language: 'typescript',
      code: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
      showLineNumbers: true,
    },
    {
      id: 'div1',
      type: 'divider',
    },
  ],
};
