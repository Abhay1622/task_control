'use client'

import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface NavbarProps {
  session: {
    user?: {
      name?: string
      email?: string
    }
  } | null
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const username =
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    'Guest'

  const userInitial =
    session?.user?.name?.charAt(0) ||
    session?.user?.email?.charAt(0) ||
    'U'

  return (
    <nav className="relative z-20 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InterviewPrep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/aiInterview" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Mock Interview
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/quiz" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Practice
              </Link>
            </div>
          </div>

          {/* User Info and Sign Out */}
          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-sm">
                  <span className="text-gray-600">Welcome,</span>
                  <span className="font-semibold text-gray-800 ml-1">
                    {username}
                  </span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userInitial.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Sign Out
            </button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
