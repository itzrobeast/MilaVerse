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
      const publicPages = ['/login', '/']; // Pages that don't require authentication
      const currentPath = router.pathname;

      console.log('[DEBUG] Current path:', currentPath);

      if (publicPages.includes(currentPath)) {
        console.log('[DEBUG] Public page detected. Skipping session verification.');
        setLoading(false);
        return;
      }

      // Retrieve cookies
      const authToken = Cookies.get('authToken');
      const userId = Cookies.get('userId');

      console.log('[DEBUG] Cookies:', { authToken, userId });

      // Redirect to login if cookies are missing
      if (!authToken || !userId) {
        console.warn('[WARN] Missing authentication cookies. Redirecting to login.');
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        // Verify session with the backend
        const verifiedUser = await verifySession();
        if (verifiedUser) {
          console.log('[DEBUG] Session verified successfully:', verifiedUser);
          setUser(verifiedUser);
        } else {
          console.warn('[WARN] Session verification failed. Redirecting to login.');
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
  }, [router.pathname]);

  // Show a loading indicator while verifying session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Verifying session...</p>
      </div>
    );
  }

  return <Component {...pageProps} user={user} />;
}
