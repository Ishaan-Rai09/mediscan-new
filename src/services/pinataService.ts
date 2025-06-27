import axios from 'axios';
import CryptoJS from 'crypto-js';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

if (!PINATA_API_KEY || !PINATA_SECRET) {
  console.error('Pinata API keys are missing. Please check your .env file.');
}

if (!import.meta.env.VITE_ENCRYPTION_KEY) {
  console.warn('ENCRYPTION_KEY not set in environment. Using default key (not secure for production).');
}

// Create a Pinata-specific axios instance
const pinataApi = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET,
  },
});

/**
 * Upload a file to IPFS via Pinata
 * @param file - The file to upload
 * @param metadata - Optional metadata for the file
 * @returns The IPFS hash (CID) of the uploaded file
 */
export const uploadFileToPinata = async (file: File, metadata: Record<string, string | number | boolean> = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata as pinataMetadata
    const pinataMetadata = {
      name: metadata.name || file.name,
      keyvalues: metadata
    };
    
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
    
    // Optional pinataOptions
    const pinataOptions = {
      cidVersion: 1,
      wrapWithDirectory: false
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));
    
    const response = await pinataApi.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': `multipart/form-data;`,
      },
    });
    
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp
    };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload JSON data to IPFS via Pinata
 * @param jsonData - The JSON data to upload
 * @param name - Name for the JSON file
 * @returns The IPFS hash (CID) of the uploaded JSON
 */
export const uploadJsonToPinata = async (jsonData: Record<string, unknown>, name: string) => {
  try {
    const data = {
      pinataContent: jsonData,
      pinataMetadata: {
        name,
      },
      pinataOptions: {
        cidVersion: 1
      }
    };
    
    const response = await pinataApi.post('/pinning/pinJSONToIPFS', data);
    
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp
    };
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get data from IPFS via Pinata gateway
 * @param ipfsHash - The IPFS hash (CID) to retrieve
 * @returns The data from IPFS
 */
export const getFromPinata = async (ipfsHash: string) => {
  try {
    // Using Pinata gateway
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error retrieving from Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Encrypt sensitive data using AES
 * @param data - The data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

/**
 * Decrypt sensitive data using AES
 * @param encryptedData - The encrypted data string
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string): object => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

/**
 * Upload encrypted PDF to IPFS via Pinata
 * @param pdfFile - The PDF file to encrypt and upload
 * @param metadata - Optional metadata for the file
 * @returns The IPFS hash of the encrypted PDF
 */
export const uploadEncryptedPdfToPinata = async (pdfFile: File, metadata: Record<string, string | number | boolean> = {}) => {
  try {
    // Read file as array buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 string for encryption
    const base64String = btoa(String.fromCharCode(...uint8Array));
    
    // Encrypt the PDF data
    const encryptedData = encryptData({
      originalName: pdfFile.name,
      mimeType: pdfFile.type,
      data: base64String,
      size: pdfFile.size,
      encryptedAt: new Date().toISOString()
    });
    
    // Create encrypted file blob
    const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const encryptedFile = new File([encryptedBlob], `encrypted_${pdfFile.name}.enc`, {
      type: 'application/octet-stream'
    });
    
    // Upload encrypted file
    return await uploadFileToPinata(encryptedFile, {
      ...metadata,
      encrypted: true,
      originalName: pdfFile.name,
      originalType: pdfFile.type
    });
  } catch (error) {
    console.error('Error uploading encrypted PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload encrypted JSON data to IPFS via Pinata
 * @param jsonData - The JSON data to encrypt and upload
 * @param name - Name for the encrypted file
 * @returns The IPFS hash of the encrypted data
 */
export const uploadEncryptedJsonToPinata = async (jsonData: Record<string, unknown>, name: string) => {
  try {
    // Encrypt the JSON data
    const encryptedData = encryptData({
      data: jsonData,
      encryptedAt: new Date().toISOString()
    });
    
    // Upload as encrypted JSON
    return await uploadJsonToPinata({
      encryptedData,
      encrypted: true
    }, `encrypted_${name}`);
  } catch (error) {
    console.error('Error uploading encrypted JSON:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get and decrypt data from IPFS via Pinata
 * @param ipfsHash - The IPFS hash of the encrypted data
 * @returns Decrypted data
 */
export const getDecryptedFromPinata = async (ipfsHash: string) => {
  try {
    const result = await getFromPinata(ipfsHash);
    
    if (!result.success) {
      return result;
    }
    
    // Check if data is encrypted
    if (result.data.encrypted && result.data.encryptedData) {
      const decryptedData = decryptData(result.data.encryptedData);
      return {
        success: true,
        data: decryptedData.data,
        encryptedAt: decryptedData.encryptedAt
      };
    }
    
    // Return as-is if not encrypted
    return result;
  } catch (error) {
    console.error('Error decrypting data from Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed'
    };
  }
};

/**
 * Get and decrypt PDF from IPFS via Pinata
 * @param ipfsHash - The IPFS hash of the encrypted PDF
 * @returns Decrypted PDF blob
 */
export const getDecryptedPdfFromPinata = async (ipfsHash: string) => {
  try {
    // Get the encrypted file content as text
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
      responseType: 'text'
    });
    
    // Decrypt the data
    const decryptedData = decryptData(response.data);
    
    // Convert base64 back to binary
    const binaryString = atob(decryptedData.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create blob with original MIME type
    const pdfBlob = new Blob([bytes], { type: decryptedData.mimeType || 'application/pdf' });
    
    return {
      success: true,
      blob: pdfBlob,
      originalName: decryptedData.originalName,
      size: decryptedData.size
    };
  } catch (error) {
    console.error('Error decrypting PDF from Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF decryption failed'
    };
  }
};

/**
 * Unpin (delete) a file from Pinata
 * @param ipfsHash - The IPFS hash (CID) to unpin
 * @returns Success status
 */
export const unpinFromPinata = async (ipfsHash: string) => {
  try {
    await pinataApi.delete(`/pinning/unpin/${ipfsHash}`);
    return { success: true };
  } catch (error) {
    console.error('Error unpinning from Pinata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
