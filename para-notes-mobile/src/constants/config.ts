import Constants from 'expo-constants';

export const config = {
  // App configuration
  app: {
    name: 'PARA Notes',
    version: Constants.expoConfig?.version || '1.0.0',
    buildNumber: Constants.expoConfig?.ios?.buildNumber || '1',
    environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  },
  
  // API configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.paranotes.com',
    timeout: 30000,
    retryAttempts: 3,
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // Deep linking configuration
  linking: {
    scheme: process.env.EXPO_PUBLIC_SCHEME || 'para-notes',
    prefixes: [
      'para-notes://',
      'https://paranotes.com',
      'https://app.paranotes.com',
    ],
  },
  
  // Encryption configuration
  encryption: {
    key: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || '',
    algorithm: 'AES-256-GCM',
  },
  
  // Sync configuration
  sync: {
    interval: parseInt(process.env.EXPO_PUBLIC_SYNC_INTERVAL || '300000', 10),
    batchSize: 50,
    maxRetries: 3,
    offlineMode: process.env.EXPO_PUBLIC_OFFLINE_MODE === 'true',
  },
  
  // Storage configuration
  storage: {
    maxSize: 100 * 1024 * 1024, // 100MB
    compressionEnabled: true,
    encryptionEnabled: true,
  },
  
  // UI configuration
  ui: {
    animationDuration: 300,
    debounceDelay: 500,
    pullToRefreshThreshold: 60,
    infiniteScrollThreshold: 20,
  },
  
  // Feature flags
  features: {
    offlineMode: true,
    encryption: true,
    sync: true,
    analytics: false,
    crashReporting: false,
    deepLinking: true,
    pushNotifications: false,
  },
  
  // Development configuration
  development: {
    enableLogging: __DEV__,
    enableReduxDevTools: __DEV__,
    enableFlipper: __DEV__,
  },
};

export default config;
