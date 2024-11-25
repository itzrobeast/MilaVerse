import { useEffect } from 'react';
import { apiFetch } from '../utils/api'; // Import the API utility

export default function Login() {
  useEffect(() => {
    // Initialize Facebook SDK when the component is mounted
    window.fbAsyncInit = function () {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Your Facebook App ID from environment variables
          cookie: true, // Enable cookies to allow server-side session tracking
          xfbml: true, // Parse social plugins on this page
          version: 'v21.0', // Use the latest Graph API version
        });
        console.log('Facebook SDK initialized.');
      } else {
        console.error('Facebook SDK not loaded.');
      }
    };

    // Load the Facebook SDK script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.body.appendChild(script);

    // Cleanup: Remove the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Facebook login
  const handleLogin = () => {
    if (typeof FB === 'undefined') {
      alert('Facebook SDK not loaded. Please try again later.');
      return;
    }

    FB.login(
      function (response) {
        if (response.authResponse) {
          console.log('Facebook Login Successful:', response);

          // Fetch user info from Facebook
          FB.api('/me', { fields: 'id,name,email' }, function (userData) {
            console.log('Facebook User Data:', userData);

            // Handle backend communication
            handleBackendSetup(userData, response.authResponse);
          });
        } else {
          console.log('User cancelled login or did not authorize.');
          alert('Facebook login was not completed. Please try again.');
        }
      },
      { scope: 'public_profile,email,pages_show_list,instagram_manage_messages' } // Required permissions
    );
  };

  // Async function to handle backend API calls
  const handleBackendSetup = async (userData, authResponse) => {
    try {
      // Send user data and access token to the backend
      const backendResponse = await apiFetch('/setup-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userData,
          accessToken: authResponse.accessToken,
          businessId: authResponse.userID,
        }),
      });

      console.log('Backend Response:', backendResponse);

      // Redirect to the dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error connecting to backend:', error);
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
