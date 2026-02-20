const { sendEmail } = require('../config/email');
const { weeklyDigestTemplate } = require('../utils/emailTemplates');
const ContactSubmission = require('../models/ContactSubmission');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const { query } = require('../config/db');

// Get weekly statistics
const getWeeklyStats = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Get current week submissions
  const currentWeekResult = await query(
    `SELECT COUNT(*) FROM contact_submissions WHERE created_at >= $1`,
    [oneWeekAgo]
  );
  const currentWeekCount = parseInt(currentWeekResult.rows[0].count);

  // Get previous week submissions
  const previousWeekResult = await query(
    `SELECT COUNT(*) FROM contact_submissions WHERE created_at >= $1 AND created_at < $2`,
    [twoWeeksAgo, oneWeekAgo]
  );
  const previousWeekCount = parseInt(previousWeekResult.rows[0].count);

  // Calculate growth
  const submissionGrowth = previousWeekCount > 0
    ? (((currentWeekCount - previousWeekCount) / previousWeekCount) * 100).toFixed(1)
    : 0;

  // Get replied submissions
  const repliedResult = await query(
    `SELECT COUNT(*) FROM contact_submissions WHERE status = 'replied' AND created_at >= $1`,
    [oneWeekAgo]
  );
  const repliedCount = parseInt(repliedResult.rows[0].count);

  // Response rate
  const responseRate = currentWeekCount > 0
    ? ((repliedCount / currentWeekCount) * 100).toFixed(1)
    : 0;

  // Average response time (in hours)
  const responseTimeResult = await query(`
    SELECT AVG(
      EXTRACT(EPOCH FROM (replied_at - created_at)) / 3600
    ) as avg_hours
    FROM contact_submissions
    WHERE replied_at IS NOT NULL AND created_at >= $1
  `, [oneWeekAgo]);
  const avgResponseTime = parseFloat(responseTimeResult.rows[0].avg_hours || 0).toFixed(1);

  // Get content stats
  const services = await Service.findAll();
  const activeServices = services.filter(s => s.is_active).length;

  const projects = await Project.getStats();
  const testimonials = await Testimonial.getStats();

  return {
    totalSubmissions: currentWeekCount,
    repliedSubmissions: repliedCount,
    submissionGrowth: parseFloat(submissionGrowth),
    responseRate: parseFloat(responseRate),
    avgResponseTime,
    activeServices,
    totalProjects: projects.total,
    approvedTestimonials: testimonials.approved,
  };
};

// Send weekly digest to all admins
const sendWeeklyDigest = async () => {
  try {
    console.log('📧 Sending weekly digest...');

    // Get stats
    const stats = await getWeeklyStats();

    // Get all active admins
    const admins = await Admin.findAll();
    const activeAdmins = admins.filter(a => a.is_active);

    // Date range for display
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateRange = `${oneWeekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`;

    // Send to each admin
    for (const admin of activeAdmins) {
      const html = weeklyDigestTemplate(stats, admin.name, dateRange);

      await sendEmail({
        to: admin.email,
        subject: `Weekly Activity Report (${dateRange})`,
        html,
      });

      console.log(`✅ Weekly digest sent to ${admin.email}`);
    }

    console.log('✅ Weekly digest completed');
    return { success: true, count: activeAdmins.length };
  } catch (error) {
    console.error('❌ Weekly digest failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Manual trigger endpoint
const triggerWeeklyDigest = async (req, res) => {
  const result = await sendWeeklyDigest();
  
  if (result.success) {
    res.json({
      success: true,
      message: `Weekly digest sent to ${result.count} admins`,
    });
  } else {
    res.status(500).json({
      success: false,
      message: result.error,
    });
  }
};

module.exports = {
  sendWeeklyDigest,
  triggerWeeklyDigest,
  getWeeklyStats,
};
