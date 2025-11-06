import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { signUp } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  IconUser,
  IconMail,
  IconLock,
  IconCheck,
  IconX,
  IconBrandGoogle,
} from '@tabler/icons-react';

// Zod validation schema
const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password Strength Indicator Component
 */
function PasswordStrength({ password }: { password: string }) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = password ? calculateStrength(password) : { score: 0, label: '', color: '' };

  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
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
          Password strength:{' '}
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
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
          title: 'Registration Failed',
          description: 'Failed to create user account. Please try again.',
        });
        return;
      }

      // Create profile in database
      const { error: profileError } = await supabase.from('profiles').insert({
        id: signUpData.user.id,
        display_name: data.displayName,
        email: data.email,
        completed_onboarding: false,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          variant: 'destructive',
          title: 'Profile Creation Failed',
          description: 'Account created but profile setup failed. Please contact support.',
        });
        return;
      }

      // Success!
      toast({
        title: 'Account Created Successfully!',
        description: 'Please check your email to verify your account before logging in.',
      });

      // Redirect to login page
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Google Sign-Up Failed',
          description: error.message,
        });
      }
    } catch (err) {
      console.error('Google sign-up error:', err);
      toast({
        variant: 'destructive',
        title: 'Google Sign-Up Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-emerald-600">Agenseek</h1>
            <p className="text-gray-600">BMAD Learning Hub</p>
            <h2 className="text-2xl font-semibold pt-2">Create Account</h2>
            <p className="text-sm text-gray-500">Start your learning journey today</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
          >
            <IconBrandGoogle className="w-5 h-5 mr-2" />
            {isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-emerald-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
