import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';

// Story 1.5 Verification: Test Supabase environment variables
// NOTE: Commented out to prevent console output in production
// Uncomment if you need to verify Supabase setup
// import './lib/supabase-test';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
