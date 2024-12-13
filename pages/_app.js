import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { verifySession } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null); // User data from session
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkSession = async () => {
      try {
        const facebookAccessToken = localStorage.getItem('facebookAccessToken'); // Retrieve the token
        if (!facebookAccessToken) {
          console.log('[DEBUG] No Facebook access token found. Redirecting to login...');
          if (router.pathname !== '/login') router.push('/login'); // Redirect only if not already on the login page
          return;
        }

        console.log('[DEBUG] Verifying session with access token...');
        const userData = await verifySession(facebookAccessToken); // Verify session
        if (!userData) {
          console.error('[DEBUG] Invalid session. Redirecting to login...');
          if (router.pathname !== '/login') router.push('/login');
        } else {
          console.log('[DEBUG] Session verified successfully:', userData);
          setUser(userData); // Set user state
        }
      } catch (error) {
        console.error('[ERROR] Session verification failed:', error.message);
        if (router.pathname !== '/login') router.push('/login');
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    checkSession(); // Call session check on mount
  }, [router]);

  if (loading) return <p>Loading...</p>; // Show a loading spinner or message

  return (
    <>
      {/* Render Navbar unless on login page */}
      {router.pathname !== '/login' && <Navbar />}
      {/* Pass user data to all pages */}
      <Component {...pageProps} user={user} />
    </>
  );
}

export default MyApp;
