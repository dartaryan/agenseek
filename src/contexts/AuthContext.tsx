/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { AvatarConfig } from '@/lib/avatar';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: AuthError | null;
  refreshProfile: () => Promise<void>;
  updateAvatar: (config: AvatarConfig) => Promise<void>;
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

  // Function to manually refresh profile (useful after profile updates)
  const refreshProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('[AuthProvider] Error refreshing profile:', profileError);
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('[AuthProvider] Exception during profile refresh:', err);
    }
  };

  // Function to update avatar (Story 0.7: Real-time Avatar Update Reflection)
  const updateAvatar = async (config: AvatarConfig) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_style: config.style,
          avatar_seed: config.seed,
          avatar_options: config.options || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('[AuthProvider] Error updating avatar:', error);
        throw error;
      }

      // CRITICAL: Immediately update local profile state
      // This ensures all components using useAuth() see the new avatar instantly
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar_style: config.style,
          avatar_seed: config.seed,
          avatar_options: config.options || {},
        };
      });
    } catch (err) {
      console.error('[AuthProvider] Exception during avatar update:', err);
      throw err;
    }
  };

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
          console.error('[AuthProvider] Session error:', sessionError);
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

      // Skip processing INITIAL_SESSION event - initAuth() handles it properly
      // This prevents race condition where isLoading is set false before profile loads
      if (event === 'INITIAL_SESSION') {
        return;
      }

      setUser(session?.user ?? null);

      // Don't set isLoading = false here to prevent race condition
      // isLoading is managed by initAuth() which properly waits for profile load
      // This prevents redirects to onboarding when profile is still loading

      // Fetch profile in background
      if (session?.user) {
        // Fetch profile with timeout
        const fetchProfileWithTimeout = async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (isMounted) {
              if (profileError) {
                console.error('[AuthProvider] Error fetching profile:', profileError);
                setProfile(null);
              } else {
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
    <AuthContext.Provider value={{ user, profile, isLoading, error, refreshProfile, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}
