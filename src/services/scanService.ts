import api from './api';
import { uploadFileToPinata, uploadJsonToPinata } from './pinataService';

// Define scan types
export type ScanType = 'brain' | 'heart' | 'lungs' | 'liver';

// Define risk levels
export type RiskLevel = 'low' | 'medium' | 'high';

// Define anomaly interface
export interface Anomaly {
  id: string;
  type: RiskLevel;
  title: string;
  description: string;
  location: string;
  confidence: number;
  coordinates: { x: number; y: number };
}

// Define scan result interface
export interface ScanResult {
  id: string;
  patientId: string;
  type: string;
  scanDate: string;
  image: string;
  imageIpfsHash?: string;
  anomalies: Anomaly[];
  anomaliesIpfsHash?: string;
  reportIpfsHash?: string;
  status: 'processing' | 'completed' | 'reviewed';
}

/**
 * Upload a scan image to IPFS with encryption
 */
export const uploadScanImage = async (file: File, metadata: Record<string, string | number | boolean>) => {
  try {
    // Upload the image file to IPFS with encryption
    const result = await uploadFileToPinata(file, {
      patientId: metadata.patientId,
      scanType: metadata.scanType,
      scanDate: new Date().toISOString(),
      encrypted: true,
      fileType: 'medical_scan',
      ...metadata
    });
    
    if (!result.success) {
      throw new Error('Failed to upload scan image to IPFS');
    }
    
    console.log('Scan image uploaded to IPFS:', result.ipfsHash);
    return result;
  } catch (error) {
    console.error('Error uploading scan image:', error);
    throw error;
  }
};

/**
 * Create a new scan record
 */
export const createScan = async (
  file: File, 
  patientId: string, 
  scanType: ScanType
): Promise<ScanResult | null> => {
  try {
    // Upload image to IPFS
    const ipfsResult = await uploadScanImage(file, {
      patientId,
      scanType,
      filename: file.name
    });
    
    if (!ipfsResult.success) {
      throw new Error('Failed to upload scan to IPFS');
    }
    
    // Generate unique scan ID
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate AI analysis
    const analysisResult = await simulateAIAnalysis(scanType);
    
    // Create scan record with IPFS reference and analysis results
    const scanData: ScanResult = {
      id: scanId,
      patientId,
      type: scanType,
      scanDate: new Date().toISOString(),
      imageIpfsHash: ipfsResult.ipfsHash,
      // Use gateway URL for immediate display
      image: `https://gateway.pinata.cloud/ipfs/${ipfsResult.ipfsHash}`,
      anomalies: analysisResult.anomalies,
      status: 'completed'
    };
    
    // Store scan in localStorage
    const localScans = localStorage.getItem('scans');
    const scans = localScans ? JSON.parse(localScans) : [];
    scans.push(scanData);
    localStorage.setItem('scans', JSON.stringify(scans));
    
    // Create a report for this scan
    await createReportForScan(scanData);
    
    // Update patient's scan count
    await updatePatientScanCount(patientId);
    
    // Try to save to API as well
    try {
      await api.post('/scans', scanData);
    } catch (apiError) {
      console.warn('API unavailable, scan stored locally only:', apiError);
    }
    
    return scanData;
  } catch (error) {
    console.error('Error creating scan:', error);
    return null;
  }
};

/**
 * Simulate AI analysis for different scan types
 */
const simulateAIAnalysis = async (scanType: ScanType): Promise<{ anomalies: Anomaly[] }> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const anomalies: Anomaly[] = [];
  
  // Generate random anomalies based on scan type
  const anomalyCount = Math.floor(Math.random() * 4); // 0-3 anomalies
  
  for (let i = 0; i < anomalyCount; i++) {
    const riskLevels: RiskLevel[] = ['low', 'medium', 'high'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    const anomaly: Anomaly = {
      id: `anomaly_${Date.now()}_${i}`,
      type: riskLevel,
      title: getAnomalyTitle(scanType, riskLevel),
      description: getAnomalyDescription(scanType, riskLevel),
      location: getAnomalyLocation(scanType),
      confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
      coordinates: {
        x: Math.floor(Math.random() * 512),
        y: Math.floor(Math.random() * 512)
      }
    };
    
    anomalies.push(anomaly);
  }
  
  return { anomalies };
};

/**
 * Get anomaly title based on scan type and risk level
 */
const getAnomalyTitle = (scanType: ScanType, riskLevel: RiskLevel): string => {
  const titles = {
    brain: {
      low: 'Minor brain tissue variation',
      medium: 'Possible lesion detected',
      high: 'Significant abnormality found'
    },
    heart: {
      low: 'Mild cardiac irregularity',
      medium: 'Coronary artery narrowing',
      high: 'Critical cardiac anomaly'
    },
    lungs: {
      low: 'Small lung nodule',
      medium: 'Pulmonary infiltrate',
      high: 'Suspicious mass detected'
    },
    liver: {
      low: 'Minor hepatic cyst',
      medium: 'Liver lesion identified',
      high: 'Significant hepatic abnormality'
    }
  };
  
  return titles[scanType][riskLevel];
};

