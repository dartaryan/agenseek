import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconList } from '@tabler/icons-react';
// Story 0.15: IconMoon, IconSun temporarily removed (theme toggle hidden)
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/auth';
import { hebrewLocale } from '../../lib/locale/he';
import { useMobileToc } from '../../contexts/MobileTocContext';
import { useSidebar } from '../../contexts/SidebarContext';
// Story 0.15: useTheme temporarily disabled (theme toggle hidden)
// import { useTheme } from '../../contexts/ThemeContext';
import AgenseekLogo from '../../assets/agenseek-logo.svg';
import { MobileNav } from './MobileNav';
import { HeaderNav } from './HeaderNav';
import { SearchBar, type SearchBarRef } from './SearchBar';
import { NotificationDropdown } from './NotificationDropdown';
import { AdminNotificationBell } from '../admin/AdminNotificationBell';
import { UserAvatar } from '../ui/user-avatar';

/**
 * Header public methods (Story 7.5)
 */
export interface HeaderRef {
  focusSearch: () => void;
}

/**
 * Header Component - Story 5.1.1 + Story 6.13 + Story 7.2 + Story 7.5
 *
 * Sticky header with logo, navigation, search, and user menu.
 * Features:
 * - Sticky positioning at top
 * - Logo linking to dashboard
 * - Mobile ToC button (visible only on guide reader pages)
 * - Header navigation icons (Story 6.13 - shown when sidebar collapsed or in guide mode)
 * - Search bar (Story 7.2 - functional with dropdown results)
 * - User menu with profile and logout
 * - Responsive design
 * - Story 7.5: Exposes focusSearch method for keyboard shortcuts
 */
export const Header = forwardRef<HeaderRef>(function Header(_props, ref) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const { onToggle, isEnabled } = useMobileToc();
  const { isCollapsed } = useSidebar();
  // Story 0.15: Theme toggle temporarily disabled
  // const { setTheme, resolvedTheme } = useTheme();
  const searchBarRef = useRef<SearchBarRef>(null);

  // Story 0.7: Avatar now comes from profile (no local loading needed)

  // Story 7.5: Expose focusSearch method to parent via ref
  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      searchBarRef.current?.focus();
    },
  }));

  // Show mobile ToC button only on guide reader routes (/guides/:slug)
  const isGuideReaderPage = location.pathname.startsWith('/guides/') &&
    location.pathname !== '/guides';

  // Story 6.13: Show header nav when:
  // 1. Sidebar is collapsed
  // 2. In guide reading mode
  const showHeaderNav = isCollapsed || isGuideReaderPage;

  const handleSignOut = async () => {
    try {
      // Sign out and wait for completion
      await signOut();

      // Small delay to ensure storage cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use window.location.href to ensure complete page reload
      // This allows AuthContext to update and storage to be cleared
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('[Header] Logout error:', error);
      // Still redirect on error to ensure user is logged out
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src={AgenseekLogo}
              alt="Agenseek Logo"
              className="h-8 w-auto"
            />
            <span className="hidden font-bold text-xl text-emerald-600 sm:inline-block">
              Agenseek
            </span>
          </Link>

          {/* Mobile ToC button - visible only on guide reader pages, mobile only */}
          {isGuideReaderPage && isEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden ml-2"
              aria-label="פתח תוכן עניינים"
            >
              <IconList className="h-5 w-5 text-emerald-600" />
            </Button>
          )}
        </div>

        {/* Story 6.13: Header Navigation - shown when sidebar collapsed or guide mode */}
        {showHeaderNav && (
          <div className="shrink-0">
            <HeaderNav />
          </div>
        )}

        {/* Search Bar - Story 7.2 + Story 7.5 */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar ref={searchBarRef} />
        </div>

        {/* Right Side: Mobile Nav + User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Navigation - Shows only on mobile */}
          <MobileNav />

          {/* Desktop User Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications - Story 8.6 */}
            <NotificationDropdown />

            {/* Admin Notifications - Story 9.5 */}
            {profile?.is_admin && <AdminNotificationBell />}

            {/* Theme Toggle - Story 0.6 / Story 0.15 - Temporarily hidden until dark mode is polished
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label={resolvedTheme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
            >
              {resolvedTheme === 'dark' ? (
                <IconSun className="h-5 w-5" />
              ) : (
                <IconMoon className="h-5 w-5" />
              )}
            </Button>
            */}

            {/* User Profile - Story 0.3: Avatar + Story 0.7: Real-time updates */}
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2" aria-label={`פרופיל של ${profile?.display_name || user.email?.split('@')[0]}`}>
                    <UserAvatar
                      config={
                        profile?.avatar_style && (profile?.avatar_seed || user.id)
                          ? {
                              style: profile.avatar_style as any,
                              seed: profile.avatar_seed || user.id || 'default',
                              options: (profile.avatar_options as Record<string, any>) || {},
                            }
                          : undefined
                      }
                      userId={user.id}
                      size="sm"
                    />
                    <span className="text-sm">
                      {profile?.display_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="התנתק מהמערכת">
                  {hebrewLocale.actions.logout}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
