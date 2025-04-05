
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get Supabase credentials from environment variables or use provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rpuwtakmudzftqqnxmly.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdXd0YWttdWR6ZnRxcW54bWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjkzMjEsImV4cCI6MjA1OTQwNTMyMX0.F64kmLXe0YDi5ok7t6GbAgk7wjXehM3ZgwNFsG2itEU';

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a helper to check if we have valid Supabase credentials
export const hasValidSupabaseCredentials = () => {
  return (
    supabaseUrl !== 'https://placeholder-project.supabase.co' &&
    supabaseAnonKey !== 'placeholder-anon-key'
  );
};
