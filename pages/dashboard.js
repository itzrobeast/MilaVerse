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

  // Fetch business and Vonage number data once user ID is available
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
            pageId: data.page_id || "",
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

    const fetchVonageNumber = async () => {
      try {
        const response = await fetch(
          `https://nodejs-serverless-function-express-two-wine.vercel.app/get-vonage-number?userId=${userId}`
        );
        const data = await response.json();

        if (response.ok && isMounted) {
          setVonageNumber(data.vonage_number || "Not Assigned");
        } else if (isMounted) {
          setVonageNumber("Error retrieving phone number.");
        }
      } catch (err) {
        if (isMounted) {
          setVonageNumber("Error retrieving phone number.");
        }
      }
    };

    fetchBusiness();
    fetchVonageNumber();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const renderTabContent = () => {
    if (currentTab === "leads") {
      return <Leads />;
    }
    return (
      <div className="max-w-4xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Manage Business Settings
        </h2>
        <BusinessSettings
          business={business}
          vonageNumber={vonageNumber}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
        />
      </div>
    );
  };

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

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main>{renderTabContent()}</main>
    </div>
  );
}
