import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { getAuthToken } from '../utils/auth';
import { verifySession } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout'];
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const verifySession = async () => {
    const token = getAuthToken(); // Retrieve the token from cookies
    console.log('[DEBUG] Retrieved Auth Token:', token);

    if (!token) {
      console.log('[DEBUG] No token found, redirecting to login...');
      router.push('/login'); // Redirect to login page if no token exists
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token in the header
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Session verification failed');
      }

      const data = await res.json();
      console.log('[DEBUG] Session verified successfully:', data);

      setIsVerified(true); // Mark session as verified
    } catch (error) {
      console.error('[ERROR] Session verification failed:', error.message);
      router.push('/login'); // Redirect to login page on failure
    } finally {
      setLoading(false);
    }
  };



  
  useEffect(() => {
    const fetchSession = async () => {
      const userData = await verifySession();
      setUser(userData); // Update user state
    };

    fetchSession();
  }, []);

  return (
    <>
      {/* Pass user state as a prop to all components */}
      <Component {...pageProps} user={user} />
    </>
  );
}




  
  useEffect(() => {
    console.log('[DEBUG] Router path:', router.pathname);

    // Skip session verification for public routes
    if (router.pathname === '/login') {
      setLoading(false);
      return;
    }

    verifySession().catch(err =>
      console.error('[ERROR] Failed to verify session during useEffect:', err.message)
    );
  }, [router.pathname]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isVerified ? <Component {...pageProps} /> : router.pathname === '/login' ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
