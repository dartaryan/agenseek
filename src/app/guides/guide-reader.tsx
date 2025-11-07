/**
 * Guide Reader Page - Story 4.5 + 4.6 + 4.7 + 4.8 + Story 5.1.1 + Story 5.1.2
 *
 * 3-panel layout guide reader with:
 * - ToC sidebar (left/right based on RTL)
 * - Center content area with breadcrumbs, header, action bar, ContentRenderer
 * - Actions sidebar with progress widget
 * - Scroll tracking with Intersection Observer
 * - Auto-save progress every 30 seconds
 * - Scroll progress bar at top
 * - Progress tracking: load saved progress, resume from last position
 * - Time tracking: track time spent reading
 * - Activity logging: log reading activity to database
 * - Stats tracking: increment guide view count
 * - Story 4.7: Mark complete with celebration and next guide recommendation
 * - Story 4.8: Keyboard arrow navigation, responsive breadcrumbs, related guides
 * - Story 5.1.1: Mobile padding, auto-hide FAB, Header ToC integration
 * - Story 5.1.2: Toggle guide completion status (mark/unmark complete)
 */

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { TableOfContents, MobileTableOfContents } from '@/components/guides/TableOfContents';
import { GuideActionsSidebar } from '@/components/guides/GuideActionsSidebar';
import { GuideBreadcrumbs } from '@/components/guides/GuideBreadcrumbs';
import { GuideHeader } from '@/components/guides/GuideHeader';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { MarkCompleteDialog } from '@/components/guides/MarkCompleteDialog';
import { UnmarkCompleteDialog } from '@/components/guides/UnmarkCompleteDialog';
import { GuideCompletionModal } from '@/components/guides/GuideCompletionModal';
import { RelatedGuides } from '@/components/guides/RelatedGuides';
import { BadgeUnlockAnimation } from '@/components/dashboard/BadgeUnlockAnimation';
import { loadGuide, getAdjacentGuides } from '@/lib/guide-loader';
import { useAuth } from '@/hooks/useAuth';
import { useAchievements } from '@/hooks/useAchievements';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import MobileTocContext from '@/contexts/MobileTocContext';
import type { Guide, GuideMetadata } from '@/types/content-blocks';

interface UserProgress {
  progress_percent: number;
  last_position: string | null;
  time_spent_seconds: number;
  completed: boolean;
  last_read_at: string;
  progress_before_completion?: number | null; // Story 5.1.2
}

