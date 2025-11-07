import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconTrophy, IconArrowRight } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';
import { useAchievements } from '@/hooks/useAchievements';
import { BadgeDisplay } from './BadgeDisplay';
import { BadgeModal } from './BadgeModal';
import type { BadgeDefinition } from '@/lib/achievements';
import { getBadgeProgress } from '@/lib/achievements';

/**
 * Story 5.3: Achievements Preview Card Component
 * Shows real achievement badges with earned/locked states
 * Displays first 6 badges (4 earned + 2 locked for visual balance)
 */

export function AchievementsPreviewCard() {
  const { earnedBadges, lockedBadges, stats, loading } = useAchievements();
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-20 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  const totalBadges = earnedBadges.length + lockedBadges.length;

  // Show first 4 badges (mix of earned and locked for balance)
  const displayBadges = [
    ...earnedBadges.slice(0, 4).map(a => ({ badge: a.badge, earned: true, earnedAt: a.earned_at })),
    ...lockedBadges.slice(0, Math.max(0, 4 - earnedBadges.length)).map(b => ({ badge: b, earned: false, earnedAt: null }))
  ].slice(0, 4);

  const handleBadgeClick = (badge: BadgeDefinition) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {hebrewLocale.dashboard.achievements}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {hebrewLocale.dashboard.achievementsDescription}
              </p>
            </div>
            <IconTrophy className="w-8 h-8 text-amber-500" stroke={1.5} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {earnedBadges.length}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                {hebrewLocale.dashboard.earnedBadges}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {lockedBadges.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {hebrewLocale.dashboard.lockedBadges}
              </div>
            </div>
          </div>

          {/* Recent Badges Grid */}
          <div className="grid grid-cols-4 gap-3 py-2">
            {displayBadges.map((item, index) => (
              <BadgeDisplay
                key={item.badge.id || index}
                badge={item.badge}
                earned={item.earned}
                progress={stats ? getBadgeProgress(item.badge.id, stats) : undefined}
                size="small"
                onClick={() => handleBadgeClick(item.badge)}
                showProgress={false}
              />
            ))}
          </div>

          {/* Progress Text */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            השגת {earnedBadges.length} מתוך {totalBadges} תגים
          </p>

          {/* View All Button */}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/progress" className="flex items-center justify-center gap-2">
              {hebrewLocale.dashboard.viewAllBadges}
              <IconArrowRight className="w-4 h-4" stroke={1.5} />
            </Link>
          </Button>
        </div>
      </Card>

      {/* Badge Details Modal */}
      {selectedBadge && stats && (
        <BadgeModal
          open={showBadgeModal}
          onOpenChange={setShowBadgeModal}
          badge={selectedBadge}
          earned={earnedBadges.some(a => a.badge_id === selectedBadge.id)}
          earnedAt={earnedBadges.find(a => a.badge_id === selectedBadge.id)?.earned_at || null}
          userStats={stats}
        />
      )}
    </>
  );
}

