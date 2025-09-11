export const APP_CONFIG = {
  name: 'PARA Notes',
  description: 'A note-taking app organized around the PARA method',
  version: '1.0.0',
  author: 'Your Name',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

export const STORAGE_KEYS = {
  AUTH_STORE: 'auth-store',
  NOTES_STORE: 'notes-store',
  PARA_STORE: 'para-store',
  SYNC_STORE: 'sync-store',
  USER_PREFERENCES: 'user-preferences',
  ENCRYPTION_KEY: 'encryption-key',
  OFFLINE_QUEUE: 'offline-queue',
} as const;

export const SYNC_CONFIG = {
  autoSyncInterval: 30000, // 30 seconds
  maxRetryAttempts: 3,
  retryDelay: 5000, // 5 seconds
  batchSize: 50,
  conflictResolutionTimeout: 300000, // 5 minutes
} as const;

export const ENCRYPTION_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  tagLength: 16,
} as const;

export const UI_CONFIG = {
  animations: {
    duration: 200,
    easing: 'ease-in-out',
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  search: {
    debounceDelay: 300,
    minQueryLength: 2,
    maxResults: 50,
  },
  editor: {
    autoSaveDelay: 2000, // 2 seconds
    maxUndoLevels: 50,
  },
} as const;

export const VALIDATION_CONFIG = {
  maxTitleLength: 200,
  maxDescriptionLength: 1000,
  maxContentLength: 100000,
  maxTagsPerItem: 20,
  maxTagLength: 50,
} as const;
