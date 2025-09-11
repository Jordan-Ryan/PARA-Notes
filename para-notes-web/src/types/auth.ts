export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultNoteCategory: 'projects' | 'areas' | 'resources' | 'archive';
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  encryptionEnabled: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface AuthError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  fullName?: string;
  acceptTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface ProfileUpdate {
  fullName?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
}
