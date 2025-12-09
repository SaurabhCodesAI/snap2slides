import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const results = []
    
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: file.type,
        },
      }

      const prompt = `Analyze this image and provide:
1. A descriptive title for a presentation slide
2. Key points that could be extracted from this image
3. Suggested slide content or talking points
4. Any text visible in the image

Please format the response as JSON with the following structure:
{
  "title": "slide title",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "content": "detailed description",
  "extractedText": "any text found in image"
}`

      const result = await model.generateContent([prompt, imagePart])
      const response = await result.response
      const text = response.text()
      
      try {
        const parsed = JSON.parse(text)
        results.push({
          filename: file.name,
          analysis: parsed
        })
      } catch (e) {
        results.push({
          filename: file.name,
          analysis: {
            title: 'Generated Slide',
            keyPoints: ['Content extracted from image'],
            content: text,
            extractedText: ''
          }
        })
      }
    }
    
    return NextResponse.json({ results })
    
  } catch (error) {
    console.error('Error analyzing images:', error)
    return NextResponse.json(
      { error: 'Failed to analyze images' },
      { status: 500 }
    )
  }
}
