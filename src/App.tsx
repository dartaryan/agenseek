import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';

/**
 * Main App component
 * Provides routing for the entire application
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
