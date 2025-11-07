/**
 * AccordionBlock - Placeholder component for accordion blocks
 * Full implementation in Story 3.7
 */

import type { AccordionBlock as AccordionBlockType } from '@/types/content-blocks';

interface AccordionBlockProps {
  block: AccordionBlockType;
}

function AccordionBlock({ block }: AccordionBlockProps) {
  return (
    <div className="border border-slate-200 rounded-lg divide-y">
      {block.items.map((item, index) => (
        <details key={index} className="p-4">
          <summary className="cursor-pointer font-semibold">{item.title}</summary>
          <div className="mt-2 text-slate-700">[Nested content - Story 3.7]</div>
        </details>
      ))}
    </div>
  );
}

export default AccordionBlock;
