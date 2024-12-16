// pages/leads.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import ErrorBoundary from '../components/ErrorBoundary'; // Ensure this component exists

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Fetch authentication details from cookies
  const userId = Cookies.get('userId');
  const businessId = Cookies.get('businessId');

  useEffect(() => {
    console.log('[DEBUG] Cookies:', { userId, businessId });
  }, [userId, businessId]);

  // Fetch leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      if (!userId || !businessId) {
        setError('Missing authentication details. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/retrieve-leads`,
          {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch leads.');
        }

        const data = await response.json();
        console.log('[DEBUG] Fetched Leads:', data.leads);
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
      } catch (err) {
        console.error('[ERROR] Failed to fetch leads:', err.message);
        setError(err.message || 'An error occurred while fetching leads.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [userId, businessId]);

  // Search Logic
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = leads.filter((lead) => {
      const name = lead.name || '';
      const email = lead.email || '';
      const phone = lead.phone || '';
      const status = lead.status || '';
      const city = lead.city || '';
      const fieldData = Array.isArray(lead.field_data)
        ? lead.field_data
            .map((item) => `${item.name}: ${item.values.join(', ')}`)
            .join('; ')
        : '';

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query) ||
        fieldData.toLowerCase().includes(query)
      );
    });

    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset pagination on search
  }, [searchQuery, leads]);

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination handlers
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  // Table Render Logic
  const renderLeadsTable = () => (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
          <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
          <th className="px-4 py-2 border border-gray-300 text-left">Phone</th>
          <th className="px-4 py-2 border border-gray-300 text-left">City</th>
          <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
          <th className="px-4 py-2 border border-gray-300 text-left">Created Time</th>
          <th className="px-4 py-2 border border-gray-300 text-left">Custom Data</th>
        </tr>
      </thead>
      <tbody>
        {currentLeads.map((lead) => (
          <tr key={lead.id || lead.lead_id} className="hover:bg-gray-200">
            <td className="px-4 py-2 border border-gray-300">
              {typeof lead.name === 'string' && lead.name.trim() !== '' ? lead.name : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {typeof lead.email === 'string' && lead.email.trim() !== '' ? lead.email : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {typeof lead.phone === 'string' && lead.phone.trim() !== '' ? lead.phone : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {typeof lead.city === 'string' && lead.city.trim() !== '' ? lead.city : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {typeof lead.status === 'string' && lead.status.trim() !== '' ? lead.status : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {lead.created_time && !isNaN(new Date(lead.created_time))
                ? new Date(lead.created_time).toLocaleString()
                : 'N/A'}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {Array.isArray(lead.field_data) && lead.field_data.length > 0
                ? lead.field_data
                    .map((item) => {
                      const itemName = item.name || 'Unnamed Field';
                      const itemValues = Array.isArray(item.values)
                        ? item.values.join(', ')
                        : item.values || 'No Value';
                      return `${itemName}: ${itemValues}`;
                    })
                    .join('; ')
                : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading Leads...</p>
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar />
        <div className="p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">Leads Dashboard</h1>
            <p className="text-lg mt-2 opacity-90">Manage and review your business leads</p>
          </header>

          <div className="max-w-7xl mx-auto mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, email, phone, city, or custom data..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>

          <div className="max-w-7xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Business Leads</h2>
            {filteredLeads.length === 0 ? (
              <p className="text-center text-gray-600">No leads found.</p>
            ) : (
              renderLeadsTable()
            )}

            {filteredLeads.length > leadsPerPage && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-gray-300 rounded ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                  }`}
                >
                  Previous
                </button>
                <p className="text-sm">Page {currentPage} of {totalPages}</p>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 bg-gray-300 rounded ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

