import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar'; // Import Navbar for consistent UI

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
  const authToken = Cookies.get('authToken');

  // Debugging logs for cookies
  useEffect(() => {
    console.log('[DEBUG] Cookies:', { userId, businessId, authToken });
  }, [userId, businessId, authToken]);

  // Fetch leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      if (!userId || !businessId || !authToken) {
        setError('Missing authentication details. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/retrieve-leads`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              userId: userId,
              businessId: businessId,
            },
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads || []);
          setFilteredLeads(data.leads || []);
        } else {
          setError(data.error || 'Failed to fetch leads.');
        }
      } catch (err) {
        console.error('[ERROR] Failed to fetch leads:', err.message);
        setError('An error occurred while fetching leads.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [userId, businessId, authToken]);

  // Handle search input
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.status?.toLowerCase().includes(query)
    );
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset pagination on search
  }, [searchQuery, leads]);

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination handlers
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  // UI Components
  const renderLeadsTable = () => (
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
        {currentLeads.map((lead) => (
          <tr key={lead.id} className="hover:bg-gray-200">
            <td className="px-4 py-2 border border-gray-300">{lead.name || 'N/A'}</td>
            <td className="px-4 py-2 border border-gray-300">{lead.email || 'N/A'}</td>
            <td className="px-4 py-2 border border-gray-300">{lead.phone || 'N/A'}</td>
            <td className="px-4 py-2 border border-gray-300">{lead.status || 'N/A'}</td>
            <td className="px-4 py-2 border border-gray-300">
              {lead.created_at ? new Date(lead.created_at).toLocaleString() : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar /> {/* Include Navbar for consistent UI */}
      <div className="p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Leads Dashboard</h1>
          <p className="text-lg mt-2 opacity-90">Manage and review your business leads</p>
        </header>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, or status..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
        </div>

        {/* Leads Table */}
        <div className="max-w-7xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Business Leads</h2>
          {filteredLeads.length === 0 ? (
            <p className="text-center text-gray-600">No leads found.</p>
          ) : (
            renderLeadsTable()
          )}

          {/* Pagination */}
          {filteredLeads.length > leadsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