export function GuideReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkAndUpdateAchievements, newlyEarnedBadge } = useAchievements(); // Story 5.3

  // State
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [hasResumed, setHasResumed] = useState(false);
  const [showMarkCompleteDialog, setShowMarkCompleteDialog] = useState(false);
  const [showUnmarkCompleteDialog, setShowUnmarkCompleteDialog] = useState(false); // Story 5.1.2
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false); // Story 5.3
  const [nextGuide, setNextGuide] = useState<GuideMetadata | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const progressSaveTimerRef = useRef<number | null>(null);
  const readingStartTimeRef = useRef<number>(Date.now());
  const accumulatedTimeRef = useRef<number>(0);

  // Load guide
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    loadGuide(slug)
      .then((loadedGuide) => {
        setGuide(loadedGuide);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load guide:', err);
        setError('שגיאה בטעינת המדריך');
        setLoading(false);
      });
  }, [slug]);

  // Story 4.6: Load existing progress and log activity
  useEffect(() => {
    if (!user || !slug || !guide) return;

    const loadProgressAndLogActivity = async () => {
      try {
        // Load existing progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('progress_percent, last_position, time_spent_seconds, completed, last_read_at')
          .eq('user_id', user.id)
          .eq('guide_slug', slug)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine (first time reading)
          console.error('Failed to load progress:', progressError);
        }

        if (progressData) {
          setUserProgress(progressData);
          setIsCompleted(progressData.completed);
          accumulatedTimeRef.current = progressData.time_spent_seconds;

          // Show resume notification if user has made progress
          if (progressData.progress_percent > 5 && !progressData.completed) {
            toast({
              title: 'ברוך שובך!',
              description: `המשך מהמקום האחרון שבו עצרת (${progressData.progress_percent}%)`,
            });
          }
        }

        // Log activity: started reading
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'guide_started',
          target_slug: slug,
          metadata: {
            guide_title: guide.metadata.title,
            guide_category: guide.metadata.category,
            difficulty: guide.metadata.difficulty,
          },
        });

        // Update guide stats: increment view count
        await supabase.rpc('increment_guide_views', { p_guide_slug: slug });
      } catch (err) {
        console.error('Error loading progress or logging activity:', err);
      }
    };

    loadProgressAndLogActivity();
  }, [user, slug, guide]);

  // Story 4.6: Resume from last position
  useEffect(() => {
    if (!userProgress || !guide || hasResumed || !userProgress.last_position) return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const lastSection = document.getElementById(userProgress.last_position!);
      if (lastSection) {
        const yOffset = -80; // Header offset
        const y = lastSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setHasResumed(true);
      }
    }, 500); // Small delay to ensure content is rendered

    return () => clearTimeout(timer);
  }, [userProgress, guide, hasResumed]);

  // Story 4.6: Track reading time on unmount
  useEffect(() => {
    const startTime = readingStartTimeRef.current;

    return () => {
      // Calculate time spent in this session (in seconds)
      const sessionTime = Math.round((Date.now() - startTime) / 1000);
      const totalTime = accumulatedTimeRef.current + sessionTime;

      // Save time on unmount (fire and forget)
      if (user && slug) {
        // Save progress update
        supabase
          .from('user_progress')
          .update({ time_spent_seconds: totalTime })
          .eq('user_id', user.id)
          .eq('guide_slug', slug)
          .then((result) => {
            if (result.error) {
              console.error('Failed to save reading time:', result.error);
            }
          });

        // Log activity separately (also fire and forget)
        supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'guide_read',
          target_slug: slug,
          metadata: {
            time_spent_seconds: sessionTime,
          },
        });
      }
    };
  }, [user, slug]);

  // Scroll tracking with Intersection Observer
  useEffect(() => {
    if (!guide || !contentRef.current) return;

    // Create observer for heading elements
    const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    }, observerOptions);

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [guide]);

  // Save progress to database (Story 4.6: includes time tracking)
  const saveProgress = useCallback(
    async (progress: number, lastSection: string | null) => {
      if (!user || !slug || !guide) return;

      try {
        // Calculate current session time in seconds
        const sessionTime = Math.round((Date.now() - readingStartTimeRef.current) / 1000);
        const totalTime = accumulatedTimeRef.current + sessionTime;

        const { error } = await supabase.from('user_progress').upsert(
          {
            user_id: user.id,
            guide_slug: slug,
            guide_category: guide.metadata.category,
            progress_percent: Math.round(progress),
            last_position: lastSection || '',
            last_read_at: new Date().toISOString(),
            time_spent_seconds: totalTime,
          },
          {
            onConflict: 'user_id,guide_slug',
          }
        );

        if (error) {
          console.error('Failed to save progress:', error);
        }
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    },
    [user, slug, guide]
  );

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll > 0) {
        const progress = (scrollTop / maxScroll) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!user || !slug || scrollProgress === 0) return;

    // Clear existing timer
    if (progressSaveTimerRef.current) {
      clearTimeout(progressSaveTimerRef.current);
    }

    // Set new timer
    progressSaveTimerRef.current = setTimeout(() => {
      saveProgress(scrollProgress, currentSection);
    }, 30000); // 30 seconds

    return () => {
      if (progressSaveTimerRef.current) {
        clearTimeout(progressSaveTimerRef.current);
      }
    };
  }, [user, slug, scrollProgress, currentSection, saveProgress]);

  // Smooth scroll to section
  const handleSectionClick = useCallback((anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      const yOffset = -80; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // Story 4.7: Mark complete button click - show confirmation dialog
  const handleMarkCompleteClick = useCallback(() => {
    if (isCompleted) return;
    setShowMarkCompleteDialog(true);
  }, [isCompleted]);

  // Story 4.7: Confirm mark complete - full implementation
  const handleConfirmMarkComplete = useCallback(async () => {
    if (!user || !slug || !guide) return;

    setIsMarkingComplete(true);

    try {
      // Calculate final reading time
      const sessionTime = Math.round((Date.now() - readingStartTimeRef.current) / 1000);
      const totalTime = accumulatedTimeRef.current + sessionTime;

      // 1. Update user_progress (completed=true, progress_percent=100, completed_at)
      // Story 5.1.2: Save current progress before marking complete
      const { error: progressError } = await supabase.from('user_progress').upsert(
        {
          user_id: user.id,
          guide_slug: slug,
          guide_category: guide.metadata.category,
          progress_percent: 100,
          progress_before_completion: Math.round(scrollProgress), // Save for restore on unmark
          completed: true,
          completed_at: new Date().toISOString(),
          last_read_at: new Date().toISOString(),
          time_spent_seconds: totalTime,
        },
        {
          onConflict: 'user_id,guide_slug',
        }
      );

      if (progressError) throw progressError;

      // 2. Insert activity log
      const { error: activityError } = await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'complete_guide',
        target_slug: slug,
        metadata: {
          guide_title: guide.metadata.title,
          guide_category: guide.metadata.category,
          difficulty: guide.metadata.difficulty,
          time_spent_seconds: totalTime,
        },
      });

      if (activityError) throw activityError;

      // 3. Update guide stats (increment completion count)
      const { error: statsError } = await supabase.rpc('increment_guide_completion', {
        p_guide_slug: slug,
      });

      if (statsError) {
        console.error('Failed to update guide stats:', statsError);
        // Non-fatal error, continue with completion flow
      }

      // 4. Update local state
      setIsCompleted(true);
      setIsMarkingComplete(false);
      setShowMarkCompleteDialog(false);

      // 5. Get next guide for recommendation
      const { next } = getAdjacentGuides(slug, guide.metadata.category);
      if (next) {
        // Convert GuideCatalogEntry to GuideMetadata format
        setNextGuide({
          ...next,
          slug: next.id, // GuideCatalogEntry uses 'id' instead of 'slug'
        } as GuideMetadata);
      } else {
        setNextGuide(null);
      }

      // 6. Check for newly earned achievements (Story 5.3)
      const earnedBadge = await checkAndUpdateAchievements();

      // 7. Show success modal (confetti will fire automatically)
      setShowCompletionModal(true);

      // Success toast
      toast({
        title: 'מדריך הושלם!',
        description: 'כל הכבוד! המשך למדריך הבא או חזרה לספרייה.',
      });

      // 8. If badge was earned, show unlock animation after completion modal closes
      if (earnedBadge) {
        // Wait a bit for the completion modal to close before showing badge unlock
        setTimeout(() => {
          setShowBadgeUnlock(true);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to mark complete:', err);
      setIsMarkingComplete(false);
      setShowMarkCompleteDialog(false);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לסמן את המדריך כהושלם',
        variant: 'destructive',
      });
    }
  }, [user, slug, guide, scrollProgress, checkAndUpdateAchievements]);

  // Story 5.1.2: Unmark complete button click - show confirmation dialog
  const handleUnmarkCompleteClick = useCallback(() => {
    if (!isCompleted) return;
    setShowUnmarkCompleteDialog(true);
  }, [isCompleted]);

  // Story 5.1.2: Confirm unmark complete - restore progress
  const handleConfirmUnmarkComplete = useCallback(async () => {
    if (!user || !slug || !guide) return;

    setIsMarkingComplete(true);

    try {
      // Get stored progress before completion
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('progress_before_completion')
        .eq('user_id', user.id)
        .eq('guide_slug', slug)
        .single();

      const restoredProgress = progressData?.progress_before_completion ?? 0;

      // Update user_progress (keep completed_at for history)
      const { error: progressError } = await supabase.from('user_progress').update({
        completed: false,
        progress_percent: restoredProgress,
        last_read_at: new Date().toISOString(),
      }).eq('user_id', user.id).eq('guide_slug', slug);

      if (progressError) throw progressError;

      // Log activity
      const { error: activityError } = await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'uncomplete_guide',
        target_slug: slug,
        metadata: {
          guide_title: guide.metadata.title,
          guide_category: guide.metadata.category,
          restored_progress: restoredProgress,
        },
      });

      if (activityError) throw activityError;

      // Update local state
      setIsCompleted(false);
      setScrollProgress(restoredProgress);
      setIsMarkingComplete(false);
      setShowUnmarkCompleteDialog(false);

      // Success toast
      toast({
        title: 'המדריך סומן כלא הושלם',
        description: `התקדמות שוחזרה ל-${restoredProgress}%`,
      });
    } catch (err) {
      console.error('Failed to unmark complete:', err);
      setIsMarkingComplete(false);
      setShowUnmarkCompleteDialog(false);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לסמן את המדריך כלא הושלם',
        variant: 'destructive',
      });
    }
  }, [user, slug, guide]);

  // Copy link handler
  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'הקישור הועתק',
        description: 'הקישור למדריך הועתק ללוח',
      });
    });
  }, []);

  // Adjacent guides for pagination
  const adjacentGuides =
    slug && guide ? getAdjacentGuides(slug, guide.metadata.category) : { prev: null, next: null };
  const { prev, next } = adjacentGuides;

  // Mobile ToC context value
  const mobileTocContextValue = useMemo(
    () => ({
      isOpen: isMobileTocOpen,
      onToggle: () => setIsMobileTocOpen(!isMobileTocOpen),
      isEnabled: true, // Enabled on guide reader page
    }),
    [isMobileTocOpen]
  );

  // Story 4.8: Keyboard arrow navigation (left/right arrows)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Left arrow = next guide (RTL)
      if (event.key === 'ArrowLeft' && next) {
        event.preventDefault();
        navigate(`/guides/${next.id}`);
      }

      // Right arrow = previous guide (RTL)
      if (event.key === 'ArrowRight' && prev) {
        event.preventDefault();
        navigate(`/guides/${prev.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">טוען מדריך...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !guide) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-900 dark:text-gray-100">{error || 'המדריך לא נמצא'}</p>
          <Button onClick={() => navigate('/guides')}>חזרה לספרייה</Button>
        </div>
      </div>
    );
  }

  return (
    <MobileTocContext.Provider value={mobileTocContextValue}>
      <div className="relative">
        {/* Scroll progress bar - above header */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-[60] origin-right"
          style={{
            scaleX: scrollProgress / 100,
          }}
        />

      {/* 3-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
        {/* Left sidebar - Table of Contents (desktop only) */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-24">
            <TableOfContents
              sections={guide.tableOfContents}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />
          </div>
        </aside>

        {/* Center content area */}
        <main className="col-span-1 lg:col-span-6 xl:col-span-7 px-4 lg:px-0 pb-24" ref={contentRef}>
          {/* Breadcrumbs */}
          <GuideBreadcrumbs
            category={guide.metadata.category as import('@/types/guide-catalog').GuideCategory}
            guideTitle={guide.metadata.title}
            className="mb-6"
          />

          {/* Guide header */}
          <GuideHeader
            title={guide.metadata.title}
            difficulty={guide.metadata.difficulty}
            estimatedMinutes={guide.metadata.estimatedMinutes}
            progress={scrollProgress}
            onAddNote={() => toast({ title: 'הוספת הערה - בקרוב' })}
            onCreateTask={() => toast({ title: 'יצירת משימה - בקרוב' })}
            onBookmark={() => toast({ title: 'נשמר למועדפים' })}
            onCopyLink={handleCopyLink}
            className="mb-8"
          />

          {/* Content renderer */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ContentRenderer blocks={guide.content} />
          </div>

          {/* Story 4.8: Related Guides */}
          <RelatedGuides
            currentGuideId={slug || ''}
            category={guide.metadata.category as import('@/types/guide-catalog').GuideCategory}
            className="mt-12"
          />

          {/* Bottom pagination */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            {prev ? (
              <Button
                onClick={() => navigate(`/guides/${prev.id}`)}
                variant="outline"
                className="gap-2"
              >
                <IconArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">המדריך הקודם</span>
              </Button>
            ) : (
              <div />
            )}

            {next ? (
              <Button
                onClick={() => navigate(`/guides/${next.id}`)}
                variant="outline"
                className="gap-2"
              >
                <span className="hidden sm:inline">המדריך הבא</span>
                <IconArrowLeft className="w-4 h-4" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </main>

        {/* Right sidebar - Quick actions (desktop only) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <GuideActionsSidebar
              progress={scrollProgress}
              isCompleted={isCompleted}
              onMarkComplete={handleMarkCompleteClick}
              onUnmarkComplete={handleUnmarkCompleteClick}
              onBookmark={() => toast({ title: 'נשמר למועדפים' })}
              onAddNote={() => toast({ title: 'הוספת הערה - בקרוב' })}
              onCreateTask={() => toast({ title: 'יצירת משימה - בקרוב' })}
              onFeedback={(helpful) =>
                toast({
                  title: helpful ? 'תודה על המשוב!' : 'נשמע, ננסה לשפר',
                })
              }
            />
          </div>
        </aside>
      </div>

      {/* Mobile ToC */}
      <MobileTableOfContents
        sections={guide.tableOfContents}
        currentSection={currentSection}
        onSectionClick={handleSectionClick}
        isOpen={isMobileTocOpen}
        onToggle={() => setIsMobileTocOpen(!isMobileTocOpen)}
      />

      {/* Story 4.7: Mark Complete Confirmation Dialog */}
      <MarkCompleteDialog
        open={showMarkCompleteDialog}
        onOpenChange={setShowMarkCompleteDialog}
        onConfirm={handleConfirmMarkComplete}
        guideTitle={guide.metadata.title}
        isLoading={isMarkingComplete}
      />

      {/* Story 5.1.2: Unmark Complete Confirmation Dialog */}
      <UnmarkCompleteDialog
        open={showUnmarkCompleteDialog}
        onOpenChange={setShowUnmarkCompleteDialog}
        onConfirm={handleConfirmUnmarkComplete}
        guideTitle={guide.metadata.title}
        restoredProgress={userProgress?.progress_before_completion ?? 0}
        isLoading={isMarkingComplete}
      />

      {/* Story 5.3: Badge Unlock Animation */}
      {newlyEarnedBadge && (
        <BadgeUnlockAnimation
          open={showBadgeUnlock}
          onOpenChange={setShowBadgeUnlock}
          badge={newlyEarnedBadge}
        />
      )}

      {/* Story 4.7: Completion Success Modal */}
      <GuideCompletionModal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
        guideTitle={guide.metadata.title}
        nextGuide={nextGuide}
      />
      </div>
    </MobileTocContext.Provider>
  );
}
