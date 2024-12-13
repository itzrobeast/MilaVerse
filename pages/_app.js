import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; // Client-side cookie management
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const authToken = Cookies.get('authToken'); // Read the token from cookies
      if (!authToken) {
        console.log('[DEBUG] No authToken found in cookies. Redirecting to login...');
        if (router.pathname !== '/login') router.push('/login');
        setLoading(false);
        return;
      }

      try {
        console.log('[DEBUG] Verifying session with authToken from cookies...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies in request
        });

        if (!response.ok) {
          console.error('[ERROR] Invalid session. Redirecting to login...');
          if (router.pathname !== '/login') router.push('/login');
        } else {
          const data = await response.json();
          console.log('[DEBUG] Session verified successfully:', data);
          setUser(data.user); // Assuming the backend returns user info
        }
      } catch (error) {
        console.error('[ERROR] Session verification failed:', error.message);
        if (router.pathname !== '/login') router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>; // Show a loading state while checking session

  return <Component {...pageProps} user={user} />;
}
