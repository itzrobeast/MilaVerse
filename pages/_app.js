import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Adjusted for your directory structure
import '../styles/globals.css'; // Global styles
import { getAuthToken } from '../utils/auth'; // Ensure this function is properly defined in utils/auth.js

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout']; // Routes where Navbar is hidden
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Verifies the user's session by sending a request to the backend.
   */
  const verifySession = async () => {
    try {
      const token = getAuthToken(); // Retrieve token from client storage (localStorage/cookies)
      console.log('[DEBUG] Retrieved Auth Token:', token);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
        method: 'GET',
        credentials: 'include', // Ensures secure cookies are sent
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
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
      setIsVerified(false);
      router.push('/login'); // Redirect to login page on failure
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  /**
   * Triggers session verification on route changes.
   */
  useEffect(() => {
    console.log('[DEBUG] Router path:', router.pathname);
    verifySession().catch((err) =>
      console.error('[ERROR] Failed to verify session during useEffect:', err.message)
    );
  }, [router.pathname]);

  /**
   * Show a loading spinner until session verification is complete.
   */
  if (loading) return <p>Loading...</p>;

  /**
   * Render the app with a conditional Navbar.
   */
  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isVerified ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
