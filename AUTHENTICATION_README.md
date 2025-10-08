# HRMS Authentication Architecture

## Overview
The HRMS system uses custom multi-tenant authentication with permissive Row-Level Security (RLS) policies and application-level tenant filtering. This hybrid approach ensures secure tenant separation while maintaining compatibility with the existing authentication system.

## Core Components

### 1. User Context Structure
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant_id: string;
  tenant_name: string;
  accessible_tenants?: Tenant[];
  muser_system_role?: string;
}
```

### 2. AuthContext (`src/contexts/AuthContext.tsx`)
**Purpose**: Manages user authentication state and tenant context

**Key Functions**:
- `login(userData)`: Authenticates user and stores tenant context
- `logout()`: Clears user session and context
- `switchTenant(tenantId)`: Updates tenant context in state and localStorage

**Usage**:
```typescript
const { user, login, logout, switchTenant } = useAuth();

// Login with tenant context
login({
  id: 'user-uuid',
  email: 'user@example.com',
  tenant_id: 'tenant-uuid',
  tenant_name: 'Company Name',
  role: 'admin'
});

// Switch tenant context
switchTenant('new-tenant-uuid');
```

### 3. Tenant-Aware Database Operations (`src/utils/tenantAwareSupabase.ts`)
**Purpose**: Provides database operations with automatic tenant isolation

**Key Features**:
- Authentication validation before operations
- Manual tenant filtering for queries
- Automatic tentid injection for inserts
- Permissive RLS policies for authenticated operations

**Usage**:
```typescript
const tenantDb = useTenantSupabase();

