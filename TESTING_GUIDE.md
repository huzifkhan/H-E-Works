# Testing Guide - H&E Works Website

## ✅ Servers Status
- **Backend**: http://localhost:5000 ✅ Running
- **Frontend**: http://localhost:5173 ✅ Running

---

## Test 1: Contact Form with File Upload

### Steps:
1. Open http://localhost:5173/contact
2. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Subject: Project Consultation
   - Message: This is a test message
3. **Attach files** (optional):
   - Click the upload area or drag files
   - Try uploading images, PDFs, or documents
   - Max 5 files, 5MB each
4. Click "Send Message"

### Expected Result:
- ✅ Success message appears
- ✅ Form clears
- ✅ Files show in upload list before submit

### Verify in Database:
```bash
# Login to admin and check submission
http://localhost:5173/admin/login
Email: admin@business.com
Password: admin123
```

---

## Test 2: Admin Dashboard - View Messages

### Steps:
1. Go to http://localhost:5173/admin/login
2. Login with:
   - Email: `admin@business.com`
   - Password: `admin123`
3. Navigate to dashboard

### Expected Result:
- ✅ See list of submissions
- ✅ Stats cards show counts (Total, New, Read, Replied)
- ✅ Each row shows contact info, subject, status, date

---

## Test 3: View Message Details (Modal)

### Steps:
1. In admin dashboard, **click any submission row**
2. Modal should open

### Expected Result:
- ✅ Full message details visible
- ✅ Contact info (name, email, phone)
- ✅ Full subject and message
- ✅ Status badge with quick action buttons
- ✅ Attachments section (if files were uploaded)
- ✅ Can download/view attachments

### Test Modal Actions:
- Click "Mark as Read" (if status is New)
- Click "Mark as Replied" (if status is Read)
- Click "Archive"
- Close modal with X button

---

## Test 4: CSV Export

### Steps:
1. In admin dashboard, click **"Export CSV"** button

### Expected Result:
- ✅ CSV file downloads: `submissions_YYYY-MM-DD.csv`
- ✅ Open file - should contain all submissions
- ✅ Columns: ID, Date, Time, Name, Email, Phone, Subject, Message, Status, Attachments, IP

### Test Filtered Export:
1. Select a status tab (e.g., "New")
2. Click "Export CSV" again
3. Should only export filtered submissions

---

## Test 5: Bulk Actions

### Steps:
1. **Select multiple submissions** using checkboxes:
   - Click individual checkboxes
   - Or click top checkbox to select all
2. Blue bar appears showing "X submission(s) selected"
3. From dropdown, select an action:
   - Mark as Read
   - Mark as Replied
   - Mark as Archived
   - Delete
4. Click "Apply"

### Expected Result:
- ✅ All selected submissions update status
- ✅ Selection clears
- ✅ Table refreshes with updated data

### Test Bulk Delete:
1. Select submissions
2. Choose "Delete" from dropdown
3. Click "Apply"
4. Confirm deletion

⚠️ **Warning**: This permanently deletes submissions!

---

## Test 6: Date Range Filter

### Steps:
1. In admin dashboard, find "Date Range Filter"
2. Set "From" date (e.g., start of this month)
3. Set "To" date (today)
4. Table should filter automatically

### Expected Result:
- ✅ Only shows submissions within date range
- ✅ Export CSV respects date filter
- ✅ Can combine with status filter

---

## Test 7: Search Functionality

### Steps:
1. In search box, type a name, email, or subject
2. Table filters as you type

### Test Searches:
- Search by name: "Test"
- Search by email: "example"
- Search by subject: "Project"

### Expected Result:
- ✅ Filters in real-time
- ✅ Searches across name, email, and subject
- ✅ Clear search to see all again

---

## Test 8: Status Tabs

### Steps:
1. Click status tabs at top:
   - **All**: Shows everything
   - **New**: Only new submissions
   - **Read**: Only read submissions
   - **Replied**: Only replied submissions

### Expected Result:
- ✅ Active tab is highlighted
- ✅ Table shows filtered results
- ✅ Export respects tab filter

---

## Test 9: File Attachments (Admin View)

### Prerequisites:
- Submit a contact form with attachments first (Test 1)

### Steps:
1. In admin dashboard, click the submission with attachments
2. Look for "Attachments" section in modal

### Expected Result:
- ✅ Shows number of attachments
- ✅ Each file shows:
  - File icon (image or document)
  - Filename
  - File size in KB
  - Download icon
- ✅ Click to open/download file in new tab

---

## Test 10: Individual Status Update

### Steps:
1. Find any submission in table
2. Click the status badge dropdown
3. Select a different status

### Expected Result:
- ✅ Status updates immediately
- ✅ Badge color changes:
  - 🟢 New (green)
  - 🟡 Read (yellow)
  - 🔵 Replied (blue)
  - ⚪ Archived (gray)

---

## Troubleshooting

### Backend Issues:
```bash
# Check backend logs
cd /home/huzaifa/Desktop/Brand/backend
npm run dev

# Look for errors in console
```

### Frontend Issues:
```bash
# Check frontend logs
cd /home/huzaifa/Desktop/Brand/client
npm run dev

# Open browser console (F12)
# Look for errors
```

### Database Issues:
```bash
# Test database connection
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### File Upload Issues:
- Check `uploads/` folder exists: `ls backend/uploads`
- Check folder permissions: `chmod 755 backend/uploads`
- Verify file size limits (5MB max)
- Check allowed file types

### Email Issues:
- Emails are optional - won't break if not configured
- To test emails, configure SMTP in `backend/.env`
- Check backend console for email errors

---

## Quick Test Commands

### Test Login API:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@business.com","password":"admin123"}'
```

### Test Submissions API:
```bash
# Get token first, then:
curl http://localhost:5000/api/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test CSV Export:
```bash
curl http://localhost:5000/api/submissions/export \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o test_export.csv
```

---

## Test Checklist

Copy this and check off as you test:

### Phase 1 - Contact Form:
- [ ] Form submits successfully
- [ ] File upload works (drag & drop)
- [ ] File validation (type, size)
- [ ] Success message displays
- [ ] Form clears after submit

### Phase 2 - Admin Dashboard:
- [ ] Login works
- [ ] Dashboard loads submissions
- [ ] Stats cards show correct counts
- [ ] Click row opens modal
- [ ] Modal shows full details
- [ ] Status update works (dropdown)
- [ ] Quick action buttons work
- [ ] Attachments visible & downloadable
- [ ] CSV export downloads file
- [ ] Select multiple with checkboxes
- [ ] Bulk status update works
- [ ] Bulk delete works
- [ ] Date range filter works
- [ ] Search works
- [ ] Status tabs filter correctly

---

## Report Issues

If you find any bugs, note:
1. **What you were testing**: (e.g., "CSV Export")
2. **What you expected**: (e.g., "Download CSV file")
3. **What actually happened**: (e.g., "Nothing happened")
4. **Error messages**: (from browser console or terminal)
5. **Steps to reproduce**: (detailed steps)

---

## Next Steps After Testing

Once testing is complete:
1. ✅ All features working → Proceed to Phase 3
2. ⚠️ Some issues found → Report and fix
3. 💡 Feature requests → Note for future phases

**Ready to test? Start with Test 1 (Contact Form) and work through the list!**
