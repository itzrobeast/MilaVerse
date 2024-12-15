import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load Facebook SDK on component mount
  useEffect(() => {
    if (typeof window === 'undefined' || document.getElementById('facebook-jssdk')) {
      console.log('[DEBUG] Facebook SDK already loaded.');
      return;
    }

    console.log('[DEBUG] Loading Facebook SDK...');
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.onload = () => {
      if (window.FB) {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0',
        });
        console.log('[DEBUG] Facebook SDK initialized.');
      } else {
        console.error('[ERROR] FB object is not available.');
        setError('Failed to load Facebook SDK.');
      }
    };
    script.onerror = () => {
      console.error('[ERROR] Failed to load Facebook SDK script.');
      setError('Failed to load Facebook SDK script.');
    };
    document.body.appendChild(script);
  }, []);

  // Handle Facebook login
  const handleLogin = () => {
    setLoading(true);
    setError(null);

    if (!window.FB) {
      console.error('[ERROR] Facebook SDK is not loaded.');
      setError('Facebook SDK not loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    FB.login(
      (response) => {
        console.log('[DEBUG] FB.login response:', response);

        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          console.log('[DEBUG] User authenticated. Access Token:', accessToken);

          // Call the backend to process login
          processLogin(accessToken);
        } else {
          console.warn('[DEBUG] User canceled login or did not authorize.');
          setError('User canceled login or did not authorize.');
          setLoading(false);
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,pages_messaging,business_management,instagram_manage_messages,leads_retrieval,instagram_basic',
        return_scopes: true,
      }
    );
  };

  // Process login with the backend
  const processLogin = async (accessToken) => {
    try {
      console.log('[DEBUG] Sending login request with accessToken:', accessToken);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
        credentials: 'include', // Ensure cookies are sent
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[ERROR] Backend returned an error:', errorText);
        throw new Error(`Backend Error: ${errorText}`);
      }

      const { userId } = await res.json(); // Parse userId from the response

      console.log('[DEBUG] Backend login response:', { userId });

      if (!userId) {
        console.error('[ERROR] userId is missing from the backend response.');
        throw new Error('Login failed. No userId received.');
      }

      // Store `authToken` and `userId` in cookies
      Cookies.set('authToken', accessToken, { expires: 7 });
      Cookies.set('userId', userId.toString(), { expires: 7 }); // Store as a string to ensure cookie compatibility

      console.log('[DEBUG] Cookies after login:', document.cookie);

      router.push('/dashboard');
    } catch (err) {
      console.error('[ERROR] Login failed:', err.message);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
