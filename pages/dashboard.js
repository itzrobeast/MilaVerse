import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import BusinessSettings from '../components/BusinessSettings';

export default function Dashboard() {
  const [business, setBusiness] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch business data on component mount
  useEffect(() => {
    fetchBusinessData();
  }, []);

  // Fetch business data from backend
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
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch business data: ${errorText}`);
      }

      const data = await response.json();
      console.log('[DEBUG] Business data fetched successfully:', data);
      setBusiness(data);
    } catch (error) {
      console.error('[ERROR] Fetching business data failed:', error.message);
      setError(error.message);
      router.push('/login'); // Redirect to login on error
    } finally {
      setLoading(false);
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBusiness),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update business data: ${errorText}`);
      }

      const updatedData = await response.json();
      console.log('[DEBUG] Business updated successfully:', updatedData);
      setBusiness(updatedData.data?.[0] || {}); 
      // updatedData.data is usually an array from Supabase .select('*')
    } catch (err) {
      console.error('[ERROR] Updating business data failed:', err.message);
      setError(err.message);
    }
  };

  // Handle input changes in the BusinessSettings component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Render loading, error, or the main dashboard UI
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
          business={business}
          handleSave={(e) => {
            e.preventDefault();
            handleSave(business);
          }}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}
