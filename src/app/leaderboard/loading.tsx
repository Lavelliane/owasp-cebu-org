export default function LeaderboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-24 h-8 bg-gray-800 animate-pulse rounded"></div>
        <div className="w-48 h-10 bg-gray-800 animate-pulse rounded"></div>
        <div className="w-24 h-8 bg-gray-800 animate-pulse rounded"></div>
      </div>
      
      {/* Chart placeholder */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <div className="h-80 w-full bg-gray-800 animate-pulse rounded"></div>
      </div>
      
      {/* Table placeholder */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="bg-gray-800 px-6 py-4">
          <div className="w-36 h-8 bg-gray-700 animate-pulse rounded"></div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="w-12 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-48 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-16 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-24 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-32 h-6 bg-gray-800 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 