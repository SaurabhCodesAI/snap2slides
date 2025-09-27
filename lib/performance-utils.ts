/**
 * Performance-optimized utility functions for Snap2Slides
 */

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Throttle function for limiting function calls
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Optimized file size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Optimized file type detector
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'IMG';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PPT';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'DOC';
  if (mimeType.startsWith('text/')) return 'TXT';
  return 'FILE';
}

// Memoization helper for expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

// Performance monitoring helper
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  
  static start(label: string): number {
    return performance.now();
  }
  
  static end(label: string, startTime: number): number {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    
    this.measurements.get(label)!.push(duration);
    
    // Keep only last 10 measurements for memory efficiency
    if (this.measurements.get(label)!.length > 10) {
      this.measurements.get(label)!.shift();
    }
    
    return duration;
  }
  
  static getAverage(label: string): number {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) return 0;
    
    return measurements.reduce((a, b) => a + b, 0) / measurements.length;
  }
  
  static getAllMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    this.measurements.forEach((measurements, label) => {
      metrics[label] = measurements.reduce((a: number, b: number) => a + b, 0) / measurements.length;
    });
    
    return metrics;
  }
}

// Async retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Safe JSON parse with fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Optimized deep clone for objects
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

// Browser feature detection
export const browserFeatures = {
  supportsWebP: (() => {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  })(),
  
  supportsIntersectionObserver: (() => {
    return typeof IntersectionObserver !== 'undefined';
  })(),
  
  supportsResizeObserver: (() => {
    return typeof ResizeObserver !== 'undefined';
  })(),
  
  isTouchDevice: (() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
  })(),
  
  isIOSSafari: (() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  })()
};

// Memory management helper
export class MemoryManager {
  private static cleanupTasks: (() => void)[] = [];
  
  static addCleanupTask(task: () => void): void {
    this.cleanupTasks.push(task);
  }
  
  static cleanup(): void {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
    this.cleanupTasks = [];
  }
  
  static getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }
}

// Event listener optimization
export class OptimizedEventListener {
  private static listeners: Map<string, Set<EventListener>> = new Map();
  
  static add(
    element: EventTarget,
    event: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    const key = `${element.constructor.name}-${event}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(listener);
    element.addEventListener(event, listener, options);
  }
  
  static remove(element: EventTarget, event: string, listener: EventListener): void {
    const key = `${element.constructor.name}-${event}`;
    
    if (this.listeners.has(key)) {
      this.listeners.get(key)!.delete(listener);
    }
    
    element.removeEventListener(event, listener);
  }
  
  static removeAll(): void {
    this.listeners.clear();
  }
}