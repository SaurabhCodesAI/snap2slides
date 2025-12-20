# Snap2Slides Pro - API Reference

## 📡 API Overview

Snap2Slides Pro provides RESTful API endpoints for image analysis, slide generation, and data management. All endpoints support CORS for cross-device compatibility and include comprehensive error handling.

---

## 🔗 Base URLs

- **Development**: `http://localhost:3000`
- **Network**: `http://[IP_ADDRESS]:3000`
- **Production**: `https://[your-vercel-domain].vercel.app`

---

## 📋 API Endpoints

### 1. Gemini Vision Analysis

**Endpoint**: `/api/gemini-vision`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

Analyzes uploaded files using Google Gemini Vision API to extract content and generate presentation structure.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Upload file (image, PDF, document) |

#### Supported File Types
- **Images**: JPG, JPEG, PNG, WebP, GIF
- **Documents**: PDF, DOCX, PPTX, TXT
- **Size Limit**: 50MB maximum

#### Request Example
```javascript
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/gemini-vision', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

#### Success Response (200)
```json
{
  "content": "Generated slide content with structured information...",
  "fileName": "presentation.pdf",
  "fileSize": 2048000,
  "mimeType": "application/pdf",
  "uploadDate": "2025-09-27T10:30:00.000Z",
  "documentType": "Google Gemini Analysis",
  "extractedText": "Extracted text content...",
  "hasTextContent": true,
  "contentQuality": {
    "score": 85,
    "level": "High Quality Analysis",
    "wordCount": 450,
    "dataPoints": 12,
    "entities": 8,
    "dates": 3
  },
  "imageMetadata": {
    "dimensions": "1920x1080",
    "format": "PDF",
    "quality": "High Resolution",
    "analysis": "Professional document with charts and graphs"
  },
  "analysisMetrics": {
    "comprehensiveness": "Detailed Analysis Complete",
    "detailLevel": "Professional Grade Content",
    "slideCount": 8,
    "contentDepth": "Comprehensive analysis of 2.00MB document",
    "textExtractionQuality": "High quality text extraction completed",
    "qualityScore": 85
  },
  "apiUsed": "Google Gemini Vision API"
}
```

#### Error Responses

**400 Bad Request - No File**
```json
{
  "error": "No file provided"
}
```

**400 Bad Request - Invalid File Type**
```json
{
  "error": "File type not supported. Please upload images, PDFs, PowerPoint files, or text documents."
}
```

**400 Bad Request - File Too Large**
```json
{
  "error": "File size must be less than 50MB"
}
```

**408 Request Timeout**
```json
{
  "error": "Request timeout - file too large or processing took too long. Please try a smaller file."
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to process image"
}
```

#### Demo Mode Response
When API quota is exceeded, the system provides realistic demo content:

```json
{
  "content": "Demo content with realistic slide structure...",
  "mockData": true,
  "apiFailure": true,
  "message": "⚠️ Google Gemini API quota exceeded. Demo content generated.",
  "quotaExceeded": true,
  "instructions": {
    "issue": "Google Gemini API free tier quota exceeded",
    "solution": "Upgrade to paid Google Cloud account or wait for quota reset",
    "resetTime": "Daily quotas reset at midnight Pacific Time",
    "upgradeUrl": "https://cloud.google.com/vertex-ai/pricing"
  }
}
```

---

### 2. Slides Management

**Endpoint**: `/api/slides`  
**Methods**: `GET`, `POST`, `PUT`

Manages slide data storage and retrieval for generated presentations.

#### POST - Save Slides

**Request Body**:
```json
{
  "content": "Slide content...",
  "metadata": {
    "title": "Presentation Title",
    "author": "Creator Name",
    "createdDate": "2025-09-27"
  },
  "slides": [
    {
      "id": 1,
      "title": "Slide Title",
      "content": "Slide content...",
      "layout": "title-content"
    }
  ]
}
```

**Success Response (200)**:
```json
{
  "id": "1727431800000",
  "success": true,
  "data": {
    "content": "Slide content...",
    "metadata": {...},
    "slides": [...],
    "id": "1727431800000",
    "createdAt": "2025-09-27T10:30:00.000Z",
    "updatedAt": "2025-09-27T10:30:00.000Z"
  }
}
```

**Error Response (500)**:
```json
{
  "error": "Failed to save slides data"
}
```

#### GET - Retrieve Slides

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique slide ID |

**Request Example**:
```
GET /api/slides?id=1727431800000
```

**Success Response (200)**:
```json
{
  "content": "Retrieved slide content...",
  "metadata": {...},
  "slides": [...],
  "id": "1727431800000",
  "createdAt": "2025-09-27T10:30:00.000Z",
  "updatedAt": "2025-09-27T10:30:00.000Z"
}
```

**Error Responses**:

**400 Bad Request**:
```json
{
  "error": "No slides ID provided"
}
```

**404 Not Found**:
```json
{
  "error": "Slides not found",
  "availableIds": ["1727431800000", "1727431900000"]
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to retrieve slides data"
}
```

---

## 🔒 Authentication

Currently, the API does not require authentication. For production deployment, consider implementing:
- API key authentication
- JWT token validation
- Rate limiting per user/IP
- OAuth integration

---

## 🌐 CORS Configuration

All API endpoints include CORS headers for cross-device compatibility:

```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Preflight Requests**: All endpoints support `OPTIONS` method for CORS preflight.

