export default function ProfilePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Settings
      </h2>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            placeholder="email@example.com"
          />
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Save Changes
        </button>
      </form>
    </div>
  );
}
