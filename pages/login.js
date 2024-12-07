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

          // Fetch user details and set up the backend
          fetchUserDetailsAndSetup(token);
        } else {
          console.error('User canceled login or did not fully authorize.');
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_messages,business_management',
      }
    );
  };

  const fetchUserDetailsAndSetup = (token) => {
    FB.api('/me', { fields: 'id,name,email' }, (userData) => {
      console.log('Facebook User Data:', userData);

      fetchPageId(token).then((pageData) => {
        if (!pageData) {
          alert('No pages found for this user. Please ensure a Facebook page is connected.');
          return;
        }

        const { pageId, pageAccessToken } = pageData;

        handleBackendSetup(userData, token, pageId, pageAccessToken);
      });
    });
  };

  const fetchPageId = async (accessToken) => {
    const url = `https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.data.length > 0) {
        const page = data.data[0]; // Use the first page
        console.log('[DEBUG] Page found:', page);
        return { pageId: page.id, pageAccessToken: page.access_token };
      } else {
        console.warn('[WARN] No pages found for this user.');
        return null;
      }
    } catch (error) {
      console.error('[ERROR] Failed to fetch pages:', error.message);
      return null;
    }
  };

  const handleBackendSetup = async (userData, accessToken, pageId, pageAccessToken) => {
    const platform = getPlatform(); // Utility to detect the platform (Web/Mobile)

    const payload = {
      appId: 'milaVerse',
      businessName: userData.name,
      contactEmail: userData.email,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
      accessToken, // Token from FB.login
      pageId, // Page ID retrieved from Facebook API
      reconnect: true,
      platform,
    };

    console.log('[DEBUG] Sending payload to backend:', payload);

    fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/setup-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => console.log('[DEBUG] Backend response:', data))
      .catch((error) => console.error('[ERROR] Backend setup failed:', error));
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
