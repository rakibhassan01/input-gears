export default function CheckoutSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* --- LEFT SIDE: FORM SKELETON --- */}
        <div className="lg:col-span-7 space-y-8">
          {/* Delivery Details Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mt-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: SUMMARY SKELETON --- */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6" />

            {/* Items List */}
            <div className="space-y-4 mb-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="h-14 w-14 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Calculation Lines */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between pt-4">
                <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>

            {/* Button */}
            <div className="h-14 w-full bg-gray-900/10 rounded-xl animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
