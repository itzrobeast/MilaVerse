import { useEffect, useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error messages

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof FB === 'undefined') {
      loadFacebookSDK();
    }
  }, []);

  const loadFacebookSDK = () => {
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onload = () => console.log('[DEBUG] Facebook SDK script loaded.');
      script.onerror = () => setError('Failed to load Facebook SDK.');
      document.body.appendChild(script);

      window.fbAsyncInit = function () {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0',
        });
        console.log('[DEBUG] Facebook SDK initialized.');
      };
    }
  };

  const handleLogin = () => {
    setLoading(true);
    setError(null);

    FB.login((response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        loginToBackend(accessToken); // Separate function for API call
      } else {
        setError('User canceled login or did not authorize.');
        setLoading(false);
      }
    }, {
      scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_messages,business_management',
    });
  };

  const loginToBackend = async (accessToken) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend Error: ${errorText}`);
      }

      const { token, businessId } = await res.json();
      localStorage.setItem('authToken', token); // Save the token
      localStorage.setItem('businessId', businessId); // Save business ID
      window.location.href = '/dashboard'; // Redirect after login
    } catch (err) {
      console.error('[ERROR] Login failed:', err.message);
      setError('Failed to log in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to MilaVerse</h1>
        <button
          onClick={handleLogin}
          className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login with Facebook'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {loading && (
        <div className="mt-4">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
