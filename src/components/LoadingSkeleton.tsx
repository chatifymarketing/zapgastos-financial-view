
const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 loading-skeleton"></div>
                <div className="h-8 bg-gray-200 rounded w-24 loading-skeleton"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full loading-skeleton"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-soft p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 loading-skeleton"></div>
            <div className="h-64 bg-gray-200 rounded loading-skeleton"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-soft p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 loading-skeleton"></div>
            <div className="h-64 bg-gray-200 rounded loading-skeleton"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-soft">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-40 loading-skeleton"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20 loading-skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-40 loading-skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-24 loading-skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-16 loading-skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-20 loading-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
