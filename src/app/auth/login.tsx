import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Login Page
 * Story 2.1 will implement the full authentication form
 */
export function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-600">Agenseek</h1>
          <p className="text-gray-600">BMAD Learning Hub</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Login</h2>
          <p className="text-center text-gray-500">
            Authentication form will be implemented in Story 2.1
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" disabled>
            Email Login (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Google Login (Coming Soon)
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-emerald-600 hover:underline">
            Register
          </a>
        </p>
      </Card>
    </div>
  );
}

