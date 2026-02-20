// New Submission Alert Email Template
const newSubmissionAlertTemplate = (submission, adminName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Contact Submission</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${adminName || 'Admin'},
              </p>
              
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                You've received a new contact form submission from your website:
              </p>
              
              <!-- Submission Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #6b7280; font-size: 14px;">From:</strong>
                      <p style="color: #1f2937; font-size: 16px; margin: 5px 0 0 0;">${submission.name} &lt;${submission.email}&gt;</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #6b7280; font-size: 14px;">Subject:</strong>
                      <p style="color: #1f2937; font-size: 16px; margin: 5px 0 0 0;">${submission.subject}</p>
                    </td>
                  </tr>
                  ${submission.phone ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #6b7280; font-size: 14px;">Phone:</strong>
                      <p style="color: #1f2937; font-size: 16px; margin: 5px 0 0 0;">${submission.phone}</p>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 10px 0;">
                      <strong style="color: #6b7280; font-size: 14px;">Message:</strong>
                      <p style="color: #1f2937; font-size: 16px; margin: 10px 0 0 0; line-height: 1.6;">${submission.message}</p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Action Button -->
              <table role="presentation" style="margin: 30px 0; border-collapse: collapse;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      View in Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                This email was sent to ${adminName || 'the admin team'} at ${new Date().toLocaleString()}.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} H&E Works. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = newSubmissionAlertTemplate;
