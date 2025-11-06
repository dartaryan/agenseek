import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { resetPassword } from '../../lib/auth';
import { IconMail, IconArrowLeft } from '@tabler/icons-react';

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page
 * Story 2.3: Send password reset email
 */
export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
        title: 'Reset Link Sent!',
        description: 'Check your email for the password reset link.',
      });
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send reset email. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-emerald-600">Agenseek</h1>
            <p className="text-gray-600">BMAD Learning Hub</p>
            <h2 className="text-2xl font-semibold pt-2">Forgot Password?</h2>
            <p className="text-sm text-gray-500">
              {emailSent
                ? 'Check your email for the reset link'
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {!emailSent ? (
            <>
              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="flex items-center justify-center">
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Back to Login
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
                  <p className="text-gray-600">We've sent a password reset link to:</p>
                  <p className="font-semibold text-gray-900">{getValues('email')}</p>
                  <p className="text-sm text-gray-500 pt-2">
                    Click the link in the email to reset your password. The link will expire in 1
                    hour.
                  </p>
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
                    Didn't receive the email? Click to resend
                  </button>
                </div>

                {/* Back to Login Button */}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth/login">
                    <IconArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
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
