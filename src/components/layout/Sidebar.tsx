import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Guides', href: '/guides', icon: '📚' },
  { name: 'Notes', href: '/notes', icon: '📝' },
  { name: 'Tasks', href: '/tasks', icon: '✅' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

const adminItems: NavItem[] = [{ name: 'Admin', href: '/admin', icon: '🔧' }];

/**
 * Sidebar Component
 *
 * Collapsible navigation sidebar with main navigation links.
 * Features:
 * - Active state highlighting
 * - Hover effects
 * - Icon + label layout
 * - Admin section (conditional)
 * - RTL support ready
 * - Responsive (hidden on mobile, can be toggled)
 */
export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-gray-50/40">
      <nav className="flex-1 space-y-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Admin Section */}
        <div className="pt-4 mt-4 border-t">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Administration
          </p>
          {adminItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Section - Help */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-900">Need Help?</p>
          <p className="mt-1 text-xs text-emerald-700">Check out our guides or ask the community</p>
          <Link
            to="/guides"
            className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            Browse Guides →
          </Link>
        </div>
      </div>
    </aside>
  );
}
