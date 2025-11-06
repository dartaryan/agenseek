import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Agenseek</CardTitle>
            <CardDescription className="text-center">
              BMAD Learning Hub - Foundation Complete! ✨
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-800 text-center">
                ✅ Story 1.1: Vite + React + TypeScript<br />
                ✅ Story 1.2: TailwindCSS + Emerald Theme<br />
                ✅ Story 1.3: Shadcn/ui Components<br />
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Component Demo Card */}
        <Card>
          <CardHeader>
            <CardTitle>Component Test</CardTitle>
            <CardDescription>
              Testing Shadcn/ui components with Emerald theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input">Input Component</Label>
              <Input id="test-input" placeholder="Type something..." />
            </div>
            
            <div className="space-y-2">
              <Label>Button Variants</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Button Sizes</Label>
              <div className="flex items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="border-primary">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              <strong className="text-primary">Next:</strong> Story 1.4 - Install Core Dependencies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
