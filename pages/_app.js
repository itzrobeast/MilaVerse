import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifySession } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const facebookAccessToken = localStorage.getItem('facebookAccessToken');
      if (!facebookAccessToken) {
        console.log('[DEBUG] No Facebook access token found. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login');
        if (isMounted) setLoading(false);
        return;
      }

      console.log('[DEBUG] Verifying session with access token...');
      const userData = await verifySession(facebookAccessToken);

      if (!userData) {
        console.error('[DEBUG] Invalid session. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login');
      } else {
        console.log('[DEBUG] Session verified successfully:', userData);
        if (isMounted) setUser(userData);
      }
      if (isMounted) setLoading(false);
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <Component {...pageProps} user={user} />;
}

export default MyApp;
