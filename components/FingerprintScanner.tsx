import React, { useState } from 'react';
import axios from 'axios';
import { FingerName } from '../types/fingerprint';

interface ScannerProps {
  onScanComplete: (fingerName: FingerName, imageFile: File) => void;
  currentFinger: FingerName;
}

// Use environment variable for scanner URL, fallback to localhost for development
const SCANNER_BASE_URL = process.env.NEXT_PUBLIC_SCANNER_BASE_URL || 'http://127.0.0.1:5000';

export default function FingerprintScanner({ onScanComplete, currentFinger }: ScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    setScanning(true);
    setError(null);

    try {
      const response = await axios.post(
        `${SCANNER_BASE_URL}/api/scanner/capture`,
        {
          finger_name: currentFinger
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        // The Flask API now returns proper PNG data as base64
        const base64Data = response.data.data.image_data;
        
        // Convert base64 PNG to blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const file = new File([blob], `${currentFinger}.png`, { type: 'image/png' });
        
        onScanComplete(currentFinger, file);
      } else {
        throw new Error(response.data.message || 'Scan failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan fingerprint');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={startScan}
        disabled={scanning}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {scanning ? 'Scanning...' : `Scan ${currentFinger.replace('_', ' ')}`}
      </button>
      {error && (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
}