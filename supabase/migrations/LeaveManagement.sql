-- =================================================================
-- MALAYSIAN HRMS LEAVE ENTITLEMENT DATABASE SCHEMA
-- Based on Employment Act 1955 & Organizational Policies
-- =================================================================

-- 1. LEAVE TYPES MASTER TABLE
-- Defines all available leave types in the system
CREATE TABLE MLET_TBL (
    MLET_LETID VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL, -- LEAVE TYPE CODE
    MLET_NAME VARCHAR(100) NOT NULL, -- LEAVE TYPE NAME
    MLET_DESC TEXT, --DESCRIPTION
    MLET_STATUS BOOLEAN DEFAULT FALSE, -- IS STATUTORY
    MLET_PAID BOOLEAN DEFAULT TRUE, -- IS THIS PAID LEAVE
    MLET_DOC BOOLEAN DEFAULT FALSE, -- NEED ATTACH SUPPORTING DOCUMENTS ?
    MLET_PAY BOOLEAN DEFAULT TRUE, -- SEND TO PAYROLL ?
    MLET_ACTIVE BOOLEAN DEFAULT TRUE, -- IS ACTIVE LEAVE TYPE ?
    MLET_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MLET_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LEAVE POLICY GROUPS
-- Allows different policies for different employee levels/groups
CREATE TABLE MLPG_TBL ( -- LEAVE POLICY GROUPS
    MLPG_LPGID VARCHAR(100) PRIMARY KEY NOT NULL, -- policy_group_id
    MLPG_NAME TEXT, --POLICY NAME
    MLPG_PRIORD INT DEFAULT 1, -- priority_order
    MLPT_DEFAULT BOOLEAN DEFAULT FALSE, -- is_default
    MLPT_ACTIVE BOOLEAN DEFAULT TRUE, --is_active
    MLPT_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- created_at
    MLPT_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- updated_at
);

-- 3. LEAVE ENTITLEMENT RULES
-- Core configuration for leave entitlements based on service length and policy group
CREATE TYPE ml_er_accme AS ENUM ('YEARLY_ADVANCE', 'MONTHLY', 'DAILY');
CREATE TYPE ml_er_accsta AS ENUM ('EMPLOYMENT_DATE', 'CALENDAR_YEAR', 'FINANCIAL_YEAR');


CREATE TABLE MLER_TBL ( --leave_entitlement_rules
    MLER_LERID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    MLER_LPGID VARCHAR(100) NOT NULL,
    MLER_LETID VARCHAR(20) NOT NULL,
    MLER_YFROM  NUMERIC DEFAULT 0, --service_years_from
    MLER_YTO NUMERIC DEFAULT 999.9, --service_years_to
    MLER_ENTDAY DECIMAL(5,2) NOT NULL, --entitlement_days
    MLER_ACCME ml_er_accme DEFAULT 'YEARLY_ADVANCE', --accrual_method
    MLER_ACCSTA ml_er_accsta DEFAULT 'CALENDAR_YEAR', --accrual_start_date
    MLER_PRORA BOOLEAN DEFAULT TRUE, --is_prorated
    MLER_MAXCF DECIMAL(5,2) DEFAULT 0, -- max_carry_forward_days
    MLER_CFEXMO INT DEFAULT 3, --carry_forward_expiry_months
    MLER_ACTIVE BOOLEAN DEFAULT TRUE, --is_active
    MLER_EFFROM DATE NOT NULL, --effective_from
    MLER_EFFTO DATE NULL, --effective_to
    MLER_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    MLER_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- updated_at
    FOREIGN KEY (MLER_LPGID) REFERENCES MLPG_TBL(MLPG_LPGID),
    FOREIGN KEY (MLER_LETID) REFERENCES MLET_TBL(MLET_LETID)
    --INDEX idx_policy_leave_service (policy_group_id, leave_type_id, service_years_from, service_years_to)
);

-- Separate index creation
CREATE INDEX idx_policy_leave_service 
    ON MLER_TBL (MLER_LPGID, MLER_LETID, MLER_YFROM, MLER_YTO);


-- 4. EMPLOYEE LEAVE POLICY ASSIGNMENT
-- Links employees to their applicable leave policy group
CREATE TABLE TELP_TBL ( --employee_leave_policies
    TELP_ASGID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --assignment_id
    TELP_EMPID VARCHAR(50) NOT NULL, --employee_id
    TELP_LPGID VARCHAR(100) NOT NULL, --policy_group_id
    TELP_EFFORM DATE NOT NULL, --effective_from
    TELP_EFFTO DATE NULL, --effective_to
    TELP_ASGBY INT NOT NULL, --assigned_by
    TELP_ASGREA VARCHAR(255), --assignment_reason
    TELP_ACTIVE BOOLEAN DEFAULT TRUE, --is_active
    TELP_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    TELP_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --updated_at
    FOREIGN KEY (TELP_LPGID) REFERENCES MLPG_TBL(MLPG_LPGID)
);

-- Separate index creation
CREATE INDEX idx_employee_policy_date 
    ON TELP_TBL (TELP_EMPID, TELP_EFFORM, TELP_EFFTO);

-- 5. EMPLOYEE LEAVE BALANCES
-- Tracks current leave balances for each employee
CREATE TABLE TELB_TBL ( --employee_leave_balances
    TELB_BALID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --balance_id
    TELB_EMPID VARCHAR(50) NOT NULL, --employee_id
    TELB_LETID VARCHAR(20) NOT NULL, --leave_type_id
    TELB_BALYR INT NOT NULL, --balance_year
    TELB_OPBAL NUMERIC(5,2) DEFAULT 0, --opening_balance
    TELB_ENTDAY NUMERIC(5,2) DEFAULT 0, --entitled_days
    TELB_ACCDAY NUMERIC(5,2) DEFAULT 0, --accrued_days
    TELB_USEDDAY NUMERIC(5,2) DEFAULT 0, --used_days
    TELB_PENDAY NUMERIC(5,2) DEFAULT 0, --pending_days
    TELB_CFDAY NUMERIC(5,2) DEFAULT 0, --carry_forward_days
    TELB_CFEXP DATE NULL, --carry_forward_expiry_date
    TELB_ADJDAY NUMERIC(5,2) DEFAULT 0, --adjusted_days
    TELB_CURRBAL NUMERIC(5,2) GENERATED ALWAYS AS --current_balance
        (TELB_OPBAL + TELB_ENTDAY + TELB_ACCDAY + TELB_CFDAY + TELB_ADJDAY - TELB_USEDDAY - TELB_PENDAY) STORED,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TELB_LETID) REFERENCES MLET_TBL(MLET_LETID),
    CONSTRAINT unique_employee_leave_year UNIQUE (TELB_EMPID, TELB_LETID, TELB_BALYR)
);

