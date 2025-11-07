import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook to access authentication state from AuthContext
 *
 * This hook consumes the global auth state provided by AuthProvider.
 * All components using this hook share the same auth state, preventing
 * duplicate loading states and race conditions.
 *
 * @returns {object} Auth state containing user, profile, isLoading, and error
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
