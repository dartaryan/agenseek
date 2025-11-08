/**
 * Note Utilities - Story 6.2
 * Helper functions for note content extraction and processing
 */

/**
 * Extract plain text preview from Tiptap JSON content
 */
export function extractNotePreview(content: unknown, maxLength: number = 150): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const contentObj = content as Record<string, unknown>;

  if (!contentObj.content || !Array.isArray(contentObj.content)) {
    return '';
  }

  const blocks = contentObj.content;
  let text = '';

  // Recursively extract text from blocks
  const extractText = (block: unknown): string => {
    if (!block || typeof block !== 'object') {
      return '';
    }

    const blockObj = block as Record<string, unknown>;

    // If block has text property, use it
    if (blockObj.text && typeof blockObj.text === 'string') {
      return blockObj.text;
    }

    // If block has content array, recurse
    if (blockObj.content && Array.isArray(blockObj.content)) {
      return blockObj.content.map(extractText).join('');
    }

    return '';
  };

  // Extract from all blocks
  text = blocks.map(extractText).join(' ');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Truncate if needed
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }

  return text || 'אין תוכן';
}

/**
 * Format date in Hebrew locale
 */
export function formatNoteDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'היום';
  } else if (diffDays === 1) {
    return 'אתמול';
  } else if (diffDays < 7) {
    return `לפני ${diffDays} ימים`;
  } else {
    return date.toLocaleDateString('he-IL');
  }
}

/**
 * Get unique tags from an array of notes
 */
export function extractUniqueTags(notes: Array<{ tags: string[] }>): string[] {
  const allTags = notes.flatMap((note) => note.tags || []);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Get unique guide slugs from an array of notes
 */
export function extractUniqueGuides(notes: Array<{ guide_slug: string | null }>): string[] {
  const guides = notes
    .map((note) => note.guide_slug)
    .filter((slug): slug is string => slug !== null);
  return Array.from(new Set(guides)).sort();
}

