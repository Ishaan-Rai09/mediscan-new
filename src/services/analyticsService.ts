import api from './api';
import { ScanResult } from './scanService';
import { Patient } from './patientService';
import { BarChart3, FileText, Users, AlertCircle } from 'lucide-react';

// Define analytics data interfaces
export interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
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

/**
 * Calculate percentage change between two values
 */
const calculateChange = (current: number, previous: number): string => {
  if (previous === 0) return '+100%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

/**
 * Get analytics data for the dashboard
 */
export const getAnalyticsData = async (timeRange: string = '7d'): Promise<AnalyticsData | null> => {
  try {
    // Try to get from Pinata cloud storage first
    const pinataData = await getPinataAnalytics(timeRange);
    if (pinataData) {
      return pinataData;
    }
    
    // If Pinata fails, calculate analytics from local data
    return calculateLocalAnalytics(timeRange);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // If all fails, calculate analytics from local data
    return calculateLocalAnalytics(timeRange);
  }
};

/**
 * Get analytics data from Pinata IPFS storage
 */
const getPinataAnalytics = async (timeRange: string): Promise<AnalyticsData | null> => {
  try {
    // This would fetch analytics data from Pinata IPFS
    // For now, we'll return null to fallback to local calculation
    console.log('Attempting to fetch analytics from Pinata for timeRange:', timeRange);
    return null;
  } catch (error) {
    console.error('Error fetching analytics from Pinata:', error);
    return null;
  }
};

/**
 * Calculate analytics from local storage data
 */
const calculateLocalAnalytics = (timeRange: string): AnalyticsData | null => {
  try {
    // Get local data
    const localScans = localStorage.getItem('scans');
    const localPatients = localStorage.getItem('patients');
    const localReports = localStorage.getItem('reports');
    
    if (!localScans && !localPatients && !localReports) {
      // Return default analytics if no data
      return generateDefaultAnalytics();
    }
    
    const scans: ScanResult[] = localScans ? JSON.parse(localScans) : [];
    const patients: Patient[] = localPatients ? JSON.parse(localPatients) : [];
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Filter scans by date range
    const filteredScans = scans.filter(scan => {
      const scanDate = new Date(scan.scanDate);
      return scanDate >= startDate && scanDate <= now;
    });
    
    // Calculate previous period for comparison
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousScans = scans.filter(scan => {
      const scanDate = new Date(scan.scanDate);
      return scanDate >= previousStartDate && scanDate < startDate;
    });
    
    // Count anomalies
    const anomaliesCount = filteredScans.reduce((count, scan) => count + scan.anomalies.length, 0);
    const previousAnomaliesCount = previousScans.reduce((count, scan) => count + scan.anomalies.length, 0);
    
    
    // Count by scan type
    const scanTypeCounts: Record<string, number> = {};
    filteredScans.forEach(scan => {
      scanTypeCounts[scan.type] = (scanTypeCounts[scan.type] || 0) + 1;
    });
    
    // Generate time series data
    const timeSeriesData: TimeSeriesData[] = [];
    const dayCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayScans = filteredScans.filter(scan => {
        return scan.scanDate.split('T')[0] === dateStr;
      });
      
      const dayAnomalies = dayScans.reduce((count, scan) => count + scan.anomalies.length, 0);
      
      // Format day name (e.g., 'Mon', 'Tue', etc.)
      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
      
      timeSeriesData.push({
        day: dayName,
        scans: dayScans.length,
        anomalies: dayAnomalies
      });
    }
    
    // Generate scan type data
    const scanTypeData: ScanTypeData[] = [
      { type: 'Brain MRI', count: scanTypeCounts['brain'] || 0, percentage: 0, color: 'bg-purple-500' },
      { type: 'Cardiac CT', count: scanTypeCounts['heart'] || 0, percentage: 0, color: 'bg-red-500' },
      { type: 'Lung CT', count: scanTypeCounts['lungs'] || 0, percentage: 0, color: 'bg-cyan-500' },
      { type: 'Liver MRI', count: scanTypeCounts['liver'] || 0, percentage: 0, color: 'bg-green-500' }
    ];
    
    // Calculate percentages
    const totalScans = scanTypeData.reduce((sum, item) => sum + item.count, 0);
    if (totalScans > 0) {
      scanTypeData.forEach(item => {
        item.percentage = Math.round((item.count / totalScans) * 100);
      });
    }
    
    // Generate stats cards data
    const stats: StatCard[] = [
      {
        title: 'Total Scans',
        value: filteredScans.length.toString(),
        change: calculateChange(filteredScans.length, previousScans.length),
        trend: filteredScans.length >= previousScans.length ? 'up' : 'down',
        color: 'from-cyan-500 to-blue-600'
      },
      {
        title: 'Reports Generated',
        value: filteredScans.filter(s => s.status === 'reviewed').length.toString(),
        change: calculateChange(
          filteredScans.filter(s => s.status === 'reviewed').length,
          previousScans.filter(s => s.status === 'reviewed').length
        ),
        trend: filteredScans.filter(s => s.status === 'reviewed').length >= 
               previousScans.filter(s => s.status === 'reviewed').length ? 'up' : 'down',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        title: 'Active Patients',
        value: patients.length.toString(),
        change: '+0.0%', // Assuming patient count doesn't change much in short periods
        trend: 'neutral',
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Anomalies Detected',
        value: anomaliesCount.toString(),
        change: calculateChange(anomaliesCount, previousAnomaliesCount),
        trend: anomaliesCount >= previousAnomaliesCount ? 'up' : 'down',
        color: 'from-orange-500 to-red-600'
      }
    ];
    
    return {
      stats: stats as StatCard[], // Type assertion as icons will be added in component
      scanTypeDistribution: scanTypeData,
      timeSeriesData
    };
  } catch (error) {
    console.error('Error calculating local analytics:', error);
    return null;
  }
};

/**
 * Generate default analytics when no data is available
 */
const generateDefaultAnalytics = (): AnalyticsData => {
  return {
    stats: [
      {
        title: 'Total Scans',
        value: '0',
        change: '+0.0%',
        trend: 'neutral',
        color: 'from-cyan-500 to-blue-600'
      },
      {
        title: 'Reports Generated',
        value: '0',
        change: '+0.0%',
        trend: 'neutral',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        title: 'Active Patients',
        value: '0',
        change: '+0.0%',
        trend: 'neutral',
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Anomalies Detected',
        value: '0',
        change: '+0.0%',
        trend: 'neutral',
        color: 'from-orange-500 to-red-600'
      }
    ] as StatCard[],
    scanTypeDistribution: [
      { type: 'Brain MRI', count: 0, percentage: 0, color: 'bg-purple-500' },
      { type: 'Cardiac CT', count: 0, percentage: 0, color: 'bg-red-500' },
      { type: 'Lung CT', count: 0, percentage: 0, color: 'bg-cyan-500' },
      { type: 'Liver MRI', count: 0, percentage: 0, color: 'bg-green-500' }
    ],
    timeSeriesData: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
        scans: 0,
        anomalies: 0
      };
    })
  };
};

/**
 * Get analytics data for a specific patient
 */
export const getPatientAnalytics = async (patientId: string): Promise<AnalyticsData | null> => {
  try {
    const response = await api.get(`/patients/${patientId}/analytics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for patient ${patientId}:`, error);
    return null;
  }
};