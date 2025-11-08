/**
 * Floating Note Tooltip - Story 6.3
 * Appears when text is selected on the guide reader page
 * Allows quick creation of a note with the selected text
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconNote } from '@tabler/icons-react';

interface FloatingNoteTooltipProps {
  onAddNote: (selectedText: string) => void;
}

export function FloatingNoteTooltip({ onAddNote }: FloatingNoteTooltipProps) {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      if (text.length > 0) {
        // Get selection position
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();

          // Position tooltip above selection, centered
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 10, // 10px above selection
          });

          setSelectedText(text);
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
        setSelectedText('');
      }
    };

    // Add event listener
    document.addEventListener('selectionchange', handleSelectionChange);

    // Cleanup
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleAddNoteClick = () => {
    onAddNote(selectedText);

    // Clear selection
    window.getSelection()?.removeAllRanges();
    setIsVisible(false);
    setSelectedText('');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 pointer-events-auto"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <Button
            onClick={handleAddNoteClick}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg whitespace-nowrap"
          >
            <IconNote className="w-4 h-4 ml-2" />
            הוסף להערה
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

