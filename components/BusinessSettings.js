import React from "react";

export default function BusinessSettings({ business, handleSave, handleInputChange }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Business Settings
      </h2>

      <form className="space-y-6" onSubmit={handleSave}>
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

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Locations
          </label>
          <textarea
            name="locations"
            value={business.locations || ""}
            onChange={handleInputChange}
            placeholder="Enter locations (e.g., City, Address)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        {/* AI Knowledge Base */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            AI Knowledge Base
          </label>
          <textarea
            name="ai_knowledge_base"
            value={business.ai_knowledge_base || ""}
            onChange={handleInputChange}
            placeholder="Enter AI-specific knowledge or FAQs"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        {/* Objections */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Objections
          </label>
          <textarea
            name="objections"
            value={business.objections || ""}
            onChange={handleInputChange}
            placeholder="Enter common objections and solutions"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        {/* Insurance Policies */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Insurance Policies
          </label>
          <textarea
            name="insurance_policies"
            value={business.insurance_policies || ""}
            onChange={handleInputChange}
            placeholder="Enter insurance policies (e.g., coverage details)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        {/* Page ID (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Page ID (Read Only)
          </label>
          <input
            type="text"
            name="page_id"
            value={business.page_id || "Not Assigned"}
            readOnly
            className="w-full px-4 py-2 border bg-gray-100 rounded-lg shadow-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Vonage Number (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Mila Business Phone Number
          </label>
          <input
            type="text"
            name="vonage_number"
            value={business.vonage_number || "Loading..."}
            readOnly
            className="w-full px-4 py-2 border bg-gray-100 rounded-lg shadow-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
