import { supabase } from '../supabase';

/**
 * Export User Data (GDPR Compliance)
 * Story 0.9: Privacy settings - data export functionality
 */
export async function exportUserData(userId: string) {
  try {
    // Fetch all user data
    const [profile, progress, comments, notifications, tasks, notes, achievements] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_progress').select('*').eq('user_id', userId),
      supabase.from('guide_comments').select('*').eq('user_id', userId),
      supabase.from('notifications').select('*').eq('user_id', userId),
      supabase.from('user_tasks').select('*').eq('user_id', userId),
      supabase.from('user_notes').select('*').eq('user_id', userId),
      supabase.from('user_achievements').select('*').eq('user_id', userId),
    ]);

    // Compile data
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      profile: profile.data,
      progress: progress.data || [],
      comments: comments.data || [],
      notifications: notifications.data || [],
      tasks: tasks.data || [],
      notes: notes.data || [],
      achievements: achievements.data || [],
    };

    // Convert to JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenseek-data-${userId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    throw error;
  }
}

