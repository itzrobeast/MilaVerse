import { useEffect, useState } from 'react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch business ID from localStorage
  const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : null;

  useEffect(() => {
    if (!businessId) return;

    const fetchLeads = async () => {
      try {
        const response = await fetch(
          `https://nodejs-serverless-function-express-two-wine.vercel.app/retrieve-leads?business_id=${businessId}`
        );
        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads);
        } else {
          setError(data.error || 'Failed to fetch leads');
        }
      } catch (err) {
        setError('An error occurred while fetching leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Leads Dashboard</h1>
        <p className="text-lg mt-2 opacity-90">Manage and review your business leads</p>
      </header>

      <div className="max-w-7xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Business Leads</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Phone</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-200">
                <td className="px-4 py-2 border border-gray-300">{lead.name}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.email}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.phone}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.status}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
