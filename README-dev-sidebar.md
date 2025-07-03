# Development Sidebar Navigation Component

A comprehensive React development tool that provides enhanced navigation, authentication bypass, and debugging utilities for development environments.

## Features

### 🚀 Core Development Features
- **DEV_MODE Toggle**: Easily enable/disable development features
- **Development Banner**: Prominent warning banner for development mode
- **Authentication Bypass**: One-click login as different user roles
- **Quick Auth Restore**: Reset authentication state for testing

### 🎯 Navigation & UI
- **Collapsible Sidebar**: 280px expanded, 64px collapsed
- **Role-based Sections**: Admin, Staff, Client, and Public access areas
- **Visual Indicators**: Active routes, hover states, and section colors
- **Responsive Design**: Mobile-first approach with proper breakpoints

### ⌨️ Keyboard Shortcuts
- `Alt + ` ` `: Toggle sidebar
- `Alt + A + D`: Admin Dashboard
- `Alt + S + S`: Staff Schedule
- `Alt + C + B`: Client Booking
- And many more...

### 📊 Development Utilities
- **Navigation Metrics**: Track route performance and usage
- **Route Debugging**: Detailed logging and performance data
- **Breadcrumb Tracking**: Navigation history and patterns
- **Error Monitoring**: Track navigation errors and issues

## Installation

1. Copy the component files to your project:
```bash
src/components/dev/
├── DevSidebar.tsx
├── DevMetricsPanel.tsx
├── index.ts
└── DevSidebar.test.tsx

src/hooks/
└── useDevNavigation.ts

src/styles/
└── dev-sidebar.css
```

2. Install required dependencies:
```bash
npm install framer-motion lucide-react
```

3. Import and use in your App component:
```tsx
import { DevSidebar } from './components/dev'
import DevMetricsPanel from './components/dev/DevMetricsPanel'

function App() {
  const [showDevMetrics, setShowDevMetrics] = useState(false)

  return (
    <div>
      <DevSidebar />
      <DevMetricsPanel 
        isVisible={showDevMetrics}
        onToggle={() => setShowDevMetrics(!showDevMetrics)}
      />
      {/* Your app content */}
    </div>
  )
}
```

## Configuration

### Environment Variables
```env
NODE_ENV=development  # Required for sidebar to show
```

### Toggle Development Features
```tsx
// In src/components/dev/DevSidebar.tsx
const DEV_MODE = process.env.NODE_ENV === 'development';
const SHOW_DEV_SIDEBAR = DEV_MODE && true; // Change to false to disable
```

### Customize Routes
Edit the `routeDefinitions` array in `DevSidebar.tsx`:

```tsx
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
      // Add more routes...
    ]
  },
  // Add more sections...
]
```

## API Reference

### DevSidebar Props
The DevSidebar component doesn't accept props - it's configured through constants and localStorage.

### useDevNavigation Hook
```tsx
const {
  metrics,              // Navigation metrics object
  navigateWithMetrics,  // Enhanced navigation function
  clearMetrics,         // Clear all metrics
  getRoutePerformance,  // Get performance data for specific route
  currentPath          // Current pathname
} = useDevNavigation()
```

### DevMetricsPanel Props
```tsx
interface DevMetricsPanelProps {
  isVisible: boolean;    // Show/hide the metrics panel
  onToggle: () => void;  // Toggle visibility callback
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + ` ` | Toggle sidebar |
| `Alt + A + D` | Admin Dashboard |
| `Alt + A + U` | User Management |
| `Alt + A + S` | Admin Services |
| `Alt + A + A` | Admin Appointments |
| `Alt + S + D` | Staff Dashboard |
| `Alt + S + S` | Staff Schedule |
| `Alt + C + D` | Client Dashboard |
| `Alt + C + B` | Client Booking |
| `Alt + P + H` | Public Home |

## Authentication Bypass

The sidebar includes quick authentication buttons for testing:

- **Admin**: Full system access
- **Staff**: Staff portal access
- **Client**: Client dashboard access
- **Restore Auth**: Clear authentication state

Mock user data is automatically stored in localStorage and triggers a page reload to update the auth context.

## Performance Monitoring

The component tracks:
- Total navigation count
- Average route load time
- Navigation history (last 50 entries)
- Route-specific performance metrics
- Error tracking and logging

## Accessibility

- Full ARIA label support
- Keyboard navigation
- High contrast mode support
- Reduced motion support
- Screen reader compatibility

## Testing

Run the test suite:
```bash
npm test DevSidebar.test.tsx
```

The component includes comprehensive tests for:
- Rendering in different environments
- State persistence
- Navigation functionality
- Keyboard shortcuts
- Authentication bypass
- Metrics tracking

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

⚠️ **Important**: This component is for development only and should never be included in production builds. The authentication bypass feature could pose security risks if accidentally deployed.

The component automatically checks `NODE_ENV` and will not render in production environments.

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different screen sizes

## License

This component is part of your project and follows the same license terms.