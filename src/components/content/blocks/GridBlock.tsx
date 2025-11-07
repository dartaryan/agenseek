/**
 * GridBlock - Placeholder component for grid layout blocks
 * Full implementation in Story 3.10
 */

import type { GridBlock as GridBlockType } from '@/types/content-blocks';

interface GridBlockProps {
  block: GridBlockType;
}

function GridBlock({ block }: GridBlockProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[block.columns]} gap-4`}>
      {block.items.map((_, index) => (
        <div key={index} className="p-4 border border-slate-200 rounded-lg">
          <p className="text-slate-700">[Grid cell {index + 1} - Story 3.10]</p>
        </div>
      ))}
    </div>
  );
}

export default GridBlock;
