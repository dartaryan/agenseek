import { Link, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconBooks,
  IconNote,
  IconChecklist,
  IconUser,
  IconSettings,
  IconShieldCog,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { hebrewLocale } from '../../lib/locale/he';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KeyboardShortcutHint } from '../ui/KeyboardShortcut';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string; // Story 7.5: Keyboard shortcut hint
}

const navigationItems: NavItem[] = [
  { name: hebrewLocale.nav.dashboard, href: '/dashboard', icon: IconLayoutDashboard, shortcut: 'Alt+1' },
  { name: hebrewLocale.nav.guides, href: '/guides', icon: IconBooks, shortcut: 'Alt+2' },
  { name: hebrewLocale.nav.notes, href: '/notes', icon: IconNote, shortcut: 'Alt+3' },
  { name: hebrewLocale.nav.tasks, href: '/tasks', icon: IconChecklist, shortcut: 'Alt+4' },
  { name: hebrewLocale.nav.profile, href: '/profile', icon: IconUser, shortcut: 'Alt+5' },
  { name: hebrewLocale.nav.settings, href: '/settings', icon: IconSettings },
];

const adminItems: NavItem[] = [
  { name: hebrewLocale.nav.admin, href: '/admin', icon: IconShieldCog },
];

/**
 * Sidebar Component
 *
 * Collapsible navigation sidebar with main navigation links.
 * Features:
 * - Active state highlighting
 * - Hover effects
 * - Icon + label layout
 * - Admin section (conditional)
 * - RTL support ready
 * - Responsive (hidden on mobile, can be toggled)
 * - Story 6.12: Collapsible with smooth animations and localStorage persistence
 */
export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'shrink-0 border-r bg-gray-50/40 transition-all duration-200 ease-in-out',
          'hidden md:flex md:flex-col',
          isCollapsed ? 'w-0 overflow-hidden' : 'w-60'
        )}
      >
        {/* Collapse button and header - only visible when expanded */}
        {!isCollapsed && (
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {hebrewLocale.sidebar.navigation}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="h-9 w-9"
                    aria-label={hebrewLocale.sidebar.collapseSidebar}
                  >
                    <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{hebrewLocale.sidebar.collapseSidebar}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Navigation - only visible when expanded */}
        {!isCollapsed && (
          <nav className="flex-1 space-y-1 px-3 py-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" stroke={1.5} />
                    <span className="flex-1">{item.name}</span>
                    {/* Story 7.5: Keyboard shortcut hint */}
                    {item.shortcut && (
                      <KeyboardShortcutHint keys={item.shortcut} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Admin Section */}
            <div className="pt-4 mt-4 border-t">
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {hebrewLocale.sections.administration}
              </p>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" stroke={1.5} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* Bottom Section - Help - only visible when expanded */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs font-semibold text-emerald-900">
                {hebrewLocale.help.title}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                {hebrewLocale.help.description}
              </p>
              <Link
                to="/guides"
                className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                {hebrewLocale.help.browseLink}
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Expand button when collapsed - positioned at right edge for RTL */}
      {isCollapsed && (
        <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggle}
                  className="h-10 w-10 rounded-l-lg rounded-r-none border-r-0 shadow-lg"
                  aria-label={hebrewLocale.sidebar.expandSidebar}
                >
                  <IconLayoutSidebarLeftExpand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{hebrewLocale.sidebar.expandSidebar}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
}
