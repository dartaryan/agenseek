/**
 * KanbanTaskCard Component - Story 6.6
 * Compact task card for kanban board with draggable functionality
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../ui/card';
import { IconGripVertical, IconLink, IconCheckbox } from '@tabler/icons-react';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];

interface KanbanTaskCardProps {
  task: UserTask;
  subTasksCount?: number;
  subTasksCompleted?: number;
  guideTitle?: string;
  onClick: (task: UserTask) => void;
}

// Priority colors
const priorityColors: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export function KanbanTaskCard({
  task,
  subTasksCount = 0,
  subTasksCompleted = 0,
  guideTitle,
  onClick,
}: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 cursor-pointer hover:shadow-md transition-all"
      onClick={() => onClick(task)}
      dir="rtl"
    >
      <div className="space-y-2">
        {/* Header Row with Drag Handle and Priority */}
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 pt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <IconGripVertical className="w-4 h-4" />
          </button>

          {/* Task Title */}
          <h4 className="flex-1 text-sm font-semibold text-gray-900 text-right line-clamp-2">
            {task.title}
          </h4>

          {/* Priority Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
              priorityColors[task.priority]
            }`}
            title={
              task.priority === 'high'
                ? 'עדיפות גבוהה'
                : task.priority === 'low'
                ? 'עדיפות נמוכה'
                : 'עדיפות בינונית'
            }
          />
        </div>

        {/* Footer Row with Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {/* Sub-tasks Count */}
            {subTasksCount > 0 && (
              <div className="flex items-center gap-1">
                <IconCheckbox className="w-3 h-3" />
                <span>
                  {subTasksCompleted}/{subTasksCount}
                </span>
              </div>
            )}

            {/* Guide Link */}
            {guideTitle && (
              <div className="flex items-center gap-1 text-emerald-600">
                <IconLink className="w-3 h-3" />
                <span className="truncate max-w-[120px]" title={guideTitle}>
                  {guideTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

