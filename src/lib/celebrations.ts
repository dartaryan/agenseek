/**
 * Celebration Library - Story 0.10.3
 *
 * Confetti celebrations for journey phase completions.
 * Uses canvas-confetti for delightful user feedback.
 */

import confetti from 'canvas-confetti';

/**
 * Phase-specific color palettes
 */
const PHASE_COLORS = {
  core: ['#10b981', '#059669'], // emerald
  recommended: ['#a855f7', '#9333ea'], // purple
  interests: ['#3b82f6', '#2563eb'], // blue
  optional: ['#f97316', '#ea580c'], // orange
};

/**
 * Celebrate phase completion with confetti animation
 *
 * @param phaseId - The phase that was completed
 * @param origin - Optional origin point for confetti (defaults to center)
 */
export function celebratePhaseCompletion(
  phaseId: 'core' | 'recommended' | 'interests' | 'optional',
  origin?: { x: number; y: number }
) {
  const colors = PHASE_COLORS[phaseId];
  const originPoint = origin || { x: 0.5, y: 0.5 };

  // First burst - main celebration
  confetti({
    particleCount: 150,
    spread: 70,
    origin: originPoint,
    colors: colors,
    ticks: 300,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle', 'square'],
    scalar: 1.2,
  });

  // Second burst for extra effect (delayed slightly)
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: originPoint,
      colors: colors,
      ticks: 200,
      gravity: 1,
      decay: 0.92,
      startVelocity: 25,
    });
  }, 250);
}

/**
 * Celebrate completing all phases (master achievement)
 *
 * @param origin - Optional origin point for confetti
 */
export function celebrateJourneyMaster(origin?: { x: number; y: number }) {
  const originPoint = origin || { x: 0.5, y: 0.5 };

  // Rainbow burst for completing everything!
  const colors = ['#10b981', '#a855f7', '#3b82f6', '#f97316', '#eab308'];

  // Multiple bursts in sequence for epic celebration
  [0, 200, 400].forEach((delay) => {
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: originPoint,
        colors: colors,
        ticks: 400,
        gravity: 0.8,
        decay: 0.91,
        startVelocity: 45,
        shapes: ['circle', 'square', 'star'],
        scalar: 1.5,
      });
    }, delay);
  });
}

