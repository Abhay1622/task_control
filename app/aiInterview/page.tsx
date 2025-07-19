'use client'
import React, { useState, useEffect, useCallback } from 'react'

interface Question {
  question: string
  options: string[]
  answer: string
}

type Difficulty = 'easy' | 'medium' | 'hard'

const AIInterviewPage: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [name, setName] = useState<string>('')
  const [topic, setTopic] = useState<string>('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [count, setCount] = useState<number>(5)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [timerActive, setTimerActive] = useState<boolean>(false)

  const handleNextStep = () => setStep(step + 1)
  const handlePrevStep = () => setStep(step - 1)

  const handleGenerate = async (): Promise<void> => {
    if (!topic.trim()) return
    setIsGenerating(true)
    try {
      const response = await fetch('/api/aiInterview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          count,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate questions')
      }

      const data = await response.json()
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format')
      }

      setQuestions(data.questions)
      setAnswers(new Array(data.questions.length).fill(''))
      setCurrentQuestion(0)
      setShowResults(false)
      setTimeRemaining(30)
      setTimerActive(true)
      setStep(5) // Go to quiz
    } catch (error) {
      console.error('Error generating questions:', error)
      alert(
        `Failed to generate questions: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = useCallback((): void => {
    let correctCount = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correctCount++
    })
    setScore(correctCount)
    setShowResults(true)
    setTimerActive(false)
  }, [questions, answers])

  const handleNext = useCallback((): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeRemaining(30)
    } else {
      handleSubmit()
    }
  }, [currentQuestion, questions.length, handleSubmit])

  const handleAnswer = (option: string): void => {
    const updated = [...answers]
    updated[currentQuestion] = option
    setAnswers(updated)
  }

  const resetQuiz = (): void => {
    setQuestions([])
    setAnswers([])
    setCurrentQuestion(0)
    setShowResults(false)
    setScore(0)
    setTopic('')
    setStep(1)
    setTimerActive(false)
  }

  const getScoreColor = (score: number, total: number): string => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && timerActive) {
      handleNext()
    }
  }, [timeRemaining, timerActive, handleNext])

  // UI Components per step

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-700/50">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl animate-pulse">
              👋
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-6">Hi there!</h1>
          <p className="text-gray-300 text-center mb-8">
            What should we call you?
          </p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 backdrop-blur-sm mb-8"
          />
          <button
            onClick={handleNextStep}
            disabled={!name}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
              name
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">What would you like to practice?</h2>
          <p className="text-gray-300 mb-8">Choose a topic or programming language.</p>
          <input
            type="text"
            placeholder="e.g. JavaScript, Python, React, Java"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 backdrop-blur-sm mb-8"
          />
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 text-white hover:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={!topic.trim()}
              className={`py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                topic.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">Select Difficulty</h2>
          <p className="text-gray-300 mb-8">How challenging should the questions be?</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  difficulty === level
                    ? `bg-gradient-to-r ${
                        level === 'easy'
                          ? 'from-green-400 to-green-600'
                          : level === 'medium'
                          ? 'from-yellow-400 to-orange-600'
                          : 'from-red-400 to-red-600'
                      } text-white shadow-lg`
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 backdrop-blur-sm'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 text-white hover:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="py-3 px-8 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">How Many Questions?</h2>
          <p className="text-gray-300 mb-8">Select the number of questions you'd like.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[3, 5, 7, 10].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  count === num
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 backdrop-blur-sm'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 text-white hover:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`py-3 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isGenerating
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
              }`}
            >
              {isGenerating ? 'Generating...' : 'Start Interview'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 pt-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="w-16 h-16 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse text-4xl">
              🧠
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">AI is Generating Questions...</h2>
          <p className="text-gray-400 text-lg">
            Analyzing {topic} • {difficulty} level • {count} questions
          </p>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 pt-24">
        <div className="max-w-2xl w-full">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
                {score}/{questions.length}
              </div>
              <p className="text-xl text-gray-300">
                You scored {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div className="space-y-4 mb-8">
              {questions.map((q: Question, i: number) => (
                <div key={i} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">
                      {answers[i] === q.answer ? '✅' : '❌'}
                    </span>
                    <span className="text-white font-medium">Question {i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                  <div className="text-sm">
                    <span className="text-gray-400">Your answer: </span>
                    <span className={answers[i] === q.answer ? 'text-green-400' : 'text-red-400'}>
                      {answers[i] || 'Not answered'}
                    </span>
                  </div>
                  {answers[i] !== q.answer && (
                    <div className="text-sm mt-1">
                      <span className="text-gray-400">Correct: </span>
                      <span className="text-green-400">{q.answer}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={resetQuiz}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length > 0) {
    const currentQ: Question = questions[currentQuestion]
    const progress: number = ((currentQuestion + 1) / questions.length) * 100
    return (
      <div className="min-h-screen bg-gray-900 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                AI Interview: {topic}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white bg-gray-700/50 rounded-lg px-3 py-2">
                  <span className="text-xl">⏱️</span>
                  <span className="text-lg font-mono">{timeRemaining}s</span>
                </div>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${
                  difficulty === 'easy'
                    ? 'from-green-400 to-green-600'
                    : difficulty === 'medium'
                    ? 'from-yellow-400 to-orange-600'
                    : 'from-red-400 to-red-600'
                } text-white font-semibold`}>
                  {difficulty.toUpperCase()}
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          {/* Question Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQ.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    answers[currentQuestion] === option
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow-lg'
                      : 'bg-gray-700/30 border-gray-600/50 text-white hover:bg-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === option 
                        ? 'border-white bg-white' 
                        : 'border-gray-400'
                    }`}>
                      {answers[currentQuestion] === option && (
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                    <span className="text-left font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-400">
                {answers[currentQuestion] ? 'Answer selected' : 'Select an answer'}
              </div>
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  answers[currentQuestion]
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default AIInterviewPage