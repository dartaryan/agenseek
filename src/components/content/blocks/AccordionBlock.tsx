/**
 * AccordionBlock - Collapsible sections with smooth animations
 * Story 3.7 - Implements Shadcn/ui Accordion with nested content support
 */

import type { AccordionBlock as AccordionBlockType } from '@/types/content-blocks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ContentRenderer from '../ContentRenderer';

interface AccordionBlockProps {
  block: AccordionBlockType;
}

function AccordionBlock({ block }: AccordionBlockProps) {
  const { items, allowMultiple = false } = block;

  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
        <p className="text-sm font-medium">
          שגיאה: בלוק אקורדיון חייב להכיל לפחות פריט אחד
        </p>
        <pre className="mt-2 text-xs overflow-auto opacity-70">
          {JSON.stringify(block, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-6">
      <Accordion
        type={allowMultiple ? 'multiple' : 'single'}
        {...(!allowMultiple && { collapsible: true })}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900"
      >
        {items.map((item, index) => {
            // Use item.id if available, otherwise fallback to index to ensure unique keys
            const uniqueKey = item.id || `accordion-item-${index}`;
            const uniqueValue = item.id || `item-${index}`;

          // Handle content: if it's a string (markdown), wrap it in a text block
          // If it's already an array, use it as-is
          let contentBlocks = item.content;
          if (typeof item.content === 'string') {
            contentBlocks = [
              {
                id: `${uniqueKey}-text`,
                type: 'text',
                content: item.content,
                markdown: true,
              },
            ];
          }

            return (
              <AccordionItem
                key={uniqueKey}
                value={uniqueValue}
                className="border-b border-slate-200 dark:border-slate-700 last:border-b-0"
              >
                <AccordionTrigger className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-base font-semibold text-right rtl:text-right ltr:text-left hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-700 dark:text-slate-300">
                  <div className="space-y-4">
                    <ContentRenderer blocks={contentBlocks} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
}

export default AccordionBlock;
