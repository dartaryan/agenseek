import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

/**
 * Main App component
 * Provides routing and global authentication context for the entire application
 *
 * AuthProvider wraps the entire app to provide a single source of truth for auth state.
 * This prevents multiple independent auth checks and loading states across components.
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
