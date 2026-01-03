export default function AccountLoading() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-100 rounded"></div>
          <div className="h-3 w-32 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-12 bg-gray-100 rounded-xl"></div>
          <div className="h-12 bg-gray-100 rounded-xl"></div>
        </div>
        <div className="h-12 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  );
}
