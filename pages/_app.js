import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout'];
  const [isRefreshing, setIsRefreshing] = useState(false); // Prevent concurrent token refreshes

  useEffect(() => {
    const verifySession = async () => {
  const token = localStorage.getItem('authToken');
  const businessId = localStorage.getItem('businessId'); // Fetch business ID

  if (!token) {
    console.warn('[DEBUG] No token found. Redirecting to /login.');
    router.push('/login');
    return;
  }

  if (!businessId) {
    console.warn('[DEBUG] No business ID found. Redirecting to /login.');
    router.push('/login');
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-session?business_id=${businessId}`, // Add business_id as query param
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.ok) {
      console.log('[DEBUG] Session verified successfully.');
    } else if (res.status === 401) {
      console.warn('[DEBUG] Token expired. Attempting to refresh token.');
      if (!isRefreshing) {
        await refreshToken();
      }
    } else {
      console.error('[ERROR] Session verification failed. Redirecting to /login.');
      router.push('/login');
    }
  } catch (err) {
    console.error('Error verifying session:', err.message);
    router.push('/login');
  }
};



    

    const refreshToken = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_MILA_SECRET }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('authToken', data.newToken);
          console.log('[DEBUG] Token refreshed successfully.');
        } else {
          console.error('[ERROR] Failed to refresh token. Redirecting to /auth/login.');
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Error refreshing token:', err.message);
        router.push('/auth/login');
      } finally {
        setIsRefreshing(false);
      }
    };

    verifySession();
  }, [router, isRefreshing]);

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
