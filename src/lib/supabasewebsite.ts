import { createWebsiteClient } from './supabaseManager';

export const supabasewebsite = createWebsiteClient();

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
