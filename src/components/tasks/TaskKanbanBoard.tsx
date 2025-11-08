/**
 * TaskKanbanBoard Component - Story 6.6
 * Drag-and-drop kanban board for task management
 */

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '../ui/card';
import { KanbanTaskCard } from './KanbanTaskCard';
import { IconChecklist } from '@tabler/icons-react';
import { updateTask } from '../../lib/api/tasks';
import { motion } from 'framer-motion';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];

interface TaskKanbanBoardProps {
  tasks: UserTask[];
  subTasksMap: Record<string, UserTask[]>;
  guidesData: Record<string, string>;
  onTaskUpdated: (task: UserTask) => void;
  onTaskClick: (task: UserTask) => void;
}

type TaskStatus = 'todo' | 'in_progress' | 'done';

const columns: { id: TaskStatus; title: string; emptyMessage: string }[] = [
  { id: 'todo', title: 'לביצוע', emptyMessage: 'אין משימות לביצוע' },
  { id: 'in_progress', title: 'בתהליך', emptyMessage: 'אין משימות בתהליך' },
  { id: 'done', title: 'הושלם', emptyMessage: 'אין משימות שהושלמו' },
];

export function TaskKanbanBoard({
  tasks,
  subTasksMap,
  guidesData,
  onTaskUpdated,
  onTaskClick,
}: TaskKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<UserTask | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, UserTask[]> = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const getSubTaskStats = (taskId: string) => {
    const subTasks = subTasksMap[taskId] || [];
    const completed = subTasks.filter((t) => t.status === 'done').length;
    return { total: subTasks.length, completed };
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task being moved
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    const updatedTask: UserTask = {
      ...task,
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date().toISOString() : null,
    };

    // Update UI immediately
    onTaskUpdated(updatedTask);

    // Update database
    try {
      const updates: Database['public']['Tables']['user_tasks']['Update'] = {
        status: newStatus,
      };

      // Set completed_at if moving to done
      if (newStatus === 'done') {
        updates.completed_at = new Date().toISOString();
      } else if (task.status === 'done') {
        // Clear completed_at if moving from done
        updates.completed_at = null;
      }

      const result = await updateTask(taskId, updates);

      // Update with server response
      onTaskUpdated(result);
    } catch (error) {
      console.error('[TaskKanbanBoard] Error updating task status:', error);
      // Revert optimistic update on error
      onTaskUpdated(task);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id];

          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 text-right">
                  {column.title}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              {/* Droppable Column */}
              <SortableContext
                id={column.id}
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="min-h-[500px] space-y-3 bg-gray-50 rounded-lg p-4"
                  id={column.id}
                >
                  {columnTasks.length === 0 ? (
                    // Empty State
                    <Card className="p-8 border-dashed border-2 border-gray-200">
                      <div className="text-center space-y-2">
                        <IconChecklist className="w-10 h-10 mx-auto text-gray-300" />
                        <p className="text-sm text-gray-500">{column.emptyMessage}</p>
                      </div>
                    </Card>
                  ) : (
                    // Task Cards
                    columnTasks.map((task) => {
                      const subTaskStats = getSubTaskStats(task.id);
                      return (
                        <KanbanTaskCard
                          key={task.id}
                          task={task}
                          subTasksCount={subTaskStats.total}
                          subTasksCompleted={subTaskStats.completed}
                          guideTitle={
                            task.guide_slug ? guidesData[task.guide_slug] : undefined
                          }
                          onClick={onTaskClick}
                        />
                      );
                    })
                  )}
                </div>
              </SortableContext>
            </motion.div>
          );
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <KanbanTaskCard
              task={activeTask}
              subTasksCount={getSubTaskStats(activeTask.id).total}
              subTasksCompleted={getSubTaskStats(activeTask.id).completed}
              guideTitle={
                activeTask.guide_slug ? guidesData[activeTask.guide_slug] : undefined
              }
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

