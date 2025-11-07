/**
 * ChartBlock - Placeholder component for chart blocks
 * Full implementation with Recharts in Story 3.9
 */

import type { ChartBlock as ChartBlockType } from '@/types/content-blocks';

interface ChartBlockProps {
  block: ChartBlockType;
}

function ChartBlock({ block }: ChartBlockProps) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
      <p className="text-sm text-slate-600 mb-2">
        תרשים ({block.chartType}): {block.title}
      </p>
      <div className="h-64 flex items-center justify-center bg-white rounded">
        <p className="text-slate-400">Chart placeholder - Story 3.9</p>
      </div>
    </div>
  );
}

export default ChartBlock;
