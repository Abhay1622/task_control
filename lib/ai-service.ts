import openai from './openai'

interface QuestionGenerationParams {
  topic: string
  level: 'beginner' | 'intermediate' | 'advanced'
  numberOfQuestions: number
  questionType?: 'multiple-choice' | 'true-false' | 'mixed'
}

interface GeneratedQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: string
}

export class AIQuestionGenerator {
  static async generateQuestions(params: QuestionGenerationParams): Promise<GeneratedQuestion[]> {
    const prompt = this.buildPrompt(params)
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert quiz creator. Generate high-quality educational questions with accurate answers and explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      })

      const content = response.choices[0].message.content
      return this.parseQuestions(content)
    } catch (error) {
      console.error('AI Question Generation Error:', error)
      throw new Error('Failed to generate questions using AI')
    }
  }

  private static buildPrompt(params: QuestionGenerationParams): string {
    return `
Generate ${params.numberOfQuestions} ${params.level} level quiz questions about "${params.topic}".

Requirements:
- Each question should have 4 multiple choice options (A, B, C, D)
- Include the correct answer
- Provide a detailed explanation for each answer
- Questions should be educational and accurate
- Vary the difficulty within the specified level
- Make questions engaging and practical

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Detailed explanation of why this is correct and why others are wrong",
    "difficulty": "${params.level}"
  }
]

Topic: ${params.topic}
Level: ${params.level}
Number of Questions: ${params.numberOfQuestions}
`
  }

  private static parseQuestions(content: string | null): GeneratedQuestion[] {
    if (!content) throw new Error('No content received from AI')
    
    try {
      // Clean the content to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      
      const questions = JSON.parse(jsonMatch[0])
      return questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty
      }))
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to parse AI response')
    }
  }
}