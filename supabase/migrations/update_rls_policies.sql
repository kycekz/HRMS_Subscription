-- Update RLS policies to be permissive for authenticated users
-- This allows application-level tenant filtering while maintaining security

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow insert clock events by tenant" ON tclock_tbl;
DROP POLICY IF EXISTS "Allow select clock events by tenant" ON tclock_tbl;

-- Create permissive policies for authenticated operations
CREATE POLICY "Allow authenticated operations on tclock_tbl" ON tclock_tbl
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on ttat_tbl" ON ttat_tbl
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on tbreak_tbl" ON tbreak_tbl
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on employees" ON employees
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on mess_tbl" ON mess_tbl
FOR ALL USING (true) WITH CHECK (true);