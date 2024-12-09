import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/login', '/logout'];
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifySession = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const businessId = localStorage.getItem('businessId');

      if (!token || !businessId) {
        throw new Error('Missing token or business ID');
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
        setIsVerified(true);
      } else {
        throw new Error('Session verification failed');
      }
    } catch (err) {
      console.error('[ERROR] Session verification failed:', err.message);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isVerified ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp;
