'use client';

import { useEffect, useState, useCallback } from 'react';
import { PerformanceMonitor } from '../lib/performance-utils';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  apiResponseTime: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
}

export function PerformanceTracker() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    apiResponseTime: 0,
    bundleSize: 0,
    cacheHitRate: 0,
    errorRate: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  const updateMetrics = useCallback(() => {
    // Memory usage
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Get performance metrics
    const allMetrics = PerformanceMonitor.getAllMetrics();
    
    setMetrics(prev => ({
      ...prev,
      memoryUsage: memoryUsage / 1024 / 1024, // Convert to MB
      renderTime: allMetrics['component-render'] || prev.renderTime,
      apiResponseTime: allMetrics['api-request'] || prev.apiResponseTime,
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    
    // Initial update
    updateMetrics();
    
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Track navigation performance
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation timing:', {
            dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            connect: navEntry.connectEnd - navEntry.connectStart,
            request: navEntry.responseStart - navEntry.requestStart,
            response: navEntry.responseEnd - navEntry.responseStart,
            domLoad: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            totalLoad: navEntry.loadEventEnd - navEntry.loadEventStart
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }, []);

  if (!isVisible && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Performance Toggle Button */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
          title="Toggle Performance Monitor"
        >
          📊
        </button>
      )}

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 min-w-[300px] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Memory Usage:</span>
              <span className={`${metrics.memoryUsage > 100 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.memoryUsage.toFixed(2)} MB
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Render Time:</span>
              <span className={`${metrics.renderTime > 100 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.renderTime.toFixed(2)} ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">API Response:</span>
              <span className={`${metrics.apiResponseTime > 1000 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.apiResponseTime.toFixed(2)} ms
              </span>
            </div>
            
            {/* Real-time metrics */}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Network Status:</span>
                <span className={`${navigator.onLine ? 'text-green-400' : 'text-red-400'}`}>
                  {navigator.onLine ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Connection:</span>
                <span className="text-blue-400">
                  {(navigator as any).connection?.effectiveType || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Performance Actions */}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then((registration) => {
                    const messageChannel = new MessageChannel();
                    messageChannel.port1.onmessage = (event) => {
                      console.log('Cache size:', event.data.size);
                    };
                    registration.active?.postMessage(
                      { type: 'GET_CACHE_SIZE' },
                      [messageChannel.port2]
                    );
                  });
                }
              }}
              className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              Check Cache Size
            </button>
            
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then((registration) => {
                    const messageChannel = new MessageChannel();
                    messageChannel.port1.onmessage = () => {
                      console.log('Cache cleared');
                      alert('Cache cleared successfully');
                    };
                    registration.active?.postMessage(
                      { type: 'CLEAR_CACHE' },
                      [messageChannel.port2]
                    );
                  });
                }
              }}
              className="w-full text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              Clear Cache
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  useEffect(() => {
    const startTime = PerformanceMonitor.start(componentName);
    
    return () => {
      PerformanceMonitor.end(componentName, startTime);
    };
  }, [componentName]);
}

// Hook for tracking API performance
export function useAPIPerformanceTracking() {
  const trackAPICall = useCallback(async function<T>(
    apiCall: () => Promise<T>,
    apiName: string
  ): Promise<T> {
    const startTime = PerformanceMonitor.start(`api-${apiName}`);
    
    try {
      const result = await apiCall();
      PerformanceMonitor.end(`api-${apiName}`, startTime);
      return result;
    } catch (error) {
      PerformanceMonitor.end(`api-${apiName}`, startTime);
      throw error;
    }
  }, []);

  return { trackAPICall };
}