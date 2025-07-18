import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Protected Content</h2>
              <p className="text-gray-600">
                This is a protected route. You can only see this content because you're logged in.
              </p>
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800">User Information</h3>
                <dl className="mt-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <dt>Name:</dt>
                    <dd>{session?.user?.name || 'Not provided'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Email:</dt>
                    <dd>{session?.user?.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>User ID:</dt>
                    <dd>{session?.user?.id}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}