import { Link } from 'react-router-dom';
import { IconBooks, IconNote, IconChecklist, IconUser } from '@tabler/icons-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { hebrewLocale } from '../../lib/locale/he';

/**
 * Quick Actions Card Component
 * Provides quick access to common actions
 * Story 5.1 - Dashboard Home Page
 */

const quickActions = [
  {
    label: hebrewLocale.nav.guides,
    icon: IconBooks,
    to: '/guides',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    label: hebrewLocale.nav.notes,
    icon: IconNote,
    to: '/notes',
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: hebrewLocale.nav.tasks,
    icon: IconChecklist,
    to: '/tasks',
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: hebrewLocale.nav.profile,
    icon: IconUser,
    to: '/profile',
    color: 'from-amber-500 to-amber-600',
  },
];

export function QuickActionsCard() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {hebrewLocale.dashboard.quickActions}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hebrewLocale.dashboard.quickActionsDescription}
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.to}
                variant="outline"
                className="h-auto py-6 flex-col gap-3 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
                asChild
              >
                <Link to={action.to}>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" stroke={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {action.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

