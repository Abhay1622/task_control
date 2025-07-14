import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function GET() {
  try {
    // Use the correct model name - gemini-1.5-flash or gemini-1.5-pro
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash' // or 'gemini-1.5-pro' for more advanced features
    })

    // Generate content
    const result = await model.generateContent('Say hello')
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ 
      message: text,
      success: true 
    })
  } catch (error) {
    console.error('[GEMINI_API_ERROR]', error)
    
    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to generate from Gemini',
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: 'Unknown error occurred' 
    }, { status: 500 })
  }
}