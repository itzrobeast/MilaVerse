import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BusinessSettings from '../components/BusinessSettings';

export default function Dashboard() {
  const [business, setBusiness] = useState({});
  const [vonageNumber, setVonageNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const businessData = await apiFetch('/get-business');
        setBusiness(businessData);

        const vonageData = await apiFetch('/get-vonage-number');
        setVonageNumber(vonageData.vonage_number || 'Not Assigned');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSave = async (updatedBusiness) => {
    try {
      await apiFetch('/get-business', {
        method: 'PUT',
        body: JSON.stringify(updatedBusiness),
      });
      alert('Business information updated successfully!');
    } catch (err) {
      alert(`Failed to update business information: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar />
      <BusinessSettings business={business} vonageNumber={vonageNumber} onSave={handleSave} />
    </div>
  );
}
