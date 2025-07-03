import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationMetrics {
  totalNavigations: number;
  averageLoadTime: number;
  lastNavigation: {
    from: string;
    to: string;
    timestamp: number;
    loadTime: number;
  } | null;
  routeHistory: Array<{
    path: string;
    timestamp: number;
    loadTime: number;
  }>;
}

export const useDevNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [metrics, setMetrics] = useState<NavigationMetrics>(() => {
    const saved = localStorage.getItem('dev_navigation_metrics');
    return saved ? JSON.parse(saved) : {
      totalNavigations: 0,
      averageLoadTime: 0,
      lastNavigation: null,
      routeHistory: []
    };
  });

  // Enhanced navigation with metrics tracking
  const navigateWithMetrics = useCallback((path: string, options?: any) => {
    const startTime = performance.now();
    const fromPath = location.pathname;
    
    navigate(path, options);
    
    // Track navigation metrics
    const loadTime = performance.now() - startTime;
    
    setMetrics(prev => {
      const newMetrics = {
        totalNavigations: prev.totalNavigations + 1,
        averageLoadTime: (prev.averageLoadTime * prev.totalNavigations + loadTime) / (prev.totalNavigations + 1),
        lastNavigation: {
          from: fromPath,
          to: path,
          timestamp: Date.now(),
          loadTime
        },
        routeHistory: [
          ...prev.routeHistory.slice(-49), // Keep last 50 entries
          {
            path,
            timestamp: Date.now(),
            loadTime
          }
        ]
      };
      
      // Persist metrics
      localStorage.setItem('dev_navigation_metrics', JSON.stringify(newMetrics));
      
      return newMetrics;
    });
    
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DevNavigation] ${fromPath} → ${path}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
    }
  }, [navigate, location.pathname]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    const emptyMetrics = {
      totalNavigations: 0,
      averageLoadTime: 0,
      lastNavigation: null,
      routeHistory: []
    };
    
    setMetrics(emptyMetrics);
    localStorage.removeItem('dev_navigation_metrics');
  }, []);

  // Get route performance data
  const getRoutePerformance = useCallback((path: string) => {
    const routeEntries = metrics.routeHistory.filter(entry => entry.path === path);
    
    if (routeEntries.length === 0) return null;
    
    const totalTime = routeEntries.reduce((sum, entry) => sum + entry.loadTime, 0);
    const avgTime = totalTime / routeEntries.length;
    const minTime = Math.min(...routeEntries.map(entry => entry.loadTime));
    const maxTime = Math.max(...routeEntries.map(entry => entry.loadTime));
    
    return {
      visits: routeEntries.length,
      averageLoadTime: avgTime,
      minLoadTime: minTime,
      maxLoadTime: maxTime,
      lastVisit: Math.max(...routeEntries.map(entry => entry.timestamp))
    };
  }, [metrics.routeHistory]);

  return {
    metrics,
    navigateWithMetrics,
    clearMetrics,
    getRoutePerformance,
    currentPath: location.pathname
  };
};