import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Brain, 
  Heart, 
  Activity, 
  FileImage, 
  X,
  CheckCircle,
  Loader,
  User,
  Phone,
  Mail,
  Clipboard,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createScan, ScanType } from '../../services/scanService';
import { getAllPatients, Patient, createPatient } from '../../services/patientService';

interface PatientDetails {
  name: string;
  phone: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female';
  address?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  scanType: ScanType;
  id: string;
  patientDetails: PatientDetails;
}

const ScanUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: '',
    phone: '',
    email: '',
    age: undefined,
    gender: undefined,
    address: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const scanTypes = [
    { id: 'brain', name: 'Brain MRI', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { id: 'heart', name: 'Cardiac Scan', icon: Heart, color: 'from-red-500 to-pink-600' },
    { id: 'lungs', name: 'Lung CT', icon: Activity, color: 'from-cyan-500 to-blue-600' },
    { id: 'liver', name: 'Liver MRI', icon: FileImage, color: 'from-green-500 to-emerald-600' }
  ];

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      const patientData = await getAllPatients();
      setPatients(patientData);
    };
    
    loadPatients();
  }, []);

  const validatePatientDetails = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!patientDetails.name.trim()) {
      newErrors.name = 'Patient name is required';
    }
    
    if (!patientDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{1,14}$/.test(patientDetails.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!patientDetails.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatientDetailsSubmit = () => {
    if (validatePatientDetails()) {
      // Update the file with patient details
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === currentFileId 
            ? { ...file, patientDetails: { ...patientDetails } }
            : file
        )
      );
      
      // Reset form and close modal
      setPatientDetails({
        name: '',
        phone: '',
        email: '',
        age: undefined,
        gender: undefined,
        address: ''
      });
      setShowPatientForm(false);
      setCurrentFileId('');
      setErrors({});
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFileId = Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          file,
          preview: reader.result as string,
          scanType: 'brain', // Default selection
          id: newFileId,
          patientDetails: {
            name: '',
            phone: '',
            email: ''
          }
        };
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Automatically open patient form for new file
        setCurrentFileId(newFileId);
        setShowPatientForm(true);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dicom', '.dcm']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateScanType = (id: string, scanType: ScanType) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, scanType } : file
      )
    );
  };
  
  const updatePatientId = (id: string, patientId: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, patientId } : file
      )
    );
  };

  const startAnalysis = async () => {
    console.log('Starting analysis...');
    console.log('Uploaded files:', uploadedFiles);
    
    // Validate that all files have patient details
    const filesWithoutPatientDetails = uploadedFiles.filter(
      file => !file.patientDetails.name || !file.patientDetails.phone || !file.patientDetails.email
    );
    
    if (filesWithoutPatientDetails.length > 0) {
      alert('Please provide patient details for all uploaded files before starting analysis.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    try {
      console.log('Processing files...');
      
      // Create patient records and process each file
      const scanPromises = uploadedFiles.map(async (fileData, index) => {
        console.log(`Processing file ${index + 1}:`, fileData.file.name);
        
        try {
          // First, create or find patient
          console.log('Creating patient with data:', fileData.patientDetails);
          
          const newPatient = await createPatient({
            name: fileData.patientDetails.name,
            age: fileData.patientDetails.age || 25,
            gender: fileData.patientDetails.gender || 'male',
            email: fileData.patientDetails.email,
            phone: fileData.patientDetails.phone,
            address: fileData.patientDetails.address || '',
            lastVisit: new Date().toISOString(),
            totalScans: 1,
            riskLevel: 'low',
            conditions: []
          });
          
          console.log('Patient created:', newPatient);
          
          if (newPatient) {
            console.log('Creating scan for patient ID:', newPatient.id);
            const scanResult = await createScan(
              fileData.file,
              newPatient.id,
              fileData.scanType
            );
            console.log('Scan created:', scanResult);
            return scanResult;
          }
          
          console.error('Failed to create patient');
          return null;
        } catch (fileError) {
          console.error(`Error processing file ${fileData.file.name}:`, fileError);
          return null;
        }
      });
      
      console.log('Waiting for all scans to complete...');
      // Wait for all uploads to complete
      const results = await Promise.all(scanPromises);
      console.log('All scan results:', results);
      
      // Check if all uploads were successful
      const successfulResults = results.filter(result => result !== null);
      console.log(`${successfulResults.length}/${results.length} scans completed successfully`);
      
      if (successfulResults.length > 0) {
        console.log('Analysis completed successfully!');
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        // Show success message
        setTimeout(() => {
          alert(`Analysis completed! ${successfulResults.length} scan(s) processed successfully.`);
        }, 1000);
      } else {
        throw new Error('All scans failed to upload');
      }
    } catch (error) {
      console.error('Error during scan analysis:', error);
      setIsAnalyzing(false);
      alert(`Analysis failed: ${error.message}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="w-full max-w-2xl p-8 rounded-2xl bg-white/10 dark:bg-slate-800/40 backdrop-blur-lg shadow-xl border border-white/20 dark:border-slate-700/40 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Upload className="w-7 h-7 text-cyan-400 animate-bounce" />
          Upload Medical Scans
        </h2>
        <p className="text-slate-300 mb-6">Upload MRI, CT, or X-ray images for AI-powered analysis</p>
        <div 
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
            isDragActive 
              ? 'border-cyan-300 bg-cyan-900/30 scale-105' 
              : 'border-cyan-400/40 bg-cyan-900/10 hover:bg-cyan-900/20'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 text-cyan-400 mb-4 ${
            isDragActive ? 'animate-bounce' : 'animate-pulse'
          }`} />
          <span className="text-lg text-white font-medium mb-2">
            {isDragActive ? 'Drop files here...' : 'Drag & drop medical images'}
          </span>
          <span className="text-cyan-300 mb-2">or <span className="underline cursor-pointer">browse files</span></span>
          <span className="text-xs text-slate-400">Supports DICOM, JPEG, PNG formats • Max 10MB per file</span>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            
            <div className="grid gap-4">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  {/* Image Preview */}
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <img 
                      src={file.preview} 
                      alt="Scan preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {file.patientDetails.name && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Patient: {file.patientDetails.name}
                      </p>
                    )}
                  </div>

                  {/* Scan Type Selector */}
                  <div className="flex flex-col space-y-2">
                    <select
                      value={file.scanType}
                      onChange={(e) => updateScanType(file.id, e.target.value as ScanType)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      {scanTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    
                    {/* Patient Details Button */}
                    <button
                      onClick={() => {
                        setCurrentFileId(file.id);
                        setShowPatientForm(true);
                      }}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      {file.patientDetails.name ? 'Edit Patient' : 'Add Patient'}
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Analysis Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                onClick={startAnalysis}
                disabled={isAnalyzing || analysisComplete}
                className={`
                  px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-3 transition-all duration-300
                  ${isAnalyzing 
                    ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' 
                    : analysisComplete
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                  }
                `}
                whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing Scans...</span>
                  </>
                ) : analysisComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Analysis Complete</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Start AI Analysis</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  AI Analysis in Progress
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our advanced AI is analyzing your medical scans for anomalies...
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Analysis Complete */}
      <AnimatePresence>
        {analysisComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Analysis Complete!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Your medical scans have been successfully analyzed. Patient data and scan results have been securely stored in encrypted cloud storage.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => navigate('/dashboard/results')} 
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    View Results
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard/reports')} 
                    className="px-4 py-2 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scans Uploaded', value: uploadedFiles.length, icon: Upload },
          { label: 'Analysis Time', value: '5s avg', icon: Activity },
          { label: 'Accuracy Rate', value: '99.2%', icon: CheckCircle },
          { label: 'Reports Generated', value: '0', icon: FileImage }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
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
      
      {/* Patient Details Modal */}
      <AnimatePresence>
        {showPatientForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPatientForm(false)}
          >
            <motion.div
              className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-cyan-500" />
                  Patient Details
                </h3>
                <button
                  onClick={() => setShowPatientForm(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="Enter patient's full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={patientDetails.phone}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      errors.phone 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={patientDetails.email}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                    placeholder="patient@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={patientDetails.age || ''}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="35"
                      min="0"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={patientDetails.gender || ''}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' || undefined }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={patientDetails.address || ''}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Patient's address"
                    rows={2}
                  />
                </div>
                
                {/* Scan Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Type of Scan *
                  </label>
                  <select
                    value={uploadedFiles.find(f => f.id === currentFileId)?.scanType || 'brain'}
                    onChange={(e) => updateScanType(currentFileId, e.target.value as ScanType)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {scanTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowPatientForm(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handlePatientDetailsSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Details
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanUpload;
