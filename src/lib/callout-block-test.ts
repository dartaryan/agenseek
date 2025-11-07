/**
 * Test data for CalloutBlock component (Story 3.5)
 *
 * Tests all 4 variants with different content types
 */

import type { CalloutBlock } from '@/types/content-blocks';

// Test 1: Info variant with simple string content
export const infoCallout: CalloutBlock = {
  id: 'callout-info-1',
  type: 'callout',
  variant: 'info',
  title: 'Info: Getting Started',
  content: 'This is an informational callout with a title and simple text content.',
};

// Test 2: Warning variant without title
export const warningCallout: CalloutBlock = {
  id: 'callout-warning-1',
  type: 'callout',
  variant: 'warning',
  content: 'Important: Make sure to backup your data before proceeding!',
};

// Test 3: Success variant with nested content blocks
export const successCallout: CalloutBlock = {
  id: 'callout-success-1',
  type: 'callout',
  variant: 'success',
  title: 'Success: Story Complete!',
  content: [
    {
      id: 'nested-text-1',
      type: 'text',
      content: 'All acceptance criteria have been met:',
    },
    {
      id: 'nested-list-1',
      type: 'list',
      variant: 'unordered',
      items: [
        { content: '4 variants (info, warning, success, error)' },
        { content: 'Colored icons and borders' },
        { content: 'Optional title support' },
        { content: 'Nested content blocks' },
        { content: 'Dark mode support' },
        { content: 'RTL-aware layout' },
      ],
    },
  ],
};

// Test 4: Error variant with code example in content
export const errorCallout: CalloutBlock = {
  id: 'callout-error-1',
  type: 'callout',
  variant: 'error',
  title: 'Error: Common Mistake',
  content: [
    {
      id: 'nested-text-2',
      type: 'text',
      content: 'Avoid using any type in TypeScript:',
    },
    {
      id: 'nested-code-1',
      type: 'code',
      language: 'typescript',
      code: '// ❌ Bad\nconst data: any = fetchData();\n\n// ✅ Good\nconst data: UserData = fetchData();',
    },
  ],
};

// All test callouts for comprehensive testing
export const allCalloutTests: CalloutBlock[] = [
  infoCallout,
  warningCallout,
  successCallout,
  errorCallout,
];

console.log('✅ CalloutBlock test data compiled successfully');
console.log(`📊 Generated ${allCalloutTests.length} test cases`);
console.log('🎨 Variants: info, warning, success, error');
console.log('📝 Content types: string, nested blocks (text, list, code)');
console.log('🏷️  Title: with and without');

