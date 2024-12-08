import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof FB === 'undefined') {
      loadFacebookSDK();
    }
  }, []);

  const loadFacebookSDK = () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });
      console.log('Facebook SDK initialized.');
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(script);
    }
  };

  const handleLogin = () => {
    FB.login(
      async (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: token }),
            });

            if (!res.ok) {
              throw new Error('Login failed.');
            }

            const data = await res.json();
            localStorage.setItem('authToken', data.token); // Store JWT
            localStorage.setItem('businessId', data.businessId); // Store business ID
            window.location.href = '/dashboard'; // Redirect
          } catch (err) {
            console.error('Login failed:', err);
          }
        } else {
          console.error('User canceled login or did not authorize.');
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_messages,business_management',
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to MilaVerse</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Login with Facebook
        </button>
      </div>
    </div>
  );
}
