'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/auth';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const { setUser, setSession, clearAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (session?.user) {
          setUser(session.user as unknown as User);
          setSession({
            user: session.user as unknown as User,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(session.expires_at! * 1000),
          });
        }
      } catch (error) {
        console.warn('Failed to initialize auth:', error);
        // Continue without authentication if Supabase is unavailable
      }
    };

    init();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user as unknown as User);
          setSession({
            user: session.user as unknown as User,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(session.expires_at! * 1000),
          });
        } else {
          clearAuth();
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } catch (error) {
      console.warn('Failed to set up auth state change listener:', error);
      return () => {
        isMounted = false;
      };
    }
  }, [setUser, setSession, clearAuth]);

  return (
    <>
      {children}
    </>
  );
}


