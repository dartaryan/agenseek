/**
 * Tasks API
 * CRUD operations for user tasks
 */

import { supabase } from '../supabase';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];
type UserTaskInsert = Database['public']['Tables']['user_tasks']['Insert'];
type UserTaskUpdate = Database['public']['Tables']['user_tasks']['Update'];

/**
 * Get all tasks for a user (parent tasks only, excluding sub-tasks)
 */
export async function getUserTasks(userId: string): Promise<UserTask[]> {
  const { data, error } = await supabase
    .from('user_tasks')
    .select('*')
    .eq('user_id', userId)
    .is('parent_task_id', null) // Only parent tasks
    .order('status', { ascending: true }) // todo, in_progress, done
    .order('priority', { ascending: false }) // high, medium, low
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getUserTasks] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get sub-tasks for a parent task
 */
export async function getSubTasks(parentTaskId: string): Promise<UserTask[]> {
  const { data, error } = await supabase
    .from('user_tasks')
    .select('*')
    .eq('parent_task_id', parentTaskId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getSubTasks] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new task
 */
export async function createTask(task: UserTaskInsert): Promise<UserTask> {
  const { data, error } = await supabase
    .from('user_tasks')
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error('[createTask] Error:', error);
    throw error;
  }

  return data;
}

/**
 * Update a task
 */
export async function updateTask(taskId: string, updates: UserTaskUpdate): Promise<UserTask> {
  const { data, error } = await supabase
    .from('user_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('[updateTask] Error:', error);
    throw error;
  }

  return data;
}

/**
 * Update task status (cycles: todo → in_progress → done)
 */
export async function updateTaskStatus(
  taskId: string,
  currentStatus: string
): Promise<UserTask> {
  const statusCycle: Record<string, string> = {
    todo: 'in_progress',
    in_progress: 'done',
    done: 'todo',
  };

  const newStatus = statusCycle[currentStatus] || 'todo';
  const updates: UserTaskUpdate = {
    status: newStatus as 'todo' | 'in_progress' | 'done',
  };

  // If transitioning to done, set completed_at
  if (newStatus === 'done') {
    updates.completed_at = new Date().toISOString();
  } else if (currentStatus === 'done') {
    // If transitioning from done, clear completed_at
    updates.completed_at = null;
  }

  return updateTask(taskId, updates);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('user_tasks').delete().eq('id', taskId);

  if (error) {
    console.error('[deleteTask] Error:', error);
    throw error;
  }
}

/**
 * Get task statistics for a user
 */
export async function getTaskStats(userId: string) {
  const { data, error } = await supabase
    .from('user_tasks')
    .select('status')
    .eq('user_id', userId)
    .is('parent_task_id', null); // Only parent tasks

  if (error) {
    console.error('[getTaskStats] Error:', error);
    throw error;
  }

  const stats = {
    todo: 0,
    in_progress: 0,
    done: 0,
    total: data?.length || 0,
  };

  data?.forEach((task) => {
    if (task.status === 'todo') stats.todo++;
    else if (task.status === 'in_progress') stats.in_progress++;
    else if (task.status === 'done') stats.done++;
  });

  return stats;
}

/**
 * Get tasks by guide slug
 */
export async function getTasksByGuide(userId: string, guideSlug: string): Promise<UserTask[]> {
  const { data, error } = await supabase
    .from('user_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('guide_slug', guideSlug)
    .is('parent_task_id', null) // Only parent tasks
    .order('status', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getTasksByGuide] Error:', error);
    throw error;
  }

  return data || [];
}

