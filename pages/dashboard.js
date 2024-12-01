import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setError('User not logged in');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchBusiness = async () => {
      try {
        const response = await fetch(`https://nodejs-serverless-function-express-two-wine.vercel.app/get-business?userId=${userId}`);
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
      const response = await fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/get-business', {
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
    <div className="min-h-screen bg-gray-100 p-4">
  <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
    <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
    <p className="text-gray-600 mb-6">Manage your business settings below.</p>
    
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Name</label>
        <input
          type="text"
          placeholder="Enter your business name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          placeholder="Enter contact email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Locations</label>
        <textarea
          placeholder="Add locations"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">AI Knowledge</label>
        <textarea
          placeholder="Enter AI-specific knowledge"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
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

      )}

      {!business && !loading && (
        <p className="mt-4 text-gray-600">No business information available.</p>
      )}
    </div>
  );
}
