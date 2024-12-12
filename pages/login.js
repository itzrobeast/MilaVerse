import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!document.getElementById('facebook-jssdk')) {
      console.log('[DEBUG] Adding Facebook SDK script...');
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onload = () => {
        if (window.FB) {
          console.log('[DEBUG] Facebook SDK loaded successfully.');
          FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v16.0',
          });
          console.log('[DEBUG] Facebook SDK initialized.');
        } else {
          console.error('[ERROR] FB object is not available after script load.');
          setError('Failed to load Facebook SDK.');
        }
      };
      script.onerror = () => {
        console.error('[ERROR] Failed to load the Facebook SDK script.');
        setError('Failed to load Facebook SDK script.');
      };
      document.body.appendChild(script);
    } else {
      console.log('[DEBUG] Facebook SDK script already exists.');
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    if (!window.FB) {
      console.error('[ERROR] FB object is not available.');
      setError('Facebook SDK not loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    FB.login(
      (response) => {
        console.log('[DEBUG] FB.login response:', response);

        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          console.log('[DEBUG] User authenticated. Access Token:', accessToken);

          // Fetch user details
          FB.api(
            '/me',
            { fields: 'id,name,email', access_token: accessToken },
            (userInfo) => {
              if (userInfo && !userInfo.error) {
                console.log('[DEBUG] User Info:', userInfo);
                // Call login processing function
                processLogin(accessToken, userInfo);
              } else {
                console.error('[ERROR] Failed to fetch user info:', userInfo.error);
                setError('Failed to fetch user information. Please try again.');
                setLoading(false);
              }
            }
          );
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

  const processLogin = async (accessToken, userInfo) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, userInfo }),
        credentials: 'include', // Ensures secure cookies are set
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend Error: ${errorText}`);
      }

      console.log('[DEBUG] Login successful.');
      Cookies.set('authToken', accessToken); // Set access token in cookie
      router.push('/dashboard'); // Redirect user to the dashboard
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
