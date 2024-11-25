import { useEffect } from 'react';
import { apiFetch } from '../utils/api'; // Import the API utility

export default function Login() {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v17.0',
      });
    };
  }, []);

  const handleLogin = () => {
    FB.login(
      async function (response) {
        if (response.authResponse) {
          console.log('Facebook Login Successful:', response);

          // Fetch user info from Facebook
          FB.api('/me', { fields: 'id,name,email' }, async function (userData) {
            console.log('Facebook User Data:', userData);

            try {
              // Send user data and access token to backend
              const backendResponse = await apiFetch('/setup-business', {
                method: 'POST',
                body: JSON.stringify({
                  user: userData,
                  accessToken: response.authResponse.accessToken,
                  businessId: response.authResponse.userID,
                }),
              });

              console.log('Backend Response:', backendResponse);

              // Redirect to the dashboard or show success message
              window.location.href = '/dashboard';
            } catch (error) {
              console.error('Error connecting to backend:', error);
              alert('An error occurred while setting up your account. Please try again.');
            }
          });
        } else {
          console.log('User cancelled login or did not authorize.');
          alert('Facebook login was not completed. Please try again.');
        }
      },
      { scope: 'public_profile,email,pages_show_list,instagram_manage_messages' }
    );
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
