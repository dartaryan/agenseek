/**
 * Guide Completion Success Modal - Story 4.7
 *
 * Celebration modal with confetti animation and next guide recommendation
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconTrophy, IconArrowLeft, IconBook, IconX } from '@tabler/icons-react';
import type { GuideMetadata } from '@/types/content-blocks';

interface GuideCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guideTitle: string;
  nextGuide?: GuideMetadata | null;
}

export function GuideCompletionModal({
  open,
  onOpenChange,
  guideTitle,
  nextGuide,
}: GuideCompletionModalProps) {
  const navigate = useNavigate();
  const [confettiFired, setConfettiFired] = useState(false);

  // Fire confetti when modal opens
  useEffect(() => {
    if (open && !confettiFired) {
      // Fire confetti with emerald theme
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#10B981', '#6EE7B7', '#2DD4BF', '#059669', '#34D399'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#10B981', '#6EE7B7', '#2DD4BF', '#059669', '#34D399'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
      setConfettiFired(true);
    }

    // Reset confetti flag when modal closes
    if (!open) {
      setConfettiFired(false);
    }
  }, [open, confettiFired]);

  const handleContinueToNext = () => {
    if (nextGuide) {
      navigate(`/guides/${nextGuide.slug}`);
      onOpenChange(false);
    } else {
      navigate('/guides');
      onOpenChange(false);
    }
  };

  const handleBackToLibrary = () => {
    navigate('/guides');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse">
              <IconTrophy className="w-12 h-12 text-white" stroke={1.5} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">כל הכבוד! 🎉</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            השלמת בהצלחה את המדריך
            <br />
            <strong className="text-gray-900 dark:text-gray-100">{guideTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Next guide recommendation */}
        {nextGuide && (
          <div className="py-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ממשיך למדריך הבא?
            </h3>
            <Card className="p-4 border-2 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
              onClick={handleContinueToNext}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <IconBook className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                    {nextGuide.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {nextGuide.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      {nextGuide.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {nextGuide.estimatedMinutes} דקות
                    </span>
                  </div>
                </div>
                <IconArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              </div>
            </Card>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleBackToLibrary} className="flex-1">
            <IconBook className="w-4 h-4 ml-2" />
            חזרה למדריכים
          </Button>
          {nextGuide && (
            <Button onClick={handleContinueToNext} className="flex-1">
              <IconArrowLeft className="w-4 h-4 ml-2" />
              המדריך הבא
            </Button>
          )}
          {!nextGuide && (
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              <IconX className="w-4 h-4 ml-2" />
              סגור
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

