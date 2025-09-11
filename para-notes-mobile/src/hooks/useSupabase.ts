import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { useMemo } from 'react';
import { config } from '@/constants/config';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export function useSupabase() {
  const supabase = useMemo(() =>
    createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }), []);

  return supabase;
}

import { createClient } from '@supabase/supabase-js';
import { config } from '@/constants/config';
import { Database } from '@/types';

export const useSupabase = () => {
  const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey);

  return {
    supabase,
    // Convenience methods
    from: (table: keyof Database['public']['Tables']) => supabase.from(table),
    auth: supabase.auth,
    storage: supabase.storage,
    rpc: supabase.rpc,
  };
};
