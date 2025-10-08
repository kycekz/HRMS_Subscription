-- Update the test user role to ADMIN so they can access the My Team tab
UPDATE mess_tbl 
SET mess_role = 'ADMIN' 
WHERE mess_email = 'lau@ace.com';