/**
 * CodeBlock - Placeholder component for code blocks
 * Full implementation with syntax highlighting in Story 3.4
 */

import type { CodeBlock as CodeBlockType } from '@/types/content-blocks';

interface CodeBlockProps {
  block: CodeBlockType;
}

function CodeBlock({ block }: CodeBlockProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      {block.filename && (
        <div className="px-4 py-2 border-b border-slate-200 text-sm text-slate-600">
          {block.filename}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono">{block.code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
