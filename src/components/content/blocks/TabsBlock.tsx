/**
 * TabsBlock - Placeholder component for tabs blocks
 * Full implementation in Story 3.8
 */

import type { TabsBlock as TabsBlockType } from '@/types/content-blocks';
import { useState } from 'react';

interface TabsBlockProps {
  block: TabsBlockType;
}

function TabsBlock({ block }: TabsBlockProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="border border-slate-200 rounded-lg">
      <div className="flex gap-2 p-2 border-b border-slate-200">
        {block.items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded ${
              activeTab === index
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="p-4">[Tab content - Story 3.8]</div>
    </div>
  );
}

export default TabsBlock;
