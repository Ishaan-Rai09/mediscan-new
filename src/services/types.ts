// Common interfaces for services

// Patient interfaces
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Scan interfaces
export enum ScanType {
  BRAIN_MRI = 'Brain MRI',
  CARDIAC_CT = 'Cardiac CT',
  LUNG_CT = 'Lung CT',
  LIVER_MRI = 'Liver MRI'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Anomaly {
  id: string;
  name: string;
  description: string;
  location: string;
  confidence: number;
  riskLevel: RiskLevel;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Scan {
  id: string;
  patientId: string;
  scanType: ScanType;
  imageUrl: string;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  anomalies: Anomaly[];
  anomaliesCount: number;
  overallRisk: RiskLevel;
  analysisConfidence: number;
  reportId?: string;
  reportUrl?: string;
}

// Report interfaces
export interface Report {
  id: string;
  scanId: string;
  patientId: string;
  scanType: ScanType;
  date: string;
  reportUrl: string;
  status: 'processing' | 'completed';
  anomaliesCount: number;
  riskLevel: RiskLevel;
}

// Analytics interfaces
export interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>; // React component
  color: string;
}

export interface ScanTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesData {
  day: string;
  scans: number;
  anomalies: number;
}

export interface AnalyticsData {
  stats: StatCard[];
  scanTypeDistribution: ScanTypeData[];
  timeSeriesData: TimeSeriesData[];
}