'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function QuizAttemptPage() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`)
        const data = await res.json()
        setQuiz(data.quiz)
        setAnswers(new Array(data.quiz.questions.length).fill(''))
      } catch (err) {
        console.error('Failed to load quiz:', err)
      }
    }

    fetchQuiz()
  }, [id])

  const handleSelect = (qIndex: number, option: string) => {
    const updated = [...answers]
    updated[qIndex] = option
    setAnswers(updated)
  }

  const handleSubmit = async () => {
  let correct = 0
  quiz.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.answer) correct++
  })
  setScore(correct)
  setSubmitted(true)

  const userId = "64e7ef5a4a5f01e5e88cd389"

  await fetch('/api/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      quizId: quiz._id,
      score: correct,
      total: quiz.questions.length,
    }),
  })
}


  if (!quiz) return <p className="p-6">Loading quiz...</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">Category: {quiz.category}</p>

      {quiz.questions.map((q: any, i: number) => (
        <div key={i} className="mb-6 p-4 border rounded">
          <h2 className="font-semibold mb-2">{i + 1}. {q.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {q.options.map((opt: string, j: number) => (
              <button
                key={j}
                onClick={() => handleSelect(i, opt)}
                className={`border p-2 rounded ${
                  answers[i] === opt ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4 text-xl font-semibold text-green-700">
          You scored {score} out of {quiz.questions.length}
        </div>
      )}
    </div>
  )
}
