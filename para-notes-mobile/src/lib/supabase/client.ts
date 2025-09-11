import { createClient } from '@supabase/supabase-js';
import { config } from '@/constants/config';
import type { Database } from '@/types';

export const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey);


