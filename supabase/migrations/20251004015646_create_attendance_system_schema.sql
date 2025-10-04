/*
  # HRMS Attendance System Schema

  ## Overview
  This migration creates a complete attendance tracking system with authentication support.
  It includes tables for employees, clock events, and comprehensive security policies.

  ## 1. New Tables
  
  ### `employees`
  - `id` (uuid, primary key) - Unique employee identifier
  - `auth_user_id` (uuid, references auth.users) - Links to Supabase auth
  - `email` (text, unique) - Employee email address
  - `full_name` (text) - Employee full name
  - `employee_code` (text, unique) - Company employee code
  - `department` (text) - Department name
  - `position` (text) - Job position
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `clock_events`
  - `id` (uuid, primary key) - Unique event identifier
  - `employee_id` (uuid, references employees) - Employee who created the event
  - `event_type` (text) - CLOCK_IN, CLOCK_OUT, BREAK_IN, BREAK_OUT
  - `event_time` (timestamptz) - When the event occurred
  - `source` (text) - MOBILE_WEB, DESKTOP_WEB, MOBILE_APP
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `photo_url` (text, nullable) - URL to captured photo
  - `device_info` (text) - User agent or device information
  - `created_at` (timestamptz) - Record creation timestamp

  ### `attendance_records`
  - `id` (uuid, primary key) - Unique record identifier
  - `employee_id` (uuid, references employees) - Employee for this record
  - `attendance_date` (date) - Date of attendance
  - `clock_in_time` (timestamptz) - Clock in timestamp
  - `clock_out_time` (timestamptz, nullable) - Clock out timestamp
  - `total_break_minutes` (integer) - Total break time in minutes
  - `total_work_minutes` (integer) - Total work time in minutes
  - `status` (text) - ON_TIME, LATE, OVERTIME, ABSENT, INCOMPLETE
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  
  All tables have Row Level Security (RLS) enabled with restrictive policies:
  
  ### employees table policies:
  - Authenticated users can view their own employee record
  - Authenticated users can update their own profile information
  
  ### clock_events table policies:
  - Employees can view their own clock events
  - Employees can create new clock events for themselves
  
  ### attendance_records table policies:
  - Employees can view their own attendance records
  - System can create/update records via service role

  ## 3. Indexes
  
  Performance indexes added for:
  - Employee lookups by auth_user_id
  - Clock events by employee and date
  - Attendance records by employee and date

  ## 4. Important Notes
  
  - All timestamps use timestamptz for proper timezone handling
  - GPS coordinates use numeric type for precision
  - Status values are enforced via CHECK constraints
  - Foreign key constraints ensure data integrity
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  employee_code text UNIQUE NOT NULL,
  department text DEFAULT 'General',
  position text DEFAULT 'Employee',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clock_events table
CREATE TABLE IF NOT EXISTS clock_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('CLOCK_IN', 'CLOCK_OUT', 'BREAK_IN', 'BREAK_OUT')),
  event_time timestamptz NOT NULL DEFAULT now(),
  source text DEFAULT 'MOBILE_WEB' CHECK (source IN ('MOBILE_WEB', 'DESKTOP_WEB', 'MOBILE_APP')),
  latitude numeric,
  longitude numeric,
  photo_url text,
  device_info text,
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  attendance_date date NOT NULL,
  clock_in_time timestamptz,
  clock_out_time timestamptz,
  total_break_minutes integer DEFAULT 0,
  total_work_minutes integer DEFAULT 0,
  status text DEFAULT 'INCOMPLETE' CHECK (status IN ('ON_TIME', 'LATE', 'OVERTIME', 'ABSENT', 'INCOMPLETE')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, attendance_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_auth_user_id ON employees(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_clock_events_employee_id ON clock_events(employee_id);
CREATE INDEX IF NOT EXISTS idx_clock_events_event_time ON clock_events(event_time);
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee_date ON attendance_records(employee_id, attendance_date);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clock_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Users can view own employee record"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own employee record"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for clock_events table
CREATE POLICY "Employees can view own clock events"
  ON clock_events FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can create own clock events"
  ON clock_events FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for attendance_records table
CREATE POLICY "Employees can view own attendance records"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  );

-- Insert demo employee (linked to demo@company.com auth user)
-- Note: This will be created via the application after auth user is created

CREATE TABLE mess_tbl (
    mess_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tentid UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE, -- Tenant
    mess_empid UUID REFERENCES employees(id) ON DELETE SET NULL, -- Employee link

    -- Login credentials
    mess_email TEXT NOT NULL,
    mess_username TEXT NOT NULL,
    mess_password_hash TEXT NOT NULL, -- bcrypt hash

    -- Access control
    mess_role TEXT CHECK (mess_role IN ('EMPLOYEE','MANAGER','ADMIN','OWNER')) DEFAULT 'EMPLOYEE',
    mess_is_active BOOLEAN DEFAULT TRUE,

    -- Login tracking
    mess_last_login TIMESTAMPTZ,
    mess_login_attempts INT DEFAULT 0,
    mess_locked_until TIMESTAMPTZ, -- optional: lock account after failed attempts

    -- Metadata
    mess_created_at TIMESTAMPTZ DEFAULT now(),
    mess_updated_at TIMESTAMPTZ DEFAULT now()
);

-- One unique account per email per tenant
CREATE UNIQUE INDEX mess_tenant_email_unique 
ON mess_tbl (tentid, mess_email);

-- Optional: unique username per tenant
CREATE UNIQUE INDEX mess_tenant_username_unique
ON mess_tbl (tentid, mess_username);

INSERT INTO mess_tbl (tentid, mess_empid, mess_email, mess_username, mess_password_hash, mess_role)
VALUES (
  'd75079e2-3922-4b18-8857-7cd333a82687', 
  '18710c44-4bba-4fc1-a657-066e91c89c7a',
  'lau@ace.com',
  'lau',
  '12345678', -- bcrypt hash
  'EMPLOYEE'
);
