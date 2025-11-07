/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { Layout } from './layout';

// Auth pages
import { LoginPage } from './auth/login';
import { RegisterPage } from './auth/register';
import { ForgotPasswordPage } from './auth/forgot-password';
import { ResetPasswordPage } from './auth/reset-password';

// Onboarding
import { OnboardingWizardPage } from './onboarding/wizard';

// Protected pages
import { DashboardPage } from './dashboard';
import { GuidesPage } from './guides';
import { GuideDetailPage } from './guides/guide-detail';
import ContentDemo from './guides/content-demo';
import GuideLibraryDemo from './guides/library-demo';
import CalloutDemo from './guides/callout-demo';
import { NotesPage } from './notes';
import { TasksPage } from './tasks';
import { ProfilePage } from './profile';
import { SettingsPage } from './settings';

// Admin pages
import { AdminDashboardPage } from './admin';

/**
 * Root route component
 * Redirects to login or dashboard based on auth state
 */
function RootRedirect() {
  const { user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">טוען...</p>
        </div>
      </div>
    );
  }

  // Redirect based on auth state
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />;
}

/**
 * Application routing configuration
 *
 * Public routes (no layout):
 * - /auth/login
 * - /auth/register
 * - /auth/reset-password
 *
 * Protected routes (with Layout - Header, Sidebar, Footer):
 * - /dashboard
 * - /guides, /guides/:slug
 * - /notes, /tasks, /profile, /settings
 * - /admin (admin-only)
 *
 * Special protected routes (no layout):
 * - /onboarding (full-screen wizard)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  // Public routes (no layout)
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />,
  },
  // Onboarding (protected, but no layout - full screen wizard)
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute skipOnboardingCheck>
        <OnboardingWizardPage />
      </ProtectedRoute>
    ),
  },
  // Protected routes with Layout
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/guides',
        element: <GuidesPage />,
      },
      {
        path: '/guides/demo',
        element: <ContentDemo />,
      },
      {
        path: '/guides/library-demo',
        element: <GuideLibraryDemo />,
      },
      {
        path: '/guides/callout-demo',
        element: <CalloutDemo />,
      },
      {
        path: '/guides/:slug',
        element: <GuideDetailPage />,
      },
      {
        path: '/notes',
        element: <NotesPage />,
      },
      {
        path: '/tasks',
        element: <TasksPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  // Admin route (protected with admin check, with layout)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
    ],
  },
  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
