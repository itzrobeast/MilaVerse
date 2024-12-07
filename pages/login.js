import { useEffect } from 'react';

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
    FB.login(
      (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          console.log('New Access Token:', token);
          localStorage.setItem('authToken', token);
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
    console.log('[DEBUG] Sending token to backend:', token);
    fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/verify-session', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Session verification failed.');
        }
        return response.json();
      })
      .then((data) => console.log('[DEBUG] Backend response:', data))
      .catch((error) => console.error('[DEBUG] Error verifying session:', error));
  };

  return (
    <div>
      <h1>Login to MilaVerse</h1>
      <button onClick={handleLogin}>Login with Facebook</button>
    </div>
  );
}
