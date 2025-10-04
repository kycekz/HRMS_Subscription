/*
  # Create Multi-Tenant and Mess Authentication Tables

  ## Overview
  This migration creates tables for multi-tenant support and custom authentication
  using mess_tbl for user credentials instead of Supabase Auth.

  ## 1. New Tables
  
  ### `mtent_tbl`
  - `mtent_tentid` (uuid, primary key) - Unique tenant identifier
  - `mtent_name` (text) - Tenant/Company name
  - `mtent_is_active` (boolean) - Whether tenant is active
  - `mtent_created_at` (timestamptz) - Record creation timestamp
  - `mtent_updated_at` (timestamptz) - Last update timestamp

  ### `mess_tbl`
  - `mess_id` (uuid, primary key) - Unique authentication record identifier
  - `tentid` (uuid, references mtent_tbl) - Tenant this user belongs to
  - `mess_empid` (uuid, references employees) - Link to employee record
  - `mess_email` (text) - User email for login
  - `mess_username` (text) - Username for login
  - `mess_password_hash` (text) - Password hash (bcrypt)
  - `mess_role` (text) - User role (EMPLOYEE, MANAGER, ADMIN, OWNER)
  - `mess_is_active` (boolean) - Whether account is active
  - `mess_last_login` (timestamptz) - Last login timestamp
  - `mess_login_attempts` (integer) - Failed login attempt counter
  - `mess_locked_until` (timestamptz) - Account lock timestamp
  - `mess_created_at` (timestamptz) - Record creation timestamp
  - `mess_updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  
  - RLS enabled on both tables
  - Users can only view their own mess_tbl record
  - Unique constraints on email and username per tenant

  ## 3. Indexes
  
  - Unique index on (tentid, mess_email)
  - Unique index on (tentid, mess_username)
  - Index on mess_empid for employee lookups

  ## 4. Important Notes
  
  - mess_tbl replaces Supabase Auth for authentication
  - Password should be bcrypt hashed before storage
  - Tenant isolation enforced via tentid
*/

-- Create mtent_tbl (Multi-Tenant table)
CREATE TABLE IF NOT EXISTS mtent_tbl (
  mtent_tentid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mtent_name TEXT NOT NULL,
  mtent_is_active BOOLEAN DEFAULT TRUE,
  mtent_created_at TIMESTAMPTZ DEFAULT now(),
  mtent_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create mess_tbl (Authentication table)
CREATE TABLE IF NOT EXISTS mess_tbl (
  mess_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tentid UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
  mess_empid UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  mess_email TEXT NOT NULL,
  mess_username TEXT NOT NULL,
  mess_password_hash TEXT NOT NULL,
  
  mess_role TEXT CHECK (mess_role IN ('EMPLOYEE','MANAGER','ADMIN','OWNER')) DEFAULT 'EMPLOYEE',
  mess_is_active BOOLEAN DEFAULT TRUE,
  
  mess_last_login TIMESTAMPTZ,
  mess_login_attempts INT DEFAULT 0,
  mess_locked_until TIMESTAMPTZ,
  
  mess_created_at TIMESTAMPTZ DEFAULT now(),
  mess_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mess_empid ON mess_tbl(mess_empid);
CREATE INDEX IF NOT EXISTS idx_mess_tentid ON mess_tbl(tentid);

-- One unique account per email per tenant
CREATE UNIQUE INDEX IF NOT EXISTS mess_tenant_email_unique 
ON mess_tbl (tentid, mess_email);

-- Unique username per tenant
CREATE UNIQUE INDEX IF NOT EXISTS mess_tenant_username_unique
ON mess_tbl (tentid, mess_username);

-- Enable Row Level Security
ALTER TABLE mtent_tbl ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_tbl ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mtent_tbl
CREATE POLICY "Users can view their tenant"
  ON mtent_tbl FOR SELECT
  TO authenticated
  USING (
    mtent_tentid IN (
      SELECT tentid FROM mess_tbl WHERE mess_empid IN (
        SELECT id FROM employees WHERE auth_user_id = auth.uid()
      )
    )
  );

-- RLS Policies for mess_tbl
CREATE POLICY "Users can view own mess record"
  ON mess_tbl FOR SELECT
  TO authenticated
  USING (
    mess_empid IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own mess record"
  ON mess_tbl FOR UPDATE
  TO authenticated
  USING (
    mess_empid IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    mess_empid IN (
      SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )
  );

-- Insert default tenant
INSERT INTO mtent_tbl (mtent_tentid, mtent_name)
VALUES ('d75079e2-3922-4b18-8857-7cd333a82687', 'Default Company')
ON CONFLICT DO NOTHING;

-- Insert demo employee if not exists
INSERT INTO employees (id, email, full_name, employee_code, department, position)
VALUES (
  '18710c44-4bba-4fc1-a657-066e91c89c7a',
  'lau@ace.com',
  'Lau Employee',
  'EMP001',
  'General',
  'Employee'
)
ON CONFLICT DO NOTHING;

-- Insert demo mess_tbl record
INSERT INTO mess_tbl (tentid, mess_empid, mess_email, mess_username, mess_password_hash, mess_role)
VALUES (
  'd75079e2-3922-4b18-8857-7cd333a82687', 
  '18710c44-4bba-4fc1-a657-066e91c89c7a',
  'lau@ace.com',
  'lau',
  '12345678',
  'EMPLOYEE'
)
ON CONFLICT DO NOTHING;
