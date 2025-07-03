import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  User,
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  Clock,
  Activity,
  Bug,
  Zap,
  Home,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Bell,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Development mode configuration
const DEV_MODE = process.env.NODE_ENV === 'development';
const SHOW_DEV_SIDEBAR = DEV_MODE && true; // Toggle this to show/hide sidebar

// Types
interface RouteItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  permissions?: string[];
  shortcut?: string;
}

interface RoleSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  routes: RouteItem[];
}

interface DevMetrics {
  navigationCount: number;
  lastNavigation: string;
  routeLoadTime: number;
  errorCount: number;
}

// Route definitions
const routeDefinitions: RoleSection[] = [
  {
    id: 'admin',
    label: 'Admin Dashboard',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    routes: [
      {
        id: 'admin-dashboard',
        label: 'Dashboard',
        path: '/admin',
        icon: Home,
        description: 'Admin overview and statistics',
        permissions: ['admin'],
        shortcut: 'Alt+A+D'
      },
      {
        id: 'admin-users',
        label: 'User Management',
        path: '/admin/users',
        icon: Users,
        description: 'Manage all system users',
        permissions: ['admin'],
        shortcut: 'Alt+A+U'
      },
      {
        id: 'admin-services',
        label: 'Services',
        path: '/admin/services',
        icon: Settings,
        description: 'Manage salon services',
        permissions: ['admin'],
        shortcut: 'Alt+A+S'
      },
      {
        id: 'admin-appointments',
        label: 'Appointments',
        path: '/admin/appointments',
        icon: Calendar,
        description: 'View and manage appointments',
        permissions: ['admin'],
        shortcut: 'Alt+A+A'
      },
      {
        id: 'admin-staff',
        label: 'Staff Management',
        path: '/admin/staff',
        icon: UserCheck,
        description: 'Manage staff members',
        permissions: ['admin'],
        shortcut: 'Alt+A+T'
      },
      {
        id: 'admin-announcements',
        label: 'Announcements',
        path: '/admin/announcements',
        icon: Bell,
        description: 'Manage system announcements',
        permissions: ['admin'],
        shortcut: 'Alt+A+N'
      },
      {
        id: 'admin-profile',
        label: 'Profile',
        path: '/admin/profile',
        icon: User,
        description: 'Admin profile settings',
        permissions: ['admin'],
        shortcut: 'Alt+A+P'
      }
    ]
  },
  {
    id: 'staff',
    label: 'Staff Portal',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    routes: [
      {
        id: 'staff-dashboard',
        label: 'Dashboard',
        path: '/staff',
        icon: Home,
        description: 'Staff overview and daily tasks',
        permissions: ['staff'],
        shortcut: 'Alt+S+D'
      },
      {
        id: 'staff-schedule',
        label: 'My Schedule',
        path: '/staff/schedule',
        icon: Calendar,
        description: 'View and manage schedule',
        permissions: ['staff'],
        shortcut: 'Alt+S+S'
      },
      {
        id: 'staff-profile',
        label: 'Profile',
        path: '/staff/profile',
        icon: User,
        description: 'Staff profile and settings',
        permissions: ['staff'],
        shortcut: 'Alt+S+P'
      }
    ]
  },
  {
    id: 'client',
    label: 'Client View',
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    routes: [
      {
        id: 'client-dashboard',
        label: 'Dashboard',
        path: '/client/dashboard',
        icon: Home,
        description: 'Client dashboard and overview',
        permissions: ['client'],
        shortcut: 'Alt+C+D'
      },
      {
        id: 'client-appointments',
        label: 'My Appointments',
        path: '/client/appointments',
        icon: Calendar,
        description: 'View and manage appointments',
        permissions: ['client'],
        shortcut: 'Alt+C+A'
      },
      {
        id: 'client-booking',
        label: 'Book Appointment',
        path: '/client/booking',
        icon: Clock,
        description: 'Book new appointment',
        permissions: ['client'],
        shortcut: 'Alt+C+B'
      },
      {
        id: 'client-feedback',
        label: 'Feedback',
        path: '/client/feedback',
        icon: MessageSquare,
        description: 'Leave service feedback',
        permissions: ['client'],
        shortcut: 'Alt+C+F'
      },
      {
        id: 'client-profile',
        label: 'Profile',
        path: '/client/profile',
        icon: User,
        description: 'Client profile and settings',
        permissions: ['client'],
        shortcut: 'Alt+C+P'
      }
    ]
  },
  {
    id: 'public',
    label: 'Public Access',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    routes: [
      {
        id: 'landing',
        label: 'Landing Page',
        path: '/',
        icon: Home,
        description: 'Main landing page',
        shortcut: 'Alt+P+H'
      },
      {
        id: 'services',
        label: 'Services',
        path: '/services',
        icon: Settings,
        description: 'View available services',
        shortcut: 'Alt+P+S'
      },
      {
        id: 'about',
        label: 'About',
        path: '/about',
        icon: Info,
        description: 'About the salon',
        shortcut: 'Alt+P+A'
      },
      {
        id: 'contact',
        label: 'Contact',
        path: '/contact',
        icon: MessageSquare,
        description: 'Contact information',
        shortcut: 'Alt+P+C'
      },
      {
        id: 'login',
        label: 'Login',
        path: '/login',
        icon: LogOut,
        description: 'User login page',
        shortcut: 'Alt+P+L'
      },
      {
        id: 'register',
        label: 'Register',
        path: '/register',
        icon: UserCheck,
        description: 'User registration page',
        shortcut: 'Alt+P+R'
      }
    ]
  }
];

