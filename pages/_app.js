import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { verifySession } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const userData = await verifySession();
      if (!userData) {
        router.push('/login'); // Redirect to login if session is invalid
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Component {...pageProps} user={user} />
    </>
  );
}

export default MyApp;
