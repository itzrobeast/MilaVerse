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
  const publicPages = ['/login', '/'];

  if (publicPages.includes(router.pathname)) {
    console.log('[DEBUG] Public page detected:', router.pathname);
    setLoading(false);
    return;
  }

  const authToken = Cookies.get('authToken');
  const userId = parseInt(Cookies.get('userId'), 10);

  if (!authToken || isNaN(userId)) {
    console.log('[DEBUG] Missing or invalid authToken/userId. Redirecting to login...');
    router.push('/login');
    setLoading(false);
    return;
  }

  try {
    const verifiedUser = await verifySession();
    if (verifiedUser) {
      setUser(verifiedUser);
    } else {
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
