import { useEffect, useState } from "react";

export default function Dashboard() {
  const [business, setBusiness] = useState({
    name: "",
    email: "",
    locations: "",
    aiKnowledge: "",
    objections: "",
    insurancePolicies: "",
    pageId: "", // Read-only
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
        setLoading(false); // Stop loading if user is not logged in
      }
    }
  }, []);

  // Fetch business data once userId is available
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    if (!userId) return; // Skip if userId is not set

    const fetchBusiness = async () => {
      try {
        const response = await fetch(
          `https://nodejs-serverless-function-express-two-wine.vercel.app/get-business?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok && isMounted) {
          setBusiness({
            ...data,
            objections: JSON.stringify(data.objections || {}, null, 2),
            insurancePolicies: JSON.stringify(data.insurance_policies || {}, null, 2),
          });
        } else if (isMounted) {
          setError(data.error || "Failed to fetch business information.");
        }
      } catch (err) {
        if (isMounted) {
          setError("An error occurred while fetching business data.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusiness();

    return () => {
      isMounted = false; // Cleanup to prevent setting state if unmounted
    };
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
      const payload = {
        owner_id: userId, // Use userId for owner_id
        name: business.name,
        contact_email: business.email,
        locations: business.locations || "",
        ai_knowledge_base: business.aiKnowledge || "",
        objections: JSON.parse(business.objections || "{}"),
        insurance_policies: JSON.parse(business.insurancePolicies || "{}"),
      };

      const response = await fetch(
        "https://nodejs-serverless-function-express-two-wine.vercel.app/get-business",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update business information.");
      }

      alert("Business information updated successfully!");
    } catch (err) {
      alert(err.message); // Display the error if it occurs
    }
  };

  // Render loading or error states
  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Objections
            </label>
            <textarea
              name="objections"
              value={business.objections || ""}
              onChange={handleInputChange}
              placeholder="Enter objections as JSON"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Insurance Policies
            </label>
            <textarea
              name="insurancePolicies"
              value={business.insurancePolicies || ""}
              onChange={handleInputChange}
              placeholder="Enter insurance policies as JSON"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Page ID (Read Only)
            </label>
            <input
              type="text"
              name="pageId"
              value={business.pageId || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
