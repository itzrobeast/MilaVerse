import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import '../styles/globals.css';
import { verifySession } from '../utils/auth';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const publicPages = ['/login', '/']; // Define pages that don't require session verification
    const checkSession = async () => {
      if (publicPages.includes(router.pathname)) {
        console.log('[DEBUG] Skipping session verification for public page:', router.pathname);
        setLoading(false);
        return;
      }

      const authToken = Cookies.get('authToken'); // Read the token from cookies
       const userId = Cookies.get('userId');
  console.log('[DEBUG] Cookies on App Load:', { authToken, userId });
}, []);
      if (!authToken) {
        console.log('[DEBUG] No authToken found in cookies. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login');
        setLoading(false);
        return;
      }

      try {
        console.log('[DEBUG] Verifying session with authToken from cookies...');
        const verifiedUser = await verifySession();
        if (verifiedUser) {
          setUser(verifiedUser);
        } else {
          console.error('[ERROR] Invalid session. Redirecting to login...');
          router.push('/login');
        }
      } catch (error) {
        console.error('[ERROR] Session verification failed:', error.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>; // Show a loading state while checking session

  return <Component {...pageProps} user={user} />;
}
