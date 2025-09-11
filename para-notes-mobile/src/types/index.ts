// Re-export all types for easy importing
export * from './auth';
export * from './database';
export * from './navigation';
export * from './notes';
export * from './para';

// Common utility types
export interface ApiResponse<T = any> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  error: string | null;
  success: boolean;
}

export interface SyncStatus {
  is_syncing: boolean;
  last_sync: string | null;
  pending_changes: number;
  error: string | null;
}

export interface AppConfig {
  supabase_url: string;
  supabase_anon_key: string;
  encryption_key: string;
  sync_interval: number;
  offline_mode: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}
