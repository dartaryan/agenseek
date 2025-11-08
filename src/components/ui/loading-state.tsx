import { BrandedLoader } from './branded-loader';

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  minHeight?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Wrapper that shows BrandedLoader while loading, children when loaded
 */
export function LoadingState({
  loading,
  children,
  minHeight = 'min-h-[400px]',
  size = 'lg',
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${minHeight}`}>
        <BrandedLoader size={size} />
      </div>
    );
  }

  return <>{children}</>;
}

