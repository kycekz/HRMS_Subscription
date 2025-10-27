-- Organization Module Database Schema for Malaysian HRMS (PostgreSQL)
-- Designed to support multiple legal entities and hierarchical structures
-- Modified with new naming conventions: m=master, t=transaction, _tbl=table, _vw=view

-- Malaysian banks reference master table
CREATE TABLE mbank_tbl (
    bankcd VARCHAR(20) PRIMARY KEY, -- Bank code as primary key
    bankname VARCHAR(100) NOT NULL,
    swiftcode VARCHAR(11),
    banktype VARCHAR(20) DEFAULT 'commercial' CHECK (banktype IN ('commercial', 'islamic', 'investment', 'development')),
    isactive BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for banks
CREATE INDEX idx_mbank_active ON mbank_tbl(isactive);
CREATE INDEX idx_mbank_type ON mbank_tbl(banktype);

-- Insert Malaysian banks data
INSERT INTO mbank_tbl (bankcd, bankname, swiftcode, banktype) VALUES
('MBB', 'Malayan Banking Berhad (Maybank)', 'MBBEMYKL', 'commercial'),
('CIMB', 'CIMB Bank Berhad', 'CIBBMYKL', 'commercial'),
('PBB', 'Public Bank Berhad', 'PBBEMYKL', 'commercial'),
('RHB', 'RHB Bank Berhad', 'RHBBMYKL', 'commercial'),
('HLB', 'Hong Leong Bank Berhad', 'HLBBMYKL', 'commercial'),
('AMBANK', 'AmBank (M) Berhad', 'ARBKMYKL', 'commercial'),
('UOB', 'United Overseas Bank (Malaysia) Bhd', 'UOVBMYKL', 'commercial'),
('OCBC', 'OCBC Bank (Malaysia) Berhad', 'OCBCMYKL', 'commercial'),
('SCB', 'Standard Chartered Bank Malaysia Berhad', 'SCBLMYKX', 'commercial'),
('HSBC', 'HSBC Bank Malaysia Berhad', 'HBMBMYKL', 'commercial'),
('BIMB', 'Bank Islam Malaysia Berhad', 'BIMBMYKL', 'islamic'),
('BMMB', 'Bank Muamalat Malaysia Berhad', 'BMMBMYKL', 'islamic'),
('ABB', 'Affin Bank Berhad', 'PHBMMYKL', 'commercial'),
('ABMB', 'Alliance Bank Malaysia Berhad', 'MFBBMYKL', 'commercial'),
('BRAK', 'Bank Rakyat Malaysia Berhad', 'BKRMMYKL', 'commercial'),
('BSN', 'Bank Simpanan Nasional', 'BSNAMYK1', 'development'),
('AGROBANK', 'Agrobank / Bank Pertanian Malaysia', 'BPMBMYKL', 'development'),
('EXIM', 'Export-Import Bank of Malaysia', 'EIBKMYKL', 'development'),
('BPMB', 'Bank Pembangunan Malaysia Berhad', 'BPMBMYKL', 'development'),
('SMEBANK', 'SME Bank / SME Development Bank Malaysia', 'SMEMMY2X', 'development');

-- Main organizations/companies master table
CREATE TABLE morg_tbl (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),   -- surrogate PK
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    
    -- Basic Information
    orgcd VARCHAR(20) NOT NULL,                          -- user-defined code
    orgname VARCHAR(255) NOT NULL,
    dispname VARCHAR(255),
    shortname VARCHAR(100),
    logourl VARCHAR(500), -- For company logo (used in payslips)
    logosize BIGINT,
    logomime VARCHAR(50),
    
    -- Malaysian Legal Registration
    regnum VARCHAR(50) UNIQUE, -- SSM Registration Number
    bizregnum VARCHAR(50), -- Business registration (old format)
    taxregnum VARCHAR(50), -- Tax reference number
    gstregnum VARCHAR(50), -- GST registration if applicable
    
    -- Company Details
    incorpdt DATE,
    biztype VARCHAR(30) DEFAULT 'private_limited' CHECK (biztype IN ('private_limited', 'public_limited', 'partnership', 'sole_proprietorship', 'llp', 'branch', 'representative_office')),
    indtype VARCHAR(100),
    biznatur TEXT,
    paidcap DECIMAL(15,2),
    authcap DECIMAL(15,2),
    
    -- Hierarchy Support
    parentorg UUID,
    orglvl SMALLINT DEFAULT 0, -- 0=parent, 1=subsidiary, 2=sub-subsidiary
    isholdco BOOLEAN DEFAULT FALSE,
    
    -- Status and Metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'dissolved', 'dormant')),
    founddt DATE,
    website VARCHAR(255),
    empcount INTEGER DEFAULT 0,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    createdby VARCHAR(20),
    updatedby VARCHAR(20),
    
    -- Foreign Key
    CONSTRAINT uq_orgcd_per_tenant UNIQUE (tenant_id, orgcd),
    FOREIGN KEY (parentorg) REFERENCES morg_tbl(org_id) ON DELETE SET NULL
);

