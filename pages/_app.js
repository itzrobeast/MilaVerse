import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifySession } from '../utils/auth';

const PUBLIC_ROUTES = ['/', '/login']; // Routes that don't require authentication

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const facebookAccessToken = localStorage.getItem('facebookAccessToken');

      if (!facebookAccessToken) {
        console.log('[DEBUG] No Facebook access token found.');
        if (!PUBLIC_ROUTES.includes(router.pathname)) {
          console.log('[DEBUG] Redirecting to login...');
          if (isMounted) router.push('/login');
        }
        if (isMounted) setLoading(false);
        return;
      }

      console.log('[DEBUG] Verifying session with access token...');
      const userData = await verifySession(facebookAccessToken);

      if (!userData) {
        console.error('[DEBUG] Invalid session. Redirecting to login...');
        if (!PUBLIC_ROUTES.includes(router.pathname)) {
          if (isMounted) router.push('/login');
        }
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
