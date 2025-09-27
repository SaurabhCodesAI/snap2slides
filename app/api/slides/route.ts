import { NextRequest, NextResponse } from 'next/server';

// CORS headers for mobile network access
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle preflight requests
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

// Enhanced in-memory storage with better persistence and debugging
class SlidesStorage {
  private storage = new Map<string, any>();
  
  constructor() {
    console.log('SlidesStorage initialized');
  }
  
  set(id: string, data: any) {
    const slideData = {
      ...data,
      updatedAt: new Date().toISOString(),
      id,
      createdAt: new Date().toISOString()
    };
    this.storage.set(id, slideData);
    console.log(`✅ Stored slides with ID: ${id}. Total stored: ${this.storage.size}`);
    console.log(`📄 Data keys:`, Object.keys(slideData));
    return slideData;
  }
  
  get(id: string) {
    const data = this.storage.get(id);
    console.log(`🔍 Retrieved slides with ID: ${id}, found: ${!!data}`);
    if (!data) {
      console.log(`📋 Available IDs: [${Array.from(this.storage.keys()).join(', ')}]`);
    }
    return data;
  }
  
  has(id: string) {
    const exists = this.storage.has(id);
    console.log(`❓ Checking if ID ${id} exists: ${exists}`);
    return exists;
  }
  
  update(id: string, updates: any) {
    if (this.storage.has(id)) {
      const existing = this.storage.get(id);
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.storage.set(id, updated);
      console.log(`✏️ Updated slides with ID: ${id}`);
      return updated;
    } else {
      console.log(`❌ Cannot update - ID ${id} not found. Available: [${Array.from(this.storage.keys()).join(', ')}]`);
      return false;
    }
  }
  
  list() {
    const keys = Array.from(this.storage.keys());
    console.log(`📋 All stored IDs: [${keys.join(', ')}]`);
    return keys;
  }
  
  // Debug method to see all data
  debug() {
    console.log(`🐛 Storage debug - Total items: ${this.storage.size}`);
    this.storage.forEach((value, key) => {
      console.log(`  ${key}: ${value.fileName || 'unknown'} (${value.createdAt})`);
    });
  }
}

const slidesStorage = new SlidesStorage();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = Date.now().toString();
    
    console.log('📤 POST /api/slides - Creating new slides with ID:', id);
    console.log('📄 Received data keys:', Object.keys(data));
    
    // Store the slides data
    const stored = slidesStorage.set(id, data);
    slidesStorage.debug();
    
    const response = NextResponse.json({ id, success: true, data: stored });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('❌ Error saving slides:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to save slides data' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('📥 GET /api/slides - Requesting ID:', id);
    
    if (!id) {
      const errorResponse = NextResponse.json(
        { error: 'No slides ID provided' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }
    
    slidesStorage.debug();
    const data = slidesStorage.get(id);
    
    if (!data) {
      console.log(`❌ Slides not found for ID: ${id}. Available IDs: ${slidesStorage.list().join(', ')}`);
      const notFoundResponse = NextResponse.json(
        { error: 'Slides not found', availableIds: slidesStorage.list() },
        { status: 404 }
      );
      return addCorsHeaders(notFoundResponse);
    }
    
    console.log('✅ Returning slides data for ID:', id);
    const successResponse = NextResponse.json(data);
    return addCorsHeaders(successResponse);
  } catch (error) {
    console.error('❌ Error retrieving slides:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to retrieve slides data' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    console.log('✏️ PUT /api/slides - Updating ID:', id);
    console.log('📄 Update data keys:', Object.keys(data));
    
    if (!id) {
      return NextResponse.json(
        { error: 'No slides ID provided' },
        { status: 400 }
      );
    }
    
    slidesStorage.debug();
    
    if (!slidesStorage.has(id)) {
      console.log(`❌ Slides not found for update, ID: ${id}. Available IDs: ${slidesStorage.list().join(', ')}`);
      return NextResponse.json(
        { error: 'Slides not found', availableIds: slidesStorage.list() },
        { status: 404 }
      );
    }
    
    // Update the slides data
    const updated = slidesStorage.update(id, data);
    console.log('✅ Update successful for ID:', id);
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('❌ Error updating slides:', error);
    return NextResponse.json(
      { error: 'Failed to update slides data' },
      { status: 500 }
    );
  }
}
