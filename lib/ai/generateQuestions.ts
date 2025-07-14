// Mock AI generator for now
export async function generateQuestions({ topic, numberOfQuestions, difficulty }: {
  topic: string
  numberOfQuestions: number
  difficulty: string
}) {
  const questions = []

  for (let i = 1; i <= numberOfQuestions; i++) {
    questions.push({
      question: `Sample ${difficulty} question ${i} on ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option B'
    })
  }

  return questions
}
