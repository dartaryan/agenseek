import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { IconBrandGoogle, IconLock, IconMail, IconLoader2 } from '@tabler/icons-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';
import { signIn, signInWithProvider } from '../../lib/auth';
import { hebrewLocale } from '../../lib/locale/he';
import { loginSchema, type LoginFormData } from '../../lib/validation/authSchemas';
import AgenseekLogo from '../../assets/agenseek-logo.svg';

/**
 * Login Page
 * Story 2.1: Full authentication with email/password and Google OAuth
 * Story 2.11: Hebrew localization
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const he = hebrewLocale.auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    console.log('[LoginPage] Auth state check:', { authLoading, hasUser: !!user });
    if (!authLoading && user) {
      console.log('[LoginPage] User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('[LoginPage] Attempting sign in...');
      const result = await signIn({ email: data.email, password: data.password });
      console.log('[LoginPage] Sign in successful:', result);

      toast({
        title: he.loginSuccess,
        description: he.loginSuccessDescription,
        variant: 'default',
      });

      // Don't manually navigate - let the useEffect handle it when auth state updates
      // This prevents race condition where we navigate before AuthProvider updates
      console.log('[LoginPage] Waiting for auth state to update...');
    } catch (error) {
      console.error('[LoginPage] Sign in error:', error);
      toast({
        title: he.loginFailed,
        description: error instanceof Error ? error.message : he.invalidPassword,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithProvider('google');
      // Note: User will be redirected to Google, then back to /auth/callback
      // No toast here - callback page will show success message
    } catch (error) {
      console.error('[LoginPage] Google sign-in error:', error);
      toast({
        title: he.googleSignInError || 'שגיאה בהתחברות עם Google',
        description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-4">
            <img
              src={AgenseekLogo}
              alt="Agenseek - BMAD Learning Hub"
              className="h-12 w-auto mx-auto"
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-emerald-600">{he.brandName}</h1>
              <p className="text-gray-600">{he.brandSubtitle}</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-center">{he.welcomeBack}</h2>
            <p className="text-center text-gray-500 text-sm">{he.loginToAccount}</p>
          </div>

          {/* Google OAuth - Story 2.4 */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <IconLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <IconBrandGoogle className="w-5 h-5" />
            )}
            {isGoogleLoading ? 'מתחבר...' : (he.googleSignIn || 'התחבר עם Google')}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                או
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{he.email}</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={he.emailPlaceholder}
                  className="pl-10"
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">{he.password}</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={he.passwordPlaceholder}
                  className="pl-10"
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setValue('rememberMe', checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  {he.rememberMe}
                </Label>
              </div>
              <Link to="/auth/forgot-password" className="text-sm text-emerald-600 hover:underline">
                {he.forgotPassword}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? he.loginButtonLoading : he.loginButton}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            {he.noAccount}{' '}
            <Link to="/auth/register" className="text-emerald-600 hover:underline font-semibold">
              {he.registerLink}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
