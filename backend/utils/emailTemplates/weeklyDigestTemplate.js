// Weekly Digest Email Template
const weeklyDigestTemplate = (stats, adminName, dateRange) => {
  const growthIcon = stats.submissionGrowth >= 0 ? '📈' : '📉';
  const growthColor = stats.submissionGrowth >= 0 ? '#22c55e' : '#ef4444';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Activity Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <span style="font-size: 32px;">📊</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Weekly Activity Report</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">${dateRange}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Hi ${adminName || 'Admin'},
              </p>
              
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Here's your weekly activity summary for H&E Works website:
              </p>
              
              <!-- Stats Grid -->
              <table role="presentation" style="width: 100%; margin: 30px 0; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px;">
                    <div style="background-color: #dbeafe; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">📬</div>
                      <div style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 5px 0;">${stats.totalSubmissions}</div>
                      <div style="color: #64748b; font-size: 14px;">Total Submissions</div>
                      <div style="color: ${growthColor}; font-size: 13px; font-weight: 600; margin-top: 8px;">
                        ${growthIcon} ${Math.abs(stats.submissionGrowth)}% from last week
                      </div>
                    </div>
                  </td>
                  <td style="padding: 10px;">
                    <div style="background-color: #dcfce7; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
                      <div style="color: #166534; font-size: 28px; font-weight: 700; margin: 5px 0;">${stats.repliedSubmissions}</div>
                      <div style="color: #64748b; font-size: 14px;">Replied</div>
                      <div style="color: #166534; font-size: 13px; font-weight: 600; margin-top: 8px;">
                        ${stats.responseRate}% response rate
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px;" colspan="2">
                    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">⏱️</div>
                      <div style="color: #92400e; font-size: 28px; font-weight: 700; margin: 5px 0;">${stats.avgResponseTime}h</div>
                      <div style="color: #64748b; font-size: 14px;">Average Response Time</div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Additional Stats -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">Website Content</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 14px;">📁 Active Services</span>
                      <span style="color: #1f2937; font-size: 16px; font-weight: 600; float: right;">${stats.activeServices}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="color: #6b7280; font-size: 14px;">📂 Projects</span>
                      <span style="color: #1f2937; font-size: 16px; font-weight: 600; float: right;">${stats.totalProjects}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">⭐ Testimonials</span>
                      <span style="color: #1f2937; font-size: 16px; font-weight: 600; float: right;">${stats.approvedTestimonials}</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0; border-collapse: collapse;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      View Full Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                This report was automatically generated by H&E Works Admin System.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} H&E Works. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                You're receiving this email because you're subscribed to weekly digests.
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

module.exports = weeklyDigestTemplate;
