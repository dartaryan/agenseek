/**
 * DividerBlock - Placeholder component for divider blocks
 * Full implementation in Story 3.10
 */

import type { DividerBlock as DividerBlockType } from '@/types/content-blocks';

interface DividerBlockProps {
  block: DividerBlockType;
}

function DividerBlock({ block }: DividerBlockProps) {
  const variantStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const variantClass = block.variant ? variantStyles[block.variant] : 'border-solid';

  return <hr className={`my-6 border-slate-200 ${variantClass}`} />;
}

export default DividerBlock;
