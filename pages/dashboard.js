import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BusinessSettings from '../components/BusinessSettings';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [business, setBusiness] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch business data from backend
  const fetchDashboardData = async () => {
  try {
    const authToken = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    console.log('[DEBUG] authToken:', authToken);
    console.log('[DEBUG] userId:', userId);

    if (!authToken || !userId) {
      throw new Error('Authentication required. Redirecting to login.');
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-business?userId=${userId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch business data.');
    }

    const data = await res.json();
    setBusiness(data);
    console.log('[DEBUG] Business data:', data);
  } catch (error) {
    console.error('[ERROR] Fetching dashboard data failed:', error.message);
    setError(error.message);
    router.push('/login'); // Redirect to login on failure
  } finally {
    setLoading(false);
  }
};


  // Fetch business data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Save Changes in Business Settings
  const handleSave = async (updatedBusiness) => {
    try {
      console.log('[DEBUG] Updating business data:', updatedBusiness);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-business`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBusiness),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update business data: ${errorText}`);
      }

      const updatedData = await res.json();
      console.log('[DEBUG] Business updated successfully:', updatedData);

      setBusiness(updatedData.data);
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

  // Show loading or error messages
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Render the dashboard with business settings form
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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
