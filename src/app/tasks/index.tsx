/**
 * Tasks Page - Story 6.4
 * Task management system with multiple views
 */

import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { hebrewLocale } from '../../lib/locale/he';
import { useAuth } from '../../hooks/useAuth';
import { getUserTasks, getSubTasks, getTaskStats } from '../../lib/api/tasks';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { IconPlus, IconChecklist } from '@tabler/icons-react';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];

export function TasksPage() {
  const { user } = useAuth();
  const he = hebrewLocale.pages.tasks;

  // Data state
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [subTasksMap, setSubTasksMap] = useState<Record<string, UserTask[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [guidesData, setGuidesData] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ todo: 0, in_progress: 0, done: 0, total: 0 });

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
  const [parentTask, setParentTask] = useState<UserTask | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Load tasks
  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const userTasks = await getUserTasks(user.id);
        setTasks(userTasks);

        // Load sub-tasks for each task
        const subTasksData: Record<string, UserTask[]> = {};
        for (const task of userTasks) {
          const subTasks = await getSubTasks(task.id);
          subTasksData[task.id] = subTasks;
        }
        setSubTasksMap(subTasksData);

        // Load stats
        const taskStats = await getTaskStats(user.id);
        setStats(taskStats);
      } catch (error) {
        console.error('[TasksPage] Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  // Load guide titles
  useEffect(() => {
    const loadGuideTitles = async () => {
      try {
        const response = await fetch('/src/content/locale/he/guides/index.json');
        const guides = await response.json();
        const titlesMap: Record<string, string> = {};
        guides.forEach((guide: { id: string; title: string }) => {
          titlesMap[guide.id] = guide.title;
        });
        setGuidesData(titlesMap);
      } catch (error) {
        console.error('[TasksPage] Error loading guide titles:', error);
      }
    };

    loadGuideTitles();
  }, []);

  // Group tasks by guide
  const tasksByGuide = useMemo(() => {
    const grouped: Record<string, UserTask[]> = { 'no-guide': [] };

    tasks.forEach((task) => {
      if (task.guide_slug) {
        if (!grouped[task.guide_slug]) {
          grouped[task.guide_slug] = [];
        }
        grouped[task.guide_slug].push(task);
      } else {
        grouped['no-guide'].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  // Group tasks by priority
  const tasksByPriority = useMemo(() => {
    return {
      high: tasks.filter((t) => t.priority === 'high'),
      medium: tasks.filter((t) => t.priority === 'medium'),
      low: tasks.filter((t) => t.priority === 'low'),
    };
  }, [tasks]);

  // Group tasks by status (for kanban)
  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      in_progress: tasks.filter((t) => t.status === 'in_progress'),
      done: tasks.filter((t) => t.status === 'done'),
    };
  }, [tasks]);

  const handleNewTask = () => {
    setSelectedTask(null);
    setParentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: UserTask) => {
    setSelectedTask(task);
    setParentTask(null);
    setIsModalOpen(true);
  };

  const handleAddSubTask = (task: UserTask) => {
    setSelectedTask(null);
    setParentTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSaved = async (task: UserTask) => {
    // Update or add task to list
    if (task.parent_task_id) {
      // It's a sub-task, update the sub-tasks map
      setSubTasksMap((prev) => ({
        ...prev,
        [task.parent_task_id!]: [
          ...(prev[task.parent_task_id!] || []).filter((t) => t.id !== task.id),
          task,
        ],
      }));
    } else {
      // It's a parent task
      setTasks((prev) => {
        const existing = prev.find((t) => t.id === task.id);
        if (existing) {
          return prev.map((t) => (t.id === task.id ? task : t));
        } else {
          return [task, ...prev];
        }
      });
    }

    // Reload stats
    if (user) {
      const taskStats = await getTaskStats(user.id);
      setStats(taskStats);
    }
  };

  const handleTaskUpdated = async (task: UserTask) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

    // Reload stats
    if (user) {
      const taskStats = await getTaskStats(user.id);
      setStats(taskStats);
    }
  };

  const handleTaskDeleted = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // Also remove from sub-tasks map if it's there
    setSubTasksMap((prev) => {
      const newMap = { ...prev };
      delete newMap[taskId];
      return newMap;
    });

    // Reload stats
    if (user) {
      const taskStats = await getTaskStats(user.id);
      setStats(taskStats);
    }
  };

  const getSubTaskStats = (taskId: string) => {
    const subTasks = subTasksMap[taskId] || [];
    const completed = subTasks.filter((t) => t.status === 'done').length;
    return { total: subTasks.length, completed };
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{he.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {he.todoCount} ({stats.todo})
              </span>
              <span>•</span>
              <span>
                {he.inProgressCount} ({stats.in_progress})
              </span>
              <span>•</span>
              <span>
                {he.doneCount} ({stats.done})
              </span>
            </div>
          </div>
          <Button
            onClick={handleNewTask}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <IconPlus className="w-5 h-5 mr-2" />
            {he.newTask}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">{he.allTasks}</TabsTrigger>
            <TabsTrigger value="byGuide">{he.byGuide}</TabsTrigger>
            <TabsTrigger value="kanban">{he.kanban}</TabsTrigger>
            <TabsTrigger value="byPriority">{he.byPriority}</TabsTrigger>
          </TabsList>

          {/* All Tasks View */}
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <Card className="p-8">
                <p className="text-center text-gray-500">טוען משימות...</p>
              </Card>
            ) : tasks.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <IconChecklist className="w-16 h-16 mx-auto text-gray-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{he.noTasks}</h3>
                    <p className="text-gray-600 mt-1">{he.noTasksDescription}</p>
                  </div>
                  <Button
                    onClick={handleNewTask}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <IconPlus className="w-5 h-5 mr-2" />
                    {he.newTask}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const subTaskStats = getSubTaskStats(task.id);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      subTasksCount={subTaskStats.total}
                      subTasksCompleted={subTaskStats.completed}
                      guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                      onTaskUpdated={handleTaskUpdated}
                      onTaskDeleted={handleTaskDeleted}
                      onEditTask={handleEditTask}
                      onAddSubTask={handleAddSubTask}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* By Guide View */}
          <TabsContent value="byGuide" className="mt-6">
            <div className="space-y-6">
              {Object.entries(tasksByGuide).map(([guideSlug, guideTasks]) => {
                if (guideTasks.length === 0) return null;

                const guideTitle = guideSlug === 'no-guide' ? 'ללא מדריך משוייך' : (guidesData[guideSlug] || guideSlug);

                return (
                  <div key={guideSlug} className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">{guideTitle}</h2>
                    <div className="space-y-3">
                      {guideTasks.map((task) => {
                        const subTaskStats = getSubTaskStats(task.id);
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            subTasksCount={subTaskStats.total}
                            subTasksCompleted={subTaskStats.completed}
                            guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                            onTaskUpdated={handleTaskUpdated}
                            onTaskDeleted={handleTaskDeleted}
                            onEditTask={handleEditTask}
                            onAddSubTask={handleAddSubTask}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {tasks.length === 0 && (
                <Card className="p-12">
                  <div className="text-center space-y-4">
                    <IconChecklist className="w-16 h-16 mx-auto text-gray-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{he.noTasks}</h3>
                      <p className="text-gray-600 mt-1">{he.noTasksDescription}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Kanban View */}
          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {he.todoCount} ({tasksByStatus.todo.length})
                  </h2>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {tasksByStatus.todo.map((task) => {
                    const subTaskStats = getSubTaskStats(task.id);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subTasksCount={subTaskStats.total}
                        subTasksCompleted={subTaskStats.completed}
                        guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                        onEditTask={handleEditTask}
                        onAddSubTask={handleAddSubTask}
                      />
                    );
                  })}
                  {tasksByStatus.todo.length === 0 && (
                    <Card className="p-6">
                      <p className="text-center text-sm text-gray-500">{he.noTasksInStatus}</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {he.inProgressCount} ({tasksByStatus.in_progress.length})
                  </h2>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {tasksByStatus.in_progress.map((task) => {
                    const subTaskStats = getSubTaskStats(task.id);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subTasksCount={subTaskStats.total}
                        subTasksCompleted={subTaskStats.completed}
                        guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                        onEditTask={handleEditTask}
                        onAddSubTask={handleAddSubTask}
                      />
                    );
                  })}
                  {tasksByStatus.in_progress.length === 0 && (
                    <Card className="p-6">
                      <p className="text-center text-sm text-gray-500">{he.noTasksInStatus}</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {he.doneCount} ({tasksByStatus.done.length})
                  </h2>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {tasksByStatus.done.map((task) => {
                    const subTaskStats = getSubTaskStats(task.id);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subTasksCount={subTaskStats.total}
                        subTasksCompleted={subTaskStats.completed}
                        guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                        onEditTask={handleEditTask}
                        onAddSubTask={handleAddSubTask}
                      />
                    );
                  })}
                  {tasksByStatus.done.length === 0 && (
                    <Card className="p-6">
                      <p className="text-center text-sm text-gray-500">{he.noTasksInStatus}</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* By Priority View */}
          <TabsContent value="byPriority" className="mt-6">
            <div className="space-y-6">
              {/* High Priority */}
              {tasksByPriority.high.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>עדיפות גבוהה ({tasksByPriority.high.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {tasksByPriority.high.map((task) => {
                      const subTaskStats = getSubTaskStats(task.id);
                      return (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subTasksCount={subTaskStats.total}
                          subTasksCompleted={subTaskStats.completed}
                          guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                          onTaskUpdated={handleTaskUpdated}
                          onTaskDeleted={handleTaskDeleted}
                          onEditTask={handleEditTask}
                          onAddSubTask={handleAddSubTask}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Medium Priority */}
              {tasksByPriority.medium.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-yellow-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>עדיפות בינונית ({tasksByPriority.medium.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {tasksByPriority.medium.map((task) => {
                      const subTaskStats = getSubTaskStats(task.id);
                      return (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subTasksCount={subTaskStats.total}
                          subTasksCompleted={subTaskStats.completed}
                          guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                          onTaskUpdated={handleTaskUpdated}
                          onTaskDeleted={handleTaskDeleted}
                          onEditTask={handleEditTask}
                          onAddSubTask={handleAddSubTask}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Low Priority */}
              {tasksByPriority.low.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>עדיפות נמוכה ({tasksByPriority.low.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {tasksByPriority.low.map((task) => {
                      const subTaskStats = getSubTaskStats(task.id);
                      return (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subTasksCount={subTaskStats.total}
                          subTasksCompleted={subTaskStats.completed}
                          guideTitle={task.guide_slug ? guidesData[task.guide_slug] : undefined}
                          onTaskUpdated={handleTaskUpdated}
                          onTaskDeleted={handleTaskDeleted}
                          onEditTask={handleEditTask}
                          onAddSubTask={handleAddSubTask}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {tasks.length === 0 && (
                <Card className="p-12">
                  <div className="text-center space-y-4">
                    <IconChecklist className="w-16 h-16 mx-auto text-gray-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{he.noTasks}</h3>
                      <p className="text-gray-600 mt-1">{he.noTasksDescription}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Task Modal */}
        <TaskModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          task={selectedTask}
          parentTask={parentTask}
          onSaved={handleTaskSaved}
        />
      </div>
    </div>
  );
}
