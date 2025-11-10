/**
 * Avatar generation utilities using DiceBear
 * Story 0.3: User Avatar Picture Selection
 */

import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { bottts } from '@dicebear/collection';
import { lorelei } from '@dicebear/collection';
import { personas } from '@dicebear/collection';
import { micah } from '@dicebear/collection';
import { adventurer } from '@dicebear/collection';
import { bigSmile } from '@dicebear/collection';
import { funEmoji } from '@dicebear/collection';
import { croodles } from '@dicebear/collection';
import { croodlesNeutral } from '@dicebear/collection';
import { thumbs } from '@dicebear/collection';
import { identicon } from '@dicebear/collection';
import { rings } from '@dicebear/collection';

export type AvatarStyle =
  | 'avataaars'
  | 'bottts'
  | 'lorelei'
  | 'personas'
  | 'micah'
  | 'adventurer'
  | 'bigSmile'
  | 'funEmoji'
  | 'croodles'
  | 'croodlesNeutral'
  | 'thumbs'
  | 'identicon'
  | 'rings';

/**
 * Check if a string is a valid AvatarStyle
 */
export function isValidAvatarStyle(style: string): style is AvatarStyle {
  return ['avataaars', 'bottts', 'lorelei', 'personas', 'micah', 'adventurer', 'bigSmile', 'funEmoji', 'croodles', 'croodlesNeutral', 'thumbs', 'identicon', 'rings'].includes(style);
}

/**
 * Normalize avatar style to ensure it's valid
 * Returns 'avataaars' if style is invalid
 */
export function normalizeAvatarStyle(style: string | undefined): AvatarStyle {
  if (!style || !isValidAvatarStyle(style)) {
    return 'avataaars';
  }
  return style;
}

export interface AvatarConfig {
  style: AvatarStyle;
  seed: string;
  options?: Record<string, any>;
}

const styleCollections = {
  avataaars,
  bottts,
  lorelei,
  personas,
  micah,
  adventurer,
  bigSmile,
  funEmoji,
  croodles,
  croodlesNeutral,
  thumbs,
  identicon,
  rings,
};

/**
 * Generate avatar SVG string
 * Fallback to 'avataaars' if style is invalid
 */
export function generateAvatar(config: AvatarConfig): string {
  try {
    const collection = styleCollections[config.style];

    // If collection doesn't exist, fallback to avataaars
    if (!collection) {
      console.warn(`Avatar style '${config.style}' not found, falling back to 'avataaars'`);
      const fallbackCollection = styleCollections.avataaars;
      const avatar = createAvatar(fallbackCollection as any, {
        seed: config.seed,
        ...config.options,
      });
      return avatar.toString();
    }

    // Type assertion needed due to DiceBear's generic types
    const avatar = createAvatar(collection as any, {
      seed: config.seed,
      ...config.options,
    });

    return avatar.toString();
  } catch (error) {
    console.error('Error generating avatar:', error);
    // Ultimate fallback - generate simple avataaars
    const fallbackCollection = styleCollections.avataaars;
    const avatar = createAvatar(fallbackCollection as any, {
      seed: config.seed || 'default',
    });
    return avatar.toString();
  }
}

/**
 * Generate avatar data URL for img src
 */
export function generateAvatarDataUrl(config: AvatarConfig): string {
  const svg = generateAvatar(config);
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get default avatar config for a user
 */
export function getDefaultAvatarConfig(userId: string): AvatarConfig {
  return {
    style: 'avataaars',
    seed: userId, // Use user ID as seed for consistent default
    options: {},
  };
}

/**
 * Available avatar styles with labels in English and Hebrew
 */
export const avatarStyles: Array<{
  value: AvatarStyle;
  label: string;
  labelHe: string;
  description?: string;
}> = [
  {
    value: 'avataaars',
    label: 'Cartoon Faces',
    labelHe: 'פרצופים מצוירים',
    description: 'Classic cartoon-style avatars',
  },
  {
    value: 'bottts',
    label: 'Robots',
    labelHe: 'רובוטים',
    description: 'Fun robot characters',
  },
  {
    value: 'lorelei',
    label: 'Illustrated Faces',
    labelHe: 'פרצופים מאוירים',
    description: 'Hand-drawn illustrated style',
  },
  {
    value: 'personas',
    label: 'Diverse Faces',
    labelHe: 'פרצופים מגוונים',
    description: 'Diverse human characters',
  },
  {
    value: 'micah',
    label: 'Minimalist',
    labelHe: 'דמויות מינימליסטיות',
    description: 'Clean, simple designs',
  },
  {
    value: 'adventurer',
    label: 'Adventurers',
    labelHe: 'הרפתקנים',
    description: 'Adventure-themed characters',
  },
  {
    value: 'bigSmile',
    label: 'Big Smile',
    labelHe: 'חיוך גדול',
    description: 'Happy, friendly faces',
  },
  {
    value: 'funEmoji',
    label: 'Fun Emoji',
    labelHe: 'אימוג׳ים כיפיים',
    description: 'Emoji-style avatars',
  },
  {
    value: 'croodles',
    label: 'Croodles',
    labelHe: 'קרודלס',
    description: 'Hand-drawn doodle avatars',
  },
  {
    value: 'croodlesNeutral',
    label: 'Croodles Neutral',
    labelHe: 'קרודלס ניטרלי',
    description: 'Neutral doodle style',
  },
  {
    value: 'thumbs',
    label: 'Thumbs',
    labelHe: 'אגודלים',
    description: 'Thumbs up/down avatars',
  },
  {
    value: 'identicon',
    label: 'Identicon',
    labelHe: 'איידנטיקון',
    description: 'Geometric patterns',
  },
  {
    value: 'rings',
    label: 'Rings',
    labelHe: 'טבעות',
    description: 'Colorful ring patterns',
  },
];

/**
 * Generate preview variations for a style
 * Creates multiple avatars with different seeds for user selection
 */
export function generateAvatarPreviews(
  style: AvatarStyle,
  count: number = 48
): Array<{ seed: string; config: AvatarConfig }> {
  const previews: Array<{ seed: string; config: AvatarConfig }> = [];

  for (let i = 0; i < count; i++) {
    const seed = `${style}-preview-${i}`;
    previews.push({
      seed,
      config: {
        style,
        seed,
        options: {},
      },
    });
  }

  return previews;
}

/**
 * Alias for generateAvatarPreviews
 * Used in onboarding for simplified preview generation
 */
export function generatePreviews(
  style: AvatarStyle,
  count: number = 36
): Array<AvatarConfig> {
  return generateAvatarPreviews(style, count).map((p) => p.config);
}

