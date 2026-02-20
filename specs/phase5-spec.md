# Phase 5: User Management & Advanced Features - Specification

## Overview
Phase 5 focuses on enhancing the admin system with multi-user support, improved security, advanced management features, and better user experience.

---

## 📋 Features to Implement

### 1. **Multiple Admin Accounts** ✅
- Register multiple admin users
- Role-based access control (RBAC)
  - Super Admin: Full access
  - Admin: Standard access
  - Viewer: Read-only access
- Admin management page (Super Admin only)
- Active/Inactive status toggle

### 2. **Password Reset Flow** ✅
- Forgot password page
- Email reset token generation
- Secure token expiration (1 hour)
- Password reset form
- Token validation and usage tracking

### 3. **Activity Logs Viewer** ✅
- Log all admin actions
  - Login/logout
  - Create/Update/Delete operations
  - Status changes
- Activity logs dashboard
- Filter by admin, action type, date range
- IP address and user agent tracking

### 4. **Advanced Submission Filtering** ✅
- Date range picker
- Filter by category/service
- Search by message content
- Sort by various fields
- Save filter presets

### 5. **Email Notifications** ✅
- New submission alert to admins
- Customer auto-reply (already in Phase 1, enhance)
- Weekly digest email
- Notification preferences per admin

### 6. **Profile Management** ✅
- Edit profile (name, email)
- Change password
- Upload profile picture
- Notification preferences
- Last login display

---

## 🗄️ Database Changes

### New Tables
```sql
-- Admin profiles (extends admins table)
CREATE TABLE admin_profiles (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
  avatar_url VARCHAR(500),
  phone VARCHAR(50),
  department VARCHAR(100),
  notification_preferences JSONB DEFAULT '{"email": true, "weekly_digest": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens (already exists, enhance)
ALTER TABLE password_reset_tokens 
ADD COLUMN used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN ip_address VARCHAR(50);

-- Activity logs enhancement (already exists)
-- Already has all required fields

-- Notification queue
CREATE TABLE notification_queue (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admins(id),
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(200),
  body TEXT,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 New API Endpoints

### Admin Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/admins | List all admins | Super Admin |
| GET | /api/admins/:id | Get admin details | Super Admin |
| POST | /api/admins | Create admin | Super Admin |
| PUT | /api/admins/:id | Update admin | Super Admin |
| DELETE | /api/admins/:id | Delete admin | Super Admin |
| PUT | /api/admins/:id/toggle-status | Toggle active status | Super Admin |

### Profile
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/profile | Get current admin profile | All Admins |
| PUT | /api/profile | Update profile | All Admins |
| PUT | /api/profile/change-password | Change password | All Admins |
| POST | /api/profile/upload-avatar | Upload avatar | All Admins |

### Password Reset
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/forgot-password | Request reset token | Public |
| POST | /api/auth/reset-password | Reset password | Public |
| GET | /api/auth/verify-token/:token | Verify reset token | Public |

### Activity Logs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/activity-logs | Get activity logs | Admin |
| GET | /api/activity-logs/stats | Get activity statistics | Admin |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/notifications | Get notifications | Admin |
| PUT | /api/notifications/:id/read | Mark as read | Admin |
| PUT | /api/notifications/preferences | Update preferences | Admin |

---

## 🎨 UI Components

### New Pages
1. **Admin Management** (`/admin/admins`)
   - List all admins
   - Create/Edit admin
   - Role assignment
   - Toggle active status

2. **Activity Logs** (`/admin/activity-logs`)
   - Filterable log table
   - Admin activity timeline
   - Export logs

3. **Profile Page** (`/admin/profile`)
   - Edit profile form
   - Change password
   - Upload avatar
   - Notification preferences

4. **Forgot Password** (`/admin/forgot-password`)
   - Email input form
   - Success message
   - Back to login link

5. **Reset Password** (`/admin/reset-password/:token`)
   - New password form
   - Confirm password
   - Token validation

### Enhanced Components
1. **AdminDashboard** - Add activity feed widget
2. **Navbar** - Show profile picture, notification badge
3. **Submission Filters** - Add date range picker, advanced filters

---

## 🔐 Security Enhancements

### 1. Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### 2. Token Security
- Cryptographically secure random tokens
- 1-hour expiration
- Single use only
- IP address tracking

### 3. Rate Limiting
- Password reset: 3 requests per hour per email
- Login: 5 failed attempts per 15 minutes
- Admin creation: 10 per hour per IP

### 4. Audit Trail
- Log all sensitive operations
- Track IP addresses
- Store user agent
- Timestamp all actions

---

## 📊 Activity Log Actions

### Authentication
- `login` - Admin logged in
- `logout` - Admin logged out
- `failed_login` - Failed login attempt
- `password_reset_requested` - Password reset requested
- `password_reset_completed` - Password reset completed

### Admin Management
- `admin_created` - New admin created
- `admin_updated` - Admin details updated
- `admin_deleted` - Admin deleted
- `admin_status_changed` - Active/inactive toggled

### Submissions
- `submission_created` - New contact submission
- `submission_viewed` - Submission viewed
- `submission_status_changed` - Status updated
- `submission_deleted` - Submission deleted
- `submissions_exported` - CSV export

### Content Management
- `service_created`, `service_updated`, `service_deleted`
- `project_created`, `project_updated`, `project_deleted`
- `testimonial_created`, `testimonial_updated`, `testimonial_deleted`

---

## 📧 Email Templates

### 1. Password Reset
```
Subject: Password Reset Request - H&E Works Admin

