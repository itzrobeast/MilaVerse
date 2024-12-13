/**
 * Sends the Facebook access token to the backend for validation.
 * @param {string} accessToken - The Facebook access token.
 * @returns {Object | null} - The validated token data or null if invalid.
 */
export const verifySession = async (accessToken) => {
  try {
    console.log('[DEBUG] Sending Facebook access token to backend for verification:', accessToken);

    if (!accessToken) {
      console.error('[ERROR] No access token provided.');
      return null;
    }

    const response = await fetch('/auth/verify-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: accessToken }),
      credentials: 'include', // Send cookies if needed
    });

    if (!response.ok) {
      throw new Error(`Session verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Session verified successfully:', data);
    return data; // Return validated session data
  } catch (error) {
    console.error('[ERROR] Session verification failed:', error.message);
    return null;
  }
};
