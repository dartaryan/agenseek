import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

// Story 1.5 Verification: Test Supabase environment variables
import './lib/supabase-test'

// Story 1.6 Verification: Test Supabase client and auth
import './lib/story-1.6-verification'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
