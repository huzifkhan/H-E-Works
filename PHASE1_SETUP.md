# Phase 1: Contact Form Enhancements - Setup Guide

## Features Added

✅ **File Attachments** - Users can upload images, PDFs, Word, and Excel files (max 5MB, 5 files)
✅ **Email Notifications** - Admin receives beautiful HTML email when new message arrives
✅ **Auto-Reply Emails** - Customers receive automatic confirmation email
✅ **reCAPTCHA Support** - Optional spam protection (Google reCAPTCHA v3)

---

## Setup Instructions

### 1. Email Configuration (SMTP)

For email notifications to work, configure your SMTP settings in `.env`:

```env
# For Gmail (recommended for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # NOT your regular password!
FROM_NAME=H&E Works Website
ADMIN_EMAIL=admin@business.com
```

#### Gmail App Password Setup:
1. Go to your Google Account → Security
2. Enable 2-Step Verification (if not enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Create a new app password for "Mail"
5. Use this 16-character password in `SMTP_PASS`

#### Alternative SMTP Providers:
- **SendGrid**: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_PORT=587`
- **Mailgun**: `SMTP_HOST=smtp.mailgun.org`, `SMTP_PORT=587`
- **Office365**: `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`

---

### 2. reCAPTCHA Setup (Optional)

For spam protection:

1. Go to: https://www.google.com/recaptcha/admin
2. Select "reCAPTCHA v3"
3. Register your domain (use `localhost` for testing)
4. Copy the keys to `.env`:

```env
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

---

### 3. Database Migration

Run the migration to add attachments column:

```bash
cd backend
node config/migrate.js
```

You should see:
```
✅ Added attachments column to contact_submissions
✅ Database migration completed successfully!
```

---

### 4. Test File Uploads

1. Restart your backend server
2. Go to the contact form
3. Fill out the form and attach files
4. Submit - you should see:
   - Success message on frontend
   - Email notification in admin inbox
   - Auto-reply to customer email
   - Attachments visible in admin dashboard

---

## Testing Email Without Real SMTP

For local development without SMTP, emails will be skipped (no error). To test emails:

1. Use **Mailtrap** (free for testing):
   - https://mailtrap.io/
   - Create free account
   - Get SMTP credentials from inbox settings
   - Add to `.env`

2. Or use **Ethereal Email** (nodemailer test service):
   - Visit: https://ethereal.email/
   - Create test account
   - Use credentials in `.env`

---

## Troubleshooting

### Email not sending?
- Check SMTP credentials in `.env`
- Verify 2FA is enabled for Gmail
- Use App Password, not regular password
- Check firewall/port blocking

### File upload fails?
- Check `MAX_FILE_SIZE` in `.env`
- Verify `uploads/` folder exists and is writable
- Check file type restrictions in frontend/backend

### reCAPTCHA not working?
- Ensure keys are correct in `.env`
- Verify domain is registered in reCAPTCHA console
- Check browser console for errors

---

## API Changes

### POST /api/contact

Now accepts `multipart/form-data`:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Project Inquiry",
  "message": "Hello...",
  "attachments": [file1, file2, ...]  // Optional
}
```

Response:
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "attachments": [
      {
        "filename": "document.pdf",
        "path": "/uploads/123456-document.pdf",
        "mimetype": "application/pdf",
        "size": 102400
      }
    ]
  }
}
```

---

## Next Steps

After completing Phase 1 setup, proceed to:
- **Phase 2**: Admin Dashboard Improvements (CSV export, bulk actions, filters)
- **Phase 3**: Services/Portfolio Section
- **Phase 4**: Analytics & Reporting
