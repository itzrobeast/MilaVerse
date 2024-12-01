import { useEffect, useState } from "react";

export default function Dashboard() {
  const [business, setBusiness] = useState({
    name: "",
    email: "",
    locations: "",
    aiKnowledge: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load userId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setError("User not logged in.");
        setLoading(false);
      }
    }
  }, []);

  // Fetch business data once userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchBusiness = async () => {
      try {
        const response = await fetch(
          `https://nodejs-serverless-function-express-two-wine.vercel.app/get-business?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setBusiness(data);
        } else {
          setError(data.error || "Failed to fetch business information.");
        }
      } catch (err) {
        setError("An error occurred while fetching business data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [userId]);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes to the backend
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      const response = await fetch(
        "https://nodejs-serverless-function-express-two-wine.vercel.app/update-business",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(business),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update business information.");
      }

      alert("Business information updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-gray-600 mb-6">Manage your business settings below.</p>

            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={business.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={business.email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Locations
                </label>
                <textarea
                  name="locations"
                  value={business.locations || ""}
                  onChange={handleInputChange}
                  placeholder="Add locations"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  AI Knowledge
                </label>
                <textarea
                  name="aiKnowledge"
                  value={business.aiKnowledge || ""}
                  onChange={handleInputChange}
                  placeholder="Enter AI-specific knowledge"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
