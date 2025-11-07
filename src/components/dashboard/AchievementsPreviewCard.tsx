import { Link } from 'react-router-dom';
import { IconTrophy, IconLock, IconArrowRight } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Achievements Preview Card Component
 * Shows preview of earned and locked badges
 * Story 5.1 - Dashboard Home Page (Placeholder for Story 5.3)
 * Full implementation will come in Story 5.3
 */

interface AchievementsPreviewCardProps {
  earnedBadges: number;
  lockedBadges: number;
}

export function AchievementsPreviewCard({
  earnedBadges,
  lockedBadges,
}: AchievementsPreviewCardProps) {
  const totalBadges = earnedBadges + lockedBadges;

  // Mock badge data - will be replaced in Story 5.3
  const recentBadges = [
    { id: 1, name: 'קורא מתחיל', icon: '📚', unlocked: true },
    { id: 2, name: 'סקרן', icon: '🔍', unlocked: true },
    { id: 3, name: 'מתמיד', icon: '🎯', unlocked: false },
    { id: 4, name: 'מומחה', icon: '⭐', unlocked: false },
  ];

  return (
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
              {earnedBadges}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              {hebrewLocale.dashboard.earnedBadges}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {lockedBadges}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {hebrewLocale.dashboard.lockedBadges}
            </div>
          </div>
        </div>

        {/* Recent Badges Grid */}
        <div className="grid grid-cols-4 gap-2">
          {recentBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative aspect-square rounded-lg flex items-center justify-center text-3xl transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 ring-2 ring-amber-400 dark:ring-amber-500'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-40 grayscale'
              }`}
              title={badge.name}
            >
              {badge.unlocked ? (
                badge.icon
              ) : (
                <IconLock className="w-6 h-6 text-gray-400" stroke={1.5} />
              )}
            </div>
          ))}
        </div>

        {/* Progress Text */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          השגת {earnedBadges} מתוך {totalBadges} תגים
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
  );
}

