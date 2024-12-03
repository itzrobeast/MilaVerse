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

  // Load user ID from localStorage
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

  // Fetch business data once user ID is available
  useEffect(() => {
    let isMounted = true;

    if (!userId) return;

    const fetchBusiness = async () => {
      try {
        const response = await fetch(
          `https://nodejs-serverless-function-express-two-wine.vercel.app/get-business?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok && isMounted) {
          setBusiness({
            ...data,
            objections: data.objections || "",
            insurancePolicies: data.insurance_policies || "",
            email: data.contact_email || "",
            aiKnowledge: data.ai_knowledge_base || "",
            pageId: data.page_id || '',
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
      isMounted = false;
    };
  }, [userId]);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes to the backend
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        owner_id: userId,
        name: business.name,
        contact_email: business.email,
        locations: business.locations || "",
        ai_knowledge_base: business.aiKnowledge || "",
        objections: business.objections || "",
        insurance_policies: business.insurancePolicies || "",
        page_id: business.pageId || "", // Read-only, include if relevant
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
      alert(err.message);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="py-10 text-center bg-white text-gray-800">
        <img
          src="/milaverse2.webp"
          alt="Milaverse Logo"
          className="mx-auto w-full max-w-[300px] h-auto"
        />
        <h1 className="text-4xl font-bold mt-4">MilaVerse</h1>
        <p className="text-lg mt-2 opacity-90">
          Your AI-powered business management dashboard
        </p>
      </header>

      {/* Dashboard Form */}
      <div className="max-w-4xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Manage Business Settings
        </h2>
        <form className="space-y-6" onSubmit={handleSave}>
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium">Business Name</label>
            <input
              type="text"
              name="name"
              value={business.name || ""}
              onChange={handleInputChange}
              placeholder="Enter your business name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium">Contact Email</label>
            <input
              type="email"
              name="email"
              value={business.email || ""}
              onChange={handleInputChange}
              placeholder="Enter contact email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Locations */}
          <div>
            <label className="block text-sm font-medium">Locations</label>
            <textarea
              name="locations"
              value={business.locations || ""}
              onChange={handleInputChange}
              placeholder="Enter locations"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* AI Knowledge */}
          <div>
            <label className="block text-sm font-medium">AI Knowledge</label>
            <textarea
              name="aiKnowledge"
              value={business.aiKnowledge || ""}
              onChange={handleInputChange}
              placeholder="Enter AI-specific knowledge"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Objections */}
          <div>
            <label className="block text-sm font-medium">Objections</label>
            <textarea
              name="objections"
              value={business.objections || ""}
              onChange={handleInputChange}
              placeholder="Enter objections"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Insurance Policies */}
          <div>
            <label className="block text-sm font-medium">Insurance Policies</label>
            <textarea
              name="insurancePolicies"
              value={business.insurancePolicies || ""}
              onChange={handleInputChange}
              placeholder="Enter insurance policies"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Page ID */}
          <div>
            <label className="block text-sm font-medium">Page ID (Read Only)</label>
            <input
              type="text"
              name="pageId"
              value={business.pageId || ""}
              readOnly
              className="w-full px-4 py-2 border bg-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
