'use client'

import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const AIInterviewPage: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [count, setCount] = useState<number>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const handleGenerate = async (): Promise<void> => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
        // Make actual API call to your backend
        const response = await fetch('/api/aiInterview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic.trim(),
                difficulty,
                count
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate questions');
        }

        const data = await response.json();
        
        if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error('Invalid response format');
        }

        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(''));
        setSubmitted(false);
        setCurrentQuestion(0);
        
        // Start timer (30 seconds per question)
        setTimeRemaining(30);
        setTimerActive(true);
        
    } catch (error) {
        console.error('Error generating questions:', error);
        alert(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAnswer = (option: string): void => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);
  };

  const handleNext = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(30);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
    setShowResults(true);
    setTimerActive(false);
  };

  const resetQuiz = (): void => {
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
    setTopic('');
    setTimerActive(false);
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && timerActive) {
      handleNext();
    }
  }, [timeRemaining, timerActive]);

  const getDifficultyColor = (diff: Difficulty): string => {
    switch(diff) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-600';
      case 'hard': return 'from-red-400 to-red-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getScoreColor = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="w-16 h-16 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse text-4xl">
              🧠
            </div>
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">AI is Generating Questions...</h2>
          <p className="text-gray-600 text-lg">Analyzing {topic} • {difficulty} level • {count} questions</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-4xl font-bold text-black mb-4">Quiz Complete!</h2>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
                {score}/{questions.length}
              </div>
              <p className="text-xl text-gray-600">
                You scored {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {questions.map((q: Question, i: number) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">
                      {answers[i] === q.answer ? '✅' : '❌'}
                    </span>
                    <span className="text-black font-medium">Question {i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{q.question}</p>
                  <div className="text-sm">
                    <span className="text-gray-500">Your answer: </span>
                    <span className={answers[i] === q.answer ? 'text-green-600' : 'text-red-600'}>
                      {answers[i] || 'Not answered'}
                    </span>
                  </div>
                  {answers[i] !== q.answer && (
                    <div className="text-sm mt-1">
                      <span className="text-gray-500">Correct: </span>
                      <span className="text-green-600">{q.answer}</span>
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
    );
  }

  if (questions.length > 0) {
    const currentQ: Question = questions[currentQuestion];
    const progress: number = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-black flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                AI Interview: {topic}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-black">
                  <span className="text-xl">⏱️</span>
                  <span className="text-lg font-mono">{timeRemaining}s</span>
                </div>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white font-semibold`}>
                  {difficulty.toUpperCase()}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-black mb-8 leading-relaxed">
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
                      : 'bg-white border-gray-200 text-black hover:bg-gray-50 hover:border-gray-300'
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
              <div className="text-gray-600">
                {answers[currentQuestion] ? 'Answer selected' : 'Select an answer'}
              </div>
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  answers[currentQuestion]
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <span className="text-6xl">🧠</span>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Interview
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Test your knowledge with AI-generated questions
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="text-black font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">⭐</span>
                Topic
              </label>
              <input
                type="text"
                placeholder="Enter topic (e.g., JavaScript, React, Python)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white border border-gray-300 text-black placeholder-gray-500 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-3">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      difficulty === level
                        ? `bg-gradient-to-r ${getDifficultyColor(level)} text-white shadow-lg`
                        : 'bg-white text-black hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-black font-semibold mb-3">Number of Questions</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 text-black px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                {[3, 5, 7, 10].map((num: number) => (
                  <option key={num} value={num} className="bg-white text-black">{num} questions</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                topic.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl">🧠</span>
              Start AI Interview
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewPage;