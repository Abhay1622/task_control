import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SkillsChart from "@/components/dashboard/SkillsChart";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Please log in</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, xp: true, level: true, streak: true, rank: true }
  });

  // Calculate Skill Breakdown
  const results = await prisma.result.findMany({
    where: { userId: user?.id },
    select: { score: true, total: true, quiz: { select: { category: true } } }
  });

  // Calculate Skill Breakdown
  const assessments = await prisma.aIAssessment.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });


  // Aggregate scores by category: { "React": { totalScore: 50, maxScore: 80 } }
  const skillMap: Record<string, { earned: number, possible: number }> = {};

  results.forEach((r: { quiz: { category: any; }; score: number; total: number; }) => {
    const cat = r.quiz.category;
    if (!skillMap[cat]) skillMap[cat] = { earned: 0, possible: 0 };
    skillMap[cat].earned += r.score;
    skillMap[cat].possible += r.total;
  });

  // Transform to percentage for radar chart
  const skillData = Object.entries(skillMap).map(([name, data]) => ({
    name,
    score: Math.round((data.earned / (data.possible || 1)) * 100), // Proficiency %
    fullParams: data.possible
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Developer'}!
          </h1>

          {/* Gamification Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg rounded-xl hover:border-purple-500/50 transition-all">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-400 truncate">Current Level</dt>
                <dd className="mt-1 text-3xl font-bold text-white">{user?.level || 1}</dd>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg rounded-xl hover:border-purple-500/50 transition-all">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-400 truncate">XP Earned</dt>
                <dd className="mt-1 text-3xl font-bold text-blue-400">{user?.xp || 0} XP</dd>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg rounded-xl hover:border-purple-500/50 transition-all">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-400 truncate">Day Streak</dt>
                <dd className="mt-1 text-3xl font-bold text-orange-500">🔥 {user?.streak || 0}</dd>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg rounded-xl hover:border-purple-500/50 transition-all">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-400 truncate">Rank</dt>
                <dd className="mt-1 text-3xl font-bold text-purple-400">{user?.rank || 'Novice'}</dd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* Skill Radar Chart */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-2xl p-6">
              <SkillsChart data={skillData} />
            </div>


            {/* Right Column: Actions & Recent */}
            <div className="lg:col-span-1 space-y-8">

              {/* Voice Interview Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

                <h3 className="text-xl font-bold text-white mb-2 relative z-10">AI Voice Interview</h3>
                <p className="text-indigo-100 text-sm mb-6 relative z-10">Practice real-time speaking with our advanced AI interviewer. Get instant feedback.</p>

                <a href="/interview/mock" className="inline-block w-full text-center bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg hover:bg-gray-100 hover:scale-[1.02] transition-all">
                  🎙️ Start Speaking
                </a>
              </div>

              {/* Quick Practice */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Practice</h3>
                <a href="/aiInterview" className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 hover:text-blue-400 transition-colors cursor-pointer group">
                  <span className="font-medium text-gray-300 group-hover:text-blue-400">Take a New Quiz</span>
                  <span className="text-2xl">📝</span>
                </a>
              </div>

              {/* Recent Assessments */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Results</h3>
                {assessments.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No assessments taken yet.</p>
                ) : (
                  <div className="space-y-3">
                    {assessments.map((a: any) => (
                      <div key={a.id} className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-200">{a.topic}</span>
                          <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${a.score / a.total >= 0.8 ? 'bg-green-500/20 text-green-400' :
                              a.score / a.total >= 0.5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {Math.round((a.score / a.total) * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 flex justify-between">
                          <span>{a.difficulty}</span>
                          <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* User Info / Debug */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 text-center">
            Logged in as <span className="text-gray-400">{session?.user?.email}</span>
          </p>
        </div>
      </main>
    </div>
  );
}