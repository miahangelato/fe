// Three-tier architecture results handling
export interface ThreeTierResults {
  diabetesResult: {
    success: boolean;
    diabetes_risk: string;
    confidence: number;
    saved: boolean;
    participant_id?: number;
    result_id?: number;
    processing_results?: any;
  };
  bloodGroupResult: {
    success: boolean;
    predicted_blood_group?: string;
    confidence: number;
    all_probabilities?: Record<string, number>;
    saved: boolean;
    participant_id?: number;
    processing_results?: any;
  };
  participantData?: any;
  backendResponse: any;
  timestamp: string;
  sessionId: string;
}

// Store three-tier results in sessionStorage
export function storeThreeTierResults(results: ThreeTierResults): void {
  try {
    // Store with session ID as key
    sessionStorage.setItem(results.sessionId, JSON.stringify(results));
    
    // Also store the current session ID for easy access
    sessionStorage.setItem('current_three_tier_session', results.sessionId);
    
    console.log('✅ Three-tier results stored:', results.sessionId);
  } catch (error) {
    console.error('❌ Failed to store three-tier results:', error);
  }
}

// Retrieve three-tier results from sessionStorage
export function getThreeTierResults(sessionId?: string): ThreeTierResults | null {
  try {
    const targetSessionId = sessionId || sessionStorage.getItem('current_three_tier_session');
    
    if (!targetSessionId) {
      console.log('No three-tier session ID found');
      return null;
    }
    
    const storedData = sessionStorage.getItem(targetSessionId);
    if (!storedData) {
      console.log('No three-tier results found for session:', targetSessionId);
      return null;
    }
    
    // Try to parse as new format first (plain JSON)
    try {
      const results = JSON.parse(storedData) as ThreeTierResults;
      // Validate it's actually three-tier format by checking for required fields
      if (results.diabetesResult && results.bloodGroupResult && results.sessionId) {
        console.log('✅ Three-tier results retrieved:', targetSessionId);
        return results;
      }
    } catch (e) {
      // If it fails, it might be base64-encoded old format
      console.log('Data not in three-tier format, skipping...');
    }
    
    // If we get here, it's not three-tier format
    console.log('No three-tier results found for session (old format detected):', targetSessionId);
    return null;
  } catch (error) {
    console.error('❌ Failed to retrieve three-tier results:', error);
    return null;
  }
}

// Clear three-tier results from sessionStorage
export function clearThreeTierResults(sessionId?: string): void {
  try {
    const targetSessionId = sessionId || sessionStorage.getItem('current_three_tier_session');
    
    if (targetSessionId) {
      sessionStorage.removeItem(targetSessionId);
      sessionStorage.removeItem('current_three_tier_session');
      console.log('✅ Three-tier results cleared:', targetSessionId);
    }
  } catch (error) {
    console.error('❌ Failed to clear three-tier results:', error);
  }
}

// Check if three-tier results are available
export function hasThreeTierResults(): boolean {
  const sessionId = sessionStorage.getItem('current_three_tier_session');
  return sessionId !== null && sessionStorage.getItem(sessionId) !== null;
}

// Utility to clear ALL session storage (for testing)
export function clearAllSessionData(): void {
  try {
    sessionStorage.clear();
    console.log('✅ All session storage cleared');
  } catch (error) {
    console.error('❌ Failed to clear session storage:', error);
  }
}
