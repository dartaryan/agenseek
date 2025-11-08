import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { SidebarProvider } from '../contexts/SidebarContext';

/**
 * Layout Component
 *
 * Main layout wrapper for protected pages.
 * Combines Header, Sidebar, content area (Outlet), and Footer.
 *
 * Layout Structure:
 * - Sticky header at top
 * - Sidebar on left (collapsible on mobile)
 * - Main content area in center (via Outlet)
 * - Footer at bottom
 *
 * Story 6.12: Wrapped in SidebarProvider for collapsible sidebar state management
 */
export function Layout() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        {/* Story 6.15: Animated background shapes for main app */}
        <AnimatedBackground variant="app" />

        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <main className="flex-1 flex flex-col transition-all duration-[250ms] ease-in-out">
            <div className="flex-1">
              <Outlet />
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