-- Create indexes for orgs table
CREATE INDEX IF NOT EXISTS idx_morg_org_id ON morg_tbl(org_id);
CREATE INDEX idx_morg_parent ON morg_tbl(parentorg);
CREATE INDEX idx_morg_status ON morg_tbl(status);
CREATE INDEX idx_morg_regnum ON morg_tbl(regnum);
CREATE INDEX idx_morg_name ON morg_tbl(orgname);

-- Organization addresses master table (supporting multiple addresses per organization)
CREATE TABLE morgaddr_tbl (
    addrcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- Address Type
    addrtype VARCHAR(20) DEFAULT 'business' CHECK (addrtype IN ('registered', 'business', 'mailing', 'branch')),
    isprimary BOOLEAN DEFAULT FALSE,
    
    -- Address Details
    addr1 VARCHAR(255) NOT NULL,
    addr2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'Malaysia',
    
    -- Contact Information
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(100),
    
    -- Status
    isactive BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    
);

-- Create indexes for org_addresses
CREATE INDEX IF NOT EXISTS idx_morgaddr_org ON morgaddr_tbl(org_id, addrtype);
CREATE INDEX IF NOT EXISTS idx_morgaddr_primary ON morgaddr_tbl(org_id, isprimary);

-- Malaysian statutory compliance information master table
CREATE TABLE morgstat_tbl (
    statcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- EPF (Employee Provident Fund)
    epfempnum VARCHAR(20),
    epfcontrt DECIMAL(5,2) DEFAULT 13.00,
    epfregdt DATE,
    
    -- SOCSO (Social Security Organisation)
    socsonum VARCHAR(20),
    socsoregdt DATE,
    
    -- EIS (Employment Insurance System)
    eisempnum VARCHAR(20),
    eisregdt DATE,
    
    -- HRDC (Human Resources Development Corporation)
    hrdclevynum VARCHAR(20),
    hrdcregdt DATE,
    hrdclevyrt DECIMAL(5,4) DEFAULT 0.005, -- 0.5%
    ishrdcexmt BOOLEAN DEFAULT FALSE,
    
    -- Workmen's Compensation
    wcpolnum VARCHAR(50),
    wcinsurer VARCHAR(100),
    wcexpdt DATE,
    
    -- Income Tax
    taxref VARCHAR(20),
    taxagent TEXT,
    
    -- Other Statutory
    zakatregnum VARCHAR(20), -- For certain states
    statespec JSONB, -- For state-specific requirements
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (org_id) REFERENCES morg_tbl(org_id) ON DELETE CASCADE
);

-- Create index for org_statutory
CREATE INDEX IF NOT EXISTS idx_morgstat_org ON morgstat_tbl(org_id);

