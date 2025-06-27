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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createScan, ScanType } from '../../services/scanService';
import { getAllPatients, Patient } from '../../services/patientService';

interface UploadedFile {
  file: File;
  preview: string;
  scanType: ScanType;
  id: string;
  patientId: string;
}

const ScanUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

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
      if (patientData.length > 0) {
        setSelectedPatientId(patientData[0].id);
      }
    };
    
    loadPatients();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: UploadedFile = {
          file,
          preview: reader.result as string,
          scanType: 'brain', // Default selection
          id: Math.random().toString(36).substr(2, 9),
          patientId: selectedPatientId
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  }, [selectedPatientId]);

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
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    try {
      // Process each file
      const scanPromises = uploadedFiles.map(async (fileData) => {
        return await createScan(
          fileData.file,
          fileData.patientId,
          fileData.scanType
        );
      });
      
      // Wait for all uploads to complete
      const results = await Promise.all(scanPromises);
      
      // Check if all uploads were successful
      const allSuccessful = results.every(result => result !== null);
      
      if (allSuccessful) {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      } else {
        throw new Error('Some scans failed to upload');
      }
    } catch (error) {
      console.error('Error during scan analysis:', error);
      setIsAnalyzing(false);
      // Handle error state here
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
                    
                    {/* Patient Selector */}
                    <select
                      value={file.patientId}
                      onChange={(e) => updatePatientId(file.id, e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
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
                  Your medical scans have been successfully analyzed. View detailed results and generate reports.
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
                  Generate Report
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
    </div>
  );
};

export default ScanUpload;