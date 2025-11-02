import { createClient } from '@supabase/supabase-js';

const supabasewebsiteUrl = import.meta.env.VITE_SUPABASE_WEBSITE_URL;
const supabasewebsiteAnonKey = import.meta.env.VITE_SUPABASE_WEBSITE_ANON_KEY;

export const supabasewebsite = createClient(supabasewebsiteUrl, supabasewebsiteAnonKey);

export type Message = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  job_title: string;
  company_name: string;
  message: string;
  created_at: string;
};
