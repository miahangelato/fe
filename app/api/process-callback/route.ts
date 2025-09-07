import { NextRequest, NextResponse } from 'next/server';

// Declare global type for temporary storage
declare global {
  var threeTierResults: Record<string, unknown> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('🎯 Received processing results from backend:');
    console.log('===============================================');
    console.log(JSON.stringify(data, null, 2));
    
    // Log specific results
    if (data.processing_results?.diabetes_prediction) {
      const diabetesResult = data.processing_results.diabetes_prediction;
      if (!diabetesResult.error) {
        console.log(`📊 Diabetes Risk: ${diabetesResult.risk} (Confidence: ${diabetesResult.confidence})`);
      }
    }
    
    if (data.processing_results?.blood_group_classification) {
      const bloodGroupResult = data.processing_results.blood_group_classification;
      if (!bloodGroupResult.error) {
        console.log(`🩸 Blood Group: ${bloodGroupResult.predicted_blood_group} (Confidence: ${bloodGroupResult.confidence})`);
      }
    }
    
    // Generate session ID for storing results
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Transform backend data to match results page expectations
    const transformedData = {
      // Diabetes result format
      diabetesResult: {
        success: true,
        diabetes_risk: data.processing_results?.diabetes_prediction?.risk || 'UNKNOWN',
        confidence: data.processing_results?.diabetes_prediction?.confidence || 0,
        saved: data.participant_saved || false,
        participant_id: data.participant_id,
        result_id: data.processing_results?.diabetes_prediction?.result_id,
        processing_results: data.processing_results
      },
      
      // Blood group result format  
      bloodGroupResult: {
        success: true,
        predicted_blood_group: data.processing_results?.blood_group_classification?.predicted_blood_group,
        confidence: data.processing_results?.blood_group_classification?.confidence || 0,
        all_probabilities: data.processing_results?.blood_group_classification?.all_probabilities,
        saved: data.fingerprint_saved || false,
        participant_id: data.participant_id,
        processing_results: data.processing_results
      },
      
      // Include participant data
      participantData: data.participant_data || null,
      
      // Store complete backend response for debugging
      backendResponse: data,
      
      // Timestamp
      timestamp: new Date().toISOString(),
      sessionId: sessionId
    };
    
    // Store results in a temporary server-side storage that can be accessed by check-results API
    // We'll use a simple global variable or file system for this
    global.threeTierResults = global.threeTierResults || {};
    global.threeTierResults[sessionId] = transformedData;
    
    console.log('✅ Transformed data for results page:', transformedData);
    console.log('💾 Results stored in server-side storage for session:', sessionId);
    
    return NextResponse.json({
      success: true,
      message: 'Processing results received and stored successfully',
      sessionId: sessionId,
      data: transformedData,
      // Include a flag to indicate this should be stored in sessionStorage
      shouldStore: true,
      navigateToResults: true
    });
    
  } catch (error) {
    console.error('❌ Error in process-callback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process callback'
      },
      { status: 500 }
    );
  }
}
