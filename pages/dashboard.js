import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.js";
import Leads from "./leads.js";
import BusinessSettings from "../components/BusinessSettings.js";

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
  const [vonageNumber, setVonageNumber] = useState(null); // For phone number
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentTab, setCurrentTab] = useState("settings"); // Default to settings tab

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Load user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, []);

  // Fetch business and Vonage number data once user ID is available
  useEffect(() => {
    if (!userId) return;

    const fetchBusiness = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-business?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch business information.");
        }
        const data = await response.json();
        setBusiness((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.contact_email || "",
          locations: data.locations || "",
          aiKnowledge: data.ai_knowledge_base || "",
          objections: data.objections || "",
          insurancePolicies: data.insurance_policies || "",
          pageId: data.page_id || "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVonageNumber = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-vonage-number?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch Vonage number.");
        }
        const data = await response.json();
        setVonageNumber(data.vonage_number || "Not Assigned");
      } catch (err) {
        setVonageNumber("Error retrieving phone number.");
      }
    };

    fetchBusiness();
    fetchVonageNumber();
  }, [userId, BACKEND_URL]);

  // Update business information
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

      const response = await fetch(`${BACKEND_URL}/get-business`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update business information.");
      }

      alert("Business information updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  // Render tab content
  const renderTabContent = () => {
    if (currentTab === "leads") {
      return <Leads />;
    }
    return (
      <div className="max-w-4xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Business Settings</h2>
        <BusinessSettings
          business={business}
          vonageNumber={vonageNumber}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
        />
      </div>
    );
  };

  // Handle loading and error states
  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main>{renderTabContent()}</main>
    </div>
  );
}
