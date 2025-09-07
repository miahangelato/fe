import { NextRequest, NextResponse } from 'next/server';
import { getThreeTierResults } from '@/utils/threetierResults';

// Declare global type for temporary storage
declare global {
  var threeTierResults: Record<string, unknown> | undefined;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID required' 
      }, { status: 400 });
    }

    // Check if results are available for this session
    // First check server-side temporary storage
    if (global.threeTierResults && global.threeTierResults[sessionId]) {
      const serverResults = global.threeTierResults[sessionId];
      
      // Store in client-side format for future access
      // We'll return the data and let the client store it
      return NextResponse.json({
        success: true,
        hasResults: true,
        results: serverResults,
        shouldStoreInClient: true
      });
    }
    
    // Fallback to client-side storage check (though this won't work from server)
    const results = getThreeTierResults(sessionId);
    
    if (results) {
      return NextResponse.json({
        success: true,
        hasResults: true,
        results: results
      });
    } else {
      return NextResponse.json({
        success: true,
        hasResults: false,
        message: 'Results not yet available'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check results' 
      },
      { status: 500 }
    );
  }
}
