/**
 * CardBlock - Placeholder component for card blocks
 * Full implementation in Story 3.10
 */

import type { CardBlock as CardBlockType } from '@/types/content-blocks';

interface CardBlockProps {
  block: CardBlockType;
}

function CardBlock({ block }: CardBlockProps) {
  const variantStyles = {
    default: 'border border-slate-200',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-emerald-500',
  };

  return (
    <div className={`p-6 rounded-lg bg-white ${variantStyles[block.variant]}`}>
      {block.title && <h3 className="text-lg font-bold mb-2">{block.title}</h3>}
      <div>[Nested content blocks - Story 3.10]</div>
      {block.footer && <p className="mt-2 text-sm text-slate-600">{block.footer}</p>}
    </div>
  );
}

export default CardBlock;
