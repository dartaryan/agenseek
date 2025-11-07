/**
 * CalloutBlock - Placeholder component for callout blocks
 * Full implementation in Story 3.5
 */

import type { CalloutBlock as CalloutBlockType } from '@/types/content-blocks';

interface CalloutBlockProps {
  block: CalloutBlockType;
}

function CalloutBlock({ block }: CalloutBlockProps) {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  // Note: In Story 3.5, content can be ContentBlock[] for nested blocks
  // For now, just handle string content as placeholder
  const contentText = typeof block.content === 'string' ? block.content : '[Nested content]';

  return (
    <div className={`p-4 rounded-lg border ${variantStyles[block.variant]}`}>
      {block.title && <p className="font-semibold mb-2">{block.title}</p>}
      <p>{contentText}</p>
    </div>
  );
}

export default CalloutBlock;
