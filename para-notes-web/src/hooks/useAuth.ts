import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase/client';
import type { User, LoginCredentials, SignupCredentials } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const { user, session, isLoading, error, setUser, setSession, setLoading, setError, clearAuth } = useAuthStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          return;
        }

        if (session?.user) {
          setSession({
            user: session.user as User,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(session.expires_at! * 1000),
          });
          setUser(session.user as User);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setSession({
            user: session.user as User,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(session.expires_at! * 1000),
          });
          setUser(session.user as User);
        } else if (event === 'SIGNED_OUT') {
          clearAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setLoading, setError, clearAuth]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user as User);
        setSession({
          user: data.user as User,
          accessToken: data.session!.access_token,
          refreshToken: data.session!.refresh_token,
          expiresAt: new Date(data.session!.expires_at! * 1000),
        });
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      clearAuth();
      router.push('/login');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };
}
