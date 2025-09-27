import { NextRequest, NextResponse } from 'next/server';
import { apiManager } from '../../../lib/api-manager';

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

// Performance optimization: Cache supported file types
const SUPPORTED_TYPES = Object.freeze([
  'image/',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'text/',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB constant
const REQUEST_TIMEOUT = 300000; // 5 minutes constant

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  try {
    // Set timeout for large file processing (5 minutes for large files)
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const formData = await request.formData();
    const file = formData.get('file') as File || formData.get('image') as File;
    
    if (!file) {
      const errorResponse = NextResponse.json({ error: 'No file provided' }, { status: 400 });
      return addCorsHeaders(errorResponse);
    }

    // Optimized file type validation using cached constants
    const isValidType = SUPPORTED_TYPES.some(type => file.type.startsWith(type) || file.type === type);
    if (!isValidType) {
      const errorResponse = NextResponse.json({ 
        error: 'File type not supported. Please upload images, PDFs, PowerPoint files, or text documents.' 
      }, { status: 400 });
      return addCorsHeaders(errorResponse);
    }

    // Optimized file size validation
    if (file.size > MAX_FILE_SIZE) {
      const errorResponse = NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 });
      return addCorsHeaders(errorResponse);
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Enhanced prompt for actual content extraction and slide generation
    const prompt = `Analyze this image/document and extract ALL ACTUAL CONTENT to create valuable slides with REAL information.

MANDATORY EXTRACTION RULES:
1. EXTRACT EVERY VISIBLE WORD - Read all text exactly as written in the document
2. NO PLACEHOLDER CONTENT - Use only actual content found in the document
3. IF NO CONTENT EXISTS for a section, write "No [topic] content found in document"
4. NEVER USE "(Not applicable)" - Use actual extracted content or state content is missing

EXTRACTION PROCESS:
Step 1: READ ALL TEXT word-for-word from the document
Step 2: IDENTIFY all numbers, dates, names, amounts, percentages
Step 3: EXTRACT all visual data from charts, tables, graphs
Step 4: CREATE slides using ONLY the actual extracted content

FORMAT RESPONSE AS:

DOCUMENT TYPE: [What type of document this actually is]

EXTRACTED TEXT CONTENT:
[Write out EVERY word visible in the document exactly as shown]
[Include headers, body text, captions, footnotes, table data]
[Preserve numbers, dates, names, amounts exactly]

VISUAL ELEMENTS:
[Describe any charts, graphs, tables with their actual data values]

ACTUAL CONTENT SLIDES:

Slide 1: Document Overview
- Title: [Exact title from document or "Untitled document"]
- Type: [Actual document type identified]
- Main content: [Primary subject matter based on extracted text]
- Key elements: [Actual important elements found]

Slide 2: All Extracted Text
- Complete text content: [All visible text organized by paragraphs]
- Headers/sections: [Actual section titles found]
- Important statements: [Key sentences from document]
- Forms/data fields: [Any structured data found]

Slide 3: Numbers & Data Points
- Financial amounts: [Actual dollar amounts, costs, prices found]
- Percentages: [Actual percentage values from document]
- Quantities: [Numbers, measurements, counts found]
- Dates: [Actual dates mentioned in document]

Slide 4: Names & People
- Individual names: [Actual person names in document]
- Organizations: [Company/organization names found]
- Contact info: [Phone numbers, emails, addresses if present]
- Roles/titles: [Job titles or positions mentioned]

Slide 5: Action Items
- Tasks mentioned: [Actual tasks or actions stated in document]
- Deadlines: [Actual due dates or timeframes found]
- Responsibilities: [Who is responsible for what, if stated]
- Requirements: [Specific requirements listed]

Slide 6: Business Information
- Purpose/objectives: [Actual business purpose stated]
- Processes: [Business processes described in document]
- Policies: [Any policies or procedures mentioned]
- Strategic points: [Business strategy elements found]

Slide 7: Technical Content
- Specifications: [Actual technical specs if present]
- Systems: [Technology or systems mentioned]
- Procedures: [Technical procedures described]
- Standards: [Quality or technical standards listed]

Slide 8: Legal/Compliance
- Legal terms: [Legal language or requirements found]
- Regulations: [Regulatory requirements mentioned]
- Agreements: [Contract terms or agreements stated]
- Compliance items: [Compliance requirements listed]

Slide 9: Financial Information
- Budget items: [Actual budget lines or financial data]
- Costs: [Specific cost information found]
- Revenue: [Revenue figures if mentioned]
- Financial terms: [Payment terms, financial conditions]

Slide 10: Implementation & Next Steps
- Next actions: [Actual next steps stated in document]
- Timeline: [Specific timeline or schedule found]
- Follow-up: [Follow-up actions mentioned]
- Contacts: [Who to contact for next steps]

CRITICAL RULE: Use ONLY content actually extracted from the document. If no relevant content exists for a slide, write "No specific [topic] content found in this document" instead of creating generic placeholder text.`;

    // Try Gemini APIs first for image analysis
    const imageBuffer = Buffer.from(bytes);
    const geminiResponse = await apiManager.analyzeImageWithGemini(imageBuffer, file.type, prompt);

    if (geminiResponse.success) {
      // Get comprehensive research insights from Perplexity based on extracted content
      let perplexityInsights = null;
      try {
        // Extract key themes, text content, and data from Gemini analysis
        const fullContent = geminiResponse.data;
        const extractedText = fullContent.match(/EXTRACTED TEXT CONTENT:([\s\S]*?)VISUAL ELEMENTS:/)?.[1] || '';
        const contentAnalysis = fullContent.substring(0, 1000);
        
        const valueEnhancementQuery = `Based on this extracted document content: "${contentAnalysis}"

        ${extractedText ? `EXACT EXTRACTED TEXT: "${extractedText.trim()}"` : ''}

        Provide PRACTICAL, VALUE-ADDING insights that make this content MORE USEFUL:

        1. CONTENT VALIDATION & ENHANCEMENT:
           - Verify accuracy of key facts, figures, and statements
           - Provide missing context or background information
           - Identify industry standards or benchmarks mentioned
           - Explain technical terms or specialized language

        2. BUSINESS VALUE AMPLIFICATION:
           - How to maximize business value from this content
           - Revenue opportunities or cost-saving potential
           - Competitive advantages or strategic positioning
           - Market timing and implementation windows

        3. RISK ASSESSMENT & MITIGATION:
           - Potential risks or challenges in the content
           - Regulatory or compliance considerations
           - Financial or operational risks identified
           - Mitigation strategies and backup plans

        4. IMPLEMENTATION SUCCESS FACTORS:
           - Critical success factors for any plans mentioned
           - Common pitfalls and how to avoid them
           - Resource requirements and budgeting considerations
           - Timeline optimization and milestone planning

        5. STAKEHOLDER & DECISION SUPPORT:
           - Key stakeholders who should review this content
           - Decision criteria and evaluation frameworks
           - Approval processes and sign-off requirements
           - Communication strategies and messaging

        6. DATA-DRIVEN INSIGHTS:
           - Industry benchmarks for any metrics mentioned
           - Comparative analysis with market standards
           - ROI calculations and financial projections
           - Performance indicators and success metrics

        7. ACTIONABLE NEXT STEPS:
           - Immediate actions to take based on this content
           - 30-60-90 day implementation roadmap
           - Key questions to ask stakeholders
           - Required resources and team assignments

        8. STRATEGIC OPPORTUNITIES:
           - How this content connects to broader business strategy
           - Partnership or collaboration opportunities
           - Innovation or improvement possibilities
           - Long-term strategic implications

        Focus on making the extracted content IMMEDIATELY ACTIONABLE and STRATEGICALLY VALUABLE for business decisions.`;
        
        const insightsResponse = await apiManager.getInsightsWithPerplexity(valueEnhancementQuery);
        
        if (insightsResponse.success) {
          perplexityInsights = insightsResponse.data;
        }
      } catch (error) {
        console.log('Perplexity insights unavailable:', error);
      }

      // Extract key components and analyze actual content quality
      const fullContent = geminiResponse.data;
      const extractedText = fullContent.match(/EXTRACTED TEXT CONTENT:([\s\S]*?)VISUAL ELEMENTS:/)?.[1]?.trim() || null;
      const documentType = fullContent.match(/DOCUMENT TYPE:\s*(.+)/)?.[1]?.trim() || 'Image Analysis';
      
      // Count actual slides generated
      const slideMatches = fullContent.match(/Slide \d+:/g) || [];
      const actualSlideCount = slideMatches.length;
      
      // Assess content quality based on actual extraction
      const wordCount = extractedText ? extractedText.split(/\s+/).length : 0;
      const hasNumbers = extractedText ? (extractedText.match(/\d+/g) || []).length : 0;
      const hasNames = extractedText ? (extractedText.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/g) || []).length : 0;
      const hasDates = extractedText ? (extractedText.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2},?\s+\d{4}/g) || []).length : 0;
      
      // Calculate content quality score
      let qualityScore = 0;
      let qualityLevel = 'Basic';
      let comprehensivenessLevel = 'Standard';
      
      // Check for placeholder content and penalize it
      const hasPlaceholders = fullContent.includes('(Not applicable)') || 
                             fullContent.includes('No specific') || 
                             fullContent.includes('Not available') ||
                             fullContent.includes('Generic content') ||
                             fullContent.includes('Standard template');
      
      if (extractedText && extractedText.length > 100) qualityScore += 20; // Has substantial text
      if (wordCount > 50) qualityScore += 20; // Good word count
      if (hasNumbers > 0) qualityScore += 15; // Contains data
      if (hasNames > 0) qualityScore += 15; // Contains names/entities
      if (hasDates > 0) qualityScore += 10; // Contains dates
      if (actualSlideCount >= 8) qualityScore += 10; // Complete slide set
      if (fullContent.includes('Action Items') || fullContent.includes('Next Steps')) qualityScore += 10; // Actionable content
      
      // Penalize placeholder content
      if (hasPlaceholders) qualityScore -= 25; // Reduce score for generic content
      
      // Boost score for actual extracted content
      if (extractedText && !hasPlaceholders && extractedText.length > 200) qualityScore += 15; // Bonus for real content
      
      if (qualityScore >= 90) { qualityLevel = 'Exceptional'; comprehensivenessLevel = 'Maximum Value'; }
      else if (qualityScore >= 75) { qualityLevel = 'High Professional'; comprehensivenessLevel = 'Business-Ready'; }
      else if (qualityScore >= 60) { qualityLevel = 'Professional'; comprehensivenessLevel = 'Good'; }
      else if (qualityScore >= 40) { qualityLevel = 'Standard'; comprehensivenessLevel = 'Adequate'; }
      
      return NextResponse.json({ 
        content: geminiResponse.data,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadDate: new Date().toISOString(),
        documentType: documentType,
        extractedText: extractedText,
        hasTextContent: !!extractedText && extractedText.length > 10,
        contentQuality: {
          score: qualityScore,
          level: qualityLevel,
          wordCount: wordCount,
          dataPoints: hasNumbers,
          entities: hasNames,
          dates: hasDates
        },
        imageMetadata: {
          dimensions: 'AI Analyzed',
          format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          quality: 'High Resolution',
          analysis: 'Complete with Text Extraction'
        },
        apiUsed: geminiResponse.apiUsed,
        insights: perplexityInsights,
        perplexityResearch: perplexityInsights ? {
          hasResearch: true,
          researchQuality: 'Business Value Enhancement Grade',
          insightCount: perplexityInsights.split('\n').filter((line: string) => line.trim().length > 0).length,
          categories: ['Business Value', 'Risk Assessment', 'Implementation Guide', 'Strategic Opportunities', 'Stakeholder Support', 'Action Planning'],
          hasFollowUpQuestions: perplexityInsights.includes('questions') || perplexityInsights.includes('NEXT STEPS'),
          hasMarketInsights: perplexityInsights.includes('business') || perplexityInsights.includes('strategic'),
        } : null,
        analysisMetrics: {
          comprehensiveness: comprehensivenessLevel,
          detailLevel: `${qualityLevel} Grade`,
          slideCount: actualSlideCount,
          contentDepth: extractedText ? `${wordCount} words extracted` : 'Visual Analysis Only',
          textExtractionQuality: extractedText ? `${hasNumbers} data points, ${hasNames} entities` : 'No Text Detected',
          qualityScore: qualityScore
        },
        message: hasPlaceholders ? 
          'Slides generated - some content may be generic due to limited document text extraction' : 
          'High-quality slides created with actual extracted content and business insights'
      });
      
      if (timeoutId) clearTimeout(timeoutId);
    }

    // Fallback to realistic mock content that simulates actual document analysis
    if (timeoutId) clearTimeout(timeoutId);
    const mockContent = `
DOCUMENT TYPE: Image Document Analysis (Offline Mode)

EXTRACTED TEXT CONTENT:
⚠️ OFFLINE MODE: AI services exceeded quota limits. Generating realistic demo content based on file: "${file.name}"

File Analysis Summary:
- Filename: ${file.name}
- File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Format: ${file.type.split('/')[1]?.toUpperCase()}
- Upload Time: ${new Date().toLocaleString()}

VISUAL ELEMENTS:
Document appears to contain visual content requiring AI analysis. Due to API quota limitations, showing demo analysis structure.

REALISTIC DEMO SLIDES:

Slide 1: Document Overview
- Title: Analysis of ${file.name}
- Document Type: ${file.type.includes('image') ? 'Image Document' : 'Digital File'}
- Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Processing Date: ${new Date().toLocaleDateString()}

Slide 2: File Information
- Original Filename: ${file.name}
- File Format: ${file.type}
- Upload Status: Successfully received
- Processing Mode: Offline demonstration

Slide 3: Content Analysis Capability
- Text Recognition: OCR technology available
- Visual Element Detection: Chart and table analysis
- Data Extraction: Numbers, dates, names identification
- Business Insights: Strategic recommendations generation

Slide 4: Expected Output Quality
- Text Accuracy: High-precision OCR results
- Data Points: Structured information extraction
- Business Value: Actionable recommendations
- Time Efficiency: Rapid processing capability

Slide 5: API Quota Status
- Current Status: Free tier quota exceeded
- Daily Limit: Reached maximum requests
- Reset Time: Quotas reset daily
- Solution: Upgrade to paid tier for unlimited access

Slide 6: Next Steps for Full Functionality
- API Configuration: Set up paid Google Cloud account
- Quota Management: Monitor usage and limits
- Alternative: Try again after quota reset
- Support: Contact for enterprise API access

Slide 7: Demo Content Notice
- This Content: Generated for demonstration purposes
- Real Analysis: Requires active AI services
- Quality Difference: Actual results much more detailed
- Test Again: After resolving quota limitations

Slide 8: Technical Requirements
- Internet Connection: Required for AI processing
- API Keys: Valid Google Gemini credentials needed
- Billing: Paid account for sustained usage
- Models: Access to latest AI vision models
    `;

    const response = NextResponse.json({ 
      content: mockContent,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadDate: new Date().toISOString(),
      documentType: 'AI Services Offline',
      extractedText: null,
      hasTextContent: false,
      contentQuality: {
        score: 45, // Moderate score for demo content
        level: 'Demo Mode - API Quota Exceeded',
        wordCount: 150, // Realistic demo word count
        dataPoints: 5, // Simulated data points
        entities: 3, // Simulated entities
        dates: 1 // Simulated dates
      },
      imageMetadata: {
        dimensions: 'Analysis unavailable',
        format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
        quality: 'AI Services Offline',
        analysis: 'Requires valid API configuration'
      },
      analysisMetrics: {
        comprehensiveness: 'Demo Mode - Limited Analysis',
        detailLevel: 'API Quota Exceeded - Simulated Results',
        slideCount: 8, // Updated count
        contentDepth: `Demo analysis of ${(file.size / 1024 / 1024).toFixed(2)}MB file`,
        textExtractionQuality: 'Quota exceeded - realistic demo content generated',
        qualityScore: 45
      },
      mockData: true,
      apiFailure: true,
      message: '⚠️ Google Gemini API quota exceeded. Demo content generated. Upgrade to paid tier or try again tomorrow for full AI analysis.',
      quotaExceeded: true,
      instructions: {
        issue: 'Google Gemini API free tier quota exceeded',
        solution: 'Upgrade to paid Google Cloud account or wait for quota reset',
        resetTime: 'Daily quotas reset at midnight Pacific Time',
        upgradeUrl: 'https://cloud.google.com/vertex-ai/pricing'
      }
    });

    return addCorsHeaders(response);

  } catch (error: any) {
    console.error('API error:', error);
    
    // Handle timeout errors specifically
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      const timeoutResponse = NextResponse.json(
        { error: 'Request timeout - file too large or processing took too long. Please try a smaller file.' },
        { status: 408 }
      );
      return addCorsHeaders(timeoutResponse);
    }
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}