---

## ⚡ Rate Limiting

### Current Limits
- **File Size**: 50MB maximum per request
- **Request Timeout**: 5 minutes for large file processing
- **Concurrent Requests**: Handled by Next.js serverless functions

### Recommended Production Limits
- **Rate Limit**: 100 requests per minute per IP
- **Daily Quota**: 1000 requests per user
- **File Uploads**: 10 per hour per IP

---

## 🛠️ SDK Examples

### JavaScript/TypeScript

```typescript
class Snap2SlidesAPI {
  constructor(private baseURL: string) {}

  async analyzeFile(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/gemini-vision`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async saveSlides(slideData: SlideData): Promise<SaveResult> {
    const response = await fetch(`${this.baseURL}/api/slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slideData)
    });

    return response.json();
  }

  async getSlides(id: string): Promise<SlideData> {
    const response = await fetch(`${this.baseURL}/api/slides?id=${id}`);
    return response.json();
  }
}

// Usage
const api = new Snap2SlidesAPI('http://localhost:3000');
const result = await api.analyzeFile(file);
```

### Python

```python
import requests

class Snap2SlidesAPI:
    def __init__(self, base_url):
        self.base_url = base_url

    def analyze_file(self, file_path):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{self.base_url}/api/gemini-vision",
                files=files
            )
        return response.json()

    def save_slides(self, slide_data):
        response = requests.post(
            f"{self.base_url}/api/slides",
            json=slide_data
        )
        return response.json()

    def get_slides(self, slide_id):
        response = requests.get(
            f"{self.base_url}/api/slides",
            params={'id': slide_id}
        )
        return response.json()

# Usage
api = Snap2SlidesAPI('http://localhost:3000')
result = api.analyze_file('presentation.pdf')
```

### cURL Examples

**Analyze File**:
```bash
curl -X POST http://localhost:3000/api/gemini-vision \
  -F "file=@presentation.pdf" \
  -H "Accept: application/json"
```

**Save Slides**:
```bash
curl -X POST http://localhost:3000/api/slides \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Slide content",
    "metadata": {"title": "My Presentation"}
  }'
```

**Retrieve Slides**:
```bash
curl -X GET "http://localhost:3000/api/slides?id=1727431800000" \
  -H "Accept: application/json"
```

---

## 🐛 Error Handling

### Error Response Format
All API errors follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details",
    "timestamp": "2025-09-27T10:30:00.000Z"
  }
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `FILE_TOO_LARGE` | File exceeds 50MB limit | Reduce file size |
| `UNSUPPORTED_TYPE` | File type not supported | Use supported formats |
| `PROCESSING_TIMEOUT` | Request took too long | Try smaller file |
| `QUOTA_EXCEEDED` | API quota exceeded | Wait or upgrade plan |
| `INVALID_REQUEST` | Malformed request | Check request format |

---

## 📊 Performance Considerations

### Optimization Tips
- **File Size**: Smaller files process faster (< 10MB recommended)
- **File Format**: PDFs and images generally process faster than Office documents
- **Network**: Use compression for large file uploads
- **Caching**: Implement client-side caching for repeated requests

### Expected Response Times
- **Images < 5MB**: 2-5 seconds
- **PDFs < 10MB**: 5-15 seconds
- **Large Documents**: 15-60 seconds
- **Network requests**: Add 1-3 seconds for mobile networks

---

This comprehensive API reference ensures developers have all the information needed to integrate with Snap2Slides Pro effectively.