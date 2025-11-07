/**
 * TextBlock - Paragraph component with inline markdown support
 * Supports bold, italic, code, and links with RTL-aware styling
 */

import type { TextBlock as TextBlockType } from '@/types/content-blocks';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface TextBlockProps {
  block: TextBlockType;
}

/**
 * Parse and render inline markdown
 * Supports: **bold**, *italic*, `code`, [link](url)
 */
function parseMarkdown(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let key = 0;

  // Combined regex for all inline markdown patterns
  // Supports: **bold**, *italic*, `code`, [link](url)
  const combinedRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;

  let match;
  let lastIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Determine match type and render accordingly
    if (match[0].startsWith('**')) {
      // Bold
      const content = match[0].slice(2, -2);
      elements.push(
        <strong key={key++} className="font-semibold text-slate-900 dark:text-slate-100">
          {content}
        </strong>
      );
    } else if (match[0].startsWith('`')) {
      // Code
      const content = match[0].slice(1, -1);
      elements.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded text-sm font-mono"
        >
          {content}
        </code>
      );
    } else if (match[0].startsWith('[')) {
      // Link
      const linkMatch = match[0].match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        elements.push(
          <a
            key={key++}
            href={url}
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline decoration-emerald-300 hover:decoration-emerald-500 transition-colors"
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {linkText}
          </a>
        );
      }
    } else if (match[0].startsWith('*') && !match[0].startsWith('**')) {
      // Italic
      const content = match[0].slice(1, -1);
      elements.push(
        <em key={key++} className="italic text-slate-800 dark:text-slate-200">
          {content}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

function TextBlock({ block }: TextBlockProps) {
  // Parse markdown if enabled
  const content = useMemo(() => {
    if (block.markdown) {
      return parseMarkdown(block.content);
    }
    return block.content;
  }, [block.content, block.markdown]);

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <p
      className={cn(
        'text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg mb-4',
        block.alignment ? alignmentClasses[block.alignment] : 'rtl:text-right ltr:text-left'
      )}
    >
      {content}
    </p>
  );
}

export default TextBlock;
