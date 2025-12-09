import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Create a new presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Snap2Slides Pro';
    pptx.company = 'AI-Generated Presentations';
    pptx.subject = 'AI Generated Slides';
    pptx.title = 'Snap2Slides Presentation';

    // Parse the content and create slides
    const slides = parseContentToSlides(content);
    
    // Create slides
    slides.forEach((slideData) => {
      const slide = pptx.addSlide();
      
      // Add title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 28,
          bold: true,
          color: '363636',
          fontFace: 'Arial',
          align: 'left'
        });
      }
      
      // Add content bullets
      if (slideData.content && slideData.content.length > 0) {
        const bulletPoints = slideData.content.map(item => ({
          text: item,
          options: { bullet: true, fontSize: 18, color: '666666' }
        }));
        
        slide.addText(bulletPoints, {
          x: 0.5,
          y: 1.8,
          w: 9,
          h: 5,
          fontFace: 'Arial',
          fontSize: 18,
          color: '666666'
        });
      }
    });

    // Generate the PowerPoint buffer
    const buffer = await pptx.write({ outputType: 'base64' });
    const pptxBuffer = Buffer.from(buffer as string, 'base64');

    return new NextResponse(pptxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="snap2slides-presentation.pptx"',
        'Content-Length': pptxBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PowerPoint generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PowerPoint presentation' },
      { status: 500 }
    );
  }
}

interface SlideContent {
  title: string;
  content: string[];
}

function parseContentToSlides(content: string): SlideContent[] {
  const slides: SlideContent[] = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentSlide: SlideContent | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Slide ') && trimmedLine.includes(':')) {
      // Start new slide
      if (currentSlide) {
        slides.push(currentSlide);
      }
      currentSlide = {
        title: trimmedLine.split(':')[1]?.trim() || '',
        content: []
      };
    } else if (trimmedLine.startsWith('TITLE:')) {
      // Main title slide
      if (currentSlide) {
        slides.push(currentSlide);
      }
      currentSlide = {
        title: trimmedLine.replace('TITLE:', '').trim(),
        content: []
      };
    } else if (trimmedLine.startsWith('- ')) {
      // Bullet point
      if (currentSlide) {
        currentSlide.content.push(trimmedLine.replace('- ', ''));
      }
    } else if (trimmedLine.length > 0 && !trimmedLine.includes(':') && !trimmedLine.includes('SLIDE CONTENT')) {
      // Regular content
      if (currentSlide && trimmedLine.length > 5) {
        currentSlide.content.push(trimmedLine);
      }
    }
  }
  
  // Add the last slide
  if (currentSlide) {
    slides.push(currentSlide);
  }
  
  // Ensure we have at least one slide
  if (slides.length === 0) {
    slides.push({
      title: 'AI Generated Presentation',
      content: ['Content analysis complete', 'Slides generated successfully']
    });
  }
  
  return slides;
}
