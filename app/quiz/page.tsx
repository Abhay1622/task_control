'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quiz")
        const data = await res.json()
        setQuizzes(data.quizzes)
      } catch (err) {
        console.error("Failed to fetch quizzes:", err)
      }
    }

    fetchQuizzes()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>

      {quizzes.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz: any) => (
            <Link
              key={quiz._id}
              href={`/quiz/${quiz._id}`}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-gray-600">{quiz.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
