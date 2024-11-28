import { useEffect } from 'react';
import { apiFetch } from '../utils/api';

export default function Login() {
  useEffect(() => {
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not loaded.');
      return;
    }

    console.log('Facebook SDK is ready.');
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
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
          FB.api('/me', { fields: 'id,name,email' }, (userData) => {
            handleBackendSetup(userData, response.authResponse);
          });
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
      };
      const backendResponse = await apiFetch('/setup-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Backend Response:', backendResponse);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Backend error:', error);
      alert('An error occurred. Please try again.');
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
