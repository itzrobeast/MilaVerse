import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const noNavbarRoutes = ['/login', '/logout'];

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('[DEBUG] No token found. Redirecting to /login.');
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-session`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          console.log('[DEBUG] Session verified successfully.');
        } else if (res.status === 401) {
          console.warn('[DEBUG] Token expired. Attempting to refresh token.');
          await refreshToken();
        } else {
          console.error('[ERROR] Session verification failed.');
          router.push('/login');
        }
      } catch (err) {
        console.error('Error verifying session:', err.message);
        router.push('/login');
      }
    };

    const refreshToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_MILA_SECRET }), // Use the secret if required
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('authToken', data.newToken);
          console.log('[DEBUG] Token refreshed successfully.');
        } else {
          console.error('[ERROR] Failed to refresh token. Redirecting to /login.');
          router.push('/login');
        }
      } catch (err) {
        console.error('Error refreshing token:', err.message);
        router.push('/login');
      }
    };

    verifySession();
  }, [router]);

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
