'use client'

import { useEffect, useState } from "react"

interface QuizResult {
  _id: string;
  score: number;
  total: number;
  createdAt: string;
  quizId?: {
    title: string;
  };
}

export default function DashboardPage() {
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("/api/result/user")
      const data = await res.json()
      if (data.results) setResults(data.results)
    }
    fetchResults()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Quiz History</h1>
      {results.length === 0 ? (
        <p>You haven&apos;t taken any quizzes yet.</p>
      ) : (
        <div className="space-y-4">
          {results.map((res: QuizResult, i) => (
            <div key={res._id || i} className="border p-4 rounded shadow-sm">
              <h2 className="font-semibold text-lg">
                {res.quizId?.title || "Quiz Title"}
              </h2>
              <p className="text-gray-700">Score: {res.score} / {res.total}</p>
              <p className="text-sm text-gray-500">
                Attempted on: {new Date(res.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}