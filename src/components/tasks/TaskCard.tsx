/**
 * TaskCard Component - Story 6.4
 * Displays a task with inline editing, status toggle, and quick actions
 */

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconChevronDown,
  IconChevronUp,
  IconLink,
} from '@tabler/icons-react';
import { updateTaskStatus, deleteTask } from '../../lib/api/tasks';
import { formatDistanceToNow } from 'date-fns';
import { he as hebrewDateLocale } from 'date-fns/locale';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];

interface TaskCardProps {
  task: UserTask;
  subTasksCount?: number;
  subTasksCompleted?: number;
  guideTitle?: string;
  onTaskUpdated: (task: UserTask) => void;
  onTaskDeleted: (taskId: string) => void;
  onEditTask: (task: UserTask) => void;
  onAddSubTask: (parentTask: UserTask) => void;
}

// Priority colors
const priorityColors: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

// Status colors
const statusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-emerald-100 text-emerald-800',
};

// Status labels (Hebrew)
const statusLabels: Record<string, string> = {
  todo: 'לביצוע',
  in_progress: 'בתהליך',
  done: 'הושלם',
};

export function TaskCard({
  task,
  subTasksCount = 0,
  subTasksCompleted = 0,
  guideTitle,
  onTaskUpdated,
  onTaskDeleted,
  onEditTask,
  onAddSubTask,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(task.id, task.status);
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('[TaskCard] Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (error) {
      console.error('[TaskCard] Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDone = task.status === 'done';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow" dir="rtl">
      <div className="space-y-3">
        {/* Task Header */}
        <div className="flex items-start gap-3">
          {/* Status Checkbox */}
          <div className="pt-0.5">
            <Checkbox
              checked={isDone}
              onCheckedChange={handleStatusToggle}
              disabled={isUpdating}
              className="w-5 h-5"
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3
              className={`text-lg font-semibold text-gray-900 mb-1 text-right ${
                isDone ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {/* Description (if exists and expanded) */}
            {task.description && (
              <div className="mb-2">
                {isExpanded ? (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap text-right">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 line-clamp-2 text-right">
                    {task.description}
                  </p>
                )}
                {task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 mt-1 flex items-center gap-1 mr-auto"
                  >
                    {isExpanded ? (
                      <>
                        <span>הצג פחות</span>
                        <IconChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>הצג עוד</span>
                        <IconChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {/* Priority Indicator */}
              <div className="flex items-center gap-1">
                <span>
                  {task.priority === 'high'
                    ? 'עדיפות גבוהה'
                    : task.priority === 'low'
                    ? 'עדיפות נמוכה'
                    : 'עדיפות בינונית'}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
                />
              </div>

              {/* Status Badge */}
              <Badge variant="outline" className={`text-xs ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
              </Badge>

              {/* Guide Link */}
              {guideTitle && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <span>{guideTitle}</span>
                  <IconLink className="w-3 h-3" />
                </div>
              )}

              {/* Sub-tasks Progress */}
              {subTasksCount > 0 && (
                <div className="flex items-center gap-1">
                  <span>
                    {subTasksCompleted}/{subTasksCount} משימות משנה
                  </span>
                </div>
              )}

              {/* Created Date */}
              <span>
                נוצר{' '}
                {formatDistanceToNow(new Date(task.created_at), {
                  addSuffix: true,
                  locale: hebrewDateLocale,
                })}
              </span>
            </div>
          </div>

          {/* Priority Dot */}
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${
              priorityColors[task.priority]
            }`}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditTask(task)}
            className="text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <IconEdit className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">ערוך</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSubTask(task)}
            className="text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <IconPlus className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">משימת משנה</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 sm:mr-auto flex-shrink-0"
          >
            <IconTrash className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">{isDeleting ? 'מוחק...' : 'מחק'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

