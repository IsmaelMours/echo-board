// Route configuration for EchoBoard
export const ROUTES = {
  // Public routes - accessible without authentication
  AUTH: '/auth',
  
  // Protected routes - require authentication
  HOME: '/',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  
  // Fallback route
  NOT_FOUND: '*'
} as const;

// Route access levels
export const ROUTE_ACCESS = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  ADMIN_ONLY: 'admin_only'
} as const;

// Route definitions with access levels
export const ROUTE_DEFINITIONS = {
  [ROUTES.AUTH]: {
    access: ROUTE_ACCESS.PUBLIC,
    description: 'Authentication page (login/signup)',
    redirectIfAuthenticated: true
  },
  [ROUTES.HOME]: {
    access: ROUTE_ACCESS.PROTECTED,
    description: 'Home page - redirects to appropriate dashboard based on role',
    redirectIfAuthenticated: false
  },
  [ROUTES.DASHBOARD]: {
    access: ROUTE_ACCESS.PROTECTED,
    requiredRole: 'user',
    description: 'User dashboard',
    redirectIfAuthenticated: false
  },
  [ROUTES.ADMIN]: {
    access: ROUTE_ACCESS.ADMIN_ONLY,
    requiredRole: 'admin',
    description: 'Admin dashboard',
    redirectIfAuthenticated: false
  }
} as const;
