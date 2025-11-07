import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSparkles,
  IconRocket,
  IconCode,
  IconChartBar,
  IconPalette,
  IconBuildingBridge,
  IconClipboardList,
  IconTestPipe,
  IconTie,
  IconDeviceGamepad,
  IconBulb,
  IconRobotFace,
  IconSchema,
  IconCodeDots,
  IconCheckbox,
  IconUsersGroup,
  IconChartArrows,
  IconStar,
  IconStarHalfFilled,
  IconStarsFilled,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 5;

export function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
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
      description: 'You can complete your profile anytime from Settings.',
    });
    navigate('/dashboard');
  };

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
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
              <WelcomeStep key="welcome" onNext={handleNext} onSkip={handleSkip} />
            )}
            {currentStep === 2 && (
              <RoleStep
                key="role"
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <InterestsStep
                key="interests"
                selectedInterests={selectedInterests}
                onToggleInterest={handleToggleInterest}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <ExperienceStep
                key="experience"
                selectedExperience={selectedExperience}
                onSelectExperience={setSelectedExperience}
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
        <Button size="lg" onClick={onNext} className="text-lg px-8 py-6 h-auto group">
          <IconRocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
          Let's personalize your journey
        </Button>

        {/* Skip Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
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

// Step 2: Role Selection
interface RoleStepProps {
  selectedRole: string | null;
  onSelectRole: (role: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Role {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const ROLES: Role[] = [
  {
    id: 'developer',
    icon: IconCode,
    title: 'Developer',
    description: 'Building and implementing software solutions',
  },
  {
    id: 'product-manager',
    icon: IconChartBar,
    title: 'Product Manager',
    description: 'Defining product vision and strategy',
  },
  {
    id: 'designer',
    icon: IconPalette,
    title: 'UX/UI Designer',
    description: 'Crafting user experiences and interfaces',
  },
  {
    id: 'architect',
    icon: IconBuildingBridge,
    title: 'Architect',
    description: 'Designing system architecture and patterns',
  },
  {
    id: 'project-manager',
    icon: IconClipboardList,
    title: 'Project Manager',
    description: 'Coordinating projects and teams',
  },
  {
    id: 'qa-engineer',
    icon: IconTestPipe,
    title: 'QA Engineer',
    description: 'Ensuring quality through testing',
  },
  {
    id: 'executive',
    icon: IconTie,
    title: 'Executive',
    description: 'Leading strategic initiatives',
  },
  {
    id: 'game-developer',
    icon: IconDeviceGamepad,
    title: 'Game Developer',
    description: 'Creating interactive game experiences',
  },
  {
    id: 'non-technical',
    icon: IconBulb,
    title: 'Non-Technical',
    description: 'Supporting technical teams in other capacities',
  },
];

// Interests for Step 3
interface Interest {
  id: string;
  icon: React.ElementType;
  title: string;
}

const INTERESTS: Interest[] = [
  {
    id: 'agents-workflows',
    icon: IconRobotFace,
    title: 'Agents & Workflows',
  },
  {
    id: 'architecture-design',
    icon: IconSchema,
    title: 'Architecture & Design',
  },
  {
    id: 'implementation-development',
    icon: IconCodeDots,
    title: 'Implementation & Development',
  },
  {
    id: 'testing-quality',
    icon: IconCheckbox,
    title: 'Testing & Quality',
  },
  {
    id: 'game-development',
    icon: IconDeviceGamepad,
    title: 'Game Development',
  },
  {
    id: 'creative-processes',
    icon: IconChartArrows,
    title: 'Creative Processes',
  },
  {
    id: 'team-collaboration',
    icon: IconUsersGroup,
    title: 'Team Collaboration',
  },
  {
    id: 'project-management',
    icon: IconClipboardList,
    title: 'Project Management',
  },
];

function RoleStep({ selectedRole, onSelectRole, onNext, onBack }: RoleStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          What's your role?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This helps us recommend the most relevant content for you
        </p>
      </motion.div>

      {/* Role Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {ROLES.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => onSelectRole(role.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-xl text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" stroke={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold mb-1 transition-colors ${
                      isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {role.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedRole} size="lg">
          Next
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Step 3: Interests Selection
interface InterestsStepProps {
  selectedInterests: string[];
  onToggleInterest: (interestId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function InterestsStep({
  selectedInterests,
  onToggleInterest,
  onNext,
  onBack,
}: InterestsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          What interests you?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select any topics you'd like to explore (you can select multiple or none)
        </p>
      </motion.div>

      {/* Interest Chips Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {INTERESTS.map((interest, index) => {
          const Icon = interest.icon;
          const isSelected = selectedInterests.includes(interest.id);

          return (
            <motion.button
              key={interest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => onToggleInterest(interest.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                isSelected
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
                    stroke={1.5}
                  />
                </div>
                <h3
                  className={`font-semibold text-sm transition-colors ${
                    isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {interest.title}
                </h3>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selection Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        {selectedInterests.length === 0
          ? 'No interests selected yet'
          : `${selectedInterests.length} ${selectedInterests.length === 1 ? 'interest' : 'interests'} selected`}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={onNext} size="lg">
          Next
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Step 4: Experience Level Selection
interface ExperienceStepProps {
  selectedExperience: string | null;
  onSelectExperience: (experience: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExperienceLevel {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    id: 'beginner',
    icon: IconStar,
    title: 'Beginner',
    description: "I'm new to BMAD and want to start with the basics",
    color: 'text-blue-500',
  },
  {
    id: 'intermediate',
    icon: IconStarHalfFilled,
    title: 'Intermediate',
    description: 'I have some experience and want to deepen my knowledge',
    color: 'text-emerald-500',
  },
  {
    id: 'advanced',
    icon: IconStarsFilled,
    title: 'Advanced',
    description: "I'm experienced and looking for advanced concepts",
    color: 'text-purple-500',
  },
];

function ExperienceStep({
  selectedExperience,
  onSelectExperience,
  onNext,
  onBack,
}: ExperienceStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          What's your experience level?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This helps us recommend content at the right difficulty for you
        </p>
      </motion.div>

      {/* Experience Level Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {EXPERIENCE_LEVELS.map((level, index) => {
          const Icon = level.icon;
          const isSelected = selectedExperience === level.id;

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => onSelectExperience(level.id)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                isSelected
                  ? 'bg-primary/10 border-2 border-primary shadow-xl shadow-primary/20'
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                {/* Icon */}
                <div
                  className={`p-4 rounded-xl transition-colors ${
                    isSelected ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    className={`w-12 h-12 ${isSelected ? 'text-primary' : level.color}`}
                    stroke={1.5}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-bold transition-colors ${
                    isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {level.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {level.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedExperience} size="lg">
          Next
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Placeholder for future steps (2.9)
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
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>{isLast ? 'Complete Onboarding' : 'Next'}</Button>
      </div>
    </motion.div>
  );
}
