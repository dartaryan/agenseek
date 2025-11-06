import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/auth';

/**
 * Header Component
 *
 * Sticky header with logo, navigation, and user menu.
 * Features:
 * - Sticky positioning at top
 * - Logo linking to dashboard
 * - Search bar (placeholder for Story 7.2)
 * - User menu with profile and logout
 * - Responsive design
 */
export function Header() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <span className="hidden font-bold text-xl text-emerald-600 sm:inline-block">
            Agenseek
          </span>
        </Link>

        {/* Search Bar - Placeholder for Story 7.2 */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search guides... (Coming in Story 7.2)"
              disabled
              className="w-full px-4 py-2 pl-10 text-sm border rounded-lg bg-gray-50 cursor-not-allowed"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle - Placeholder for future */}
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" disabled>
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
            <div className="flex items-center space-x-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xs font-semibold text-emerald-600">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline-block text-sm">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
