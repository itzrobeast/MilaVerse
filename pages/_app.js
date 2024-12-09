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
      const businessId = localStorage.getItem('businessId'); // Ensure this is retrieved correctly
      if (!businessId) {
        throw new Error('Business ID not found in localStorage');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session?business_id=${businessId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
