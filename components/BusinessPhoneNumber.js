import React, { useState, useEffect } from 'react';

const BusinessPhoneNumber = ({ businessId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await fetch(
          `/api/get-vonage-number?business_id=${businessId}`
        );

        const data = await response.json();

        if (response.ok) {
          setPhoneNumber(data.vonage_number || 'Not Assigned Yet');
        } else {
          console.error('Failed to fetch phone number:', data.error);
          setPhoneNumber('Error fetching phone number');
        }
      } catch (error) {
        console.error('Error fetching phone number:', error.message);
        setPhoneNumber('Error fetching phone number');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, [businessId]);

  if (loading) {
    return <p>Loading your business phone number...</p>;
  }

  return (
    <div className="business-phone-number">
      <h2>Your Mila Business Phone Number</h2>
      <p>{phoneNumber}</p>
    </div>
  );
};

export default BusinessPhoneNumber;
