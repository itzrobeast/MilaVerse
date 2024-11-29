import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export default function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase.from('businesses').select('*');
      if (error) {
        setError(error.message);
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data);
        console.log('Fetched businesses:', data);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to MilaVerse Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Manage your Instagram bot and settings here.
      </p>

      {/* Error Message */}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {/* Display Businesses */}
      <div className="mt-6 w-full max-w-4xl p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold text-gray-800">My Businesses</h2>
        {businesses.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {businesses.map((business) => (
              <li
                key={business.id}
                className="p-4 border rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-700">{business.name}</h3>
                <p className="text-gray-600">
                  Locations: {JSON.stringify(business.locations)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">No businesses found.</p>
        )}
      </div>
    </div>
  );
}
