import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Mail,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Star,
  Layers,
} from 'lucide-react';
import { analyticsAPI, submissionsAPI } from '../../utils/api';

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];
const STATUS_COLORS = {
  new: '#22c55e',
  read: '#eab308',
  replied: '#3b82f6',
  archived: '#6b7280',
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [conversion, setConversion] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [selectedMonth, setSelectedMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, conversionRes, dashboardRes] = await Promise.all([
        analyticsAPI.getOverview(period),
        analyticsAPI.getConversion(period),
        analyticsAPI.getDashboard(),
      ]);
      setAnalytics(analyticsRes.data.data);
      setConversion(conversionRes.data.data);
      setDashboardStats(dashboardRes.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await submissionsAPI.export({});
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="text-gray-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  const formatTimeLabel = (date) => {
    if (period === '12months') {
      return date;
    }
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-600">Track submissions and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field py-2 px-3 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="12months">Last 12 months</option>
          </select>
          <button onClick={handleExportReport} className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            {conversion && conversion.avgSubmissionsPerDay >= 5 && (
              <ArrowUp className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Avg per Day</p>
          <p className="text-3xl font-bold text-gray-900">
            {conversion?.avgSubmissionsPerDay || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Submissions daily average</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {conversion?.conversionRate?.toFixed(1) || 0}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Replied / Total</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Avg Response Time</p>
          <p className="text-3xl font-bold text-gray-900">
            {analytics?.responseMetrics?.avgResponseHours 
              ? analytics.responseMetrics.avgResponseHours.toFixed(1)
              : 'N/A'}h
          </p>
          <p className="text-xs text-gray-400 mt-1">Average reply time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Read Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {conversion?.readRate?.toFixed(1) || 0}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Read / Total</p>
        </div>
      </div>

      {/* Content Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              {dashboardStats.growth.trend === 'up' ? (
                <ArrowUp className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardStats.submissions.total || 0}
            </p>
            <p className={`text-xs mt-1 ${dashboardStats.growth.submissions >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dashboardStats.growth.submissions >= 0 ? '+' : ''}{dashboardStats.growth.submissions}% from last 30 days
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Projects</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardStats.projects.total || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dashboardStats.projects.featured || 0} featured
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Services</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardStats.services.active || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dashboardStats.services.categories || 0} categories
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Testimonials</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardStats.testimonials.approved || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ⭐ {dashboardStats.testimonials.averageRating || 0} avg rating
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Submissions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.timeSeries || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatTimeLabel}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#0284c7" 
                strokeWidth={3}
                dot={{ fill: '#0284c7', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Submissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.statusDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics?.statusDistribution || []).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Metrics */}
      {analytics?.responseMetrics && analytics.responseMetrics.avgResponseHours > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Response Time Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-500 font-medium mb-2">Fastest Response</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.responseMetrics.minResponseHours.toFixed(1)}h
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-500 font-medium mb-2">Average Response</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.responseMetrics.avgResponseHours.toFixed(1)}h
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-500 font-medium mb-2">Slowest Response</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.responseMetrics.maxResponseHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Report Section */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Monthly Report</h3>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth.month}
              onChange={(e) => setSelectedMonth({ ...selectedMonth, month: parseInt(e.target.value) })}
              className="input-field py-2 px-3 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth.year}
              onChange={(e) => setSelectedMonth({ ...selectedMonth, year: parseInt(e.target.value) })}
              className="input-field py-2 px-3 text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Click "Generate" to load monthly report data</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
