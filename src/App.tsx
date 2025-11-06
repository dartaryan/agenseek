import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { Toaster } from './components/ui/toaster';

/**
 * Main App component
 * Provides routing for the entire application
 */
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