-- Organization bank accounts master table
CREATE TABLE morgbank_tbl (
    orgbankcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- Bank Details
    bankcd VARCHAR(20) NOT NULL REFERENCES mbank_tbl(bankcd),
    accnum VARCHAR(50) NOT NULL,
    accname VARCHAR(255) NOT NULL,
    acctype VARCHAR(20) DEFAULT 'current' CHECK (acctype IN ('current', 'savings', 'fixed_deposit')),
    
    -- Usage
    isprimary BOOLEAN DEFAULT FALSE,
    ispayroll BOOLEAN DEFAULT FALSE,
    isactive BOOLEAN DEFAULT TRUE,
    
    -- Additional Info
    branchname VARCHAR(100),
    branchcode VARCHAR(20),
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for org_banks
CREATE INDEX IF NOT EXISTS idx_morgbank_org ON morgbank_tbl(org_id);
CREATE INDEX IF NOT EXISTS idx_morgbank_primary ON morgbank_tbl(org_id, isprimary);
CREATE INDEX IF NOT EXISTS idx_morgbank_payroll ON morgbank_tbl(org_id, ispayroll);

-- Organization settings and configurations master table
CREATE TABLE morgset_tbl (
    setcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- HR Policies
    workdays SMALLINT DEFAULT 5,
    workhrs DECIMAL(4,2) DEFAULT 8.00,
    othrs DECIMAL(4,2) DEFAULT 8.00,
    
    -- Leave Policies
    annlvent INTEGER DEFAULT 14, -- Days per year
    sicklvent INTEGER DEFAULT 14,
    matlvent INTEGER DEFAULT 98, -- Malaysian standard
    patlvent INTEGER DEFAULT 7,
    
    -- Payroll Settings
    payfreq VARCHAR(20) DEFAULT 'monthly' CHECK (payfreq IN ('monthly', 'bi-weekly', 'weekly')),
    payday SMALLINT DEFAULT 25, -- Day of month
    currency VARCHAR(3) DEFAULT 'MYR',
    
    -- Public Holiday Settings
    fedhol BOOLEAN DEFAULT TRUE,
    holstate VARCHAR(50) DEFAULT 'Selangor',
    custmhol JSONB,
    
    -- System Settings
    timezone VARCHAR(50) DEFAULT 'Asia/Kuala_Lumpur',
    dtformat VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    numformat VARCHAR(20) DEFAULT 'en-MY',
    
    -- Notifications
    notifset JSONB,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for org_settings
CREATE INDEX IF NOT EXISTS idx_morgset_org ON morgset_tbl(org_id);

-- Organization departments/divisions master table
CREATE TABLE morgdept_tbl (
    deptcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid)  ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- Department Details
    deptname VARCHAR(255) NOT NULL,
    deptcode VARCHAR(50),
    deptdesc TEXT,
    
    -- Hierarchy
    parentdept UUID,
    deptlvl SMALLINT DEFAULT 0,
    
    -- Management
    heademp VARCHAR(20), -- Will link to employees table later
    costctr VARCHAR(50),
    budgetcd VARCHAR(50),
    
    -- Location
    location VARCHAR(255),
    floorlvl VARCHAR(10),
    
    -- Status
    isactive BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parentdept) REFERENCES morgdept_tbl(deptcd) ON DELETE SET NULL
);

-- Create indexes for org_departments
CREATE INDEX IF NOT EXISTS idx_morgdept_org ON morgdept_tbl(org_id);
CREATE INDEX IF NOT EXISTS idx_morgdept_parent ON morgdept_tbl(parentdept);
CREATE INDEX IF NOT EXISTS idx_morgdept_code ON morgdept_tbl(org_id, deptcode);

