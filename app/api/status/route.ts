import { NextRequest, NextResponse } from 'next/server';
import { apiManager, APIStatus } from '../../../lib/api-manager';

export async function GET() {
  try {
    const status = apiManager.getAPIStatus();
    
    const summary = {
      total: status.length,
      active: status.filter(api => api.isActive).length,
      inactive: status.filter(api => !api.isActive).length,
      gemini: status.filter(api => api.type === 'gemini'),
      perplexity: status.filter(api => api.type === 'perplexity'),
      details: status,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (error) {
    console.error('Error getting API status:', error);
    return NextResponse.json(
      { error: 'Failed to get API status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, apiId } = await request.json();
    
    if (action === 'reset' && apiId) {
      apiManager.resetAPI(apiId);
      return NextResponse.json({
        success: true,
        message: `API ${apiId} has been reset`,
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action or missing apiId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing API status:', error);
    return NextResponse.json(
      { error: 'Failed to manage API status' },
      { status: 500 }
    );
  }
}