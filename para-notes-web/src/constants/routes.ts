export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard routes
  DASHBOARD: '/',
  NOTES: '/notes',
  PROJECTS: '/projects',
  AREAS: '/areas',
  RESOURCES: '/resources',
  ARCHIVE: '/archive',
  
  // Settings routes
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  PREFERENCES: '/settings/preferences',
  SECURITY: '/settings/security',
  
  // API routes
  API: {
    AUTH: '/api/auth',
    NOTES: '/api/notes',
    PARA: '/api/para',
    SYNC: '/api/sync',
    WEBHOOKS: '/api/webhooks',
  },
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.NOTES,
  ROUTES.PROJECTS,
  ROUTES.AREAS,
  ROUTES.RESOURCES,
  ROUTES.ARCHIVE,
  ROUTES.SETTINGS,
  ROUTES.PROFILE,
  ROUTES.PREFERENCES,
  ROUTES.SECURITY,
] as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;
