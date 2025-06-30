const stats = [
  { name: "Total Projects", value: "24", trend: "up", change: "12%" },
  { name: "Active Tasks", value: "56", trend: "up", change: "4%" },
  { name: "Completed", value: "128", trend: "up", change: "24%" },
  { name: "Overdue", value: "3", trend: "down", change: "2%" },
];

export const Dashboard = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 rounded-md p-3 ${
                    stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? "↑" : "↓"}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600">👤</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 px-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        User Activity {i + 1}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        Completed task #{i + 1} in Project X
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <p className="text-sm text-gray-400">{i + 1}h ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
