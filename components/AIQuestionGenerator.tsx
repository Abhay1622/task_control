'use client'

import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  answer: string
}

interface AIGeneratorProps {
  onQuestionsGenerated: (questions: Question[]) => void
}

export default function AIQuestionGenerator({ onQuestionsGenerated }: AIGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'easy',
    count: 10 
  })

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic')
      return
    }

    setLoading(true)
    
    try {
      // Try the API endpoint - adjust path based on your file structure
      const response = await fetch('/api/aiInterview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic.trim(),
          difficulty: formData.difficulty,
          count: formData.count
        }),
      })

      if (!response.ok) {
        // Log the actual response for debugging
        const responseText = await response.text()
        console.error('API Response:', responseText)
        
        // Try to parse as JSON for structured error
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || 'Failed to generate questions')
        } catch {
          // If not JSON, it's likely an HTML error page
          if (responseText.includes('<!DOCTYPE')) {
            throw new Error('API endpoint not found. Check your API route file location.')
          }
          throw new Error(`HTTP ${response.status}: ${responseText}`)
        }
      }

      const data = await response.json()
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format')
      }

      onQuestionsGenerated(data.questions)
      
    } catch (error) {
      console.error('Error generating questions:', error)
      alert(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🤖 AI Question Generator
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., JavaScript, Python, React, History..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <select
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
            <option value={7}>7 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !formData.topic.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating Questions...
            </span>
          ) : (
            'Generate Questions with AI'
          )}
        </button>
      </div>
    </div>
  )
}