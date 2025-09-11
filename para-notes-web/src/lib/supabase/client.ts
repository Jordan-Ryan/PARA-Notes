import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export const createClient = () => {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set. Using placeholder values.');
    // Return a mock client for development
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder_anon_key'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

export const supabase = createClient();
