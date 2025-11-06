import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';

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
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

