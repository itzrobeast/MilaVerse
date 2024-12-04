import React from "react";

export default function BusinessSettings({
  business,
  vonageNumber,
  handleSave,
  handleInputChange,
}) {
  return (
    <div>
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

        {/* Vonage Business Number */}
        <div>
          <label className="block text-sm font-medium">
            Your Mila Business Phone Number
          </label>
          <input
            type="text"
            value={vonageNumber || "Loading..."}
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
  );
}
