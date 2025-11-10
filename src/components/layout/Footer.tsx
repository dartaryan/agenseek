import { IconBrandGithub, IconMail } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';

/**
 * Footer Component
 * Story: 11.2 - Footer Redesign & Credits
 *
 * Features:
 * - Fully Hebrew content (Hebrew-only policy)
 * - Creator credit with email link
 * - Correct BMAD GitHub link
 * - Bug report modal
 * - Mobile responsive
 * - RTL layout
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = hebrewLocale.footer;

  return (
    <footer className="border-t bg-gray-50/40 mt-auto" dir="rtl">
      <div className="container px-4 py-4 md:px-6 md:py-5">
        {/* Mobile Layout: Single line */}
        <div className="flex items-center justify-center gap-2 text-center text-xs md:hidden flex-wrap">
          <span className="text-gray-600">© {currentYear} Agenseek</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{locale.createdBy}</span>
          <a
            href="mailto:benakiva1991@gmail.com"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors"
          >
            בן עקיבא
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="https://github.com/bmad-code-org/BMAD-METHOD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <IconBrandGithub size={16} stroke={1.5} />
            <span>BMAD</span>
          </a>
        </div>

        {/* Desktop Layout: Horizontal */}
        <div className="hidden md:flex items-center justify-between text-sm">
          {/* Right Side: Copyright and Creator */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600">© {currentYear} Agenseek. {locale.copyright}</span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600">{locale.createdBy}</span>
              <a
                href="mailto:benakiva1991@gmail.com"
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors"
              >
                <IconMail size={14} stroke={1.5} />
                <span>בן עקיבא</span>
              </a>
            </div>
          </div>

          {/* Left Side: BMAD GitHub */}
          <a
            href="https://github.com/bmad-code-org/BMAD-METHOD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <IconBrandGithub size={18} stroke={1.5} />
            <span>{locale.bmadGithub}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