-- Separate index creation
CREATE INDEX idx_employee_balance 
    ON TELB_TBL (TELB_EMPID, TELB_BALYR);

-- 6. LEAVE ACCRUAL TRANSACTIONS
-- Tracks all accrual activities for audit trail

CREATE TYPE tl_at_trxtyp AS ENUM ('INITIAL_GRANT', 'MONTHLY_ACCRUAL', 'DAILY_ACCRUAL', 'CARRY_FORWARD', 'ADJUSTMENT', 'PRORATION');

CREATE TABLE  TLAT_TBL( --leave_accrual_transactions
    TLAT_LATID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --transaction_id
    TLAT_EMPID VARCHAR(50) NOT NULL, --employee_id
    TLAT_LETID VARCHAR(20) NOT NULL, --leave_type_id
    TLAT_TRXTYP tl_at_trxtyp NOT NULL, --transaction_type
    TLAT_TRXDT DATE NOT NULL, -- --transaction_date
    TLAT_DAYCRED NUMERIC(5,2) NOT NULL, --days_credited
    TLAT_REFPRD VARCHAR(20), -- e.g., '2024-01', '2024-Q1' --reference_period
    TLAT_REMRK TEXT, --remarks
    TLAT_PROCBY INT, --processed_by
    TLAT_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    FOREIGN KEY (TLAT_LETID) REFERENCES MLET_TBL(MLET_LETID)
);

