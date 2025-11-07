import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: AuthError | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Global authentication state provider
 *
 * Provides a single source of truth for authentication state across the entire app.
 * All components that need auth state should consume this context via useAuth hook.
 *
 * This solves the problem of multiple independent auth state instances that caused
 * loading issues on page refresh.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Get initial session and profile
    const initAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing auth...');
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[AuthProvider] Session error:', sessionError);
          if (isMounted) {
            setError(sessionError);
            setIsLoading(false);
          }
          return;
        }

        console.log('[AuthProvider] Session:', session?.user ? 'User logged in' : 'No user');
        if (isMounted) {
          setUser(session?.user ?? null);
        }

        // Fetch profile if user is authenticated
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (isMounted) {
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              // Set profile to null on error
              setProfile(null);
            } else {
              setProfile(profileData);
            }
          }
        } else {
          if (isMounted) {
            setProfile(null);
          }
        }

        if (isMounted) {
          console.log('[AuthProvider] Auth initialization complete, isLoading = false');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AuthProvider] Error in initAuth:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('[AuthProvider] Auth state changed:', event, session?.user ? 'User present' : 'No user');
      setUser(session?.user ?? null);

      // CRITICAL: Set loading to false immediately when auth state changes
      // Don't wait for profile fetch to complete - it might hang due to RLS policies
      console.log('[AuthProvider] Setting isLoading = false immediately');
      setIsLoading(false);

      // Fetch profile in background (don't block on this)
      if (session?.user) {
        console.log('[AuthProvider] Fetching profile for user:', session.user.id);

        // Fetch profile with timeout
        const fetchProfileWithTimeout = async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            console.log('[AuthProvider] Profile fetch result:', { profileData, profileError, isMounted });

            if (isMounted) {
              if (profileError) {
                console.error('[AuthProvider] Error fetching profile:', profileError);
                setProfile(null);
              } else {
                console.log('[AuthProvider] Setting profile data:', profileData);
                setProfile(profileData);
              }
            }
          } catch (err) {
            console.error('[AuthProvider] Exception during profile fetch:', err);
          }
        };

        // Fetch profile but don't await it
        fetchProfileWithTimeout();
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }

      if (isMounted) {
        setError(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

