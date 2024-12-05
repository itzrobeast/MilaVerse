// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        console.error('No token found. Redirecting to login.');
        router.push('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch('/verify-session', {
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
        router.push('/login'); // Redirect to login on error
      }
    };

    verifySession();
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
