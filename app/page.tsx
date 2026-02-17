'use client'
import Squares from "@/components/Squares"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center relative overflow-hidden ">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Squares
          direction="down"
          speed={0.5}
          borderColor="rgba(255, 255, 255, 0.05)"
          hoverFillColor="rgba(255, 255, 255, 0.02)"
          squareSize={50}
        />
      </div>



      {/* Main content */}
      <main className={`relative top-8 z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-3 hover:bg-white/20 transition-all duration-300">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">AI-Powered Interview Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-4">
          <span className="block text-gray-300 mb-0.5">Your AI-Powered</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-0.5">
            Assessment
          </span>
          <span className="block text-gray-300">Partner - Interview Prep</span>
        </h1>


        {/* Description */}
        <p className="text-lg text-gray-400 mb-12 mt-6 max-w-2xl mx-auto leading-relaxed">
          Interview Prep helps you prepare and perfect your skills with smart, adaptive assessments.
          Whether for interviews or talent evaluation, our AI-driven platform ensures each round brings you closer to success.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10">
          <Link href={"/aiInterview"}>
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400">
              Get Started
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </Link>

          <Link href={"/dashboard"}>
            <button className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-200 border border-gray-600 rounded-full hover:border-purple-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg bg-black/20 backdrop-blur-sm">
              Your Dashboard
              <span className="ml-2">→</span>
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 text-center mt-10">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all w-40">
            <span className="text-purple-400 text-3xl">🎙️</span>
            <span className="text-gray-200 text-sm font-bold">Voice Interview</span>
            <span className="text-gray-400 text-xs">Real-time AI Chat</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all w-40">
            <span className="text-blue-400 text-3xl">📊</span>
            <span className="text-gray-200 text-sm font-bold">Skill Analytics</span>
            <span className="text-gray-400 text-xs">Track progress</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all w-40">
            <span className="text-green-400 text-3xl">🔥</span>
            <span className="text-gray-200 text-sm font-bold">Gamification</span>
            <span className="text-gray-400 text-xs">Leagues & Streaks</span>
          </div>
        </div>

      </main>
    </div>
  )
}