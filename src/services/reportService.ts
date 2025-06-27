import api from './api';
import { uploadEncryptedPdfToPinata, uploadEncryptedJsonToPinata } from './pinataService';
import { ScanResult } from './scanService';

// Define report interface
export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  scanId: string;
  scanType: string;
  date: string;
  doctor: string;
  status: 'pending' | 'reviewed' | 'shared';
  riskLevel: 'low' | 'medium' | 'high';
  findings: string;
  recommendations: string;
  pdfIpfsHash?: string;
  metadataIpfsHash?: string;
}

/**
 * Get all reports from Pinata cloud storage
 */
export const getAllReports = async (): Promise<Report[]> => {
  try {
    // Try to get from Pinata cloud storage first
    const pinataReports = await getPinataReports();
    if (pinataReports && pinataReports.length > 0) {
      return pinataReports;
    }
    
    // Fallback to local storage if API fails
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      return JSON.parse(localReports);
    }
    
    // Return demo reports if no data available
    return generateDemoReports();
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Return demo reports on error
    return generateDemoReports();
  }
};

/**
 * Get reports from Pinata IPFS storage
 */
const getPinataReports = async (): Promise<Report[] | null> => {
  try {
    // This would fetch report data from Pinata IPFS
    // For now, we'll return null to fallback to local storage
    console.log('Attempting to fetch reports from Pinata...');
    return null;
  } catch (error) {
    console.error('Error fetching reports from Pinata:', error);
    return null;
  }
};

/**
 * Generate demo reports for development
 */
const generateDemoReports = (): Report[] => {
  return [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      scanId: 'scan1',
      scanType: 'Brain MRI',
      date: '2024-02-20T10:30:00Z',
      doctor: 'Dr. Smith',
      status: 'reviewed',
      riskLevel: 'low',
      findings: 'Normal brain structure observed. No abnormalities detected.',
      recommendations: 'Continue regular check-ups.',
      pdfIpfsHash: 'QmReport1PDFHash',
      metadataIpfsHash: 'QmReport1MetadataHash'
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Sarah Johnson',
      scanId: 'scan2',
      scanType: 'Lung CT',
      date: '2024-02-19T14:45:00Z',
      doctor: 'Dr. Johnson',
      status: 'pending',
      riskLevel: 'medium',
      findings: 'Small nodule detected in upper right lobe. Requires follow-up.',
      recommendations: 'Follow-up CT scan in 3 months. Consider consultation with pulmonologist.',
      pdfIpfsHash: 'QmReport2PDFHash',
      metadataIpfsHash: 'QmReport2MetadataHash'
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Michael Chen',
      scanId: 'scan3',
      scanType: 'Cardiac CT',
      date: '2024-02-18T09:15:00Z',
      doctor: 'Dr. Chen',
      status: 'shared',
      riskLevel: 'high',
      findings: 'Mild coronary artery calcification observed.',
      recommendations: 'Lifestyle modifications and statin therapy.',
      pdfIpfsHash: 'QmReport3PDFHash',
      metadataIpfsHash: 'QmReport3MetadataHash'
    }
  ];
};

/**
 * Get reports for a specific patient
 */
export const getPatientReports = async (patientId: string): Promise<Report[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/reports`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports for patient ${patientId}:`, error);
    
    // Try to get from local storage
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      const reports = JSON.parse(localReports) as Report[];
      return reports.filter(report => report.patientId === patientId);
    }
    
    return [];
  }
};

/**
 * Get report by ID
 */
export const getReportById = async (id: string): Promise<Report | null> => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    
    // Try to get from local storage
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      const reports = JSON.parse(localReports) as Report[];
      return reports.find(r => r.id === id) || null;
    }
    
    return null;
  }
};

/**
 * Create a new report from scan results
 */
