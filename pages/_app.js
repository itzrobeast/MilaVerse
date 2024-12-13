import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { getAuthToken } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout']; // Routes where Navbar is hidden
  const [isVerified, setIsVerified] = useState(false); // Session verification state
  const [loading, setLoading] = useState(true); // Loading state
  const [user, setUser] = useState(null); // User state

  /**
   * Verify session with backend
   */
  const verifySession = async () => {
    const token = getAuthToken(); // Retrieve token (e.g., from cookies or local storage)
    console.log('[DEBUG] Retrieved Auth Token:', token);

    if (!token) {
      console.log('[DEBUG] No token found, redirecting to login...');
      router.push('/login'); // Redirect to login if no token exists
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Session verification failed');
      }

      const data = await res.json();
      console.log('[DEBUG] Session verified successfully:', data);

      setUser(data.user); // Update user state with verified user data
      setIsVerified(true); // Mark session as verified
    } catch (error) {
      console.error('[ERROR] Session verification failed:', error.message);
      router.push('/login'); // Redirect to login on failure
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  /**
   * Run session verification on mount and when the route changes
   */
  useEffect(() => {
    console.log('[DEBUG] Router path:', router.pathname);

    // Skip session verification for public routes
    if (router.pathname === '/login') {
      setLoading(false);
      return;
    }

    verifySession();
  }, [router.pathname]);

  // Display a loading spinner while verifying session
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Show Navbar unless on specific routes */}
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {/* Pass user state as a prop to all components */}
      <Component {...pageProps} user={user} />
    </>
  );
}

export default MyApp;
