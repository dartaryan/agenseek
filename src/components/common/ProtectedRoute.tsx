import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  skipOnboardingCheck?: boolean;
}

/**
 * ProtectedRoute component
 *
 * Wraps routes that require authentication and/or admin privileges.
 * Automatically redirects users based on their authentication and onboarding status:
 * - Not authenticated → /auth/login
 * - Authenticated but not onboarded → /onboarding
 * - Authenticated and onboarded → Allow access
 *
 * @param children - The component to render if access is granted
 * @param requireAdmin - If true, requires user to be an admin
 * @param skipOnboardingCheck - If true, skips the onboarding completion check (for onboarding page itself)
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  skipOnboardingCheck = false,
}: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute]', {
    path: location.pathname,
    isLoading,
    hasUser: !!user,
    hasProfile: !!profile,
    requireAdmin,
    skipOnboardingCheck,
  });

  // Show loading state while checking auth and profile
  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">טוען...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check onboarding status (skip for onboarding page itself)
  if (!skipOnboardingCheck && profile && !profile.completed_onboarding) {
    // User is authenticated but hasn't completed onboarding
    console.log('Redirecting to onboarding: user has not completed onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // If we need a profile but it's not loaded, show error
  // This should rarely happen - usually profile loads successfully
  if (!skipOnboardingCheck && !profile && user) {
    console.error('Profile failed to load for authenticated user');
    // Allow access anyway - profile might load on next navigation
    // This prevents infinite loops
  }

  // Check admin requirement
  if (requireAdmin) {
    const isAdmin = profile?.is_admin ?? false;

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
