import { useState, useEffect } from 'react';
import { IconBug, IconCheck, IconClock, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface BugReport {
  id: string;
  user_id: string | null;
  email: string;
  title: string;
  description: string;
  location: string | null;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  resolved_at: string | null;
  admin_notes: string | null;
}

type StatusFilter = 'all' | 'new' | 'in_progress' | 'resolved' | 'closed';

/**
 * Bug Reports Admin Component
 * Story: 11.2 - Footer Redesign & Credits
 *
 * Features:
 * - View all bug reports
 * - Filter by status
 * - Update status
 * - Add admin notes
 * - Expand/collapse details
 * - Real-time count badges
 */
export function BugReports() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<BugReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load bug reports
  useEffect(() => {
    loadBugReports();
  }, []);

  // Filter reports when filter or reports change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredReports(bugReports);
    } else {
      setFilteredReports(bugReports.filter(report => report.status === statusFilter));
    }
  }, [statusFilter, bugReports]);

  const loadBugReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bug_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBugReports(data || []);
    } catch (error) {
      console.error('Failed to load bug reports:', error);
      toast.error('שגיאה בטעינת דיווחי באגים');
    } finally {
      setLoading(false);
    }
  };

  const updateBugReportStatus = async (reportId: string, newStatus: BugReport['status']) => {
    try {
      setUpdatingId(reportId);
      const { error } = await supabase
        .from('bug_reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setBugReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      toast.success('הסטטוס עודכן בהצלחה');
    } catch (error) {
      console.error('Failed to update bug report status:', error);
      toast.error('שגיאה בעדכון הסטטוס');
    } finally {
      setUpdatingId(null);
    }
  };

  const updateAdminNotes = async (reportId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('bug_reports')
        .update({ admin_notes: notes })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setBugReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, admin_notes: notes } : report
        )
      );

      toast.success('ההערות נשמרו בהצלחה');
    } catch (error) {
      console.error('Failed to update admin notes:', error);
      toast.error('שגיאה בשמירת הערות');
    }
  };

  const getStatusBadge = (status: BugReport['status']) => {
    const statusConfig = {
      new: { label: 'חדש', variant: 'default' as const, icon: IconBug },
      in_progress: { label: 'בטיפול', variant: 'secondary' as const, icon: IconClock },
      resolved: { label: 'נפתר', variant: 'default' as const, icon: IconCheck },
      closed: { label: 'סגור', variant: 'outline' as const, icon: IconX },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1.5">
        <Icon size={14} stroke={2} />
        {config.label}
      </Badge>
    );
  };

  const getStatusCount = (status: StatusFilter): number => {
    if (status === 'all') return bugReports.length;
    return bugReports.filter(r => r.status === status).length;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">טוען דיווחי באגים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">דיווחי באגים</h2>
        <p className="text-slate-600">
          ניהול וטיפול בדיווחי באגים מהמשתמשים
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
          size="sm"
        >
          כל הדיווחים ({getStatusCount('all')})
        </Button>
        <Button
          variant={statusFilter === 'new' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('new')}
          size="sm"
        >
          חדשים ({getStatusCount('new')})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('in_progress')}
          size="sm"
        >
          בטיפול ({getStatusCount('in_progress')})
        </Button>
        <Button
          variant={statusFilter === 'resolved' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('resolved')}
          size="sm"
        >
          נפתרו ({getStatusCount('resolved')})
        </Button>
        <Button
          variant={statusFilter === 'closed' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('closed')}
          size="sm"
        >
          סגורים ({getStatusCount('closed')})
        </Button>
      </div>

      {/* Bug Reports List */}
      {filteredReports.length === 0 ? (
        <Card className="p-8 text-center">
          <IconBug className="mx-auto text-slate-400 mb-3" size={48} stroke={1.5} />
          <p className="text-slate-600">אין דיווחי באגים בסטטוס זה</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReports.map(report => {
            const isExpanded = expandedId === report.id;

            return (
              <Card key={report.id} className="p-4">
                {/* Report Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(report.status)}
                      <span className="text-xs text-slate-500">
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {report.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>{report.email}</span>
                      {report.location && (
                        <span className="text-slate-500">📍 {report.location}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : report.id)}
                  >
                    {isExpanded ? (
                      <IconChevronUp size={20} />
                    ) : (
                      <IconChevronDown size={20} />
                    )}
                  </Button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Description */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">תיאור הבעיה:</Label>
                      <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-md">
                        {report.description}
                      </p>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <Label htmlFor={`notes-${report.id}`} className="text-sm font-semibold mb-2 block">
                        הערות מנהל:
                      </Label>
                      <Textarea
                        id={`notes-${report.id}`}
                        defaultValue={report.admin_notes || ''}
                        placeholder="הוסף הערות פנימיות (לא נראות למשתמש)"
                        className="text-right resize-none"
                        rows={3}
                        onBlur={(e) => {
                          const newNotes = e.target.value.trim();
                          if (newNotes !== (report.admin_notes || '')) {
                            updateAdminNotes(report.id, newNotes);
                          }
                        }}
                      />
                    </div>

                    {/* Status Actions */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">עדכן סטטוס:</Label>
                      <div className="flex flex-wrap gap-2">
                        {report.status !== 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBugReportStatus(report.id, 'new')}
                            disabled={updatingId === report.id}
                          >
                            סמן כחדש
                          </Button>
                        )}
                        {report.status !== 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBugReportStatus(report.id, 'in_progress')}
                            disabled={updatingId === report.id}
                          >
                            בטיפול
                          </Button>
                        )}
                        {report.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBugReportStatus(report.id, 'resolved')}
                            disabled={updatingId === report.id}
                          >
                            נפתר
                          </Button>
                        )}
                        {report.status !== 'closed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBugReportStatus(report.id, 'closed')}
                            disabled={updatingId === report.id}
                          >
                            סגור
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

