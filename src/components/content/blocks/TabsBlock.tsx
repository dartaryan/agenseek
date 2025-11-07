/**
 * TabsBlock - Horizontal tabs with content panels
 * Story 3.8 - Implements Shadcn/ui Tabs with nested content support
 */

import type { TabsBlock as TabsBlockType } from '@/types/content-blocks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContentRenderer from '../ContentRenderer';

interface TabsBlockProps {
  block: TabsBlockType;
}

function TabsBlock({ block }: TabsBlockProps) {
  const { items } = block;

  // Use the first tab as the default value
  const defaultValue = items.length > 0 ? items[0].id : undefined;

  if (!defaultValue) {
    return null;
  }

  return (
    <div className="my-6">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 p-1 h-auto flex-wrap">
          {items.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rtl:text-right ltr:text-left"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {items.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <div className="space-y-4">
              <ContentRenderer blocks={tab.content} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default TabsBlock;
