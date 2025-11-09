/**
 * CodeBlock - Full-featured code block with syntax highlighting
 * Supports: syntax highlighting, line numbers, copy button, highlighted lines
 * Story 3.4: Build Code Block with Syntax Highlighting
 * Story 10.4: Optimized with React.memo to prevent unnecessary re-renders
 */

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import type { CodeBlock as CodeBlockType } from '@/types/content-blocks';

interface CodeBlockProps {
  block: CodeBlockType;
}

// Language display names map
const LANGUAGE_NAMES: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  sql: 'SQL',
  bash: 'Bash',
  shell: 'Shell',
  yaml: 'YAML',
  json: 'JSON',
  xml: 'XML',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  markdown: 'Markdown',
  graphql: 'GraphQL',
};

const CodeBlock = React.memo(function CodeBlock({ block }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Detect dark mode
  const isDarkMode =
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [block.code]);

  const languageDisplayName = LANGUAGE_NAMES[block.language] || block.language.toUpperCase();

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      {/* Header: Filename and Language Badge */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          {block.filename && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {block.filename}
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
            {languageDisplayName}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <IconCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <IconCopy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Syntax Highlighting */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={block.language}
          style={isDarkMode ? oneDark : oneLight}
          showLineNumbers={block.showLineNumbers !== false}
          wrapLines={true}
          lineProps={(lineNumber) => {
            const isHighlighted = block.highlightedLines?.includes(lineNumber) || false;
            return {
              style: {
                backgroundColor: isHighlighted
                  ? isDarkMode
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(16, 185, 129, 0.1)'
                  : 'transparent',
                display: 'block',
                width: '100%',
              },
            };
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
            },
          }}
        >
          {block.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

export default CodeBlock;