-- Organization contacts master table (key personnel, directors, etc.)
CREATE TABLE morgcont_tbl (
    contcd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid)  ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- Contact Type
    conttype VARCHAR(30) NOT NULL CHECK (conttype IN ('director', 'company_secretary', 'authorized_signatory', 'hr_contact', 'finance_contact', 'it_contact', 'person_in_charge')),
    
    -- Personal Details
    fullname VARCHAR(255) NOT NULL,
    icnum VARCHAR(20), -- Malaysian IC number
    passnum VARCHAR(20), -- For foreign nationals
    designatn VARCHAR(100),
    postitle VARCHAR(100), -- Specific for person in charge
    
    -- Contact Information
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    
    -- Address
    address TEXT,
    
    -- Person in Charge specific fields (for statutory submissions)
    statrole VARCHAR(30) CHECK (statrole IN ('epf_contact', 'socso_contact', 'eis_contact', 'hrdc_contact', 'income_tax_contact', 'primary_contact')),
    isauth BOOLEAN DEFAULT FALSE,
    sigspec BYTEA, -- Store signature image
    
    -- Status
    isactive BOOLEAN DEFAULT TRUE,
    apptdt DATE,
    resigndt DATE,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (org_id) REFERENCES morg_tbl(org_id) ON DELETE CASCADE
);

-- Create indexes for org_contacts
CREATE INDEX IF NOT EXISTS idx_morgcont_org_type ON morgcont_tbl(org_id, conttype);
CREATE INDEX IF NOT EXISTS idx_morgcont_active ON morgcont_tbl(org_id, isactive);
CREATE INDEX IF NOT EXISTS idx_morgcont_stat ON morgcont_tbl(org_id, statrole);

-- Document storage for organization-related files master table
CREATE TABLE morgdoc_tbl (
    doccd UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid)  ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES morg_tbl(org_id) ON DELETE CASCADE,
    
    -- Document Details
    doctype VARCHAR(100) NOT NULL, -- 'incorporation_certificate', 'form24', 'form49', etc.
    docname VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    filesize BIGINT,
    mimetype VARCHAR(100),
    
    -- Metadata
    docnum VARCHAR(100),
    issuedt DATE,
    expirydt DATE,
    issueauth VARCHAR(200),
    
    -- Status
    iscurrent BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploadby VARCHAR(20)
);

-- Create indexes for org_documents
CREATE INDEX IF NOT EXISTS idx_morgdoc_org_type ON morgdoc_tbl(org_id, doctype);
CREATE INDEX IF NOT EXISTS idx_morgdoc_expiry ON morgdoc_tbl(expirydt);

-- Create function to automatically update updatedat timestamp
CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedat
CREATE TRIGGER update_mbank_updatedat BEFORE UPDATE ON mbank_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morg_updatedat BEFORE UPDATE ON morg_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgaddr_updatedat BEFORE UPDATE ON morgaddr_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgstat_updatedat BEFORE UPDATE ON morgstat_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgbank_updatedat BEFORE UPDATE ON morgbank_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgset_updatedat BEFORE UPDATE ON morgset_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgdept_updatedat BEFORE UPDATE ON morgdept_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgcont_updatedat BEFORE UPDATE ON morgcont_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();
CREATE TRIGGER update_morgdoc_updatedat BEFORE UPDATE ON morgdoc_tbl FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

-- Create views for commonly used queries
CREATE OR REPLACE VIEW morgsum_vw AS
SELECT 
    o.tenant_id,
    o.org_id,
    o.orgcd,
    o.orgname,
    o.dispname,
    o.regnum,
    o.status,
    o.empcount,
    o.biztype,
    o.indtype,
    addr.addr1 || COALESCE(', ' || addr.addr2, '') || ', ' || addr.city || ', ' || addr.state AS primaryaddr,
    addr.phone AS primaryphone,
    addr.email AS primaryemail,
    COUNT(DISTINCT dept.deptcd) AS deptcount,
    COUNT(DISTINCT bank.orgbankcd) AS bankcount,
    o.createdat,
    o.updatedat
