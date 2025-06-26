import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  Brain,
  Heart,
  Calendar,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [scanType, setScanType] = useState('all');

  const stats = [
    {
      title: 'Total Scans',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Anomalies Detected',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: Brain,
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Patients Analyzed',
      value: '456',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Avg Analysis Time',
      value: '8.3s',
      change: '-2.1s',
      trend: 'down',
      icon: Heart,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const scanTypeData = [
    { type: 'Brain MRI', count: 487, percentage: 39, color: 'bg-purple-500' },
    { type: 'Cardiac CT', count: 312, percentage: 25, color: 'bg-red-500' },
    { type: 'Lung CT', count: 298, percentage: 24, color: 'bg-cyan-500' },
    { type: 'Liver MRI', count: 150, percentage: 12, color: 'bg-green-500' }
  ];

  const weeklyData = [
    { day: 'Mon', scans: 45, anomalies: 3 },
    { day: 'Tue', scans: 52, anomalies: 7 },
    { day: 'Wed', scans: 38, anomalies: 2 },
    { day: 'Thu', scans: 61, anomalies: 9 },
    { day: 'Fri', scans: 55, anomalies: 4 },
    { day: 'Sat', scans: 28, anomalies: 1 },
    { day: 'Sun', scans: 33, anomalies: 2 }
  ];

  const maxScans = Math.max(...weeklyData.map(d => d.scans));

  return (
    <div className="space-y-8 pt-6 px-4">
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

      {/* Stats Grid */}
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
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
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

      {/* Charts Grid */}
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
                      animate={{ width: `${(day.scans / maxScans) * 100}%` }}
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

      {/* Recent Activity */}
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
          {[
            {
              action: 'Brain MRI scan completed',
              patient: 'Patient #PAT-2024-001',
              time: '2 minutes ago',
              status: 'completed',
              anomalies: 2
            },
            {
              action: 'Cardiac CT analysis finished',
              patient: 'Patient #PAT-2024-002',
              time: '15 minutes ago',
              status: 'completed',
              anomalies: 0
            },
            {
              action: 'Lung CT scan uploaded',
              patient: 'Patient #PAT-2024-003',
              time: '1 hour ago',
              status: 'processing',
              anomalies: null
            },
            {
              action: 'Liver MRI report generated',
              patient: 'Patient #PAT-2024-004',
              time: '2 hours ago',
              status: 'completed',
              anomalies: 1
            }
          ].map((activity, index) => (
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
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;