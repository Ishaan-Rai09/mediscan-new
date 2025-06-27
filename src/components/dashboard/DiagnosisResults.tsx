import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Activity, 
  FileImage, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Eye,
  Loader2,
  MapPin,
  Info,
  Zap,
  FileText
} from 'lucide-react';
import { getAllScans, getScanById, ScanResult } from '../../services/scanService';
import { createReportFromScan } from '../../services/reportService';

// Use the ScanResult interface from scanService
// No need to redefine interfaces

const DiagnosisResults: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [selectedScan, setSelectedScan] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        setLoading(true);
        if (scanId) {
          // If a specific scan ID is provided in the URL
          const scan = await getScanById(scanId);
          if (scan) {
            setScanResults([scan]);
          } else {
            setError('Scan not found');
          }
        } else {
          // Get all scans and filter for those with analysis results
          const { getAllScans } = await import('../../services/scanService');
          const allScans = await getAllScans();
          const scansWithAnalysis = allScans.filter(scan => 
            scan.anomalies && scan.anomalies.length > 0
          );
          
          if (scansWithAnalysis.length > 0) {
            setScanResults(scansWithAnalysis);
          } else {
            setError('No analyzed scans found');
          }
        }
      } catch (err) {
        console.error('Error fetching scan data:', err);
        setError('Failed to load scan data');
      } finally {
        setLoading(false);
      }
    };

    fetchScanData();
  }, [scanId]);

  const currentScan = scanResults[selectedScan];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const getOverallRisk = (scan: ScanResult): string => {
    if (scan.anomalies.length === 0) return 'Low';
    
    const highRiskCount = scan.anomalies.filter(a => a.type === 'high').length;
    const mediumRiskCount = scan.anomalies.filter(a => a.type === 'medium').length;
    
    if (highRiskCount > 0) return 'High';
    if (mediumRiskCount > 1) return 'High';
    if (mediumRiskCount > 0) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6 pt-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Diagnosis Results
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered analysis results with detailed anomaly detection
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            onClick={() => {
              if (currentScan?.reportUrl) {
                window.open(currentScan.reportUrl, '_blank');
              }
            }}
            disabled={!currentScan?.reportUrl}
          >
            <Download className="w-4 h-4" />
            <span>{currentScan?.reportUrl ? 'Download Report' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading scan results...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          <p className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </p>
          <button 
            className="mt-3 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
            onClick={() => navigate('/dashboard/upload')}
          >
            Upload a new scan
          </button>
        </div>
      )}

      {/* Scan Selector */}
      {!loading && !error && scanResults.length > 0 && (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {scanResults.map((scan, index) => (
            <motion.button
              key={scan.id}
              onClick={() => setSelectedScan(index)}
              className={`
                flex-shrink-0 p-4 rounded-lg border-2 transition-all duration-200 min-w-[200px]
                ${selectedScan === index 
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  {scan.type === 'Brain MRI' ? <Brain className="w-4 h-4 text-white" /> : <Heart className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{scan.type}</span>
              </div>
              <div className="text-left space-y-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">Patient: {scan.patientId}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Date: {new Date(scan.scanDate).toLocaleDateString()}</p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getOverallRisk(scan))}`}>
                  {getOverallRisk(scan)} Risk
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Results */}
      {!loading && !error && currentScan && (
        <div className="grid lg:grid-cols-2 gap-8">
        {/* Scan Image */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          key={selectedScan}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Scan Image
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                  ${showHeatmap 
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }
                `}
              >
                Heatmap
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden aspect-square">
            <img 
              src={currentScan.image}
              alt="Medical scan"
              className="w-full h-full object-cover"
            />
            
            {/* Anomaly Markers */}
            {showHeatmap && currentScan.anomalies.map((anomaly) => (
              <motion.div
                key={anomaly.id}
                className={`
                  absolute w-4 h-4 rounded-full border-2 border-white cursor-pointer
                  ${anomaly.type === 'high' ? 'bg-red-500' : 
                    anomaly.type === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                `}
                style={{
                  left: `${anomaly.coordinates.x}%`,
                  top: `${anomaly.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.5 }}
                title={anomaly.title}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
              </motion.div>
            ))}

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis Completed</span>
              </div>
              <p className="text-xs opacity-90">
                {currentScan.anomalies.length} anomal{currentScan.anomalies.length !== 1 ? 'ies' : 'y'} detected
              </p>
            </div>
          </div>
        </motion.div>

        {/* Anomaly Details */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          key={selectedScan}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Detected Anomalies
          </h3>

          <div className="space-y-4">
            {currentScan.anomalies.map((anomaly, index) => (
              <motion.div
                key={anomaly.id}
                className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getAnomalyIcon(anomaly.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {anomaly.title}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(anomaly.type)}`}>
                        {anomaly.confidence}% confidence
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {anomaly.description}
                    </p>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Activity className="w-4 h-4 mr-2" />
                      <span>Location: {anomaly.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Assessment */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Overall Assessment
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Risk Level:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(getOverallRisk(currentScan))}`}>
                  {getOverallRisk(currentScan)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Anomalies Found:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentScan.anomalies.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Analysis Confidence:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {Math.round(currentScan.anomalies.reduce((acc, anomaly) => acc + anomaly.confidence, 0) / currentScan.anomalies.length)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={async () => {
                if (currentScan.reportUrl) {
                  window.open(currentScan.reportUrl, '_blank');
                  return;
                }
                
                try {
                  setGenerating(true);
                  
                  // Create a simple PDF report (placeholder)
                  const reportContent = `
                    Medical Scan Report
                    Patient: ${currentScan.patientId}
                    Scan Type: ${currentScan.type}
                    Date: ${new Date(currentScan.scanDate).toLocaleDateString()}
                    Risk Level: ${getOverallRisk(currentScan)}
                    Anomalies: ${currentScan.anomalies.length}
                    Status: ${currentScan.status}
                  `;
                  
                  const pdfBlob = new Blob([reportContent], { type: 'application/pdf' });
                  
                  const reportData = {
                    doctor: 'AI System',
                    findings: `${currentScan.anomalies.length} anomalies detected with ${getOverallRisk(currentScan).toLowerCase()} risk level`,
                    recommendations: 'Please consult with a medical professional for detailed analysis',
                    patientName: currentScan.patientId
                  };
                  
                  // Generate and store the report
                  const report = await createReportFromScan(currentScan, reportData, pdfBlob);
                  
                  // Update the scan with the report URL
                  if (report) {
                    const reportUrl = report.pdfIpfsHash ? `https://gateway.pinata.cloud/ipfs/${report.pdfIpfsHash}` : '#';
                    const updatedScan = {...currentScan, reportUrl, reportGenerated: true};
                    await updateScanWithAnalysis(updatedScan.id, updatedScan);
                    
                    // Update the local state
                    setScanResults(prev => {
                      const newResults = [...prev];
                      newResults[selectedScan] = updatedScan;
                      return newResults;
                    });
                    
                    // Open the report
                    if (reportUrl !== '#') {
                      window.open(reportUrl, '_blank');
                    }
                  }
                } catch (err) {
                  console.error('Error generating report:', err);
                  alert('Failed to generate report. Please try again.');
                } finally {
                  setGenerating(false);
                }
              }}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{currentScan.reportUrl ? 'View PDF Report' : 'Generate PDF Report'}</span>
                </>
              )}
            </button>
            <button 
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              onClick={() => {
                const url = `${window.location.origin}/dashboard/results/${currentScan.id}`;
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
              }}
            >
              Share Results
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisResults;