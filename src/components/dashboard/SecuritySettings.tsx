import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Globe,
  Clock,
} from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [autoLogout, setAutoLogout] = useState('30');
  const [encryptionKey, setEncryptionKey] = useState('');
  
  // Get encryption key from environment variables
  useEffect(() => {
    // In a real app, this would be fetched securely from a backend API
    // For this demo, we'll use a masked version of the key from .env
    const key = import.meta.env.VITE_ENCRYPTION_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    setEncryptionKey(key);
  }, []);

  const securityFeatures = [
    {
      title: 'AES-256 Encryption',
      description: 'All patient data and medical scans are encrypted using military-grade AES-256 encryption',
      status: 'active',
      icon: Lock
    },
    {
      title: 'HIPAA Compliance',
      description: 'Full compliance with HIPAA regulations for healthcare data protection',
      status: 'active',
      icon: Shield
    },
    {
      title: 'Secure IPFS Storage',
      description: 'Encrypted storage on distributed IPFS network via Pinata',
      status: 'active',
      icon: Globe
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Additional security layer with SMS or authenticator app verification',
      status: twoFactorEnabled ? 'active' : 'inactive',
      icon: Smartphone
    }
  ];

  const recentActivity = [
    {
      action: 'Successful login',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      action: 'Password changed',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      time: '2 days ago',
      status: 'success'
    },
    {
      action: 'Failed login attempt',
      location: 'Unknown location',
      device: 'Unknown device',
      time: '1 week ago',
      status: 'warning'
    },
    {
      action: 'Two-factor authentication enabled',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      time: '2 weeks ago',
      status: 'success'
    }
  ];

  // Function to check password
  const checkPassword = () => {
    if (enteredPassword === "1234") {
      setIsAuthorized(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPassword();
    }
  };

  // If not authorized, show password prompt
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <motion.div
          className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
            <p className="text-slate-300">Please enter the admin password to access security settings</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter admin password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {passwordError && (
                <motion.p
                  className="text-red-300 text-sm mt-2 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {passwordError}
                </motion.p>
              )}
            </div>
            
            <motion.button
              onClick={checkPassword}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Access Admin Panel
            </motion.button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Hint: Password is "1234" for demo purposes
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 px-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Security Settings
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account security and data protection settings
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                feature.status === 'active' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-slate-400 to-slate-500'
              }`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                feature.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {feature.status}
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Security Settings */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Authentication Settings */}
        <motion.div
          className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Authentication
          </h3>

          <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Logout */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Auto Logout
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Automatically log out after period of inactivity
              </p>
              <select
                value={autoLogout}
                onChange={(e) => setAutoLogout(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Change Password */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Password
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Last changed 2 days ago
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200">
                Change Password
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data Encryption */}
        <motion.div
          className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Data Encryption
          </h3>

          <div className="space-y-6">
            {/* Encryption Status */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  AES-256 Encryption
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Encrypt all uploaded medical scans and reports
                </p>
              </div>
              <button
                onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  encryptionEnabled ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    encryptionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Encryption Key */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Encryption Key
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Your personal encryption key for securing data
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={showEncryptionKey ? 'text' : 'password'}
                    value={encryptionKey}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showEncryptionKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  onClick={() => {
                    // In a real app, this would securely download the key
                    const element = document.createElement('a');
                    const file = new Blob([encryptionKey], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = 'encryption-key.txt';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Backup & Recovery */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Backup & Recovery
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Download encrypted backup of your data
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    // In a real app, this would trigger a backup process
                    alert('Backup process started. Your data will be encrypted and downloaded.');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup</span>
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would open a file picker for restore
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.enc';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        alert(`Restore process started for file: ${file.name}`);
                      }
                    };
                    input.click();
                  }}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Security Activity */}
      <motion.div
        className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Security Activity
        </h3>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.status === 'success' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.location} • {activity.device}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Recommendations */}
      <motion.div
        className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Security Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Two-factor authentication is enabled
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Strong encryption is active for all data
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Regular security backups are configured
              </li>
              <li className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Consider reviewing login activity regularly
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;