-- Separate index creation
CREATE INDEX idx_employee_accrual_date ON TLAT_TBL (TLAT_EMPID, TLAT_TRXDT);
-- Separate index creation
CREATE INDEX idx_leave_type_date ON TLAT_TBL (TLAT_LETID, TLAT_TRXDT);

-- 7. LEAVE APPLICATIONS
-- Main table for leave applications
CREATE TYPE tl_ea_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

CREATE TABLE  TLEA_TBL( --leave_applications
    TLEA_APPID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --application_id
    TLEA_EMPID VARCHAR(50) NOT NULL, --employee_id
    TLEA_LETID VARCHAR(20) NOT NULL, --leave_type_id
    TLEA_APPDT DATE NOT NULL, --application_date
    TLEA_START DATE NOT NULL, --start_date
    TLEA_END DATE NOT NULL, --end_date
    TLEA_TTLDAY NUMERIC(5,2) NOT NULL, --total_days
    TLEA_WRKDAY NUMERIC(5,2) NOT NULL, --working_days
    TLEA_REASON TEXT, --reason
    TLEA_EMGCON VARCHAR(255), --emergency_contact
    TLEA_DOC BOOLEAN DEFAULT FALSE, --medical_cert_required
    TLEA_DOCUPED BOOLEAN DEFAULT FALSE, --medical_cert_uploaded
    TLEA_DOCPATH VARCHAR(500), --medical_cert_file_path
    TLEA_STATUS tl_ea_status DEFAULT 'DRAFT', --status
    TLEA_SUBMIT TIMESTAMP NULL, --submitted_at
    TLEA_APPRDT TIMESTAMP NULL, --approved_at
    TLEA_APPBY INT NULL, --approved_by
    TLEA_REJREA TEXT, --rejection_reason
    TLEA_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    TLEA_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --updated_at
    FOREIGN KEY (TLEA_LETID) REFERENCES MLET_TBL(MLET_LETID)
);

-- Separate index creation
CREATE INDEX idx_employee_dates ON TLEA_TBL (TLEA_EMPID, TLEA_START, TLEA_END);
CREATE INDEX idx_status_date ON TLEA_TBL (TLEA_STATUS, TLEA_APPDT);


-- 8. LEAVE APPLICATION WORKFLOW
-- Tracks approval workflow for leave applications

CREATE TYPE tl_aw_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DELEGATED');

CREATE TABLE  TLAW_TBL( --leave_approval_workflow
    TLAW_LAWID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --workflow_id
    TLAW_APPID INT NOT NULL, --application_id
    TLAW_APPRID VARCHAR(50) NOT NULL, --approver_id
    TLAW_APPLVL INT NOT NULL, --approval_level
    TLAW_STATUS tl_aw_status DEFAULT 'PENDING', --status
    TLAW_ACTDT TIMESTAMP NULL, --action_date
    TLAW_COMMTS TEXT, --comments
    TLAW_DLGTO INT NULL, --delegated_to
    TLAW_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    TLAW_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --updated_at
    FOREIGN KEY (TLAW_APPID) REFERENCES TLEA_TBL(TLEA_APPID)
);

-- Separate index creation
CREATE INDEX idx_application_level ON TLAW_TBL (TLAW_APPID, TLAW_APPLVL);
-- Separate index creation
CREATE INDEX idx_approver_status ON TLAW_TBL (TLAW_APPID, TLAW_STATUS);

-- 9. PUBLIC HOLIDAYS CONFIGURATION
-- Manages public holidays by state/location

