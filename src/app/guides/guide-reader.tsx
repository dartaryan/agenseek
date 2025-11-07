/**
 * Guide Reader Page - Story 4.5
 *
 * 3-panel layout guide reader with:
 * - ToC sidebar (left/right based on RTL)
 * - Center content area with breadcrumbs, header, action bar, ContentRenderer
 * - Actions sidebar with progress widget
 * - Scroll tracking with Intersection Observer
 * - Auto-save progress every 30 seconds
 * - Scroll progress bar at top
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { TableOfContents, MobileTableOfContents } from '@/components/guides/TableOfContents';
import { GuideActionsSidebar } from '@/components/guides/GuideActionsSidebar';
import { GuideBreadcrumbs } from '@/components/guides/GuideBreadcrumbs';
import { GuideHeader } from '@/components/guides/GuideHeader';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { loadGuide, getAdjacentGuides } from '@/lib/guide-loader';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import type { Guide } from '@/types/content-blocks';

export function GuideReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const progressSaveTimerRef = useRef<number | null>(null);

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
  }, [user, slug, scrollProgress, currentSection]);

  // Save progress to database
  const saveProgress = useCallback(
    async (progress: number, lastSection: string | null) => {
      if (!user || !slug || !guide) return;

      try {
        const { error } = await supabase.from('user_progress').upsert(
          {
            user_id: user.id,
            guide_slug: slug,
            guide_category: guide.metadata.category,
            progress_percent: Math.round(progress),
            last_position: lastSection || '',
            last_read_at: new Date().toISOString(),
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

  // Smooth scroll to section
  const handleSectionClick = useCallback((anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      const yOffset = -80; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // Mark complete handler
  const handleMarkComplete = useCallback(async () => {
    if (!user || !slug || !guide) return;

    try {
      // Update progress to 100%
      await supabase.from('user_progress').upsert(
        {
          user_id: user.id,
          guide_slug: slug,
          guide_category: guide.metadata.category,
          progress_percent: 100,
          completed: true,
          completed_at: new Date().toISOString(),
          last_read_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,guide_slug',
        }
      );

      // Note: increment_guide_completion RPC function would be created in Story 4.6
      // For now, we'll skip this to avoid breaking the build

      setIsCompleted(true);
      toast({
        title: 'מדריך הושלם!',
        description: 'כל הכבוד! המשך ללמידה הבאה.',
      });

      // Navigate to next guide after 2 seconds
      setTimeout(() => {
        const { next } = getAdjacentGuides(slug);
        if (next) {
          navigate(`/guides/${next.id}`);
        } else {
          navigate('/guides');
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to mark complete:', err);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לסמן את המדריך כהושלם',
        variant: 'destructive',
      });
    }
  }, [user, slug, guide, navigate]);

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
  const adjacentGuides = slug && guide ? getAdjacentGuides(slug, guide.metadata.category) : { prev: null, next: null };
  const { prev, next } = adjacentGuides;

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
          <p className="text-xl text-gray-900 dark:text-gray-100">
            {error || 'המדריך לא נמצא'}
          </p>
          <Button onClick={() => navigate('/guides')}>חזרה לספרייה</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-50 origin-right"
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
        <main className="col-span-1 lg:col-span-6 xl:col-span-7" ref={contentRef}>
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
              onMarkComplete={handleMarkComplete}
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
    </div>
  );
}

