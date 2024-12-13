import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; // Library to manage cookies

export default function Login() {
  const [loading, setLoading] = useState(false); // For button state
  const [error, setError] = useState(null); // For displaying errors
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
      console.error('[ERROR] Failed to load the Facebook SDK script.');
      setError('Failed to load Facebook SDK script.');
    };
    document.body.appendChild(script);
  }, []);

  // Handle login button click
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    if (!window.FB) {
      console.error('[ERROR] Facebook SDK is not loaded.');
      setError('Facebook SDK not loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    FB.login(
      async (response) => {
        console.log('[DEBUG] FB.login response:', response);

        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          console.log('[DEBUG] User authenticated. Access Token:', accessToken);

          // Fetch user details using the Facebook Graph API
          FB.api(
            '/me',
            { fields: 'id,name,email', access_token: accessToken },
            async (userInfo) => {
              if (userInfo && !userInfo.error) {
                console.log('[DEBUG] User Info:', userInfo);

                // Process login with backend
                await processLogin(accessToken, userInfo);
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

  // Send login data to the backend
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
      Cookies.set('authToken', accessToken, { expires: 7 }); // Set access token in cookie with 7-day expiration
      localStorage.setItem('facebookAccessToken', accessToken); // Save to localStorage for session verification
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
