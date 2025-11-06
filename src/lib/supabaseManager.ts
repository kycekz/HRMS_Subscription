import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global flags to prevent multiple instances
declare global {
  var __SUPABASE_SAAS_CLIENT__: SupabaseClient | undefined;
  var __SUPABASE_WEBSITE_CLIENT__: SupabaseClient | undefined;
}

export const createSaasClient = (): SupabaseClient => {
  if (globalThis.__SUPABASE_SAAS_CLIENT__) {
    return globalThis.__SUPABASE_SAAS_CLIENT__;
  }

  const client = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: 'hrms-saas-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'hrms-saas-client'
        }
      }
    }
  );

  globalThis.__SUPABASE_SAAS_CLIENT__ = client;
  return client;
};

export const createWebsiteClient = (): SupabaseClient => {
  if (globalThis.__SUPABASE_WEBSITE_CLIENT__) {
    return globalThis.__SUPABASE_WEBSITE_CLIENT__;
  }

  const client = createClient(
    import.meta.env.VITE_SUPABASE_WEBSITE_URL,
    import.meta.env.VITE_SUPABASE_WEBSITE_ANON_KEY
  );

  // Disable auth completely to prevent GoTrueClient
  (client as any).auth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: null } })
  };

  globalThis.__SUPABASE_WEBSITE_CLIENT__ = client;
  return client;
};