export const createReportFromScan = async (
  scanResult: ScanResult,
  reportData: {
    doctor: string;
    findings: string;
    recommendations: string;
    patientName: string;
  },
  pdfBlob: Blob
): Promise<Report | null> => {
  try {
    // Convert Blob to File for upload
    const reportFile = new File(
      [pdfBlob], 
      `report_${scanResult.id}_${Date.now()}.pdf`, 
      { type: 'application/pdf' }
    );
    
    // Upload encrypted PDF to IPFS
    const pdfIpfsResult = await uploadEncryptedPdfToPinata(reportFile, {
      scanId: scanResult.id,
      patientId: scanResult.patientId,
      reportType: 'diagnostic_report',
      scanType: scanResult.type,
      generatedAt: new Date().toISOString()
    });
    
    if (!pdfIpfsResult.success) {
      throw new Error('Failed to upload report PDF to IPFS');
    }
    
    // Calculate risk level based on anomalies
    const highRiskAnomalies = scanResult.anomalies.filter(a => a.type === 'high').length;
    const mediumRiskAnomalies = scanResult.anomalies.filter(a => a.type === 'medium').length;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (highRiskAnomalies > 0) {
      riskLevel = 'high';
    } else if (mediumRiskAnomalies > 0) {
      riskLevel = 'medium';
    }
    
    // Create report metadata
    const reportMetadata = {
      scanId: scanResult.id,
      patientId: scanResult.patientId,
      scanType: scanResult.type,
      date: new Date().toISOString(),
      anomalies: scanResult.anomalies,
      findings: reportData.findings,
      recommendations: reportData.recommendations,
      riskLevel,
      doctor: reportData.doctor,
      pdfIpfsHash: pdfIpfsResult.ipfsHash
    };
    
    // Upload encrypted metadata to IPFS
    const metadataIpfsResult = await uploadEncryptedJsonToPinata(
      reportMetadata, 
      `report_metadata_${scanResult.id}`
    );
    
    if (!metadataIpfsResult.success) {
      throw new Error('Failed to upload report metadata to IPFS');
    }
    
    // Create report record
    const newReport = {
      patientId: scanResult.patientId,
      patientName: reportData.patientName,
      scanId: scanResult.id,
      scanType: scanResult.type,
      date: new Date().toISOString(),
      doctor: reportData.doctor,
      status: 'reviewed' as const,
      riskLevel,
      findings: reportData.findings,
      recommendations: reportData.recommendations,
      pdfIpfsHash: pdfIpfsResult.ipfsHash,
      metadataIpfsHash: metadataIpfsResult.ipfsHash
    };
    
    // Save to API
    const response = await api.post('/reports', newReport);
    const createdReport = response.data;
    
    // Update local storage
    const localReports = localStorage.getItem('reports');
    const reports = localReports ? JSON.parse(localReports) : [];
    reports.push(createdReport);
    localStorage.setItem('reports', JSON.stringify(reports));
    
    return createdReport;
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
};

/**
 * Update an existing report
 */
export const updateReport = async (id: string, reportData: Partial<Report>, newPdfBlob?: Blob): Promise<Report | null> => {
  try {
    // Get current report data
    const currentReport = await getReportById(id);
    if (!currentReport) {
      throw new Error(`Report ${id} not found`);
    }
    
    let pdfIpfsHash = currentReport.pdfIpfsHash;
    
    // If there's a new PDF, upload it to IPFS
    if (newPdfBlob) {
      const reportFile = new File(
        [newPdfBlob], 
        `report_${currentReport.scanId}_${Date.now()}.pdf`, 
        { type: 'application/pdf' }
      );
      
      const pdfIpfsResult = await uploadEncryptedPdfToPinata(reportFile, {
        reportId: id,
        scanId: currentReport.scanId,
        patientId: currentReport.patientId,
        reportType: 'updated_diagnostic_report',
        scanType: currentReport.scanType,
        updatedAt: new Date().toISOString()
      });
      
      if (!pdfIpfsResult.success) {
        throw new Error('Failed to upload updated report PDF to IPFS');
      }
      
      pdfIpfsHash = pdfIpfsResult.ipfsHash;
    }
    
    // Update report data
    const updateData = {
      ...reportData,
      pdfIpfsHash
    };
    
    // Update via API
    const response = await api.put(`/reports/${id}`, updateData);
    const updatedReport = response.data;
    
    // Update local storage
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      const reports = JSON.parse(localReports) as Report[];
      const updatedReports = reports.map(r => 
        r.id === id ? { ...r, ...updateData } : r
      );
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    }
    
    return updatedReport;
  } catch (error) {
    console.error(`Error updating report ${id}:`, error);
    return null;
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/reports/${id}`);
    
    // Update local storage
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      const reports = JSON.parse(localReports) as Report[];
      const updatedReports = reports.filter(r => r.id !== id);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting report ${id}:`, error);
    return false;
  }
};

