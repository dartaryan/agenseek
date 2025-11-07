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
 * Normalize list items - handle both string[] and ListItem[] formats
 */
function normalizeListItems(items: (string | ListItem)[]): ListItem[] {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => {
    if (typeof item === 'string') {
      return { content: item };
    }
    return item;
  });
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
  // Handle both "variant" and "ordered" properties
  const blockAny = block as any;
  let isOrdered = false;

  if (block.variant) {
    isOrdered = block.variant === 'ordered';
  } else if (typeof blockAny.ordered === 'boolean') {
    isOrdered = blockAny.ordered;
  }

  const variant: 'ordered' | 'unordered' = isOrdered ? 'ordered' : 'unordered';
  const ListTag = isOrdered ? 'ol' : 'ul';

  // Normalize items to handle both string[] and ListItem[] formats
  const normalizedItems = normalizeListItems(block.items as any);

  return (
    <ListTag
      className={cn(
        'mb-4 space-y-2',
        isOrdered
          ? 'list-decimal rtl:list-inside ltr:list-inside'
          : 'list-disc rtl:list-inside ltr:list-inside',
        'ml-6 rtl:mr-6 rtl:ml-0'
      )}
    >
      {normalizedItems.map((item, index) => (
        <ListItemRenderer key={index} item={item} variant={variant} />
      ))}
    </ListTag>
  );
}

export default ListBlock;
