/**
 * Story 5.3: Badge Modal Component
 * Shows detailed information about an achievement badge
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeDefinition, getBadgeProgress, UserStats } from '@/lib/achievements';
import { BadgeDisplay } from './BadgeDisplay';
import { IconShare, IconX } from '@tabler/icons-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface BadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeDefinition;
  earned: boolean;
  earnedAt?: Date | null;
  userStats: UserStats;
}

export function BadgeModal({
  open,
  onOpenChange,
  badge,
  earned,
  earnedAt,
  userStats,
}: BadgeModalProps) {
  const progress = getBadgeProgress(badge.id, userStats);

  const handleShare = () => {
    // Future: Implement sharing functionality
    console.log('Share badge:', badge.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {badge.nameHe}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <IconX className="h-4 w-4" />
              <span className="sr-only">סגור</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Badge Display */}
        <div className="flex flex-col items-center py-6 gap-4">
          <BadgeDisplay
            badge={badge}
            earned={earned}
            progress={progress}
            size="large"
            showProgress={false}
          />

          {/* Badge Description */}
          <DialogDescription className="text-center text-base">
            {badge.descriptionHe}
          </DialogDescription>

          {/* Progress or Earned Date */}
          <div className="w-full mt-4">
            {earned && earnedAt ? (
              <div className="text-center py-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 mb-1">הושג ב:</p>
                <p className="text-lg font-semibold text-emerald-700">
                  {format(earnedAt, 'PPP', { locale: he })}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">התקדמות</span>
                  <span className="font-semibold text-gray-900">
                    {progress.current} / {progress.target}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                <p className="text-center text-sm text-gray-600">
                  {progress.percentage}% הושלם
                </p>

                {/* Remaining to unlock */}
                {progress.current < progress.target && (
                  <div className="text-center py-2 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      עוד <span className="font-bold">{progress.target - progress.current}</span>{' '}
                      לפני שתקבל את התג
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {earned && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleShare}
              disabled
            >
              <IconShare className="w-4 h-4 ml-2" />
              שתף
            </Button>
          )}
          <Button
            variant={earned ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {earned ? 'מעולה!' : 'המשך ללמוד'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

