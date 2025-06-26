import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Brain,
  Heart,
  Activity,
  FileImage,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface Report {
  id: string;
  patientId: string;
  patientName: string;
  scanType: 'brain' | 'heart' | 'lungs' | 'liver';
  date: string;
  riskLevel: 'high' | 'medium' | 'low';
  anomaliesCount: number;
  status: 'completed' | 'pending' | 'reviewed';
  reportSize: string;
  thumbnail: string;
}

const PastReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const reports: Report[] = [
    {
      id: 'RPT-2024-001',
      patientId: 'PAT-2024-001',
      patientName: 'John Smith',
      scanType: 'brain',
      date: '2024-01-15',
      riskLevel: 'medium',
      anomaliesCount: 2,
      status: 'completed',
      reportSize: '2.3 MB',
      thumbnail: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'RPT-2024-002',
      patientId: 'PAT-2024-002',
      patientName: 'Sarah Johnson',
      scanType: 'heart',
      date: '2024-01-14',
      riskLevel: 'low',
      anomaliesCount: 1,
      status: 'completed',
      reportSize: '1.8 MB',
      thumbnail: 'https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'RPT-2024-003',
      patientId: 'PAT-2024-003',
      patientName: 'Michael Brown',
      scanType: 'lungs',
      date: '2024-01-13',
      riskLevel: 'high',
      anomaliesCount: 3,
      status: 'reviewed',
      reportSize: '3.1 MB',
      thumbnail: 'https://images.pexels.com/photos/7659566/pexels-photo-7659566.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'RPT-2024-004',
      patientId: 'PAT-2024-004',
      patientName: 'Emily Davis',
      scanType: 'liver',
      date: '2024-01-12',
      riskLevel: 'low',
      anomaliesCount: 0,
      status: 'completed',
      reportSize: '1.5 MB',
      thumbnail: 'https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'RPT-2024-005',
      patientId: 'PAT-2024-005',
      patientName: 'Robert Wilson',
      scanType: 'brain',
      date: '2024-01-11',
      riskLevel: 'medium',
      anomaliesCount: 1,
      status: 'pending',
      reportSize: '2.0 MB',
      thumbnail: 'https://images.pexels.com/photos/7659565/pexels-photo-7659565.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const getScanIcon = (type: string) => {
    switch (type) {
      case 'brain': return <Brain className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'lungs': return <Activity className="w-5 h-5" />;
      case 'liver': return <FileImage className="w-5 h-5" />;
      default: return <FileImage className="w-5 h-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'reviewed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.scanType === filterType;
    const matchesRisk = filterRisk === 'all' || report.riskLevel === filterRisk;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="space-y-6 pt-6 px-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Past Reports
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Access and manage all your previous diagnostic reports
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Scan Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full appearance-none px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            >
              <option value="all">All Scan Types</option>
              <option value="brain">Brain MRI</option>
              <option value="heart">Cardiac CT</option>
              <option value="lungs">Lung CT</option>
              <option value="liver">Liver MRI</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Risk Level Filter */}
          <div className="relative">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full appearance-none px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            >
              <option value="date">Sort by Date</option>
              <option value="patient">Sort by Patient</option>
              <option value="risk">Sort by Risk</option>
              <option value="type">Sort by Type</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, color: 'from-cyan-500 to-blue-600' },
          { label: 'High Risk', value: reports.filter(r => r.riskLevel === 'high').length, color: 'from-red-500 to-pink-600' },
          { label: 'Medium Risk', value: reports.filter(r => r.riskLevel === 'medium').length, color: 'from-yellow-500 to-orange-600' },
          { label: 'Low Risk', value: reports.filter(r => r.riskLevel === 'low').length, color: 'from-green-500 to-emerald-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Scan Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Anomalies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredReports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                        <img 
                          src={report.thumbnail} 
                          alt="Scan thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {report.patientName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {report.patientId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                        {getScanIcon(report.scanType)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {report.scanType} Scan
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{report.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(report.riskLevel)}`}>
                      {getRiskIcon(report.riskLevel)}
                      <span className="ml-1 capitalize">{report.riskLevel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {report.anomaliesCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FileImage className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No reports found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or upload new scans to generate reports.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PastReports;