/**
 * TaskModal Component - Story 6.4
 * Modal for creating and editing tasks
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
import { createTask, updateTask } from '../../lib/api/tasks';
import { useAuth } from '../../hooks/useAuth';
import { IconLoader } from '@tabler/icons-react';
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

  // Load guides for dropdown
  useEffect(() => {
    const loadGuides = async () => {
      try {
        const response = await fetch('/src/content/locale/he/guides/index.json');
        const guidesData = await response.json();
        setGuides(guidesData);
      } catch (error) {
        console.error('[TaskModal] Error loading guides:', error);
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
    } else {
      // Create mode
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        guide_slug: guideSlug || '',
      });
    }
  }, [task, guideSlug, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (task) {
        // Update existing task
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

        const newTask = await createTask(newTaskData);
        onSaved(newTask);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">{modalTitle}</DialogTitle>
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
              className="mt-1"
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
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
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
              <p className="text-sm text-blue-900">
                <strong>משימת אב:</strong> {parentTask.title}
              </p>
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

