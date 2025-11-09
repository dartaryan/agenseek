/**
 * Journey Page - Story 0.10.1
 *
 * Visual learning journey organized by 4 phases:
 * 1. Core Guides (מדריכי ליבה)
 * 2. Recommended for Your Role (מומלץ עבורך)
 * 3. Your Interests (תחומי העניין שלך)
 * 4. Explore More (חקור עוד)
 *
 * This sub-story focuses on functionality and data accuracy.
 * Animations and gamification will be added in 0.10.2 and 0.10.3.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getJourneyData, type JourneyData, type PhaseData } from '@/lib/journey';
import { useNavigate } from 'react-router-dom';
import { JourneyHero } from './components/JourneyHero';
import { PhaseCard } from './components/PhaseCard';
import { JourneyCTA } from './components/JourneyCTA';
import { ConnectingLine } from './components/ConnectingLine';
import { BrandedLoader } from '@/components/ui/branded-loader';
import { IconAlertCircle } from '@tabler/icons-react';

export function JourneyPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore accordion state from localStorage
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('journey-expanded-phases');
    return saved ? new Set(JSON.parse(saved)) : new Set(['core']); // Core expanded by default
  });

  // Load journey data on mount
  useEffect(() => {
    async function loadJourneyData() {
      if (!user?.id || !profile) {
        setError('לא נמצא פרופיל משתמש');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getJourneyData(user.id, {
          role: profile.role,
          interests: profile.interests,
          experience_level: profile.experience_level,
        });
        setJourneyData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading journey data:', err);
        setError('שגיאה בטעינת מסלול הלמידה. אנא רענן את הדף.');
      } finally {
        setIsLoading(false);
      }
    }

    loadJourneyData();
  }, [user?.id, profile]);

  // Save expanded phases to localStorage
  useEffect(() => {
    localStorage.setItem('journey-expanded-phases', JSON.stringify([...expandedPhases]));
  }, [expandedPhases]);

  // Scroll to current phase on mount
  useEffect(() => {
    if (journeyData && !isLoading) {
      const currentPhase = journeyData.stats.currentPhase;
      const element = document.getElementById(`phase-${currentPhase}`);
      if (element) {
        // Delay scroll to allow render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  }, [journeyData, isLoading]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
        // On mobile, close others to save space
        if (window.innerWidth < 640) {
          return new Set([phaseId]);
        }
      }
      return newSet;
    });
  };

  const handleGuideClick = (guideId: string) => {
    navigate(`/guides/${guideId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  // Error state
  if (error || !journeyData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4">
          <IconAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              שגיאה בטעינת מסלול הלמידה
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error || 'לא ניתן לטעון את נתוני מסלול הלמידה'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              רענן דף
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            מסלול הלמידה שלי
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            נתיב למידה מותאם אישית לפי התפקיד והעניינים שלך
          </p>
        </div>
      </div>

      {/* Hero Section - Overall Stats */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <JourneyHero stats={journeyData.stats} />
      </div>

      {/* Visual Roadmap - 4 Phases */}
      <div className="container mx-auto px-4 pb-12 max-w-7xl">
        <div className="space-y-6">
          {journeyData.phases.map((phase: PhaseData, index: number) => (
            <div key={phase.id} id={`phase-${phase.id}`}>
              <PhaseCard
                phase={phase}
                index={index}
                isExpanded={expandedPhases.has(phase.id)}
                onToggle={() => togglePhase(phase.id)}
                onGuideClick={handleGuideClick}
                isCurrentPhase={phase.id === journeyData.stats.currentPhase}
              />

              {/* Enhanced Connecting Line (except for last phase) */}
              {index < journeyData.phases.length - 1 && (
                <ConnectingLine
                  previousPhaseCompleted={phase.status === 'completed'}
                  nextPhaseStatus={journeyData.phases[index + 1].status}
                  isCurrentConnection={
                    phase.id === journeyData.stats.currentPhase ||
                    journeyData.phases[index + 1].id === journeyData.stats.currentPhase
                  }
                  index={index}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 pb-12 max-w-7xl">
        <JourneyCTA
          completedGuides={journeyData.stats.completedGuides}
          totalGuides={journeyData.stats.totalGuides}
          currentPhase={journeyData.stats.currentPhase}
        />
      </div>
    </div>
  );
}

