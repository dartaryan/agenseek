import { useState, useEffect } from 'react';
import {
  IconMenu2,
  IconHome,
  IconBook,
  IconNotes,
  IconChecklist,
  IconChartBar,
  IconLogout,
  IconBug,
  // Story 0.15: IconMoon, IconSun temporarily removed (theme toggle hidden)
  IconShieldCog,
  IconUsers,
  IconTrendingUp,
  IconClipboardList,
  IconUser,
} from '@tabler/icons-react';
import { BugReportModal } from '../modals/BugReportModal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { UserAvatar } from '../ui/user-avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// Story 0.15: useTheme temporarily disabled (theme toggle hidden)
// import { useTheme } from '../../contexts/ThemeContext';
import { signOut } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { hebrewLocale } from '../../lib/locale/he';
import type { AvatarConfig } from '../../lib/avatar';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: IconHome, label: 'דף הבית', href: '/dashboard' },
  { icon: IconBook, label: 'מדריכים', href: '/guides' },
  { icon: IconNotes, label: 'הערות', href: '/notes' },
  { icon: IconChecklist, label: 'משימות', href: '/tasks' },
  { icon: IconChartBar, label: 'התקדמות', href: '/progress' },
  { icon: IconUser, label: 'פרופיל והגדרות', href: '/profile' },
];

const ADMIN_ITEMS: NavItem[] = [
  { icon: IconShieldCog, label: 'ניהול', href: '/admin' },
  { icon: IconUsers, label: 'ניהול משתמשים', href: '/admin/users' },
  { icon: IconChartBar, label: 'אנליטיקה', href: '/admin/analytics' },
  { icon: IconTrendingUp, label: 'דוח מעורבות', href: '/admin/engagement' },
  { icon: IconClipboardList, label: 'יומן פעולות', href: '/admin/logs' },
];

/**
 * MobileNav Component - Story 6.11 + Story 10.1
 *
 * Mobile navigation drawer with hamburger menu for screens <768px
 * Features:
 * - Slide-in drawer from right (RTL)
 * - Touch-friendly navigation items (min 44x44px)
 * - Active route highlighting
 * - User profile section
 * - Admin section (Story 10.1 - shown for admin users)
 * - Theme toggle
 * - Sign out button
 * - Backdrop click and ESC key to close
 * - Focus trap and accessibility features
 * - Body scroll lock while drawer is open (via Sheet component)
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [showBugReportModal, setShowBugReportModal] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  // Story 0.15: Theme toggle temporarily disabled
  // const { setTheme, resolvedTheme } = useTheme();

  // Story 0.3: Load avatar configuration
  useEffect(() => {
    async function loadAvatar() {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', user.id)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || user.id,
          options: (data.avatar_options as Record<string, any>) || {},
        });
      }
    }
    loadAvatar();
  }, [user?.id]);

  const handleNavClick = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleSignOut = async () => {
    try {
      // Sign out and wait for completion
      await signOut();

      // Small delay to ensure storage cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));

      setOpen(false);
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('[MobileNav] Logout error:', error);
      // Still redirect on error to ensure user is logged out
      setOpen(false);
      window.location.href = '/auth/login';
    }
  };

  // Story 0.15: Theme toggle function temporarily disabled
  // const toggleTheme = () => {
  //   setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  // };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'משתמש';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-11 w-11"
          aria-label="פתח תפריט ניווט"
        >
          <IconMenu2 className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[280px] p-0 flex flex-col bg-white"
        aria-label="תפריט ניווט"
      >
        {/* Header Section - Story 0.3: User Avatar */}
        <SheetHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              config={avatarConfig}
              userId={user?.id}
              size="md"
              className="h-10 w-10"
            />
            <div className="flex-1 text-right">
              <p className="font-semibold text-sm">{displayName}</p>
              <button
                onClick={() => handleNavClick('/profile')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                צפה בפרופיל
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col p-2 overflow-y-auto" role="navigation">
          {/* Primary Navigation Items */}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href === '/guides' && location.pathname.startsWith('/guides'));

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors',
                  'hover:bg-muted min-h-[44px]',
                  isActive && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin Section - Story 10.1: Only visible for admin users */}
          {profile?.is_admin && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {hebrewLocale.sections.administration}
              </p>
              {ADMIN_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href ||
                  (item.href === '/admin' && location.pathname === '/admin');

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors',
                      'hover:bg-accent min-h-[44px]',
                      isActive && 'bg-primary/10 text-primary font-semibold'
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer Section */}
        <div className="border-t border-border p-4 space-y-2">
          {/* Bug Report Button - Story 11.2 */}
          <Button
            variant="default"
            className="w-full justify-start gap-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => {
              setShowBugReportModal(true);
              setOpen(false);
            }}
            aria-label="דיווח על באג או בקשה לפיצ'ר"
          >
            <IconBug className="h-5 w-5" aria-hidden="true" />
            <span>דיווח על באג או בקשה לפיצ'ר</span>
          </Button>

          {/* Theme Toggle - Story 0.6 / Story 0.15 - Temporarily hidden until dark mode is polished
          <Button
            variant="outline"
            className="w-full justify-start gap-3 min-h-[44px]"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
          >
            {resolvedTheme === 'dark' ? (
              <>
                <IconSun className="h-5 w-5" aria-hidden="true" />
                <span>מצב בהיר</span>
              </>
            ) : (
              <>
                <IconMoon className="h-5 w-5" aria-hidden="true" />
                <span>מצב כהה</span>
              </>
            )}
          </Button>
          */}

          {/* Sign Out Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 min-h-[44px] text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            onClick={handleSignOut}
            aria-label="התנתק מהמערכת"
          >
            <IconLogout className="h-5 w-5" aria-hidden="true" />
            <span>התנתק</span>
          </Button>
        </div>
      </SheetContent>

      {/* Bug Report Modal - Story 11.2 */}
      <BugReportModal
        open={showBugReportModal}
        onOpenChange={setShowBugReportModal}
      />
    </Sheet>
  );
}

