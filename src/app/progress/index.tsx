import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { hebrewLocale } from '../../lib/locale/he';
import { getGuideCatalog } from '../../lib/guide-catalog';
import { categorizeGuidesByLearningPath, getAllCategoryProgress } from '../../lib/learning-path';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { BrandedLoader } from '../../components/ui/branded-loader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import {
  IconBook,
  IconStar,
  IconHeart,
  IconDots,
  IconCheck,
  IconClock,
  IconCalendar,
  IconPlayerPlay,
  IconReload,
  IconFileDownload,
} from '@tabler/icons-react';
import type { GuideCatalogEntry } from '../../types/guide-catalog';
import type { CategorizedGuides } from '../../lib/learning-path';

/**
 * Progress Details Page (Protected)
 * Story 5.8 - Build Full Progress Details Page
 *
 * Shows detailed progress view with:
 * - Hero section with overall progress
 * - Category breakdown (expandable)
 * - Full guide list with status indicators
 * - Time spent and completion dates
 * - Action buttons (Start/Resume/Review)
 * - Filters (All/In Progress/Completed/Not Started)
 */

type FilterType = 'all' | 'in_progress' | 'completed' | 'not_started';

interface GuideWithProgress extends GuideCatalogEntry {
  progress_percent: number;
  completed: boolean;
  time_spent_seconds: number;
  completed_at: string | null;
  last_read_at: string | null;
}

interface CategoryProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressData {
  totalGuides: number;
  guidesCompleted: number;
  guidesInProgress: number;
  guidesNotStarted: number;
  overallProgress: number;
  categorizedGuides: CategorizedGuides;
  categoryProgress: {
    core: CategoryProgress;
    recommended: CategoryProgress;
    interests: CategoryProgress;
    optional: CategoryProgress;
  };
  allGuidesWithProgress: GuideWithProgress[];
}

