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
  TableBlock,
  AccordionBlock,
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

// Comprehensive CalloutBlock tests for Story 3.5
export const calloutBlockTests: ContentBlock[] = [
  // Info variant with title
  {
    id: 'callout-info',
    type: 'callout',
    variant: 'info',
    title: 'מידע חשוב',
    content: 'זהו הודעת מידע עם כותרת. השתמש בסוג זה למידע כללי.',
  } satisfies CalloutBlock,

  // Warning variant without title
  {
    id: 'callout-warning',
    type: 'callout',
    variant: 'warning',
    content: 'זוהי אזהרה ללא כותרת. שימו לב לסיכון הפוטנציאלי.',
  } satisfies CalloutBlock,

  // Success variant with title
  {
    id: 'callout-success',
    type: 'callout',
    variant: 'success',
    title: 'Success!',
    content: 'This is a success callout. Use it for positive feedback and accomplishments.',
  } satisfies CalloutBlock,

  // Error variant with title
  {
    id: 'callout-error',
    type: 'callout',
    variant: 'error',
    title: 'Error Detected',
    content: 'This is an error callout. Use it for critical issues and errors.',
  } satisfies CalloutBlock,

  // Callout with nested content blocks
  {
    id: 'callout-nested',
    type: 'callout',
    variant: 'info',
    title: 'Advanced Usage',
    content: [
      {
        id: 'nested-text',
        type: 'text',
        content: 'Callouts can contain nested blocks like this text.',
      },
      {
        id: 'nested-list',
        type: 'list',
        variant: 'unordered',
        items: [
          { content: 'First nested item' },
          { content: 'Second nested item' },
          { content: 'Third nested item' },
        ],
      },
      {
        id: 'nested-code',
        type: 'code',
        language: 'typescript',
        code: 'const nested = "This code is inside a callout!";',
        showLineNumbers: false,
      },
    ],
  } satisfies CalloutBlock,
];

