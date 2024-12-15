import Cookies from 'js-cookie';

/**
 * Verifies the user's session by checking cookies and contacting the backend.
 * @returns {Promise<Object|null>} - Returns user data if verification is successful, otherwise null.
 */
export const verifySession = async () => {
  try {
    const authToken = Cookies.get('authToken');
    const userId = parseInt(Cookies.get('userId'), 10);

    if (!authToken || isNaN(userId)) {
      throw new Error('Missing authentication cookies or invalid userId.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
      method: 'POST',
      credentials: 'include', // Ensure cookies are sent
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Session verification failed.');
    }

    const data = await response.json();
    console.log('[DEBUG] Session verified:', data);
    return data.user; // Return user data
  } catch (error) {
    console.error('[ERROR] Session verification failed:', error.message);
    return null;
  }
};
