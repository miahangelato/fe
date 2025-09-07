import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FingerName } from '../types/fingerprint';
// import { storeThreeTierResults } from '../utils/threetierResults'; // Will be used when polling detects results
import { useRouter } from 'next/navigation';

interface ScannerProps {
  onScanComplete: (fingerName: FingerName, imageFile: File, scanData?: unknown) => void;
  currentFinger: FingerName;
  participantData?: unknown; // Add participant data prop
}

// Use environment variable for scanner URL, fallback to localhost for development
const SCANNER_BASE_URL = process.env.NEXT_PUBLIC_SCANNER_BASE_URL || 'https://192.168.100.34:5000';
const CALLBACK_BASE_URL = process.env.NEXT_PUBLIC_CALLBACK_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://fe-zeta-bay.vercel.app');

export default function FingerprintScanner({ onScanComplete, currentFinger, participantData }: ScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const router = useRouter();

  // Polling mechanism to check for backend results
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (waitingForResults && currentSessionId) {
      console.log('🔄 Starting to poll for backend results for session:', currentSessionId);
      
      pollInterval = setInterval(async () => {
        try {
          // Check if we have new results by polling our own API
          const response = await fetch(`/api/check-results?sessionId=${currentSessionId}`, { 
            method: 'GET',
            cache: 'no-store'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.hasResults) {
              console.log('✅ Backend results received! Storing and navigating...');
              
              // Store results in sessionStorage if needed
              if (data.shouldStoreInClient) {
                const { storeThreeTierResults } = await import('@/utils/threetierResults');
                storeThreeTierResults(data.results);
                console.log('💾 Results stored in client-side storage');
              }
              
              // Navigate to results page
              router.push(`/result?sid=${currentSessionId}`);
              
              // Clear waiting state
              setWaitingForResults(false);
              clearInterval(pollInterval);
            }
          }
        } catch (error) {
          console.error('Error polling for results:', error);
        }
      }, 2000); // Poll every 2 seconds
      
      // Stop polling after 30 seconds
      setTimeout(() => {
        setWaitingForResults(false);
        clearInterval(pollInterval);
        console.log('⏰ Stopped polling for backend results (timeout)');
      }, 30000);
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [waitingForResults, currentSessionId, router]);

  const startScan = async () => {
    setScanning(true);
    setError(null);

    try {
      // Prepare request payload with participant data
      const requestPayload: Record<string, unknown> = {
        finger_name: currentFinger
      };

      // Include participant data if available
      if (participantData) {
        // Generate session ID for tracking results
        const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setCurrentSessionId(sessionId);
        
        requestPayload.participant_data = participantData;
        requestPayload.session_id = sessionId;
        console.log('Sending participant data to scanner with session ID:', sessionId, participantData);
      }

      const response = await axios.post(
        `${SCANNER_BASE_URL}/api/scanner/capture`,
        requestPayload,
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-Frontend-Callback-URL': `${CALLBACK_BASE_URL}/api/process-callback`
          }
        }
      );

      if (response.data.success) {
        // The Flask API now returns fingerprint data
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
        
        // Check if backend processing was initiated
        if (response.data.data.processing_status === 'sent_to_backend') {
          console.log('✅ Fingerprint captured and sent to backend for processing');
          console.log('🔄 Backend will send results directly to frontend callback');
          
          // If participant data was sent, start waiting for backend results
          if (participantData) {
            setWaitingForResults(true);
            console.log('⏳ Waiting for backend processing results...');
          }
        } else if (response.data.data.backend_error) {
          console.log('⚠️ Backend communication failed:', response.data.data.backend_error);
        } else {
          console.log('📸 Fingerprint captured (no backend processing)');
        }
        
        // Pass the fingerprint file to parent component
        onScanComplete(currentFinger, file, response.data.data);
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
        disabled={scanning || waitingForResults}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {waitingForResults 
          ? 'Processing Results...' 
          : scanning 
            ? 'Scanning...' 
            : `Scan ${currentFinger.replace('_', ' ')}`
        }
      </button>
      
      {waitingForResults && (
        <div className="text-blue-600 text-sm text-center">
          <div className="animate-pulse">⏳ Waiting for backend processing...</div>
          <div className="text-xs mt-1">This may take a few moments</div>
        </div>
      )}
      
      {error && (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
}