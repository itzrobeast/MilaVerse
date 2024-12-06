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
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        if (router.pathname !== '/login') {
          console.error('No token found. Redirecting to login.');
          router.push('/login'); // Redirect to login if not already there
        }
        return;
      }

      try {
        const response = await fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/verify-session', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Session verification failed');
        }

        const data = await response.json();
        console.log('Session verified:', data); // Log user data for debugging
      } catch (error) {
        console.error('Error verifying session:', error.message);
        if (router.pathname !== '/login') {
          router.push('/login'); // Redirect to login on error
        }
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
