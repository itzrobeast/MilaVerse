import React, { useState } from "react";

export default function BusinessSettings({ business, handleSave, handleInputChange }) {
  const [message, setMessage] = useState(null); // To store success or error message
  const [isSaving, setIsSaving] = useState(false); // To handle button disable/loading state

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setMessage(null); // Clear existing messages
    setIsSaving(true); // Show saving state

    try {
      // Call handleSave passed as a prop
      const result = await handleSave();

      if (result?.success) {
        setMessage({ type: "success", text: "Business settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: result?.message || "Failed to update settings. Please try again." });
      }
    } catch (error) {
      console.error("Error saving business settings:", error);
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again later." });
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Business Settings
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Business Name */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            name="contact_email"
            value={business.contact_email || ""}
            onChange={handleInputChange}
            placeholder="Enter contact email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Other fields... */}
        {/* Save Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
