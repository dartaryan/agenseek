/**
 * Mobile ToC Context - Story 5.1.1
 *
 * Provides mobile ToC toggle functionality across components
 * Allows Header to control the mobile ToC without prop drilling
 */

import { createContext, useContext } from 'react';

interface MobileTocContextType {
  isOpen: boolean;
  onToggle: () => void;
  isEnabled: boolean; // Only enabled on guide reader pages
}

const MobileTocContext = createContext<MobileTocContextType | undefined>(undefined);

export function useMobileToc() {
  const context = useContext(MobileTocContext);
  if (!context) {
    // Return safe defaults if not in a provider (e.g., outside guide reader)
    return {
      isOpen: false,
      onToggle: () => {},
      isEnabled: false,
    };
  }
  return context;
}

export default MobileTocContext;

