import Cookies from 'js-cookie';

/**
 * Verifies the user's session by checking cookies and contacting the backend.
 * @returns {Promise<Object|null>} - Returns user data if verification is successful, otherwise null.
 */
export const verifySession = async () => {
  try {
    // Retrieve cookies
    const authToken = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    console.log('[DEBUG] Verifying session with cookies:', { authToken, userId });

    // Validate cookie presence
    if (!authToken || !userId) {
      console.error('[ERROR] Missing authentication cookies.');
      throw new Error('Authentication required. Please log in again.');
    }

    // Send session verification request
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
      method: 'POST',
      credentials: 'include', // Include cookies with the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle response
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('[ERROR] Session verification failed:', errorMessage);
      throw new Error(errorMessage || 'Session verification failed.');
    }

    const data = await response.json();
    console.log('[DEBUG] Session verified successfully:', data);
    return data.user; // Return the verified user object
  } catch (error) {
    console.error('[ERROR] Session verification encountered an error:', error.message);
    return null; // Return null on failure
  }
};
