import { useState, type FormEvent } from 'react';
import { IconBug } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { hebrewLocale } from '@/lib/locale/he';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface BugReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Bug Report Modal Component
 * Story: 11.2 - Footer Redesign & Credits
 *
 * Features:
 * - Hebrew form with validation
 * - Auto-fill email for logged-in users
 * - Character count for description
 * - Client-side validation
 * - Submits to bug_reports table
 */
export function BugReportModal({ open, onOpenChange }: BugReportModalProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const locale = hebrewLocale.bugReport;

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = locale.validationEmailRequired;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = locale.validationEmailInvalid;
    }

    // Title validation
    if (!title.trim()) {
      newErrors.title = locale.validationTitleRequired;
    } else if (title.trim().length < 10) {
      newErrors.title = locale.validationTitleTooShort;
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = locale.validationDescRequired;
    } else if (description.trim().length < 20) {
      newErrors.description = locale.validationDescTooShort;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setEmail(user?.email || '');
    setTitle('');
    setDescription('');
    setLocation('');
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id || null,
        email: email.trim(),
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || null,
        status: 'new',
      });

      if (error) throw error;

      // Success!
      toast.success(locale.successToast);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit bug report:', error);
      toast.error(locale.errorToast);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onOpenChange(false);
    // Reset form after a short delay to avoid visual glitches
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <IconBug className="text-emerald-500" size={24} stroke={1.5} />
            {locale.title}
          </DialogTitle>
          <DialogDescription className="text-right">
            {locale.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <Label htmlFor="bug-email" className="text-right block mb-1.5">
              {locale.emailLabel}
            </Label>
            <Input
              id="bug-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              placeholder="your@email.com"
              className={`text-right ${errors.email ? 'border-red-500' : ''}`}
              required
              disabled={!!user?.email} // Disable if logged in
              dir="ltr" // Email is LTR
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 text-right">{errors.email}</p>
            )}
          </div>

          {/* Title field */}
          <div>
            <Label htmlFor="bug-title" className="text-right block mb-1.5">
              {locale.titleLabel}
            </Label>
            <Input
              id="bug-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              placeholder={locale.titlePlaceholder}
              className={`text-right ${errors.title ? 'border-red-500' : ''}`}
              required
              maxLength={200}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1 text-right">{errors.title}</p>
            )}
          </div>

          {/* Description field */}
          <div>
            <Label htmlFor="bug-description" className="text-right block mb-1.5">
              {locale.descriptionLabel}
            </Label>
            <Textarea
              id="bug-description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setDescription(e.target.value);
                }
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              placeholder={locale.descriptionPlaceholder}
              className={`text-right resize-none ${errors.description ? 'border-red-500' : ''}`}
              rows={5}
              required
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-sm text-red-500 text-right">{errors.description}</p>
              ) : (
                <div />
              )}
              <p className={`text-xs ${description.length > 450 ? 'text-orange-500' : 'text-slate-500'}`}>
                {description.length}/500 {locale.charCount}
              </p>
            </div>
          </div>

          {/* Location field (optional) */}
          <div>
            <Label htmlFor="bug-location" className="text-right block mb-1.5">
              {locale.locationLabel}
            </Label>
            <Input
              id="bug-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={locale.locationPlaceholder}
              className="text-right"
              maxLength={200}
            />
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              {locale.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              {isSubmitting ? locale.submitting : locale.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