/**
 * Get PDF URL for a report
 */
export const getReportPdfUrl = (ipfsHash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};

/**
 * Download PDF report
 */
export const downloadReportPdf = async (report: Report): Promise<boolean> => {
  try {
    if (!report.pdfIpfsHash) {
      // Generate PDF if it doesn't exist
      const pdfBlob = await generateReportPdf(report);
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }
      
      // Download the generated PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${report.patientName}_${report.scanType}_${new Date(report.date).toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    }
    
    // Download from IPFS
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${report.pdfIpfsHash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF from IPFS');
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${report.patientName}_${report.scanType}_${new Date(report.date).toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return false;
  }
};

/**
 * Generate PDF report from report data
 */
export const generateReportPdf = async (report: Report): Promise<Blob | null> => {
  try {
    // Dynamic import to reduce bundle size
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 200);
    doc.text('MediScan AI - Medical Report', pageWidth / 2, 30, { align: 'center' });
    
    // Patient Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Patient Information', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Patient Name: ${report.patientName}`, 20, 75);
    doc.text(`Patient ID: ${report.patientId}`, 20, 85);
    doc.text(`Report Date: ${new Date(report.date).toLocaleDateString()}`, 20, 95);
    doc.text(`Doctor: ${report.doctor}`, 20, 105);
    
    // Scan Information
    doc.setFontSize(14);
    doc.text('Scan Information', 20, 125);
    
    doc.setFontSize(12);
    doc.text(`Scan Type: ${report.scanType} Scan`, 20, 140);
    doc.text(`Risk Level: ${report.riskLevel.toUpperCase()}`, 20, 150);
    doc.text(`Status: ${report.status}`, 20, 160);
    
    // Risk Level Color Coding
    const riskColors = {
      high: [255, 0, 0],
      medium: [255, 165, 0],
      low: [0, 128, 0]
    };
    
    const [r, g, b] = riskColors[report.riskLevel as keyof typeof riskColors] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.text(`● ${report.riskLevel.toUpperCase()} RISK`, 120, 150);
    doc.setTextColor(0, 0, 0);
    
    // Findings
    doc.setFontSize(14);
    doc.text('Findings', 20, 180);
    
    doc.setFontSize(11);
    const findingsLines = doc.splitTextToSize(report.findings, pageWidth - 40);
    doc.text(findingsLines, 20, 195);
    
    // Recommendations
    const recommendationsY = 195 + (findingsLines.length * 5) + 15;
    doc.setFontSize(14);
    doc.text('Recommendations', 20, recommendationsY);
    
    doc.setFontSize(11);
    const recommendationsLines = doc.splitTextToSize(report.recommendations, pageWidth - 40);
    doc.text(recommendationsLines, 20, recommendationsY + 15);
    
    // Footer
    const footerY = pageHeight - 30;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('This report was generated by MediScan AI - www.mediscan.ai', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 10, { align: 'center' });
    
    // Add page border
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};

/**
 * Share a report (e.g., via email)
 */
export const shareReport = async (reportId: string, recipientEmail: string): Promise<boolean> => {
  try {
    await api.post(`/reports/${reportId}/share`, { recipientEmail });
    
    // Update report status in local storage
    const localReports = localStorage.getItem('reports');
    if (localReports) {
      const reports = JSON.parse(localReports) as Report[];
      const updatedReports = reports.map(r => 
        r.id === reportId ? { ...r, status: 'shared' } : r
      );
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    }
    
    return true;
  } catch (error) {
    console.error(`Error sharing report ${reportId}:`, error);
    return false;
  }
};