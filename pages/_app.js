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

        if (!res.ok) {
          console.error('[ERROR] Session verification failed.');
          router.push('/login');
        }
      } catch (err) {
        console.error('Error verifying session:', err.message);
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
