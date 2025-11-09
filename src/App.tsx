import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';

/**
 * Main App component
 * Provides routing and global authentication context for the entire application
 *
 * AuthProvider wraps the entire app to provide a single source of truth for auth state.
 * This prevents multiple independent auth checks and loading states across components.
 *
 * Story 6.13: Added TooltipProvider for header navigation tooltips
 */
function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
        <SonnerToaster position="top-center" />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
