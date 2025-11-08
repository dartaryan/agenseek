import { useState, useEffect } from 'react';
import {
  IconMenu2,
  IconHome,
  IconBook,
  IconNotes,
  IconChecklist,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
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
import { signOut } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
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
  { icon: IconSettings, label: 'הגדרות', href: '/settings' },
];

/**
 * MobileNav Component - Story 6.11
 *
 * Mobile navigation drawer with hamburger menu for screens <768px
 * Features:
 * - Slide-in drawer from right (RTL)
 * - Touch-friendly navigation items (min 44x44px)
 * - Active route highlighting
 * - User profile section
 * - Theme toggle
 * - Sign out button
 * - Backdrop click and ESC key to close
 * - Focus trap and accessibility features
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

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
      await signOut();
      setOpen(false);
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // TODO: Implement actual theme switching when theme context is available
    document.documentElement.classList.toggle('dark');
  };

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
        className="w-[280px] p-0 flex flex-col bg-white dark:bg-gray-900"
        aria-label="תפריט ניווט"
      >
        {/* Header Section - Story 0.3: User Avatar */}
        <SheetHeader className="border-b p-4">
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
                  'hover:bg-accent min-h-[44px]',
                  isActive && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="border-t p-4 space-y-2">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 min-h-[44px]"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'עבור למצב כהה' : 'עבור למצב בהיר'}
          >
            {theme === 'light' ? (
              <>
                <IconMoon className="h-5 w-5" aria-hidden="true" />
                <span>מצב כהה</span>
              </>
            ) : (
              <>
                <IconSun className="h-5 w-5" aria-hidden="true" />
                <span>מצב בהיר</span>
              </>
            )}
          </Button>

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
    </Sheet>
  );
}