export function ProgressDetailsPage() {
  const { user, profile } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    async function fetchProgressData() {
      if (!user) return;

      try {
        setLoading(true);

        // Load guides catalog
        const catalog: GuideCatalogEntry[] = getGuideCatalog();
        const totalGuides = catalog.length;

        // Fetch all user progress data
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        // Create a map of progress by guide slug
        const progressMap = new Map(progressData?.map((p) => [p.guide_slug, p]) || []);

        // Merge catalog with progress data
        const allGuidesWithProgress: GuideWithProgress[] = catalog.map((guide) => {
          const progress = progressMap.get(guide.id);
          return {
            ...guide,
            progress_percent: progress?.progress_percent || 0,
            completed: progress?.completed || false,
            time_spent_seconds: progress?.time_spent_seconds || 0,
            completed_at: progress?.completed_at || null,
            last_read_at: progress?.last_read_at || null,
          };
        });

        // Calculate stats
        const guidesCompleted = allGuidesWithProgress.filter((g) => g.completed).length;
        const guidesInProgress = allGuidesWithProgress.filter(
          (g) => !g.completed && g.progress_percent > 0
        ).length;
        const guidesNotStarted = allGuidesWithProgress.filter((g) => g.progress_percent === 0).length;
        const overallProgress = totalGuides > 0 ? Math.round((guidesCompleted / totalGuides) * 100) : 0;

        // Categorize guides by learning path
        const categorizedGuides = categorizeGuidesByLearningPath(catalog, {
          role: profile?.role,
          interests: profile?.interests,
          experience_level: profile?.experience_level,
        });

        // Calculate progress for each category
        const completedGuideIds = new Set(
          allGuidesWithProgress.filter((g) => g.completed).map((g) => g.id)
        );
        const categoryProgress = getAllCategoryProgress(categorizedGuides, completedGuideIds);

        setProgressData({
          totalGuides,
          guidesCompleted,
          guidesInProgress,
          guidesNotStarted,
          overallProgress,
          categorizedGuides,
          categoryProgress,
          allGuidesWithProgress,
        });
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgressData();
  }, [user, profile]);

  // Filter guides based on active filter
  const getFilteredGuides = (guides: GuideWithProgress[]) => {
    switch (activeFilter) {
      case 'completed':
        return guides.filter((g) => g.completed);
      case 'in_progress':
        return guides.filter((g) => !g.completed && g.progress_percent > 0);
      case 'not_started':
        return guides.filter((g) => g.progress_percent === 0);
      default:
        return guides;
    }
  };

  // Format time spent
  const formatTimeSpent = (seconds: number): string => {
    if (seconds === 0) return '--';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}${hebrewLocale.dashboard.hours} ${remainingMinutes}${hebrewLocale.dashboard.minutes}`;
    }
    return `${minutes}${hebrewLocale.dashboard.minutes}`;
  };

  // Format completion date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get action button config
  const getActionButton = (guide: GuideWithProgress) => {
    if (guide.completed) {
      return {
        label: hebrewLocale.pages.progress.actionReview,
        icon: <IconReload className="w-4 h-4" stroke={1.5} />,
        variant: 'outline' as const,
      };
    } else if (guide.progress_percent > 0) {
      return {
        label: hebrewLocale.pages.progress.actionResume,
        icon: <IconPlayerPlay className="w-4 h-4" stroke={1.5} />,
        variant: 'default' as const,
      };
    } else {
      return {
        label: hebrewLocale.pages.progress.actionStart,
        icon: <IconBook className="w-4 h-4" stroke={1.5} />,
        variant: 'outline' as const,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full -mt-20">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">לא ניתן לטעון את הנתונים</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {hebrewLocale.pages.progress.heroTitle}
              </h1>
              <p className="text-muted-foreground mt-2">
                {hebrewLocale.pages.progress.heroDescription}
              </p>
            </div>
            {/* Optional: Export PDF button */}
            <Button variant="outline" className="gap-2" disabled>
              <IconFileDownload className="w-4 h-4" stroke={1.5} />
              {hebrewLocale.pages.progress.exportPdf}
            </Button>
          </div>

          {/* Overall Progress Card */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Circular Progress */}
              <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
                <svg className="transform -rotate-90" width={120} height={120}>
                  <circle
                    cx={60}
                    cy={60}
                    r={52}
                    stroke="currentColor"
                    strokeWidth={10}
                    fill="none"
                    className="text-muted opacity-50"
                  />
                  <circle
                    cx={60}
                    cy={60}
                    r={52}
                    stroke="currentColor"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 - (progressData.overallProgress / 100) * 2 * Math.PI * 52
                    }
                    strokeLinecap="round"
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {progressData.overallProgress}%
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 w-full grid grid-cols-3 gap-3 md:gap-6">
                <div className="space-y-1 text-center md:text-right">
                  <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {progressData.guidesCompleted}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {hebrewLocale.dashboard.guidesCompleted}
                  </div>
                </div>
                <div className="space-y-1 text-center md:text-right">
                  <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {progressData.guidesInProgress}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {hebrewLocale.dashboard.guidesInProgress}
                  </div>
                </div>
                <div className="space-y-1 text-center md:text-right">
                  <div className="text-xl md:text-2xl font-bold text-muted-foreground">
                    {progressData.guidesNotStarted}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {hebrewLocale.pages.progress.statusNotStarted}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Breakdown Section */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
            {hebrewLocale.pages.progress.categoryBreakdown}
          </h2>

          <Accordion type="multiple" className="w-full">
            {/* Core Category */}
            {progressData.categorizedGuides.core.length > 0 && (
              <CategorySection
                value="core"
                icon={<IconBook className="w-5 h-5" stroke={1.5} />}
                label={hebrewLocale.dashboard.categoryCore}
                guides={progressData.categorizedGuides.core.map((g) =>
                  progressData.allGuidesWithProgress.find((gwp) => gwp.id === g.id)!
                )}
                progress={progressData.categoryProgress.core}
                activeFilter={activeFilter}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
              />
            )}

            {/* Recommended Category */}
            {progressData.categorizedGuides.recommended.length > 0 && (
              <CategorySection
                value="recommended"
                icon={<IconStar className="w-5 h-5" stroke={1.5} />}
                label={hebrewLocale.dashboard.categoryRecommended}
                guides={progressData.categorizedGuides.recommended.map((g) =>
                  progressData.allGuidesWithProgress.find((gwp) => gwp.id === g.id)!
                )}
                progress={progressData.categoryProgress.recommended}
                activeFilter={activeFilter}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
              />
            )}

            {/* Interests Category */}
            {progressData.categorizedGuides.interests.length > 0 && (
              <CategorySection
                value="interests"
                icon={<IconHeart className="w-5 h-5" stroke={1.5} />}
                label={hebrewLocale.dashboard.categoryInterests}
                guides={progressData.categorizedGuides.interests.map((g) =>
                  progressData.allGuidesWithProgress.find((gwp) => gwp.id === g.id)!
                )}
                progress={progressData.categoryProgress.interests}
                activeFilter={activeFilter}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
              />
            )}

            {/* Optional Category */}
            {progressData.categorizedGuides.optional.length > 0 && (
              <CategorySection
                value="optional"
                icon={<IconDots className="w-5 h-5" stroke={1.5} />}
                label={hebrewLocale.dashboard.categoryOptional}
                guides={progressData.categorizedGuides.optional.map((g) =>
                  progressData.allGuidesWithProgress.find((gwp) => gwp.id === g.id)!
                )}
                progress={progressData.categoryProgress.optional}
                activeFilter={activeFilter}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
              />
            )}
          </Accordion>
        </Card>

        {/* All Guides Section with Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {hebrewLocale.pages.progress.allGuides}
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className="flex-1 sm:flex-none"
              >
                {hebrewLocale.pages.progress.filterAll} ({progressData.totalGuides})
              </Button>
              <Button
                variant={activeFilter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('in_progress')}
                className="flex-1 sm:flex-none"
              >
                {hebrewLocale.pages.progress.filterInProgress} ({progressData.guidesInProgress})
              </Button>
              <Button
                variant={activeFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('completed')}
                className="flex-1 sm:flex-none"
              >
                {hebrewLocale.pages.progress.filterCompleted} ({progressData.guidesCompleted})
              </Button>
              <Button
                variant={activeFilter === 'not_started' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('not_started')}
                className="flex-1 sm:flex-none"
              >
                {hebrewLocale.pages.progress.filterNotStarted} ({progressData.guidesNotStarted})
              </Button>
            </div>
          </div>

          {/* Guides List */}
          <div className="space-y-3">
            {getFilteredGuides(progressData.allGuidesWithProgress).map((guide) => (
              <GuideProgressCard
                key={guide.id}
                guide={guide}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
              />
            ))}

            {getFilteredGuides(progressData.allGuidesWithProgress).length === 0 && (
              <Card className="p-12 text-center">
                <IconBook className="w-16 h-16 text-muted-foreground opacity-40 mx-auto mb-4" stroke={1.5} />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {hebrewLocale.pages.progress.noGuides}
                </h3>
                <p className="text-muted-foreground">
                  {hebrewLocale.pages.progress.noGuidesDescription}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Section Component
interface CategorySectionProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  guides: GuideWithProgress[];
  progress: CategoryProgress;
  activeFilter: FilterType;
  formatTimeSpent: (seconds: number) => string;
  formatDate: (dateString: string | null) => string;
  getActionButton: (guide: GuideWithProgress) => {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'outline';
  };
}

function CategorySection({
  value,
  icon,
  label,
  guides,
  progress,
  activeFilter,
  formatTimeSpent,
  formatDate,
  getActionButton,
}: CategorySectionProps) {
  const isComplete = progress.percentage === 100 && progress.total > 0;

  // Filter guides based on active filter
  const getFilteredGuides = (guides: GuideWithProgress[]) => {
    switch (activeFilter) {
      case 'completed':
        return guides.filter((g) => g.completed);
      case 'in_progress':
        return guides.filter((g) => !g.completed && g.progress_percent > 0);
      case 'not_started':
        return guides.filter((g) => g.progress_percent === 0);
      default:
        return guides;
    }
  };

  const filteredGuides = getFilteredGuides(guides);

  return (
    <AccordionItem value={value} className="border-b border-gray-200 dark:border-gray-700">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-3">
            <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
            <span className="font-medium text-foreground">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <IconCheck className="w-5 h-5" stroke={2} />
                <span className="text-sm font-semibold">
                  {hebrewLocale.dashboard.categoryCompleted}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                {progress.completed} {hebrewLocale.dashboard.categoryProgress} {progress.total}
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-3 pt-2">
          {/* Progress Bar */}
          <div className="space-y-2 px-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {progress.percentage}% {hebrewLocale.dashboard.categoryCompleted}
              </span>
              <span className="text-muted-foreground">
                {progress.completed} / {progress.total}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Guides in this category */}
          <div className="space-y-2">
            {filteredGuides.map((guide) => (
              <GuideProgressCard
                key={guide.id}
                guide={guide}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                getActionButton={getActionButton}
                compact
              />
            ))}

            {filteredGuides.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {hebrewLocale.pages.progress.noGuides}
              </p>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Guide Progress Card Component
interface GuideProgressCardProps {
  guide: GuideWithProgress;
  formatTimeSpent: (seconds: number) => string;
  formatDate: (dateString: string | null) => string;
  getActionButton: (guide: GuideWithProgress) => {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'outline';
  };
  compact?: boolean;
}

function GuideProgressCard({
  guide,
  formatTimeSpent,
  formatDate,
  getActionButton,
  compact = false,
}: GuideProgressCardProps) {
  const actionButton = getActionButton(guide);

  // Status badge
  const getStatusBadge = () => {
    if (guide.completed) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
          <IconCheck className="w-3 h-3" stroke={2} />
          {hebrewLocale.pages.progress.statusCompleted}
        </div>
      );
    } else if (guide.progress_percent > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
          {guide.progress_percent}%
        </div>
      );
    } else {
      return (
        <div className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
          {hebrewLocale.pages.progress.statusNotStarted}
        </div>
      );
    }
  };

  return (
    <Card className={compact ? 'p-3' : 'p-3 md:p-4'}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Left: Guide Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
            <IconBook className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" stroke={1.5} />
            <Link
              to={`/guides/${guide.id}`}
              className="font-semibold text-sm md:text-base text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex-1 min-w-0"
            >
              {guide.title}
            </Link>
            {getStatusBadge()}
          </div>

          {/* Progress bar for in-progress guides */}
          {!guide.completed && guide.progress_percent > 0 && (
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${guide.progress_percent}%` }}
              />
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
            {/* Time spent */}
            {guide.time_spent_seconds > 0 && (
              <div className="flex items-center gap-1">
                <IconClock className="w-3.5 h-3.5 md:w-4 md:h-4" stroke={1.5} />
                <span>{formatTimeSpent(guide.time_spent_seconds)}</span>
              </div>
            )}

            {/* Completion date */}
            {guide.completed && guide.completed_at && (
              <div className="flex items-center gap-1">
                <IconCalendar className="w-3.5 h-3.5 md:w-4 md:h-4" stroke={1.5} />
                <span className="hidden sm:inline">
                  {hebrewLocale.pages.progress.completedOn} {formatDate(guide.completed_at)}
                </span>
                <span className="sm:hidden">
                  {formatDate(guide.completed_at)}
                </span>
              </div>
            )}

            {/* Estimated time */}
            <span className="text-xs">
              {guide.estimatedMinutes} {hebrewLocale.dashboard.minutes}
            </span>
          </div>
        </div>

        {/* Right: Action Button */}
        <Button variant={actionButton.variant} size="sm" asChild className="flex-shrink-0 w-full sm:w-auto">
          <Link to={`/guides/${guide.id}`} className="flex items-center justify-center gap-2">
            {actionButton.icon}
            {actionButton.label}
          </Link>
        </Button>
      </div>
    </Card>
  );
}

