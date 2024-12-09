import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BusinessSettings from '../components/BusinessSettings';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [business, setBusiness] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-business`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch business data');
      const data = await res.json();
      setBusiness(data);
    } catch (err) {
      console.error('[ERROR] Fetching dashboard data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar />
      <BusinessSettings business={business} onSave={fetchDashboardData} />
    </div>
  );
}
