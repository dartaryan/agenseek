import { Link, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconRoute,
  IconBooks,
  IconNote,
  IconChecklist,
  IconUser,
  IconShieldCog,
  IconUsers,
  IconChartBar,
  IconTrendingUp,
  IconClipboardList,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { hebrewLocale } from '../../lib/locale/he';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KeyboardShortcutHint } from '../ui/KeyboardShortcut';
import { UserAvatar } from '../ui/user-avatar';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string; // Story 7.5: Keyboard shortcut hint
}

const navigationItems: NavItem[] = [
  { name: hebrewLocale.nav.dashboard, href: '/dashboard', icon: IconLayoutDashboard, shortcut: 'Alt+0' },
  { name: hebrewLocale.nav.journey, href: '/journey', icon: IconRoute, shortcut: 'Alt+1' },
  { name: hebrewLocale.nav.guides, href: '/guides', icon: IconBooks, shortcut: 'Alt+2' },
  { name: hebrewLocale.nav.notes, href: '/notes', icon: IconNote, shortcut: 'Alt+3' },
  { name: hebrewLocale.nav.tasks, href: '/tasks', icon: IconChecklist, shortcut: 'Alt+4' },
  { name: 'פרופיל והגדרות', href: '/profile', icon: IconUser, shortcut: 'Alt+5' },
];

const adminItems: NavItem[] = [
  { name: hebrewLocale.nav.admin, href: '/admin', icon: IconShieldCog },
  { name: hebrewLocale.pages.admin.userManagement, href: '/admin/users', icon: IconUsers },
  { name: hebrewLocale.pages.admin.analytics.title, href: '/admin/analytics', icon: IconChartBar },
  { name: hebrewLocale.pages.admin.engagementReport.title, href: '/admin/engagement', icon: IconTrendingUp },
  { name: hebrewLocale.pages.admin.actionLog.title, href: '/admin/logs', icon: IconClipboardList },
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
  const { user, profile } = useAuth();

  // Story 0.7: Avatar now comes from profile (no local loading needed)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    // Exact match for /admin to prevent matching /admin/users
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  // Check if user is admin
  const isAdmin = profile?.is_admin ?? false;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'shrink-0 border-r border-border bg-muted/30 transition-all duration-200 ease-in-out',
          'hidden md:flex md:flex-col',
          isCollapsed ? 'w-0 overflow-hidden' : 'w-60'
        )}
      >
        {/* Collapse button and header - only visible when expanded */}
        {!isCollapsed && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
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

        {/* Navigation - only visible when expanded - Story 10.3: Added aria-label */}
        {!isCollapsed && (
          <nav className="flex-1 space-y-1 px-3 py-4" aria-label="ניווט ראשי">
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
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" stroke={1.5} aria-hidden="true" />
                    <span className="flex-1">{item.name}</span>
                    {/* Story 7.5: Keyboard shortcut hint */}
                    {item.shortcut && (
                      <KeyboardShortcutHint keys={item.shortcut} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Admin Section - Only visible for admins */}
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-border">
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5" stroke={1.5} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        )}

        {/* Bottom Section - User & Help - only visible when expanded */}
        {!isCollapsed && (
          <div className="border-t border-border">
            {/* User Section - Story 0.3 + Story 0.7: Real-time updates */}
            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border"
            >
              <UserAvatar
                config={
                  profile?.avatar_style && (profile?.avatar_seed || user?.id)
                    ? {
                        style: profile.avatar_style as any,
                        seed: profile.avatar_seed || user?.id || 'default',
                        options: (profile.avatar_options as Record<string, any>) || {},
                      }
                    : undefined
                }
                userId={user?.id}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.display_name || 'משתמש'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </Link>

            {/* Help Section */}
            <div className="p-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-xs font-semibold text-primary">
                  {hebrewLocale.help.title}
                </p>
                <p className="mt-1 text-xs text-primary/80">
                  {hebrewLocale.help.description}
                </p>
                <Link
                  to="/guides"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:text-primary/80"
                >
                  {hebrewLocale.help.browseLink}
                </Link>
              </div>
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
