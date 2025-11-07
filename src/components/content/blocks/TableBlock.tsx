/**
 * TableBlock Component - Semantic HTML table with responsive design
 *
 * Features:
 * - Semantic table HTML (caption, thead, tbody, th, td)
 * - Column alignment support (left, center, right)
 * - Zebra striping for better readability
 * - Responsive horizontal scroll on mobile
 * - RTL-aware layout
 * - Dark mode support
 * - Accessible (proper semantic structure)
 *
 * Story 3.6: Build Table Block Component
 */

import type { TableBlock as TableBlockType, TableCell, TableRow } from '@/types/content-blocks';

interface TableBlockProps {
  block: TableBlockType;
}

/**
 * Get CSS class for cell alignment
 */
function getAlignmentClass(alignment?: 'left' | 'center' | 'right'): string {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right rtl:text-left';
    case 'left':
    default:
      return 'text-left rtl:text-right';
  }
}

/**
 * Normalize headers - handle both string[] and TableCell[] formats
 */
function normalizeHeaders(headers: string[] | TableCell[]): TableCell[] {
  if (!headers || !Array.isArray(headers)) return [];

  return headers.map(header => {
    if (typeof header === 'string') {
      return { content: header };
    }
    return header;
  });
}

/**
 * Normalize rows - handle both string[][] and TableRow[] formats
 */
function normalizeRows(rows: (string[] | TableRow)[]): TableRow[] {
  if (!rows || !Array.isArray(rows)) return [];

  return rows.map(row => {
    // If row is an array of strings, convert to TableRow format
    if (Array.isArray(row)) {
      return {
        cells: row.map(cell => ({ content: cell }))
      };
    }
    // Already in TableRow format
    return row;
  });
}

/**
 * TableBlock Component
 */
function TableBlock({ block }: TableBlockProps) {
  const headers = normalizeHeaders(block.headers as any);
  const rows = normalizeRows(block.rows as any);

  return (
    <div className="my-6">
      {/* Responsive wrapper with horizontal scroll */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          {/* Caption */}
          {block.caption && (
            <caption className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-left rtl:text-right bg-slate-50 dark:bg-slate-900/50 font-medium">
              {block.caption}
            </caption>
          )}

          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {headers.map((header: TableCell, index: number) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 ${getAlignmentClass(
                    header.alignment
                  )}`}
                  scope="col"
                >
                  {header.content}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body with Zebra Striping */}
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-slate-50 dark:bg-slate-800/30'
                }
              >
                {row.cells.map((cell: TableCell, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 text-sm text-slate-700 dark:text-slate-300 ${getAlignmentClass(
                      cell.alignment
                    )}`}
                  >
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile scroll hint */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 sm:hidden text-center">
        ← החלק לצפייה בכל העמודות →
      </p>
    </div>
  );
}

export default TableBlock;
