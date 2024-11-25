import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v17.0',
      });
    };
  }, []);

  const handleLogin = () => {
    FB.login(function (response) {
      if (response.authResponse) {
        console.log('Logged in successfully:', response);
        // Handle login response
      } else {
        console.log('User cancelled login.');
      }
    }, { scope: 'public_profile,email,pages_show_list,instagram_manage_messages' });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Login to MilaVerse</h1>
      <button
        onClick={handleLogin}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Login with Facebook
      </button>
    </div>
  );
}
