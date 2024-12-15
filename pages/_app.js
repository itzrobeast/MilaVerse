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
    const checkSession = async () => {
      const publicPages = ['/login', '/']; // Define public pages that don't require session verification

      // Skip verification for public pages
      if (publicPages.includes(router.pathname)) {
        console.log('[DEBUG] Public page detected:', router.pathname);
        setLoading(false);
        return;
      }

      // Retrieve cookies
      const authToken = Cookies.get('authToken');
      const userId = Cookies.get('userId');
      console.log('[DEBUG] Cookies on App Load:', { authToken, userId });

      // Redirect to login if no authToken is found
      if (!authToken || !userId) {
        console.log('[DEBUG] Missing authToken or userId. Redirecting to login...');
        router.push('/login');
        setLoading(false);
        return;
      }

      // Verify session with the backend
      try {
        console.log('[DEBUG] Verifying session...');
        const verifiedUser = await verifySession();
        if (verifiedUser) {
          console.log('[DEBUG] Session verified successfully:', verifiedUser);
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
  }, [router.pathname]); // Only re-run when the route changes

  // Show a loading state while verifying session
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <Component {...pageProps} user={user} />;
}
