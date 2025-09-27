'use client';

import { useState, useEffect, useCallback } from 'react';

interface SystemHealth {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    online: boolean;
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  storage: {
    used: number;
    total: number;
    available: number;
  };
  performance: {
    fps: number;
    loadTime: number;
    renderTime: number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    lastCheck: Date;
  };
}

export function SystemDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSystemHealth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Memory information
      const memory = (performance as any).memory || {};
      const memoryUsed = memory.usedJSHeapSize || 0;
      const memoryTotal = memory.totalJSHeapSize || memoryUsed;
      
      // Network information
      const connection = (navigator as any).connection || {};
      
      // Storage estimation
      let storageEstimate = { usage: 0, quota: 100 * 1024 * 1024 };
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        storageEstimate = await navigator.storage.estimate() as any;
      }
      
      // Performance metrics
      const performanceEntries = performance.getEntriesByType('navigation');
      const navTiming = performanceEntries[0] as PerformanceNavigationTiming;
      
      // API health check
      const apiStartTime = performance.now();
      let apiStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
      let apiResponseTime = 0;
      
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        apiResponseTime = performance.now() - apiStartTime;
        
        if (!response.ok) {
          apiStatus = response.status >= 500 ? 'down' : 'degraded';
        } else if (apiResponseTime > 2000) {
          apiStatus = 'degraded';
        }
      } catch {
        apiStatus = 'down';
        apiResponseTime = performance.now() - apiStartTime;
      }

      setHealth({
        memory: {
          used: memoryUsed / 1024 / 1024, // MB
          total: memoryTotal / 1024 / 1024, // MB
          percentage: memoryTotal ? (memoryUsed / memoryTotal) * 100 : 0
        },
        network: {
          online: navigator.onLine,
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        },
        storage: {
          used: (storageEstimate.usage || 0) / 1024 / 1024, // MB
          total: (storageEstimate.quota || 0) / 1024 / 1024, // MB
          available: ((storageEstimate.quota || 0) - (storageEstimate.usage || 0)) / 1024 / 1024 // MB
        },
        performance: {
          fps: 60, // Estimated based on requestAnimationFrame
          loadTime: navTiming ? navTiming.loadEventEnd - navTiming.fetchStart : 0,
          renderTime: navTiming ? navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart : 0
        },
        api: {
          status: apiStatus,
          responseTime: apiResponseTime,
          lastCheck: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to check system health:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkSystemHealth();
      const interval = setInterval(checkSystemHealth, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, checkSystemHealth]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-400';
    if (percentage > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <>
      {/* System Health Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-gray-900 border border-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105"
        title="System Health Dashboard"
      >
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            health?.api.status === 'healthy' ? 'bg-green-400' : 
            health?.api.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
          } animate-pulse`}></div>
          <span className="text-sm font-mono">SYS</span>
        </div>
      </button>

      {/* System Health Dashboard */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-6 min-w-[400px] shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              🔧 System Health
              {isLoading && <div className="ml-2 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {health && (
            <div className="space-y-4">
              {/* API Status */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">API Health</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className={`text-sm font-medium ${getStatusColor(health.api.status)}`}>
                    {health.api.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Response Time:</span>
                  <span className={`text-sm ${health.api.responseTime > 1000 ? 'text-red-400' : 'text-green-400'}`}>
                    {health.api.responseTime.toFixed(0)}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Last Check:</span>
                  <span className="text-sm text-gray-300">
                    {health.api.lastCheck.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Memory Usage</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Used:</span>
                    <span className={`text-sm ${getPercentageColor(health.memory.percentage)}`}>
                      {health.memory.used.toFixed(1)} MB ({health.memory.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        health.memory.percentage > 80 ? 'bg-red-400' : 
                        health.memory.percentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${Math.min(health.memory.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Network Status */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Network</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={health.network.online ? 'text-green-400' : 'text-red-400'}>
                      {health.network.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-blue-400">{health.network.effectiveType}</span>
                  </div>
                  {health.network.downlink > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Speed:</span>
                      <span className="text-green-400">{health.network.downlink} Mbps</span>
                    </div>
                  )}
                  {health.network.rtt > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latency:</span>
                      <span className="text-yellow-400">{health.network.rtt}ms</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Performance</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Load Time:</span>
                    <span className={`${health.performance.loadTime > 3000 ? 'text-red-400' : 'text-green-400'}`}>
                      {health.performance.loadTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Render Time:</span>
                    <span className={`${health.performance.renderTime > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {health.performance.renderTime.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Storage</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Used:</span>
                    <span className="text-blue-400">{health.storage.used.toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-green-400">{health.storage.available.toFixed(1)} MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
            <button
              onClick={checkSystemHealth}
              disabled={isLoading}
              className="w-full text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors"
            >
              {isLoading ? 'Checking...' : 'Refresh Health Check'}
            </button>
            
            <button
              onClick={() => {
                if (confirm('This will clear browser cache and refresh the page. Continue?')) {
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name));
                    }).then(() => window.location.reload());
                  } else {
                    (window as any).location.reload();
                  }
                }
              }}
              className="w-full text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
            >
              Clear Cache & Refresh
            </button>
          </div>
        </div>
      )}
    </>
  );
}