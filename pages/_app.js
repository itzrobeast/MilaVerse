useEffect(() => {
  const verifySession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        console.log('[DEBUG] Session verified successfully.');
        setIsVerified(true);
      } else if (res.status === 401) {
        console.error('[DEBUG] Session expired. Redirecting to login.');
        router.push('/login');
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

  verifySession();
}, [router]);
