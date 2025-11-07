/**
 * ListBlock - Semantic list component with nested support
 * Supports ordered/unordered lists with RTL-aware styling
 */

import type { ListBlock as ListBlockType, ListItem } from '@/types/content-blocks';
import { cn } from '@/lib/utils';

interface ListBlockProps {
  block: ListBlockType;
}

/**
 * Recursive list item component for nested lists
 */
interface ListItemRendererProps {
  item: ListItem;
  variant: 'ordered' | 'unordered';
  level?: number;
}

function ListItemRenderer({ item, variant, level = 0 }: ListItemRendererProps) {
  const hasChildren = item.children && item.children.length > 0;
  const ListTag = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <li
      className={cn(
        'text-slate-700 dark:text-slate-300 leading-relaxed mb-2',
        'rtl:text-right ltr:text-left'
      )}
    >
      {/* Item content */}
      <span className="text-base md:text-lg">{item.content}</span>

      {/* Nested list */}
      {hasChildren && (
        <ListTag
          className={cn(
            'mt-2 space-y-1',
            variant === 'ordered'
              ? 'list-decimal rtl:list-inside ltr:list-inside'
              : 'list-disc rtl:list-inside ltr:list-inside',
            level === 0 ? 'ml-6 rtl:mr-6 rtl:ml-0' : 'ml-4 rtl:mr-4 rtl:ml-0'
          )}
        >
          {item.children!.map((child, index) => (
            <ListItemRenderer key={index} item={child} variant={variant} level={level + 1} />
          ))}
        </ListTag>
      )}
    </li>
  );
}

function ListBlock({ block }: ListBlockProps) {
  const ListTag = block.variant === 'ordered' ? 'ol' : 'ul';

  return (
    <ListTag
      className={cn(
        'mb-4 space-y-2',
        block.variant === 'ordered'
          ? 'list-decimal rtl:list-inside ltr:list-inside'
          : 'list-disc rtl:list-inside ltr:list-inside',
        'ml-6 rtl:mr-6 rtl:ml-0'
      )}
    >
      {block.items.map((item, index) => (
        <ListItemRenderer key={index} item={item} variant={block.variant} />
      ))}
    </ListTag>
  );
}

export default ListBlock;
