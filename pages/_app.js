import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ['/login', '/logout'];

  // Verify session and manage redirection
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.warn('[DEBUG] No token found. Redirecting to /login.');
          router.push('/login'); // Redirect to login if no token exists
          return;
        }

        // Verify session with the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-session`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('[ERROR] Session verification failed:', response.status);
          router.push('/login'); // Redirect to login on failed verification
          return;
        }

        const data = await response.json();
        console.log('[DEBUG] Session verified successfully:', data);
      } catch (error) {
        console.error('[ERROR] Error verifying session:', error.message);
        router.push('/login'); // Redirect to login on error
      }
    };

    verifySession();
  }, [router]); // Dependency array includes `router` to ensure effect re-runs on route changes

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}

      {/* Render the main component for the current route */}
      <Component {...pageProps} />

      {/* Include Vercel Analytics */}
      <Analytics />
    </>
  );
}

export default MyApp;
