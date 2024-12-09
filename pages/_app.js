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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
      method: 'GET',
      credentials: 'include', // Ensures secure cookies are sent
      headers: {
        'Content-Type': 'application/json',
        // Include Authorization header if expected by backend
        // Replace `YOUR_TOKEN` with the actual token if required
        Authorization: `Bearer ${authToken}`,
      },
    });

      if (res.ok) {
        console.log('[DEBUG] Session verified successfully.');
        setIsVerified(true);
      } else if (res.status === 401) {
        console.error('[DEBUG] Session expired. Redirecting to login.');
        router.push('/login');
      } else {
        throw new Error('Session verification failed');
      }
    } catch (err) {
      console.error('[ERROR] Session verification failed:', err.message);
      router.push('/login');
    } finally {
      setLoading(false);
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
