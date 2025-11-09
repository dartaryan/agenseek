import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { IconBrandGoogle, IconLock, IconMail, IconLoader2 } from '@tabler/icons-react';
// Story 0.15: IconMoon, IconSun temporarily removed (theme toggle hidden)
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';
// Story 0.15: useTheme temporarily disabled (theme toggle hidden)
// import { useTheme } from '../../contexts/ThemeContext';
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
  // Story 0.15: Theme toggle temporarily disabled
  // const { setTheme, resolvedTheme } = useTheme();
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
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn({ email: data.email, password: data.password });

      toast({
        title: he.loginSuccess,
        description: he.loginSuccessDescription,
        variant: 'default',
      });

      // Don't manually navigate - let the useEffect handle it when auth state updates
      // This prevents race condition where we navigate before AuthProvider updates
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
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 p-4">
      {/* Story 6.15: Animated background shapes */}
      <AnimatedBackground variant="auth" />

      {/* Story 0.6 / Story 0.15: Theme Toggle - Temporarily hidden until dark mode is polished
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        aria-label={resolvedTheme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      >
        {resolvedTheme === 'dark' ? (
          <IconSun className="h-5 w-5" />
        ) : (
          <IconMoon className="h-5 w-5" />
        )}
      </Button>
      */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 space-y-6 shadow-xl backdrop-blur-xl bg-white/90 dark:bg-card/90 border border-white/20 dark:border-border">
          {/* Header */}
          <div className="text-center space-y-4">
            <img
              src={AgenseekLogo}
              alt="Agenseek - BMAD Learning Hub"
              className="h-12 w-auto mx-auto"
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">{he.brandName}</h1>
              <p className="text-muted-foreground">{he.brandSubtitle}</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-center text-foreground">{he.welcomeBack}</h2>
            <p className="text-center text-muted-foreground text-sm">{he.loginToAccount}</p>
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
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                או
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field - Story 10.3: Added autocomplete and ARIA attributes */}
            <div className="space-y-2">
              <Label htmlFor="email">{he.email}</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder={he.emailPlaceholder}
                  className="pl-10"
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p id="email-error" className="text-sm text-red-600" role="alert">{errors.email.message}</p>}
            </div>

            {/* Password Field - Story 10.3: Added autocomplete and ARIA attributes */}
            <div className="space-y-2">
              <Label htmlFor="password">{he.password}</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  placeholder={he.passwordPlaceholder}
                  className="pl-10"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p id="password-error" className="text-sm text-red-600" role="alert">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password - Story 11.3: Swapped positions for RTL */}
            <div className="flex items-center justify-between">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                {he.forgotPassword}
              </Link>
              <div className="flex items-center gap-2 flex-row-reverse">
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  {he.rememberMe}
                </Label>
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setValue('rememberMe', checked === true)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? he.loginButtonLoading : he.loginButton}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            {he.noAccount}{' '}
            <Link to="/auth/register" className="text-primary hover:underline font-semibold">
              {he.registerLink}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
