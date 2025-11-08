/**
 * Search Infrastructure Demo - Story 7.1
 *
 * Demonstrates the search functionality with example usage
 * This file can be imported in the browser console for manual testing
 */

import {
  searchAll,
  searchGuides,
  extractTextFromTiptap,
  highlightMatches,
  getMatchSnippet,
} from './search';
import { getGuideCatalog } from './guide-catalog';

/**
 * Example: Search guides by query
 */
export function demoSearchGuides(query: string) {
  const guides = getGuideCatalog();
  const results = searchGuides(query, guides);

  console.log(`🔍 Searching guides for: "${query}"`);
  console.log(`📊 Found ${results.length} results\n`);

  results.slice(0, 5).forEach((result, index) => {
    console.log(`${index + 1}. ${result.item.title}`);
    console.log(`   Score: ${result.score.toFixed(3)}`);
    console.log(`   Category: ${result.item.category}`);
    console.log(`   Tags: ${result.item.tags.join(', ')}`);
    if (result.matches.length > 0) {
      console.log(`   Matches: ${result.matches.map((m) => m.key).join(', ')}`);
    }
    console.log('');
  });

  return results;
}

/**
 * Example: Extract text from Tiptap JSON
 */
export function demoExtractText() {
  const tiptapContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'זהו ' },
          { type: 'text', text: 'דוגמא ', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'לחילוץ טקסט' },
        ],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'פסקה שנייה עם תוכן נוסף' }],
      },
    ],
  };

  const extracted = extractTextFromTiptap(tiptapContent);
  console.log('📝 Tiptap Content:');
  console.log(JSON.stringify(tiptapContent, null, 2));
  console.log('\n✨ Extracted Text:');
  console.log(extracted);

  return extracted;
}

/**
 * Example: Highlight matches in text
 */
export function demoHighlight() {
  const text = 'מדריך התחלה מהיר לשימוש במתודולוגיה';
  const indices: [number, number][] = [
    [0, 4], // "מדריך"
    [14, 19], // "מהיר"
  ];

  const highlighted = highlightMatches(text, indices);
  console.log('🎨 Original text:');
  console.log(text);
  console.log('\n✨ Highlighted:');
  console.log(highlighted);

  return highlighted;
}

/**
 * Example: Get match snippet
 */
export function demoSnippet() {
  const longText =
    'זהו טקסט ארוך מאוד שמכיל הרבה מידע. במקום כלשהו באמצע יש מילת מפתח חשובה. ' +
    'אנחנו רוצים להציג קטע קצר מהטקסט שמכיל את ההתאמה. ' +
    'זה עוזר למשתמשים לראות את ההקשר של החיפוש.';

  const indices: [number, number][] = [[60, 71]]; // "מילת מפתח"
  const snippet = getMatchSnippet(longText, indices, 80);

  console.log('📄 Full text:');
  console.log(longText);
  console.log('\n✂️ Snippet (max 80 chars):');
  console.log(snippet);

  return snippet;
}

/**
 * Example: Search all content types
 */
export async function demoSearchAll(query: string) {
  console.log(`🔍 Searching all content for: "${query}"`);

  const guides = getGuideCatalog();

  // For demo purposes, use empty arrays for notes and tasks
  // In real usage, these would be fetched from the database
  const results = searchAll(query, guides, [], []);

  console.log('\n📊 Results Summary:');
  console.log(`   Guides: ${results.guides.length}`);
  console.log(`   Notes: ${results.notes.length}`);
  console.log(`   Tasks: ${results.tasks.length}`);
  console.log(`   Total: ${results.all.length}`);

  if (results.all.length > 0) {
    console.log('\n🏆 Top 3 Results (all types):');
    results.all.slice(0, 3).forEach((result, index) => {
      console.log(`\n${index + 1}. [${result.type.toUpperCase()}]`);
      if (result.type === 'guide') {
        console.log(`   ${result.item.title}`);
      } else if (result.type === 'note') {
        console.log(`   ${result.item.title}`);
      } else if (result.type === 'task') {
        console.log(`   ${result.item.title}`);
      }
      console.log(`   Score: ${result.score.toFixed(3)}`);
    });
  }

  return results;
}

/**
 * Run all demos
 */
export function runAllDemos() {
  console.log('🚀 Search Infrastructure Demo - Story 7.1\n');
  console.log('=' .repeat(60) + '\n');

  console.log('Demo 1: Extract Text from Tiptap');
  console.log('-'.repeat(60));
  demoExtractText();

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('Demo 2: Highlight Matches');
  console.log('-'.repeat(60));
  demoHighlight();

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('Demo 3: Get Match Snippet');
  console.log('-'.repeat(60));
  demoSnippet();

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('Demo 4: Search Guides');
  console.log('-'.repeat(60));
  demoSearchGuides('BMAD');

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('Demo 5: Search All Content');
  console.log('-'.repeat(60));
  demoSearchAll('מדריך');

  console.log('\n✅ All demos completed!\n');
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as unknown as { searchDemo: unknown }).searchDemo = {
    runAll: runAllDemos,
    searchGuides: demoSearchGuides,
    extractText: demoExtractText,
    highlight: demoHighlight,
    snippet: demoSnippet,
    searchAll: demoSearchAll,
  };
}

