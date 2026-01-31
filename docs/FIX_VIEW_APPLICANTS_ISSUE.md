# Fix: View Applicants Not Showing Applications

## Problem
- Job applications are successfully saved to the `applications` table
- Applicants can see "Applied" status
- Organization users (job posters) cannot see applicants when clicking "View Applicants"
- Database query confirms records exist in `applications` table

## Root Causes (Most Common)

### 1. Missing Organization/Tenant Filter
The query fetching applicants is not filtering by the correct `org_id` or `tenant_id`.

### 2. Row Level Security (RLS) Policy Issue
Supabase RLS policies might be blocking the organization user from viewing applications.

### 3. Missing or Incorrect JOIN
The query might not be properly joining the `applications` table with the `jobs` table.

### 4. User Role/Permission Check
The code might be checking for wrong user role or missing permission check.

## Diagnostic Steps

### Step 1: Check the Applications Table Structure
```sql
-- Run this in Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applications';
```

### Step 2: Verify Data Exists
```sql
-- Check if applications exist
SELECT 
    a.*,
    j.title as job_title,
    j.org_id,
    j.tenant_id
FROM applications a
LEFT JOIN jobs j ON a.job_id = j.id
ORDER BY a.created_at DESC
LIMIT 10;
```

### Step 3: Check RLS Policies
```sql
-- View RLS policies on applications table
SELECT * FROM pg_policies WHERE tablename = 'applications';
```

## Solutions

### Solution 1: Fix the Query in View Applicants Component

Find the file that handles "View Applicants" functionality and update the query:

**Before (Likely Issue):**
```typescript
// Missing org_id or tenant_id filter
const { data: applicants } = await supabase
  .from('applications')
  .select('*')
  .eq('job_id', jobId);
```

**After (Fixed):**
```typescript
// Include proper filtering and joins
const { data: applicants, error } = await supabase
  .from('applications')
  .select(`
    *,
    jobs!inner (
      id,
      title,
      org_id,
      tenant_id
    ),
    profiles (
      id,
      full_name,
      email
    )
  `)
  .eq('job_id', jobId)
  .eq('jobs.org_id', currentUserOrgId)  // Filter by organization
  .eq('jobs.tenant_id', currentUserTenantId)  // Filter by tenant
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching applicants:', error);
}
```

### Solution 2: Fix RLS Policies

Add or update RLS policy for the `applications` table:

```sql
-- Drop existing policy if needed
DROP POLICY IF EXISTS "Organizations can view their job applications" ON applications;

-- Create new policy for organization users to view applications
CREATE POLICY "Organizations can view their job applications"
ON applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.org_id IN (
      SELECT org_id FROM morg_tbl
      WHERE tenant_id = (
        SELECT tenant_id FROM profiles
        WHERE id = auth.uid()
      )
    )
  )
);

-- Policy for applicants to view their own applications
CREATE POLICY "Users can view their own applications"
ON applications
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for applicants to insert applications
CREATE POLICY "Users can create applications"
ON applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Solution 3: Add Missing Table Relationships

If the `applications` table doesn't have proper foreign keys:

```sql
-- Add foreign key to jobs table if missing
ALTER TABLE applications
ADD CONSTRAINT fk_applications_job
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- Add foreign key to profiles/users if missing
ALTER TABLE applications
ADD CONSTRAINT fk_applications_user
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
```

### Solution 4: Debug the Frontend Component

Add console logging to debug:

```typescript
// In your View Applicants component
const fetchApplicants = async (jobId: string) => {
  console.log('Fetching applicants for job:', jobId);
  console.log('Current user org_id:', currentUserOrgId);
  console.log('Current user tenant_id:', currentUserTenantId);
  
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs!inner (id, title, org_id, tenant_id),
      profiles (id, full_name, email)
    `)
    .eq('job_id', jobId);
  
  console.log('Query result:', { data, error });
  console.log('Number of applicants:', data?.length || 0);
  
  if (error) {
    console.error('Error details:', error);
  }
  
  return data;
};
```

## Quick Test Query

Run this query in Supabase SQL Editor to verify the issue:

```sql
-- Replace with actual values from your database
SELECT 
    a.id as application_id,
    a.status,
    a.created_at,
    j.id as job_id,
    j.title as job_title,
    j.org_id,
    p.full_name as applicant_name,
    p.email as applicant_email
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN profiles p ON a.user_id = p.id
WHERE j.org_id = 'YOUR_ORG_ID_HERE'  -- Replace with actual org_id
ORDER BY a.created_at DESC;
```

## Next Steps

1. **Identify the View Applicants component file** - Search for files containing "View Applicants" or "ViewApplicants"
2. **Check the current query** - Look at how applications are being fetched
3. **Apply the appropriate fix** - Based on what you find, apply Solution 1, 2, or 3
4. **Test thoroughly** - Verify that organization users can now see applicants

## Need the Actual Files?

If you can provide:
- The component file that handles "View Applicants"
- The database schema for `jobs` and `applications` tables
- The current RLS policies

I can provide a more specific fix tailored to your codebase.
