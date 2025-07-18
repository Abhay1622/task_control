'use client'

import { useState } from 'react'

type Question = {
  question: string
  options: string[]
  answer: string
}

export default function CreateQuizPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], answer: '' }
  ])
  const [success, setSuccess] = useState(false)

  const handleQuestionChange = (index: number, key: keyof Question, value: string) => {
    const updated = [...questions]
    if (key === 'options') {
      updated[index].options = value.split(',').map(option => option.trim())
    } else {
      updated[index][key] = value
    }
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, questions }),
    })

    if (res.ok) {
      setSuccess(true)
      setTitle('')
      setCategory('')
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }])
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      {success && <p className="text-green-600">Quiz created successfully!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <h2 className="font-semibold mt-4">Questions</h2>
        {questions.map((q, i) => (
          <div key={i} className="p-4 border rounded space-y-2 mb-4">
            <input
              className="w-full p-2 border"
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
              required
            />
            <input
              className="w-full p-2 border"
              type="text"
              placeholder="Options (comma-separated)"
              value={q.options.join(', ')}
              onChange={(e) => handleQuestionChange(i, 'options', e.target.value)}
              required
            />
            <input
              className="w-full p-2 border"
              type="text"
              placeholder="Correct Answer"
              value={q.answer}
              onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Another Question
        </button>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          Create Quiz
        </button>
      </form>
    </div>
  )
}