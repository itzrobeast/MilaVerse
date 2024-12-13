import Cookies from 'js-cookie';
import fetch from 'isomorphic-fetch'; // Or the fetch API you're using

/**
 * Retrieves the authentication token from cookies.
 * @returns {string | undefined} The authentication token or undefined if not found.
 */
export const getAuthToken = () => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};



export const verifySession = async () => {
  try {
    const facebookAccessToken = localStorage.getItem('facebookAccessToken'); // Or where your token is stored
    if (!facebookAccessToken) {
      console.error('[ERROR] No access token found');
      return null; // No user session
    }

    const response = await fetch('/auth/verify-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${facebookAccessToken}`,
      },
      credentials: 'include', // Ensures cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error(`Session verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Session Verified:', data);
    return data.user; // Return the user object if session is valid
  } catch (error) {
    console.error('[ERROR] Verifying session:', error.message);
    return null; // Handle invalid or expired session
  }
};
