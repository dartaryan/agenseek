/**
 * Table of Contents Component - Story 4.5 + Story 5.1.1
 *
 * Displays guide ToC with:
 * - Auto-generated from H2/H3 headings
 * - Current section highlighted
 * - Progress dots (completed/current/upcoming)
 * - Smooth scroll to section on click
 * - Sticky position
 * - Auto-hide FAB on scroll (mobile)
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TocSection } from '@/types/content-blocks';

interface TableOfContentsProps {
  sections: TocSection[];
  currentSection: string | null;
  onSectionClick: (anchor: string) => void;
  className?: string;
}

export function TableOfContents({
  sections,
  currentSection,
  onSectionClick,
  className = '',
}: TableOfContentsProps) {
  return (
    <nav className={`space-y-2 ${className}`} aria-label="תוכן עניינים">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">תוכן עניינים</h2>

      <ul className="space-y-1">
        {sections.map((section) => {
          const isActive = currentSection === section.anchor;
          const isH3 = section.level === 3;

          return (
            <li key={section.id} className={isH3 ? 'mr-4' : ''}>
              <button
                onClick={() => onSectionClick(section.anchor)}
                className={`
                  w-full text-right text-sm py-2 px-3 rounded-lg transition-all
                  flex items-start gap-2 group
                  ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium border-r-2 border-emerald-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {/* Progress dot */}
                <span
                  className={`
                    flex-shrink-0 w-2 h-2 rounded-full mt-1.5
                    ${
                      isActive
                        ? 'bg-emerald-500'
                        : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-emerald-400'
                    }
                  `}
                />

                {/* Section title */}
                <span className="flex-1 text-right leading-snug">{section.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Mobile ToC - Collapsible version for mobile screens
 */
interface MobileTableOfContentsProps extends TableOfContentsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileTableOfContents({
  sections,
  currentSection,
  onSectionClick,
  isOpen,
  onToggle,
}: MobileTableOfContentsProps) {
  // Auto-hide FAB on scroll
  const [showFab, setShowFab] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when at top of page
      if (currentScrollY < 100) {
        setShowFab(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide FAB
        setShowFab(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show FAB
        setShowFab(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (anchor: string) => {
    onSectionClick(anchor);
    onToggle(); // Close ToC after navigation on mobile
  };

  return (
    <div className="lg:hidden">
      {/* Toggle button with auto-hide and visual state */}
      <motion.button
        onClick={onToggle}
        initial={false}
        animate={{
          opacity: showFab ? 1 : 0,
          scale: showFab ? 1 : 0.8,
          rotate: isOpen ? 45 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="
          fixed bottom-4 left-4 z-50
          bg-emerald-600 text-white p-4 rounded-full shadow-lg
          hover:bg-emerald-700 transition-colors
        "
        style={{ pointerEvents: showFab ? 'auto' : 'none' }}
        aria-label="תפריט תוכן עניינים"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </motion.button>

      {/* Bottom sheet overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="
              fixed bottom-0 left-0 right-0 z-50
              bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl
              max-h-[70vh] overflow-y-auto
              p-6
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                תוכן עניינים
              </h2>
              <button
                onClick={onToggle}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="סגור"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <TableOfContents
              sections={sections}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
