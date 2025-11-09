import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BrandedLoader } from '../ui/branded-loader';

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

  // Show loading state while checking auth and profile
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BrandedLoader size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check onboarding status (skip for onboarding page itself)
  if (!skipOnboardingCheck) {
    // Case 1: No profile at all (user exists but profile missing)
    // This happens after account deletion - redirect to onboarding to recreate profile
    if (!profile && user) {
      return <Navigate to="/onboarding" replace />;
    }

    // Case 2: Profile exists but onboarding not completed
    if (profile && !profile.completed_onboarding) {
      return <Navigate to="/onboarding" replace />;
    }
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
