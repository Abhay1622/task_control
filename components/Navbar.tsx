'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  const username =
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    'Guest'

  const userInitial =
    session?.user?.name?.charAt(0) ||
    session?.user?.email?.charAt(0) ||
    'U'


  return (
    <div className="fixed  top-4 left-1/2 transform -translate-x-1/2 z-50 w-[60%] max-w-6xl ">
      <nav className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span className="text-lg font-bold text-white">
                InterviewPrep
              </span>
            </Link>
          </div>


          {/* User Info and Auth */}
          <div className="flex items-center space-x-3">
            {session?.user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {userInitial.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {username}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href={'/login'}>
                <button className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg">
                  Sign in
                </button>
              </Link>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-200 bg-white/5 p-2 rounded-lg">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar