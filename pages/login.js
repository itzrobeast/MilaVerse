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
    if (!window.fbAsyncInit) {
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
    }
  };

  const checkLoginStatus = () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('User already connected:', response);
        FB.api('/me', { fields: 'id,name,email' }, (userData) => {
          fetchPageAccessToken(response.authResponse.accessToken, userData);
        });
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
          FB.api(
            '/me',
            { fields: 'id,name,email' },
            (userData) => {
              fetchPageAccessToken(response.authResponse.accessToken, userData);
            }
          );
        } else {
          console.log('Login failed or canceled.');
        }
      },
      { scope: 'public_profile,email,pages_show_list,instagram_manage_messages' }
    );
  };

  const fetchPageAccessToken = (userAccessToken, userData) => {
    FB.api(
      '/me/accounts',
      { access_token: userAccessToken },
      (response) => {
        if (response && !response.error) {
          const pageAccessToken = response.data[0]?.access_token;
          const selectedPageId = response.data[0]?.id;

          if (pageAccessToken && selectedPageId) {
            console.log('Page Access Token:', pageAccessToken);
            console.log('Selected Page ID:', selectedPageId);
            localStorage.setItem('userId', userData.id); // Store userId
            handleBackendSetup(userData, userAccessToken, pageAccessToken, selectedPageId);
          } else {
            console.error('No page access token or page ID found.');
            alert('Please ensure your account has a connected business page.');
          }
        } else {
          console.error('Failed to fetch page access token:', response.error);
          alert('Failed to fetch page access token. Please check permissions.');
        }
      }
    );
  };

  const handleBackendSetup = async (userData, userAccessToken, pageAccessToken, selectedPageId) => {
    try {
      const platform = getPlatform();

      const payload = {
        user: userData,
        accessToken: userAccessToken,
        pageAccessToken,
        businessId: selectedPageId,
        reconnect: true,
        platform,
        pageId: selectedPageId,
        locations: [],
        appId: 'milaVerse',
        businessName: userData.name,
        ownerName: userData.name,
        contactEmail: userData.email,
      };

      console.log('[DEBUG] Sending data to backend:', payload);

      const response = await fetch('/setup-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
