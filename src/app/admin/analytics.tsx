/**
 * Content Analytics Page
 * Story 9.3: Build Content Analytics Page
 *
 * Admin page for viewing content performance with:
 * - Guide performance table (all guides with views, unique viewers, avg time, completion rate, helpful votes, comments count)
 * - Sort by metrics
 * - Filter by category
 * - Color coding (green/yellow/red engagement)
 * - Engagement metrics summary (total notes/tasks/comments, avg session duration)
 * - Category performance bar chart
 * - Export CSV
 */

import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  IconArrowUp,
  IconArrowDown,
  IconDownload,
  IconEye,
  IconUsers,
  IconClock,
  IconCircleCheck,
  IconThumbUp,
  IconMessage,
  IconNotes,
  IconCheckbox,
} from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hebrewLocale } from '../../lib/locale/he';
import {
  fetchGuidePerformance,
  fetchContentEngagementSummary,
  fetchCategoryPerformance,
  exportToCSV,
  type GuidePerformance,
  type ContentEngagementSummary,
  type CategoryPerformance,
  type GuidesSortColumn,
} from '../../lib/actions/admin';

export default function ContentAnalyticsPage() {
  const [guides, setGuides] = useState<GuidePerformance[]>([]);
  const [summary, setSummary] = useState<ContentEngagementSummary>({
    totalNotes: 0,
    totalTasks: 0,
    totalComments: 0,
    avgSessionDurationMinutes: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<GuidesSortColumn>('views');
  const [sortAscending, setSortAscending] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const t = hebrewLocale.pages.admin.analytics;

  // Load data on mount and when filters change
  useEffect(() => {
    loadData();
  }, [categoryFilter, sortColumn, sortAscending]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [guidesData, summaryData, categoryPerformance] = await Promise.all([
        fetchGuidePerformance(categoryFilter === 'all' ? undefined : categoryFilter, sortColumn, sortAscending),
        fetchContentEngagementSummary(),
        fetchCategoryPerformance(),
      ]);

      setGuides(guidesData);
      setSummary(summaryData);
      setCategoryData(categoryPerformance);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await fetch('/content/guides-catalog.json');
      const catalog = await response.json();
      const uniqueCategories = Array.from(
        new Set(catalog.guides?.map((g: any) => g.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  function handleSort(column: GuidesSortColumn) {
    if (sortColumn === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(column);
      setSortAscending(false);
    }
  }

  function getEngagementColor(level: 'high' | 'medium' | 'low'): string {
    switch (level) {
      case 'high':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'low':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      default:
        return '';
    }
  }

  function handleExport() {
    const exportData = guides.map(g => ({
      מדריך: g.guideTitle,
      קטגוריה: g.category,
      צפיות: g.views,
      'צופים ייחודיים': g.uniqueViewers,
      'זמן ממוצע (דקות)': g.avgTimeMinutes,
      'אחוז השלמה': g.completionRate,
      'הצבעות מועילות': g.helpfulVotes,
      תגובות: g.commentsCount,
      מעורבות: g.engagementLevel === 'high' ? 'גבוהה' : g.engagementLevel === 'medium' ? 'בינונית' : 'נמוכה',
    }));

    exportToCSV(exportData, `content-analytics-${new Date().toISOString().split('T')[0]}.csv`);
  }

  const SortIcon = ({ column }: { column: GuidesSortColumn }) => {
    if (sortColumn !== column) return null;
    return sortAscending ? (
      <IconArrowUp className="w-4 h-4 inline mr-1" />
    ) : (
      <IconArrowDown className="w-4 h-4 inline mr-1" />
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">
            {t.title}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-2">
            {t.subtitle}
          </p>
        </div>
        <Button onClick={handleExport} disabled={loading || guides.length === 0}>
          <IconDownload className="w-4 h-4 ml-2" />
          {t.exportCSV}
        </Button>
      </div>

      {/* Engagement Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                {t.totalNotes}
              </p>
              <p className="text-3xl font-bold text-foreground dark:text-gray-100">
                {summary.totalNotes.toLocaleString('he-IL')}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <IconNotes className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                {t.totalTasks}
              </p>
              <p className="text-3xl font-bold text-foreground dark:text-gray-100">
                {summary.totalTasks.toLocaleString('he-IL')}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IconCheckbox className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                {t.totalComments}
              </p>
              <p className="text-3xl font-bold text-foreground dark:text-gray-100">
                {summary.totalComments.toLocaleString('he-IL')}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <IconMessage className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                {t.avgSessionDuration}
              </p>
              <p className="text-3xl font-bold text-foreground dark:text-gray-100">
                {summary.avgSessionDurationMinutes}
              </p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                {t.minutes}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <IconClock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Performance Chart */}
      {categoryData.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">
            {t.categoryPerformance}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalViews" fill="#10B981" name="סה״כ צפיות" />
              <Bar dataKey="avgCompletionRate" fill="#3B82F6" name="אחוז השלמה ממוצע" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {t.filterByCategory}
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.allCategories} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCategories}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Guide Performance Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">
          {t.guidePerformance}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t.loading}</div>
          </div>
        ) : guides.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t.noData}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">{t.guideTitle}</TableHead>
                  <TableHead className="text-right">{t.category}</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="views" />
                      <IconEye className="w-4 h-4 ml-1" />
                      {t.views}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('uniqueViewers')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="uniqueViewers" />
                      <IconUsers className="w-4 h-4 ml-1" />
                      {t.uniqueViewers}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('avgTimeMinutes')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="avgTimeMinutes" />
                      <IconClock className="w-4 h-4 ml-1" />
                      {t.avgTime}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('completionRate')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="completionRate" />
                      <IconCircleCheck className="w-4 h-4 ml-1" />
                      {t.completionRate}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('helpfulVotes')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="helpfulVotes" />
                      <IconThumbUp className="w-4 h-4 ml-1" />
                      {t.helpfulVotes}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('commentsCount')}
                  >
                    <div className="flex items-center justify-end">
                      <SortIcon column="commentsCount" />
                      <IconMessage className="w-4 h-4 ml-1" />
                      {t.comments}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">{t.engagement}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guides.map((guide) => (
                  <TableRow key={guide.guideSlug}>
                    <TableCell className="font-medium text-right max-w-xs truncate">
                      {guide.guideTitle}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground dark:text-gray-400">
                      {guide.category}
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.views.toLocaleString('he-IL')}
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.uniqueViewers.toLocaleString('he-IL')}
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.avgTimeMinutes} {t.minutes}
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.completionRate}%
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.helpfulVotes.toLocaleString('he-IL')}
                    </TableCell>
                    <TableCell className="text-right">
                      {guide.commentsCount.toLocaleString('he-IL')}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(
                          guide.engagementLevel
                        )}`}
                      >
                        {guide.engagementLevel === 'high'
                          ? t.high
                          : guide.engagementLevel === 'medium'
                          ? t.medium
                          : t.low}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