FROM morg_tbl o
LEFT JOIN morgaddr_tbl addr ON o.org_id = addr.org_id AND o.tenant_id = addr.tenant_id AND addr.isprimary = true
LEFT JOIN morgdept_tbl dept ON o.org_id = dept.org_id AND o.tenant_id = dept.tenant_id AND dept.isactive = true
LEFT JOIN morgbank_tbl bank ON o.org_id = bank.org_id AND o.tenant_id = bank.tenant_id AND bank.isactive = true
GROUP BY o.tenant_id, o.org_id, o.orgcd, o.orgname, o.dispname, o.regnum, o.status, o.empcount, 
         o.biztype, o.indtype, addr.addr1, addr.addr2, addr.city, addr.state,
         addr.phone, addr.email, o.createdat, o.updatedat;

-- Organization hierarchy view
CREATE OR REPLACE VIEW morghier_vw AS
WITH RECURSIVE org_tree AS (
    SELECT 
        org_id, orgcd, orgname, parentorg, orglvl, ARRAY[orgname::text] AS path, orgname AS rootorg, tenant_id
    FROM morg_tbl 
    WHERE parentorg IS NULL

    UNION ALL

    SELECT 
        o.org_id, o.orgcd, o.orgname, o.parentorg, o.orglvl, ot.path || o.orgname::text, ot.rootorg, o.tenant_id
    FROM morg_tbl o
    JOIN org_tree ot ON o.parentorg = ot.org_id
    WHERE o.tenant_id = ot.tenant_id
)
SELECT 
    org_id,
    orgcd,
    orgname,
    parentorg,
    orglvl,
    path,
    rootorg,
    array_to_string(path, ' > ') AS fullpath,
    tenant_id
FROM org_tree
ORDER BY path;


-- Statutory compliance status view
CREATE OR REPLACE VIEW morgcompl_vw AS
SELECT 
    o.tenant_id,
    o.org_id,
    o.orgcd,
    o.orgname,
    s.epfempnum IS NOT NULL as hasepf,
    s.socsonum IS NOT NULL as hassocso,
    s.eisempnum IS NOT NULL as haseis,
    s.hrdclevynum IS NOT NULL as hashrdc,
    s.wcpolnum IS NOT NULL as haswc,
    CASE 
        WHEN s.wcexpdt < CURRENT_DATE THEN 'expired'
        WHEN s.wcexpdt < CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'valid'
    END as wcstatus,
    EXISTS(SELECT 1 FROM morgcont_tbl c WHERE c.org_id = o.org_id AND c.tenant_id = o.tenant_id AND c.statrole = 'primary_contact') as hasprimcont,
    EXISTS(SELECT 1 FROM morgbank_tbl b WHERE b.org_id = o.org_id AND b.tenant_id = o.tenant_id AND b.ispayroll = true) as haspaybank
FROM morg_tbl o
LEFT JOIN morgstat_tbl s ON o.org_id = s.org_id AND o.tenant_id = s.tenant_id;

-- Department hierarchy view
CREATE VIEW morgdepth_vw AS
WITH RECURSIVE dept_tree AS (
    -- Base case: top-level departments
    SELECT 
        deptcd, 
        org_id, 
        deptname, 
        parentdept, 
        deptlvl,
        deptname::text AS fullpath,
        1 as depth
    FROM morgdept_tbl 
    WHERE parentdept IS NULL AND isactive = true
    
    UNION ALL
    
    -- Recursive case: child departments
    SELECT 
        d.deptcd, 
        d.org_id, 
        d.deptname, 
        d.parentdept, 
        d.deptlvl,
        dt.fullpath || ' > ' || d.deptname,
        dt.depth + 1
    FROM morgdept_tbl d
    JOIN dept_tree dt ON d.parentdept = dt.deptcd
    WHERE d.isactive = true
)
SELECT 
    deptcd,
    org_id,
    deptname,
    parentdept,
    deptlvl,
    fullpath,
    depth
FROM dept_tree
ORDER BY org_id, fullpath;

