import { Card } from '../../components/ui/card';

/**
 * Onboarding Wizard Page
 * Stories 2.5-2.9 will implement the full onboarding wizard
 */
export function OnboardingWizardPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Card className="w-full max-w-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-600">Welcome to Agenseek!</h1>
          <p className="text-gray-600">Let's personalize your learning experience</p>
        </div>
        
        <div className="space-y-4">
          <p className="text-center text-gray-500">
            Onboarding wizard will be implemented in Stories 2.5-2.9
          </p>
          <div className="grid grid-cols-5 gap-2 mt-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                  {step}
                </div>
                <p className="text-xs text-gray-500">Step {step}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