/**
 * Get anomaly description based on scan type and risk level
 */
const getAnomalyDescription = (scanType: ScanType, riskLevel: RiskLevel): string => {
  const descriptions = {
    brain: {
      low: 'Small area of altered signal intensity, likely benign variation.',
      medium: 'Focal lesion requiring further evaluation and follow-up.',
      high: 'Large abnormality with characteristics requiring immediate attention.'
    },
    heart: {
      low: 'Minor variation in cardiac structure within normal limits.',
      medium: 'Moderate stenosis detected, clinical correlation recommended.',
      high: 'Severe abnormality requiring urgent cardiology consultation.'
    },
    lungs: {
      low: 'Small pulmonary nodule, routine follow-up recommended.',
      medium: 'Infiltrative changes, consider infection or inflammation.',
      high: 'Large mass with concerning characteristics, biopsy recommended.'
    },
    liver: {
      low: 'Simple hepatic cyst, no immediate concern.',
      medium: 'Focal liver lesion, further characterization needed.',
      high: 'Complex liver abnormality requiring specialist evaluation.'
    }
  };
  
  return descriptions[scanType][riskLevel];
};

/**
 * Get anatomical location description for anomaly
 */
const getAnomalyLocation = (scanType: ScanType): string => {
  const locations = {
    brain: ['frontal lobe', 'parietal lobe', 'temporal lobe', 'occipital lobe', 'cerebellum'],
    heart: ['left ventricle', 'right ventricle', 'left atrium', 'right atrium', 'coronary arteries'],
    lungs: ['upper right lobe', 'middle right lobe', 'lower right lobe', 'upper left lobe', 'lower left lobe'],
    liver: ['right lobe', 'left lobe', 'quadrate lobe', 'caudate lobe']
  };
  
  const locationArray = locations[scanType];
  return locationArray[Math.floor(Math.random() * locationArray.length)];
};

/**
 * Create a report for a completed scan
 */
const createReportForScan = async (scanResult: ScanResult): Promise<void> => {
  try {
    // Get patient info
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patient = patients.find((p: any) => p.id === scanResult.patientId);
    
    const report = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId: scanResult.patientId,
      patientName: patient?.name || 'Unknown Patient',
      scanId: scanResult.id,
      scanType: scanResult.type,
      date: scanResult.scanDate,
      doctor: 'Dr. AI Assistant',
      status: 'reviewed',
      riskLevel: scanResult.anomalies.length > 2 ? 'high' : scanResult.anomalies.length > 0 ? 'medium' : 'low',
      findings: generateFindings(scanResult),
      recommendations: generateRecommendations(scanResult),
      pdfIpfsHash: `report_${scanResult.id}_pdf`,
      metadataIpfsHash: `report_${scanResult.id}_metadata`
    };
    
    // Store report in localStorage
    const localReports = localStorage.getItem('reports');
    const reports = localReports ? JSON.parse(localReports) : [];
    reports.push(report);
    localStorage.setItem('reports', JSON.stringify(reports));
    
  } catch (error) {
    console.error('Error creating report for scan:', error);
  }
};

/**
 * Update patient's total scan count
 */
const updatePatientScanCount = async (patientId: string): Promise<void> => {
  try {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const updatedPatients = patients.map((patient: any) => {
      if (patient.id === patientId) {
        return {
          ...patient,
          totalScans: (patient.totalScans || 0) + 1,
          lastVisit: new Date().toISOString()
        };
      }
      return patient;
    });
    
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  } catch (error) {
    console.error('Error updating patient scan count:', error);
  }
};

/**
 * Generate findings text based on scan results
 */
const generateFindings = (scanResult: ScanResult): string => {
  if (scanResult.anomalies.length === 0) {
    return `${scanResult.type} scan shows normal structure with no significant abnormalities detected. All major anatomical features appear within normal limits.`;
  }
  
  const anomalyDescriptions = scanResult.anomalies.map(anomaly => 
    `${anomaly.type} severity anomaly detected in ${anomaly.location} with ${(anomaly.confidence * 100).toFixed(1)}% confidence`
  ).join('. ');
  
  return `${scanResult.type} scan reveals the following findings: ${anomalyDescriptions}. Further evaluation recommended.`;
};

/**
 * Generate recommendations based on scan results
 */
const generateRecommendations = (scanResult: ScanResult): string => {
  if (scanResult.anomalies.length === 0) {
    return 'Continue with routine follow-up examinations as clinically indicated. Maintain current health regimen.';
  }
  
  const highRiskAnomalies = scanResult.anomalies.filter(a => a.type === 'high').length;
  const mediumRiskAnomalies = scanResult.anomalies.filter(a => a.type === 'medium').length;
  
  if (highRiskAnomalies > 0) {
    return 'Immediate consultation with specialist recommended. Consider additional diagnostic imaging and clinical correlation. Follow-up within 1-2 weeks.';
  } else if (mediumRiskAnomalies > 0) {
    return 'Follow-up imaging in 3-6 months recommended. Clinical correlation advised. Monitor for symptom progression.';
  } else {
    return 'Routine follow-up in 6-12 months. Continue current treatment if applicable. Monitor for any symptom changes.';
  }
};

