import { Link } from 'react-router-dom';

/**
 * Footer Component
 *
 * Simple footer with copyright and useful links.
 * Features:
 * - Copyright notice
 * - Help and documentation links
 * - Responsive layout
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50/40 mt-auto">
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-gray-600">
            © {currentYear} Agenseek - BMAD Learning Hub. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link to="/guides" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Guides
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Help & Support
            </Link>
            <a
              href="https://github.com/bmad-method"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              About BMAD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
