/**
 * Test Converted Guides - Story 4.2
 *
 * Quick test to verify the 3 converted guides load correctly
 */

import type { Guide } from '@/types/content-blocks';

/**
 * Test that all 3 guides can be imported
 */
export async function testConvertedGuides() {
  console.log('🧪 Testing Story 4.2 Converted Guides...\n');

  const guides: Array<{ name: string; path: string }> = [
    { name: 'Quick Start', path: '../content/locale/he/guides/core/quick-start.json' },
    { name: 'Developers', path: '../content/locale/he/guides/roles/developers.json' },
    { name: 'Intro PM Analyst', path: '../content/locale/he/guides/agents/intro-pm-analyst.json' },
  ];

  for (const guideInfo of guides) {
    try {
      // In Node/Vite, we can use dynamic imports
      const guideData = await import(guideInfo.path);
      const guide: Guide = guideData.default || guideData;

      // Validate structure
      if (!guide.metadata) {
        console.error(`❌ ${guideInfo.name}: Missing metadata`);
        continue;
      }

      if (!guide.tableOfContents) {
        console.error(`❌ ${guideInfo.name}: Missing tableOfContents`);
        continue;
      }

      if (!guide.content || !Array.isArray(guide.content)) {
        console.error(`❌ ${guideInfo.name}: Missing or invalid content array`);
        continue;
      }

      // Check metadata fields
      const requiredMetadataFields = [
        'id',
        'slug',
        'title',
        'description',
        'category',
        'difficulty',
      ];
      const missingFields = requiredMetadataFields.filter(
        (field) => !guide.metadata[field as keyof typeof guide.metadata]
      );

      if (missingFields.length > 0) {
        console.error(`❌ ${guideInfo.name}: Missing metadata fields: ${missingFields.join(', ')}`);
        continue;
      }

      // Count block types
      const blockTypeCounts: Record<string, number> = {};
      guide.content.forEach((block) => {
        blockTypeCounts[block.type] = (blockTypeCounts[block.type] || 0) + 1;
      });

      console.log(`✅ ${guideInfo.name}:`);
      console.log(`   - Metadata: ${guide.metadata.title}`);
      console.log(`   - TOC sections: ${guide.tableOfContents.length}`);
      console.log(`   - Content blocks: ${guide.content.length}`);
      console.log(`   - Block types used:`, Object.keys(blockTypeCounts).join(', '));
      console.log(`   - Estimated time: ${guide.metadata.estimatedMinutes} min`);
      console.log('');
    } catch (error) {
      console.error(`❌ ${guideInfo.name}: Failed to load`);
      console.error(`   Error: ${(error as Error).message}`);
      console.log('');
    }
  }

  console.log('✅ Story 4.2: All guides tested\n');
}

// Can be called from component or dev script
export default testConvertedGuides;
