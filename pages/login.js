import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    // Ensure the Facebook SDK is loaded before attempting to use it
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not loaded.');
      return;
    }

    console.log('Facebook SDK is ready.');
    initializeFacebookSDK(); // Initialize SDK explicitly if needed
  }, []);

  const initializeFacebookSDK = () => {
    // Add fbAsyncInit only if not already initialized
    if (!window.fbAsyncInit) {
      window.fbAsyncInit = function () {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0', // Ensure this matches your app settings
        });

        console.log('Facebook SDK initialized globally.');
        checkLoginStatus(); // Trigger login status check after initialization
      };
    }
  };

  const checkLoginStatus = () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('User already connected:', response);
        FB.api('/me', { fields: 'id,name,email' }, (userData) => {
          handleBackendSetup(userData, response.authResponse);
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
            {
              fields: 'id,name,email',
              access_token: response.authResponse.accessToken, // Explicitly pass the access token
            },
            (userData) => {
              console.log('Facebook User Data:', userData);
              handleBackendSetup(userData, response.authResponse);
            }
          );
        } else {
          console.log('Login failed or canceled.');
        }
      },
      { scope: 'public_profile,email,pages_show_list,instagram_manage_messages' }
    );
  };

  const handleBackendSetup = async (userData, authResponse) => {
    try {
      const payload = {
        user: userData,
        accessToken: authResponse.accessToken,
        businessId: authResponse.userID,
        reconnect: true, // Include a flag for reconnection
      };

      console.log('[DEBUG] Sending data to backend:', payload);

      const response = await fetch(
        'https://nodejs-serverless-function-express-two-wine.vercel.app/setup-business',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('[DEBUG] Backend error:', error);
        throw new Error('Failed to connect to backend');
      }

      const backendResponse = await response.json();
      console.log('[DEBUG] Backend Response:', backendResponse);

      // Handle reconnection vs. new connection
      if (backendResponse.reconnected) {
        alert('Successfully reconnected!');
      } else {
        alert('New connection established!');
      }

      // Redirect to the dashboard
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
