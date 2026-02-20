const ContactSubmission = require('../models/ContactSubmission');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

// @desc    Get analytics data for charts
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getAnalyticsOverview = async (req, res) => {
  try {
    const { period = '30days' } = req.query;

    const [timeSeriesData, statusDistribution, responseMetrics, projectStats, serviceStats, testimonialStats] = await Promise.all([
      ContactSubmission.getSubmissionsOverTime(period),
      ContactSubmission.getStatusDistribution(),
      ContactSubmission.getResponseTimeMetrics(),
      Project.getStats(),
      Service.findAll().then(services => ({ total: services.length, active: services.filter(s => s.is_active).length })),
      Testimonial.getStats(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        submissions: {
          timeSeries: timeSeriesData,
          statusDistribution: statusDistribution,
          responseMetrics: {
            avgResponseHours: parseFloat(responseMetrics.avg_response_hours) || 0,
            minResponseHours: parseFloat(responseMetrics.min_response_hours) || 0,
            maxResponseHours: parseFloat(responseMetrics.max_response_hours) || 0,
          },
        },
        projects: projectStats,
        services: serviceStats,
        testimonials: testimonialStats,
      },
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message,
    });
  }
};

// @desc    Get monthly report data
// @route   GET /api/analytics/monthly/:year/:month
// @access  Private/Admin
const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.params;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (yearNum < 2020 || yearNum > 2100 || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year or month',
      });
    }

    const summary = await ContactSubmission.getMonthlySummary(yearNum, monthNum);

    // Get daily breakdown for the month
    const dailyData = await ContactSubmission.getSubmissionsOverTime('30days');

    res.status(200).json({
      success: true,
      data: {
        year: yearNum,
        month: monthNum,
        summary: {
          total: parseInt(summary.total),
          new: parseInt(summary.new),
          read: parseInt(summary.read),
          replied: parseInt(summary.replied),
          archived: parseInt(summary.archived),
          activeDays: parseInt(summary.active_days),
        },
        dailyBreakdown: dailyData,
      },
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly report',
      error: error.message,
    });
  }
};

// @desc    Get conversion metrics
// @route   GET /api/analytics/conversion
// @access  Private/Admin
const getConversionMetrics = async (req, res) => {
  try {
    const { period = '30days' } = req.query;
    
    // Calculate conversion rates based on status
    const statusDistribution = await ContactSubmission.getStatusDistribution();
    const timeSeriesData = await ContactSubmission.getSubmissionsOverTime(period);
    
    const total = statusDistribution.reduce((sum, s) => sum + parseInt(s.count), 0);
    const replied = statusDistribution.find(s => s.status === 'replied')?.count || 0;
    const read = statusDistribution.find(s => s.status === 'read')?.count || 0;
    
    const conversionRate = total > 0 ? ((parseInt(replied) / total) * 100).toFixed(2) : 0;
    const readRate = total > 0 ? ((parseInt(read) / total) * 100).toFixed(2) : 0;

    // Calculate average submissions per day
    const avgPerDay = timeSeriesData.length > 0 
      ? (timeSeriesData.reduce((sum, d) => sum + parseInt(d.count), 0) / timeSeriesData.length).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions: total,
        repliedCount: parseInt(replied),
        conversionRate: parseFloat(conversionRate),
        readRate: parseFloat(readRate),
        avgSubmissionsPerDay: parseFloat(avgPerDay),
        period,
      },
    });
  } catch (error) {
    console.error('Get conversion metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversion metrics',
      error: error.message,
    });
  }
};

module.exports = {
  getAnalyticsOverview,
  getMonthlyReport,
  getConversionMetrics,
};

// @desc    Get comprehensive dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [submissionsStats, projectsStats, servicesStats, testimonialsStats] = await Promise.all([
      ContactSubmission.getStats(),
      Project.getStats(),
      Service.findAll().then(services => ({
        total: services.length,
        active: services.filter(s => s.is_active).length,
        categories: [...new Set(services.map(s => s.category).filter(Boolean))].length,
      })),
      Testimonial.getStats(),
    ]);

    // Calculate growth metrics (comparing last 30 days to previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [recentSubmissions, previousSubmissions] = await Promise.all([
      ContactSubmission.findAll({ startDate: thirtyDaysAgo.toISOString().split('T')[0] }),
      ContactSubmission.findAll({ 
        startDate: sixtyDaysAgo.toISOString().split('T')[0],
        endDate: thirtyDaysAgo.toISOString().split('T')[0] 
      }),
    ]);

    const recentCount = recentSubmissions.pagination.total;
    const previousCount = previousSubmissions.pagination.total;
    const growthRate = previousCount > 0 
      ? (((recentCount - previousCount) / previousCount) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        submissions: submissionsStats,
        projects: projectsStats,
        services: servicesStats,
        testimonials: testimonialsStats,
        growth: {
          submissions: parseFloat(growthRate),
          trend: recentCount >= previousCount ? 'up' : 'down',
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getAnalyticsOverview,
  getMonthlyReport,
  getConversionMetrics,
  getDashboardStats,
};
