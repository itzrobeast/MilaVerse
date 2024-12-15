import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import BusinessSettings from '../components/BusinessSettings';

export default function Dashboard() {
  const [business, setBusiness] = useState({});
  const [vonageNumber, setVonageNumber] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // On component mount, fetch business data
  useEffect(() => {
    fetchBusinessData();
  }, []);

  // 1. Fetch the main business data
  const fetchBusinessData = async () => {
    try {
      const authToken = Cookies.get('authToken');
      const userId = parseInt(Cookies.get('userId'), 10);

      if (!authToken || isNaN(userId)) {
        throw new Error('Authentication required. Redirecting to login.');
      }

      console.log('[DEBUG] Cookies on Dashboard Load:', { authToken, userId });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-business?user_id=${userId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch business data: ${errorText}`);
      }

      const data = await response.json();
      console.log('[DEBUG] Business data fetched successfully:', data);
      setBusiness(data);

      // After that, fetch the Vonage number in parallel
      fetchVonageNumber(data.id || userId);

    } catch (err) {
      console.error('[ERROR] Fetching business data failed:', err.message);
      setError(err.message);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch the Vonage number from a separate table
  const fetchVonageNumber = async (businessId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-vonage-number?business_id=${businessId}`,
        { credentials: 'include' }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch Vonage number: ${errorText}`);
      }
      const data = await res.json();
      console.log('[DEBUG] Vonage number fetched successfully:', data);
      setVonageNumber(data.vonage_number || 'Not Assigned');
    } catch (err) {
      console.error('[ERROR] Fetching Vonage number failed:', err.message);
      setVonageNumber('Error fetching Vonage number');
    }
  };

  // Handle saving business data
  const handleSave = async (updatedBusiness) => {
    try {
      console.log('[DEBUG] Updating business data:', updatedBusiness);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-business/update-business`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBusiness),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update business data: ${errorText}`);
      }

      const updatedData = await response.json();
      console.log('[DEBUG] Business updated successfully:', updatedData);
      // Supabase might return an array of updated rows in updatedData.data
      setBusiness(updatedData.data?.[0] || {});
      return true; // Indicate success
    } catch (err) {
      console.error('[ERROR] Updating business data failed:', err.message);
      setError(err.message);
      throw err; // Rethrow so the child component can catch the error
    }
  };

  // Handle input changes for the BusinessSettings form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading...</p>
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <BusinessSettings
          business={{ ...business, vonage_number: vonageNumber }}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}