-- Active contacts view
CREATE VIEW morgconts_vw AS
SELECT 
    c.org_id,
    o.orgname,
    c.conttype,
    c.fullname,
    c.designatn,
    c.email,
    c.phone,
    c.mobile,
    c.statrole,
    c.isactive,
    c.apptdt,
    c.resigndt
FROM morgcont_tbl c
INNER JOIN morg_tbl o ON c.org_id = o.org_id
WHERE c.isactive = TRUE
ORDER BY c.org_id, c.conttype;

-- Document expiry tracking view
CREATE VIEW morgdocexp_vw AS
SELECT 
    d.org_id,
    o.orgname,
    d.doctype,
    d.docname,
    d.docnum,
    d.expirydt,
    CASE 
        WHEN d.expirydt < CURRENT_DATE THEN 'expired'
        WHEN d.expirydt <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'valid'
    END as expstatus,
    d.expirydt - CURRENT_DATE AS daystoexp
FROM morgdoc_tbl d
INNER JOIN morg_tbl o ON d.org_id = o.org_id
WHERE d.iscurrent = TRUE 
  AND d.expirydt IS NOT NULL
ORDER BY d.expirydt;

-- Bank accounts with bank details view
CREATE VIEW morgbankdet_vw AS
SELECT 
    ob.orgbankcd,
    ob.org_id,
    o.orgname,
    b.bankname,
    b.swiftcode,
    ob.accnum,
    ob.accname,
    ob.acctype,
    ob.isprimary,
    ob.ispayroll,
    ob.branchname,
    ob.isactive
FROM morgbank_tbl ob
INNER JOIN morg_tbl o ON ob.org_id = o.org_id
INNER JOIN mbank_tbl b ON ob.bankcd = b.bankcd
WHERE ob.isactive = TRUE
ORDER BY ob.org_id, ob.isprimary DESC;

-- Comments for documentation
COMMENT ON TABLE morg_tbl IS 'Main organizations/companies master table with Malaysian compliance focus';
COMMENT ON TABLE morgaddr_tbl IS 'Multiple addresses per organization (registered, business, mailing, branch)';
COMMENT ON TABLE morgstat_tbl IS 'Malaysian statutory compliance information (EPF, SOCSO, EIS, HRDC, etc.)';
COMMENT ON TABLE morgbank_tbl IS 'Organization bank accounts with Malaysian bank integration';
COMMENT ON TABLE morgcont_tbl IS 'Key personnel including person in charge for statutory submissions';
COMMENT ON TABLE morgdept_tbl IS 'Organizational departments and divisions with hierarchy support';
COMMENT ON TABLE morgdoc_tbl IS 'Document storage for certificates and legal documents';
COMMENT ON TABLE mbank_tbl IS 'Reference master table for Malaysian banks';

-- Sample data insertion for testing
-- two organizations
INSERT INTO morg_tbl (tenant_id, orgcd, orgname, regnum, biztype, indtype, status)
VALUES ('d75079e2-3922-4b18-8857-7cd333a82687', 'ORG001', 'Tech Solutions Sdn Bhd', '201801234567', 'private_limited', 'Information Technology', 'active');

INSERT INTO morg_tbl (tenant_id, orgcd, orgname, regnum, biztype, indtype, status)
VALUES ('d75079e2-3922-4b18-8857-7cd333a82687', 'ORG002', 'Digital Innovations Sdn Bhd', '201902345678', 'private_limited', 'Software Development', 'active'); 
/*
Drop view morgdocexp_vw;
Drop view morgconts_vw;
Drop view morgdepth_vw;
Drop view morghier_vw;
Drop view morgsum_vw;
Drop view morgcompl_vw;
Drop view morgbankdet_vw;

Drop table morgdoc_tbl;

Drop table morgcont_tbl;
Drop table  morgdept_tbl;
Drop table morgset_tbl;

Drop table morgbank_tbl;

Drop table morgstat_tbl;
Drop table morgaddr_tbl;

Drop table morg_tbl;
Drop table mbank_tbl;
*/
