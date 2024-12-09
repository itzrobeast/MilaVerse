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
    const token = await getAuthToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
        method: 'GET',
        credentials: 'include', // Sends secure cookies
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Session verification failed');
      }

      const data = await res.json();
      console.log('[DEBUG] Session verified:', data);

      setIsVerified(true); // Mark session as verified
    } catch (error) {
      console.error('[ERROR] Session verification failed:', error.message);
      setIsVerified(false);
      router.push('/login'); // Redirect to login on failure
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  useEffect(() => {
  console.log('[DEBUG] Router path:', router.pathname);
  verifySession().catch(err => console.error('[ERROR] verifySession:', err.message));
}, [router.pathname]);


  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isVerified ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
