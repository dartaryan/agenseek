import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Hook to manage authentication state
 * Automatically listens to auth state changes and updates accordingly
 * Also fetches user profile data including onboarding status
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Get initial session and profile
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          if (isMounted) {
            setError(sessionError);
            setIsLoading(false);
          }
          return;
        }

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
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in initAuth:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);

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
        setError(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, isLoading, error };
}
