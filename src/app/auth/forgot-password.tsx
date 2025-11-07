import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { resetPassword } from '../../lib/auth';
import { hebrewLocale } from '../../lib/locale/he';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../lib/validation/authSchemas';
import { IconMail, IconArrowLeft } from '@tabler/icons-react';
import AgenseekLogo from '../../assets/agenseek-logo.svg';

/**
 * Forgot Password Page
 * Story 2.3: Send password reset email
 * Story 2.11: Hebrew localization
 */
export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const he = hebrewLocale.auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await resetPassword(data.email);

      // Success!
      setEmailSent(true);
      toast({
        title: he.resetLinkSentSuccess,
        description: he.resetLinkSentDescription,
      });
    } catch (err: unknown) {
      console.error('Password reset error:', err);
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
              <h2 className="text-2xl font-semibold pt-2">{he.forgotPasswordTitle}</h2>
              <p className="text-sm text-gray-500">
                {emailSent ? he.forgotPasswordSuccess : he.forgotPasswordSubtitle}
              </p>
            </div>
          </div>

          {!emailSent ? (
            <>
              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? he.sendResetLinkLoading : he.sendResetLink}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="flex items-center justify-center">
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  {he.backToLogin}
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-4">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <IconMail className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-2">
                  <p className="text-gray-600">{he.sentResetLinkTo}</p>
                  <p className="font-semibold text-gray-900">{getValues('email')}</p>
                  <p className="text-sm text-gray-500 pt-2">{he.emailExpiryNote}</p>
                </div>

                {/* Didn't receive email? */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSent(false);
                      handleSubmit(onSubmit)();
                    }}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    {he.didntReceiveEmail}
                  </button>
                </div>

                {/* Back to Login Button */}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth/login">
                    <IconArrowLeft className="w-4 h-4 mr-2" />
                    {he.backToLogin}
                  </Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
