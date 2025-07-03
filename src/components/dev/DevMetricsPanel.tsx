import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Clock,
  TrendingUp,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDevNavigation } from '../../hooks/useDevNavigation';

interface DevMetricsPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DevMetricsPanel: React.FC<DevMetricsPanelProps> = ({ isVisible, onToggle }) => {
  const { metrics, clearMetrics, getRoutePerformance } = useDevNavigation();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Get unique routes from history
  const uniqueRoutes = Array.from(
    new Set(metrics.routeHistory.map(entry => entry.path))
  ).map(path => ({
    path,
    performance: getRoutePerformance(path)
  })).filter(route => route.performance !== null);

  // Export metrics data
  const exportMetrics = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dev-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Show Dev Metrics"
      >
        <BarChart3 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Dev Metrics</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportMetrics}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Export metrics"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={clearMetrics}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Clear metrics"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Hide metrics"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-80">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Total Nav</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {metrics.totalNavigations}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Avg Load</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {metrics.averageLoadTime.toFixed(1)}ms
            </div>
          </div>
        </div>

        {/* Last Navigation */}
        {metrics.lastNavigation && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Last Navigation</h4>
            <div className="text-xs text-gray-600">
              <div>{metrics.lastNavigation.from} → {metrics.lastNavigation.to}</div>
              <div className="flex justify-between mt-1">
                <span>{new Date(metrics.lastNavigation.timestamp).toLocaleTimeString()}</span>
                <span>{metrics.lastNavigation.loadTime.toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Route Performance */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Route Performance</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueRoutes.map(({ path, performance }) => (
              <div
                key={path}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedRoute(selectedRoute === path ? null : path)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-700 truncate">{path}</span>
                  <span className="text-xs text-gray-500">{performance?.visits} visits</span>
                </div>
                
                <AnimatePresence>
                  {selectedRoute === path && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 text-xs text-gray-600 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>Avg: {performance?.averageLoadTime.toFixed(2)}ms</div>
                        <div>Min: {performance?.minLoadTime.toFixed(2)}ms</div>
                        <div>Max: {performance?.maxLoadTime.toFixed(2)}ms</div>
                        <div>Last: {new Date(performance?.lastVisit || 0).toLocaleTimeString()}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevMetricsPanel;