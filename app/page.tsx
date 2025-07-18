import Link from "next/link"

export default async function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 min-h-screen">
        {/* Hero section */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl ">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Master Your Next Interview
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your interview skills with AI-powered practice sessions, personalized feedback, and comprehensive preparation tools designed for success.
          </p>
          
          {/* Quick stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Welcome card */}
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {/* Welcome back, {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]} 👋 */}
            </h2>
            <p className="text-gray-600 text-lg">
              Ready to ace your next interview? Let&apos;s get you prepared!
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-semibold text-gray-800 mb-2">Role-Specific</h3>
              <p className="text-sm text-gray-600">Practice for your specific job role with targeted questions</p>
            </div>
            
            <Link 
            href={'/aiInterview'}>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-800 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Get instant feedback and personalized improvement tips</p>
            </div>
            </Link>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your improvement and identify areas to focus on</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link
              href="/quiz"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              <span>🚀</span>
              Start Mock Interview
            </Link>
            
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg shadow-lg border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span>📈</span>
              View Dashboard
            </Link>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">0</div>
              <div className="text-sm text-gray-600">Skills Improved</div>
            </div>
          </div>
        </div>

        {/* Quote section */}
        <div className="mt-12 max-w-2xl text-center">
          <blockquote className="text-lg text-gray-600 italic mb-4">
            &ldquo;The key to successful interviewing is preparation, practice, and confidence.&rdquo;
          </blockquote>
          <div className="w-12 h-px bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/roles"
            className="bg-white/70 hover:bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg border border-white/30"
          >
            Browse Job Roles
          </Link>
          <Link
            href="/practice"
            className="bg-white/70 hover:bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg border border-white/30"
          >
            Quick Practice
          </Link>
          <Link
            href="/settings"
            className="bg-white/70 hover:bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg border border-white/30"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}