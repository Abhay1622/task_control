import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

interface Question {
  question: string
  options: string[]
  answer: string
}

export async function POST(req: Request) {
    try {
        const { topic, difficulty, count } = await req.json()

        // Validate inputs
        if (!topic || !difficulty || !count) {
            return NextResponse.json({ 
                error: 'Missing required fields: topic, difficulty, and count are required' 
            }, { status: 400 })
        }

        // Validate difficulty level
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return NextResponse.json({ 
                error: 'Invalid difficulty level. Must be easy, medium, or hard' 
            }, { status: 400 })
        }

        // Validate count
        if (count < 1 || count > 20) {
            return NextResponse.json({ 
                error: 'Question count must be between 1 and 20' 
            }, { status: 400 })
        }

        // Check if API key is available
        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json({ 
                error: 'Google AI API key not configured' 
            }, { status: 500 })
        }

        const prompt = `
Generate ${count} multiple-choice interview questions on the topic "${topic}".
Difficulty: ${difficulty}.

IMPORTANT RULES:
1. Return ONLY a valid JSON array
2. Each question object must have: question, options, answer
3. Each question must have exactly 4 options
4. The answer must be one of the 4 options (exact match)
5. Make questions appropriate for ${difficulty} level
6. Focus on practical knowledge and understanding
7. No explanations or additional text

JSON FORMAT:
[
  {
    "question": "What is the primary purpose of React hooks?",
    "options": ["State management in functional components", "Class component creation", "DOM manipulation", "CSS styling"],
    "answer": "State management in functional components"
  }
]

Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${count}
`

        console.log(`🚀 Generating ${count} ${difficulty} questions for: ${topic}`)

        // Use Gemini model
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        })

        // Generate content with timeout
        const generateWithTimeout = async (timeoutMs: number = 30000) => {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
            
            try {
                const result = await model.generateContent(prompt)
                clearTimeout(timeoutId)
                return result
            } catch (error) {
                clearTimeout(timeoutId)
                throw error
            }
        }

        const result = await generateWithTimeout()
        const response = await result.response
        const content = response.text()?.trim()

        if (!content) {
            return NextResponse.json({ 
                error: 'Empty response from Gemini AI' 
            }, { status: 500 })
        }

        console.log("🔍 Raw Gemini Output Length:", content.length)
        
        // Clean the response
        let cleanContent = content
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
            .trim()

        // Find JSON array boundaries
        const jsonStart = cleanContent.indexOf('[')
        const jsonEnd = cleanContent.lastIndexOf(']') + 1

        if (jsonStart === -1 || jsonEnd === -1) {
            console.error('❌ No JSON array found in response')
            console.error('Response content:', cleanContent.substring(0, 200) + '...')
            return NextResponse.json({ 
                error: 'Invalid JSON format from Gemini AI - no array found' 
            }, { status: 500 })
        }

        const jsonString = cleanContent.slice(jsonStart, jsonEnd)

        let questions: Question[] = []
        try {
            questions = JSON.parse(jsonString)
            
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array')
            }

            // Validate each question
            const validationErrors: string[] = []
            
            questions.forEach((q, index) => {
                if (!q.question || typeof q.question !== 'string') {
                    validationErrors.push(`Question ${index + 1}: Missing or invalid question field`)
                }
                
                if (!q.options || !Array.isArray(q.options)) {
                    validationErrors.push(`Question ${index + 1}: Missing or invalid options array`)
                } else if (q.options.length !== 4) {
                    validationErrors.push(`Question ${index + 1}: Must have exactly 4 options, got ${q.options.length}`)
                }
                
                if (!q.answer || typeof q.answer !== 'string') {
                    validationErrors.push(`Question ${index + 1}: Missing or invalid answer field`)
                } else if (q.options && !q.options.includes(q.answer)) {
                    validationErrors.push(`Question ${index + 1}: Answer "${q.answer}" not found in options`)
                }
            })

            if (validationErrors.length > 0) {
                console.error('❌ Validation errors:', validationErrors)
                return NextResponse.json({ 
                    error: 'Invalid question format',
                    details: validationErrors
                }, { status: 500 })
            }

            if (questions.length === 0) {
                throw new Error('No questions generated')
            }

        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError)
            console.error('❌ Attempted to parse:', jsonString.substring(0, 500) + '...')
            
            return NextResponse.json({ 
                error: 'Failed to parse questions from Gemini AI',
                details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
            }, { status: 500 })
        }

        console.log(`✅ Successfully generated ${questions.length} questions`)
        
        return NextResponse.json({ 
            questions,
            metadata: {
                topic,
                difficulty,
                requestedCount: count,
                generatedCount: questions.length
            }
        })

    } catch (error) {
        console.error('❌ API Error:', error)
        
        if (error instanceof Error) {
            // Handle specific error types
            if (error.message.includes('API key')) {
                return NextResponse.json({ 
                    error: 'Invalid or missing Gemini API key' 
                }, { status: 401 })
            }
            
            if (error.message.includes('quota') || error.message.includes('limit')) {
                return NextResponse.json({ 
                    error: 'API quota exceeded. Please try again later.' 
                }, { status: 429 })
            }
            
            if (error.message.includes('timeout')) {
                return NextResponse.json({ 
                    error: 'Request timed out. Please try again.' 
                }, { status: 408 })
            }
        }

        return NextResponse.json({ 
            error: 'Failed to generate questions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}