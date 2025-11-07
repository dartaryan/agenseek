/**
 * TableBlock - Placeholder component for table blocks
 * Full implementation in Story 3.6
 */

import type { TableBlock as TableBlockType } from '@/types/content-blocks';

interface TableBlockProps {
  block: TableBlockType;
}

function TableBlock({ block }: TableBlockProps) {
  return (
    <div className="overflow-x-auto">
      {block.caption && <p className="text-sm text-slate-600 mb-2">{block.caption}</p>}
      <table className="min-w-full border border-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {block.headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-sm font-semibold border-b">
                {header.content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-sm">
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableBlock;
