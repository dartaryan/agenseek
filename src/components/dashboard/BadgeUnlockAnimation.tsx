/**
 * Story 5.3: Badge Unlock Animation Component
 * Displays celebration animation with confetti when a badge is unlocked
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { BadgeDefinition } from '@/lib/achievements';
import { BadgeDisplay } from './BadgeDisplay';
import { IconSparkles } from '@tabler/icons-react';

interface BadgeUnlockAnimationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeDefinition;
  onViewDetails?: () => void;
}

export function BadgeUnlockAnimation({
  open,
  onOpenChange,
  badge,
  onViewDetails,
}: BadgeUnlockAnimationProps) {
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  // Fire confetti when modal opens
  useEffect(() => {
    if (open && !hasShownConfetti) {
      fireConfetti();
      setHasShownConfetti(true);
    }

    // Reset confetti state when modal closes
    if (!open) {
      setHasShownConfetti(false);
    }
  }, [open, hasShownConfetti]);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ['#10B981', '#6EE7B7', '#2DD4BF', '#34D399']
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fire from left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });

      // Fire from right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-white overflow-hidden"
        dir="rtl"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex flex-col items-center py-8 gap-6"
          >
            {/* Sparkles Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <IconSparkles className="w-12 h-12 text-yellow-500" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
            >
              תג חדש נפתח!
            </motion.h2>

            {/* Badge with Scale + Bounce Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
            >
              <BadgeDisplay
                badge={badge}
                earned={true}
                size="large"
                showProgress={false}
              />
            </motion.div>

            {/* Badge Name with Pulse */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {badge.nameHe}
              </h3>
              <p className="text-gray-600">
                {badge.descriptionHe}
              </p>
            </motion.div>

            {/* Celebration Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center py-3 px-6 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <p className="text-emerald-700 font-medium">
                כל הכבוד! המשך ללמוד ולהשיג תגים נוספים! 🎉
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-3 w-full pt-4"
            >
              {onViewDetails && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onOpenChange(false);
                    onViewDetails();
                  }}
                >
                  פרטים נוספים
                </Button>
              )}
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={() => onOpenChange(false)}
              >
                מעולה!
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

