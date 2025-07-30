# User and Vendor Blocking System Documentation

This project includes a comprehensive user and vendor management system with status controls that prevent blocked or pending users from publishing products.

## Overview

The system implements multi-level status management:
- **User Account Status**: Controls overall account access
- **Vendor Status**: Controls vendor-specific permissions
- **Product Publishing**: Only approved users and vendors can publish products

## User Account Statuses

### Status Types

1. **PENDING** 
   - New users start with this status
   - Cannot create or publish products
   - Awaiting admin approval

2. **APPROVED**
   - Active, verified users
   - Can create and publish products (if also approved vendor)
   - Full platform access

3. **BLOCKED**
   - Permanently blocked users
   - Cannot create products or access vendor features
   - Includes reason for blocking
   - Timestamp of when blocked

4. **SUSPENDED**
   - Temporarily suspended users
   - Cannot create products temporarily
   - Can be reactivated by admin

### Database Schema

```prisma
model User {
  // ... other fields
  accountStatus UserStatus @default(PENDING)
  isActive      Boolean @default(true)
  blockedAt     DateTime?
  blockedReason String?
}

enum UserStatus {
  PENDING
  APPROVED
  BLOCKED
  SUSPENDED
}
```

## Vendor Statuses

### Status Types

1. **PENDING**
   - New vendors awaiting approval
   - Cannot publish products
   - Must be approved by admin

2. **APPROVED**
   - Active, verified vendors
   - Can create and publish products
   - Full vendor platform access

3. **BLOCKED**
   - Permanently blocked vendors
   - Cannot create or publish products
   - Includes reason for blocking

4. **SUSPENDED**
   - Temporarily suspended vendors
   - Cannot publish products temporarily
   - Can be reactivated by admin

### Database Schema

```prisma
model Vendor {
  // ... other fields
  vendorStatus  VendorStatus @default(PENDING)
  approved      Boolean @default(false)
  blockedAt     DateTime?
  blockedReason String?
}

enum VendorStatus {
  PENDING
  APPROVED
  BLOCKED
  SUSPENDED
}
```

## Product Publishing Controls

### Validation Rules

Products are only visible to the public if:

1. **Product Status**: `published`
2. **User Status**: `APPROVED` and `isActive: true`
3. **Vendor Status**: `APPROVED` and `approved: true`

### API Implementation

#### Products API (`/api/products`)
```typescript
const where = {
  status: "published",
  user: {
    accountStatus: "APPROVED",
    isActive: true,
  },
  vendor: {
    vendorStatus: "APPROVED", 
    approved: true,
  },
};
```

#### Product Creation
The `createProduct` action includes comprehensive status checks:
- Validates user account status
- Validates vendor status
- Returns specific error messages for each blocking condition

## Admin Management

### User Management (`/admin/users`)

**Features:**
- View all users with current statuses
- Filter by account status
- Update user statuses with reason tracking
- View user activity (products, orders, vendors)

**Available Actions:**
- Approve pending users
- Block users with reason
- Suspend users temporarily
- Reactivate suspended users

### Vendor Management (`/admin/vendors-status`)

**Features:**
- View all vendors with current statuses
- Filter by vendor status
- Update vendor statuses with reason tracking
- View vendor activity (products, orders)

**Available Actions:**
- Approve pending vendors
- Block vendors with reason
- Suspend vendors temporarily
- Reactivate suspended vendors

## API Endpoints

### User Management
- `GET /api/admin/users` - List users with status filtering
- `PUT /api/admin/users` - Update user status

### Vendor Management  
- `GET /api/admin/vendors-status` - List vendors with status filtering
- `PUT /api/admin/vendors-status` - Update vendor status

### Authentication Middleware
- `requireVendor()` - Validates vendor access with status checks
- `requireUser()` - Validates user access with status checks

## Status Check Flow

### For Product Creation:
1. **Authentication Check**: User must be logged in
2. **User Status Check**: User must be APPROVED and active
3. **Vendor Status Check**: Vendor must be APPROVED and approved
4. **Product Creation**: Only then can products be created

