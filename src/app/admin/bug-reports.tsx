import { BugReports } from '@/components/admin/BugReports';

/**
 * Bug Reports Admin Page
 * Story: 11.2 - Footer Redesign & Credits
 *
 * Displays user-submitted bug reports with management capabilities
 */
export function BugReportsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto">
        <BugReports />
      </div>
    </div>
  );
}

