import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { slides } = await request.json()
    
    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json({ error: 'Invalid slides data' }, { status: 400 })
    }

    // This would integrate with a PowerPoint generation library
    // For now, we'll return a mock response
    const presentation = {
      id: Date.now().toString(),
      title: 'AI Generated Presentation',
      slides: slides.map((slide: any, index: number) => ({
        id: index + 1,
        title: slide.title || `Slide ${index + 1}`,
        content: slide.content || '',
        keyPoints: slide.keyPoints || [],
        layout: 'title-content'
      })),
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      presentation,
      downloadUrl: `/api/download/${presentation.id}`
    })
    
  } catch (error) {
    console.error('Error generating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    )
  }
}
