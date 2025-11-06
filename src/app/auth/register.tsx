import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Register Page
 * Story 2.2 will implement the full registration form
 */
export function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-600">Agenseek</h1>
          <p className="text-gray-600">BMAD Learning Hub</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>
          <p className="text-center text-gray-500">
            Registration form will be implemented in Story 2.2
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" disabled>
            Email Registration (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Google Registration (Coming Soon)
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/login" className="text-emerald-600 hover:underline">
            Login
          </a>
        </p>
      </Card>
    </div>
  );
}
