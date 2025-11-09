import { useState, useEffect } from 'react';
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
  IconBooks,
  IconCheck,
  IconLoader2,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { AvatarSelectionStep } from '@/components/onboarding/AvatarSelectionStep';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { getGuideCatalog } from '@/lib/guide-catalog';
import { categorizeGuidesByLearningPath } from '@/lib/learning-path';
import confetti from 'canvas-confetti';
import type { AvatarConfig } from '@/lib/avatar';

const TOTAL_STEPS = 6;

export function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

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

  const handleSkip = async () => {
    if (!user?.id) {
      console.error('[Onboarding] No user ID found');
      return;
    }

    try {
      console.log('[Onboarding Skip] Starting skip process...');
      
      // Mark onboarding as completed even when skipped
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      console.log('[Onboarding Skip] Profile updated in database');

      // CRITICAL FIX: Verify profile update completed before navigating
      // Same fix as handleComplete to prevent infinite loop
      console.log('[Onboarding Skip] Verifying profile update...');

      // Poll database to confirm update (max 3 seconds)
      const maxAttempts = 30;
      let attempts = 0;
      let profileUpdated = false;

      while (attempts < maxAttempts && !profileUpdated) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        const { data: verifyProfile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', user.id)
          .single();
        
        if (verifyProfile?.completed_onboarding === true) {
          profileUpdated = true;
          console.log(`[Onboarding Skip] ✓ Profile verified (attempt ${attempts + 1}/${maxAttempts})`);
        } else {
          attempts++;
        }
      }

      if (!profileUpdated) {
        console.error('[Onboarding Skip] Profile verification timeout!');
        throw new Error('לא הצלחנו לאמת את עדכון הפרופיל');
      }

      // NOW refresh the profile in AuthContext
      await refreshProfile();
      console.log('[Onboarding Skip] AuthContext refreshed');

      // Wait for React state propagation
      await new Promise((resolve) => setTimeout(resolve, 150));
      console.log('[Onboarding Skip] State propagation complete');

      toast({
        title: 'און בורדינג דולג',
        description: 'ניתן להשלים את הפרופיל שלך בכל עת מההגדרות.',
      });
      
      // Navigate to dashboard
      console.log('[Onboarding Skip] Navigating to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('[Onboarding Skip] Error:', error);
      toast({
        title: 'שגיאה',
        description: 'נכשל בדילוג על און בורדינג. אנא נסה שוב.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Story 6.15: Animated background shapes */}
      <AnimatedBackground variant="auth" />

      {/* Progress Stepper - Fixed at top with padding */}
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border dark:border-gray-700 py-6 px-6 sticky top-0 z-20 shadow-sm">
        <ProgressDots currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <WelcomeStep key="welcome" onNext={handleNext} onSkip={handleSkip} />
            )}
            {currentStep === 2 && (
              <AvatarSelectionStep
                key="avatar"
                userId={user?.id || ''}
                initialConfig={selectedAvatar}
                onNext={(config) => {
                  setSelectedAvatar(config);
                  handleNext();
                }}
                onBack={handleBack}
                onSkip={handleSkip}
              />
            )}
            {currentStep === 3 && (
              <RoleStep
                key="role"
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <InterestsStep
                key="interests"
                selectedInterests={selectedInterests}
                onToggleInterest={handleToggleInterest}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <ExperienceStep
                key="experience"
                selectedExperience={selectedExperience}
                onSelectExperience={setSelectedExperience}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 6 && (
              <LearningPathStep
                key="path"
                userId={user?.id || ''}
                selectedRole={selectedRole || ''}
                selectedInterests={selectedInterests}
                selectedExperience={selectedExperience || ''}
                selectedAvatar={selectedAvatar}
                onComplete={() => navigate('/dashboard')}
                onBack={handleBack}
                refreshProfile={refreshProfile}
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
        className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4"
      >
        ברוכים הבאים ל-Agenseek!
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-muted-foreground dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed"
      >
        מסע הלמידה האישי שלך ב-BMAD מתחיל כאן. נעזור לך לגלות את התוכן הנכון, לעקוב אחר ההתקדמות שלך
        ולהתחבר לצוות שלך.
      </motion.p>

      {/* Primary Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <Button size="lg" onClick={onNext} className="text-lg px-8 py-6 h-auto group">
          <IconRocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          בואו נתאים אישית את המסע שלכם
        </Button>

        {/* Skip Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <button
            onClick={onSkip}
            className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-300 text-sm underline underline-offset-4 transition-colors"
          >
            אעשה זאת מאוחר יותר
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
          <span>6 שלבים מהירים</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span>3 דקות</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span>מותאם אישית עבורך</span>
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
    title: 'מפתח',
    description: 'בניה ויישום פתרונות תוכנה',
  },
  {
    id: 'product-manager',
    icon: IconChartBar,
    title: 'מנהל מוצר',
    description: 'הגדרת חזון ואסטרטגיה של מוצר',
  },
  {
    id: 'designer',
    icon: IconPalette,
    title: 'מעצב UX/UI',
    description: 'עיצוב חוויות משתמש וממשקים',
  },
  {
    id: 'architect',
    icon: IconBuildingBridge,
    title: 'ארכיטקט',
    description: 'תכנון ארכיטקטורת מערכת ותבניות',
  },
  {
    id: 'project-manager',
    icon: IconClipboardList,
    title: 'מנהל פרויקטים',
    description: 'תיאום פרויקטים וצוותים',
  },
  {
    id: 'qa-engineer',
    icon: IconTestPipe,
    title: 'מהנדס QA',
    description: 'הבטחת איכות באמצעות בדיקות',
  },
  {
    id: 'executive',
    icon: IconTie,
    title: 'מנהל בכיר',
    description: 'הובלת יוזמות אסטרטגיות',
  },
  {
    id: 'game-developer',
    icon: IconDeviceGamepad,
    title: 'מפתח משחקים',
    description: 'יצירת חוויות משחק אינטראקטיביות',
  },
  {
    id: 'non-technical',
    icon: IconBulb,
    title: 'לא טכני',
    description: 'תמיכה בצוותים טכניים בתפקידים אחרים',
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
    title: 'סוכנים וזרימות עבודה',
  },
  {
    id: 'architecture-design',
    icon: IconSchema,
    title: 'ארכיטקטורה ועיצוב',
  },
  {
    id: 'implementation-development',
    icon: IconCodeDots,
    title: 'יישום ופיתוח',
  },
  {
    id: 'testing-quality',
    icon: IconCheckbox,
    title: 'בדיקות ואיכות',
  },
  {
    id: 'game-development',
    icon: IconDeviceGamepad,
    title: 'פיתוח משחקים',
  },
  {
    id: 'creative-processes',
    icon: IconChartArrows,
    title: 'תהליכים יצירתיים',
  },
  {
    id: 'team-collaboration',
    icon: IconUsersGroup,
    title: 'שיתוף פעולה צוותי',
  },
  {
    id: 'project-management',
    icon: IconClipboardList,
    title: 'ניהול פרויקטים',
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
          מה התפקיד שלך?
        </h2>
        <p className="text-muted-foreground dark:text-gray-400">
          זה עוזר לנו להמליץ על התוכן הרלוונטי ביותר עבורך
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
                  : 'bg-white dark:bg-gray-800 border-2 border-border dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" stroke={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold mb-1 transition-colors ${
                      isSelected ? 'text-primary' : 'text-foreground dark:text-white'
                    }`}
                  >
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
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
          חזור
        </Button>
        <Button onClick={onNext} disabled={!selectedRole} size="lg">
          הבא
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
          מה מעניין אותך?
        </h2>
        <p className="text-muted-foreground dark:text-gray-400">
          בחר נושאים שתרצה לחקור (ניתן לבחור מספר נושאים או אף אחד)
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
                  : 'bg-white dark:bg-gray-800 border-2 border-border dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    isSelected ? 'bg-white/20' : 'bg-muted dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? 'text-white' : 'text-muted-foreground dark:text-gray-400'
                    }`}
                    stroke={1.5}
                  />
                </div>
                <h3
                  className={`font-semibold text-sm transition-colors ${
                    isSelected ? 'text-white' : 'text-foreground dark:text-white'
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
        className="text-center mb-6 text-sm text-muted-foreground dark:text-gray-400"
      >
        {selectedInterests.length === 0
          ? 'טרם נבחרו תחומי עניין'
          : `${selectedInterests.length} ${selectedInterests.length === 1 ? 'תחום עניין נבחר' : 'תחומי עניין נבחרו'}`}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="outline" onClick={onBack} size="lg">
          חזור
        </Button>
        <Button onClick={onNext} size="lg">
          הבא
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
    title: 'מתחיל',
    description: 'אני חדש ב-BMAD ורוצה להתחיל מהיסודות',
    color: 'text-blue-500',
  },
  {
    id: 'intermediate',
    icon: IconStarHalfFilled,
    title: 'בינוני',
    description: 'יש לי ניסיון מסוים ורוצה להעמיק את הידע שלי',
    color: 'text-emerald-500',
  },
  {
    id: 'advanced',
    icon: IconStarsFilled,
    title: 'מתקדם',
    description: 'אני מנוסה ומחפש מושגים מתקדמים',
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
          מה רמת הניסיון שלך?
        </h2>
        <p className="text-muted-foreground dark:text-gray-400">
          זה עוזר לנו להמליץ על תוכן ברמת הקושי המתאימה עבורך
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
                  : 'bg-white dark:bg-gray-800 border-2 border-border dark:border-gray-700 hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                {/* Icon */}
                <div
                  className={`p-4 rounded-xl transition-colors ${
                    isSelected ? 'bg-primary/20' : 'bg-muted dark:bg-gray-700'
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
                    isSelected ? 'text-primary' : 'text-foreground dark:text-white'
                  }`}
                >
                  {level.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
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
          חזור
        </Button>
        <Button onClick={onNext} disabled={!selectedExperience} size="lg">
          הבא
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Step 5: Learning Path Generated
interface LearningPathStepProps {
  userId: string;
  selectedRole: string;
  selectedInterests: string[];
  selectedExperience: string;
  selectedAvatar: AvatarConfig | null;
  onComplete: () => void;
  onBack: () => void;
  refreshProfile: () => Promise<void>;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
}

interface GuideSection {
  category: string;
  description: string;
  guides: Guide[];
}

function LearningPathStep({
  userId,
  selectedRole,
  selectedInterests,
  selectedExperience,
  selectedAvatar,
  onComplete,
  onBack,
  refreshProfile,
}: LearningPathStepProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [guideSections, setGuideSections] = useState<GuideSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Story 0.1: Generate personalized learning path using real catalog
    const generatePath = async () => {
      setIsGenerating(true);

      // Wait 2 seconds to show loading animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Story 0.1: Use real guide catalog data
      const catalog = getGuideCatalog();
      const categorizedGuides = categorizeGuidesByLearningPath(catalog, {
        role: selectedRole || undefined,
        interests: selectedInterests.length > 0 ? selectedInterests : undefined,
        experience_level: (selectedExperience as 'beginner' | 'intermediate' | 'advanced') || undefined,
      });

      const sections: GuideSection[] = [];

      // Core guides section
      if (categorizedGuides.core.length > 0) {
        sections.push({
          category: 'מדריכי ליבה',
          description: 'מדריכים חיוניים להתחלת עבודה עם BMAD',
          guides: categorizedGuides.core.slice(0, 5).map((guide) => ({
            id: guide.id,
            title: guide.title,
            description: guide.description,
            estimatedMinutes: guide.estimatedMinutes,
          })),
        });
      }

      // Recommended guides based on role
      if (categorizedGuides.recommended.length > 0) {
        sections.push({
          category: 'מומלץ עבורך',
          description: selectedRole
            ? `בהתבסס על תפקידך כ${selectedRole}`
            : 'מדריכים מומלצים בשבילך',
          guides: categorizedGuides.recommended.slice(0, 5).map((guide) => ({
            id: guide.id,
            title: guide.title,
            description: guide.description,
            estimatedMinutes: guide.estimatedMinutes,
          })),
        });
      }

      // Interest-based guides
      if (selectedInterests.length > 0 && categorizedGuides.interests.length > 0) {
        sections.push({
          category: 'בהתבסס על תחומי העניין שלך',
          description: `מדריכים התואמים את תחומי העניין שבחרת (${selectedInterests.length} נושאים)`,
          guides: categorizedGuides.interests.slice(0, 5).map((guide) => ({
            id: guide.id,
            title: guide.title,
            description: guide.description,
            estimatedMinutes: guide.estimatedMinutes,
          })),
        });
      }

      // Optional deep dives
      if (categorizedGuides.optional.length > 0) {
        sections.push({
          category: 'צלילות עמוקות אופציונליות',
          description: selectedExperience
            ? `נושאים מתקדמים עבור לומדים ברמה ${selectedExperience}`
            : 'נושאים מתקדמים להמשך למידה',
          guides: categorizedGuides.optional.slice(0, 3).map((guide) => ({
            id: guide.id,
            title: guide.title,
            description: guide.description,
            estimatedMinutes: guide.estimatedMinutes,
          })),
        });
      }

      setGuideSections(sections);
      setIsGenerating(false);
    };

    generatePath();
  }, [selectedRole, selectedInterests, selectedExperience]);

  const handleComplete = async () => {
    if (!userId) {
      toast({
        title: 'שגיאה',
        description: 'המשתמש לא מאומת',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      console.log('[Onboarding] Starting completion process...');

      // Save preferences to profile
      const { error } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          interests: selectedInterests,
          experience_level: selectedExperience as 'beginner' | 'intermediate' | 'advanced',
          avatar_style: selectedAvatar?.style,
          avatar_seed: selectedAvatar?.seed,
          avatar_options: selectedAvatar?.options || {},
          completed_onboarding: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      console.log('[Onboarding] Profile updated in database');

      // CRITICAL FIX: Verify profile update completed before navigating
      // This prevents infinite redirect loop between onboarding and dashboard
      console.log('[Onboarding] Verifying profile update...');

      // Poll database to confirm update (max 3 seconds)
      const maxAttempts = 30; // 30 attempts * 100ms = 3 seconds
      let attempts = 0;
      let profileUpdated = false;

      while (attempts < maxAttempts && !profileUpdated) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verify via direct database query
        const { data: verifyProfile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', userId)
          .single();

        if (verifyProfile?.completed_onboarding === true) {
          profileUpdated = true;
          console.log(`[Onboarding] ✓ Profile verified (attempt ${attempts + 1}/${maxAttempts})`);
        } else {
          attempts++;
          if (attempts % 5 === 0) {
            console.log(`[Onboarding] Still waiting for DB update... (${attempts}/${maxAttempts})`);
          }
        }
      }

      if (!profileUpdated) {
        console.error('[Onboarding] Profile verification timeout!');
        throw new Error('לא הצלחנו לאמת את עדכון הפרופיל');
      }

      // NOW refresh the profile in AuthContext so ProtectedRoute won't redirect
      await refreshProfile();
      console.log('[Onboarding] AuthContext refreshed with updated profile');

      // Extra safety: wait for React state propagation
      await new Promise((resolve) => setTimeout(resolve, 150));
      console.log('[Onboarding] State propagation complete');

      // Fire confetti celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'],
      });

      // Show success toast
      toast({
        title: 'האון בורדינג הושלם בהצלחה!',
        description: 'נתיב הלמידה האישי שלך מוכן. בואו נתחיל ללמוד!',
      });

      // Wait a moment for confetti before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('[Onboarding] Navigating to dashboard...');

      // Navigate to dashboard
      onComplete();
    } catch (error) {
      console.error('[Onboarding] Error saving onboarding preferences:', error);
      toast({
        title: 'שגיאה',
        description: 'שמירת ההעדפות נכשלה. אנא נסה שוב.',
        variant: 'destructive',
      });
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-primary/10 p-8 rounded-full">
              <IconLoader2 className="w-20 h-20 text-primary animate-spin" stroke={1.5} />
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4"
        >
          יוצר את נתיב הלמידה שלך...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-muted-foreground dark:text-gray-400"
        >
          אנחנו מתאימים אישית את מסע ה-BMAD שלך על סמך הבחירות שלך
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="mb-4 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="bg-primary/10 p-4 rounded-full"
          >
            <IconBooks className="w-12 h-12 text-primary" stroke={1.5} />
          </motion.div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
          נתיב הלמידה האישי שלך
        </h2>
        <p className="text-muted-foreground dark:text-gray-400">
          מבוסס על תפקידך, תחומי העניין ורמת הניסיון שלך
        </p>
      </motion.div>

      {/* Guide Sections */}
      <div className="space-y-6 mb-8">
        {guideSections.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + sectionIndex * 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-border dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
              {section.category}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{section.description}</p>

            <div className="space-y-3">
              {section.guides.map((guide, guideIndex) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + sectionIndex * 0.2 + guideIndex * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 dark:bg-gray-700/50 hover:bg-muted dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="mt-0.5">
                    <IconCheck className="w-5 h-5 text-primary" stroke={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">
                      {guide.title}
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                      {guide.description}
                    </p>
                    <span className="inline-flex items-center text-xs text-muted-foreground dark:text-muted-foreground">
                      <IconClock className="w-3 h-3 ml-1" />
                      {guide.estimatedMinutes} דקות
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
      >
        <p className="text-sm text-foreground dark:text-gray-300">
          <span className="font-semibold text-primary">
            {guideSections.reduce((total, section) => total + section.guides.length, 0)} מדריכים
          </span>{' '}
          נבחרו עבורך •{' '}
          <span className="font-semibold text-primary">
            ~
            {guideSections.reduce(
              (total, section) =>
                total + section.guides.reduce((sum, guide) => sum + guide.estimatedMinutes, 0),
              0
            )}{' '}
            דקות
          </span>{' '}
          של למידה
        </p>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="outline" onClick={onBack} disabled={isSaving} size="lg">
          חזור
        </Button>
        <Button onClick={handleComplete} disabled={isSaving} size="lg" className="min-w-[200px]">
          {isSaving ? (
            <>
              <IconLoader2 className="w-5 h-5 ml-2 animate-spin" />
              שומר...
            </>
          ) : (
            <>
              <IconRocket className="w-5 h-5 ml-2" />
              התחל ללמוד!
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Missing IconClock - add it inline
function IconClock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