/**
 * Get all scans
 */
export const getAllScans = async (): Promise<ScanResult[]> => {
  try {
    const response = await api.get('/scans');
    return response.data;
  } catch (error) {
    console.error('Error fetching scans:', error);
    
    // Fallback to local storage if API fails
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      return JSON.parse(localScans);
    }
    
    // Return empty array if no data available
    return [];
  }
};

/**
 * Get scans for a specific patient
 */
export const getPatientScans = async (patientId: string): Promise<ScanResult[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/scans`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scans for patient ${patientId}:`, error);
    
    // Try to get from local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      return scans.filter(scan => scan.patientId === patientId);
    }
    
    return [];
  }
};

/**
 * Get scan by ID
 */
export const getScanById = async (id: string): Promise<ScanResult | null> => {
  try {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scan ${id}:`, error);
    
    // Try to get from local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      return scans.find(s => s.id === id) || null;
    }
    
    return null;
  }
};

/**
 * Update scan anomalies after AI analysis
 */
export const updateScanWithAnomalies = async (
  scanId: string, 
  anomalies: Anomaly[]
): Promise<ScanResult | null> => {
  try {
    // Get current scan data
    const currentScan = await getScanById(scanId);
    if (!currentScan) {
      throw new Error(`Scan ${scanId} not found`);
    }
    
    // Upload anomalies data to IPFS
    const ipfsResult = await uploadJsonToPinata(
      { anomalies }, 
      `scan_anomalies_${scanId}`
    );
    
    if (!ipfsResult.success) {
      throw new Error('Failed to upload anomalies data to IPFS');
    }
    
    // Update scan with anomalies and IPFS reference
    const updateData = {
      anomalies,
      anomaliesIpfsHash: ipfsResult.ipfsHash,
      status: 'completed' as const
    };
    
    // Update via API
    const response = await api.put(`/scans/${scanId}`, updateData);
    const updatedScan = response.data;
    
    // Update local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      const updatedScans = scans.map(s => 
        s.id === scanId ? { ...s, ...updateData } : s
      );
      localStorage.setItem('scans', JSON.stringify(updatedScans));
    }
    
    return updatedScan;
  } catch (error) {
    console.error(`Error updating scan ${scanId} with anomalies:`, error);
    return null;
  }
};

/**
 * Generate and store a PDF report for a scan
 */
export const generateScanReport = async (
  scanId: string, 
  reportPdfBlob: Blob
): Promise<ScanResult | null> => {
  try {
    // Get current scan data
    const currentScan = await getScanById(scanId);
    if (!currentScan) {
      throw new Error(`Scan ${scanId} not found`);
    }
    
    // Convert Blob to File for upload
    const reportFile = new File(
      [reportPdfBlob], 
      `scan_report_${scanId}.pdf`, 
      { type: 'application/pdf' }
    );
    
    // Upload report to IPFS
    const ipfsResult = await uploadFileToPinata(reportFile, {
      scanId,
      patientId: currentScan.patientId,
      reportType: 'scan_report',
      scanType: currentScan.type,
      generatedAt: new Date().toISOString()
    });
    
    if (!ipfsResult.success) {
      throw new Error('Failed to upload report to IPFS');
    }
    
    // Update scan with report IPFS reference
    const updateData = {
      reportIpfsHash: ipfsResult.ipfsHash,
      status: 'reviewed' as const
    };
    
    // Update via API
    const response = await api.put(`/scans/${scanId}`, updateData);
    const updatedScan = response.data;
    
    // Update local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      const updatedScans = scans.map(s => 
        s.id === scanId ? { ...s, ...updateData } : s
      );
      localStorage.setItem('scans', JSON.stringify(updatedScans));
    }
    
    return updatedScan;
  } catch (error) {
    console.error(`Error generating report for scan ${scanId}:`, error);
    return null;
  }
};

/**
 * Update scan with analysis results (general update function)
 */
export const updateScanWithAnalysis = async (
  scanId: string, 
  updateData: Partial<ScanResult>
): Promise<ScanResult | null> => {
  try {
    // Update via API
    const response = await api.put(`/scans/${scanId}`, updateData);
    const updatedScan = response.data;
    
    // Update local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      const updatedScans = scans.map(s => 
        s.id === scanId ? { ...s, ...updateData } : s
      );
      localStorage.setItem('scans', JSON.stringify(updatedScans));
    }
    
    return updatedScan;
  } catch (error) {
    console.error(`Error updating scan ${scanId}:`, error);
    return null;
  }
};

/**
 * Delete a scan
 */
export const deleteScan = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/scans/${id}`);
    
    // Update local storage
    const localScans = localStorage.getItem('scans');
    if (localScans) {
      const scans = JSON.parse(localScans) as ScanResult[];
      const updatedScans = scans.filter(s => s.id !== id);
      localStorage.setItem('scans', JSON.stringify(updatedScans));
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting scan ${id}:`, error);
    return false;
  }
};
