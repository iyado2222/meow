export { default as DevSidebar } from './DevSidebar';

// Development utilities
export const DEV_CONFIG = {
  SHOW_SIDEBAR: process.env.NODE_ENV === 'development',
  ENABLE_AUTH_BYPASS: process.env.NODE_ENV === 'development',
  ENABLE_METRICS: process.env.NODE_ENV === 'development',
  LOG_NAVIGATION: process.env.NODE_ENV === 'development',
};

// Development logger
export const devLog = {
  navigation: (from: string, to: string) => {
    if (DEV_CONFIG.LOG_NAVIGATION) {
      console.log(`[DevNav] ${from} → ${to}`, {
        timestamp: new Date().toISOString(),
        performance: performance.now()
      });
    }
  },
  
  auth: (action: string, user?: any) => {
    if (DEV_CONFIG.ENABLE_AUTH_BYPASS) {
      console.log(`[DevAuth] ${action}`, user || '');
    }
  },
  
  metrics: (data: any) => {
    if (DEV_CONFIG.ENABLE_METRICS) {
      console.log('[DevMetrics]', data);
    }
  }
};