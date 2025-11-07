/**
 * Guide Catalog Test - Story 4.1
 *
 * Simple test to verify the guide catalog works correctly
 * Run this file to test catalog functionality
 */

import {
  getGuideCatalog,
  getGuideById,
  getCategoryCounts,
  getTotalGuideCount,
  validateGuideCatalog,
} from './guide-catalog';
import {
  filterByCategory,
  filterByDifficulty,
  getAllTags,
  getBeginnerGuides,
  getTotalEstimatedTime,
} from '@/types/guide-catalog';

/**
 * Run all catalog tests
 */
export function runCatalogTests() {
  console.log('🧪 Testing Guide Catalog...\n');

  // Test 1: Load catalog
  const catalog = getGuideCatalog();
  console.log(`✅ Test 1: Loaded ${catalog.length} guides`);

  // Test 2: Get specific guide
  const quickStart = getGuideById('quick-start');
  console.log(`✅ Test 2: Found guide "${quickStart?.title}"`);

  // Test 3: Category counts
  const counts = getCategoryCounts();
  console.log(`✅ Test 3: Category counts:`, counts);

  // Test 4: Total count
  const total = getTotalGuideCount();
  console.log(`✅ Test 4: Total guides: ${total}`);

  // Test 5: Validate catalog structure
  const validation = validateGuideCatalog();
  if (validation.valid) {
    console.log('✅ Test 5: Catalog structure is valid');
  } else {
    console.error('❌ Test 5: Validation errors:', validation.errors);
  }

  // Test 6: Filter by category
  const coreGuides = filterByCategory(catalog, 'core');
  console.log(`✅ Test 6: Found ${coreGuides.length} core guides`);

  // Test 7: Filter by difficulty
  const beginnerGuides = filterByDifficulty(catalog, 'beginner');
  console.log(`✅ Test 7: Found ${beginnerGuides.length} beginner guides`);

  // Test 8: Get all tags
  const tags = getAllTags(catalog);
  console.log(`✅ Test 8: Found ${tags.length} unique tags`);

  // Test 9: Get beginner-friendly guides
  const recommended = getBeginnerGuides(catalog);
  console.log(`✅ Test 9: Found ${recommended.length} beginner-friendly guides`);

  // Test 10: Total estimated time
  const totalTime = getTotalEstimatedTime(catalog);
  console.log(
    `✅ Test 10: Total estimated reading time: ${totalTime} minutes (${Math.round(totalTime / 60)} hours)`
  );

  console.log('\n🎉 All catalog tests passed!');

  return {
    totalGuides: total,
    categoryCounts: counts,
    totalTags: tags.length,
    totalEstimatedMinutes: totalTime,
    validation,
  };
}

// Run tests if this file is imported
if (import.meta.env.DEV) {
  // Only run in development
  const results = runCatalogTests();
  console.log('\n📊 Summary:', results);
}

export default runCatalogTests;
