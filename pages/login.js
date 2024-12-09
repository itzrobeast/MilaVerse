import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onload = () => {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0',
        });
        console.log('[DEBUG] Facebook SDK initialized.');
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setError(null);

    FB.login(
      async (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken }),
              credentials: 'include', // Ensure cookies are set by the backend
            });

            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Backend Error: ${errorText}`);
            }

            console.log('[DEBUG] Login successful.');
            router.push('/dashboard'); // Redirect after successful login
          } catch (err) {
            setError('Login failed. Please try again.');
            console.error('[ERROR] Login failed:', err.message);
          } finally {
            setLoading(false);
          }
        } else {
          setError('User canceled login or did not authorize.');
          setLoading(false);
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Login to MilaVerse</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login with Facebook'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
