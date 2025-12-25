/**
 * TabsBlock - Horizontal tabs with content panels
 * Story 3.8 - Implements Shadcn/ui Tabs with nested content support
 * Extended: Supports both 'items' (TypeScript interface) and 'tabs' (JSON format) arrays
 */

import type { TabsBlock as TabsBlockType, TabItem } from '@/types/content-blocks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContentRenderer from '../ContentRenderer';

/**
 * Extended TabsBlock type to support 'tabs' array from JSON
 */
interface ExtendedTabsBlockType extends Omit<TabsBlockType, 'items'> {
  items?: TabItem[];
  tabs?: TabItem[];  // Legacy property used in some JSON files
}

interface TabsBlockProps {
  block: ExtendedTabsBlockType;
}

function TabsBlock({ block }: TabsBlockProps) {
  // Support both 'items' (standard) and 'tabs' (legacy) properties
  const items = block.items || block.tabs;

  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
        <p className="text-sm font-medium">
          שגיאה: בלוק טאבים חייב להכיל לפחות פריט אחד
        </p>
      </div>
    );
  }

  // Use the first tab as the default value with fallback
  const defaultValue = items[0].id || 'tab-0';

  return (
    <div className="my-6">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 p-1 h-auto flex-wrap">
          {items.map((tab, index) => {
            // Use tab.id if available, otherwise fallback to index to ensure unique keys
            const uniqueKey = tab.id || `tab-trigger-${index}`;
            const uniqueValue = tab.id || `tab-${index}`;

            return (
              <TabsTrigger
                key={uniqueKey}
                value={uniqueValue}
                className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rtl:text-right ltr:text-left"
              >
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {items.map((tab, index) => {
          // Use tab.id if available, otherwise fallback to index to ensure unique keys
          const uniqueKey = tab.id || `tab-content-${index}`;
          const uniqueValue = tab.id || `tab-${index}`;

          // Handle content: if it's a string (markdown), wrap it in a text block
          // If it's already an array, use it as-is
          let contentBlocks = tab.content;
          if (typeof tab.content === 'string') {
            contentBlocks = [
              {
                id: `${uniqueKey}-text`,
                type: 'text',
                content: tab.content,
                markdown: true,
              },
            ];
          }

          return (
            <TabsContent
              key={uniqueKey}
              value={uniqueValue}
              className="mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="space-y-4">
                <ContentRenderer blocks={contentBlocks} />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

export default TabsBlock;
