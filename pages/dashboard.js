import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamically retrieve userId from session or local storage
  const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/get-business?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setBusiness(data);
        } else {
          setError(data.error || 'Failed to fetch business information');
        }
      } catch (err) {
        setError('An error occurred while fetching business data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/get-business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });

      if (!response.ok) {
        throw new Error('Failed to update business information');
      }

      alert('Business information updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-600 mb-6">Manage your business settings below.</p>

      {loading && <p>Loading business information...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {business && (
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block font-semibold">Business Name</label>
            <input
              type="text"
              name="name"
              value={business.name || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block font-semibold">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={business.contact_email || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Locations */}
          <div>
            <label className="block font-semibold">Locations</label>
            <textarea
              name="locations"
              value={JSON.stringify(business.locations || [])}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          {/* AI Knowledge */}
          <div>
            <label className="block font-semibold">AI Knowledge</label>
            <textarea
              name="ai_knowledge"
              value={business.ai_knowledge || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="6"
              placeholder="Enter business-specific knowledge for the AI assistant..."
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}

      {!business && !loading && (
        <p className="mt-4 text-gray-600">No business information available.</p>
      )}
    </div>
  );
}