// Mock users for auth bypass
const mockUsers = {
  admin: {
    id: 1,
    full_name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    csrf_token: 'mock-csrf-token'
  },
  staff: {
    id: 2,
    full_name: 'Staff Member',
    email: 'staff@example.com',
    role: 'staff',
    csrf_token: 'mock-csrf-token'
  },
  client: {
    id: 3,
    full_name: 'Client User',
    email: 'client@example.com',
    role: 'client',
    csrf_token: 'mock-csrf-token'
  }
};

const DevSidebar: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('devSidebar_collapsed') === 'true';
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('devSidebar_expanded');
    return new Set(saved ? JSON.parse(saved) : ['admin', 'staff', 'client', 'public']);
  });
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState<DevMetrics>(() => ({
    navigationCount: 0,
    lastNavigation: '',
    routeLoadTime: 0,
    errorCount: 0
  }));

  // Persist state
  useEffect(() => {
    localStorage.setItem('devSidebar_collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('devSidebar_expanded', JSON.stringify([...expandedSections]));
  }, [expandedSections]);

  // Navigation handler with metrics
  const handleNavigation = useCallback((path: string, label: string) => {
    const startTime = performance.now();
    
    navigate(path);
    
    // Update metrics
    setMetrics(prev => ({
      ...prev,
      navigationCount: prev.navigationCount + 1,
      lastNavigation: `${label} (${path})`,
      routeLoadTime: performance.now() - startTime
    }));

    // Log navigation event
    console.log(`[DevSidebar] Navigation: ${label} -> ${path}`);
  }, [navigate]);

  // Auth bypass functionality
  const handleAuthBypass = useCallback((role: keyof typeof mockUsers) => {
    const mockUser = mockUsers[role];
    
    // Store mock user data
    localStorage.setItem('auth_token', mockUser.csrf_token);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    
    // Trigger page reload to update auth context
    window.location.reload();
    
    console.log(`[DevSidebar] Auth bypass: ${role}`, mockUser);
  }, []);

  // Restore authentication
  const handleRestoreAuth = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.reload();
    console.log('[DevSidebar] Authentication restored');
  }, []);

  // Section toggle
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;

      // Find matching shortcut
      for (const section of routeDefinitions) {
        for (const route of section.routes) {
          if (route.shortcut) {
            const keys = route.shortcut.toLowerCase().split('+');
            const expectedKeys = keys.slice(1); // Remove 'Alt'
            
            if (expectedKeys.every(key => {
              switch (key) {
                case 'a': return event.key.toLowerCase() === 'a';
                case 's': return event.key.toLowerCase() === 's';
                case 'c': return event.key.toLowerCase() === 'c';
                case 'p': return event.key.toLowerCase() === 'p';
                case 'd': return event.key.toLowerCase() === 'd';
                case 'u': return event.key.toLowerCase() === 'u';
                case 'b': return event.key.toLowerCase() === 'b';
                case 'f': return event.key.toLowerCase() === 'f';
                case 'n': return event.key.toLowerCase() === 'n';
                case 't': return event.key.toLowerCase() === 't';
                case 'h': return event.key.toLowerCase() === 'h';
                case 'l': return event.key.toLowerCase() === 'l';
                case 'r': return event.key.toLowerCase() === 'r';
                default: return false;
              }
            })) {
              event.preventDefault();
              handleNavigation(route.path, route.label);
              break;
            }
          }
        }
      }

      // Toggle sidebar with Alt+`
      if (event.key === '`') {
        event.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigation]);

  // Memoized current route detection
  const currentRoute = useMemo(() => {
    for (const section of routeDefinitions) {
      for (const route of section.routes) {
        if (route.path === location.pathname) {
          return route;
        }
      }
    }
    return null;
  }, [location.pathname]);

  // Don't render in production or if disabled
  if (!SHOW_DEV_SIDEBAR) return null;

  return (
    <>
      {/* Development Mode Banner */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm font-bold z-50 flex items-center justify-center space-x-2">
        <AlertTriangle className="w-4 h-4" />
        <span>DEVELOPMENT MODE - NOT FOR PRODUCTION</span>
        <AlertTriangle className="w-4 h-4" />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 64 : 280,
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-12 bottom-0 bg-white border-r border-gray-200 shadow-lg z-40 overflow-hidden"
        style={{ zIndex: 1000 }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Dev Tools</span>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Auth Bypass Section */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-200 bg-yellow-50">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-600" />
                Quick Auth
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => handleAuthBypass('admin')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    title="Login as Admin"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleAuthBypass('staff')}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    title="Login as Staff"
                  >
                    Staff
                  </button>
                  <button
                    onClick={() => handleAuthBypass('client')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    title="Login as Client"
                  >
                    Client
                  </button>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={handleRestoreAuth}
                    className="w-full px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
                    title="Logout and restore normal auth"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Restore Auth
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Current User Info */}
          {!isCollapsed && isAuthenticated && (
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto">
            {routeDefinitions.map((section) => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections.has(section.id);

              return (
                <div key={section.id} className="border-b border-gray-100">
                  {/* Section Header */}
                  <button
                    onClick={() => !isCollapsed && toggleSection(section.id)}
                    className={`w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? section.label : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                        <SectionIcon className={`w-4 h-4 ${section.color}`} />
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium text-gray-800">{section.label}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{section.routes.length}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Section Routes */}
                  <AnimatePresence>
                    {(isExpanded || isCollapsed) && (
                      <motion.div
                        initial={!isCollapsed ? { height: 0, opacity: 0 } : false}
                        animate={!isCollapsed ? { height: 'auto', opacity: 1 } : false}
                        exit={!isCollapsed ? { height: 0, opacity: 0 } : false}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {section.routes.map((route) => {
                          const RouteIcon = route.icon;
                          const isActive = currentRoute?.id === route.id;

                          return (
                            <button
                              key={route.id}
                              onClick={() => handleNavigation(route.path, route.label)}
                              className={`w-full p-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors group ${
                                isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                              } ${isCollapsed ? 'justify-center' : 'pl-6'}`}
                              title={isCollapsed ? `${route.label} - ${route.description}` : route.description}
                            >
                              <RouteIcon className={`w-4 h-4 ${
                                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                              }`} />
                              {!isCollapsed && (
                                <div className="flex-1 text-left">
                                  <div className={`text-sm ${
                                    isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
                                  }`}>
                                    {route.label}
                                  </div>
                                  {route.shortcut && (
                                    <div className="text-xs text-gray-400">{route.shortcut}</div>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Footer with Metrics */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Dev Metrics</span>
                </div>
                {showMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {showMetrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-1 text-xs text-gray-500 overflow-hidden"
                  >
                    <div>Navigations: {metrics.navigationCount}</div>
                    <div>Last: {metrics.lastNavigation || 'None'}</div>
                    <div>Load Time: {metrics.routeLoadTime.toFixed(2)}ms</div>
                    <div>Current: {currentRoute?.label || 'Unknown'}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main content offset */}
      <div 
        className="transition-all duration-300"
        style={{ 
          marginLeft: isCollapsed ? 64 : 280,
          marginTop: 48 // Account for dev banner
        }}
      />
    </>
  );
});

DevSidebar.displayName = 'DevSidebar';

export default DevSidebar;