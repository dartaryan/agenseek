/**
 * TaskModal Component - Story 6.5
 * Modal for creating and editing tasks with sub-task management
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { createTask, updateTask, createTaskWithSubTasks } from '../../lib/api/tasks';
import { useAuth } from '../../hooks/useAuth';
import {
  IconLoader,
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconChevronUp,
  IconChevronDown
} from '@tabler/icons-react';
import type { Database } from '../../types/database';

type UserTask = Database['public']['Tables']['user_tasks']['Row'];
type UserTaskInsert = Database['public']['Tables']['user_tasks']['Insert'];

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: UserTask | null;
  parentTask?: UserTask | null; // If creating a sub-task
  guideSlug?: string; // Pre-fill guide association
  onSaved: (task: UserTask) => void;
}

interface FormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  guide_slug: string;
}

interface SubTaskData {
  id: string; // Temporary ID for UI management
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}

export function TaskModal({
  open,
  onOpenChange,
  task,
  parentTask,
  guideSlug,
  onSaved,
}: TaskModalProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [guides, setGuides] = useState<Array<{ id: string; title: string }>>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    guide_slug: '',
  });

  // Sub-tasks state (only for parent tasks, not sub-tasks)
  const [subTasks, setSubTasks] = useState<SubTaskData[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  // Load guides for dropdown
  useEffect(() => {
    const loadGuides = async () => {
      try {
        const response = await fetch('/content/guides-catalog.json');
        const data = await response.json();
        // Handle both { guides: [...] } and [...] formats
        const guidesArray = Array.isArray(data) ? data : (data.guides || []);
        setGuides(guidesArray);
      } catch (error) {
        console.error('[TaskModal] Error loading guides:', error);
        setGuides([]); // Set empty array on error
      }
    };
    loadGuides();
  }, []);

  // Initialize form data when modal opens or task changes
  useEffect(() => {
    if (task) {
      // Edit mode
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority as 'high' | 'medium' | 'low',
        status: task.status as 'todo' | 'in_progress' | 'done',
        guide_slug: task.guide_slug || '',
      });
      // Clear sub-tasks when editing (sub-tasks managed separately)
      setSubTasks([]);
    } else {
      // Create mode
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        guide_slug: guideSlug || '',
      });
      // Clear sub-tasks
      setSubTasks([]);
    }
    setNewSubTaskTitle('');
  }, [task, guideSlug, open]);

  // Sub-task management functions
  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    if (newSubTaskTitle.length > 200) {
      alert('כותרת משימת משנה לא יכולה להיות יותר מ-200 תווים');
      return;
    }

    const newSubTask: SubTaskData = {
      id: `temp-${Date.now()}-${Math.random()}`,
      title: newSubTaskTitle.trim(),
      status: 'todo',
    };

    setSubTasks([...subTasks, newSubTask]);
    setNewSubTaskTitle('');
  };

  const handleDeleteSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
  };

  const handleMoveSubTaskUp = (index: number) => {
    if (index === 0) return;
    const newSubTasks = [...subTasks];
    [newSubTasks[index - 1], newSubTasks[index]] = [newSubTasks[index], newSubTasks[index - 1]];
    setSubTasks(newSubTasks);
  };

  const handleMoveSubTaskDown = (index: number) => {
    if (index === subTasks.length - 1) return;
    const newSubTasks = [...subTasks];
    [newSubTasks[index], newSubTasks[index + 1]] = [newSubTasks[index + 1], newSubTasks[index]];
    setSubTasks(newSubTasks);
  };

  const handleToggleSubTaskStatus = (id: string) => {
    setSubTasks(
      subTasks.map((st) =>
        st.id === id
          ? { ...st, status: st.status === 'done' ? 'todo' : 'done' }
          : st
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (task) {
        // Update existing task (sub-tasks managed separately in edit mode)
        const updatedTask = await updateTask(task.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          priority: formData.priority,
          status: formData.status,
          guide_slug: formData.guide_slug || null,
        });
        onSaved(updatedTask);
      } else {
        // Create new task
        const newTaskData: UserTaskInsert = {
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          priority: formData.priority,
          status: formData.status,
          guide_slug: formData.guide_slug || null,
          parent_task_id: parentTask?.id || null,
        };

        // If this is a parent task with sub-tasks, use batch creation
        if (!parentTask && subTasks.length > 0) {
          const subTasksData = subTasks.map((st, index) => ({
            title: st.title,
            status: st.status,
            position: index + 1,
          }));

          const newTask = await createTaskWithSubTasks(newTaskData, subTasksData);
          onSaved(newTask);
        } else {
          // Simple task creation without sub-tasks
          const newTask = await createTask(newTaskData);
          onSaved(newTask);
        }
      }

      onOpenChange(false);
    } catch (error) {
      console.error('[TaskModal] Error saving task:', error);
      alert('אירעה שגיאה בשמירת המשימה');
    } finally {
      setIsSaving(false);
    }
  };

  const modalTitle = task
    ? 'ערוך משימה'
    : parentTask
    ? `הוסף משימת משנה ל-"${parentTask.title}"`
    : 'משימה חדשה';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">{modalTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">כותרת המשימה *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="למשל: לסיים קריאת מדריך React"
              required
              className="mt-1 text-right"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="פרטים נוספים על המשימה..."
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-right"
              dir="rtl"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <Label htmlFor="priority">עדיפות</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'high' | 'medium' | 'low') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="priority" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">עדיפות גבוהה</SelectItem>
                  <SelectItem value="medium">עדיפות בינונית</SelectItem>
                  <SelectItem value="low">עדיפות נמוכה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">סטטוס</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'todo' | 'in_progress' | 'done') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">לביצוע</SelectItem>
                  <SelectItem value="in_progress">בתהליך</SelectItem>
                  <SelectItem value="done">הושלם</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guide Association */}
          <div>
            <Label htmlFor="guide">מדריך משוייך (אופציונלי)</Label>
            <Select
              value={formData.guide_slug || 'none'}
              onValueChange={(value) => setFormData({ ...formData, guide_slug: value === 'none' ? '' : value })}
            >
              <SelectTrigger id="guide" className="mt-1">
                <SelectValue placeholder="בחר מדריך..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">ללא מדריך</SelectItem>
                {guides.map((guide) => (
                  <SelectItem key={guide.id} value={guide.id}>
                    {guide.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parent Task Info */}
          {parentTask && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900 text-right">
                <strong>משימת אב:</strong> {parentTask.title}
              </p>
            </div>
          )}

          {/* Sub-tasks Section - Only for parent tasks (not sub-tasks) */}
          {!task && !parentTask && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">משימות משנה (אופציונלי)</Label>
                <span className="text-xs text-gray-500">
                  {subTasks.length} משימות משנה
                </span>
              </div>

              {/* Add Sub-task Input */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubTask();
                    }
                  }}
                  placeholder="הוסף משימת משנה..."
                  maxLength={200}
                  className="flex-1 text-right"
                  dir="rtl"
                />
                <Button
                  type="button"
                  onClick={handleAddSubTask}
                  disabled={!newSubTaskTitle.trim()}
                  variant="outline"
                  size="sm"
                >
                  <IconPlus className="w-4 h-4" />
                </Button>
              </div>

              {/* Sub-tasks List */}
              {subTasks.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {subTasks.map((subTask, index) => (
                    <div
                      key={subTask.id}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200"
                    >
                      {/* Drag Handle */}
                      <IconGripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={subTask.status === 'done'}
                        onChange={() => handleToggleSubTaskStatus(subTask.id)}
                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 flex-shrink-0"
                      />

                      {/* Title */}
                      <span
                        className={`flex-1 text-sm text-right ${
                          subTask.status === 'done'
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {subTask.title}
                      </span>

                      {/* Reorder Buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          type="button"
                          onClick={() => handleMoveSubTaskUp(index)}
                          disabled={index === 0}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <IconChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleMoveSubTaskDown(index)}
                          disabled={index === subTasks.length - 1}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <IconChevronDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Delete Button */}
                      <Button
                        type="button"
                        onClick={() => handleDeleteSubTask(subTask.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <IconTrash className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {subTasks.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  לא נוספו משימות משנה. השתמש בשדה למעלה כדי להוסיף.
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.title.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <IconLoader className="w-4 h-4 mr-2 animate-spin" />
                  שומר...
                </>
              ) : task ? (
                'שמור שינויים'
              ) : (
                'צור משימה'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

