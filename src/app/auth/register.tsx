import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { signUp, signInWithProvider } from '../../lib/auth';
import { hebrewLocale } from '../../lib/locale/he';
import { registerSchema, type RegisterFormData } from '../../lib/validation/authSchemas';
import {
  IconUser,
  IconMail,
  IconLock,
  IconCheck,
  IconX,
  IconBrandGoogle,
  IconLoader2,
} from '@tabler/icons-react';
import AgenseekLogo from '../../assets/agenseek-logo.svg';

/**
 * Password Strength Indicator Component
 */
function PasswordStrength({ password }: { password: string }) {
  const he = hebrewLocale.auth;

  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: he.passwordStrengthWeak, color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: he.passwordStrengthMedium, color: 'bg-yellow-500' };
    return { score: 3, label: he.passwordStrengthStrong, color: 'bg-emerald-500' };
  };

  const strength = password ? calculateStrength(password) : { score: 0, label: '', color: '' };

  const checks = [
    { label: he.requirementLength, valid: password.length >= 8 },
    { label: he.requirementUppercase, valid: /[A-Z]/.test(password) },
    { label: he.requirementLowercase, valid: /[a-z]/.test(password) },
    { label: he.requirementNumber, valid: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      {strength.label && (
        <p className="text-xs font-medium text-gray-600">
          {he.passwordStrength}{' '}
          <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
        </p>
      )}

      {/* Requirements checklist */}
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {check.valid ? (
              <IconCheck className="w-3 h-3 text-emerald-600" />
            ) : (
              <IconX className="w-3 h-3 text-gray-400" />
            )}
            <span className={check.valid ? 'text-emerald-600' : 'text-gray-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Register Page
 * Story 2.2: Full registration form with email verification
 * Story 2.11: Hebrew localization
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const he = hebrewLocale.auth;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Sign up the user with Supabase (automatically sends verification email)
      const signUpData = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.displayName,
      });

      if (!signUpData.user) {
        toast({
          variant: 'destructive',
          title: he.registerFailed,
          description: he.unexpectedError,
        });
        return;
      }

      // Profile is created automatically by database trigger (on_auth_user_created)
      // No manual profile creation needed here

      // Success!
      toast({
        title: he.registerSuccess,
        description: he.registerSuccessDescription,
      });

      // Redirect to login page
      // User must confirm email first, then log in
      // Profile will be created automatically by database trigger
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : he.unexpectedError;
      toast({
        variant: 'destructive',
        title: he.registerFailed,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithProvider('google');
      // Note: User will be redirected to Google, then back to /auth/callback
      // No toast here - callback page will show success message
    } catch (error) {
      console.error('[RegisterPage] Google sign-up error:', error);
      toast({
        variant: 'destructive',
        title: he.googleSignUpError || 'שגיאה בהרשמה עם Google',
        description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
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
        <Card className="p-8 space-y-6 shadow-xl border-emerald-100">
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
              <h2 className="text-2xl font-semibold pt-2">{he.registerTitle}</h2>
              <p className="text-sm text-gray-500">{he.createAccountSubtitle}</p>
            </div>
          </div>

          {/* Google OAuth - Story 2.4 */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <IconLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <IconBrandGoogle className="w-5 h-5" />
            )}
            {isGoogleLoading ? 'מתחבר...' : (he.googleSignUp || 'הירשם עם Google')}
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">{he.displayName}</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder={he.displayNamePlaceholder}
                  className="pl-10"
                  {...register('displayName')}
                />
              </div>
              {errors.displayName && (
                <p className="text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{he.email}</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder={he.emailPlaceholder}
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{he.password}</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder={he.newPasswordPlaceholder}
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

              {/* Password Strength Indicator */}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{he.confirmPassword}</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={he.confirmPasswordPlaceholder}
                  className="pl-10"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? he.registerButtonLoading : he.registerButton}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            {he.haveAccount}{' '}
            <Link to="/auth/login" className="text-emerald-600 hover:underline font-medium">
              {he.loginLink}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
