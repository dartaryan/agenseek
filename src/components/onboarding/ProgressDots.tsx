import { motion } from 'framer-motion';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <motion.div
            key={step}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-primary scale-125 ring-4 ring-primary/20'
                  : isCompleted
                    ? 'bg-primary/60'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          </motion.div>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
