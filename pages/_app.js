import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { verifySession } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const facebookAccessToken = localStorage.getItem('facebookAccessToken'); // Retrieve the token
      if (!facebookAccessToken) {
        console.log('[DEBUG] No Facebook access token found. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login'); // Redirect only if not already on the login page
        setLoading(false);
        return;
      }

      // Verify session with backend
      const userData = await verifySession(facebookAccessToken);
      if (!userData) {
        console.error('[DEBUG] Invalid session. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login');
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Component {...pageProps} user={user} />
    </>
  );
}

export default MyApp;
