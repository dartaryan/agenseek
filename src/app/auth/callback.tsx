import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { IconLoader2 } from '@tabler/icons-react';

/**
 * OAuth Callback Handler
 * Story 2.4: Google OAuth Integration
 *
 * This page is where users land after authorizing with Google.
 * Supabase automatically exchanges the code for tokens.
 * We check onboarding status and redirect accordingly.
 */
export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get session (Supabase handles token exchange automatically)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error('לא נמצאה הפעלת חשבון');
        }

        // Get user profile to check onboarding status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          // Profile might not exist yet - this is okay for first sign-in
          // It will be created by database trigger or onboarding flow
          console.warn('Profile not found, redirecting to onboarding', profileError);
          navigate('/onboarding', { replace: true });
          return;
        }

        // Redirect based on onboarding status
        if (profile?.completed_onboarding) {
          toast({
            title: 'התחברת בהצלחה!',
            description: 'ברוך הבא חזרה',
          });
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast({
          variant: 'destructive',
          title: 'שגיאה בהתחברות',
          description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
        });
        navigate('/auth/login', { replace: true });
      }
    }

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <IconLoader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">מתחבר...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          אנא המתן בזמן שאנחנו מסיימים את ההתחברות
        </p>
      </div>
    </div>
  );
}

