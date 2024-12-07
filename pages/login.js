import { useEffect } from 'react';
import { getPlatform } from '../utils/platform';

export default function Login() {
  // Initialize Facebook SDK
  useEffect(() => {
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not loaded.');
      return;
    }

    console.log('Facebook SDK is ready.');
    initializeFacebookSDK();
  }, []);

  // Facebook SDK initialization
  const initializeFacebookSDK = () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Ensure this is set in your environment variables
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });

      console.log('Facebook SDK initialized globally.');
      checkLoginStatus();
    };
  };

  // Check Facebook login status
  const checkLoginStatus = () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('User already connected:', response);
        localStorage.setItem('authToken', response.authResponse.accessToken); // Store token here
        fetchUserDetails(response.authResponse);
      } else {
        console.log('User not connected.');
      }
    });
  };

  // Handle Facebook login button click
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
    scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_messages,business_management' 
  }
);

// Function to send the token to your backend
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



  // Fetch user details using Facebook API
  const fetchUserDetails = (authResponse) => {
    const accessToken = authResponse.accessToken;
    const fbId = authResponse.userID;

    FB.api('/me', { fields: 'id,name,email' }, (userData) => {
      console.log('Facebook User Data:', userData);

      // Fetch Facebook Page ID
      fetchPageId(accessToken)
        .then((pageData) => {
          if (!pageData) {
            alert('No pages found for this user. Please ensure a Facebook page is connected.');
            return;
          }

          const { pageId, pageAccessToken } = pageData;

          // Fetch Instagram ID and send data to backend
          fetchInstagramId(fbId, pageAccessToken, userData, pageId);
        })
        .catch((error) => {
          console.error('Error fetching page ID:', error);
          alert('Unable to retrieve Facebook page. Please check your permissions.');
        });
    });
  };

  // Fetch Page ID using Facebook Graph API
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

  // Fetch Instagram ID using Facebook Graph API and send to backend
  const fetchInstagramId = (fbId, pageAccessToken, userData, pageId) => {
    const url = `https://graph.facebook.com/v14.0/${fbId}/accounts?fields=instagram_business_account&access_token=${pageAccessToken}`;

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
        handleBackendSetup(userData, pageAccessToken, igId, pageId);
      })
      .catch((error) => {
        console.error('Error fetching Instagram ID:', error);
        alert('Unable to retrieve Instagram account. Please check your permissions.');
      });
  };

  // Send data to the backend to set up the user and business
  const handleBackendSetup = async (userData, accessToken, igId, pageId) => {
    try {
      const platform = getPlatform(); // Utility to detect the platform (Web/Mobile/Tablet)

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
        appId: 'milaVerse', // Custom app identifier
        businessName: userData.name,
        contactEmail: userData.email,
        pageId, // Include the page ID
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

      // Redirect to the dashboard after success
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
