import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // List of routes where Navbar should be hidden
  const noNavbarRoutes = ['/login', '/logout']; 

  useEffect(() => {
  const verifySession = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redirect if no token
      return;
    }

    try {
      const response = await fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/verify-session', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Session verification failed');
      }

      const data = await response.json();
      console.log('Session verified:', data);
    } catch (error) {
      console.error('[ERROR] Verifying session failed:', error.message);
      router.push('/login'); // Redirect on error
    }
  };

  verifySession();
}, [router]);


  return (
    <>
      {/* Render Navbar only if the current route is NOT in noNavbarRoutes */}
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
