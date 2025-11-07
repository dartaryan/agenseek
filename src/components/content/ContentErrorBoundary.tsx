/**
 * ContentErrorBoundary - Error boundary for content block rendering
 *
 * Story 3.2: Catches render errors in individual blocks to prevent entire page crash
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  blockType: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component that wraps each content block
 * Displays fallback UI if a block fails to render
 */
export class ContentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error rendering block type: ${this.props.blockType}`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <IconAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                שגיאה בטעינת בלוק מסוג: {this.props.blockType}
              </p>
              {this.state.error && (
                <p className="mt-1 text-xs text-red-700">{this.state.error.message}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