// All operations are tenant-filtered at application level
const { data } = await tenantDb.employees.select('*'); // Filtered by tentid
await tenantDb.employees.insert(employeeData); // tentid automatically added
```

## Database Schema

### 1. Row-Level Security Policies
All tenant-aware tables have permissive RLS policies that allow authenticated operations:

```sql
CREATE POLICY "Allow authenticated operations on [table]" ON [table]
FOR ALL USING (true) WITH CHECK (true);
```

Tenant isolation is enforced at the application level through manual filtering.

### 2. Tenant-Aware Tables
Tables with `tentid` column and RLS policies:
- `employees`
- `payroll_periods`
- `payroll_records`
- `employee_allowances`
- `employee_deductions`
- `employee_tax_reliefs`
- `payroll_items`
- `morg_tbl` (organizations)
- `morgaddr_tbl` (organization addresses)
- `morgstat_tbl` (organization statutory)

### 3. Database Functions
Functions accept tenant_id as parameter for explicit tenant context:

```sql
-- Example: process_payrun function
CREATE OR REPLACE FUNCTION process_payrun(
  month integer, 
  payrollcycle integer, 
  year integer, 
  tenant_id uuid DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  current_tenant_id uuid;
BEGIN
  -- Use provided tenant_id
  current_tenant_id := tenant_id;
  
  -- Function logic with explicit tenant filtering
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Development Guidelines

### 1. Creating New Modules

#### Step 1: Database Table Setup
```sql
-- Add tentid column to new table
ALTER TABLE new_table ADD COLUMN tentid uuid REFERENCES mtent_tbl(mtent_tentid);

-- Create permissive RLS policy
CREATE POLICY "Allow authenticated operations on new_table" ON new_table
FOR ALL USING (true) WITH CHECK (true);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

#### Step 2: Add to tenantAwareSupabase.ts
```typescript
// Add new table operations
newTable: {
  select: (columns = '*') => tenantFilter(supabase.from('new_table').select(columns)),
  insert: (data: any) => supabase.from('new_table').insert({ ...data, tentid: user?.tenant_id }),
  update: (data: any) => tenantFilter(supabase.from('new_table').update(data)),
  delete: () => tenantFilter(supabase.from('new_table').delete()),
}
```

#### Step 3: Use in Components
```typescript
const NewComponent = () => {
  const tenantDb = useTenantSupabase();
  
  const fetchData = async () => {
    // Application-level filtering by tenant
    const { data } = await tenantDb.newTable.select('*');
  };
  
  const saveData = async (formData) => {
    // tentid automatically added
    await tenantDb.newTable.insert(formData);
  };
};
```

### 2. Error Handling

#### Common Errors and Solutions:
```typescript
// No tenant context
if (!user?.tenant_id) {
  throw new Error('No authenticated user or tenant context available');
}

// Database operation error
catch (error) {
  if (error.message.includes('tentid')) {
    console.error('Tenant context error:', error);
    // Handle re-authentication or tenant switching
  }
}

// Authentication lost
catch (error) {
  if (error.message.includes('authentication')) {
    // Trigger re-authentication
    logout();
  }
}
```

### 3. Testing Tenant Isolation

#### Verify Tenant Filtering:
```sql
-- Test tenant filtering manually
SELECT * FROM employees WHERE tentid = 'tenant-1-uuid'; -- Should only return tenant-1 employees
SELECT * FROM employees WHERE tentid = 'tenant-2-uuid'; -- Should only return tenant-2 employees
```

#### Component Testing:
```typescript
// Mock different tenant contexts
const mockUser1 = { tenant_id: 'tenant-1', tenant_name: 'Company A' };
const mockUser2 = { tenant_id: 'tenant-2', tenant_name: 'Company B' };

// Test data isolation between tenants
```

## Security Considerations

### 1. Application-Level Security
- User context contains tenant_id for application-level isolation
- Tenant context is validated before database operations
- Authentication state managed in React context and localStorage

### 2. Database Security
- All tenant-aware tables have permissive RLS policies enabled
- Database functions use SECURITY DEFINER for controlled access
- Explicit tenant_id parameters in function calls for context

### 3. Application Security
- Authentication required before any database operations
- Tenant context validated in AuthContext
- Error handling for authentication failures

## Migration Guide

### From Strict RLS to Permissive RLS with Application Filtering:

1. **Update Database**: Apply permissive RLS policies migration
2. **Maintain AuthContext**: Keep existing authentication system
3. **Maintain tenantAwareSupabase**: Keep manual filtering
4. **Update Components**: Ensure tenant_id parameters are passed
5. **Test**: Verify tenant isolation works correctly

### Key Changes:
- RLS policies are now permissive (allow all authenticated operations)
- Tenant isolation enforced at application level
- Database functions accept explicit tenant_id parameters
- Manual tenant filtering maintained in queries

## Troubleshooting

### Common Issues:

1. **"No tenant context provided"**
   - Ensure user is properly authenticated
   - Check user context contains tenant_id
   - Verify AuthContext is properly initialized

2. **"No tenant context available for insert"**
   - Check user authentication state
   - Verify tenant_id is present in user context
   - Ensure tenantAwareSupabase has valid user context

3. **"No authenticated user or tenant context available"**
   - User needs to log in again
   - Check AuthContext state
   - Verify localStorage contains valid user data

### Debug Commands:
```typescript
// Check current user context
const { user } = useAuth();
console.log('User context:', user);

// Check localStorage
const storedUser = localStorage.getItem('hrms_user');
console.log('Stored user:', JSON.parse(storedUser || '{}'));

// Test database connection with tenant filter
const tenantDb = useTenantSupabase();
const { data, error } = await tenantDb.employees.select('count');
console.log('DB test:', { data, error });
```

## Best Practices

1. **Always use tenantAwareSupabase** for database operations
2. **Handle authentication errors** gracefully with user feedback
3. **Test tenant isolation** thoroughly in development
4. **Keep user context secure** and validate before operations
5. **Use TypeScript** for better type safety with tenant context
6. **Log tenant context** in debug mode for troubleshooting
7. **Validate user permissions** before sensitive operations
8. **Monitor authentication state** and handle session expiration

## Future Enhancements

1. **True JWT-based Authentication**: Migrate to Supabase Auth with JWT tokens
2. **Role-based Access Control**: Extend user context to include detailed permissions
3. **Audit Logging**: Track all tenant-aware operations
4. **Multi-region Support**: Extend tenant isolation to geographic regions
5. **API Rate Limiting**: Implement per-tenant rate limiting
6. **Advanced Security**: Add IP whitelisting and device fingerprinting