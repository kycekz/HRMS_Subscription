-- Add tentid column to leave management tables for tenant isolation

-- Add tentid to leave applications table
ALTER TABLE TLEA_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Add tentid to leave types table  
ALTER TABLE MLET_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Add tentid to leave balances table
ALTER TABLE TELB_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Add tentid to leave policy groups table
ALTER TABLE MLPG_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Add tentid to leave entitlement rules table
ALTER TABLE MLER_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Add tentid to employee leave policies table
ALTER TABLE TELP_TBL ADD COLUMN IF NOT EXISTS tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Create RLS policies for leave management tables
ALTER TABLE TLEA_TBL ENABLE ROW LEVEL SECURITY;
ALTER TABLE MLET_TBL ENABLE ROW LEVEL SECURITY;
ALTER TABLE TELB_TBL ENABLE ROW LEVEL SECURITY;
ALTER TABLE MLPG_TBL ENABLE ROW LEVEL SECURITY;
ALTER TABLE MLER_TBL ENABLE ROW LEVEL SECURITY;
ALTER TABLE TELP_TBL ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies (following the authentication pattern)
CREATE POLICY "Allow authenticated operations on TLEA_TBL" ON TLEA_TBL
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on MLET_TBL" ON MLET_TBL
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on TELB_TBL" ON TELB_TBL
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on MLPG_TBL" ON MLPG_TBL
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on MLER_TBL" ON MLER_TBL
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated operations on TELP_TBL" ON TELP_TBL
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tlea_tentid ON TLEA_TBL(tentid);
CREATE INDEX IF NOT EXISTS idx_mlet_tentid ON MLET_TBL(tentid);
CREATE INDEX IF NOT EXISTS idx_telb_tentid ON TELB_TBL(tentid);
CREATE INDEX IF NOT EXISTS idx_mlpg_tentid ON MLPG_TBL(tentid);
CREATE INDEX IF NOT EXISTS idx_mler_tentid ON MLER_TBL(tentid);
CREATE INDEX IF NOT EXISTS idx_telp_tentid ON TELP_TBL(tentid);