Hi {Admin Name},

We received a request to reset your password. Click the link below to reset it:

[Reset Password] ({reset_link})

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Thanks,
H&E Works Team
```

### 2. New Admin Account Created
```
Subject: Welcome to H&E Works Admin Panel

Hi {Admin Name},

Your admin account has been created!

Email: {email}
Role: {role}

[Login Here] ({login_link})

Temporary Password: {temp_password}

Please change your password after logging in.

Thanks,
H&E Works Team
```

### 3. Weekly Digest
```
Subject: Weekly Activity Report - {date_range}

Hi {Admin Name},

Here's your weekly activity summary:

📊 Submissions: {total_submissions} (+{growth}%)
   - New: {new_count}
   - Replied: {replied_count}

👥 Team Activity: {total_actions}
   - Most active: {top_admin}

📈 Top Services: {top_services}

[View Full Report] ({dashboard_link})

Thanks,
H&E Works Team
```

---

## 🚀 Implementation Plan

### Week 1: Core Features
- [ ] Multiple admin accounts
- [ ] Role-based access control
- [ ] Admin management UI
- [ ] Password reset flow

### Week 2: Enhanced Features
- [ ] Activity logs viewer
- [ ] Profile management
- [ ] Advanced filtering
- [ ] Email notifications

### Week 3: Polish & Testing
- [ ] UI/UX improvements
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation

---

## ✅ Acceptance Criteria

### Multiple Admin Accounts
- [ ] Super Admin can create/edit/delete admins
- [ ] Role permissions enforced on backend
- [ ] Role permissions enforced on frontend
- [ ] Cannot delete own account
- [ ] At least one active Super Admin required

### Password Reset
- [ ] Forgot password form validates email
- [ ] Reset token sent via email
- [ ] Token expires after 1 hour
- [ ] Token can only be used once
- [ ] Password requirements enforced

### Activity Logs
- [ ] All actions logged automatically
- [ ] Logs viewable in admin dashboard
- [ ] Filter by admin, action, date
- [ ] Export logs to CSV
- [ ] IP addresses tracked

### Email Notifications
- [ ] New submission alerts sent
- [ ] Weekly digest scheduled
- [ ] Notification preferences saved
- [ ] Email templates branded
- [ ] Fallback for failed sends

---

## 📝 Notes

### Backward Compatibility
- Existing admin account preserved
- All existing data remains accessible
- No breaking changes to existing APIs

### Performance Considerations
- Paginate activity logs (50 per page)
- Index frequently queried columns
- Cache admin permissions
- Debounced search

### Future Enhancements (Phase 6+)
- Two-factor authentication (2FA)
- Session management
- Login history
- Advanced analytics
- API keys for integrations

---

**Phase:** 5  
**Status:** 📋 Planned  
**Priority:** High  
**Estimated Duration:** 2-3 weeks
