/**
 * ChartBlock Component - Data visualization using Recharts
 *
 * Features:
 * - Support for 4 chart types: line, bar, area, pie
 * - Responsive sizing with ResponsiveContainer
 * - Interactive tooltips on hover
 * - Customizable colors (defaults to emerald theme)
 * - Optional legend and grid
 * - RTL-aware layout
 * - Dark mode support
 * - Accessible (proper labeling)
 *
 * Story 3.9: Build Chart Block Component
 */

import type { ChartBlock as ChartBlockType } from '@/types/content-blocks';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartBlockProps {
  block: ChartBlockType;
}

/**
 * Default chart configuration
 */
const DEFAULT_HEIGHT = 300;
const PRIMARY_COLOR = '#10b981'; // emerald-500
const SECONDARY_COLOR = '#6ee7b7'; // emerald-300

/**
 * Pie chart colors (emerald shades)
 */
const PIE_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#6ee7b7', // emerald-300
  '#a7f3d0', // emerald-200
  '#059669', // emerald-600
  '#047857', // emerald-700
];

/**
 * Tooltip types for Recharts
 */
interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

/**
 * Custom tooltip styling for better readability
 */
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">{label}</p>
        {payload.map((entry, index: number) => (
          <p
            key={index}
            className="text-sm text-slate-600 dark:text-slate-400"
            style={{ color: entry.color }}
          >
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Render Line Chart
 */
function renderLineChart(block: ChartBlockType) {
  return (
    <LineChart data={block.data}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
      <XAxis
        dataKey={block.xKey}
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <YAxis
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Line
        type="monotone"
        dataKey={block.yKey}
        stroke={PRIMARY_COLOR}
        strokeWidth={2}
        dot={{ fill: PRIMARY_COLOR, r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  );
}

/**
 * Render Bar Chart
 */
function renderBarChart(block: ChartBlockType) {
  return (
    <BarChart data={block.data}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
      <XAxis
        dataKey={block.xKey}
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <YAxis
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Bar dataKey={block.yKey} fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}

/**
 * Render Area Chart
 */
function renderAreaChart(block: ChartBlockType) {
  return (
    <AreaChart data={block.data}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
      <XAxis
        dataKey={block.xKey}
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <YAxis
        className="text-xs text-slate-600 dark:text-slate-400"
        tick={{ fill: 'currentColor' }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Area
        type="monotone"
        dataKey={block.yKey}
        stroke={PRIMARY_COLOR}
        fill={SECONDARY_COLOR}
        fillOpacity={0.6}
      />
    </AreaChart>
  );
}

/**
 * Render Pie Chart
 */
function renderPieChart(block: ChartBlockType) {
  return (
    <PieChart>
      <Pie
        data={block.data}
        dataKey={block.yKey}
        nameKey={block.xKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={(entry) => `${entry[block.xKey]}: ${entry[block.yKey]}`}
        labelLine={false}
      >
        {block.data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </PieChart>
  );
}

/**
 * ChartBlock Component
 */
function ChartBlock({ block }: ChartBlockProps) {
  const height = block.height || DEFAULT_HEIGHT;

  // Validate data
  if (!block.data || block.data.length === 0) {
    return (
      <div className="my-6 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-200">אין נתונים להצגה בגרף</p>
      </div>
    );
  }

  // Render chart based on type
  let chartComponent;
  switch (block.chartType) {
    case 'line':
      chartComponent = renderLineChart(block);
      break;
    case 'bar':
      chartComponent = renderBarChart(block);
      break;
    case 'area':
      chartComponent = renderAreaChart(block);
      break;
    case 'pie':
      chartComponent = renderPieChart(block);
      break;
    default:
      return (
        <div className="my-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            סוג גרף לא נתמך: {block.chartType}
          </p>
        </div>
      );
  }

  return (
    <div className="my-6">
      {/* Chart Title */}
      {block.title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-right">
          {block.title}
        </h3>
      )}

      {/* Responsive Chart Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <ResponsiveContainer width="100%" height={height}>
          {chartComponent}
        </ResponsiveContainer>
      </div>

      {/* Chart Description (optional) */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
        {block.chartType === 'line' && 'גרף קווי - מציג מגמות לאורך זמן'}
        {block.chartType === 'bar' && 'גרף עמודות - משווה ערכים בין קטגוריות'}
        {block.chartType === 'area' && 'גרף שטח - מציג נפח מצטבר לאורך זמן'}
        {block.chartType === 'pie' && 'גרף עוגה - מציג פרופורציות מכלל'}
      </p>
    </div>
  );
}

export default ChartBlock;
