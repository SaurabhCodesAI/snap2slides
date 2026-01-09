'use client';

import { memo, useState } from 'react';

interface OptimizedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = memo(({ size = 'md' }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-white/20 border-t-blue-500 rounded-full animate-spin`} />
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';

const LoadingDots = memo(({ size = 'md' }: { size: 'sm' | 'md' | 'lg' }) => {
  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
});
LoadingDots.displayName = 'LoadingDots';

const LoadingPulse = memo(({ size = 'md' }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} bg-blue-500/20 rounded-full animate-pulse`}>
      <div className="w-full h-full bg-blue-500/40 rounded-full animate-ping" />
    </div>
  );
});
LoadingPulse.displayName = 'LoadingPulse';

export const OptimizedLoading = memo<OptimizedLoadingProps>(({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <LoadingDots size={size} />;
      case 'pulse':
        return <LoadingPulse size={size} />;
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          {content}
        </div>
      </div>
    );
  }

  return content;
});

OptimizedLoading.displayName = 'OptimizedLoading';

// Skeleton loader for content
export const SkeletonLoader = memo<{
  className?: string;
  lines?: number;
  avatar?: boolean;
}>(({ className = '', lines = 3, avatar = false }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-3">
        {avatar && (
          <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`h-3 bg-gray-700 rounded ${
                i === lines - 1 ? 'w-2/3' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

// Progress loader with percentage
export const ProgressLoader = memo<{
  progress: number;
  text?: string;
  showPercentage?: boolean;
}>(({ progress, text, showPercentage = true }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full space-y-2">
      {(text || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {text && <span className="text-gray-400">{text}</span>}
          {showPercentage && (
            <span className="font-mono text-blue-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
});

ProgressLoader.displayName = 'ProgressLoader';

// Hook for managing loading states
export function useOptimizedLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);

  const startLoading = () => setLoading(true);
  const stopLoading = () => {
    setLoading(false);
    setProgress(0);
  };

  const updateProgress = (value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  };

  return {
    loading,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    setLoading
  };
}