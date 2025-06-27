import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Download,
  ChevronDown,
  Loader2,
  BarChart3,
  FileText,
  Users,
  AlertCircle
} from 'lucide-react';
import { getAnalyticsData } from '../../services/analyticsService';
import { getAllReports } from '../../services/reportService';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

interface ScanTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface TimeSeriesData {
  day: string;
  scans: number;
  anomalies: number;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<StatCard[]>([]);
  const [scanTypeData, setScanTypeData] = useState<ScanTypeData[]>([]);
  const [weeklyData, setWeeklyData] = useState<TimeSeriesData[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    action: string;
    patient: string;
    time: string;
    status: string;
    anomalies: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping for stats
  const getStatIcon = (title: string) => {
    switch (title) {
      case 'Total Scans':
        return BarChart3;
      case 'Reports Generated':
        return FileText;
      case 'Active Patients':
        return Users;
      case 'Anomalies Detected':
        return AlertCircle;
      default:
        return Activity;
    }
  };



  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAnalyticsData(timeRange);
        
        if (data) {
          setStats(data.stats);
          setScanTypeData(data.scanTypeDistribution);
          setWeeklyData(data.timeSeriesData);
        } else {
          // Set default data if no data returned
          setStats([
            {
              title: 'Total Scans',
              value: '0',
              change: '+0.0%',
              trend: 'neutral',
              color: 'from-cyan-500 to-blue-600'
            },
            {
              title: 'Reports Generated',
              value: '0',
              change: '+0.0%',
              trend: 'neutral',
              color: 'from-indigo-500 to-purple-600'
            },
            {
              title: 'Active Patients',
              value: '0',
              change: '+0.0%',
              trend: 'neutral',
              color: 'from-green-500 to-emerald-600'
            },
            {
              title: 'Anomalies Detected',
              value: '0',
              change: '+0.0%',
              trend: 'neutral',
              color: 'from-orange-500 to-red-600'
            }
          ]);
          setScanTypeData([
            { type: 'Brain MRI', count: 0, percentage: 0, color: 'bg-purple-500' },
            { type: 'Cardiac CT', count: 0, percentage: 0, color: 'bg-red-500' },
            { type: 'Lung CT', count: 0, percentage: 0, color: 'bg-cyan-500' },
            { type: 'Liver MRI', count: 0, percentage: 0, color: 'bg-green-500' }
          ]);
          setWeeklyData(Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              day: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
              scans: 0,
              anomalies: 0
            };
          }));
        }
        
        // Get recent activity from reports (with fallback for API errors)
        try {
          const reports = await getAllReports();
          const sortedReports = reports
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map(report => ({
              action: `${report.scanType} scan ${report.status === 'completed' ? 'completed' : 'processed'}`,
              patient: `Patient #${report.patientId}`,
              time: getRelativeTime(new Date(report.date)),
              status: report.status,
              anomalies: report.anomaliesCount || 0
            }));
          
          setRecentActivity(sortedReports);
        } catch (reportError) {
          console.warn('Could not fetch reports for recent activity:', reportError);
          setRecentActivity([]);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Unable to load analytics data. Displaying demo data.');
        
        // Set demo data on error
        setStats([
          {
            title: 'Total Scans',
            value: '156',
            change: '+12.5%',
            trend: 'up',
            color: 'from-cyan-500 to-blue-600'
          },
          {
            title: 'Reports Generated',
            value: '142',
            change: '+8.2%',
            trend: 'up',
            color: 'from-indigo-500 to-purple-600'
          },
          {
            title: 'Active Patients',
            value: '89',
            change: '+3.1%',
            trend: 'up',
            color: 'from-green-500 to-emerald-600'
          },
          {
            title: 'Anomalies Detected',
            value: '23',
            change: '-5.4%',
            trend: 'down',
            color: 'from-orange-500 to-red-600'
          }
        ]);
        
        setScanTypeData([
          { type: 'Brain MRI', count: 45, percentage: 35, color: 'bg-purple-500' },
          { type: 'Cardiac CT', count: 38, percentage: 30, color: 'bg-red-500' },
          { type: 'Lung CT', count: 32, percentage: 25, color: 'bg-cyan-500' },
          { type: 'Liver MRI', count: 13, percentage: 10, color: 'bg-green-500' }
        ]);
        
        setWeeklyData([
          { day: 'Mon', scans: 12, anomalies: 2 },
          { day: 'Tue', scans: 18, anomalies: 3 },
          { day: 'Wed', scans: 15, anomalies: 1 },
          { day: 'Thu', scans: 22, anomalies: 4 },
          { day: 'Fri', scans: 19, anomalies: 2 },
          { day: 'Sat', scans: 8, anomalies: 1 },
          { day: 'Sun', scans: 6, anomalies: 0 }
        ]);
        
        setRecentActivity([
          {
            action: 'Brain MRI scan completed',
            patient: 'Patient #1234',
            time: '15 minutes ago',
            status: 'completed',
            anomalies: 1
          },
          {
            action: 'Lung CT scan processed',
            patient: 'Patient #1235',
            time: '1 hour ago',
            status: 'processed',
            anomalies: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Helper function to get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const maxScans = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.scans)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive insights into your diagnostic workflow
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading analytics data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-600 dark:text-yellow-400">
          <p className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                {React.createElement(getStatIcon(stat.title), { className: "w-6 h-6 text-white" })}
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                'text-slate-600 dark:text-slate-400'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Charts Grid */}
      {!loading && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart */}
          <motion.div
            className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Weekly Activity
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-slate-600 dark:text-slate-400">Scans</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-slate-600 dark:text-slate-400">Anomalies</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {day.day}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: maxScans > 0 ? `${(day.scans / maxScans) * 100}%` : '0%' }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {day.scans}
                    </div>
                  </div>
                  <div className="w-8 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {day.anomalies}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scan Type Distribution */}
        <motion.div
          className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Scan Type Distribution
          </h3>
          
          <div className="space-y-4">
            {scanTypeData.map((item, index) => (
              <motion.div
                key={item.type}
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      )}

      {/* Recent Activity */}
      {!loading && (
        <motion.div
          className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.patient}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {activity.status}
                  </div>
                  {activity.anomalies !== null && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.anomalies > 0
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    }`}>
                      {activity.anomalies} anomalies
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              No recent activity found
            </div>
          )}
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default Analytics;