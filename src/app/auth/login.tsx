import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { IconBrandGoogle, IconLock, IconMail } from '@tabler/icons-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../hooks/use-toast';
import { signIn, signInWithProvider } from '../../lib/auth';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Page
 * Story 2.1: Full authentication with email/password and Google OAuth
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn({ email: data.email, password: data.password });

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        variant: 'default',
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithProvider('google');
      // Note: User will be redirected to Google, then back to /auth/callback
      toast({
        title: 'Redirecting to Google...',
        description: 'You will be redirected back after authentication.',
      });
    } catch (error) {
      toast({
        title: 'Google login failed',
        description: error instanceof Error ? error.message : 'Failed to initiate Google login',
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
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-emerald-600">Agenseek</h1>
            <p className="text-gray-600">BMAD Learning Hub</p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
            <p className="text-center text-gray-500 text-sm">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            <IconBrandGoogle className="mr-2 h-5 w-5" />
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setValue('rememberMe', checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="/auth/reset-password" className="text-sm text-emerald-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-emerald-600 hover:underline font-semibold">
              Create account
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