CREATE TYPE mp_hd_type AS ENUM ('NATIONAL', 'STATE_SPECIFIC', 'OPTIONAL');

CREATE TABLE  MPHD_TBL( --public_holidays
    MPHD_PHDID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --holiday_id
    MPHD_PHNM VARCHAR(100) NOT NULL, --holiday_name
    MPHD_PHDT DATE NOT NULL, --holiday_date
    MPHD_TYPE mp_hd_type DEFAULT 'NATIONAL', --holiday_type
    MPHD_STATE VARCHAR(255), -- JSON array of state codes --applicable_states
    MPHD_RECURR BOOLEAN DEFAULT FALSE, --is_recurring
    MPHD_RERULE VARCHAR(100), -- For recurring holidays --recurrence_rule
    MPHD_REMRK TEXT, --remarks
    MPHD_ACTIVE BOOLEAN DEFAULT TRUE, --is_active
    MPHD_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    MPHD_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP --updated_at
);

-- Separate index creation
CREATE INDEX idx_date_type ON MPHD_TBL (MPHD_PHDT, MPHD_TYPE);
-- Separate index creation
CREATE INDEX idx_state_date ON MPHD_TBL (MPHD_STATE, MPHD_PHDT);

-- 10. EMPLOYEE WORKING CALENDAR
-- Defines working patterns for accurate leave calculation
CREATE TYPE te_wc_restd AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

CREATE TABLE  TEWC_TBL( --employee_working_calendar
    TEWC_CLDID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --calendar_id
    TEWC_EMPID VARCHAR(50) NOT NULL, --employee_id
    TEWC_WPNM VARCHAR(100) NOT NULL, --working_pattern_name
    TEWC_MON BOOLEAN DEFAULT TRUE, --monday_work
    TEWC_TUE BOOLEAN DEFAULT TRUE, --tuesday_work
    TEWC_WED BOOLEAN DEFAULT TRUE, --wednesday_work
    TEWC_THU BOOLEAN DEFAULT TRUE, --thursday_work
    TEWC_FRI BOOLEAN DEFAULT TRUE, --friday_work
    TEWC_SAT BOOLEAN DEFAULT FALSE, --saturday_work
    TEWC_SUN BOOLEAN DEFAULT FALSE, --sunday_work
    TEWC_TTWD NUMERIC(2,1) DEFAULT 5.0, --total_working_days_week
    TEWC_RESTD te_wc_restd DEFAULT 'SUNDAY', --rest_day
    TEWC_EFFROM DATE NOT NULL, --effective_from
    TEWC_EFFTO DATE NULL, --effective_to
    TEWC_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    TEWC_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP --updated_at
);

-- Separate index creation
CREATE INDEX idx_employee_effective ON TEWC_TBL (TEWC_EMPID, TEWC_EFFROM, TEWC_EFFTO);

-- 11. LEAVE BALANCE ADJUSTMENTS
-- Manual adjustments to leave balances
CREATE TYPE tl_ba_adjty AS ENUM ('ADD', 'DEDUCT');

CREATE TABLE TLBA_TBL ( --leave_balance_adjustments
    TLBA_ADJID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --adjustment_id
    TLBA_EMPID VARCHAR(50) NOT NULL, --employee_id
    TLBA_LETID VARCHAR(20) NOT NULL, --leave_type_id
    TLBA_ADJTY tl_ba_adjty NOT NULL, --adjustment_type
    TLBA_ADJDAY NUMERIC(5,2) NOT NULL, --adjustment_days
    TLBA_REASON VARCHAR(255) NOT NULL, --reason
    TLBA_REFDOC VARCHAR(255), --reference_document
    TLBA_ADJDT DATE NOT NULL, --adjustment_date
    TLBA_APPRID INT NOT NULL, --approved_by
    TLBA_REMRK TEXT, --remarks
    TLBA_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --created_at
    FOREIGN KEY (TLBA_LETID) REFERENCES MLET_TBL(MLET_LETID)
);

