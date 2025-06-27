import api from './api';
import { uploadEncryptedJsonToPinata, getDecryptedFromPinata } from './pinataService';

// Define Patient interface
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  address: string;
  lastVisit: string;
  totalScans: number;
  riskLevel: 'low' | 'medium' | 'high';
  conditions: string[];
  ipfsHash?: string; // IPFS hash for detailed patient data
}



/**
 * Get all patients from Pinata cloud storage
 */
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    // Try to get from Pinata cloud storage first
    const pinataPatients = await getPinataPatients();
    if (pinataPatients && pinataPatients.length > 0) {
      return pinataPatients;
    }
    
    // Fallback to local storage
    const localPatients = localStorage.getItem('patients');
    if (localPatients) {
      return JSON.parse(localPatients);
    }
    
    // Return demo patients if no data
    return generateDemoPatients();
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Return demo patients on error
    return generateDemoPatients();
  }
};

/**
 * Get patients from Pinata IPFS storage
 */
const getPinataPatients = async (): Promise<Patient[] | null> => {
  try {
    // This would fetch patient data from Pinata IPFS
    // For now, we'll return null to fallback to local storage
    console.log('Attempting to fetch patients from Pinata...');
    return null;
  } catch (error) {
    console.error('Error fetching patients from Pinata:', error);
    return null;
  }
};

/**
 * Generate demo patients for development
 */
const generateDemoPatients = (): Patient[] => {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 45,
      gender: 'male',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY 10001',
      lastVisit: '2024-01-20T09:15:00Z',
      totalScans: 5,
      riskLevel: 'medium',
      conditions: ['Hypertension'],
      ipfsHash: 'QmPatient1Hash'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      age: 32,
      gender: 'female',
      phone: '+1-555-0125',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      lastVisit: '2024-02-15T11:00:00Z',
      totalScans: 3,
      riskLevel: 'low',
      conditions: [],
      ipfsHash: 'QmPatient2Hash'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      age: 58,
      gender: 'male',
      phone: '+1-555-0127',
      address: '789 Pine St, Chicago, IL 60601',
      lastVisit: '2024-02-10T14:30:00Z',
      totalScans: 8,
      riskLevel: 'high',
      conditions: ['Diabetes', 'Hypertension'],
      ipfsHash: 'QmPatient3Hash'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      age: 28,
      gender: 'female',
      phone: '+1-555-0128',
      address: '321 Elm St, Miami, FL 33101',
      lastVisit: '2024-01-25T16:45:00Z',
      totalScans: 2,
      riskLevel: 'low',
      conditions: [],
      ipfsHash: 'QmPatient4Hash'
    }
  ];
};

/**
 * Get patient by ID
 */
export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    
    // Try to get from local storage
    const localPatients = localStorage.getItem('patients');
    if (localPatients) {
      const patients = JSON.parse(localPatients) as Patient[];
      return patients.find(p => p.id === id) || null;
    }
    
    return null;
  }
};

/**
 * Create a new patient
 * Stores basic info in API/localStorage and detailed info in IPFS
 */
export const createPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient | null> => {
  try {
    // Encrypt sensitive data for IPFS storage
    const sensitiveData = {
      medicalHistory: patientData.conditions,
      address: patientData.address,
      notes: '',
      createdAt: new Date().toISOString()
    };
    
    // Upload encrypted data to IPFS
    const ipfsResult = await uploadEncryptedJsonToPinata(
      sensitiveData, 
      `patient_${Date.now()}`
    );
    
    if (!ipfsResult.success) {
      throw new Error('Failed to upload patient data to IPFS');
    }
    
    // Create patient with IPFS reference
    const newPatient: Omit<Patient, 'id'> & { ipfsHash: string } = {
      ...patientData,
      ipfsHash: ipfsResult.ipfsHash
    };
    
    // Save to API
    const response = await api.post('/patients', newPatient);
    const createdPatient = response.data;
    
    // Update local storage
    const localPatients = localStorage.getItem('patients');
    const patients = localPatients ? JSON.parse(localPatients) : [];
    patients.push(createdPatient);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    return createdPatient;
  } catch (error) {
    console.error('Error creating patient:', error);
    return null;
  }
};

/**
 * Update an existing patient
 */
export const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<Patient | null> => {
  try {
    // Get current patient data
    const currentPatient = await getPatientById(id);
    if (!currentPatient) {
      throw new Error(`Patient ${id} not found`);
    }
    
    // If we have sensitive data changes and an IPFS hash, update the IPFS data
    if (
      (patientData.conditions || patientData.address) && 
      currentPatient.ipfsHash
    ) {
        // Get current IPFS data
        const ipfsResult = await getDecryptedFromPinata(currentPatient.ipfsHash);
        if (ipfsResult.success && ipfsResult.data) {
          // Update with new data
          const updatedSensitiveData = {
            ...ipfsResult.data,
            medicalHistory: patientData.conditions || ipfsResult.data.medicalHistory,
            address: patientData.address || ipfsResult.data.address,
            updatedAt: new Date().toISOString()
          };
          
          // Upload updated data back to IPFS
          const newIpfsResult = await uploadEncryptedJsonToPinata(
            updatedSensitiveData, 
            `patient_${id}_${Date.now()}`
          );
        
        if (newIpfsResult.success) {
          patientData.ipfsHash = newIpfsResult.ipfsHash;
        }
      }
    }
    
    // Update via API
    const response = await api.put(`/patients/${id}`, patientData);
    const updatedPatient = response.data;
    
    // Update local storage
    const localPatients = localStorage.getItem('patients');
    if (localPatients) {
      const patients = JSON.parse(localPatients) as Patient[];
      const updatedPatients = patients.map(p => 
        p.id === id ? { ...p, ...patientData } : p
      );
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
    
    return updatedPatient;
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    return null;
  }
};

/**
 * Delete a patient
 */
export const deletePatient = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/patients/${id}`);
    
    // Update local storage
    const localPatients = localStorage.getItem('patients');
    if (localPatients) {
      const patients = JSON.parse(localPatients) as Patient[];
      const updatedPatients = patients.filter(p => p.id !== id);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error);
    return false;
  }
};