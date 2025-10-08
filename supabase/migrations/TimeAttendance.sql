--tclock_tbl = raw taps (all clocking actions).
--ttat_tbl = daily summary (earliest IN, latest OUT, total breaks, net work hours).
--Trigger automatically updates ttat_tbl when:
  --CLOCK_IN → set earliest IN.
  --CLOCK_OUT → set latest OUT, recalc work duration.
  --BREAK_IN/OUT → accumulates into ttat_break_duration.

CREATE TABLE tclock_tbl ( -- raw clocking event data
    tclock_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tentid UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    tclock_empid UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    tclock_event_time TIMESTAMPTZ NOT NULL,
    tclock_event_type TEXT CHECK (tclock_event_type IN ('CLOCK_IN','CLOCK_OUT','BREAK_IN','BREAK_OUT')) NOT NULL,
    tclock_source TEXT NOT NULL,
    tclock_device_info TEXT,
    tclock_location TEXT,
    tclock_location_name TEXT,
    tclock_ip_address INET,
    tclock_photo TEXT;
    tclock_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ttat_tbl ( --timesheet attendance data 
    ttat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tentid UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    ttat_empid UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    ttat_date DATE NOT NULL,
    ttat_clock_in_time TIMESTAMPTZ,
    ttat_clock_out_time TIMESTAMPTZ,
    ttat_total_break INTERVAL DEFAULT interval '0',
    ttat_work_duration INTERVAL,
    ttat_status TEXT, -- e.g., ON_TIME, LATE, ABSENT, OVERTIME
    ttat_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ttat_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_emp_date UNIQUE (tentid, ttat_empid, ttat_date)
);


CREATE TABLE tbreak_tbl (
    tbreak_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tentid UUID NOT NULL REFERENCES mtent_tbl(mtent_tentid) ON DELETE CASCADE,
    tbreak_empid UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    tbreak_date DATE NOT NULL,
    tbreak_in_time TIMESTAMPTZ,
    tbreak_out_time TIMESTAMPTZ,
    tbreak_duration INTERVAL,
    tbreak_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE OR REPLACE FUNCTION process_clock_event()
RETURNS TRIGGER AS $$
DECLARE
    rec ttat_tbl;
    break_row tbreak_tbl;
    work_dur INTERVAL;
    break_dur INTERVAL;
BEGIN
    -- Ensure attendance record exists for the employee on that date
    INSERT INTO ttat_tbl (tentid, ttat_empid, ttat_date)
    VALUES (NEW.tentid, NEW.tclock_empid, NEW.tclock_event_time::DATE)
    ON CONFLICT (tentid, ttat_empid, ttat_date) DO NOTHING;

    -- Lock and fetch current attendance record
    SELECT * INTO rec 
    FROM ttat_tbl
    WHERE tentid = NEW.tentid
      AND ttat_empid = NEW.tclock_empid
      AND ttat_date = NEW.tclock_event_time::DATE
    FOR UPDATE;

    -- Handle main events
    IF NEW.tclock_event_type = 'CLOCK_IN' THEN
        IF rec.ttat_clock_in_time IS NULL OR NEW.tclock_event_time < rec.ttat_clock_in_time THEN
            UPDATE ttat_tbl
            SET ttat_clock_in_time = NEW.tclock_event_time,
                ttat_updated_at = now()
            WHERE ttat_id = rec.ttat_id;
        END IF;

    ELSIF NEW.tclock_event_type = 'CLOCK_OUT' THEN
        IF rec.ttat_clock_out_time IS NULL OR NEW.tclock_event_time > rec.ttat_clock_out_time THEN
            UPDATE ttat_tbl
            SET ttat_clock_out_time = NEW.tclock_event_time,
                ttat_updated_at = now()
            WHERE ttat_id = rec.ttat_id;
        END IF;

    ELSIF NEW.tclock_event_type = 'BREAK_IN' THEN
        -- Create a break record with IN time only
        INSERT INTO tbreak_tbl (tentid, tbreak_empid, tbreak_date, tbreak_in_time)
        VALUES (NEW.tentid, NEW.tclock_empid, NEW.tclock_event_time::DATE, NEW.tclock_event_time);

    ELSIF NEW.tclock_event_type = 'BREAK_OUT' THEN
        -- Attach to latest open break
        SELECT * INTO break_row
        FROM tbreak_tbl
        WHERE tentid = NEW.tentid
          AND tbreak_empid = NEW.tclock_empid
          AND tbreak_date = NEW.tclock_event_time::DATE
          AND tbreak_out_time IS NULL
        ORDER BY tbreak_in_time DESC
        LIMIT 1;

        IF FOUND THEN
            UPDATE tbreak_tbl
            SET tbreak_out_time = NEW.tclock_event_time,
                tbreak_duration = NEW.tclock_event_time - tbreak_in_time
            WHERE tbreak_id = break_row.tbreak_id;

            -- Add break duration to total
            UPDATE ttat_tbl
            SET ttat_total_break = COALESCE(ttat_total_break, interval '0') + (NEW.tclock_event_time - break_row.tbreak_in_time),
                ttat_updated_at = now()
            WHERE ttat_id = rec.ttat_id;
        END IF;
    END IF;

    -- Recalculate work duration if IN and OUT exist
    SELECT * INTO rec 
    FROM ttat_tbl
    WHERE ttat_id = rec.ttat_id;

    IF rec.ttat_clock_in_time IS NOT NULL AND rec.ttat_clock_out_time IS NOT NULL THEN
        work_dur := rec.ttat_clock_out_time - rec.ttat_clock_in_time;
        break_dur := COALESCE(rec.ttat_total_break, interval '0');
        UPDATE ttat_tbl
        SET ttat_work_duration = work_dur - break_dur,
            ttat_updated_at = now()
        WHERE ttat_id = rec.ttat_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_clock_event
AFTER INSERT ON tclock_tbl
FOR EACH ROW
EXECUTE FUNCTION process_clock_event();

ALTER TABLE tclock_tbl ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttat_tbl ENABLE ROW LEVEL SECURITY;
ALTER TABLE tbreak_tbl ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;


-- Allow tenant users to insert their own clocking events
CREATE POLICY "Allow insert clock events by tenant"
ON tclock_tbl
FOR INSERT
USING (tentid::text = auth.jwt() ->> 'tenant_id')
WITH CHECK (tentid::text = auth.jwt() ->> 'tenant_id');

-- Allow tenant users to read their own clocking events
CREATE POLICY "Allow select clock events by tenant"
ON tclock_tbl
FOR SELECT
USING (tentid::text = auth.jwt() ->> 'tenant_id');


--drop table tclock
--drop table ttat_tbl
--drop function

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

--select * from mtent_tbl
--select * from mess_tbl

CREATE TABLE tgeo_tbl (
  tgeo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tgeo_lat_round DOUBLE PRECISION NOT NULL,
  tgeo_lng_round DOUBLE PRECISION NOT NULL,
  tgeo_display_name TEXT,
  tgeo_city TEXT,
  tgeo_state TEXT,
  tgeo_country TEXT,
  tgeo_postcode TEXT,
  tgeo_source TEXT,
  tgeo_created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tgeo_lat_round, tgeo_lng_round)
);