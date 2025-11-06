import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute component
 *
 * Wraps routes that require authentication and/or admin privileges.
 * Redirects to login if not authenticated, or to dashboard if not admin.
 *
 * @param children - The component to render if access is granted
 * @param requireAdmin - If true, requires user to be an admin
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin) {
    // For now, we'll check if user metadata includes admin role
    // This will be properly implemented when we have the profiles table
    const isAdmin = user.user_metadata?.role === 'admin';

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
