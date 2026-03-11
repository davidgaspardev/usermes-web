export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const { location } = await searchParams;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Usermes</h2>

      {location && (
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 w-fit">
          <span>📍</span>
          <span>
            Working location: <span className="font-mono font-semibold text-gray-800">{location}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Resources</h3>
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-500 mt-2">Total resources</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Items</h3>
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-500 mt-2">Total items</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Stops</h3>
            <span className="text-3xl">🛑</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-500 mt-2">Active stops</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
