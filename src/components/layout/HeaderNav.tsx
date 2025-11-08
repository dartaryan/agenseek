/**
 * HeaderNav Component - Story 6.13
 *
 * Compact navigation icons displayed in the header when:
 * 1. Sidebar is collapsed
 * 2. User is in guide reading mode
 *
 * Features:
 * - Horizontal row of icon buttons with tooltips
 * - Active route highlighting
 * - Hebrew labels
 * - Keyboard accessible
 */

import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconBook,
  IconNotes,
  IconChecklist,
  IconChartBar,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: IconHome, label: 'דף הבית', href: '/dashboard' },
  { icon: IconBook, label: 'מדריכים', href: '/guides' },
  { icon: IconNotes, label: 'הערות', href: '/notes' },
  { icon: IconChecklist, label: 'משימות', href: '/tasks' },
  { icon: IconChartBar, label: 'התקדמות', href: '/progress' },
];

export function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="hidden md:flex items-center gap-1"
      aria-label="ניווט ראשי"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.href);

        return (
          <Tooltip key={item.href} delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.href)}
                className={cn(
                  'h-10 w-10',
                  isActive && 'bg-primary/10 text-primary'
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

