import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSparkles, IconRocket } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 5;

export function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    toast({
      title: 'Onboarding skipped',
      description: "You can complete your profile anytime from Settings.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Progress Dots */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-10">
        <ProgressDots currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <WelcomeStep
                key="welcome"
                onNext={handleNext}
                onSkip={handleSkip}
              />
            )}
            {currentStep === 2 && (
              <PlaceholderStep
                key="role"
                title="Step 2: Select Role"
                description="Role selection coming in Story 2.6"
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <PlaceholderStep
                key="interests"
                title="Step 3: Select Interests"
                description="Interests selection coming in Story 2.7"
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <PlaceholderStep
                key="experience"
                title="Step 4: Experience Level"
                description="Experience level selection coming in Story 2.8"
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <PlaceholderStep
                key="path"
                title="Step 5: Learning Path"
                description="Learning path generation coming in Story 2.9"
                onNext={() => navigate('/dashboard')}
                onBack={handleBack}
                isLast
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step 1: Welcome Screen
interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="mb-8 flex justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            <IconSparkles className="w-20 h-20 text-primary" stroke={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        ברוכים הבאים ל-Agenseek!
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6"
      >
        Welcome to Agenseek!
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed"
      >
        Your personalized BMAD learning journey starts here. We'll help you discover the right
        content, track your progress, and connect with your team.
      </motion.p>

      {/* Primary Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <Button
          size="lg"
          onClick={onNext}
          className="text-lg px-8 py-6 h-auto group"
        >
          <IconRocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
          Let's personalize your journey
        </Button>

        {/* Skip Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={onSkip}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline underline-offset-4 transition-colors"
          >
            I'll do this later
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex items-center justify-center gap-8 text-xs text-gray-400"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span>5 quick steps</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span>2 minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span>Personalized just for you</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Placeholder for future steps (2.6-2.9)
interface PlaceholderStepProps {
  title: string;
  description: string;
  onNext: () => void;
  onBack: () => void;
  isLast?: boolean;
}

function PlaceholderStep({
  title,
  description,
  onNext,
  onBack,
  isLast = false,
}: PlaceholderStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          {isLast ? 'Complete Onboarding' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
}
