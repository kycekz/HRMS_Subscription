import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Employee = {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  employee_code: string;
  department: string;
  position: string;
  created_at: string;
  updated_at: string;
};

export type ClockEvent = {
  id: string;
  employee_id: string;
  event_type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_IN' | 'BREAK_OUT';
  event_time: string;
  source: 'MOBILE_WEB' | 'DESKTOP_WEB' | 'MOBILE_APP';
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  device_info: string | null;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  employee_id: string;
  attendance_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  total_break_minutes: number;
  total_work_minutes: number;
  status: 'ON_TIME' | 'LATE' | 'OVERTIME' | 'ABSENT' | 'INCOMPLETE';
  created_at: string;
  updated_at: string;
};
