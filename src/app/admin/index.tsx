/**
 * Admin Dashboard Overview
 * Story 9.1: Build Admin Dashboard Overview
 *
 * Comprehensive admin analytics with:
 * - Overall statistics cards
 * - Activity graph (daily active users, guide views)
 * - Popular guides table (top 10)
 * - Recent activity feed (last 50)
 * - Date range filter
 * - CSV export functionality
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
import { IconUsers, IconBook, IconTrendingUp, IconDownload, IconEye } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrandedLoader } from '../../components/ui/branded-loader';
import { hebrewLocale } from '../../lib/locale/he';
import {
  fetchAdminStats,
  fetchActivityData,
  fetchPopularGuides,
  fetchRecentActivity,
  exportToCSV,
  type AdminStats,
  type ActivityDataPoint,
  type PopularGuide,
  type RecentActivity,
} from '../../lib/actions/admin';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

type DateRange = '7' | '30' | '90' | 'all';

/**
 * Admin Dashboard Page
 */
export function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [popularGuides, setPopularGuides] = useState<PopularGuide[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsData, activityDataResult, popularGuidesData, recentActivityData] = await Promise.all([
          fetchAdminStats(),
          fetchActivityData(dateRange === 'all' ? 365 : Number(dateRange)),
          fetchPopularGuides(),
          fetchRecentActivity(),
        ]);

        setStats(statsData);
        setActivityData(activityDataResult);
        setPopularGuides(popularGuidesData);
        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [dateRange]);

  // Export popular guides to CSV
  const handleExportPopularGuides = () => {
    exportToCSV(popularGuides, 'popular_guides');
  };

  // Export recent activity to CSV
  const handleExportRecentActivity = () => {
    exportToCSV(recentActivity, 'recent_activity');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full -mt-20">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header with Date Range Filter - Story 10.5: Responsive typography */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{hebrewLocale.pages.admin.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{hebrewLocale.pages.admin.description}</p>
          </div>

          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
              <SelectValue placeholder={hebrewLocale.pages.admin.dateRange} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{hebrewLocale.pages.admin.last7Days}</SelectItem>
              <SelectItem value="30">{hebrewLocale.pages.admin.last30Days}</SelectItem>
              <SelectItem value="90">{hebrewLocale.pages.admin.last90Days}</SelectItem>
              <SelectItem value="all">{hebrewLocale.pages.admin.allTime}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{hebrewLocale.pages.admin.totalUsers}</p>
                <IconUsers size={24} className="text-emerald-500" />
              </div>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{hebrewLocale.pages.admin.totalGuidesViewed}</p>
                <IconEye size={24} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{stats.totalGuidesViewed}</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{hebrewLocale.pages.admin.activeUsersLast30Days}</p>
                <IconTrendingUp size={24} className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{stats.activeUsersLast30Days}</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{hebrewLocale.pages.admin.avgCompletionRate}</p>
                <IconBook size={24} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold">{stats.avgCompletionRate}%</p>
            </Card>
          </div>
        )}

        {/* Activity Graph */}
        <Card className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">{hebrewLocale.pages.admin.activityGraph}</h3>
          {activityData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              {hebrewLocale.pages.admin.noData}
            </div>
          ) : (
            <div className="w-full">
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 8 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 8 }} width={30} />
                <Tooltip
                  contentStyle={{ fontSize: '12px' }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={10} />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="משתמשים"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="guideViews"
                  name="צפיות"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Popular Guides Table */}
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base md:text-lg font-semibold">{hebrewLocale.pages.admin.popularGuides}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPopularGuides}
              disabled={popularGuides.length === 0}
              className="min-h-[44px] w-full sm:w-auto"
            >
              <IconDownload size={16} className="ml-2" />
              {hebrewLocale.pages.admin.exportCSV}
            </Button>
          </div>

          {popularGuides.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {hebrewLocale.pages.admin.noData}
            </div>
          ) : (
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{hebrewLocale.pages.admin.guideTitle}</TableHead>
                    <TableHead className="text-center">{hebrewLocale.pages.admin.views}</TableHead>
                    <TableHead className="text-center hidden md:table-cell">{hebrewLocale.pages.admin.uniqueViewers}</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">{hebrewLocale.pages.admin.avgTime}</TableHead>
                    <TableHead className="text-center">{hebrewLocale.pages.admin.completionRate}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularGuides.map((guide, index) => (
                    <TableRow key={guide.guideSlug}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs sm:text-sm">#{index + 1}</span>
                          <span className="text-sm truncate max-w-[150px] sm:max-w-none">{guide.guideTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{guide.views}</TableCell>
                      <TableCell className="text-center text-sm hidden md:table-cell">{guide.uniqueViewers}</TableCell>
                      <TableCell className="text-center text-sm hidden lg:table-cell">{guide.avgTimeMinutes} דק'</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            guide.completionRate >= 70
                              ? 'bg-emerald-100 text-emerald-800'
                              : guide.completionRate >= 40
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {guide.completionRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Recent Activity Table */}
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base md:text-lg font-semibold">{hebrewLocale.pages.admin.recentActivity}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRecentActivity}
              disabled={recentActivity.length === 0}
              className="min-h-[44px] w-full sm:w-auto"
            >
              <IconDownload size={16} className="ml-2" />
              {hebrewLocale.pages.admin.exportCSV}
            </Button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {hebrewLocale.pages.admin.noData}
            </div>
          ) : (
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{hebrewLocale.pages.admin.activityType}</TableHead>
                    <TableHead className="hidden sm:table-cell">{hebrewLocale.pages.admin.user}</TableHead>
                    <TableHead className="hidden md:table-cell">{hebrewLocale.pages.admin.target}</TableHead>
                    <TableHead>{hebrewLocale.pages.admin.timestamp}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.slice(0, 50).map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {formatActivityType(activity.activityType)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-sm hidden sm:table-cell">{activity.userName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm truncate max-w-[100px] hidden md:table-cell">{activity.targetSlug || '-'}</TableCell>
                      <TableCell className="text-gray-500 text-xs sm:text-sm">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                          locale: he,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/**
 * Format activity type for display
 */
function formatActivityType(type: string): string {
  const typeMap: Record<string, string> = {
    view_guide: 'צפיה במדריך',
    complete_guide: 'השלמת מדריך',
    create_note: 'יצירת פתק',
    update_note: 'עדכון פתק',
    delete_note: 'מחיקת פתק',
    create_task: 'יצירת משימה',
    update_task: 'עדכון משימה',
    complete_task: 'השלמת משימה',
    delete_task: 'מחיקת משימה',
    post_comment: 'פרסום תגובה',
    earn_achievement: 'השגת אות הצטיינות',
  };

  return typeMap[type] || type;
}