// Comprehensive TableBlock tests for Story 3.6
export const tableBlockTests: ContentBlock[] = [
  // Simple table without caption
  {
    id: 'table-simple',
    type: 'table',
    headers: [
      { content: 'תפקיד', alignment: 'left' },
      { content: 'אחריות', alignment: 'left' },
      { content: 'דוגמה', alignment: 'left' },
    ],
    rows: [
      {
        cells: [
          { content: 'מפתח', alignment: 'left' },
          { content: 'מימוש קוד', alignment: 'left' },
          { content: 'React, TypeScript', alignment: 'left' },
        ],
      },
      {
        cells: [
          { content: 'אדריכל', alignment: 'left' },
          { content: 'עיצוב מערכת', alignment: 'left' },
          { content: 'תשתית, דפוסים', alignment: 'left' },
        ],
      },
      {
        cells: [
          { content: 'מנהל מוצר', alignment: 'left' },
          { content: 'דרישות', alignment: 'left' },
          { content: 'תיעדוף, סטוריז', alignment: 'left' },
        ],
      },
    ],
  } satisfies TableBlock,

  // Table with caption and mixed alignment
  {
    id: 'table-with-caption',
    type: 'table',
    caption: 'סטטיסטיקות תכנון ספרינט - רבעון 4 2025',
    headers: [
      { content: 'שבוע', alignment: 'left' },
      { content: 'סטוריז מתוכננים', alignment: 'center' },
      { content: 'נקודות', alignment: 'center' },
      { content: 'סטטוס', alignment: 'right' },
    ],
    rows: [
      {
        cells: [
          { content: 'שבוע 1', alignment: 'left' },
          { content: '10', alignment: 'center' },
          { content: '21', alignment: 'center' },
          { content: '✓ הושלם', alignment: 'right' },
        ],
      },
      {
        cells: [
          { content: 'שבוע 2', alignment: 'left' },
          { content: '10', alignment: 'center' },
          { content: '18', alignment: 'center' },
          { content: '✓ הושלם', alignment: 'right' },
        ],
      },
      {
        cells: [
          { content: 'שבוע 3', alignment: 'left' },
          { content: '8', alignment: 'center' },
          { content: '16', alignment: 'center' },
          { content: '⏳ בתהליך', alignment: 'right' },
        ],
      },
      {
        cells: [
          { content: 'שבוע 4', alignment: 'left' },
          { content: '12', alignment: 'center' },
          { content: '24', alignment: 'center' },
          { content: '⏰ מתוכנן', alignment: 'right' },
        ],
      },
    ],
  } satisfies TableBlock,

  // Table with English content and right-aligned numbers
  {
    id: 'table-english',
    type: 'table',
    caption: 'Component Library Performance Metrics',
    headers: [
      { content: 'Component', alignment: 'left' },
      { content: 'Bundle Size (KB)', alignment: 'right' },
      { content: 'Load Time (ms)', alignment: 'right' },
      { content: 'Rating', alignment: 'center' },
    ],
    rows: [
      {
        cells: [
          { content: 'ContentRenderer', alignment: 'left' },
          { content: '12.5', alignment: 'right' },
          { content: '42', alignment: 'right' },
          { content: '⭐⭐⭐⭐⭐', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'CodeBlock', alignment: 'left' },
          { content: '45.8', alignment: 'right' },
          { content: '156', alignment: 'right' },
          { content: '⭐⭐⭐⭐', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'CalloutBlock', alignment: 'left' },
          { content: '8.2', alignment: 'right' },
          { content: '28', alignment: 'right' },
          { content: '⭐⭐⭐⭐⭐', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'TableBlock', alignment: 'left' },
          { content: '6.1', alignment: 'right' },
          { content: '18', alignment: 'right' },
          { content: '⭐⭐⭐⭐⭐', alignment: 'center' },
        ],
      },
    ],
  } satisfies TableBlock,

  // Complex table with many rows (zebra striping test)
  {
    id: 'table-many-rows',
    type: 'table',
    caption: 'Sprint 4 Story Completion Status',
    headers: [
      { content: 'Story ID', alignment: 'left' },
      { content: 'Description', alignment: 'left' },
      { content: 'Points', alignment: 'center' },
      { content: 'Status', alignment: 'center' },
    ],
    rows: [
      {
        cells: [
          { content: '3.1', alignment: 'left' },
          { content: 'Define TypeScript Types', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '✓', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.2', alignment: 'left' },
          { content: 'Content Renderer Orchestrator', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '✓', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.3', alignment: 'left' },
          { content: 'Core Block Components', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '✓', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.4', alignment: 'left' },
          { content: 'Code Block with Syntax Highlighting', alignment: 'left' },
          { content: '3', alignment: 'center' },
          { content: '✓', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.5', alignment: 'left' },
          { content: 'Callout Block Component', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '✓', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.6', alignment: 'left' },
          { content: 'Table Block Component', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '⏳', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.7', alignment: 'left' },
          { content: 'Accordion Block Component', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '⏰', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: '3.8', alignment: 'left' },
          { content: 'Tabs Block Component', alignment: 'left' },
          { content: '2', alignment: 'center' },
          { content: '⏰', alignment: 'center' },
        ],
      },
    ],
  } satisfies TableBlock,

  // Narrow table (responsive test)
  {
    id: 'table-narrow',
    type: 'table',
    caption: 'Priority Levels',
    headers: [
      { content: 'Level', alignment: 'center' },
      { content: 'Label', alignment: 'center' },
    ],
    rows: [
      {
        cells: [
          { content: 'P0', alignment: 'center' },
          { content: 'Critical', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'P1', alignment: 'center' },
          { content: 'High', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'P2', alignment: 'center' },
          { content: 'Medium', alignment: 'center' },
        ],
      },
      {
        cells: [
          { content: 'P3', alignment: 'center' },
          { content: 'Low', alignment: 'center' },
        ],
      },
    ],
  } satisfies TableBlock,
];

// Comprehensive AccordionBlock tests for Story 3.7
export const accordionBlockTests: ContentBlock[] = [
  // Simple accordion with single selection (default)
  {
    id: 'accordion-simple',
    type: 'accordion',
    items: [
      {
        id: 'faq-1',
        title: 'מהי שיטת BMAD?',
        content: [
          {
            id: 'faq-1-text',
            type: 'text',
            content: 'BMAD (Business Modeling and Agile Development) היא מתודולוגיה למודלינג עסקי ופיתוח זריז המשלבת עקרונות ניהול מוצר, ארכיטקטורה ופיתוח.',
          },
        ],
      },
      {
        id: 'faq-2',
        title: 'מי יכול להשתמש ב-BMAD?',
        content: [
          {
            id: 'faq-2-text',
            type: 'text',
            content: 'כל צוות פיתוח המעוניין לשפר את תהליך העבודה שלו - מפתחים, מנהלי מוצר, ארכיטקטים, מעצבים ועוד.',
          },
        ],
      },
      {
        id: 'faq-3',
        title: 'האם BMAD מתאים לפרויקטים קטנים?',
        content: [
          {
            id: 'faq-3-text',
            type: 'text',
            content: 'כן! BMAD גמיש וניתן להתאמה לפרויקטים בכל גודל. אתה יכול להשתמש רק בחלקים הרלוונטיים לפרויקט שלך.',
          },
        ],
      },
    ],
    allowMultiple: false,
  } satisfies AccordionBlock,

  // Accordion with multiple selection allowed
  {
    id: 'accordion-multiple',
    type: 'accordion',
    items: [
      {
        id: 'role-dev',
        title: 'מפתח (Developer)',
        content: [
          {
            id: 'role-dev-desc',
            type: 'text',
            content: 'מפתח אחראי על מימוש הקוד, כתיבת בדיקות, ועבודה עם מערכת ניהול הגרסאות.',
          },
          {
            id: 'role-dev-list',
            type: 'list',
            variant: 'unordered',
            items: [
              { content: 'כתיבת קוד נקי ומתועד' },
              { content: 'עבודה לפי הארכיטקטורה המוגדרת' },
              { content: 'ביצוע code reviews' },
              { content: 'כתיבת unit tests' },
            ],
          },
        ],
      },
      {
        id: 'role-architect',
        title: 'ארכיטקט (Architect)',
        content: [
          {
            id: 'role-arch-desc',
            type: 'text',
            content: 'ארכיטקט מעצב את המבנה הטכני של המערכת ומוודא שהפתרון ניתן להרחבה ותחזוקה.',
          },
          {
            id: 'role-arch-list',
            type: 'list',
            variant: 'unordered',
            items: [
              { content: 'עיצוב ארכיטקטורת המערכת' },
              { content: 'קביעת סטנדרטים טכניים' },
              { content: 'סקירת קוד ארכיטקטונית' },
            ],
          },
        ],
      },
      {
        id: 'role-pm',
        title: 'מנהל מוצר (Product Manager)',
        content: [
          {
            id: 'role-pm-desc',
            type: 'text',
            content: 'מנהל המוצר אחראי על חזון המוצר, תיעדוף הדרישות, וקבלת החלטות עסקיות.',
          },
          {
            id: 'role-pm-list',
            type: 'list',
            variant: 'unordered',
            items: [
              { content: 'הגדרת דרישות המוצר' },
              { content: 'תיעדוף Backlog' },
              { content: 'ניהול Stakeholders' },
            ],
          },
        ],
      },
    ],
    allowMultiple: true,
  } satisfies AccordionBlock,

  // Accordion with nested content blocks (code, callout)
  {
    id: 'accordion-rich-content',
    type: 'accordion',
    items: [
      {
        id: 'setup-step1',
        title: 'Step 1: Install Dependencies',
        content: [
          {
            id: 'setup-step1-text',
            type: 'text',
            content: 'First, install the required npm packages:',
          },
          {
            id: 'setup-step1-code',
            type: 'code',
            language: 'bash',
            code: 'npm install react react-dom typescript vite\nnpm install -D tailwindcss postcss autoprefixer',
            showLineNumbers: false,
          },
          {
            id: 'setup-step1-callout',
            type: 'callout',
            variant: 'info',
            title: 'Tip',
            content: 'Make sure you have Node.js 18+ installed before running these commands.',
          },
        ],
      },
      {
        id: 'setup-step2',
        title: 'Step 2: Configure TypeScript',
        content: [
          {
            id: 'setup-step2-text',
            type: 'text',
            content: 'Create a tsconfig.json file with strict mode enabled:',
          },
          {
            id: 'setup-step2-code',
            type: 'code',
            language: 'json',
            code: `{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}`,
            filename: 'tsconfig.json',
            showLineNumbers: true,
          },
        ],
      },
      {
        id: 'setup-step3',
        title: 'Step 3: Run Development Server',
        content: [
          {
            id: 'setup-step3-text',
            type: 'text',
            content: 'Start the development server:',
          },
          {
            id: 'setup-step3-code',
            type: 'code',
            language: 'bash',
            code: 'npm run dev',
            showLineNumbers: false,
          },
          {
            id: 'setup-step3-callout',
            type: 'callout',
            variant: 'success',
            title: 'Success!',
            content: 'Your development server should now be running on http://localhost:5173',
          },
        ],
      },
    ],
    allowMultiple: false,
  } satisfies AccordionBlock,

  // Accordion with single item (minimal example)
  {
    id: 'accordion-single',
    type: 'accordion',
    items: [
      {
        id: 'single-item',
        title: 'לחץ כאן לפתיחת המידע',
        content: [
          {
            id: 'single-text',
            type: 'text',
            content: 'זהו אקורדיון עם פריט בודד. שימושי להסתרת מידע נוסף או פרטים משניים.',
          },
        ],
      },
    ],
    allowMultiple: false,
  } satisfies AccordionBlock,

  // Accordion with English content
  {
    id: 'accordion-english',
    type: 'accordion',
    items: [
      {
        id: 'en-1',
        title: 'What are Content Blocks?',
        content: [
          {
            id: 'en-1-text',
            type: 'text',
            content: 'Content blocks are modular, reusable components that make up guide content. Each block has a specific purpose and visual style.',
          },
        ],
      },
      {
        id: 'en-2',
        title: 'How do I use AccordionBlock?',
        content: [
          {
            id: 'en-2-text',
            type: 'text',
            content: 'Simply define an accordion with items, each containing a title and nested content blocks:',
          },
          {
            id: 'en-2-code',
            type: 'code',
            language: 'typescript',
            code: `const accordion: AccordionBlock = {
  type: 'accordion',
  items: [
    {
      id: 'item1',
      title: 'Question',
      content: [...]
    }
  ]
}`,
            showLineNumbers: false,
          },
        ],
      },
      {
        id: 'en-3',
        title: 'Can I nest blocks inside accordion?',
        content: [
          {
            id: 'en-3-text',
            type: 'text',
            content: 'Yes! Accordion content can contain any content blocks including text, code, callouts, lists, and even other accordions.',
          },
        ],
      },
    ],
    allowMultiple: true,
  } satisfies AccordionBlock,
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
    default: {
      // TypeScript ensures this is unreachable if all cases are handled
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
