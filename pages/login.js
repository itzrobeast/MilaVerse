import { useEffect } from 'react';
import { getPlatform } from '../utils/platform';

export default function Login() {
  useEffect(() => {
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not loaded.');
      return;
    }

    console.log('Facebook SDK is ready.');
    initializeFacebookSDK();
  }, []);

  const initializeFacebookSDK = () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });

      console.log('Facebook SDK initialized globally.');
      checkLoginStatus();
    };
  };

  const checkLoginStatus = () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('User already connected:', response);
        fetchUserDetails(response.authResponse);
      } else {
        console.log('User not connected.');
      }
    });
  };

  const handleLogin = () => {
    FB.login(
      (response) => {
        if (response.authResponse) {
          console.log('Login successful:', response);
          fetchUserDetails(response.authResponse);
        } else {
          console.error('Login failed or canceled.');
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,instagram_manage_messages,business_management,instagram_basic',
      }
    );
  };

  const fetchUserDetails = (authResponse) => {
    const accessToken = authResponse.accessToken;
    const fbId = authResponse.userID;

    FB.api('/me', { fields: 'id,name,email' }, (userData) => {
      console.log('Facebook User Data:', userData);

      // Fetch Instagram ID and send data to backend
      fetchInstagramId(fbId, accessToken, userData);
    });
  };

  const fetchInstagramId = (fbId, accessToken, userData) => {
    const url = `https://graph.facebook.com/v14.0/${fbId}/accounts?fields=instagram_business_account&access_token=${accessToken}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let igId = null;

        if (data && data.data && data.data.length > 0) {
          const instagramAccount = data.data.find((acc) => acc.instagram_business_account);
          igId = instagramAccount?.instagram_business_account?.id || null;
        }

        if (igId) {
          console.log('Instagram ID found:', igId);
        } else {
          console.warn('No linked Instagram account found.');
        }

        // Send data to the backend
        handleBackendSetup(userData, accessToken, igId);
      })
      .catch((error) => {
        console.error('Error fetching Instagram ID:', error);
        alert('Unable to retrieve Instagram account. Please check your permissions.');
      });
  };

  const handleBackendSetup = async (userData, accessToken, igId) => {
    try {
      const platform = getPlatform();

      const payload = {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
        accessToken,
        igId,
        reconnect: true,
        platform,
        appId: 'milaVerse',
        businessName: userData.name,
        contactEmail: userData.email,
      };

      console.log('[DEBUG] Sending data to backend:', payload);

      const response = await fetch('https://nodejs-serverless-function-express-two-wine.vercel.app/setup-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[DEBUG] Backend error:', error);
        throw new Error('Failed to connect to backend');
      }

      const backendResponse = await response.json();
      console.log('[DEBUG] Backend Response:', backendResponse);

      if (backendResponse.reconnected) {
        alert('Successfully reconnected!');
      } else {
        alert('New connection established!');
      }

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('[DEBUG] Error connecting to backend:', error);
      alert('An error occurred while setting up your account. Please try again.');
    }
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
