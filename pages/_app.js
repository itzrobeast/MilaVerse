import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout'];
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

 const verifySession = async () => {
  try {
    // Fetch the token securely, e.g., from state, secure storage, or cookie
    const token = getAuthToken(); // Replace `getAuthToken` with your actual token retrieval logic

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
      method: 'GET',
      credentials: 'include', // Sends secure cookies along with the request
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Include the header only if a token exists
      },
    });

      if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Session verification failed');
    }

    const data = await res.json();
    console.log('[DEBUG] Session verified:', data);

    // Handle the verified session (e.g., update UI or state)
    return data;
  } catch (error) {
    console.error('[ERROR] Session verification failed:', error.message);
    throw error; // Re-throw to handle it in calling code
  }
};

  useEffect(() => {
    verifySession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isVerified ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
