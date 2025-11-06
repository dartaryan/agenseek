import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Auth pages
import { LoginPage } from './auth/login';
import { RegisterPage } from './auth/register';
import { ResetPasswordPage } from './auth/reset-password';

// Onboarding
import { OnboardingWizardPage } from './onboarding/wizard';

// Protected pages
import { DashboardPage } from './dashboard';
import { GuidesPage } from './guides';
import { GuideDetailPage } from './guides/guide-detail';
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
  // For now, always redirect to login
  // Story 2.10 will implement proper auth-based redirect
  return <Navigate to="/auth/login" replace />;
}

/**
 * Application routing configuration
 * 
 * Public routes:
 * - /auth/login
 * - /auth/register
 * - /auth/reset-password
 * 
 * Protected routes (require authentication):
 * - /onboarding
 * - /dashboard
 * - /guides, /guides/:slug
 * - /notes, /tasks, /profile, /settings
 * 
 * Admin routes (require admin role):
 * - /admin/*
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingWizardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/guides',
    element: (
      <ProtectedRoute>
        <GuidesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/guides/:slug',
    element: (
      <ProtectedRoute>
        <GuideDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notes',
    element: (
      <ProtectedRoute>
        <NotesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

