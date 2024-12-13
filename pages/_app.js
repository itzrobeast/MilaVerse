import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifySession } from '../utils/auth';

const PUBLIC_ROUTES = ['/', '/login']; // Public routes

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const facebookAccessToken = localStorage.getItem('facebookAccessToken');

      // Skip session verification for public routes
      if (PUBLIC_ROUTES.includes(router.pathname)) {
        setLoading(false);
        return;
      }

      if (!facebookAccessToken) {
        console.log('[DEBUG] No Facebook access token found. Redirecting to login...');
        router.push('/login');
        setLoading(false);
        return;
      }

      console.log('[DEBUG] Verifying session with access token...');
      const userData = await verifySession(facebookAccessToken);

      if (!userData) {
        console.error('[DEBUG] Invalid session. Redirecting to login...');
        router.push('/login');
      } else {
        console.log('[DEBUG] Session verified successfully:', userData);
        setUser(userData);
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <Component {...pageProps} user={user} />;
}

export default MyApp;
