/**
 * Avatar Selection Step Component
 * Story 0.5: Expand Avatar Collection & Add Onboarding Avatar Selection
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconSparkles,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  avatarStyles,
  generatePreviews,
  type AvatarStyle,
  type AvatarConfig,
} from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface AvatarSelectionStepProps {
  userId: string;
  initialConfig?: AvatarConfig | null;
  onNext: (config: AvatarConfig) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function AvatarSelectionStep({
  userId,
  initialConfig,
  onNext,
  onBack,
  onSkip,
}: AvatarSelectionStepProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(
    initialConfig?.style || 'avataaars'
  );
  const [selectedSeed, setSelectedSeed] = useState<string>(
    initialConfig?.seed || userId
  );

  // Generate 12 preview options per style (simplified for onboarding)
  const previewOptions = useMemo(() => {
    return generatePreviews(selectedStyle, 12);
  }, [selectedStyle]);

  const selectedConfig: AvatarConfig = {
    style: selectedStyle,
    seed: selectedSeed,
    options: {},
  };

  const handleSelectAvatar = (seed: string) => {
    setSelectedSeed(seed);
  };

  const handleNext = () => {
    onNext(selectedConfig);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
        >
          <IconSparkles className="w-8 h-8 text-primary" />
        </motion.div>

        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          בחר את האווטר שלך
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          בחר תמונה שמייצגת אותך בצורה הטובה ביותר
        </p>
      </div>

      {/* Large Preview */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <UserAvatar config={selectedConfig} size="xl" />
          <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
            <IconCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {avatarStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                selectedStyle === style.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {style.labelHe}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Grid - Simplified (12 options) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          בחר מתוך 12 אפשרויות
        </p>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {previewOptions.map((preview) => (
            <button
              key={preview.seed}
              onClick={() => handleSelectAvatar(preview.seed)}
              className={cn(
                'relative rounded-lg overflow-hidden transition-all hover:scale-105',
                preview.seed === selectedSeed
                  ? 'ring-4 ring-primary shadow-lg'
                  : 'hover:ring-2 hover:ring-gray-300'
              )}
            >
              <UserAvatar config={preview} size="lg" />
              {preview.seed === selectedSeed && (
                <div className="absolute top-1 left-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <IconCheck className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <IconArrowLeft className="w-5 h-5" />
          חזור
        </Button>

        <button
          onClick={onSkip}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline underline-offset-4 text-sm"
        >
          דלג
        </button>

        <Button onClick={handleNext} className="gap-2">
          הבא
          <IconArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}

