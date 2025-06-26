import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Brain, 
  FileText, 
  History, 
  Menu,
  X,
  Activity,
  Zap,
  BarChart3,
  Users,
  Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import ScanUpload from './dashboard/ScanUpload';
import PastReports from './dashboard/PastReports';
import DiagnosisResults from './dashboard/DiagnosisResults';
import Analytics from './dashboard/Analytics';
import PatientManagement from './dashboard/PatientManagement';
import SecuritySettings from './dashboard/SecuritySettings';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const navigationGroups = [
    {
      heading: 'Scans',
      items: [
        { name: 'Upload Scan', href: '/dashboard', icon: Upload, exact: true },
        { name: 'Diagnosis Results', href: '/dashboard/results', icon: Brain },
      ],
    },
    {
      heading: 'Insights',
      items: [
        { name: 'Reports', href: '/dashboard/reports', icon: History },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ],
    },
    {
      heading: 'Management',
      items: [
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
      ],
    },
    {
      heading: 'Admin',
      items: [
        { name: 'Security', href: '/dashboard/security', icon: Shield },
      ],
    },
  ];

  const isActiveRoute = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              MediScan AI
            </span>
          </div>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-6">
            {navigationGroups.map((group, idx) => (
              <div key={group.heading}>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-2">{group.heading}</div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 group
                        ${isActiveRoute(item.href, item.exact)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <item.icon className={`
                        w-5 h-5 mr-3 transition-colors
                        ${isActiveRoute(item.href, item.exact)
                          ? 'text-white'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                        }
                      `} />
                      {item.name}
                    </button>
                  ))}
                </div>
                {idx < navigationGroups.length - 1 && (
                  <div className="my-4 border-t border-slate-200 dark:border-slate-700" />
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 relative flex flex-col">
        <div className="mx-auto max-w-7xl flex-1">

          <div className="relative z-10">

            {location.pathname === '/dashboard' && (
              <>
                <div className="mb-4">
                  <div className="rounded-2xl bg-gradient-to-r from-cyan-500/80 to-blue-600/80 p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</h2>
                      <p className="text-cyan-100 text-sm">Empowering your medical diagnostics with AI.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-6 flex items-center shadow-md border border-cyan-100 dark:border-slate-700">
                    <BarChart3 className="w-8 h-8 text-cyan-500 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">1,247</div>
                      <div className="text-sm text-slate-500 dark:text-slate-300">Total Scans</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-6 flex items-center shadow-md border border-cyan-100 dark:border-slate-700">
                    <FileText className="w-8 h-8 text-blue-500 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">89</div>
                      <div className="text-sm text-slate-500 dark:text-slate-300">Reports</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-6 flex items-center shadow-md border border-cyan-100 dark:border-slate-700">
                    <Users className="w-8 h-8 text-emerald-500 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">456</div>
                      <div className="text-sm text-slate-500 dark:text-slate-300">Patients</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-6 flex items-center shadow-md border border-cyan-100 dark:border-slate-700">
                    <Activity className="w-8 h-8 text-pink-500 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">23</div>
                      <div className="text-sm text-slate-500 dark:text-slate-300">Anomalies Detected</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Dashboard Content */}
            <Routes>
              <Route path="/" element={<ScanUpload />} />
              <Route path="/results" element={<DiagnosisResults />} />
              <Route path="/reports" element={<PastReports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/patients" element={<PatientManagement />} />
              <Route path="/security" element={<SecuritySettings />} />
            </Routes>
          </div>
        </div>
        <main>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;