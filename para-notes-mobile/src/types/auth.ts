export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthError {
  message: string;
  code: string;
  details?: any;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
}

export interface AuthConfig {
  supabase_url: string;
  supabase_anon_key: string;
  redirect_url?: string;
  auto_refresh?: boolean;
  persist_session?: boolean;
}
