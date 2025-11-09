/**
 * User Engagement Report Page
 * Story 9.4: Build User Engagement Report
 *
 * Admin page for viewing user engagement metrics with:
 * - User segmentation (highly engaged, moderately engaged, low engagement, at risk)
 * - Segment counts and percentages
 * - Engagement funnel with drop-off rates
 * - Activity heatmap (day vs hour)
 * - Cohort analysis by registration month
 * - Export user lists per segment
 */

import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  IconDownload,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
} from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BrandedLoader } from '../../components/ui/branded-loader';
import { hebrewLocale } from '../../lib/locale/he';
import {
  fetchUserSegmentation,
  fetchEngagementFunnel,
  fetchActivityHeatmap,
  fetchCohortAnalysis,
  exportSegmentUsers,
  exportToCSV,
  type UserSegment,
  type EngagementFunnelStep,
  type ActivityHeatmapData,
  type CohortData,
} from '../../lib/actions/admin';

export default function EngagementReportPage() {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [funnelData, setFunnelData] = useState<EngagementFunnelStep[]>([]);
  const [heatmapData, setHeatmapData] = useState<ActivityHeatmapData[]>([]);
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);

  const t = hebrewLocale.pages.admin.engagementReport;

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [segmentsData, funnelDataResult, heatmapDataResult, cohortDataResult] = await Promise.all([
        fetchUserSegmentation(),
        fetchEngagementFunnel(),
        fetchActivityHeatmap(),
        fetchCohortAnalysis(),
      ]);

      setSegments(segmentsData);
      setFunnelData(funnelDataResult);
      setHeatmapData(heatmapDataResult);
      setCohortData(cohortDataResult);
    } catch (error) {
      console.error('Error loading engagement report data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Export segment users to CSV
  async function handleExportSegment(segment: UserSegment) {
    try {
      const csvContent = await exportSegmentUsers(segment.userIds);
      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `segment-${segment.segment}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      }
    } catch (error) {
      console.error('Error exporting segment users:', error);
    }
  }

  // Export all data to CSV
  async function handleExportAll() {
    try {
      const data = segments.map(s => ({
        'Segment': s.segmentName,
        'User Count': s.userCount,
        'Percentage': `${s.percentage}%`,
      }));

      exportToCSV(data, `engagement-report-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  }

  // Get color for segment
  function getSegmentColor(segment: string): string {
    switch (segment) {
      case 'highly_engaged':
        return '#10b981'; // green-500
      case 'moderately_engaged':
        return '#3b82f6'; // blue-500
      case 'low_engagement':
        return '#f59e0b'; // amber-500
      case 'at_risk':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  }

  // Get heat intensity color
  function getHeatColor(count: number, maxCount: number): string {
    if (maxCount === 0) return 'rgb(229, 231, 235)'; // gray-200
    const intensity = count / maxCount;

    if (intensity > 0.8) return 'rgb(16, 185, 129)'; // green-500
    if (intensity > 0.6) return 'rgb(52, 211, 153)'; // green-400
    if (intensity > 0.4) return 'rgb(134, 239, 172)'; // green-300
    if (intensity > 0.2) return 'rgb(187, 247, 208)'; // green-200
    if (intensity > 0) return 'rgb(220, 252, 231)'; // green-100
    return 'rgb(229, 231, 235)'; // gray-200
  }

  // Get max activity count for heatmap
  const maxActivity = Math.max(...heatmapData.map(d => d.activityCount), 1);

  // Day names in Hebrew (Sunday first)
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <Button
          onClick={handleExportAll}
          variant="outline"
          className="w-full sm:w-auto min-h-[44px]"
        >
          <IconDownload className="w-4 h-4 ml-2" />
          {t.exportCSV}
        </Button>
      </div>

      {/* User Segmentation */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6">{t.userSegmentation}</h2>

        {/* Segment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {segments.map((segment) => (
            <Card key={segment.segment} className="p-4 border-2" style={{ borderColor: getSegmentColor(segment.segment) }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground">{segment.segmentName}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{segment.description}</p>
                </div>
                <IconUsers className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>
              <div className="mt-4">
                <div className="text-2xl md:text-3xl font-bold" style={{ color: getSegmentColor(segment.segment) }}>
                  {segment.userCount}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {segment.percentage}% {t.percent}
                </div>
              </div>
              <Button
                onClick={() => handleExportSegment(segment)}
                variant="outline"
                size="sm"
                className="w-full mt-4 min-h-[44px]"
              >
                <IconDownload className="w-4 h-4 ml-2" />
                {t.exportSegment}
              </Button>
            </Card>
          ))}
        </div>

        {/* Segmentation Bar Chart */}
        {segments.length > 0 && (
          <div className="w-full h-64 min-h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%" minWidth={300}>
              <BarChart data={segments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="segmentName"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="userCount" name={t.users}>
                  {segments.map((segment) => (
                    <Cell key={segment.segment} fill={getSegmentColor(segment.segment)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Engagement Funnel */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6">{t.engagementFunnel}</h2>

        <div className="space-y-4">
          {funnelData.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-foreground">{step.step}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {step.userCount} {t.users} ({step.percentage}%)
                  </span>
                  {step.dropOffRate > 0 && (
                    <div className="flex items-center text-red-600">
                      <IconTrendingDown className="w-4 h-4 ml-1" />
                      <span className="text-sm">{t.dropOffRate}: {step.dropOffRate}%</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-emerald-500 to-emerald-600 transition-all duration-500 flex items-center justify-start px-4"
                  style={{ width: `${step.percentage}%` }}
                >
                  {step.percentage > 10 && (
                    <span className="text-white font-semibold text-sm">{step.percentage}%</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Heatmap */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6">{t.activityHeatmap}</h2>

        <div className="w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(24, minmax(0, 1fr))' }}>
              {/* Header row - Hours */}
              <div className="text-[8px] sm:text-xs text-muted-foreground p-0.5 sm:p-1"></div>
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="text-[6px] sm:text-[8px] md:text-xs text-muted-foreground text-center p-0.5 sm:p-1">
                  <span className="hidden sm:inline">{hour}</span>
                  <span className="sm:hidden">{hour % 3 === 0 ? hour : ''}</span>
                </div>
              ))}

              {/* Heatmap rows - Days */}
              {Array.from({ length: 7 }, (_, day) => (
                <div key={day} className="contents">
                  <div className="text-[8px] sm:text-xs text-muted-foreground p-0.5 sm:p-1 flex items-center">
                    {dayNames[day]}
                  </div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const data = heatmapData.find(d => d.dayOfWeek === day && d.hourOfDay === hour);
                    const count = data?.activityCount || 0;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="aspect-square rounded cursor-pointer hover:ring-1 sm:hover:ring-2 hover:ring-emerald-500 transition-all"
                        style={{ backgroundColor: getHeatColor(count, maxActivity) }}
                        title={`${dayNames[day]} ${hour}:00 - ${count} ${t.activityLevel}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-sm text-muted-foreground">{t.activityLevel}:</span>
          <div className="flex items-center gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
              <div
                key={intensity}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: getHeatColor(intensity * maxActivity, maxActivity) }}
                title={`${Math.round(intensity * 100)}%`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Cohort Analysis */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6">{t.cohortAnalysis}</h2>

        {cohortData.length > 0 ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <IconCalendar className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      <span className="text-xs sm:text-sm">{t.registrationMonth}</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end">
                      <IconUsers className="w-4 h-4 ml-2" />
                      {t.cohortUsers}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      <span className="text-xs sm:text-sm">{t.cohortRetention}</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    <span className="text-xs sm:text-sm">{t.cohortCompletion}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortData.map((cohort) => (
                  <TableRow key={cohort.cohortMonth}>
                    <TableCell className="font-medium text-xs sm:text-sm">{cohort.cohortMonth}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{cohort.userCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${cohort.retentionRate}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-12 text-left">{cohort.retentionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${cohort.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-left">{cohort.completionRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t.noData}
          </div>
        )}
      </Card>
    </div>
  );
}

