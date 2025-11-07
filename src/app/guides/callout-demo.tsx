/**
 * CalloutBlock Demo Page (Story 3.5)
 *
 * Visual test for all 4 callout variants
 */

import ContentRenderer from '@/components/content/ContentRenderer';
import { allCalloutTests } from '@/lib/callout-block-test';

export default function CalloutDemo() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            CalloutBlock Component Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Story 3.5: Testing all 4 variants (info, warning, success, error)
          </p>
        </header>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            All Callout Variants
          </h2>

          <ContentRenderer blocks={allCalloutTests} />
        </div>

        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              <strong>Acceptance Criteria Checklist:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>✅ Info variant (blue background, IconInfoCircle)</li>
              <li>✅ Warning variant (amber background, IconAlertTriangle)</li>
              <li>✅ Success variant (green background, IconCircleCheck)</li>
              <li>✅ Error variant (red background, IconAlertCircle)</li>
              <li>✅ Left border (4px, variant color)</li>
              <li>✅ Optional title support</li>
              <li>✅ String content support</li>
              <li>✅ Nested blocks support (text, list, code)</li>
              <li>✅ Rounded corners and padding</li>
              <li>✅ Dark mode support</li>
              <li>✅ RTL-aware layout</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
