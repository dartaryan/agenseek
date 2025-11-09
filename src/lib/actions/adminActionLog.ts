/**
 * Admin Action Log Actions
 *
 * Handles fetching, filtering, and managing admin action logs.
 * Only accessible to admin users.
 *
 * Story: 9.6 - Build Admin Action Log
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type AdminActionLog = Database['public']['Tables']['admin_action_log']['Row'];

export interface AdminActionLogWithAdmin extends AdminActionLog {
  admin: {
    id: string;
    display_name: string;
    email: string;
    avatar_style: string;
    avatar_seed: string | null;
    avatar_options: any;
  } | null;
}

export interface AdminActionLogFilters {
  adminId?: string;
  actionType?: string;
  actionCategory?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

/**
 * Fetch admin action logs with filters and pagination
 */
export async function fetchAdminActionLogs(
  filters: AdminActionLogFilters = {},
  limit = 50,
  offset = 0
): Promise<{ data: AdminActionLogWithAdmin[]; count: number; error: string | null }> {
  try {
    let query = supabase
      .from('admin_action_log')
      .select(
        `
        *,
        admin:admin_id (
          id,
          display_name,
          email,
          avatar_style,
          avatar_seed,
          avatar_options
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.adminId) {
      query = query.eq('admin_id', filters.adminId);
    }

    if (filters.actionType) {
      query = query.eq('action_type', filters.actionType);
    }

    if (filters.actionCategory) {
      query = query.eq('action_category', filters.actionCategory);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.searchQuery) {
      // Search in description, target_label, and action_type
      query = query.or(
        `description.ilike.%${filters.searchQuery}%,target_label.ilike.%${filters.searchQuery}%,action_type.ilike.%${filters.searchQuery}%`
      );
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching admin action logs:', error);
      return { data: [], count: 0, error: error.message };
    }

    return { data: (data as AdminActionLogWithAdmin[]) || [], count: count || 0, error: null };
  } catch (err) {
    console.error('Error in fetchAdminActionLogs:', err);
    return { data: [], count: 0, error: 'שגיאה בטעינת יומן פעילות' };
  }
}

/**
 * Get distinct admin users who have logged actions
 */
export async function getAdminUsersWithActions(): Promise<{ data: any[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_action_log')
      .select('admin_id')
      .order('admin_id');

    if (error) {
      console.error('Error fetching admin users:', error);
      return { data: [], error: error.message };
    }

    // Get unique admin IDs
    const uniqueAdminIds = [...new Set(data?.map((log) => log.admin_id) || [])];

    // Fetch admin profiles
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id, display_name, email, avatar_style, avatar_seed, avatar_options')
      .in('id', uniqueAdminIds)
      .eq('is_admin', true)
      .order('display_name');

    if (adminsError) {
      console.error('Error fetching admin profiles:', adminsError);
      return { data: [], error: adminsError.message };
    }

    return { data: admins || [], error: null };
  } catch (err) {
    console.error('Error in getAdminUsersWithActions:', err);
    return { data: [], error: 'שגיאה בטעינת רשימת מנהלים' };
  }
}

/**
 * Get distinct action types
 */
export async function getActionTypes(): Promise<{ data: string[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_action_log')
      .select('action_type')
      .order('action_type');

    if (error) {
      console.error('Error fetching action types:', error);
      return { data: [], error: error.message };
    }

    // Get unique action types
    const uniqueTypes = [...new Set(data?.map((log) => log.action_type) || [])];

    return { data: uniqueTypes, error: null };
  } catch (err) {
    console.error('Error in getActionTypes:', err);
    return { data: [], error: 'שגיאה בטעינת סוגי פעולות' };
  }
}

/**
 * Get distinct action categories
 */
export async function getActionCategories(): Promise<{ data: string[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_action_log')
      .select('action_category')
      .order('action_category');

    if (error) {
      console.error('Error fetching action categories:', error);
      return { data: [], error: error.message };
    }

    // Get unique categories
    const uniqueCategories = [...new Set(data?.map((log) => log.action_category) || [])];

    return { data: uniqueCategories, error: null };
  } catch (err) {
    console.error('Error in getActionCategories:', err);
    return { data: [], error: 'שגיאה בטעינת קטגוריות פעולות' };
  }
}

/**
 * Log an admin action
 * This function is called from other admin operations to create audit trail
 */
export async function logAdminAction(
  actionType: string,
  actionCategory: string,
  description: string,
  options: {
    targetType?: string;
    targetId?: string;
    targetLabel?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  } = {}
): Promise<{ success: boolean; error: string | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'לא מחובר' };
    }

    const { error } = await supabase.from('admin_action_log').insert({
      admin_id: user.id,
      action_type: actionType,
      action_category: actionCategory,
      description,
      target_type: options.targetType || null,
      target_id: options.targetId || null,
      target_label: options.targetLabel || null,
      metadata: options.metadata || {},
      ip_address: options.ipAddress || null,
      user_agent: options.userAgent || null,
    });

    if (error) {
      console.error('Error logging admin action:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error in logAdminAction:', err);
    return { success: false, error: 'שגיאה ברישום פעולה' };
  }
}

/**
 * Export action logs to CSV
 */
export function exportActionLogsToCSV(logs: AdminActionLogWithAdmin[]): string {
  if (logs.length === 0) {
    return '';
  }

  // CSV headers
  const headers = [
    'ID',
    'Admin Name',
    'Admin Email',
    'Action Type',
    'Action Category',
    'Target Type',
    'Target ID',
    'Target Label',
    'Description',
    'IP Address',
    'User Agent',
    'Created At',
  ];

  // CSV rows
  const rows = logs.map((log) => [
    log.id,
    log.admin?.display_name || 'N/A',
    log.admin?.email || 'N/A',
    log.action_type,
    log.action_category,
    log.target_type || '',
    log.target_id || '',
    log.target_label || '',
    log.description,
    log.ip_address || '',
    log.user_agent || '',
    new Date(log.created_at).toLocaleString('he-IL'),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or newline
          const cellStr = String(cell).replace(/"/g, '""');
          return cellStr.includes(',') || cellStr.includes('\n') ? `"${cellStr}"` : cellStr;
        })
        .join(',')
    )
    .join('\n');

  return csvContent;
}

/**
 * Download action logs as CSV file
 */
export function downloadActionLogsCSV(logs: AdminActionLogWithAdmin[], filename = 'admin-action-log.csv'): void {
  const csvContent = exportActionLogsToCSV(logs);

  if (!csvContent) {
    console.error('No data to export');
    return;
  }

  // Create blob with UTF-8 BOM for proper Hebrew support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Helper functions for specific action types
 * These are convenience wrappers around logAdminAction
 */

export async function logUserDeleted(userId: string, userName: string, metadata: any = {}) {
  return logAdminAction('user_deleted', 'user_management', `משתמש נמחק: ${userName}`, {
    targetType: 'user',
    targetId: userId,
    targetLabel: userName,
    metadata,
  });
}

export async function logUserEdited(userId: string, userName: string, changes: any = {}) {
  return logAdminAction('user_edited', 'user_management', `פרופיל משתמש עודכן: ${userName}`, {
    targetType: 'user',
    targetId: userId,
    targetLabel: userName,
    metadata: { changes },
  });
}

export async function logContentModified(guideSlug: string, guideTitle: string, changes: any = {}) {
  return logAdminAction('content_modified', 'content_management', `תוכן עודכן: ${guideTitle}`, {
    targetType: 'guide',
    targetId: guideSlug,
    targetLabel: guideTitle,
    metadata: { changes },
  });
}

export async function logDataExported(exportType: string, recordCount: number) {
  return logAdminAction('data_exported', 'data_export', `נתונים יוצאו: ${exportType} (${recordCount} רשומות)`, {
    targetType: 'system',
    metadata: { exportType, recordCount },
  });
}

export async function logSettingsChanged(settingName: string, oldValue: any, newValue: any) {
  return logAdminAction('settings_changed', 'system', `הגדרות עודכנו: ${settingName}`, {
    targetType: 'setting',
    targetId: settingName,
    targetLabel: settingName,
    metadata: { oldValue, newValue },
  });
}

export async function logRoleChanged(userId: string, userName: string, oldRole: string, newRole: string) {
  return logAdminAction('role_changed', 'user_management', `תפקיד שונה: ${userName} (${oldRole} → ${newRole})`, {
    targetType: 'user',
    targetId: userId,
    targetLabel: userName,
    metadata: { oldRole, newRole },
  });
}

export async function logUserBanned(userId: string, userName: string, reason: string) {
  return logAdminAction('user_banned', 'security', `משתמש נחסם: ${userName}`, {
    targetType: 'user',
    targetId: userId,
    targetLabel: userName,
    metadata: { reason },
  });
}

export async function logUserUnbanned(userId: string, userName: string) {
  return logAdminAction('user_unbanned', 'security', `חסימת משתמש הוסרה: ${userName}`, {
    targetType: 'user',
    targetId: userId,
    targetLabel: userName,
  });
}

export async function logCommentDeleted(commentId: string, guideSlug: string, reason: string) {
  return logAdminAction('comment_deleted', 'content_management', `תגובה נמחקה מ-${guideSlug}`, {
    targetType: 'comment',
    targetId: commentId,
    targetLabel: `Comment on ${guideSlug}`,
    metadata: { guideSlug, reason },
  });
}

export async function logContentFlagged(guideSlug: string, guideTitle: string, reason: string) {
  return logAdminAction('content_flagged', 'security', `תוכן דווח: ${guideTitle}`, {
    targetType: 'guide',
    targetId: guideSlug,
    targetLabel: guideTitle,
    metadata: { reason },
  });
}

