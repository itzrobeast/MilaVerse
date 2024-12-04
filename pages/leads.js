import { useEffect, useState } from 'react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10; // Number of leads to show per page

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
          setFilteredLeads(data.leads); // Initially set filteredLeads to all leads
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

  // Handle search functionality
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredLeads(leads);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(lowercasedQuery) ||
          lead.email.toLowerCase().includes(lowercasedQuery) ||
          lead.status.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading leads...</p>
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
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Leads Table */}
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
            {currentLeads.map((lead) => (
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
  );
}