### For Product Display:
1. **Database Query**: Products filtered by user and vendor status
2. **Public API**: Only shows products from approved users/vendors
3. **Cache Management**: Status changes invalidate relevant caches

## Error Messages

The system provides specific error messages for each blocking condition:

### User Account Errors
- `"Your account is pending approval. Please wait for admin approval before creating products."`
- `"Your account has been blocked and cannot create products. Reason: [reason]"`
- `"Your account is temporarily suspended. Please contact support."`
- `"Your account is inactive. Please contact support."`

### Vendor Account Errors
- `"Your vendor account is pending approval. Please wait for admin approval before creating products."`
- `"Your vendor account has been blocked and cannot create products. Reason: [reason]"`
- `"Your vendor account is temporarily suspended. Please contact support."`

## Setup and Migration

### Initial Setup

1. **Run Migration**:
   ```bash
   npm run prisma-migrate-dev
   ```

2. **Update Existing Users**:
   ```bash
   npm run update-user-statuses
   ```

3. **Set Admin Users**:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
   UPDATE "User" SET accountStatus = 'APPROVED' WHERE role = 'ADMIN';
   ```

### Default Behavior

- **New Users**: Start with `PENDING` status
- **Existing Users**: Updated to `APPROVED` status via migration script
- **New Vendors**: Start with `PENDING` status and `approved: false`
- **Existing Vendors**: Updated to `APPROVED` status via migration script

## Security Features

### Access Control
- Role-based access (ADMIN only for status management)
- Status validation at API level
- Middleware protection for vendor operations

### Audit Trail
- Blocked timestamps (`blockedAt`)
- Blocked reasons (`blockedReason`)
- Status change tracking via `updatedAt`

### Data Integrity
- Cascading status checks (user AND vendor must be approved)
- Consistent error handling
- Transaction safety for status updates

## Monitoring and Analytics

### Admin Dashboard Metrics
- Total users by status
- Total vendors by status
- Recent status changes
- User activity levels

### Status Distribution
```typescript
// Example status breakdown
const userStats = await prisma.user.groupBy({
  by: ['accountStatus'],
  _count: { id: true }
});
```

## Best Practices

### For Admins
1. **Review Pending Users**: Regularly check for new user approvals
2. **Document Blocking**: Always provide clear reasons when blocking
3. **Monitor Activity**: Track user/vendor activity before status changes
4. **Communicate Changes**: Notify users of status changes when appropriate

### For Developers
1. **Status Validation**: Always check status before sensitive operations
2. **Error Handling**: Provide clear, actionable error messages
3. **Cache Invalidation**: Clear caches when statuses change
4. **Testing**: Include status scenarios in test cases

## Troubleshooting

### Common Issues

1. **Products Not Showing**
   - Check user account status
   - Check vendor status
   - Verify product status is "published"

2. **Cannot Create Products**
   - Verify user is APPROVED
   - Verify vendor is APPROVED
   - Check for blocking reasons

3. **Status Not Updating**
   - Check admin permissions
   - Verify API responses
   - Check database constraints

### Debugging Steps

1. **Check User Status**:
   ```sql
   SELECT id, email, accountStatus, isActive, blockedAt 
   FROM "User" 
   WHERE email = 'user@example.com';
   ```

2. **Check Vendor Status**:
   ```sql
   SELECT v.id, v.vendorStatus, v.approved, v.blockedAt, u.email
   FROM "Vendor" v
   JOIN "User" u ON v.userId = u.id
   WHERE u.email = 'vendor@example.com';
   ```

3. **Check Product Visibility**:
   ```sql
   SELECT p.name, p.status, u.accountStatus, v.vendorStatus
   FROM "Product" p
   JOIN "User" u ON p.userId = u.id
   JOIN "Vendor" v ON p.vendorId = v.id
   WHERE p.id = 'product-id';
   ```

This system ensures that only approved, active users and vendors can publish products, maintaining platform quality and security.