-- Separate index creation
CREATE INDEX idx_employee_adjustment_date ON TLBA_TBL (TLBA_EMPID, TLBA_ADJDT);

-- 12. SYSTEM CONFIGURATION
-- General system settings for leave management
CREATE TYPE ml_sc_dtype AS ENUM ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'DATE', 'JSON');

CREATE TABLE MLSC_TBLE ( --leave_system_config
    MLSC_CFGID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, --config_id
    MLSC_CFGKEY VARCHAR(100) UNIQUE NOT NULL, --config_key
    MLSC_VALUE TEXT NOT NULL, --config_value
    MLSC_DESCR TEXT, --config_description
    MLSC_DTYPE ml_sc_dtype DEFAULT 'STRING', --data_type
    MLSC_EDIT BOOLEAN DEFAULT TRUE, --is_editable
    MLSC_UPDBY INT, --updated_by
    MLSC_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP --updated_at
);

-- =================================================================
-- SAMPLE DATA INSERTION
-- =================================================================

-- Insert standard leave types based on Employment Act 1955
INSERT INTO MLET_TBL (MLET_LETID, MLET_NAME, MLET_DESC, MLET_STATUS, MLET_PAID, MLET_DOC, MLET_PAY) VALUES
('AL', 'Annual Leave', 'Annual vacation leave as per Employment Act 1955', TRUE, TRUE, FALSE, TRUE),
('ML', 'Medical Leave', 'Sick leave with medical certification', TRUE, TRUE, TRUE, TRUE),
('ML_UNPAID', 'Unpaid Medical Leave', 'Extended medical leave without pay', FALSE, FALSE, TRUE, TRUE),
('MAT', 'Maternity Leave', '98 days paid maternity leave', TRUE, TRUE, FALSE, TRUE),
('PAT', 'Paternity Leave', '7 days paid paternity leave', TRUE, TRUE, FALSE, TRUE),
('PH', 'Public Holiday', 'Gazetted public holidays', TRUE, TRUE, FALSE, TRUE),
('UL', 'Unpaid Leave', 'Leave without pay', FALSE, FALSE, FALSE, TRUE),
('CL', 'Compassionate Leave', 'Leave for family emergencies', FALSE, TRUE, FALSE, TRUE),
('EL', 'Emergency Leave', 'Emergency situations leave', FALSE, TRUE, FALSE, TRUE);

-- Insert default policy groups
INSERT INTO MLPG_TBL (MLPG_LPGID, MLPG_NAME, MLPG_PRIORD, MLPT_DEFAULT) VALUES
('Standard Employment Act', 'Minimum entitlement as per Employment Act 1955', 1, TRUE),
('Senior Management', 'Enhanced leave benefits for senior staff', 2, FALSE),
('Executive Level', 'Executive level leave entitlements', 3, FALSE);

-- Insert Employment Act 1955 annual leave rules for standard policy
INSERT INTO MLER_TBL (MLER_LPGID, MLER_LETID, MLER_YFROM, MLER_YTO, MLER_ENTDAY, MLER_ACCME, MLER_ACCSTA, MLER_MAXCF, MLER_CFEXMO, MLER_EFFROM) VALUES
-- Annual Leave based on service length
('Standard Employment Act', 'AL', 0.0, 1.9, 8.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 8.0, 3, '2024-01-01'),
('Standard Employment Act', 'AL', 2.0, 4.9, 12.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 12.0, 3, '2024-01-01'),
('Standard Employment Act', 'AL', 5.0, 99.9, 16.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 16.0, 3, '2024-01-01'),

