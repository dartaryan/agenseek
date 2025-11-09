import { motion } from 'framer-motion';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  const steps = [
    { number: 1, label: 'ברוכים הבאים' },
    { number: 2, label: 'בחירת אווטר' },
    { number: 3, label: 'תפקיד' },
    { number: 4, label: 'תחומי עניין' },
    { number: 5, label: 'ניסיון' },
    { number: 6, label: 'נתיב למידה' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar Background */}
      <div className="relative mb-4">
        <div className="absolute top-5 right-0 left-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
        <div
          className="absolute top-5 right-0 h-0.5 bg-primary transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <motion.div
                key={step.number}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Step Circle */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                      : isCompleted
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {step.number}
                </div>

                {/* Step Label */}
                <div
                  className={`mt-2 text-xs font-medium text-center transition-all duration-300 ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Indicator */}
      <div className="text-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          שלב {currentStep} מתוך {totalSteps}
        </span>
      </div>
    </div>
  );
}
