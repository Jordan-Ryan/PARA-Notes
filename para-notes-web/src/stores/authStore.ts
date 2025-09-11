import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthSession } from '@/types/auth';

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, error: null }),
      setSession: (session) => set({ session, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, session: null, error: null }),
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