-- Statutory leaves - full entitlement upon joining
('Standard Employment Act', 'MAT', 0.0, 99.9, 98.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01'), -- Maternity
('Standard Employment Act', 'PAT', 0.0, 99.9, 7.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01'),  -- Paternity

-- Medical leave (typically 14-60 days depending on company policy)
('Standard Employment Act', 'ML', 0.0, 99.9, 14.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01');

-- Enhanced policy for Senior Management
INSERT INTO MLER_TBL 
(MLER_LPGID, MLER_LETID, MLER_YFROM, MLER_YTO, MLER_ENTDAY, MLER_ACCME, MLER_ACCSTA, MLER_MAXCF, MLER_CFEXMO, MLER_EFFROM) VALUES
-- Enhanced Annual Leave for Senior Management
('Senior Management', 'AL', 0.0, 1.9, 15.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 15.0, 6, '2024-01-01'),
('Senior Management', 'AL', 2.0, 4.9, 20.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 20.0, 6, '2024-01-01'),
('Senior Management', 'AL', 5.0, 99.9, 25.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 25.0, 6, '2024-01-01'),

-- Same statutory entitlements
('Senior Management', 'MAT', 0.0, 99.9, 98.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01'),
('Senior Management', 'PAT', 0.0, 99.9, 7.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01'),

-- Enhanced medical leave
('Senior Management', 'ML', 0.0, 99.9, 30.0, 'YEARLY_ADVANCE', 'CALENDAR_YEAR', 0.0, 0, '2024-01-01');


-- Insert sample public holidays for Malaysia
INSERT INTO MPHD_TBL (MPHD_PHNM, MPHD_PHDT, MPHD_TYPE, MPHD_STATE, MPHD_REMRK) VALUES
('New Year Day', '2025-01-01', 'NATIONAL', '["ALL"]', 'National public holiday'),
('Chinese New Year', '2025-01-29', 'NATIONAL', '["ALL"]', 'First day of Chinese New Year'),
('Chinese New Year', '2025-01-30', 'NATIONAL', '["ALL"]', 'Second day of Chinese New Year'),
('Federal Territory Day', '2025-02-01', 'STATE_SPECIFIC', '["KL", "LB", "PJ"]', 'Federal Territory only'),
('Labour Day', '2025-05-01', 'NATIONAL', '["ALL"]', 'International Workers Day'),
('Wesak Day', '2025-05-12', 'NATIONAL', '["ALL"]', 'Buddha Birthday'),
('Agongs Birthday', '2025-06-07', 'NATIONAL', '["ALL"]', 'Yang di-Pertuan Agong Birthday'),
('Merdeka Day', '2025-08-31', 'NATIONAL', '["ALL"]', 'Independence Day'),
('Malaysia Day', '2025-09-16', 'NATIONAL', '["ALL"]', 'Formation of Malaysia'),
('Deepavali', '2025-10-20', 'NATIONAL', '["ALL"]', 'Festival of Lights'),
('Christmas Day', '2025-12-25', 'NATIONAL', '["ALL"]', 'Christmas celebration');

-- Insert system configuration
INSERT INTO MLSC_TBLE (MLSC_CFGKEY, MLSC_VALUE, MLSC_DESCR, MLSC_DTYPE) VALUES
('CARRY_FORWARD_DEFAULT_MONTHS', '3', 'Default months to utilize carried forward leave', 'INTEGER'),
('MEDICAL_CERT_MIN_DAYS', '3', 'Minimum consecutive days requiring medical certificate', 'INTEGER'),
('MAX_ADVANCE_LEAVE_DAYS', '5', 'Maximum days of advance leave allowed', 'INTEGER'),
('WEEKEND_PATTERN', '["SATURDAY", "SUNDAY"]', 'Default weekend days', 'JSON'),
('LEAVE_YEAR_START', '01-01', 'Leave year start date (MM-DD)', 'STRING'),
('AUTO_APPROVE_THRESHOLD', '1', 'Auto-approve leave applications up to this many days', 'INTEGER'),
('PRORATION_METHOD', 'DAILY', 'Method for calculating prorated entitlements', 'STRING');

-- =================================================================
-- USEFUL VIEWS FOR REPORTING
-- =================================================================

-- View: Current Employee Leave Entitlements
CREATE VIEW v_emp_current_entitlements AS
SELECT 
    e.employee_id,
    e.LEGAL_NAME,
    ELP.TELP_LPGID,
    LPG.MLPG_NAME as policy_group_name,
    LET.MLET_NAME,
    LER.MLER_ENTDAY, --ENTITLEMENT DAYS
    LER.MLER_ACCME, --ACCRUAL METHOD
    LER.MLER_MAXCF, --MAXIMUM CARRY FORWARD DAYS
    (CURRENT_DATE - e.join_date) / 365.25 AS service_years
FROM  TELP_TBL ELP --employee_leave_policies
JOIN MLPG_TBL LPG ON ELP.TELP_LPGID = LPG.MLPG_LPGID
JOIN MLER_TBL LER ON LPG.MLPG_LPGID = LER.MLER_LPGID
JOIN MLET_TBL LET ON LER.MLER_LETID = LET.MLET_LETID
JOIN employees e ON ELP.TELP_EMPID = e.employee_id
WHERE ELP.TELP_ACTIVE = TRUE 
    AND (ELP.TELP_EFFTO IS NULL OR ELP.TELP_EFFTO >= CURRENT_DATE)
    AND LER.MLER_ACTIVE = TRUE
    AND (LER.MLER_EFFTO IS NULL OR LER.MLER_EFFTO >= CURRENT_DATE)
    AND ((CURRENT_DATE - e.join_date) / 365.25) >= LER.MLER_YFROM
    AND ((CURRENT_DATE - e.join_date) / 365.25) < LER.MLER_YTO;

-- View: Employee Leave Balance Summary
CREATE VIEW v_employee_leave_summary AS
SELECT 
    ELB.TELB_EMPID,
    e.LEGAL_NAME,
    LET.MLET_NAME,
    ELB.TELB_BALYR,
    ELB.TELB_ENTDAY,
    ELB.TELB_USEDDAY,
    ELB.TELB_PENDAY,
    ELB.TELB_CFDAY,
    ELB.TELB_CURRBAL,
    ELB.TELB_CFEXP
FROM TELB_TBL ELB
JOIN MLET_TBL LET ON ELB.TELB_LETID = LET.MLET_LETID
JOIN employees e ON elb.TELB_EMPID = e.employee_id
WHERE ELB.TELB_BALYR = DATE_PART('year', CURRENT_DATE); --YEAR(CURRENT_DATE);

-- =================================================================
-- SAMPLE STORED PROCEDURES
-- =================================================================

-- Procedure: Calculate Annual Leave Entitlement based on service years

CREATE FUNCTION sp_calculate_leave_entitlement(
    p_employee_id INT,
    p_leave_type_id INT,
    p_calculation_date DATE
) RETURNS NUMERIC AS $$

DECLARE 
    v_service_years NUMERIC(5,2);
    v_employment_date DATE;
    v_policy_group_id INT;
    P_entitled_days NUMERIC(5,2) := 0;

BEGIN
    -- Get employee details
    SELECT join_date 
        INTO v_employment_date 
    FROM employees 
    WHERE employee_id = p_employee_id;
    
    -- Calculate service years
    v_service_years = (p_calculation_date - v_employment_date) / 365.25;
    
    -- Get current policy group
    SELECT TELP_LPGID INTO v_policy_group_id
    FROM TELP_TBL 
    WHERE TELP_EMPID = p_employee_id 
        AND TELP_ACTIVE = TRUE 
        AND TELP_EFFORM <= p_calculation_date
        AND (TELP_EFFTO IS NULL OR TELP_EFFTO >= p_calculation_date)
    LIMIT 1;
    
    -- Get entitlement based on service years and policy
    SELECT MLER_ENTDAY 
        INTO p_entitled_days
    FROM MLER_TBL
    WHERE MLER_LPGID = v_policy_group_id
        AND MLER_LETID = p_leave_type_id
        AND v_service_years >= MLER_EFFROM
        AND v_service_years < MLER_EFFTO
        AND MLER_ACTIVE = TRUE
        AND MLER_EFFROM <= p_calculation_date
        AND (MLER_EFFTO IS NULL OR MLER_EFFTO >= p_calculation_date)
    ORDER BY MLER_YFROM DESC
    LIMIT 1;

    -- If no rule matched, default to 0
    IF p_entitled_days IS NULL THEN
        p_entitled_days := 0;
    END IF;

    RETURN p_entitled_days;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

-- Additional indexes for better query performance
CREATE INDEX idx_leave_applications_employee_status ON TLEA_TBL(TLEA_EMPID, TLEA_STATUS);
CREATE INDEX idx_leave_applications_dates ON TLEA_TBL(TLEA_START, TLEA_END);
CREATE INDEX idx_leave_balances_employee_year ON TELB_TBL(TELB_EMPID, TELB_BALYR);
CREATE INDEX idx_entitlement_rules_service_years ON MLER_TBL(MLER_YFROM, MLER_YTO);

-- =================================================================
-- CONSTRAINTS AND BUSINESS RULES
-- =================================================================

-- Ensure leave application dates are logical
ALTER TABLE TLEA_TBL 
ADD CONSTRAINT chk_leave_dates 
CHECK (TLEA_END >= TLEA_START);

-- Ensure working days DO NOT exceed total days
ALTER TABLE TLEA_TBL 
ADD CONSTRAINT chk_working_days 
CHECK (TLEA_WRKDAY <= TLEA_TTLDAY);

-- Ensure service year ranges are logical
ALTER TABLE MLER_TBL 
ADD CONSTRAINT chk_service_years 
CHECK (MLER_YTO > MLER_YFROM);
--CHECK (service_years_to > service_years_from);

-- Ensure positive entitlement days
ALTER TABLE MLER_TBL--leave_entitlement_rules 
ADD CONSTRAINT chk_positive_entitlement 
CHECK (MLER_ENTDAY >= 0);

-- =================================================================
-- NOTES ON IMPLEMENTATION
-- =================================================================

/*
KEY FEATURES SUPPORTED:

1. FLEXIBLE LEAVE TYPES
   - Configurable leave types with various properties
   - Support for statutory vs. organizational leaves
   - Medical certificate requirements
   - Payroll impact flags

2. MULTIPLE POLICY GROUPS
   - Different entitlements for different employee levels
   - Priority-based policy assignment
   - Time-bound policy effectiveness

3. SERVICE-BASED ENTITLEMENTS
   - Automatic calculation based on service years
   - Supports Employment Act 1955 tiered structure
   - Configurable service year ranges

4. ACCRUAL METHODS
   - Yearly advance provisioning
   - Monthly accrual
   - Daily accrual
   - Prorated calculations

5. CARRY FORWARD LOGIC
   - Configurable carry forward limits
   - Expiry date tracking
   - Different rules per leave type

6. AUDIT TRAIL
   - Complete transaction history
   - Balance adjustment tracking
   - Approval workflow logging

7. CALENDAR INTEGRATION
   - Public holiday management by state
   - Working pattern configuration
   - Accurate working day calculations

8. BUSINESS RULE ENFORCEMENT
   - Database constraints
   - Calculated fields
   - Validation checks

USAGE EXAMPLES:

1. To add a new leave type:
   INSERT INTO leave_types (leave_type_code, leave_type_name, ...) VALUES (...);

2. To assign an employee to a policy group:
   INSERT INTO employee_leave_policies (employee_id, policy_group_id, effective_from) VALUES (...);

3. To calculate entitlement:
   CALL sp_calculate_leave_entitlement(employee_id, leave_type_id, calculation_date, @entitled_days);

4. To check current balances:
   SELECT * FROM v_employee_leave_summary WHERE employee_id = ?;

This schema provides a solid foundation for Malaysian HRMS leave management
while maintaining flexibility for organizational customization.
*/