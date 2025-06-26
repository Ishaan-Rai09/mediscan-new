import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  FileText,
  Activity
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  email: string;
  phone: string;
  address: string;
  lastVisit: string;
  totalScans: number;
  riskLevel: 'low' | 'medium' | 'high';
  conditions: string[];
  avatar: string;
}

const PatientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const patients: Patient[] = [
    {
      id: 'PAT-2024-001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY',
      lastVisit: '2024-01-15',
      totalScans: 8,
      riskLevel: 'medium',
      conditions: ['Hypertension', 'Diabetes'],
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PAT-2024-002',
      name: 'Sarah Johnson',
      age: 38,
      gender: 'Female',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA',
      lastVisit: '2024-01-14',
      totalScans: 12,
      riskLevel: 'low',
      conditions: ['Migraine'],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PAT-2024-003',
      name: 'Michael Brown',
      age: 62,
      gender: 'Male',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, Chicago, IL',
      lastVisit: '2024-01-13',
      totalScans: 15,
      riskLevel: 'high',
      conditions: ['Cardiac Arrhythmia', 'High Cholesterol'],
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PAT-2024-004',
      name: 'Emily Davis',
      age: 29,
      gender: 'Female',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Houston, TX',
      lastVisit: '2024-01-12',
      totalScans: 3,
      riskLevel: 'low',
      conditions: [],
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PAT-2024-005',
      name: 'Robert Wilson',
      age: 55,
      gender: 'Male',
      email: 'robert.wilson@email.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, Phoenix, AZ',
      lastVisit: '2024-01-11',
      totalScans: 6,
      riskLevel: 'medium',
      conditions: ['Sleep Apnea'],
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || patient.gender.toLowerCase() === filterGender;
    const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk;
    
    return matchesSearch && matchesGender && matchesRisk;
  });

  return (
    <div className="space-y-6 pt-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Patient Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage patient records and medical history
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: patients.length, icon: Users, color: 'from-cyan-500 to-blue-600' },
          { label: 'High Risk', value: patients.filter(p => p.riskLevel === 'high').length, icon: Activity, color: 'from-red-500 to-pink-600' },
          { label: 'Recent Visits', value: patients.filter(p => new Date(p.lastVisit) > new Date('2024-01-10')).length, icon: Calendar, color: 'from-green-500 to-emerald-600' },
          { label: 'Total Scans', value: patients.reduce((sum, p) => sum + p.totalScans, 0), icon: FileText, color: 'from-purple-500 to-indigo-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
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

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Gender Filter */}
          <div className="relative">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full appearance-none px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-6">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <img 
                    src={patient.avatar} 
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {patient.name}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {patient.id}
                    </span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel} risk
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Age: {patient.age} • {patient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{patient.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Last visit: {patient.lastVisit}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Total scans: {patient.totalScans}
                      </span>
                    </div>
                    
                    {patient.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No patients found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or add a new patient.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PatientManagement;