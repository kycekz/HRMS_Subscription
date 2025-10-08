# Leave Management System

## Overview
The Leave Management System allows employees to apply for leave through the Employee Self Service (ESS) portal. The system includes leave balance tracking, application workflow, and approval management.

## Features

### Employee Features
- **Apply for Leave**: Submit leave applications with automatic working days calculation
- **View Leave Balance**: Check available leave balance by leave type
- **Track Applications**: View status of submitted leave applications
- **Leave History**: View past leave applications and their status

### System Features
- **Multiple Leave Types**: Support for Annual Leave, Medical Leave, Emergency Leave, etc.
- **Balance Validation**: Prevents applications exceeding available balance
- **Working Days Calculation**: Automatically excludes weekends from leave calculations
- **Tenant Isolation**: Multi-tenant support with proper data isolation

## Database Schema

### Key Tables
- `TLEA_TBL`: Leave applications
- `MLET_TBL`: Leave types configuration
- `TELB_TBL`: Employee leave balances
- `MLPG_TBL`: Leave policy groups
- `MLER_TBL`: Leave entitlement rules

### Leave Application Workflow
1. **PENDING**: Initial status when application is submitted
2. **APPROVED**: Application approved by manager/admin
3. **REJECTED**: Application rejected with reason

## Usage

### Accessing Leave Management
1. Login to the ESS system
2. Navigate to the "Leave" tab in the main navigation
3. Click "Apply Leave" to submit a new application
4. View existing applications in the list below

### Applying for Leave
1. Select leave type from dropdown
2. Choose start and end dates
3. System automatically calculates working days
4. Enter reason for leave
5. Submit application (validates against available balance)

### Viewing Applications
- Filter by status (All, Pending, Approved, Rejected)
- View application details including dates, duration, and status
- See rejection reasons for rejected applications

## Configuration

### Leave Types
Configure leave types in `MLET_TBL`:
- `MLET_NAME`: Display name (e.g., "Annual Leave")
- `MLET_CODE`: Short code (e.g., "AL")
- `MLET_MEDCERT`: Whether medical certificate is required
- `MLET_PAYROLL`: Whether leave affects payroll

### Leave Balances
Employee balances are stored in `TELB_TBL`:
- `TELB_ENTDAY`: Entitled days for the year
- `TELB_USEDDAY`: Days already used
- `TELB_CURRBAL`: Current available balance
- `TELB_CFDAY`: Carried forward days from previous year

## Installation

### Database Setup
1. Run the main leave management migration:
   ```sql
   -- Run supabase/migrations/LeaveManagement.sql
   ```

2. Add tenant isolation:
   ```sql
   -- Run supabase/migrations/add_tentid_to_leave_tables.sql
   ```

3. Populate sample data (optional):
   ```sql
   -- Run supabase/migrations/populate_sample_leave_data.sql
   ```

### Frontend Components
The system includes the following React components:
- `LeaveApplication.tsx`: Leave application form
- `LeaveApplicationList.tsx`: List and manage applications
- Updated `MyTeam.tsx`: Team leave management view
- Updated navigation and routing

## Best Practices

### For Employees
- Apply for leave well in advance
- Provide clear reasons for leave applications
- Check leave balance before applying
- Follow company policies for medical leave documentation

### For Administrators
- Review applications promptly
- Provide clear rejection reasons when declining
- Monitor team leave balances
- Ensure leave policies are properly configured

## Technical Notes

### Working Days Calculation
- Excludes weekends (Saturday and Sunday)
- Does not currently account for public holidays (can be enhanced)
- Calculates inclusive of start and end dates

### Tenant Isolation
- All leave data is isolated by `tentid`
- Uses application-level filtering for security
- Follows the same pattern as other ESS modules

### Error Handling
- Validates leave balance before submission
- Prevents invalid date ranges
- Handles database errors gracefully
- Provides user-friendly error messages

## Future Enhancements

1. **Public Holiday Integration**: Exclude public holidays from working days calculation
2. **Email Notifications**: Notify managers of pending applications
3. **Approval Workflow**: Multi-level approval process
4. **Leave Calendar**: Visual calendar view of team leave
5. **Reporting**: Leave utilization and trend reports
6. **Mobile Optimization**: Enhanced mobile experience
7. **Document Upload**: Attach medical certificates or supporting documents