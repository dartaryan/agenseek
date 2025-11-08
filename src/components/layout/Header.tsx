import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconList } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/auth';
import { hebrewLocale } from '../../lib/locale/he';
import { useMobileToc } from '../../contexts/MobileTocContext';
import { useSidebar } from '../../contexts/SidebarContext';
import AgenseekLogo from '../../assets/agenseek-logo.svg';
import { MobileNav } from './MobileNav';
import { HeaderNav } from './HeaderNav';
import { SearchBar, type SearchBarRef } from './SearchBar';

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
  const searchBarRef = useRef<SearchBarRef>(null);

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
    await signOut();
    window.location.href = '/auth/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
            {/* Theme Toggle - Placeholder for future */}
            <Button variant="ghost" size="sm" disabled>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </Button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                      <span className="text-xs font-semibold text-emerald-600">
                        {profile?.display_name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">
                      {profile?.display_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
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
