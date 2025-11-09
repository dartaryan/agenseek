/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { BrandedLoader } from '../components/ui/branded-loader';
import { Layout } from './layout';

// Story 10.4: Lazy load all page components for better code splitting
// Auth pages - lazy loaded
const LoginPage = lazy(() => import('./auth/login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./auth/register').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./auth/forgot-password').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./auth/reset-password').then(m => ({ default: m.ResetPasswordPage })));
const OAuthCallbackPage = lazy(() => import('./auth/callback').then(m => ({ default: m.OAuthCallbackPage })));

// Onboarding - lazy loaded
const OnboardingWizardPage = lazy(() => import('./onboarding/wizard').then(m => ({ default: m.OnboardingWizardPage })));

// Protected pages - lazy loaded
const DashboardPage = lazy(() => import('./dashboard').then(m => ({ default: m.DashboardPage })));
const ProgressDetailsPage = lazy(() => import('./progress').then(m => ({ default: m.ProgressDetailsPage })));
const JourneyPage = lazy(() => import('./journey').then(m => ({ default: m.JourneyPage })));
const GuidesPage = lazy(() => import('./guides').then(m => ({ default: m.GuidesPage })));
const GuideDetailPage = lazy(() => import('./guides/guide-detail').then(m => ({ default: m.GuideDetailPage })));
const ContentDemo = lazy(() => import('./guides/content-demo'));
const GuideLibraryDemo = lazy(() => import('./guides/library-demo'));
const CalloutDemo = lazy(() => import('./guides/callout-demo'));
const NotesPage = lazy(() => import('./notes').then(m => ({ default: m.NotesPage })));
const TasksPage = lazy(() => import('./tasks').then(m => ({ default: m.TasksPage })));
const ProfilePage = lazy(() => import('./profile').then(m => ({ default: m.ProfilePage })));
const SearchResultsPage = lazy(() => import('./search').then(m => ({ default: m.SearchResultsPage })));

// Admin pages - lazy loaded (heavy analytics components)
const AdminDashboardPage = lazy(() => import('./admin').then(m => ({ default: m.AdminDashboardPage })));
const UserManagementPage = lazy(() => import('./admin/users').then(m => ({ default: m.UserManagementPage })));
const ContentAnalyticsPage = lazy(() => import('./admin/analytics.tsx'));
const EngagementReportPage = lazy(() => import('./admin/engagement.tsx'));
const AdminNotificationPreferencesPage = lazy(() => import('./admin/notifications/preferences').then(m => ({ default: m.AdminNotificationPreferencesPage })));
const AdminActionLogPage = lazy(() => import('./admin/logs.tsx'));
const BugReportsPage = lazy(() => import('./admin/bug-reports').then(m => ({ default: m.BugReportsPage })));

/**
 * Suspense wrapper for lazy loaded routes
 * Shows branded loader while route component is loading
 */
function RouteSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <BrandedLoader size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
        <BrandedLoader size="lg" />
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
    element: (
      <RouteSuspense>
        <LoginPage />
      </RouteSuspense>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <RouteSuspense>
        <RegisterPage />
      </RouteSuspense>
    ),
  },
  {
    path: '/auth/forgot-password',
    element: (
      <RouteSuspense>
        <ForgotPasswordPage />
      </RouteSuspense>
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <RouteSuspense>
        <ResetPasswordPage />
      </RouteSuspense>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <RouteSuspense>
        <OAuthCallbackPage />
      </RouteSuspense>
    ),
  },
  // Onboarding (protected, but no layout - full screen wizard)
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute skipOnboardingCheck>
        <RouteSuspense>
          <OnboardingWizardPage />
        </RouteSuspense>
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
        element: (
          <RouteSuspense>
            <DashboardPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/progress',
        element: (
          <RouteSuspense>
            <ProgressDetailsPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/journey',
        element: (
          <RouteSuspense>
            <JourneyPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/guides',
        element: (
          <RouteSuspense>
            <GuidesPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/guides/demo',
        element: (
          <RouteSuspense>
            <ContentDemo />
          </RouteSuspense>
        ),
      },
      {
        path: '/guides/library-demo',
        element: (
          <RouteSuspense>
            <GuideLibraryDemo />
          </RouteSuspense>
        ),
      },
      {
        path: '/guides/callout-demo',
        element: (
          <RouteSuspense>
            <CalloutDemo />
          </RouteSuspense>
        ),
      },
      {
        path: '/guides/:slug',
        element: (
          <RouteSuspense>
            <GuideDetailPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/notes',
        element: (
          <RouteSuspense>
            <NotesPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/tasks',
        element: (
          <RouteSuspense>
            <TasksPage />
          </RouteSuspense>
        ),
      },
      {
        path: '/profile',
        element: (
          <RouteSuspense>
            <ProfilePage />
          </RouteSuspense>
        ),
      },
      {
        path: '/settings',
        element: <Navigate to="/profile" replace />,
      },
      {
        path: '/search',
        element: (
          <RouteSuspense>
            <SearchResultsPage />
          </RouteSuspense>
        ),
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
        element: (
          <RouteSuspense>
            <AdminDashboardPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'users',
        element: (
          <RouteSuspense>
            <UserManagementPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RouteSuspense>
            <ContentAnalyticsPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'engagement',
        element: (
          <RouteSuspense>
            <EngagementReportPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'notifications/preferences',
        element: (
          <RouteSuspense>
            <AdminNotificationPreferencesPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'logs',
        element: (
          <RouteSuspense>
            <AdminActionLogPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'bug-reports',
        element: (
          <RouteSuspense>
            <BugReportsPage />
          </RouteSuspense>
        ),
      },
    ],
  },
  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
