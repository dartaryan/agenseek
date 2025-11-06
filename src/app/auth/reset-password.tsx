import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Reset Password Page
 * Story 2.3 will implement the password reset functionality
 */
export function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-600">Agenseek</h1>
          <p className="text-gray-600">BMAD Learning Hub</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
          <p className="text-center text-gray-500">
            Password reset form will be implemented in Story 2.3
          </p>
        </div>

        <Button variant="outline" className="w-full" disabled>
          Send Reset Link (Coming Soon)
        </Button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <a href="/auth/login" className="text-emerald-600 hover:underline">
            Login
          </a>
        </p>
      </Card>
    </div>
  );
}

