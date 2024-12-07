import { useEffect } from 'react';
import { getPlatform } from '../utils/platform';

export default function Login() {
  useEffect(() => {
    // Dynamically load the Facebook SDK script
    if (typeof window !== 'undefined' && typeof FB === 'undefined') {
      loadFacebookSDK();
    }
  }, []);

  const loadFacebookSDK = () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });
      console.log('Facebook SDK initialized globally.');
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(script);
    }
  };

  const handleLogin = () => {
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not loaded.');
      return;
    }

    FB.login(
      (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          console.log('New Access Token:', token);

          // Store the token in localStorage for future use
          localStorage.setItem('authToken', token);

          // Send the new token to your backend
          sendTokenToBackend(token);
        } else {
          console.error('User canceled login or did not fully authorize.');
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_messages,business_management',
      }
    );
  };

  const sendTokenToBackend = (token) => {
    fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/setup-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token,
        // Include other payload details your backend might need
        user: { id: 'fb_user_id_here', name: 'fb_user_name_here', email: 'fb_user_email_here' },
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Token sent successfully:', data))
      .catch((error) => console.error('Error sending token to backend:', error));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login to MilaVerse</h1>
      <p className="text-gray-600 mb-6">
        Use your Facebook account to connect your Instagram business profile.
      </p>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition-all"
      >
        Login with Facebook
      </button>
    </div>
  );
}
