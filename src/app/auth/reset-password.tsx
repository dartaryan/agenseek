import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { updatePassword } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { hebrewLocale } from '../../lib/locale/he';
import { resetPasswordSchema } from '../../lib/validation/authSchemas';
import type { ResetPasswordFormData } from '../../lib/validation/authSchemas';
import { IconLock, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';

/**
 * Password Strength Indicator Component (simplified version)
 */
function PasswordStrength({ password }: { password: string }) {
  const he = hebrewLocale.auth;

  const checks = [
    { label: he.requirementLength, valid: password.length >= 8 },
    { label: he.requirementUppercase, valid: /[A-Z]/.test(password) },
    { label: he.requirementLowercase, valid: /[a-z]/.test(password) },
    { label: he.requirementNumber, valid: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="space-y-1 mt-2">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          {check.valid ? (
            <IconCheck className="w-3 h-3 text-emerald-600" />
          ) : (
            <IconX className="w-3 h-3 text-gray-400" />
          )}
          <span className={check.valid ? 'text-emerald-600' : 'text-gray-500'}>{check.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Reset Password Page
 * Story 2.3: Set new password after clicking email link
 * Story 2.11: Hebrew localization
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const he = hebrewLocale.auth;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  // Check if user has valid session from email link
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast({
            variant: 'destructive',
            title: he.tokenInvalid,
            description: he.requestNewResetLink,
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
        setIsValidToken(false);
      }
    };

    checkSession();
  }, [toast]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      await updatePassword(data.password);

      // Success!
      toast({
        title: he.resetSuccess,
        description: he.resetSuccessDescription,
      });

      // Redirect to login page
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Password update error:', err);
      const errorMessage = err instanceof Error ? err.message : he.unexpectedError;
      toast({
        variant: 'destructive',
        title: he.resetFailed,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600">{he.verifyingLink}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 space-y-6 shadow-xl border-red-100">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <IconAlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{he.invalidResetLink}</h2>
                <p className="text-gray-600">{he.tokenInvalidDescription}</p>
                <p className="text-sm text-gray-500">{he.tokenExpiredNote}</p>
              </div>

              <Button className="w-full" asChild>
                <Link to="/auth/forgot-password">{he.requestNewResetLink}</Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/login">{he.backToLogin}</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Valid token - show password reset form
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-emerald-600">{he.brandName}</h1>
            <p className="text-gray-600">{he.brandSubtitle}</p>
            <h2 className="text-2xl font-semibold pt-2">{he.setNewPasswordTitle}</h2>
            <p className="text-sm text-gray-500">{he.setNewPasswordSubtitle}</p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{he.newPassword}</Label>
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
              {isLoading ? he.resetPasswordButtonLoading : he.resetPasswordButton}
            </Button>
          </form>

          {/* Cancel Link */}
          <p className="text-center text-sm text-gray-500">
            {he.rememberPassword}{' '}
            <Link to="/auth/login" className="text-emerald-600 hover:underline font-medium">
              {he.loginLink}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
