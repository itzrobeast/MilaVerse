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
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('[DEBUG] No token found. Redirecting to /auth/login.');
      window.location.href = '/auth/login';
      return;
    }

    const businessId = localStorage.getItem('businessId'); // Ensure businessId is stored
    if (!businessId) {
      console.error('[ERROR] Missing business ID. Redirecting to /auth/login.');
      window.location.href = '/auth/login';
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-session?business_id=${businessId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      console.log('[DEBUG] Session verified successfully.');
    } else {
      const errorText = await res.text();
      console.error(`[ERROR] Session verification failed: ${errorText}`);
      window.location.href = '/auth/login';
    }
  } catch (err) {
    console.error('[ERROR] Error during session verification:', err.message);
    window.location.href = '/auth/login';
  }
};

// Call `verifySession` in a useEffect hook or equivalent lifecycle event
useEffect(() => {
  verifySession();
}, []);




    

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
