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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

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

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-600 text-white">
      <header className="text-center py-10">
        <img
          src="/path-to-logo/milaverse2.webp" // Update with the actual path to your logo
          alt="Milaverse Logo"
          className="mx-auto w-32 h-32"
        />
        <h1 className="text-4xl font-bold mt-4">Welcome to the Dashboard</h1>
        <p className="text-xl mt-2">Manage your business settings below.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-lg rounded-lg p-8">
        <form className="space-y-6" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              name="name"
              value={business.name || ""}
              onChange={handleInputChange}
              placeholder="Enter your business name"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              name="email"
              value={business.email || ""}
              onChange={handleInputChange}
              placeholder="Enter contact email"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Locations</label>
            <textarea
              name="locations"
              value={business.locations || ""}
              onChange={handleInputChange}
              placeholder="Enter locations"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">AI Knowledge</label>
            <textarea
              name="aiKnowledge"
              value={business.aiKnowledge || ""}
              onChange={handleInputChange}
              placeholder="Enter AI-specific knowledge"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Objections</label>
            <textarea
              name="objections"
              value={business.objections || ""}
              onChange={handleInputChange}
              placeholder="Enter objections"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Insurance Policies</label>
            <textarea
              name="insurancePolicies"
              value={business.insurancePolicies || ""}
              onChange={handleInputChange}
              placeholder="Enter insurance policies"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Page ID (Read Only)</label>
            <input
              type="text"
              name="pageId"
              value={business.pageId || ""}
              readOnly
              className="w-full px-4 py-2 border bg-gray-200 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
