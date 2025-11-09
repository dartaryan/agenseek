/**
 * Admin Action Log Page
 *
 * Displays a comprehensive audit log of all admin actions performed in the system.
 * Includes filtering, searching, pagination, and CSV export functionality.
 *
 * Story: 9.6 - Build Admin Action Log
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/user-avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { hebrewLocale } from '@/lib/locale/he';
import {
  fetchAdminActionLogs,
  getAdminUsersWithActions,
  getActionCategories,
  downloadActionLogsCSV,
  type AdminActionLogWithAdmin,
  type AdminActionLogFilters,
} from '@/lib/actions/adminActionLog';
import {
  IconClipboardList,
  IconDownload,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconTarget,
} from '@tabler/icons-react';

const ITEMS_PER_PAGE = 50;

export default function AdminActionLogPage() {
  const { toast } = useToast();
  const locale = hebrewLocale.pages.admin.actionLog;

  // State
  const [logs, setLogs] = useState<AdminActionLogWithAdmin[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [filters, setFilters] = useState<AdminActionLogFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter options
  const [adminOptions, setAdminOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  /**
   * Load filter options
   */
  useEffect(() => {
    loadFilterOptions();
  }, []);

  async function loadFilterOptions() {
    const { data: admins } = await getAdminUsersWithActions();
    const { data: categories } = await getActionCategories();

    setAdminOptions(admins);
    setCategoryOptions(categories);
  }

  /**
   * Load logs
   */
  useEffect(() => {
    loadLogs();
  }, [filters, currentPage]);

  async function loadLogs() {
    setLoading(true);

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const { data, count, error } = await fetchAdminActionLogs(filters, ITEMS_PER_PAGE, offset);

    if (error) {
      toast({
        title: locale.error,
        description: error,
        variant: 'destructive',
      });
    }

    setLogs(data);
    setTotalCount(count);
    setLoading(false);
  }

  /**
   * Apply filters
   */
  function applyFilters() {
    const newFilters: AdminActionLogFilters = {};

    if (selectedAdmin) newFilters.adminId = selectedAdmin;
    if (selectedCategory) newFilters.actionCategory = selectedCategory;
    if (startDate) newFilters.startDate = startDate;
    if (endDate) newFilters.endDate = endDate;
    if (searchQuery) newFilters.searchQuery = searchQuery;

    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  }

  /**
   * Clear filters
   */
  function clearFilters() {
    setFilters({});
    setSearchQuery('');
    setSelectedAdmin('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }

  /**
   * Export to CSV
   */
  async function exportToCSV() {
    setExporting(true);

    try {
      // Fetch all logs (no pagination) with current filters
      const { data, error } = await fetchAdminActionLogs(filters, 10000, 0);

      if (error) {
        toast({
          title: locale.exportError,
          description: error,
          variant: 'destructive',
        });
        return;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `admin-action-log-${timestamp}.csv`;

      // Download CSV
      downloadActionLogsCSV(data, filename);

      toast({
        title: locale.exportSuccess,
        description: `${data.length} ${locale.results}`,
      });
    } catch (err) {
      console.error('Error exporting logs:', err);
      toast({
        title: locale.exportError,
        description: locale.error,
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  }

  /**
   * Get category badge color
   */
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      user_management: 'bg-blue-500',
      content_management: 'bg-purple-500',
      system: 'bg-gray-500',
      security: 'bg-red-500',
      data_export: 'bg-green-500',
      general: 'bg-slate-500',
    };
    return colors[category] || 'bg-slate-500';
  }

  /**
   * Get category label
   */
  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      user_management: locale.userManagement,
      content_management: locale.contentManagement,
      system: locale.system,
      security: locale.security,
      data_export: locale.dataExport,
      general: locale.general,
    };
    return labels[category] || category;
  }

  /**
   * Format timestamp
   */
  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  }

  /**
   * Pagination
   */
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <IconClipboardList className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{locale.pageTitle}</h1>
              <p className="text-sm md:text-base text-slate-600">{locale.description}</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFilter className="w-5 h-5" />
              {locale.clearFilters}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <IconSearch className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder={locale.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Admin Filter */}
              <div>
                <Select value={selectedAdmin || undefined} onValueChange={setSelectedAdmin}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale.allAdmins} />
                  </SelectTrigger>
                  <SelectContent>
                    {adminOptions.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder={locale.startDate}
                />
              </div>

              {/* End Date */}
              <div>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder={locale.endDate}
                />
              </div>

              {/* Apply/Clear Buttons */}
              <div className="flex gap-2 lg:col-span-2">
                <Button onClick={applyFilters} className="flex-1 min-h-[44px]">
                  <IconFilter className="w-4 h-4 ml-2" />
                  {locale.applyFilters}
                </Button>
                <Button onClick={clearFilters} variant="outline" className="flex-1 min-h-[44px]">
                  <IconX className="w-4 h-4 ml-2" />
                  {locale.clearFilters}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            {locale.showing} {startIndex}-{endIndex} {locale.of} {totalCount} {locale.results}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={loadLogs} variant="outline" size="sm" disabled={loading} className="flex-1 sm:flex-none min-h-[44px]">
              <IconRefresh className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              {locale.refresh}
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm" disabled={exporting} className="flex-1 sm:flex-none min-h-[44px]">
              <IconDownload className="w-4 h-4 ml-2" />
              {exporting ? locale.exportingData : locale.exportCSV}
            </Button>
          </div>
        </div>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <IconRefresh className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                  <p className="text-slate-600">{locale.loading}</p>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <IconClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">{locale.noData}</p>
                  <p className="text-sm text-slate-400">{locale.noResults}</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-slate-200">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Admin Avatar */}
                        {log.admin && (
                          <UserAvatar
                            config={{
                              style: log.admin.avatar_style as any || 'avataaars',
                              seed: log.admin.avatar_seed || log.admin.id,
                              options: log.admin.avatar_options || {},
                            }}
                            size="md"
                            className="border-2 border-white shadow-md"
                          />
                        )}

                        {/* Log Details */}
                        <div className="flex-1 min-w-0">
                          {/* Admin Name & Timestamp */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">
                                {log.admin?.display_name || 'Unknown Admin'}
                              </span>
                              <Badge className={`${getCategoryColor(log.action_category)} text-white`}>
                                {getCategoryLabel(log.action_category)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <IconClock className="w-3 h-3" />
                              {formatTimestamp(log.created_at)}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-slate-700 mb-2">{log.description}</p>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            {log.target_type && (
                              <div className="flex items-center gap-1">
                                <IconTarget className="w-3 h-3" />
                                <span className="font-medium">{log.target_type}:</span>
                                <span>{log.target_label || log.target_id}</span>
                              </div>
                            )}
                            {log.ip_address && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">IP:</span>
                                <span className="font-mono text-xs">{log.ip_address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto min-h-[44px]"
            >
              <IconChevronRight className="w-4 h-4" />
              {locale.previousPage}
            </Button>
            <div className="flex items-center gap-2 px-4">
              <span className="text-sm text-slate-600">
                {locale.showing} {currentPage} {locale.of} {totalPages}
              </span>
            </div>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto min-h-[44px]"
            >
              {locale.nextPage}
              <IconChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

