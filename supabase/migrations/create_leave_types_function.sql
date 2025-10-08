-- Create RPC function to get employee leave types based on the specified query logic
CREATE OR REPLACE FUNCTION get_employee_leave_types(
    p_mess_email TEXT,
    p_tentid UUID
)
RETURNS TABLE (
    mess_id TEXT,
    mess_email TEXT,
    tentid UUID,
    telp_empid TEXT,
    telp_lpgid TEXT,
    telp_efform DATE,
    mlpg_lpgid TEXT,
    mler_letid TEXT,
    mlet_name TEXT,
    mler_yfrom NUMERIC,
    mler_yto NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.mess_id::TEXT,
        m.mess_email,
        m.tentid,
        t.telp_empid,
        t.telp_lpgid,
        t.telp_efform,
        mlpg.mlpg_lpgid,
        mler.mler_letid,
        mlet.mlet_name,
        mler.mler_yfrom,
        mler.mler_yto
    FROM telp_tbl t
    JOIN mlpg_tbl mlpg ON t.telp_lpgid = mlpg.mlpg_lpgid
    JOIN mler_tbl mler ON mlpg.mlpg_lpgid = mler.mler_lpgid
    JOIN mlet_tbl mlet ON mler.mler_letid = mlet.mlet_letid
    JOIN employees e ON t.telp_empid = e.id
    JOIN mess_tbl m ON m.mess_empid = e.id
    WHERE m.mess_email = p_mess_email
    AND m.tentid = p_tentid
    AND t.tentid = p_tentid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;